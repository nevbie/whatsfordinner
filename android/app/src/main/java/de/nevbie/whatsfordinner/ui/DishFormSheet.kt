package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.Classify
import de.nevbie.whatsfordinner.core.DishFormLogic
import de.nevbie.whatsfordinner.core.FilterLogic
import de.nevbie.whatsfordinner.core.Kind

/** Add / edit a dish (DishForm.tsx). */
@Composable
fun DishFormSheet(o: Overlay.Form) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val existing = remember { o.id?.let { store.dishById[it] } }
    val lang = i.lang

    var orig by remember { mutableStateOf(existing?.name?.orig ?: "") }
    var origLang by remember { mutableStateOf(existing?.name?.lang ?: lang) }
    var roman by remember { mutableStateOf(existing?.name?.roman ?: "") }
    var de by remember { mutableStateOf(existing?.name?.de ?: "") }
    var en by remember { mutableStateOf(existing?.name?.en ?: "") }
    var cuisine by remember { mutableStateOf(existing?.cuisine?.takeIf { it != "restaurant" } ?: "german") }
    var kind by remember { mutableStateOf(existing?.kind ?: o.kind ?: Kind.DISH) }
    var course by remember { mutableStateOf(existing?.course ?: "") }
    var tags by remember { mutableStateOf(existing?.tags ?: emptyList()) }
    var effort by remember { mutableIntStateOf(existing?.effort ?: 2) }
    var staples by remember { mutableStateOf(existing?.let { Classify.staplesOf(it) } ?: emptyList()) }
    var ingredients by remember { mutableStateOf(existing?.ingredients.orEmpty().joinToString(", ") { store.catalog.ingredientName(it, lang) }) }
    var note by remember { mutableStateOf(existing?.note?.get(lang) ?: "") }
    var url by remember { mutableStateOf(existing?.url ?: "") }
    var takeaway by remember { mutableStateOf(existing?.takeaway == true) }
    var place by remember { mutableStateOf(existing?.place ?: "") }
    var address by remember { mutableStateOf(existing?.address ?: "") }
    var rating by remember { mutableIntStateOf(existing?.rating ?: 0) }
    var error by remember { mutableStateOf("") }

    val groups = DishFormLogic.courseGroups(kind, cuisine)
    val kindOptions = (DishFormLogic.KINDS + listOfNotNull(existing?.kind?.takeIf { it !in DishFormLogic.KINDS })).distinct()

    fun save() {
        val dish = DishFormLogic.build(
            existing,
            DishFormLogic.Input(orig, origLang, roman, de, en, cuisine, kind, course, tags, effort, staples, ingredients, note, url, takeaway, place, address, rating),
            lang,
            store.catalog,
        )
        if (dish == null) {
            error = i.t("form.required")
            return
        }
        store.saveDish(dish)
        ui.remove(o)
    }

    SheetFrame(
        title = { Text(if (existing != null) i.t("form.titleEdit") else i.t("form.titleNew"), fontWeight = FontWeight.SemiBold, fontSize = 17.sp) },
        onClose = { ui.remove(o) },
        tall = true,
        footer = {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                SecondaryButton(i.t("form.cancel")) { ui.remove(o) }
                HSpace(8.dp)
                PrimaryButton(i.t("form.save")) { save() }
            }
        },
    ) {
        item { Input(orig, { orig = it }, Modifier.fillMaxWidth(), label = "${i.t("form.orig")} *") }
        item {
            FieldLabel(i.t("form.lang"))
            Select(i.langName(origLang), store.strings.keys("langNames").map { it to i.langName(it) }) { origLang = it }
        }
        item { Input(roman, { roman = it }, Modifier.fillMaxWidth(), label = i.t("form.roman")) }
        item { Input(de, { de = it }, Modifier.fillMaxWidth(), label = i.t("form.de")) }
        item { Input(en, { en = it }, Modifier.fillMaxWidth(), label = i.t("form.en")) }
        item {
            FieldLabel(i.t("form.kind"))
            Select(i.t("form.kind.$kind"), kindOptions.map { it to i.t("form.kind.$it") }) { kind = it }
        }
        if (kind != Kind.EATOUT) item {
            FieldLabel(i.t("form.cuisine"))
            Select(i.cuisine(cuisine), store.strings.keys("cuisines").filter { it != "restaurant" }.map { it to i.cuisine(it) }) { cuisine = it }
        }
        if (kind == Kind.EATOUT) {
            item { Input(url, { url = it }, Modifier.fillMaxWidth(), label = i.t("form.url"), placeholder = "https://…") }
            item { Input(place, { place = it }, Modifier.fillMaxWidth(), label = i.t("form.place"), placeholder = i.t("form.placeHint")) }
            item { Input(address, { address = it }, Modifier.fillMaxWidth(), label = i.t("form.address")) }
            item {
                FieldLabel(i.t("dish.rating"))
                Stars(rating) { rating = it }
            }
            item { CheckRow(i.t("dish.takeaway"), takeaway) { takeaway = it } }
        } else {
            item {
                FieldLabel(if (kind == Kind.BAKE) i.t("form.kind.bake") else i.t("form.builderRole"))
                val options = listOf<Pair<String?, String>>("" to i.t("form.none")) +
                    groups.flatMap { (title, cs) -> listOf<Pair<String?, String>>(null to i.t(title)) + cs.map { it to i.course(it) } }
                Select(if (course.isEmpty() || groups.none { course in it.second }) i.t("form.none") else i.course(course), options) { course = it }
            }
            item {
                FieldLabel(i.t("form.tags"))
                Chips { DishFormLogic.TAGS.forEach { t -> Pill(i.tag(t), t in tags) { tags = FilterLogic.toggleIn(tags, t) } } }
            }
            item {
                FieldLabel(i.t("filter.staple"))
                Chips { Classify.STAPLES.forEach { st -> Pill(i.t("staple.$st"), st in staples) { staples = FilterLogic.toggleIn(staples, st) } } }
            }
            item {
                FieldLabel(i.t("form.effort"))
                Segmented((1..3).map { it.toString() to i.t("dish.effort$it") }, effort.toString()) { effort = it.toInt() }
            }
            item { Input(ingredients, { ingredients = it }, Modifier.fillMaxWidth(), label = i.t("form.ingredients"), singleLine = false, minLines = 3) }
        }
        item { Input(note, { note = it }, Modifier.fillMaxWidth(), label = i.t("form.note"), singleLine = false, minLines = 2) }
        if (error.isNotEmpty()) item { Text(error, color = c.danger, fontSize = 13.sp) }
        item { VSpace(8.dp) }
    }
}

