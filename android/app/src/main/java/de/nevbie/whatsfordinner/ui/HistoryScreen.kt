package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.DayEntry
import de.nevbie.whatsfordinner.core.DishLists
import de.nevbie.whatsfordinner.core.Format

private const val PAGE = 30

/** Past days and most eaten dishes (HistoryView.tsx). */
@Composable
fun HistoryScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val today = Dates.todayISO()
    var limit by rememberSaveable { mutableIntStateOf(PAGE) }
    var pastDate by rememberSaveable { mutableStateOf("") }
    val pickPast = rememberDatePicker(max = today) { pastDate = it }
    val past = DishLists.pastDays(store.state.plan, today)
    val top = DishLists.topDishes(store.stats.counts, store.dishById)

    fun addPast() {
        val date = pastDate
        if (date.isEmpty() || date > today) return
        ui.launch {
            val id = ui.pickDish(i.t("plan.pickDish")) ?: return@launch
            val entry = store.state.plan[date] ?: DayEntry()
            store.setDay(date, entry.copy(dishes = entry.dishes + id))
            pastDate = ""
        }
    }

    Screen {
        item { TitleRow(i.t("history.title")) }
        item {
            Card {
                Muted(i.t("history.addPast"))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SecondaryButton("📅 " + if (pastDate.isEmpty()) "…" else Format.day(pastDate, i.lang, Format.Style.WEEKDAY_DAY_MON_YEAR), Modifier.weight(1f)) {
                        pickPast(pastDate.ifEmpty { today })
                    }
                    HSpace(8.dp)
                    PrimaryButton("＋ ${i.t("plan.add")}", enabled = pastDate.isNotEmpty()) { addPast() }
                }
            }
        }
        if (past.isEmpty()) {
            item { Muted(i.t("history.empty"), small = false) }
        } else {
            if (top.isNotEmpty()) {
                item { SectionTitle(i.t("history.top")) }
                items(top, key = { "top-" + it.first }) { (id, n) ->
                    val d = store.dishById[id] ?: return@items
                    Row(Modifier.fillMaxWidth().clickable { ui.openDish(id) }.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                        DishNameView(d, "sm", Modifier.weight(1f))
                        Text("$n×", fontWeight = FontWeight.Bold, color = Wfd.colors.accent)
                    }
                    HorizontalDivider(color = Wfd.colors.line)
                }
            }
            item { SectionTitle(i.t("history.recent")) }
            items(past.take(limit), key = { it.first }) { (date, entry) ->
                Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.Top) {
                    val style = if (date.take(4) == today.take(4)) Format.Style.WEEKDAY_DAY_MON else Format.Style.WEEKDAY_DAY_MON_YEAR
                    Text(Format.day(date, i.lang, style), fontSize = 13.sp, color = Wfd.colors.muted, modifier = Modifier.width(96.dp).padding(top = 2.dp))
                    Column(Modifier.weight(1f)) {
                        entry.dishes.mapNotNull { store.dishById[it] }.forEach { d ->
                            DishNameView(d, "sm", Modifier.clickable { ui.openDish(d.id) }.padding(vertical = 2.dp))
                        }
                    }
                }
                HorizontalDivider(color = Wfd.colors.line)
            }
            if (past.size > limit) item { SecondaryButton("…", Modifier.fillMaxWidth()) { limit += PAGE } }
        }
    }
}
