package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
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
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.Party
import de.nevbie.whatsfordinner.core.PartyGuest
import de.nevbie.whatsfordinner.core.PartyItem
import de.nevbie.whatsfordinner.core.PartyLogic
import de.nevbie.whatsfordinner.core.PartySuggestCtx
import de.nevbie.whatsfordinner.core.PartyTodo
import de.nevbie.whatsfordinner.core.DishLists

/** Parties (PartyListView.tsx). */
@Composable
fun PartyListScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val today = Dates.todayISO()
    val parties = store.state.parties.values.sortedBy { it.date }
    val upcoming = parties.filter { it.date >= today }
    val past = parties.filter { it.date < today }.reversed()
    var showPast by rememberSaveable { mutableStateOf(false) }

    Screen {
        item { TitleRow(i.t("party.title")) }
        item {
            PrimaryButton("🎉 ${i.t("party.new")}", Modifier.fillMaxWidth()) {
                val party = PartyLogic.newParty(Dates.nextSaturday(today), store.state.settings, i.lang)
                store.saveParty(party)
                ui.openParty(party.id)
            }
        }
        item { SectionTitle(i.t("party.upcoming")) }
        if (upcoming.isEmpty()) item { Muted(i.t("party.empty"), small = false) }
        items(upcoming, key = { it.id }) { PartyRow(it) }
        if (past.isNotEmpty()) {
            item {
                Row(Modifier.fillMaxWidth().clickable { showPast = !showPast }, verticalAlignment = Alignment.CenterVertically) {
                    SectionTitle((if (showPast) "▾ " else "▸ ") + i.t("party.past"))
                }
            }
            if (showPast) items(past, key = { it.id }) { PartyRow(it) }
        }
    }
}

@Composable
private fun PartyRow(p: Party) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val done = p.todos.count { it.done == true }
    Row(Modifier.fillMaxWidth().clickable { ui.openParty(p.id) }.padding(vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(i.partyFormatIcon(p.format), fontSize = 24.sp, modifier = Modifier.padding(end = 10.dp))
        Column(Modifier.weight(1f)) {
            Text(p.title, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
            var meta = Format.day(p.date, i.lang, Format.Style.WEEKDAY_DAY_MON)
            if (p.time != null) meta += " · ${p.time}"
            meta += " · ${i.partyFormat(p.format)} · ${i.t("party.guestsCount", "n" to PartyLogic.guestTotal(p))}"
            if (p.todos.isNotEmpty()) meta += " · ${i.t("party.todosCount", "done" to done, "all" to p.todos.size)}"
            Muted(meta)
        }
    }
    HorizontalDivider(color = Wfd.colors.line)
}

/** Party planner (PartyView.tsx). */
@Composable
fun PartySheet(o: Overlay.PartyPlanner) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    var tab by remember { mutableStateOf("menu") }
    val party = store.state.parties[o.id]
    if (party == null) {
        SheetFrame(title = {}, onClose = { ui.remove(o) }) { item { Muted("—") } }
        return
    }
    val update = { p: Party -> store.saveParty(p) }
    val ctx = PartySuggestCtx(store.dishes, store.state.favorites.toSet(), Dates.todayISO())
    val pickDate = rememberDatePicker { d -> store.state.parties[o.id]?.let { update(it.copy(date = d)) } }
    val pickTime = rememberTimePicker { t -> store.state.parties[o.id]?.let { update(it.copy(time = t)) } }

    SheetFrame(
        title = { Text("🎉 ${party.title}", fontWeight = FontWeight.SemiBold, fontSize = 17.sp) },
        onClose = { ui.remove(o) },
        tall = true,
        footer = {
            Segmented(listOf("menu", "guests", "shopping", "todos").map { it to i.t("party.tab.$it") }, tab, Modifier.fillMaxWidth()) { tab = it }
        },
    ) {
        item { CommitField(party.title, { t -> update(party.copy(title = t.ifBlank { party.title })) }, Modifier.fillMaxWidth(), label = i.t("party.name")) }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    FieldLabel(i.t("party.date"))
                    SecondaryButton("📅 ${Format.day(party.date, i.lang, Format.Style.WEEKDAY_DAY_MON_YEAR)}", Modifier.fillMaxWidth()) { pickDate(party.date) }
                }
                Column(Modifier.weight(1f)) {
                    FieldLabel(i.t("party.time"))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        SecondaryButton("🕖 ${party.time ?: "–"}", Modifier.weight(1f)) { pickTime(party.time) }
                        if (party.time != null) IconText("✕") { update(party.copy(time = null)) }
                    }
                }
            }
        }
        item {
            FieldLabel(i.t("party.format"))
            Chips {
                PartyLogic.PARTY_FORMATS.forEach { f ->
                    Pill("${i.partyFormatIcon(f)} ${i.partyFormat(f)}", party.format == f) {
                        if (f != party.format) {
                            // fresh checklist for the new format unless the family already started ticking
                            val todos = if (party.todos.any { it.done == true }) party.todos else PartyLogic.defaultTodos(f, party.kids, i.lang)
                            update(party.copy(format = f, todos = todos))
                        }
                    }
                }
            }
        }
        when (tab) {
            "menu" -> menuTab(party, update, ctx)
            "guests" -> guestsTab(party, update)
            "shopping" -> shoppingTab(party, update)
            else -> todosTab(party, update)
        }
        item {
            SectionTitle(i.t("party.notes"))
            CommitField(party.note ?: "", { n -> update(party.copy(note = n.ifBlank { null })) }, Modifier.fillMaxWidth(), singleLine = false)
            VSpace(12.dp)
            SecondaryButton(i.t("party.delete"), Modifier.fillMaxWidth(), danger = true) {
                ui.confirm(i.t("party.deleteConfirm")) {
                    store.deleteParty(party.id)
                    ui.remove(o)
                }
            }
            VSpace(12.dp)
        }
    }
}

private fun LazyListScope.menuTab(party: Party, update: (Party) -> Unit, ctx: PartySuggestCtx) {
    item {
        val i = LocalStore.current.i18n
        PrimaryButton("✨ ${i.t("party.suggest")}", Modifier.fillMaxWidth()) { update(party.copy(items = PartyLogic.suggestPartyItems(party, ctx))) }
        Muted(i.t("party.suggestHint"))
    }
    item { MenuCourses(party, update, ctx) }
}

@Composable
private fun MenuCourses(party: Party, update: (Party) -> Unit, ctx: PartySuggestCtx) {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    var extraCourses by remember { mutableStateOf(listOf<String>()) }
    val tpl = PartyLogic.partyTemplate(party.format, PartyLogic.guestTotal(party))
    val shown = PartyLogic.PARTY_COURSES.filter { (tpl[it] ?: 0) > 0 || party.items.any { x -> x.course == it } || it in extraCourses }
    val hidden = PartyLogic.PARTY_COURSES.filter { it !in shown }
    fun setItem(id: String, f: (PartyItem) -> PartyItem) = update(party.copy(items = party.items.map { if (it.id == id) f(it) else it }))

    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        shown.forEach { course ->
            SectionTitle(i.partyCourse(course))
            party.items.filter { it.course == course }.forEach { item ->
                val dish = item.dishId?.let { store.dishById[it] }
                Card {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (dish != null) DishNameView(dish, "sm", Modifier.weight(1f).clickable { ui.openDish(dish.id) })
                        else Text(item.text ?: "", fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                        if (dish != null) IconText("↻") { update(party.copy(items = PartyLogic.rerollPartyItem(party, item.id, ctx))) }
                        IconText("✕") { update(party.copy(items = party.items.filter { it.id != item.id })) }
                    }
                    val who = party.guests.find { it.id == item.broughtBy }
                    Select(
                        if (who != null) "🎁 ${who.name}" else "🏠 ${i.t("party.us")}",
                        listOf<Pair<String?, String>>("" to "🏠 ${i.t("party.us")}") + party.guests.map { it.id to "🎁 ${it.name}" },
                        asPill = true,
                    ) { v -> setItem(item.id) { it.copy(broughtBy = v.ifEmpty { null }) } }
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Pill("＋ ${i.t("party.addDish")}") {
                    ui.launch {
                        val id = ui.pickDish(i.partyCourse(course)) { course in PartyLogic.partyCoursesOf(it) } ?: return@launch
                        val p = store.state.parties[party.id] ?: return@launch
                        update(p.copy(items = p.items + PartyItem(PartyLogic.uid(), course, dishId = id, locked = true)))
                    }
                }
                HSpace(8.dp)
                CommitField("", { t ->
                    if (t.isNotBlank()) update(party.copy(items = party.items + PartyItem(PartyLogic.uid(), course, text = t.trim())))
                }, Modifier.weight(1f), placeholder = i.t("party.addText"), clearOnCommit = true)
            }
        }
        if (hidden.isNotEmpty()) {
            VSpace(6.dp)
            Select("＋ ${i.t("party.addCourse")}", hidden.map { it to i.partyCourse(it) }, asPill = true) { extraCourses = extraCourses + it }
        }
    }
}

private fun LazyListScope.guestsTab(party: Party, update: (Party) -> Unit) {
    item { GuestsTab(party, update) }
}

@Composable
private fun GuestsTab(party: Party, update: (Party) -> Unit) {
    val i = LocalStore.current.i18n
    var name by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }
    val total = PartyLogic.guestTotal(party)
    fun addGuest() {
        if (name.isBlank()) return
        update(party.copy(guests = party.guests + PartyGuest(PartyLogic.uid(), name.trim(), note.trim().ifEmpty { null })))
        name = ""
        note = ""
    }
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Stepper(i.t("party.adults"), party.adults, 1, 60) { update(party.copy(adults = it)) }
        Stepper(i.t("party.kids"), party.kids, 0, 40) { update(party.copy(kids = it)) }
        Stepper("🥕 ${i.t("party.veggie")}", party.veggie, 0, (total - party.vegan).coerceAtLeast(0)) { update(party.copy(veggie = it)) }
        Stepper("🌱 ${i.t("party.vegan")}", party.vegan, 0, (total - party.veggie).coerceAtLeast(0)) { update(party.copy(vegan = it)) }
        CommitField(party.allergies ?: "", { a -> update(party.copy(allergies = a.ifBlank { null })) }, Modifier.fillMaxWidth(), label = i.t("party.allergies"), singleLine = false)
        FieldLabel(i.t("party.guestList"))
        party.guests.forEach { g ->
            val brings = party.items.count { it.broughtBy == g.id }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    buildString {
                        append(g.name)
                        g.note?.let { append(" · $it") }
                        if (brings > 0) append(" · 🎁 $brings")
                    },
                    modifier = Modifier.weight(1f),
                )
                IconText("✕") {
                    update(party.copy(guests = party.guests.filter { it.id != g.id }, items = party.items.map { if (it.broughtBy == g.id) it.copy(broughtBy = null) else it }))
                }
            }
        }
        Input(name, { name = it }, Modifier.fillMaxWidth(), placeholder = i.t("party.guestName"), onDone = ::addGuest)
        Input(note, { note = it }, Modifier.fillMaxWidth(), placeholder = i.t("party.guestNote"), onDone = ::addGuest)
        SecondaryButton(i.t("party.add"), enabled = name.isNotBlank()) { addGuest() }
    }
}

private fun LazyListScope.shoppingTab(party: Party, update: (Party) -> Unit) {
    item { ShoppingTab(party, update) }
}

@Composable
private fun ShoppingTab(party: Party, update: (Party) -> Unit) {
    val store = LocalStore.current
    val i = store.i18n
    val collator = remember(i.lang) { DishLists.collator(i.lang) }
    val entries = PartyLogic.shoppingList(party, store.dishById).sortedWith(
        compareBy<de.nevbie.whatsfordinner.core.ShoppingEntry> { if (party.shopping[it.key] == true) 1 else 0 }
            .thenComparator { a, b -> collator.compare(store.catalog.ingredientName(a.key, i.lang), store.catalog.ingredientName(b.key, i.lang)) },
    )
    fun toggle(key: String) = update(party.copy(shopping = party.shopping + (key to (party.shopping[key] != true))))
    Column {
        Muted(i.t("party.shoppingHint"))
        if (entries.isEmpty() && party.extraShopping.isEmpty()) Muted(i.t("party.shoppingEmpty"), small = false)
        entries.forEach { e ->
            val dishes = e.dishIds.distinct().joinToString(", ") { store.dishById[it]?.label(i.lang) ?: it }
            CheckRow("${store.catalog.ingredientName(e.key, i.lang)} · $dishes", party.shopping[e.key] == true, strike = true) { toggle(e.key) }
        }
        party.extraShopping.forEach { text ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                CheckRow(text, party.shopping["x:$text"] == true, Modifier.weight(1f), strike = true) { toggle("x:$text") }
                IconText("✕") { update(party.copy(extraShopping = party.extraShopping - text)) }
            }
        }
        CommitField("", { v ->
            val t = v.trim()
            if (t.isNotEmpty() && t !in party.extraShopping) update(party.copy(extraShopping = party.extraShopping + t))
        }, Modifier.fillMaxWidth(), placeholder = "＋ ${i.t("party.extraItem")}", clearOnCommit = true)
        if (party.shopping.values.any { it }) {
            VSpace(6.dp)
            SecondaryButton(i.t("party.resetChecks"), Modifier.fillMaxWidth()) { update(party.copy(shopping = emptyMap())) }
        }
    }
}

private fun LazyListScope.todosTab(party: Party, update: (Party) -> Unit) {
    item { TodosTab(party, update) }
}

@Composable
private fun TodosTab(party: Party, update: (Party) -> Unit) {
    val i = LocalStore.current.i18n
    var phase by remember { mutableStateOf("daybefore") }
    Column {
        PartyLogic.TODO_PHASES.forEach { ph ->
            val list = party.todos.filter { it.phase == ph }
            if (list.isNotEmpty()) {
                SectionTitle("${i.todoPhase(ph)} · ${Format.day(Dates.addDays(party.date, PartyLogic.PHASE_OFFSET.getValue(ph)), i.lang)}")
                list.forEach { x ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CheckRow(x.text, x.done == true, Modifier.weight(1f), strike = true) { d ->
                            update(party.copy(todos = party.todos.map { if (it.id == x.id) it.copy(done = d) else it }))
                        }
                        IconText("✕") { update(party.copy(todos = party.todos.filter { it.id != x.id })) }
                    }
                }
            }
        }
        VSpace(8.dp)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Select(i.todoPhase(phase), PartyLogic.TODO_PHASES.map { it to i.todoPhase(it) }, asPill = true) { phase = it }
            HSpace(8.dp)
            CommitField("", { v ->
                if (v.isNotBlank()) update(party.copy(todos = party.todos + PartyTodo(PartyLogic.uid(), phase, v.trim())))
            }, Modifier.weight(1f), placeholder = "＋ ${i.t("party.todoAdd")}", clearOnCommit = true)
        }
        if (party.todos.isEmpty()) {
            VSpace(6.dp)
            SecondaryButton(i.t("party.todoDefaults"), Modifier.fillMaxWidth()) { update(party.copy(todos = PartyLogic.defaultTodos(party.format, party.kids, i.lang))) }
        }
    }
}
