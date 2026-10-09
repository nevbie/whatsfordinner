package de.nevbie.whatsfordinner.core

import kotlinx.serialization.KSerializer
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import java.security.SecureRandom

/** Partial settings update (settings.<key> in Firestore). Null fields are left unchanged. */
data class SettingsPatch(
    val adults: Int? = null,
    val kids: Int? = null,
    val avoidDays: Int? = null,
    val builderCounts: Map<String, Map<String, Int>>? = null,
)

/**
 * One write to the family state. The local backend applies it with [apply]; the Firebase
 * backend turns it into the same field-level update as src/store/firebase.ts.
 */
sealed interface Change {
    /** entry == null or an empty entry (see [StateOps.keepEntry]) deletes plan.<date> */
    data class SetDay(val date: String, val entry: DayEntry?) : Change
    data class SetFavorite(val id: String, val on: Boolean) : Change
    data class SaveDish(val dish: Dish) : Change
    data class DeleteDish(val id: String) : Change
    data class UpdateSettings(val patch: SettingsPatch) : Change
    data class SaveParty(val party: Party) : Change
    data class DeleteParty(val id: String) : Change
    data class SaveLabels(val labels: List<FavLabel>) : Change
    data class DeleteLabel(val id: String, val remaining: List<FavLabel>) : Change
    data class SetLabelFavorite(val labelId: String, val dishId: String, val on: Boolean) : Change
    data class SetLabelDislike(val labelId: String, val dishId: String, val on: Boolean) : Change
    data class SetHidden(val dishId: String, val on: Boolean) : Change
}

object StateOps {
    /** A day entry is kept when it has dishes, is marked as done or has labels. */
    fun keepEntry(entry: DayEntry?): Boolean =
        entry != null && (dayDishIds(entry).isNotEmpty() || entry.isDone || !entry.labels.isNullOrEmpty())

    private fun <T> field(obj: JsonObject, key: String, ser: KSerializer<T>, fallback: T): T {
        val e = obj[key] ?: return fallback
        return try {
            AppJson.decodeFromJsonElement(ser, e)
        } catch (ex: Exception) {
            fallback
        }
    }

    /** Map field where broken single entries are skipped instead of losing everything. */
    private fun <T> mapField(obj: JsonObject, key: String, ser: KSerializer<T>): Map<String, T> {
        val e = obj[key] as? JsonObject ?: return emptyMap()
        val out = LinkedHashMap<String, T>()
        for ((k, v) in e) runCatching { AppJson.decodeFromJsonElement(ser, v) }.getOrNull()?.let { out[k] = it }
        return out
    }

    /** Fill in missing fields of state coming from storage (port of backend.ts normalize). */
    fun normalize(raw: JsonElement?): FamilyState {
        val obj = raw as? JsonObject ?: return emptyState()
        val strList = ListSerializer(String.serializer())
        return FamilyState(
            favorites = field(obj, "favorites", strList, emptyList()),
            plan = mapField(obj, "plan", DayEntry.serializer()),
            customDishes = mapField(obj, "customDishes", Dish.serializer()),
            settings = field(obj, "settings", FamilySettings.serializer(), FamilySettings()),
            parties = mapField(obj, "parties", Party.serializer()),
            labels = field(obj, "labels", ListSerializer(FavLabel.serializer()), emptyList()),
            labelFavorites = field(obj, "labelFavorites", MapSerializer(String.serializer(), strList), emptyMap()),
            labelDislikes = field(obj, "labelDislikes", MapSerializer(String.serializer(), strList), emptyMap()),
            hiddenDishes = field(obj, "hiddenDishes", strList, emptyList()),
        )
    }

    fun parseState(json: String?): FamilyState =
        if (json.isNullOrBlank()) emptyState() else runCatching { normalize(AppJson.parseToJsonElement(json)) }.getOrElse { emptyState() }

    fun encodeState(state: FamilyState): String = AppJson.encodeToString(FamilyState.serializer(), state)

    private fun List<String>.withItem(id: String, on: Boolean) = if (on) (this + id).distinct() else filter { it != id }

    /** Apply one change locally – same semantics as src/store/local.ts. */
    fun apply(s: FamilyState, c: Change): FamilyState = when (c) {
        is Change.SetDay -> s.copy(plan = if (keepEntry(c.entry)) s.plan + (c.date to c.entry!!) else s.plan - c.date)
        is Change.SetFavorite -> s.copy(favorites = s.favorites.withItem(c.id, c.on))
        is Change.SaveDish -> s.copy(customDishes = s.customDishes + (c.dish.id to c.dish))
        is Change.DeleteDish -> s.copy(customDishes = s.customDishes - c.id)
        is Change.UpdateSettings -> s.copy(
            settings = s.settings.copy(
                adults = c.patch.adults ?: s.settings.adults,
                kids = c.patch.kids ?: s.settings.kids,
                avoidDays = c.patch.avoidDays ?: s.settings.avoidDays,
                builderCounts = c.patch.builderCounts ?: s.settings.builderCounts,
            ),
        )
        is Change.SaveParty -> s.copy(parties = s.parties + (c.party.id to c.party))
        is Change.DeleteParty -> s.copy(parties = s.parties - c.id)
        is Change.SaveLabels -> s.copy(labels = c.labels)
        is Change.DeleteLabel -> s.copy(labels = c.remaining, labelFavorites = s.labelFavorites - c.id, labelDislikes = s.labelDislikes - c.id)
        is Change.SetLabelFavorite -> s.copy(labelFavorites = s.labelFavorites + (c.labelId to (s.labelFavorites[c.labelId] ?: emptyList()).withItem(c.dishId, c.on)))
        is Change.SetLabelDislike -> s.copy(labelDislikes = s.labelDislikes + (c.labelId to (s.labelDislikes[c.labelId] ?: emptyList()).withItem(c.dishId, c.on)))
        is Change.SetHidden -> s.copy(hiddenDishes = s.hiddenDishes.withItem(c.dishId, c.on))
    }

    // ---- store helpers (StoreContext.tsx) ----

    /** Replace the dishes of one meal of a day, keeping the other meals. */
    fun withMeal(state: FamilyState, date: String, meal: String, ids: List<String>): DayEntry {
        val entry = state.plan[date] ?: DayEntry()
        if (meal == "dinner") return entry.copy(dishes = ids)
        val meals = (entry.meals ?: emptyMap()).toMutableMap()
        if (ids.isNotEmpty()) meals[meal] = ids else meals.remove(meal)
        return entry.copy(meals = meals)
    }

    /** New label with the first free colour. */
    fun newLabel(state: FamilyState, name: String): FavLabel {
        val used = state.labels.map { it.color }.toSet()
        val color = (0..7).firstOrNull { it !in used } ?: (state.labels.size % 8)
        return FavLabel(id = "l-${System.currentTimeMillis().toString(36)}", name = name, color = color)
    }

    /** A person can't love and dislike the same dish: setting one clears the other. */
    fun toggleLabelFavorite(state: FamilyState, labelId: String, dishId: String): List<Change> {
        val on = dishId !in (state.labelFavorites[labelId] ?: emptyList())
        val out = mutableListOf<Change>()
        if (on && dishId in (state.labelDislikes[labelId] ?: emptyList())) out.add(Change.SetLabelDislike(labelId, dishId, false))
        out.add(Change.SetLabelFavorite(labelId, dishId, on))
        return out
    }

    fun toggleLabelDislike(state: FamilyState, labelId: String, dishId: String): List<Change> {
        val on = dishId !in (state.labelDislikes[labelId] ?: emptyList())
        val out = mutableListOf<Change>()
        if (on && dishId in (state.labelFavorites[labelId] ?: emptyList())) out.add(Change.SetLabelFavorite(labelId, dishId, false))
        out.add(Change.SetLabelDislike(labelId, dishId, on))
        return out
    }

    /** Toggle a day marker ('out', 'event', 'away:<labelId>' or free text). */
    fun toggleDayLabel(state: FamilyState, date: String, label: String): DayEntry {
        val entry = state.plan[date] ?: DayEntry()
        val labels = entry.labels ?: emptyList()
        val next = if (label in labels) labels - label else labels + label
        return entry.copy(labels = next.ifEmpty { null })
    }

    /** Remove one dish of a meal; empties the day when nothing is left (PlanView.removeDish). */
    fun removeDish(state: FamilyState, date: String, meal: String, index: Int): DayEntry? {
        val entry = state.plan[date]
        val next = mealIds(entry, meal).filterIndexed { i, _ -> i != index }
        if (next.isEmpty() && dayDishIds(entry).size <= 1 && entry?.isDone != true) return null
        return withMeal(state, date, meal, next)
    }
}

/** Family code helpers – same alphabet and format as src/store/firebase.ts. */
object FamilyCode {
    const val ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    private val random = SecureRandom()

    fun newCode(): String {
        val bytes = ByteArray(12).also { random.nextBytes(it) }
        val chars = bytes.map { ALPHABET[(it.toInt() and 0xff) % ALPHABET.length] }.joinToString("")
        return "${chars.substring(0, 4)}-${chars.substring(4, 8)}-${chars.substring(8)}"
    }

    /** Normalise user input ("abcd efgh-jkmn") to the stored form. */
    fun clean(code: String): String {
        val c = code.uppercase().replace(Regex("[^A-Z0-9]"), "")
        return if (c.length == 12) "${c.substring(0, 4)}-${c.substring(4, 8)}-${c.substring(8)}" else c
    }

    /** Firestore document id: the code without dashes. */
    fun docId(code: String): String = clean(code).replace("-", "")
}
