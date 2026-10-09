import SwiftUI
import WFDCore

private let INTRO = [
    "chinese": "combo.introChinese", "indian": "combo.introIndian", "tapas": "combo.introTapas",
    "abendbrot": "combo.introAbendbrot", "teller": "combo.introTeller", "salad": "combo.introSalad",
]

private let SLOT_KEYS: Set<String> = ["main", "main2", "veg", "veg2", "soup", "cold", "staple", "meal", "side", "dal", "curry", "curry2", "sabzi", "raita", "bread", "rice", "drink", "dessert", "tapaVeg", "tapaVeg2", "tapaMeat", "tapaMeat2", "tapaFish", "tapaFish2", "tapaBread", "abBread", "abBread2", "abCheese", "abMeat", "abSpread", "abSpread2", "abVeg", "abExtra", "abMore", "plMain", "plStarch", "plVeg", "slBase", "slExtra", "slExtra2", "slTopping", "slDressing"]

/// Meal builder (Chinese, Indian thali, tapas, Abendbrot, Teller, salad) with composition editor.
@MainActor
struct ComboBuilderView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    let combo: String
    let seedId: String?
    let date: String?

    @State private var meal: String
    @State private var composing = false
    @State private var options: ComboOptions
    @State private var entries: [ComboEntry]

    init(store: FamilyStore, combo: String, seedId: String?, date: String?, meal: String?) {
        self.combo = combo
        self.seedId = seedId
        self.date = date
        let meal = meal ?? "dinner"
        _meal = State(initialValue: meal)
        let s = store.state
        let o = ComboOptions(type: combo, adults: s.settings.adults, kids: s.settings.kids, counts: s.settings.builderCounts?[combo])
        _options = State(initialValue: o)
        let seed = seedId.flatMap { store.dishById[$0] }
        // re-open a day that already holds a combo of this builder: start from what is planned
        var initial: [ComboEntry] = []
        if let date, seed == nil {
            let planned = mealIds(s, date, meal).compactMap { store.dishById[$0] }.filter { comboTypeOfDish($0) == combo && $0.course != nil }
            initial = planned.map { d in
                let course = d.course ?? ""
                let key = (COMPOSE_GROUPS[combo] ?? []).first { $0.roles.contains(course) }?.key ?? "extra"
                return ComboEntry(slot: ComboSlot(key: key, roles: [course]), dishId: d.id, locked: true)
            }
        }
        if initial.isEmpty {
            initial = fillEntries(initialEntries(o, seed: seed), store.dishes, Self.pickContext(store: store, options: o, seed: seed))
        }
        _entries = State(initialValue: initial)
    }

    private var seed: Dish? { seedId.flatMap { store.dishById[$0] } }

    private static func pickContext(store: FamilyStore, options: ComboOptions, seed: Dish?) -> PickContext {
        PickContext(
            options: options,
            favorites: Set(store.state.favorites),
            prefer: Set(seed?.pairsWith ?? []),
            avoid: Set(store.state.labelDislikes.values.flatMap { $0 })
        )
    }

    private func ctx(_ o: ComboOptions) -> PickContext { Self.pickContext(store: store, options: o, seed: seed) }

    var body: some View {
        SheetScaffold(title: "\(comboIcon(combo)) \(lang.t("combo.\(combo)"))\(date.map { " · \(lang.day($0))" } ?? "")") {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(alignment: .top) {
                        Text(lang.t(INTRO[combo] ?? "")).font(.caption).foregroundStyle(Theme.muted)
                        Spacer()
                        Chip(label: "⚙︎ \(lang.t("builder.compose"))\(store.state.settings.builderCounts?[combo] != nil ? " •" : "")", on: composing) { composing.toggle() }
                    }
                    if composing { composePanel }
                    preferRow
                    if combo != "teller" && combo != "salad" { optionsPanel }
                    ForEach(Array(entries.enumerated()), id: \.offset) { i, e in
                        entryRow(i, e)
                    }
                    addSlotMenu
                }
                .padding(16)
            }
            .safeAreaInset(edge: .bottom) { footer }
        }
    }

    // MARK: parts

    private var footer: some View {
        HStack(spacing: 8) {
            Button("🎲 \(lang.t("combo.shuffle"))") { entries = fillEntries(entries, store.dishes, ctx(options)) }
                .buttonStyle(PillButtonStyle(small: true))
            Spacer()
            Picker(lang.t("meal.for"), selection: $meal) {
                ForEach(ALL_MEALS, id: \.self) { m in Text(lang.t("meal.short.\(m)")).tag(m) }
            }
            .pickerStyle(.menu)
            Button(date != nil ? lang.t("combo.plan") : lang.t("suggest.plan")) { Task { await plan() } }
                .buttonStyle(PillButtonStyle(primary: true, small: true))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Theme.surface)
    }

    private var composePanel: some View {
        let counts = options.counts ?? defaultCounts(options)
        let saved = store.state.settings.builderCounts?[combo]
        return VStack(alignment: .leading, spacing: 8) {
            ForEach(COMPOSE_GROUPS[combo] ?? [], id: \.key) { g in
                StepperRow(label: slotLabel(g.key), value: counts[g.key] ?? 0, range: 0...6) { n in
                    var c = counts
                    c[g.key] = n
                    change { $0.counts = c }
                }
            }
            HStack {
                Button(lang.t("builder.resetDefault")) {
                    var all = store.state.settings.builderCounts ?? [:]
                    all[combo] = nil
                    store.updateSettings(SettingsPatch(builderCounts: all))
                    change { $0.counts = nil }
                }
                .buttonStyle(PillButtonStyle(small: true))
                .disabled(saved == nil && options.counts == nil)
                Spacer()
                Button(lang.t("builder.saveDefault")) {
                    var all = store.state.settings.builderCounts ?? [:]
                    all[combo] = counts
                    store.updateSettings(SettingsPatch(builderCounts: all))
                    composing = false
                }
                .buttonStyle(PillButtonStyle(primary: true, small: true))
            }
        }
        .card()
    }

    private var preferRow: some View {
        HStack(spacing: 6) {
            Caption(text: lang.t("builder.prefer"))
            ChipRow {
                Chip(label: "🧒 \(lang.t("filter.kids"))", on: options.kidsFav) { change { $0.kidsFav.toggle() } }
                Chip(label: "⏱ \(lang.t("filter.quick"))", on: options.quick) { change { $0.quick.toggle() } }
                Chip(label: "♥ \(lang.t("filter.favoritesShort"))", on: options.favs) { change { $0.favs.toggle() } }
            }
        }
    }

    private var optionsPanel: some View {
        VStack(alignment: .leading, spacing: 8) {
            StepperRow(label: lang.t("combo.adults"), value: options.adults, range: 1...8) { v in change { $0.adults = v } }
            StepperRow(label: lang.t("combo.kids"), value: options.kids, range: 0...8) { v in change { $0.kids = v } }
            Picker("", selection: Binding(get: { options.diet }, set: { v in change { $0.diet = v } })) {
                ForEach(["any", "veggie", "vegan"], id: \.self) { d in Text(lang.t("filter.diet.\(d)")).tag(d) }
            }
            .pickerStyle(.segmented)
            FlowLayout(spacing: 6) {
                Chip(label: lang.t("filter.noSpicy"), on: options.noSpicy) { change { $0.noSpicy.toggle() } }
                if combo == "indian" {
                    Chip(label: "🥭 \(lang.t("combo.drink"))", on: options.drink) { change { $0.drink.toggle() } }
                    Chip(label: "🍮 \(lang.t("combo.dessert"))", on: options.dessert) { change { $0.dessert.toggle() } }
                }
            }
        }
        .card()
    }

    private func entryRow(_ i: Int, _ e: ComboEntry) -> some View {
        let d = e.dishId.flatMap { store.dishById[$0] }
        return VStack(alignment: .leading, spacing: 4) {
            Caption(text: slotLabel(e.slot.key))
            HStack(alignment: .top) {
                if let d {
                    Button {
                        router.openDish(d.id)
                    } label: {
                        HStack(alignment: .top, spacing: 4) {
                            DishNameView(dish: d, size: .md)
                            if d.has("spicy") { Text("🌶") }
                        }
                    }
                    .buttonStyle(.plain)
                } else {
                    Text(lang.t("combo.noMatch")).foregroundStyle(Theme.muted)
                }
                Spacer(minLength: 4)
                HStack(spacing: 2) {
                    iconButton("arrow.clockwise", lang.t("combo.reroll")) {
                        entries = rerollEntry(entries, i, store.dishes, ctx(options))
                    }
                    iconButton(e.locked ? "lock.fill" : "lock.open", lang.t(e.locked ? "combo.unlock" : "combo.lock"), on: e.locked) {
                        if entries.indices.contains(i) { entries[i].locked.toggle() }
                    }
                    iconButton("list.bullet", lang.t("combo.pick")) { Task { await choose(i) } }
                    iconButton("xmark", lang.t("combo.remove")) {
                        if entries.indices.contains(i) { entries.remove(at: i) }
                    }
                }
            }
        }
        .card()
        .overlay(alignment: .leading) {
            if e.locked {
                Rectangle().fill(Theme.accent).frame(width: 3).padding(.vertical, 8)
            }
        }
    }

    private func iconButton(_ symbol: String, _ label: String, on: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol)
                .frame(width: 32, height: 32)
                .foregroundStyle(on ? Theme.accent : Theme.muted)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private var addSlotMenu: some View {
        Menu {
            ForEach(COMPOSE_GROUPS[combo] ?? [], id: \.key) { g in
                Button(slotLabel(g.key)) { addSlot(g.key) }
            }
        } label: {
            Text("＋ \(lang.t("combo.addSlot")) …")
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(PillButtonStyle())
    }

    // MARK: actions

    /// Keep what the family locked, rebuild the rest for the new settings.
    private func change(_ patch: (inout ComboOptions) -> Void) {
        var o = options
        patch(&o)
        options = o
        let locked = entries.filter { $0.locked && $0.dishId != nil }
        var fresh = initialEntries(o, seed: seed)
        for l in locked {
            if let i = fresh.firstIndex(where: { f in f.dishId == nil && l.slot.roles.contains { f.slot.roles.contains($0) } }) {
                fresh[i].dishId = l.dishId
                fresh[i].locked = true
            }
        }
        entries = fillEntries(fresh, store.dishes, ctx(o))
    }

    private func choose(_ i: Int) async {
        guard entries.indices.contains(i) else { return }
        let slot = entries[i].slot
        var loose = options
        loose.diet = "any"
        loose.noSpicy = false
        let allowed = Set(slotCandidates(slot, store.dishes, loose).map(\.id))
        guard let id = await router.pickDish(lang.t("combo.pick"), filter: { allowed.contains($0.id) }) else { return }
        if entries.indices.contains(i) {
            entries[i].dishId = id
            entries[i].locked = true
        }
    }

    private func addSlot(_ groupKey: String) {
        let slot: ComboSlot
        if let g = (COMPOSE_GROUPS[combo] ?? []).first(where: { $0.key == groupKey }) {
            slot = ComboSlot(key: g.key, roles: g.roles)
        } else {
            slot = ComboSlot(key: "extra", roles: ALL_BUILDER_COURSES[combo] ?? [])
        }
        let chosen = entries.compactMap { $0.dishId.flatMap { store.dishById[$0] } }
        let dish = pickForSlot(slot, chosen, store.dishes, ctx(options), systemRng)
        entries.append(ComboEntry(slot: slot, dishId: dish?.id, locked: false))
    }

    private func plan() async {
        var target = date
        if target == nil { target = await router.pickDay() }
        guard let target else { return }
        store.setMeal(target, meal, entries.compactMap(\.dishId))
        router.close()
    }

    private func slotLabel(_ key: String) -> String {
        let k = SLOT_KEYS.contains(key) ? key : groupKeyOf(key)
        if SLOT_KEYS.contains(k) { return lang.t("slot.\(k)") }
        if let g = (COMPOSE_GROUPS[combo] ?? []).first(where: { $0.key == k }), g.roles.count == 1 {
            let label = lang.l.course(g.roles[0])
            if let r = label.range(of: ": ") { return String(label[r.upperBound...]) }
            return label
        }
        return lang.t("slot.extra")
    }
}
