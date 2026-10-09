package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.ALL_MEALS
import de.nevbie.whatsfordinner.core.DEFAULT_FILTERS
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.DayEntry
import de.nevbie.whatsfordinner.core.Dish
import de.nevbie.whatsfordinner.core.EXTRA_MEALS
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.Kind
import de.nevbie.whatsfordinner.core.PartyLogic
import de.nevbie.whatsfordinner.core.StateOps
import de.nevbie.whatsfordinner.core.Suggest
import de.nevbie.whatsfordinner.core.SuggestContext
import de.nevbie.whatsfordinner.core.dayDishIds
import de.nevbie.whatsfordinner.core.mealIds

/** Week plan (PlanView.tsx). */
@Composable
fun PlanScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val today = Dates.todayISO()
    var start by rememberSaveable { mutableStateOf(Dates.weekStart(today)) }
    var expanded by rememberSaveable { mutableStateOf<String?>(null) }
    val days = (0 until 7).map { Dates.addDays(start, it) }
    val state = store.state

    fun addDish(date: String, meal: String = "dinner", only: ((Dish) -> Boolean)? = null) {
        // Kaffee & Kuchen: offer cakes, desserts and sweets first
        val filter = only ?: if (meal == "coffee") ({ d: Dish -> d.kind == Kind.BAKE || d.has("sweet") }) else null
        val title = if (only != null) i.t("plan.eatout") else if (meal == "dinner") i.t("plan.pickDish") else i.t("meal.$meal")
        ui.launch {
            val id = ui.pickDish(title, filter) ?: return@launch
            val dish = store.dishById[id]
            if (dish?.kind == Kind.COMBO && dish.combo != null) ui.openCombo(dish.combo!!, date = date, meal = meal)
            else store.setMeal(date, meal, mealIds(store.state.plan[date], meal) + id)
        }
    }

    fun removeDish(date: String, meal: String, index: Int) = store.setDay(date, StateOps.removeDish(store.state, date, meal, index))

    fun clearDay(date: String) {
        val entry = store.state.plan[date] ?: return
        store.setDay(date, if (entry.isDone) DayEntry(done = true) else null)
    }

    fun labelText(label: String): String = when {
        label == "out" || label == "event" -> i.t("plan.label.$label")
        label.startsWith("away:") -> "👤 " + i.t("plan.label.away", "name" to (state.labels.find { it.id == label.substring(5) }?.name ?: "?"))
        else -> label
    }
    val presetLabels = listOf("out", "event") + state.labels.map { "away:${it.id}" }

    /** Suggest dishes for the given (empty) days, avoiding repeats within the week. */
    fun fill(targets: List<String>) {
        val s = store.state
        val exclude = days.flatMap { s.plan[it]?.dishes.orEmpty() }.toSet()
        val picks = Suggest.suggest(store.dishes, SuggestContext(s, DEFAULT_FILTERS, today), targets.size, exclude)
        targets.forEachIndexed { idx, date ->
            val dish = picks.getOrNull(idx) ?: return@forEachIndexed
            store.setDay(date, (s.plan[date] ?: DayEntry()).copy(dishes = listOf(dish.id)))
        }
    }

    // days where everyone is out don't need a dinner
    val emptyFuture = days.filter { it >= today && state.plan[it]?.dishes.isNullOrEmpty() && state.plan[it]?.labels?.contains("out") != true }
    fun partiesOn(date: String) = state.parties.values.filter { it.date == date }
    fun createParty(date: String) {
        val party = PartyLogic.newParty(date, store.state.settings, i.lang)
        store.saveParty(party)
        ui.openParty(party.id)
    }

    Screen {
        item { TitleRow(i.t("plan.title")) }
        item {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                IconText("‹") { start = Dates.addDays(start, -7) }
                Pill("${Format.day(days[0], i.lang, Format.Style.DAY_MON)} – ${Format.day(days[6], i.lang, Format.Style.DAY_MON)}") { start = Dates.weekStart(today) }
                IconText("›") { start = Dates.addDays(start, 7) }
            }
        }
        items(days, key = { it }) { date ->
            val entry = state.plan[date]
            val isToday = date == today
            val past = date < today
            val open = expanded == date
            val dishIds = entry?.dishes.orEmpty()
            val allIds = dayDishIds(entry)
            val extraMeals = EXTRA_MEALS.filter { !entry?.meals?.get(it).isNullOrEmpty() }
            val parties = partiesOn(date)
            val out = entry?.labels?.contains("out") == true
            Card(
                Modifier.alpha(if (past) 0.7f else 1f),
                padding = PaddingValues(horizontal = 10.dp, vertical = 8.dp),
                borderColor = if (isToday) c.accent else null,
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Column(Modifier.width(46.dp)) {
                        Text(Format.day(date, i.lang, Format.Style.WEEKDAY), fontWeight = FontWeight.Bold, fontSize = 14.sp, color = if (isToday) c.accent else c.text)
                        Text(Format.day(date, i.lang, Format.Style.DAY_MONTH), fontSize = 11.sp, color = c.muted)
                    }
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        if (!entry?.labels.isNullOrEmpty()) Chips { entry!!.labels!!.forEach { Tag(labelText(it), c.brand) } }
                        extraMeals.forEach { m ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(i.t("meal.short.$m"), fontSize = 10.sp, color = c.muted, fontWeight = FontWeight.Bold, modifier = Modifier.padding(end = 6.dp))
                                Text(
                                    entry!!.meals!![m]!!.joinToString(", ") { store.dishById[it]?.label(i.lang) ?: it },
                                    fontSize = 13.sp,
                                    modifier = Modifier.clickable { entry.meals!![m]!!.firstOrNull()?.let { ui.openDish(it) } },
                                )
                            }
                        }
                        if (extraMeals.isNotEmpty() && dishIds.isNotEmpty()) Text(i.t("meal.short.dinner"), fontSize = 10.sp, color = c.muted, fontWeight = FontWeight.Bold)
                        dishIds.forEach { id ->
                            val d = store.dishById[id]
                            Column(Modifier.clickable { if (d?.kind == Kind.COMBO && d.combo != null) ui.openCombo(d.combo!!, date = date) else ui.openDish(id) }) {
                                Text(d?.name?.orig ?: id, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                                if (d != null && dishIds.size == 1 && d.label(i.lang) != d.name.orig) Text(d.label(i.lang), fontSize = 12.sp, color = c.muted)
                            }
                        }
                        parties.forEach { p ->
                            Text(
                                "🎉 ${p.title} · ${i.t("party.guestsCount", "n" to PartyLogic.guestTotal(p))}",
                                fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable { ui.openParty(p.id) },
                            )
                        }
                        if (allIds.isEmpty() && parties.isEmpty() && !out) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                LinkText("＋ ${i.t("plan.add")}") { addDish(date) }
                                if (date >= today) {
                                    HSpace(12.dp)
                                    LinkText("🎲") { fill(listOf(date)) }
                                }
                            }
                        }
                        if (isToday) CheckRow(i.t("plan.done"), entry?.isDone == true) { store.setDay(date, (entry ?: DayEntry()).copy(done = it)) }
                    }
                    if (allIds.isNotEmpty()) IconText("✕") {
                        if (allIds.size == 1) store.setDay(date, if (entry!!.isDone) DayEntry(done = true) else null)
                        else ui.confirm(i.t("plan.clearConfirm")) { clearDay(date) }
                    }
                    IconText("⋯", selected = open) { expanded = if (open) null else date }
                }
                if (open) DayActions(date, entry, presetLabels, ::labelText, ::addDish, ::removeDish, ::createParty)
            }
        }
        if (emptyFuture.isNotEmpty()) item {
            SecondaryButton("🎲 ${i.t("plan.fillWeek")}", Modifier.fillMaxWidth()) { fill(emptyFuture) }
        }
    }
}

@Composable
private fun DayActions(
    date: String,
    entry: DayEntry?,
    presetLabels: List<String>,
    labelText: (String) -> String,
    addDish: (String, String, ((Dish) -> Boolean)?) -> Unit,
    removeDish: (String, String, Int) -> Unit,
    createParty: (String) -> Unit,
) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    var customLabel by remember { mutableStateOf("") }
    Column(Modifier.padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Chips {
            ALL_MEALS.forEach { m ->
                mealIds(entry, m).forEachIndexed { idx, id ->
                    Pill("✕ ${store.dishById[id]?.label(i.lang) ?: id}") { removeDish(date, m, idx) }
                }
            }
        }
        Chips {
            ALL_MEALS.forEach { m -> Pill("＋ ${i.t("meal.$m")}") { addDish(date, m, null) } }
            Pill(i.t("plan.eatout")) { addDish(date, "dinner") { it.kind == Kind.EATOUT } }
            listOf("chinese", "indian", "tapas", "abendbrot", "salad").forEach { cb -> Pill(comboIcon(cb)) { ui.openCombo(cb, date = date) } }
            Pill("🎉 ${i.t("party.new")}") { createParty(date) }
        }
        FieldLabel(i.t("plan.labels"))
        Chips {
            (presetLabels + entry?.labels.orEmpty().filter { it !in presetLabels }).forEach { l ->
                Pill(labelText(l), entry?.labels?.contains(l) == true) { store.setDay(date, StateOps.toggleDayLabel(store.state, date, l)) }
            }
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Input(customLabel, { customLabel = it }, Modifier.weight(1f), placeholder = i.t("plan.labelCustom"), onDone = {
                if (customLabel.isNotBlank()) store.setDay(date, StateOps.toggleDayLabel(store.state, date, customLabel.trim()))
                customLabel = ""
            })
            HSpace(6.dp)
            Pill("＋", enabled = customLabel.isNotBlank()) {
                store.setDay(date, StateOps.toggleDayLabel(store.state, date, customLabel.trim()))
                customLabel = ""
            }
        }
    }
}
