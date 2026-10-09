package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.DEFAULT_FILTERS
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.DishLists
import de.nevbie.whatsfordinner.core.FilterLogic
import de.nevbie.whatsfordinner.core.Format

/** Dish list with search, areas and filters (DishesView.tsx). */
@Composable
fun DishesScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val (filters, setFilters) = rememberFilters("dishes")
    var query by rememberSaveable { mutableStateOf("") }
    var area by rememberSaveable { mutableStateOf("all") }
    var sort by rememberSaveable { mutableStateOf("name") }
    var showFilters by rememberSaveable { mutableStateOf(false) }
    val active = FilterLogic.activeFilterCount(filters)
    val state = store.state
    val dishes = store.dishes
    val last = store.stats.last
    val list = remember(dishes, state.favorites, state.labelFavorites, state.labelDislikes, filters, query, area, sort, last, i.lang) {
        DishLists.dishList(dishes, state, filters, query, area, sort, last, i.lang, store.catalog)
    }

    Box(Modifier.fillMaxSize()) {
        Screen {
            item { TitleRow(i.t("nav.dishes")) }
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Input(query, { query = it }, Modifier.weight(1f), placeholder = i.t("dishes.searchAll"))
                    HSpace(8.dp)
                    FilterToggle(filters, showFilters) { showFilters = !showFilters }
                }
            }
            item {
                ScrollRow {
                    DishLists.AREAS.forEach { a -> Pill(i.t("dishes.area.$a"), area == a) { area = a } }
                }
            }
            if (showFilters) item {
                Card {
                    FilterBar(filters, setFilters)
                    VSpace(10.dp)
                    Segmented(listOf("name" to i.t("dishes.sort.name"), "recent" to i.t("dishes.sort.recent")), sort) { sort = it }
                    VSpace(8.dp)
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        SecondaryButton(i.t("filter.reset"), enabled = active > 0, small = true) { setFilters(DEFAULT_FILTERS) }
                        HSpace(8.dp)
                        PrimaryButton(i.t("filter.done", "n" to list.size), small = true) { showFilters = false }
                    }
                }
            }
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Muted(if (list.size == 1) i.t("dishes.countOne") else i.t("dishes.count", "n" to list.size), Modifier.weight(1f))
                    if (active > 0 && !showFilters) LinkText("${i.t("filter.active", "n" to active)} · ${i.t("filter.reset")}") { setFilters(DEFAULT_FILTERS) }
                }
            }
            if (area == "eatout") item {
                SecondaryButton(i.t("dish.newRestaurant"), Modifier.fillMaxWidth()) { ui.openForm(kind = "eatout") }
            }
            items(list, key = { it.id }) { d -> DishRow(d) { ui.openDish(d.id) } }
            item { VSpace(64.dp) }
        }
        if (query.isEmpty()) {
            ExtendedFloatingActionButton(
                onClick = { ui.openForm() },
                modifier = Modifier.align(Alignment.BottomEnd).padding(16.dp),
                containerColor = Wfd.colors.accent,
                contentColor = Wfd.colors.accentText,
            ) { Text("＋ ${i.t("dishes.add")}") }
        }
    }
}

/** Dish picker (Pickers.tsx): search, favourites first. */
@Composable
fun DishPickerSheet(o: Overlay.PickDish) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    var query by remember { mutableStateOf("") }
    val list = remember(store.dishes, store.state.favorites, query, i.lang) {
        DishLists.pickerList(store.dishes, store.state, o.filter, query, i.lang, store.catalog)
    }
    SheetFrame(title = { Text(o.title, fontWeight = FontWeight.SemiBold, fontSize = 17.sp) }, onClose = { ui.remove(o) }, tall = true) {
        item { Input(query, { query = it }, Modifier.fillMaxWidth(), placeholder = i.t("dishes.search")) }
        items(list, key = { it.id }) { d ->
            DishRow(d, trailing = { if (d.id in store.state.favorites) Text("♥", color = Wfd.colors.accent, fontSize = 18.sp) }) { ui.finish(o, d.id) }
        }
    }
}

/** Day picker for the next 14 days. */
@Composable
fun DayPickerSheet(o: Overlay.PickDay) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val today = Dates.todayISO()
    val days = (0 until 14).map { Dates.addDays(today, it) }
    run {
        SheetFrame(title = { Text(i.t("dish.planFor"), fontWeight = FontWeight.SemiBold, fontSize = 17.sp) }, onClose = { ui.remove(o) }) {
            items(days) { date ->
                val entry = store.state.plan[date]
                Row(
                    Modifier.fillMaxWidth().clickable { ui.finish(o, date) }.padding(vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(if (date == today) i.t("plan.today") else Format.day(date, i.lang, Format.Style.WEEKDAY_LONG_DAY_MONTH), fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
                    Muted(entry?.dishes?.mapNotNull { store.dishById[it]?.label(i.lang) }?.joinToString(", ")?.ifEmpty { "—" } ?: "—")
                }
                HorizontalDivider(color = Wfd.colors.line)
            }
        }
    }
}
