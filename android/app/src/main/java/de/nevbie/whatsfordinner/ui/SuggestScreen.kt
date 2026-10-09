package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.R
import de.nevbie.whatsfordinner.core.Combos
import de.nevbie.whatsfordinner.core.DEFAULT_FILTERS
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.DayEntry
import de.nevbie.whatsfordinner.core.Dish
import de.nevbie.whatsfordinner.core.FilterLogic
import de.nevbie.whatsfordinner.core.Filters
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.Kind
import de.nevbie.whatsfordinner.core.Suggest
import de.nevbie.whatsfordinner.core.SuggestContext

/** Scrolling tab content with the usual side padding. */
@Composable
fun Screen(content: LazyListScope.() -> Unit) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

/** Filters persisted per device (usePersistentFilters). */
@Composable
fun rememberFilters(key: String): Pair<Filters, (Filters) -> Unit> {
    val store = LocalStore.current
    var filters by remember { mutableStateOf(store.loadFilters(key)) }
    return filters to { f: Filters ->
        filters = f
        store.saveFilters(key, f)
    }
}

private const val COUNT = 3

@Composable
fun SuggestScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val (filters, setFilters) = rememberFilters("suggest")
    var showFilters by rememberSaveable { mutableStateOf(false) }
    var ids by rememberSaveable { mutableStateOf(listOf<String>()) }
    var round by rememberSaveable { mutableIntStateOf(0) }
    val today = Dates.todayISO()

    // re-draw only when asked (filters / "Neu"), not on every plan change
    var drawnFor by rememberSaveable { mutableStateOf("") }
    LaunchedEffect(filters, round) {
        val key = "${filters.hashCode()}-$round"
        // coming back to the tab: keep the ideas that are shown
        if (key == drawnFor && ids.isNotEmpty()) return@LaunchedEffect
        drawnFor = key
        val ctx = SuggestContext(store.state, filters, today)
        val exclude = if (round > 0) ids.toSet() else emptySet()
        var next = Suggest.suggest(store.dishes, ctx, COUNT, exclude)
        if (next.size < COUNT) next = Suggest.suggest(store.dishes, ctx, COUNT)
        ids = next.map { it.id }
    }

    // once today's dinner is marked as over, everything here is about tomorrow
    val todayDone = store.state.plan[today]?.isDone == true
    val target = if (todayDone) Dates.addDays(today, 1) else today
    val targetEntry = store.state.plan[target]
    val suggestions = ids.mapNotNull { store.dishById[it] }

    fun setTodayDone(done: Boolean) {
        val entry = store.state.plan[today] ?: DayEntry()
        store.setDay(today, entry.copy(done = done))
    }

    fun take(dish: Dish) {
        val combo = Combos.comboTypeOf(dish)
        if (dish.kind == Kind.COMBO && combo != null) ui.openCombo(combo, date = target)
        else store.setMeal(target, "dinner", listOf(dish.id))
    }

    fun planLater(dish: Dish) {
        if (dish.kind == Kind.COMBO && dish.combo != null) return ui.openCombo(dish.combo!!)
        ui.launch {
            val date = ui.pickDay()
            if (date != null) store.setMeal(date, "dinner", listOf(dish.id))
        }
    }

    Screen {
        item {
            Row(Modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Image(painterResource(R.mipmap.ic_launcher), contentDescription = null, modifier = Modifier.size(32.dp).clip(RoundedCornerShape(8.dp)))
                HSpace(8.dp)
                Column(Modifier.weight(1f)) {
                    Text(if (todayDone) i.t("appTitleTomorrow") else i.t("appTitle"), style = MaterialTheme.typography.headlineSmall)
                    Muted(Format.day(today, i.lang, Format.Style.LONG))
                }
            }
        }
        item {
            Card {
                Row(verticalAlignment = Alignment.Top) {
                    Text(
                        (if (todayDone) i.t("suggest.tomorrow") else i.t("suggest.today")).uppercase(),
                        fontSize = 11.sp, fontWeight = FontWeight.Bold, color = c.accent, modifier = Modifier.padding(top = 3.dp, end = 10.dp),
                    )
                    Column(Modifier.weight(1f)) {
                        val ds = targetEntry?.dishes.orEmpty().mapNotNull { store.dishById[it] }
                        if (ds.isEmpty()) Muted(if (todayDone) i.t("suggest.nothingTomorrow") else i.t("suggest.nothingToday"))
                        ds.forEach { d -> DishNameView(d, "sm", Modifier.clickable { ui.openDish(d.id) }.padding(vertical = 2.dp)) }
                    }
                }
                if (todayDone) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("✓ ${i.t("suggest.todayDone")} ", fontSize = 13.sp, modifier = Modifier.weight(1f, fill = false))
                        LinkText(i.t("undo")) { setTodayDone(false) }
                    }
                } else {
                    CheckRow(i.t("suggest.markDone"), false) { setTodayDone(true) }
                }
            }
        }
        item {
            Row(Modifier.fillMaxWidth().padding(top = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(i.t("suggest.ideas"), style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                Pill("🎲 ${i.t("suggest.more")}") { round++ }
                HSpace(6.dp)
                FilterToggle(filters, showFilters) { showFilters = !showFilters }
            }
        }
        if (showFilters) item {
            Card {
                FilterBar(filters, setFilters)
                VSpace(10.dp)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    SecondaryButton(i.t("filter.reset"), enabled = FilterLogic.activeFilterCount(filters) > 0, small = true) { setFilters(DEFAULT_FILTERS) }
                    PrimaryButton(i.t("filter.close"), small = true) { showFilters = false }
                }
            }
        }
        if (suggestions.isEmpty()) item { Muted(i.t("suggest.none"), small = false) }
        items(suggestions, key = { it.id }) { dish -> SuggestionCard(dish, todayDone, target, ::take, ::planLater) }
        item {
            VSpace(4.dp)
            val tiles = listOf(
                Triple<String, String, () -> Unit>("🥢", "家常菜", { ui.openCombo("chinese", date = target) }),
                Triple<String, String, () -> Unit>("🍛", "थाली", { ui.openCombo("indian", date = target) }),
                Triple<String, String, () -> Unit>("🫒", "Tapas", { ui.openCombo("tapas", date = target) }),
                Triple<String, String, () -> Unit>("🥨", i.t("combo.abendbrot"), { ui.openCombo("abendbrot", date = target) }),
                Triple<String, String, () -> Unit>("🥗", i.t("combo.saladShort"), { ui.openCombo("salad", date = target) }),
                Triple<String, String, () -> Unit>("🎉", i.t("nav.party"), { ui.goToTab("party") }),
            )
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                tiles.chunked(3).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        row.forEach { (icon, label, action) ->
                            Card(Modifier.weight(1f), padding = PaddingValues(vertical = 10.dp, horizontal = 4.dp), onClick = action) {
                                Text(icon, fontSize = 22.sp, modifier = Modifier.align(Alignment.CenterHorizontally))
                                Text(label, fontSize = 12.sp, maxLines = 1, modifier = Modifier.align(Alignment.CenterHorizontally))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SuggestionCard(dish: Dish, todayDone: Boolean, target: String, take: (Dish) -> Unit, planLater: (Dish) -> Unit) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val combo = Combos.comboTypeOf(dish)
    Card(onClick = { ui.openDish(dish.id) }) {
        Row(verticalAlignment = Alignment.Top) {
            DishNameView(dish, "md", Modifier.weight(1f))
            if (dish.kind != Kind.COMBO) FavButton(dish)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                DishMeta(dish, compact = true)
                FanTags(dish)
            }
            if (dish.kind != Kind.COMBO) {
                PrimaryButton(if (todayDone) i.t("suggest.tomorrowShort") else i.t("suggest.todayShort"), small = true) { take(dish) }
                IconText("📅") { planLater(dish) }
            }
            if (combo != null) {
                if (dish.kind == Kind.COMBO) PrimaryButton("${comboIcon(combo)} ${i.t("suggest.buildShort")}", small = true) { ui.openCombo(combo, date = target) }
                else IconText(comboIcon(combo)) { ui.openCombo(combo, seedId = dish.id) }
            }
        }
    }
}
