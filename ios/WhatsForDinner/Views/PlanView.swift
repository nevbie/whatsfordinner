import SwiftUI
import WFDCore

/// Week plan: compact day rows with meals, markers, parties and a ⋯ action panel.
@MainActor
struct PlanView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    @State private var start = weekStart(todayISO())
    @State private var expanded: String?
    @State private var confirmClear: String?

    private var today: String { store.stats.today }
    private var days: [String] { (0..<7).map { addDays(start, $0) } }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 10) {
                Text(lang.t("plan.title")).font(.title2.weight(.bold)).foregroundStyle(Theme.brand)
                weekNav
                VStack(spacing: 0) {
                    ForEach(days, id: \.self) { date in
                        DayRow(date: date, today: today, expanded: $expanded, onFill: { fill([date]) }, onClear: { clear(date) })
                        Divider()
                    }
                }
                .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).stroke(Theme.line, lineWidth: 1))
                let empty = emptyFuture
                if !empty.isEmpty {
                    Button("🎲 \(lang.t("plan.fillWeek"))") { fill(empty) }
                        .buttonStyle(PillButtonStyle())
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(16)
        }
        .background(Theme.bg)
        .alert(lang.t("plan.clearConfirm"), isPresented: Binding(get: { confirmClear != nil }, set: { if !$0 { confirmClear = nil } })) {
            Button(lang.t("plan.clear"), role: .destructive) {
                if let date = confirmClear { clearNow(date) }
                confirmClear = nil
            }
            Button(lang.t("cancel"), role: .cancel) { confirmClear = nil }
        }
    }

    private var weekNav: some View {
        HStack {
            Button { start = addDays(start, -7) } label: { Image(systemName: "chevron.left").padding(8) }
                .accessibilityLabel("←")
            Spacer()
            Chip(label: "\(lang.day(days[0], "dMMM")) – \(lang.day(days[6], "dMMM"))") { start = weekStart(today) }
            Spacer()
            Button { start = addDays(start, 7) } label: { Image(systemName: "chevron.right").padding(8) }
                .accessibilityLabel("→")
        }
    }

    /// Days where everyone is out don't need a dinner.
    private var emptyFuture: [String] {
        days.filter { d in
            d >= today && (store.state.plan[d]?.dishes.isEmpty ?? true) && !(store.state.plan[d]?.labels?.contains("out") ?? false)
        }
    }

    /// Suggest dishes for the given (empty) days, avoiding repeats within the week.
    private func fill(_ targets: [String]) {
        let exclude = Set(days.flatMap { store.state.plan[$0]?.dishes ?? [] })
        let picks = suggest(store.dishes, SuggestContext(state: store.state, filters: .defaults, today: today), targets.count, exclude: exclude)
        for (i, date) in targets.enumerated() where i < picks.count {
            var entry = store.state.plan[date] ?? DayEntry()
            entry.dishes = [picks[i].id]
            store.setDay(date, entry)
        }
    }

    private func clear(_ date: String) {
        if dayDishIds(store.state.plan[date]).count == 1 { clearNow(date) } else { confirmClear = date }
    }

    private func clearNow(_ date: String) {
        let done = store.state.plan[date]?.isDone ?? false
        store.setDay(date, done ? DayEntry(done: true) : nil)
    }
}

@MainActor
private struct DayRow: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let date: String
    let today: String
    @Binding var expanded: String?
    let onFill: () -> Void
    let onClear: () -> Void

    @State private var customLabel = ""

    private var entry: DayEntry? { store.state.plan[date] }
    private var isOpen: Bool { expanded == date }

    var body: some View {
        let allIds = dayDishIds(entry)
        let parties = store.state.parties.values.filter { $0.date == date }.sorted { $0.title < $1.title }
        let out = entry?.labels?.contains("out") ?? false
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .top, spacing: 8) {
                VStack(alignment: .leading, spacing: 0) {
                    Text(lang.day(date, "EEE")).font(.subheadline.weight(.bold))
                    Text(lang.day(date, "dM")).font(.caption).foregroundStyle(Theme.muted)
                }
                .frame(width: 46, alignment: .leading)
                .foregroundStyle(date == today ? Theme.accent : Theme.text)

                VStack(alignment: .leading, spacing: 4) {
                    labelsLine
                    mealsLines
                    ForEach(parties) { p in
                        Button {
                            router.openParty(p.id)
                        } label: {
                            Text("🎉 \(p.title)").font(.subheadline.weight(.semibold))
                                + Text(" · \(lang.t("party.guestsCount", n: guestTotal(p)))").font(.caption).foregroundColor(Theme.muted)
                        }
                        .buttonStyle(.plain)
                    }
                    if allIds.isEmpty && parties.isEmpty && !out {
                        HStack(spacing: 14) {
                            Button("＋ \(lang.t("plan.add"))") { Task { await addDish("dinner") } }
                                .font(.subheadline)
                            if date >= today {
                                Button("🎲", action: onFill).accessibilityLabel(lang.t("plan.suggest"))
                            }
                        }
                    }
                    if date == today {
                        Button {
                            var e = entry ?? DayEntry()
                            e.done = !(entry?.isDone ?? false)
                            store.setDay(date, e)
                        } label: {
                            Label(lang.t("plan.done"), systemImage: (entry?.isDone ?? false) ? "checkmark.square.fill" : "square")
                                .font(.caption)
                        }
                        .buttonStyle(.plain)
                        .foregroundStyle(Theme.text)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                if !allIds.isEmpty {
                    Button(action: onClear) { Image(systemName: "xmark").font(.caption) }
                        .buttonStyle(.plain)
                        .foregroundStyle(Theme.muted)
                        .padding(6)
                        .accessibilityLabel(lang.t("plan.clear"))
                }
                Button {
                    expanded = isOpen ? nil : date
                } label: {
                    Image(systemName: "ellipsis").padding(6)
                }
                .buttonStyle(.plain)
                .foregroundStyle(isOpen ? Theme.accent : Theme.muted)
                .accessibilityLabel(lang.t("plan.actions"))
            }
            if isOpen { actions }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .opacity(date < today ? 0.7 : 1)
        .background(date == today ? Theme.accentSoft.opacity(0.5) : Color.clear)
    }

    @ViewBuilder private var labelsLine: some View {
        if let labels = entry?.labels, !labels.isEmpty {
            FlowLayout(spacing: 4) {
                ForEach(labels, id: \.self) { l in
                    Text(labelText(l))
                        .font(.caption2.weight(.semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Theme.surface2, in: Capsule())
                }
            }
        }
    }

    @ViewBuilder private var mealsLines: some View {
        let extra = EXTRA_MEALS.filter { !(entry?.meals?[$0] ?? []).isEmpty }
        ForEach(extra, id: \.self) { m in
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                mealTag(m)
                dishButtons(entry?.meals?[m] ?? [], showTranslation: false, meal: m)
            }
        }
        let dinner = entry?.dishes ?? []
        if !dinner.isEmpty {
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                if !extra.isEmpty { mealTag("dinner") }
                dishButtons(dinner, showTranslation: dinner.count == 1, meal: "dinner")
            }
        }
    }

    private func mealTag(_ m: String) -> some View {
        Text(lang.t("meal.short.\(m)"))
            .font(.caption2.weight(.bold))
            .foregroundStyle(Theme.muted)
    }

    private func dishButtons(_ ids: [String], showTranslation: Bool, meal: String) -> some View {
        FlowLayout(spacing: 6) {
            ForEach(Array(ids.enumerated()), id: \.offset) { _, id in
                let d = store.dishById[id]
                Button {
                    if meal == "dinner", let d, d.kind == "combo", let combo = d.combo {
                        router.openCombo(combo, date: date)
                    } else {
                        router.openDish(id)
                    }
                } label: {
                    dishText(d, id: id, showTranslation: showTranslation, meal: meal)
                        .font(.subheadline)
                        .multilineTextAlignment(.leading)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func dishText(_ d: Dish?, id: String, showTranslation: Bool, meal: String) -> Text {
        guard let d else { return Text(id) }
        if meal != "dinner" { return Text(dishLabel(d, lang.lang)) }
        let label = dishLabel(d, lang.lang)
        if showTranslation && label != d.name.orig {
            return Text(d.name.orig).foregroundColor(Theme.text) + Text(" · \(label)").foregroundColor(Theme.muted)
        }
        return Text(d.name.orig).foregroundColor(Theme.text)
    }

    private func labelText(_ label: String) -> String {
        if label == "out" || label == "event" { return lang.t("plan.label.\(label)") }
        if label.hasPrefix("away:") {
            let name = store.label(String(label.dropFirst(5)))?.name ?? "?"
            return "👤 \(lang.t("plan.label.away", ["name": name]))"
        }
        return label
    }

    private var actions: some View {
        let presets = ["out", "event"] + store.state.labels.map { "away:\($0.id)" }
        let current = entry?.labels ?? []
        return VStack(alignment: .leading, spacing: 8) {
            FlowLayout(spacing: 6) {
                ForEach(ALL_MEALS, id: \.self) { m in
                    ForEach(Array(store.mealIds(date, m).enumerated()), id: \.offset) { i, id in
                        Chip(label: "✕ \(store.dishById[id].map { dishLabel($0, lang.lang) } ?? id)") { removeDish(m, i) }
                    }
                }
                Chip(label: "＋ \(lang.t("meal.dinner"))") { Task { await addDish("dinner") } }
                ForEach(EXTRA_MEALS, id: \.self) { m in
                    Chip(label: "＋ \(lang.t("meal.\(m)"))") { Task { await addDish(m) } }
                }
                Chip(label: lang.t("plan.eatout")) { Task { await addDish("dinner", only: { $0.kind == "eatout" }) } }
                ForEach(["chinese", "indian", "tapas", "abendbrot", "salad"], id: \.self) { c in
                    Chip(label: comboIcon(c)) { router.openCombo(c, date: date) }
                        .accessibilityLabel(lang.t("combo.\(c)"))
                }
                Chip(label: "🎉") { createParty() }
                    .accessibilityLabel(lang.t("party.new"))
            }
            Caption(text: lang.t("plan.labels"))
            FlowLayout(spacing: 6) {
                ForEach(presets + current.filter { !presets.contains($0) }, id: \.self) { l in
                    Chip(label: labelText(l), on: current.contains(l)) { toggleLabel(l) }
                }
            }
            HStack {
                TextField(lang.t("plan.labelCustom"), text: $customLabel)
                    .textFieldStyle(.roundedBorder)
                    .onSubmit(addCustomLabel)
                Button("＋", action: addCustomLabel)
                    .buttonStyle(PillButtonStyle(small: true))
                    .disabled(customLabel.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        }
        .padding(.leading, 54)
    }

    private func addCustomLabel() {
        let text = customLabel.trimmingCharacters(in: .whitespaces)
        if !text.isEmpty { toggleLabel(text) }
        customLabel = ""
    }

    private func toggleLabel(_ label: String) {
        store.setDay(date, entryTogglingLabel(store.state, date, label))
    }

    private func addDish(_ meal: String, only: ((Dish) -> Bool)? = nil) async {
        // Kaffee & Kuchen: offer cakes, desserts and sweets first
        var filter: ((Dish) -> Bool)? = only
        if filter == nil && meal == "coffee" {
            filter = { (d: Dish) -> Bool in d.kind == "bake" || d.has("sweet") }
        }
        let title = only != nil ? lang.t("plan.eatout") : (meal == "dinner" ? lang.t("plan.pickDish") : lang.t("meal.\(meal)"))
        guard let id = await router.pickDish(title, filter: filter) else { return }
        if let dish = store.dishById[id], dish.kind == "combo", let combo = dish.combo {
            router.openCombo(combo, date: date, meal: meal)
            return
        }
        store.setMeal(date, meal, store.mealIds(date, meal) + [id])
    }

    private func removeDish(_ meal: String, _ index: Int) {
        var next = store.mealIds(date, meal)
        guard next.indices.contains(index) else { return }
        next.remove(at: index)
        if next.isEmpty && dayDishIds(entry).count <= 1 && !(entry?.isDone ?? false) {
            store.setDay(date, nil)
            return
        }
        store.setMeal(date, meal, next)
    }

    private func createParty() {
        let party = newParty(date: date, settings: store.state.settings, lang: lang.lang)
        store.saveParty(party)
        router.openParty(party.id)
    }
}
