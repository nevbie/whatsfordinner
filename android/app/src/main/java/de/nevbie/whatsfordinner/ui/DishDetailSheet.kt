package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.Classify
import de.nevbie.whatsfordinner.core.Combos
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.DishLists
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.Kind
import de.nevbie.whatsfordinner.core.dayDishIds

/** Star rating; tapping the current value again clears it (Stars.tsx). */
@Composable
fun Stars(value: Int, onChange: (Int) -> Unit) {
    Row {
        (1..5).forEach { n ->
            Text(
                "★",
                fontSize = 24.sp,
                color = if (n <= value) Wfd.colors.highlight else Wfd.colors.line,
                modifier = Modifier.clickable { onChange(if (value == n) 0 else n) }.padding(horizontal = 2.dp),
            )
        }
    }
}

@Composable
private fun Callout(title: String, text: String) {
    Surface(color = Wfd.colors.surface2, shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()) {
        Text("$title: $text", fontSize = 14.sp, modifier = Modifier.padding(10.dp))
    }
}

/** Dish detail (DishDetail.tsx). */
@Composable
fun DishDetailSheet(o: Overlay.DishDetail) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val uri = LocalUriHandler.current
    val dish = store.dishById[o.id]
    if (dish == null) {
        SheetFrame(title = {}, onClose = { ui.remove(o) }) { item { Muted("—") } }
        return
    }
    val state = store.state
    val today = Dates.todayISO()
    val combo = Combos.comboTypeOf(dish)
    val r = dish.recipe
    val times = store.stats.counts[dish.id] ?: 0
    val builtin = store.catalog.isBuiltin(dish.id)
    var visitDate by remember { mutableStateOf(today) }
    val pickVisit = rememberDatePicker(max = today) { visitDate = it }
    val visits = state.plan.filter { (date, e) -> date <= today && dish.id in dayDishIds(e) }.keys.sortedDescending()

    fun planFor() = ui.launch {
        val date = ui.pickDay() ?: return@launch
        if (dish.kind == Kind.BAKE) store.setMeal(date, "coffee", store.state.plan[date]?.meals?.get("coffee").orEmpty() + dish.id)
        else store.setMeal(date, "dinner", listOf(dish.id))
    }

    SheetFrame(title = { DishNameView(dish, "lg") }, onClose = { ui.remove(o) }, tall = true) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) { DishMeta(dish) }
                if (dish.kind != Kind.COMBO) FavButton(dish)
            }
        }
        item {
            Chips {
                Classify.regionOf(dish)?.let { Pill(i.t("region.$it")) }
                Classify.staplesOf(dish).forEach { Pill(i.t("staple.$it")) }
                dish.course?.let { Pill(i.course(it)) }
                dish.tags.forEach { Pill(i.tag(it)) }
                if (r?.family == true) Pill(i.t("dish.familyRecipe"))
                if (state.customDishes.containsKey(dish.id)) Pill(i.t(if (builtin) "dish.edited" else "dish.custom"))
                if (times > 0) Pill(i.t("dish.timesEaten", "n" to times))
            }
        }
        if (dish.kind != Kind.COMBO) item {
            FieldLabel(i.t("dish.lovedBy"))
            Chips {
                Pill("♥ ${i.t("dish.family")}", dish.id in state.favorites) { store.toggleFavorite(dish.id) }
                state.labels.forEach { l ->
                    Pill("★ ${l.name}", state.labelFavorites[l.id]?.contains(dish.id) == true, color = c.label(l.color)) { store.toggleLabelFavorite(l.id, dish.id) }
                }
            }
            if (state.labels.isNotEmpty()) {
                FieldLabel(i.t("dish.dislikedBy"))
                Chips {
                    state.labels.forEach { l ->
                        Pill("👎 ${l.name}", state.labelDislikes[l.id]?.contains(dish.id) == true, color = c.label(l.color), dashed = true) { store.toggleLabelDislike(l.id, dish.id) }
                    }
                }
            } else Muted(i.t("labels.none"))
        }
        if (dish.group != null) item {
            FieldLabel(i.t("dish.variants"))
            Chips {
                store.dishes.filter { it.group == dish.group && it.id != dish.id }.forEach { v -> Pill(v.label(i.lang)) { ui.openDish(v.id) } }
            }
        }
        item {
            Chips {
                if (dish.kind != Kind.COMBO && dish.kind != Kind.BAKE) {
                    PrimaryButton(
                        if (dish.kind == Kind.EATOUT) i.t(if (dish.takeaway == true) "dish.orderToday" else "dish.goToday") else i.t("suggest.takeToday"),
                    ) { store.setMeal(today, "dinner", listOf(dish.id)) }
                    SecondaryButton(i.t("dish.planFor")) { planFor() }
                }
                if (dish.kind == Kind.BAKE) PrimaryButton("☕ ${i.t("dish.planCoffee")}") { planFor() }
                if (combo != null) {
                    val label = "${comboIcon(combo)} ${i.t("suggest.buildMeal")}"
                    val open = { ui.openCombo(combo, seedId = if (dish.kind == Kind.COMBO) null else dish.id) }
                    if (dish.kind == Kind.COMBO) PrimaryButton(label, onClick = open) else SecondaryButton(label, onClick = open)
                }
            }
        }
        dish.note?.let { n -> item { Text(n[i.lang], fontSize = 14.sp) } }
        if (dish.kind == Kind.EATOUT) {
            if (dish.address != null || dish.phone != null) item {
                Column {
                    dish.address?.let { Text("📍 $it", fontSize = 14.sp) }
                    dish.phone?.let { p ->
                        Text("☎️ $p", fontSize = 14.sp, color = c.accent, modifier = Modifier.clickable { runCatching { uri.openUri("tel:" + p.replace(Regex("\\s"), "")) } })
                    }
                }
            }
            item {
                Card {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(i.t("dish.rating"), fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                        Stars(dish.rating ?: 0) { v -> store.saveDish(dish.copy(rating = v.takeIf { it > 0 }, custom = true)) }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Pill("📅 ${Format.day(visitDate, i.lang, Format.Style.DAY_MON_YEAR)}") { pickVisit(visitDate) }
                        SecondaryButton("＋ ${i.t("dish.addVisit")}", small = true) {
                            store.setMeal(visitDate, "dinner", store.state.plan[visitDate]?.dishes.orEmpty().filter { it != dish.id } + dish.id)
                        }
                    }
                    if (visits.isNotEmpty()) Muted("${i.t("dish.visits")}: " + visits.joinToString(" · ") { Format.day(it, i.lang, Format.Style.DAY_MON_YEAR) })
                }
            }
            item {
                Chips {
                    dish.url?.let { u -> PrimaryButton(i.t("dish.menuLink")) { runCatching { uri.openUri(u) } } }
                    SecondaryButton(i.t("dish.mapsLink")) { runCatching { uri.openUri(DishLists.mapsUrl(dish)) } }
                }
            }
        }
        if (dish.kind != Kind.COMBO && dish.kind != Kind.EATOUT) item {
            SectionTitle(i.t("dish.ingredients"))
            if (dish.ingredients.isNotEmpty()) Chips { dish.ingredients.forEach { Pill(store.catalog.ingredientName(it, i.lang)) } }
            else Muted(i.t("dish.noIngredients"))
        }
        dish.pairsWith?.let { pairs ->
            item { SectionTitle(i.t("dish.pairs")) }
            pairs.mapNotNull { store.dishById[it] }.forEach { p ->
                item { DishNameView(p, "sm", Modifier.fillMaxWidth().clickable { ui.openDish(p.id) }.padding(vertical = 4.dp)) }
            }
        }
        if (r != null) {
            item {
                SectionTitle(i.t("dish.recipe"))
                Muted("${r.serves[i.lang]} · ${r.time[i.lang]}")
                VSpace(6.dp)
                r.ingredients[i.lang].forEach { Text("• $it", fontSize = 14.sp, modifier = Modifier.padding(vertical = 1.dp)) }
            }
            item {
                Text(i.t("dish.steps"), fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 8.dp, bottom = 4.dp))
                r.steps[i.lang].forEachIndexed { n, s -> Text("${n + 1}. $s", fontSize = 14.sp, modifier = Modifier.padding(vertical = 3.dp)) }
            }
            r.vegan?.let { item { Callout("🌱 ${i.t("dish.vegan")}", it[i.lang]) } }
            r.tip?.let { item { Callout("💡 ${i.t("dish.tip")}", it[i.lang]) } }
            r.kids?.let { item { Callout("🧒 ${i.t("dish.kids")}", it[i.lang]) } }
            r.source?.let { item { Muted("${i.t("dish.source")}: $it") } }
        }
        if (dish.kind != Kind.COMBO) item {
            VSpace(8.dp)
            Chips {
                SecondaryButton(i.t("dish.edit")) { ui.openForm(dish.id) }
                if (state.customDishes.containsKey(dish.id)) {
                    SecondaryButton(i.t(if (builtin) "dish.reset" else "dish.delete"), danger = true) {
                        // an edited built-in dish falls back to the original; an own dish is gone
                        ui.confirm(i.t(if (builtin) "dish.resetConfirm" else "dish.deleteConfirm")) {
                            store.deleteDish(dish.id)
                            if (!builtin) ui.remove(o)
                        }
                    }
                }
                if (builtin) {
                    SecondaryButton("🗑 ${i.t("dish.hide")}", danger = true) {
                        ui.confirm(i.t("dish.hideConfirm")) {
                            store.setHidden(dish.id, true)
                            ui.remove(o)
                        }
                    }
                }
            }
            VSpace(16.dp)
        }
    }
}
