package de.nevbie.whatsfordinner.core

import kotlin.math.max
import kotlin.math.min

/** Port of src/logic/combos.ts – the six meal builders. */
data class ComboSlot(val key: String, val roles: List<String>)

data class ComboEntry(val slot: ComboSlot, val dishId: String? = null, val locked: Boolean = false)

data class ComboOptions(
    /** chinese | indian | tapas | abendbrot | teller | salad */
    val type: String,
    val adults: Int,
    val kids: Int,
    val diet: String = "any",
    val noSpicy: Boolean = false,
    val drink: Boolean = false,
    val dessert: Boolean = false,
    val kidsFav: Boolean = false,
    val quick: Boolean = false,
    val favs: Boolean = false,
    /** own composition: number of slots per group key (see COMPOSE_GROUPS) */
    val counts: Map<String, Int>? = null,
)

class PickContext(
    val options: ComboOptions,
    val favorites: Set<String>,
    val prefer: Set<String> = emptySet(),
    val avoid: Set<String> = emptySet(),
)

object Combos {
    val COMBO_TYPES = listOf("chinese", "indian", "tapas", "abendbrot", "teller", "salad")
    val ICONS = mapOf("chinese" to "🥢", "indian" to "🍛", "tapas" to "🫒", "abendbrot" to "🥨", "teller" to "🍽", "salad" to "🥗")

    private val PROTEIN = listOf("meat", "fish", "tofu")

    /** JavaScript Math.round (halves round up). */
    private fun jsRound(x: Double): Int = kotlin.math.floor(x + 0.5).toInt()

    fun chineseDishCount(adults: Int, kids: Int): Int = max(2, min(6, jsRound(adults + kids * 0.5)))

    fun tapasCount(adults: Int, kids: Int): Int = max(4, min(7, jsRound(adults + kids * 0.5) + 2))

    private val TAPA_COURSES = setOf("tapaVeg", "tapaMeat", "tapaFish", "tapaBread")
    private val ABENDBROT_COURSES = setOf("abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra")
    private val TELLER_COURSES = setOf("plMain", "plStarch", "plVeg")
    private val SALAD_COURSES = setOf("slBase", "slExtra", "slTopping", "slDressing")

    /** Which builder a dish belongs to. */
    fun comboTypeOfDish(d: Dish): String? {
        val c = d.course
        if (c != null && c in TAPA_COURSES) return "tapas"
        if (c != null && c in ABENDBROT_COURSES) return "abendbrot"
        if (c != null && c in TELLER_COURSES) return "teller"
        if (c != null && c in SALAD_COURSES) return "salad"
        if (d.cuisine == "chinese" || d.cuisine == "indian") return d.cuisine
        return null
    }

    /** Builder of a dish incl. the "(diverse)" combo entries. */
    fun comboTypeOf(d: Dish): String? = if (d.kind == Kind.COMBO) d.combo else comboTypeOfDish(d)

    private fun s(key: String, vararg roles: String) = ComboSlot(key, roles.toList())

    /** Groups the family can count when changing a builder's composition. */
    val COMPOSE_GROUPS: Map<String, List<ComboSlot>> = mapOf(
        "chinese" to listOf(
            s("main", "meat", "fish", "tofu"), s("meat", "meat"), s("fish", "fish"), s("tofu", "tofu"), s("veg", "veg", "egg"),
            s("egg", "egg"), s("soup", "soup", "cold"), s("cold", "cold"), s("meal", "meal"), s("staple", "staple"),
        ),
        "indian" to listOf(
            s("dal", "dal"), s("curry", "curry"), s("sabzi", "sabzi"), s("raita", "raita"), s("chutney", "chutney"), s("salad", "salad"),
            s("side", "chutney", "salad", "side"), s("snack", "snack"), s("meal", "meal"), s("bread", "bread"), s("rice", "rice"),
            s("drink", "drink"), s("dessert", "dessert"),
        ),
        "tapas" to listOf(s("tapaVeg", "tapaVeg"), s("tapaMeat", "tapaMeat"), s("tapaFish", "tapaFish"), s("tapaBread", "tapaBread")),
        "abendbrot" to listOf(
            s("abBread", "abBread"), s("abCheese", "abCheese"), s("abMeat", "abMeat", "abFish"), s("abFish", "abFish"),
            s("abSpread", "abSpread"), s("abVeg", "abVeg"), s("abExtra", "abExtra"), s("abMore", "abMeat", "abFish", "abCheese"),
        ),
        "teller" to listOf(s("plMain", "plMain"), s("plStarch", "plStarch"), s("plVeg", "plVeg")),
        "salad" to listOf(s("slBase", "slBase"), s("slExtra", "slExtra"), s("slTopping", "slTopping"), s("slDressing", "slDressing")),
    )

    /** All roles a builder knows (for an "extra" slot). */
    val ALL_COURSES: Map<String, List<String>> = mapOf(
        "tapas" to listOf("tapaVeg", "tapaMeat", "tapaFish", "tapaBread"),
        "abendbrot" to listOf("abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra"),
        "teller" to listOf("plStarch", "plVeg"),
        "salad" to listOf("slExtra", "slTopping", "slDressing"),
        "chinese" to listOf("meat", "fish", "tofu", "egg", "veg", "cold", "soup", "staple", "meal"),
        "indian" to listOf("curry", "dal", "sabzi", "raita", "chutney", "salad", "side", "bread", "rice", "drink", "dessert", "snack", "meal"),
    )

    /** Group key of a default slot key ('veg2' → 'veg'). */
    fun groupKeyOf(slotKey: String): String = slotKey.replace(Regex("\\d+$"), "")

    /** The default composition as counts per group (for the composition editor). */
    fun defaultCounts(o: ComboOptions): Map<String, Int> {
        val counts = LinkedHashMap<String, Int>()
        for (sl in comboSlots(o.copy(counts = null))) counts[groupKeyOf(sl.key)] = (counts[groupKeyOf(sl.key)] ?: 0) + 1
        return counts
    }

    fun comboSlots(o: ComboOptions, seed: Dish? = null): List<ComboSlot> {
        val counts = o.counts
        if (counts != null && seed?.course != "meal") {
            return COMPOSE_GROUPS.getValue(o.type).flatMap { g ->
                (0 until (counts[g.key] ?: 0)).map { i -> ComboSlot(if (i == 0) g.key else "${g.key}${i + 1}", g.roles) }
            }
        }
        if (seed?.course == "meal") {
            return if (o.type == "chinese") listOf(s("meal", "meal"), s("side", "cold", "soup"))
            else listOf(s("meal", "meal"), s("raita", "raita"), s("side", "chutney", "salad", "side"))
        }
        when (o.type) {
            "teller" -> return listOf(s("plMain", "plMain"), s("plStarch", "plStarch"), s("plVeg", "plVeg"))
            "salad" -> return listOf(s("slBase", "slBase"), s("slExtra", "slExtra"), s("slExtra2", "slExtra"), s("slTopping", "slTopping"), s("slDressing", "slDressing"))
            "abendbrot" -> {
                val veg = o.diet != "any"
                val slots = mutableListOf(
                    s("abBread", "abBread"),
                    s("abCheese", "abCheese"),
                    if (veg) s("abSpread2", "abSpread", "abCheese") else s("abMeat", "abMeat", "abFish"),
                    s("abSpread", "abSpread"),
                    s("abVeg", "abVeg"),
                    s("abExtra", "abExtra"),
                )
                if (o.adults + o.kids >= 5) slots.add(1, s("abBread2", "abBread"))
                if (o.adults + o.kids >= 6) slots.add(if (veg) s("abMore", "abCheese", "abSpread") else s("abMore", "abMeat", "abFish", "abCheese"))
                return slots
            }
            "tapas" -> {
                val slots = mutableListOf(s("tapaVeg", "tapaVeg"), s("tapaMeat", "tapaMeat"), s("tapaFish", "tapaFish"), s("tapaBread", "tapaBread"))
                val more = listOf(s("tapaVeg2", "tapaVeg"), s("tapaMeat2", "tapaMeat"), s("tapaFish2", "tapaFish", "tapaVeg"))
                val n = tapasCount(o.adults, o.kids)
                for (m in more) if (slots.size < n) slots.add(m)
                return slots
            }
            "chinese" -> {
                val slots = mutableListOf(ComboSlot("main", PROTEIN), s("veg", "veg", "egg"))
                val more = listOf(s("soup", "soup", "cold"), s("veg2", "veg", "egg", "tofu"), ComboSlot("main2", PROTEIN), s("cold", "cold", "soup"))
                val n = chineseDishCount(o.adults, o.kids)
                for (m in more) if (slots.size < n) slots.add(m)
                slots.add(s("staple", "staple"))
                return slots
            }
        }
        // indian thali
        val slots = mutableListOf(s("dal", "dal"), s("curry", "curry"), s("sabzi", "sabzi"))
        if (o.adults + o.kids >= 6) slots.add(s("curry2", "curry"))
        slots.add(if (o.kids > 0) s("raita", "raita") else s("raita", "raita", "chutney", "salad"))
        slots.add(s("side", "chutney", "salad", "side"))
        slots.add(s("bread", "bread"))
        slots.add(s("rice", "rice"))
        if (o.drink) slots.add(s("drink", "drink"))
        if (o.dessert) slots.add(s("dessert", "dessert"))
        return slots
    }

    fun initialEntries(o: ComboOptions, seed: Dish? = null): List<ComboEntry> {
        val slots = comboSlots(o, seed)
        val entries = slots.map { ComboEntry(it) }.toMutableList()
        if (seed != null) {
            val i = slots.indexOfFirst { seed.course != null && seed.course in it.roles }
            if (i >= 0) entries[i] = ComboEntry(slots[i], seed.id, true)
        }
        return entries
    }

    /** Dishes counted as staples don't take part in the "same main ingredient" rule. */
    private val STAPLE_ROLES = setOf("staple", "bread", "rice", "drink")

    private fun mainIngredient(d: Dish): String? = if (d.course != null && d.course in STAPLE_ROLES) null else d.ingredients.firstOrNull()

    /** Preferred defaults: plain rice / roti appear most often. */
    private val DEFAULT_BOOST = mapOf("mifan" to 5.0, "basmati" to 3.0, "roti" to 3.0, "raita" to 2.0)

    private fun weighted(cands: List<Dish>, ctx: PickContext, rng: Rng): Dish? {
        if (cands.isEmpty()) return null
        val ws = cands.map { d ->
            var w = DEFAULT_BOOST[d.id] ?: 1.0
            if (d.id in ctx.favorites) w *= 2
            // a plate follows the classic pairings much more strictly
            if (d.id in ctx.prefer) w *= if (ctx.options.type == "teller") 25 else 5
            if (d.effort == 3) w *= 0.4
            if (d.id in ctx.avoid) w *= 0.1
            w
        }
        var r = rng() * ws.sum()
        for (i in cands.indices) {
            r -= ws[i]
            if (r < 0) return cands[i]
        }
        return cands.last()
    }

    /** Candidate dishes for a slot, before the "fits with the others" rules. */
    fun slotCandidates(slot: ComboSlot, pool: List<Dish>, o: ComboOptions): List<Dish> = pool.filter { d ->
        comboTypeOfDish(d) == o.type && d.course != null && d.course in slot.roles &&
            FilterLogic.matchesDiet(d, o.diet, kids = false, noSpicy = o.noSpicy, maxEffort = 3)
    }

    fun pickForSlot(slot: ComboSlot, chosen: List<Dish>, pool: List<Dish>, ctx: PickContext, rng: Rng): Dish? {
        val o = ctx.options
        val taken = chosen.map { it.id }.toSet()
        val groups = chosen.mapNotNull { it.group }.toSet()
        val mains = chosen.mapNotNull { mainIngredient(it) }.toSet()
        val spicyCount = chosen.count { it.has("spicy") }
        val base = slotCandidates(slot, pool, o).filter { it.id !in taken && !(it.group != null && it.group in groups) }

        val distinctMain = { d: Dish -> val m = mainIngredient(d); m == null || m !in mains }
        // With kids at the table, at most one spicy dish.
        val spiceOk = { d: Dish -> o.kids == 0 || !d.has("spicy") || spicyCount == 0 }
        // soft filters: used when the slot has a match
        val soft = { d: Dish -> (!o.kidsFav || d.has("kids")) && (!o.quick || d.effort == 1) && (!o.favs || d.id in ctx.favorites) }
        val preferred = base.filter(soft)
        return weighted(preferred.filter { distinctMain(it) && spiceOk(it) }, ctx, rng)
            ?: weighted(preferred.filter(spiceOk), ctx, rng)
            ?: weighted(base.filter { distinctMain(it) && spiceOk(it) }, ctx, rng)
            ?: weighted(base.filter(spiceOk), ctx, rng)
            ?: weighted(base, ctx, rng)
    }

    /** Fill every unlocked entry (in order) with a fitting dish. */
    fun fillEntries(entries: List<ComboEntry>, pool: List<Dish>, ctx: PickContext, rng: Rng = defaultRng): List<ComboEntry> {
        val byId = pool.associateBy { it.id }
        val result = entries.map { if (it.locked) it else it.copy(dishId = null) }.toMutableList()
        for (i in result.indices) {
            if (result[i].locked && result[i].dishId != null) continue
            val chosen = result.mapNotNull { e -> e.dishId?.let { byId[it] } }
            result[i] = result[i].copy(dishId = pickForSlot(result[i].slot, chosen, pool, ctx, rng)?.id)
        }
        return result
    }

    /** Re-pick one entry, keeping all others. */
    fun rerollEntry(entries: List<ComboEntry>, index: Int, pool: List<Dish>, ctx: PickContext, rng: Rng = defaultRng): List<ComboEntry> {
        val byId = pool.associateBy { it.id }
        val current = entries[index].dishId
        val others = entries.filterIndexed { i, _ -> i != index }.mapNotNull { e -> e.dishId?.let { byId[it] } }
        val withoutCurrent = pool.filter { it.id != current }
        val next = pickForSlot(entries[index].slot, others, withoutCurrent, ctx, rng)?.id ?: current
        return entries.mapIndexed { i, e -> if (i == index) e.copy(dishId = next, locked = false) else e }
    }

    /** Slot keys with their own text in strings.json (slot.<key>). */
    val SLOT_KEYS = setOf(
        "main", "main2", "veg", "veg2", "soup", "cold", "staple", "meal", "side", "dal", "curry", "curry2", "sabzi", "raita", "bread", "rice",
        "drink", "dessert", "tapaVeg", "tapaVeg2", "tapaMeat", "tapaMeat2", "tapaFish", "tapaFish2", "tapaBread", "abBread", "abBread2",
        "abCheese", "abMeat", "abSpread", "abSpread2", "abVeg", "abExtra", "abMore", "plMain", "plStarch", "plVeg", "slBase", "slExtra",
        "slExtra2", "slTopping", "slDressing",
    )

    /** Display label of a slot (same rules as the web ComboBuilder). */
    fun slotLabel(i18n: I18n, combo: String, key: String): String {
        val k = if (key in SLOT_KEYS) key else groupKeyOf(key)
        if (k in SLOT_KEYS) return i18n.t("slot.$k")
        val group = COMPOSE_GROUPS[combo]?.find { it.key == k }
        if (group != null && group.roles.size == 1) return i18n.course(group.roles[0]).replace(Regex("^[^:]*: "), "")
        return i18n.t("slot.extra")
    }

    /**
     * Entries for re-opening a day that already holds a combo of this cuisine (start from what
     * is planned), or null when nothing fitting is planned.
     */
    fun entriesFromPlanned(combo: String, plannedIds: List<String>?, byId: Map<String, Dish>): List<ComboEntry>? {
        val planned = plannedIds?.mapNotNull { byId[it] }?.filter { comboTypeOfDish(it) == combo && it.course != null } ?: return null
        if (planned.isEmpty()) return null
        return planned.map { d ->
            val key = COMPOSE_GROUPS.getValue(combo).find { d.course in it.roles }?.key ?: "extra"
            ComboEntry(ComboSlot(key, listOf(d.course!!)), d.id, true)
        }
    }

    /** Keep what the family locked, rebuild the rest for new options. */
    fun rebuildKeepingLocked(old: List<ComboEntry>, o: ComboOptions, seed: Dish?): List<ComboEntry> {
        val locked = old.filter { it.locked && it.dishId != null }
        val fresh = initialEntries(o, seed).toMutableList()
        for (l in locked) {
            val i = fresh.indexOfFirst { f -> f.dishId == null && l.slot.roles.any { it in f.slot.roles } }
            if (i >= 0) fresh[i] = fresh[i].copy(dishId = l.dishId, locked = true)
        }
        return fresh
    }

    /** Slot for "add a dish" in the builder: a compose group or an extra slot with all roles. */
    fun slotForGroup(combo: String, groupKey: String): ComboSlot {
        val g = COMPOSE_GROUPS[combo]?.find { it.key == groupKey }
        return g ?: ComboSlot("extra", ALL_COURSES[combo] ?: emptyList())
    }
}
