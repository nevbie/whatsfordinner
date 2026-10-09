import SwiftUI
import WFDCore

/// List of upcoming and past parties.
@MainActor
struct PartyListView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    @State private var showPast = false

    var body: some View {
        let today = store.stats.today
        let parties = store.state.parties.values.sorted { $0.date < $1.date }
        let upcoming = parties.filter { $0.date >= today }
        let past = Array(parties.filter { $0.date < today }.reversed())
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(lang.t("party.title")).font(.title2.weight(.bold)).foregroundStyle(Theme.brand)
                Button("🎉 \(lang.t("party.new"))") {
                    let party = newParty(date: nextSaturday(today), settings: store.state.settings, lang: lang.lang)
                    store.saveParty(party)
                    router.openParty(party.id)
                }
                .buttonStyle(PillButtonStyle(primary: true))
                .frame(maxWidth: .infinity)
                Text(lang.t("party.upcoming")).font(.headline)
                if upcoming.isEmpty {
                    Text(lang.t("party.empty")).foregroundStyle(Theme.muted)
                }
                ForEach(upcoming) { p in PartyRow(party: p) }
                if !past.isEmpty {
                    DisclosureGroup(isExpanded: $showPast) {
                        VStack(spacing: 8) {
                            ForEach(past) { p in PartyRow(party: p) }
                        }
                    } label: {
                        Text(lang.t("party.past")).font(.headline).foregroundStyle(Theme.text)
                    }
                }
            }
            .padding(16)
        }
        .background(Theme.bg)
    }
}

@MainActor
private struct PartyRow: View {
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let party: Party

    private var meta: String {
        let format = lang.l.partyFormat(party.format)
        let done = party.todos.filter { $0.done ?? false }.count
        var meta = lang.day(party.date, "EEEdMMM")
        if let time = party.time, !time.isEmpty { meta += " · \(time)" }
        meta += " · \(format.name) · \(lang.t("party.guestsCount", n: guestTotal(party)))"
        if !party.todos.isEmpty { meta += " · \(lang.t("party.todosCount", ["done": String(done), "all": String(party.todos.count)]))" }
        return meta
    }

    var body: some View {
        let format = lang.l.partyFormat(party.format)
        Button {
            router.openParty(party.id)
        } label: {
            HStack(spacing: 10) {
                Text(format.icon).font(.title2)
                VStack(alignment: .leading, spacing: 2) {
                    Text(party.title).font(.headline).foregroundStyle(Theme.text)
                    Text(meta).font(.caption).foregroundStyle(Theme.muted)
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundStyle(Theme.muted)
            }
            .card()
        }
        .buttonStyle(.plain)
    }
}

/// Party planner: formats, guests, menu suggestions, who brings what, shopping list and to-dos.
@MainActor
struct PartyView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let id: String

    @State private var tab = "menu"
    @State private var confirmDelete = false

    var body: some View {
        if let party = store.state.parties[id] {
            SheetScaffold(title: "🎉 \(party.title)") {
                ScrollView {
                    VStack(alignment: .leading, spacing: 14) {
                        head(party)
                        switch tab {
                        case "guests": PartyGuestsTab(party: party, update: update)
                        case "shopping": PartyShoppingTab(party: party, update: update)
                        case "todos": PartyTodosTab(party: party, update: update)
                        default: PartyMenuTab(party: party, update: update)
                        }
                        Text(lang.t("party.notes")).font(.headline)
                        CommitField(placeholder: lang.t("party.notes"), value: party.note ?? "", multiline: true) { v in
                            var p = party
                            p.note = v.isEmpty ? nil : v
                            update(p)
                        }
                        Button(lang.t("party.delete")) { confirmDelete = true }
                            .buttonStyle(PillButtonStyle(danger: true))
                            .frame(maxWidth: .infinity)
                    }
                    .padding(16)
                }
                .safeAreaInset(edge: .bottom) {
                    Picker("", selection: $tab) {
                        ForEach(["menu", "guests", "shopping", "todos"], id: \.self) { x in
                            Text(lang.t("party.tab.\(x)")).tag(x)
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Theme.surface)
                }
            }
            .alert(lang.t("party.deleteConfirm"), isPresented: $confirmDelete) {
                Button(lang.t("party.delete"), role: .destructive) {
                    store.deleteParty(party.id)
                    router.close()
                }
                Button(lang.t("cancel"), role: .cancel) {}
            }
        } else {
            SheetScaffold(title: "") { Color.clear }
        }
    }

    private func update(_ p: Party) { store.saveParty(p) }

    private func head(_ party: Party) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Caption(text: lang.t("party.name"))
            CommitField(placeholder: lang.t("party.name"), value: party.title) { v in
                var p = party
                p.title = v.isEmpty ? party.title : v
                update(p)
            }
            HStack {
                Text(lang.t("party.date")).font(.subheadline)
                DatePicker("", selection: Binding(get: { fromISO(party.date) }, set: { d in
                    var p = party
                    p.date = toISO(d)
                    update(p)
                }), displayedComponents: .date)
                .labelsHidden()
                .environment(\.locale, lang.locale)
                Spacer()
                timeField(party)
            }
            FlowLayout(spacing: 6) {
                ForEach(PARTY_FORMATS, id: \.self) { f in
                    let label = lang.l.partyFormat(f)
                    Chip(label: "\(label.icon) \(label.name)", on: party.format == f) {
                        guard f != party.format else { return }
                        var p = party
                        // fresh checklist for the new format unless the family already started ticking
                        if !party.todos.contains(where: { $0.done ?? false }) {
                            p.todos = defaultTodos(format: f, kids: party.kids, lang: lang.lang)
                        }
                        p.format = f
                        update(p)
                    }
                }
            }
        }
    }

    @ViewBuilder private func timeField(_ party: Party) -> some View {
        if let time = party.time, !time.isEmpty {
            HStack(spacing: 4) {
                DatePicker("", selection: Binding(get: { Self.timeDate(time) }, set: { d in
                    var p = party
                    p.time = Self.timeString(d)
                    update(p)
                }), displayedComponents: .hourAndMinute)
                .labelsHidden()
                Button {
                    var p = party
                    p.time = nil
                    update(p)
                } label: {
                    Image(systemName: "xmark.circle").foregroundStyle(Theme.muted)
                }
                .buttonStyle(.plain)
            }
        } else {
            Button("＋ \(lang.t("party.time"))") {
                var p = party
                p.time = "18:00"
                update(p)
            }
            .buttonStyle(PillButtonStyle(small: true))
        }
    }

    private static func timeDate(_ s: String) -> Date {
        let parts = s.split(separator: ":").compactMap { Int($0) }
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        comps.hour = parts.first ?? 18
        comps.minute = parts.count > 1 ? parts[1] : 0
        return Calendar.current.date(from: comps) ?? Date()
    }

    private static func timeString(_ d: Date) -> String {
        let c = Calendar.current.dateComponents([.hour, .minute], from: d)
        let h = c.hour ?? 0, m = c.minute ?? 0
        return (h < 10 ? "0\(h)" : "\(h)") + ":" + (m < 10 ? "0\(m)" : "\(m)")
    }
}

// MARK: - tabs

@MainActor
private struct PartyMenuTab: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let party: Party
    let update: (Party) -> Void
    @State private var extraCourses: [String] = []

    private var ctx: PartySuggestContext {
        PartySuggestContext(pool: store.dishes, favorites: Set(store.state.favorites), today: store.stats.today)
    }

    var body: some View {
        let tpl = partyTemplate(party.format, guestTotal(party))
        let shown = PARTY_COURSES.filter { c in (tpl[c] ?? 0) > 0 || party.items.contains { $0.course == c } || extraCourses.contains(c) }
        let hidden = PARTY_COURSES.filter { !shown.contains($0) }
        VStack(alignment: .leading, spacing: 12) {
            Button("✨ \(lang.t("party.suggest"))") {
                var p = party
                p.items = suggestPartyItems(party, ctx)
                update(p)
            }
            .buttonStyle(PillButtonStyle(primary: true))
            .frame(maxWidth: .infinity)
            Text(lang.t("party.suggestHint")).font(.caption).foregroundStyle(Theme.muted)
            ForEach(shown, id: \.self) { course in
                courseBlock(course)
            }
            if !hidden.isEmpty {
                Menu {
                    ForEach(hidden, id: \.self) { c in
                        Button(lang.l.partyCourse(c)) { extraCourses.append(c) }
                    }
                } label: {
                    Text("＋ \(lang.t("party.addCourse"))")
                }
                .buttonStyle(PillButtonStyle(small: true))
            }
        }
    }

    private func courseBlock(_ course: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(lang.l.partyCourse(course)).font(.headline)
            ForEach(party.items.filter { $0.course == course }) { item in
                itemRow(item)
            }
            HStack {
                Chip(label: "＋ \(lang.t("party.addDish"))") { Task { await addDish(course) } }
                CommitField(placeholder: lang.t("party.addText"), value: "", clearAfterCommit: true) { v in
                    let text = v.trimmingCharacters(in: .whitespaces)
                    guard !text.isEmpty else { return }
                    var p = party
                    p.items.append(PartyItem(id: uid(), course: course, text: text))
                    update(p)
                }
            }
        }
    }

    private func itemRow(_ item: PartyItem) -> some View {
        let dish = item.dishId.flatMap { store.dishById[$0] }
        return VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                if let dish {
                    Button {
                        router.openDish(dish.id)
                    } label: {
                        DishNameView(dish: dish, size: .sm)
                    }
                    .buttonStyle(.plain)
                } else {
                    Text(item.text ?? "").font(.subheadline.weight(.semibold))
                }
                Spacer()
                if dish != nil {
                    Button {
                        var p = party
                        p.items = rerollPartyItem(party, item.id, ctx)
                        update(p)
                    } label: {
                        Image(systemName: "arrow.clockwise").padding(4)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(lang.t("combo.reroll"))
                }
                Button {
                    var p = party
                    p.items.removeAll { $0.id == item.id }
                    update(p)
                } label: {
                    Image(systemName: "xmark").padding(4)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(lang.t("combo.remove"))
            }
            Picker(lang.t("party.who"), selection: Binding(get: { item.broughtBy ?? "" }, set: { v in
                var p = party
                if let i = p.items.firstIndex(where: { $0.id == item.id }) { p.items[i].broughtBy = v.isEmpty ? nil : v }
                update(p)
            })) {
                Text("🏠 \(lang.t("party.us"))").tag("")
                ForEach(party.guests) { g in Text("🎁 \(g.name)").tag(g.id) }
            }
            .pickerStyle(.menu)
            .font(.caption)
        }
        .card()
    }

    private func addDish(_ course: String) async {
        guard let dishId = await router.pickDish(lang.l.partyCourse(course), filter: { partyCoursesOf($0).contains(course) }) else { return }
        // re-read the party: it may have changed while the picker was open
        guard var p = store.state.parties[party.id] else { return }
        p.items.append(PartyItem(id: uid(), course: course, dishId: dishId, locked: true))
        update(p)
    }
}

@MainActor
private struct PartyGuestsTab: View {
    @Environment(LangModel.self) private var lang
    let party: Party
    let update: (Party) -> Void
    @State private var name = ""
    @State private var note = ""

    var body: some View {
        let total = guestTotal(party)
        VStack(alignment: .leading, spacing: 10) {
            StepperRow(label: lang.t("party.adults"), value: party.adults, range: 1...60) { v in edit { $0.adults = v } }
            StepperRow(label: lang.t("party.kids"), value: party.kids, range: 0...40) { v in edit { $0.kids = v } }
            StepperRow(label: "🥕 \(lang.t("party.veggie"))", value: party.veggie, range: 0...max(0, total - party.vegan)) { v in edit { $0.veggie = v } }
            StepperRow(label: "🌱 \(lang.t("party.vegan"))", value: party.vegan, range: 0...max(0, total - party.veggie)) { v in edit { $0.vegan = v } }
            Caption(text: lang.t("party.allergies"))
            CommitField(placeholder: lang.t("party.allergies"), value: party.allergies ?? "", multiline: true) { v in
                edit { $0.allergies = v.isEmpty ? nil : v }
            }
            Caption(text: lang.t("party.guestList"))
            ForEach(party.guests) { g in
                HStack {
                    let brings = party.items.filter { $0.broughtBy == g.id }.count
                    (Text(g.name).bold()
                        + Text(g.note.map { " · \($0)" } ?? "").foregroundColor(Theme.muted)
                        + Text(brings > 0 ? " · 🎁 \(brings)" : "").foregroundColor(Theme.muted))
                        .font(.subheadline)
                    Spacer()
                    Button {
                        edit { p in
                            p.guests.removeAll { $0.id == g.id }
                            for i in p.items.indices where p.items[i].broughtBy == g.id { p.items[i].broughtBy = nil }
                        }
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(lang.t("combo.remove"))
                }
            }
            TextField(lang.t("party.guestName"), text: $name).textFieldStyle(.roundedBorder).onSubmit(addGuest)
            TextField(lang.t("party.guestNote"), text: $note).textFieldStyle(.roundedBorder).onSubmit(addGuest)
            Button(lang.t("party.add"), action: addGuest)
                .buttonStyle(PillButtonStyle(small: true))
                .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
        }
    }

    private func edit(_ change: (inout Party) -> Void) {
        var p = party
        change(&p)
        update(p)
    }

    private func addGuest() {
        let n = name.trimmingCharacters(in: .whitespaces)
        guard !n.isEmpty else { return }
        let nt = note.trimmingCharacters(in: .whitespaces)
        edit { $0.guests.append(PartyGuest(id: uid(), name: n, note: nt.isEmpty ? nil : nt)) }
        name = ""
        note = ""
    }
}

@MainActor
private struct PartyShoppingTab: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    let party: Party
    let update: (Party) -> Void

    var body: some View {
        let l = lang.lang
        let entries = shoppingList(party, store.dishById).sorted { a, b in
            let ta = party.shopping[a.key] ?? false, tb = party.shopping[b.key] ?? false
            if ta != tb { return !ta }
            return compareNames(store.catalog.ingredientName(a.key, l), store.catalog.ingredientName(b.key, l), l) == .orderedAscending
        }
        VStack(alignment: .leading, spacing: 8) {
            Text(lang.t("party.shoppingHint")).font(.caption).foregroundStyle(Theme.muted)
            if entries.isEmpty && party.extraShopping.isEmpty {
                Text(lang.t("party.shoppingEmpty")).foregroundStyle(Theme.muted)
            }
            ForEach(entries, id: \.key) { e in
                let names = orderedUnique(e.dishIds).map { id in store.dishById[id].map { dishLabel($0, l) } ?? id }
                checkRow(key: e.key, title: store.catalog.ingredientName(e.key, l), detail: names.joined(separator: ", "))
            }
            ForEach(party.extraShopping, id: \.self) { text in
                HStack {
                    checkRow(key: "x:\(text)", title: text, detail: nil)
                    Button {
                        var p = party
                        p.extraShopping.removeAll { $0 == text }
                        update(p)
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(lang.t("combo.remove"))
                }
            }
            CommitField(placeholder: "＋ \(lang.t("party.extraItem"))", value: "", clearAfterCommit: true) { v in
                let text = v.trimmingCharacters(in: .whitespaces)
                guard !text.isEmpty, !party.extraShopping.contains(text) else { return }
                var p = party
                p.extraShopping.append(text)
                update(p)
            }
            if party.shopping.values.contains(true) {
                Button(lang.t("party.resetChecks")) {
                    var p = party
                    p.shopping = [:]
                    update(p)
                }
                .buttonStyle(PillButtonStyle(small: true))
            }
        }
    }

    private func orderedUnique(_ ids: [String]) -> [String] {
        var seen = Set<String>()
        return ids.filter { seen.insert($0).inserted }
    }

    private func checkRow(key: String, title: String, detail: String?) -> some View {
        let on = party.shopping[key] ?? false
        return Button {
            var p = party
            p.shopping[key] = !on
            update(p)
        } label: {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Image(systemName: on ? "checkmark.square.fill" : "square").foregroundStyle(on ? Theme.accent : Theme.muted)
                (Text(title).strikethrough(on) + Text(detail.map { " · \($0)" } ?? "").font(.caption).foregroundColor(Theme.muted))
                    .foregroundColor(on ? Theme.muted : Theme.text)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 0)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

@MainActor
private struct PartyTodosTab: View {
    @Environment(LangModel.self) private var lang
    let party: Party
    let update: (Party) -> Void
    @State private var phase = "daybefore"

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            ForEach(TODO_PHASES, id: \.self) { ph in
                let list = party.todos.filter { $0.phase == ph }
                if !list.isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        (Text(lang.l.todoPhase(ph)).font(.headline)
                            + Text(" · \(lang.day(addDays(party.date, PHASE_OFFSET[ph] ?? 0)))").font(.caption).foregroundColor(Theme.muted))
                        ForEach(list) { todo in todoRow(todo) }
                    }
                }
            }
            HStack {
                Picker("", selection: $phase) {
                    ForEach(TODO_PHASES, id: \.self) { ph in Text(lang.l.todoPhase(ph)).tag(ph) }
                }
                .pickerStyle(.menu)
                CommitField(placeholder: "＋ \(lang.t("party.todoAdd"))", value: "", clearAfterCommit: true) { v in
                    let text = v.trimmingCharacters(in: .whitespaces)
                    guard !text.isEmpty else { return }
                    var p = party
                    p.todos.append(PartyTodo(id: uid(), phase: phase, text: text))
                    update(p)
                }
            }
            if party.todos.isEmpty {
                Button(lang.t("party.todoDefaults")) {
                    var p = party
                    p.todos = defaultTodos(format: party.format, kids: party.kids, lang: lang.lang)
                    update(p)
                }
                .buttonStyle(PillButtonStyle(small: true))
            }
        }
    }

    private func todoRow(_ todo: PartyTodo) -> some View {
        let done = todo.done ?? false
        return HStack(alignment: .firstTextBaseline) {
            Button {
                var p = party
                if let i = p.todos.firstIndex(where: { $0.id == todo.id }) { p.todos[i].done = !done }
                update(p)
            } label: {
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Image(systemName: done ? "checkmark.square.fill" : "square").foregroundStyle(done ? Theme.accent : Theme.muted)
                    Text(todo.text).strikethrough(done).foregroundStyle(done ? Theme.muted : Theme.text).multilineTextAlignment(.leading)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            Spacer()
            Button {
                var p = party
                p.todos.removeAll { $0.id == todo.id }
                update(p)
            } label: {
                Image(systemName: "xmark").foregroundStyle(Theme.muted)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(lang.t("combo.remove"))
        }
    }
}
