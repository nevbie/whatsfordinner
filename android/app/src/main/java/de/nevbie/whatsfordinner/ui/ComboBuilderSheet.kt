package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.ALL_MEALS
import de.nevbie.whatsfordinner.core.ComboEntry
import de.nevbie.whatsfordinner.core.ComboOptions
import de.nevbie.whatsfordinner.core.Combos
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.PickContext
import de.nevbie.whatsfordinner.core.SettingsPatch
import de.nevbie.whatsfordinner.core.defaultRng
import de.nevbie.whatsfordinner.core.mealIds

private val INTRO = mapOf(
    "chinese" to "combo.introChinese", "indian" to "combo.introIndian", "tapas" to "combo.introTapas",
    "abendbrot" to "combo.introAbendbrot", "teller" to "combo.introTeller", "salad" to "combo.introSalad",
)

/** Meal builder for all six builders (ComboBuilder.tsx). */
@Composable
fun ComboBuilderSheet(o: Overlay.Combo) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val combo = o.combo
    val date = o.date
    var meal by remember { mutableStateOf(o.meal ?: "dinner") }
    var composing by remember { mutableStateOf(false) }
    val savedCounts = store.state.settings.builderCounts?.get(combo)
    val seed = remember { o.seedId?.let { store.dishById[it] } }
    val favorites = store.state.favorites.toSet()
    val disliked = store.state.labelDislikes.values.flatten().toSet()

    var options by remember {
        mutableStateOf(
            ComboOptions(type = combo, adults = store.state.settings.adults, kids = store.state.settings.kids, counts = store.state.settings.builderCounts?.get(combo)),
        )
    }
    fun ctx(op: ComboOptions) = PickContext(op, favorites, seed?.pairsWith.orEmpty().toSet(), disliked)
    var entries by remember {
        // re-open a day that already holds a combo of this cuisine: start from what is planned
        val planned = if (date != null && seed == null) Combos.entriesFromPlanned(combo, mealIds(store.state.plan[date], meal), store.dishById) else null
        mutableStateOf(planned ?: Combos.fillEntries(Combos.initialEntries(options, seed), store.dishes, ctx(options)))
    }

    fun change(op: ComboOptions) {
        options = op
        // keep what the family locked, rebuild the rest for the new settings
        entries = Combos.fillEntries(Combos.rebuildKeepingLocked(entries, op, seed), store.dishes, ctx(op))
    }

    fun update(idx: Int, e: ComboEntry) {
        entries = entries.mapIndexed { j, x -> if (j == idx) e else x }
    }

    fun choose(idx: Int) {
        val slot = entries[idx].slot
        val allowed = Combos.slotCandidates(slot, store.dishes, options.copy(diet = "any", noSpicy = false)).map { it.id }.toSet()
        ui.launch {
            val id = ui.pickDish(i.t("combo.pick")) { it.id in allowed } ?: return@launch
            if (idx < entries.size) update(idx, entries[idx].copy(dishId = id, locked = true))
        }
    }

    fun addSlot(groupKey: String) {
        val slot = Combos.slotForGroup(combo, groupKey)
        val chosen = entries.mapNotNull { e -> e.dishId?.let { store.dishById[it] } }
        val dish = Combos.pickForSlot(slot, chosen, store.dishes, ctx(options), defaultRng)
        entries = entries + ComboEntry(slot, dish?.id, false)
    }

    fun plan() = ui.launch {
        val target = date ?: ui.pickDay() ?: return@launch
        store.setMeal(target, meal, entries.mapNotNull { it.dishId })
        ui.remove(o)
    }

    fun slotLabel(key: String) = Combos.slotLabel(i, combo, key)
    val counts = options.counts ?: Combos.defaultCounts(options)

    SheetFrame(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("${comboIcon(combo)} ${i.t("combo.$combo")}", fontWeight = FontWeight.SemiBold, fontSize = 17.sp)
                if (date != null) Muted(" · ${Format.day(date, i.lang)}")
            }
        },
        onClose = { ui.remove(o) },
        tall = true,
        footer = {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SecondaryButton("🎲 ${i.t("combo.shuffle")}", small = true) { entries = Combos.fillEntries(entries, store.dishes, ctx(options)) }
                Select(i.t("meal.short.$meal"), ALL_MEALS.map { it to i.t("meal.$it") }, asPill = true) { meal = it }
                PrimaryButton(if (date != null) i.t("combo.plan") else i.t("suggest.plan"), Modifier.weight(1f)) { plan() }
            }
        },
    ) {
        item {
            Row(verticalAlignment = Alignment.Top) {
                Muted(i.t(INTRO.getValue(combo)), Modifier.weight(1f))
                HSpace(6.dp)
                Pill("⚙︎ ${i.t("builder.compose")}" + if (savedCounts != null) " •" else "", composing) { composing = !composing }
            }
        }
        if (composing) item {
            Card {
                Combos.COMPOSE_GROUPS.getValue(combo).forEach { g ->
                    Stepper(slotLabel(g.key), counts[g.key] ?: 0, 0, 6) { n -> change(options.copy(counts = counts + (g.key to n))) }
                }
                VSpace(8.dp)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    SecondaryButton(i.t("builder.resetDefault"), enabled = savedCounts != null || options.counts != null, small = true) {
                        store.updateSettings(SettingsPatch(builderCounts = (store.state.settings.builderCounts ?: emptyMap()) - combo))
                        change(options.copy(counts = null))
                    }
                    PrimaryButton(i.t("builder.saveDefault"), small = true) {
                        store.updateSettings(SettingsPatch(builderCounts = (store.state.settings.builderCounts ?: emptyMap()) + (combo to counts)))
                        composing = false
                    }
                }
            }
        }
        item {
            FieldLabel(i.t("builder.prefer"))
            Chips {
                Pill("🧒 ${i.t("filter.kids")}", options.kidsFav) { change(options.copy(kidsFav = !options.kidsFav)) }
                Pill("⏱ ${i.t("filter.quick")}", options.quick) { change(options.copy(quick = !options.quick)) }
                Pill("♥ ${i.t("filter.favoritesShort")}", options.favs) { change(options.copy(favs = !options.favs)) }
            }
        }
        if (combo != "teller" && combo != "salad") item {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Stepper(i.t("combo.adults"), options.adults, 1, 8) { change(options.copy(adults = it)) }
                Stepper(i.t("combo.kids"), options.kids, 0, 8) { change(options.copy(kids = it)) }
                Segmented(listOf("any" to i.t("filter.diet.any"), "veggie" to i.t("filter.diet.veggie"), "vegan" to i.t("filter.diet.vegan")), options.diet) {
                    change(options.copy(diet = it))
                }
                Chips {
                    Pill(i.t("filter.noSpicy"), options.noSpicy) { change(options.copy(noSpicy = !options.noSpicy)) }
                    if (combo == "indian") {
                        Pill("🥭 ${i.t("combo.drink")}", options.drink) { change(options.copy(drink = !options.drink)) }
                        Pill("🍮 ${i.t("combo.dessert")}", options.dessert) { change(options.copy(dessert = !options.dessert)) }
                    }
                }
            }
        }
        itemsIndexed(entries) { idx, e ->
            val d = e.dishId?.let { store.dishById[it] }
            Card(padding = PaddingValues(horizontal = 12.dp, vertical = 8.dp), borderColor = if (e.locked) c.highlight else null) {
                Text(slotLabel(e.slot.key).uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = c.muted)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (d != null) {
                        Column(Modifier.weight(1f)) {
                            DishNameView(d, "md", Modifier)
                            if (d.has("spicy")) Text("🌶", fontSize = 12.sp)
                        }
                    } else Muted(i.t("combo.noMatch"), Modifier.weight(1f))
                    IconText("↻") { entries = Combos.rerollEntry(entries, idx, store.dishes, ctx(options)) }
                    IconText(if (e.locked) "🔒" else "🔓", selected = e.locked) { update(idx, e.copy(locked = !e.locked)) }
                    IconText("☰") { choose(idx) }
                    IconText("✕") { entries = entries.filterIndexed { j, _ -> j != idx } }
                }
                if (d != null) LinkText(i.t("dish.recipe") + " ›") { ui.openDish(d.id) }
            }
        }
        item {
            Select(
                "＋ ${i.t("combo.addSlot")} …",
                Combos.COMPOSE_GROUPS.getValue(combo).map { it.key to slotLabel(it.key) },
            ) { addSlot(it) }
            VSpace(12.dp)
        }
    }
}
