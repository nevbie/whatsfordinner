import SwiftUI
import WFDCore

private let COUNT = 3
private let FILTER_KEY = "wfd:filters:suggest"

/// Start page: today's/tomorrow's dinner, three ideas, filters and quick builder tiles.
@MainActor
struct SuggestView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    @State private var filters = FilterStorage.load(FILTER_KEY)
    @State private var showFilters = false
    @State private var ids: [String] = []
    @State private var drawn = false

    private var today: String { store.stats.today }
    /// Once today's dinner is marked as over, everything here is about tomorrow.
    private var todayDone: Bool { store.state.plan[today]?.isDone ?? false }
    private var target: String { todayDone ? addDays(today, 1) : today }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                header
                todayCard
                ideasHeader
                if showFilters { filterCard }
                let suggestions = ids.compactMap { store.dishById[$0] }
                if suggestions.isEmpty {
                    Text(lang.t("suggest.none")).foregroundStyle(Theme.muted)
                }
                ForEach(suggestions) { dish in
                    SuggestionCard(dish: dish, todayDone: todayDone, target: target)
                }
                quickTiles
            }
            .padding(16)
        }
        .background(Theme.bg)
        .onAppear {
            if !drawn {
                drawn = true
                draw(excludeCurrent: false)
            }
        }
        .onChange(of: filters) { _, newValue in
            FilterStorage.save(FILTER_KEY, newValue)
            draw(excludeCurrent: false)
        }
    }

    /// Re-draw only when asked (filters / "Neu"), not on every plan change.
    private func draw(excludeCurrent: Bool) {
        let ctx = SuggestContext(state: store.state, filters: filters, today: today)
        var next = suggest(store.dishes, ctx, COUNT, exclude: excludeCurrent ? Set(ids) : [])
        if next.count < COUNT { next = suggest(store.dishes, ctx, COUNT) }
        ids = next.map(\.id)
    }

    private var header: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(lang.t(todayDone ? "appTitleTomorrow" : "appTitle"))
                .font(.title2.weight(.bold))
                .foregroundStyle(Theme.brand)
            Spacer()
            Text(lang.day(today, "EEEEdMMMM"))
                .font(.caption)
                .foregroundStyle(Theme.muted)
        }
    }

    private var todayCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Caption(text: lang.t(todayDone ? "suggest.tomorrow" : "suggest.today"))
            let dishes = (store.state.plan[target]?.dishes ?? []).compactMap { store.dishById[$0] }
            if dishes.isEmpty {
                Text(lang.t(todayDone ? "suggest.nothingTomorrow" : "suggest.nothingToday"))
                    .font(.subheadline)
                    .foregroundStyle(Theme.muted)
            } else {
                ForEach(Array(dishes.enumerated()), id: \.offset) { _, d in
                    Button {
                        router.openDish(d.id)
                    } label: {
                        DishNameView(dish: d, size: .sm)
                    }
                    .buttonStyle(.plain)
                }
            }
            if todayDone {
                HStack {
                    Text("✓ \(lang.t("suggest.todayDone"))").font(.footnote)
                    Button(lang.t("undo")) { setTodayDone(false) }
                        .font(.footnote.weight(.semibold))
                }
            } else {
                Button {
                    setTodayDone(true)
                } label: {
                    Label(lang.t("suggest.markDone"), systemImage: "square")
                        .font(.footnote)
                        .foregroundStyle(Theme.text)
                }
                .buttonStyle(.plain)
            }
        }
        .card()
    }

    private func setTodayDone(_ done: Bool) {
        var entry = store.state.plan[today] ?? DayEntry()
        entry.done = done
        store.setDay(today, entry)
    }

    private var ideasHeader: some View {
        HStack {
            Text(lang.t("suggest.ideas")).font(.headline)
            Spacer()
            Chip(label: "🎲 \(lang.t("suggest.more"))") { draw(excludeCurrent: true) }
            FilterToggle(count: activeFilterCount(filters), shown: $showFilters)
        }
    }

    private var filterCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            FilterPanel(filters: $filters)
            HStack {
                Button(lang.t("filter.reset")) { filters = .defaults }
                    .buttonStyle(PillButtonStyle(small: true))
                    .disabled(activeFilterCount(filters) == 0)
                Spacer()
                Button(lang.t("filter.close")) { showFilters = false }
                    .buttonStyle(PillButtonStyle(primary: true, small: true))
            }
        }
        .card()
    }

    private var quickTiles: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
            tile("🥢", "家常菜") { router.openCombo("chinese", date: target) }
            tile("🍛", "थाली") { router.openCombo("indian", date: target) }
            tile("🫒", "Tapas") { router.openCombo("tapas", date: target) }
            tile("🥨", lang.t("combo.abendbrot")) { router.openCombo("abendbrot", date: target) }
            tile("🥗", lang.t("combo.saladShort")) { router.openCombo("salad", date: target) }
            tile("🎉", lang.t("nav.party")) { router.tab = .party }
        }
        .padding(.top, 4)
    }

    private func tile(_ icon: String, _ label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text(icon).font(.title2)
                Text(label).font(.caption.weight(.semibold)).lineLimit(1).minimumScaleFactor(0.7)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .foregroundStyle(Theme.text)
            .background(Theme.surface2, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

/// One idea with Heute / plan / builder buttons.
@MainActor
private struct SuggestionCard: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let dish: Dish
    let todayDone: Bool
    let target: String

    var body: some View {
        let combo = comboTypeOf(dish)
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                DishNameView(dish: dish, size: .md)
                Spacer(minLength: 4)
                if dish.kind != "combo" { FavButton(dish: dish) }
            }
            HStack(alignment: .bottom, spacing: 6) {
                VStack(alignment: .leading, spacing: 4) {
                    DishMetaView(dish: dish, compact: true)
                    FanTags(dish: dish)
                }
                Spacer(minLength: 4)
                if dish.kind != "combo" {
                    Button(lang.t(todayDone ? "suggest.tomorrowShort" : "suggest.todayShort")) { take() }
                        .buttonStyle(PillButtonStyle(primary: true, small: true))
                    Button {
                        Task { await planLater() }
                    } label: {
                        Image(systemName: "calendar.badge.plus")
                    }
                    .buttonStyle(PillButtonStyle(small: true))
                    .accessibilityLabel(lang.t("suggest.plan"))
                }
                if let combo {
                    Button {
                        router.openCombo(combo, seedId: dish.kind == "combo" ? nil : dish.id, date: dish.kind == "combo" ? target : nil)
                    } label: {
                        Text(dish.kind == "combo" ? "\(comboIcon(combo)) \(lang.t("suggest.buildShort"))" : comboIcon(combo))
                    }
                    .buttonStyle(PillButtonStyle(primary: dish.kind == "combo", small: true))
                    .accessibilityLabel(lang.t("suggest.buildMeal"))
                }
            }
        }
        .card()
        .contentShape(Rectangle())
        .onTapGesture { router.openDish(dish.id) }
    }

    private func take() {
        if dish.kind == "combo", let combo = comboTypeOf(dish) {
            router.openCombo(combo, date: target)
            return
        }
        store.setMeal(target, "dinner", [dish.id])
    }

    private func planLater() async {
        if dish.kind == "combo", let combo = dish.combo {
            router.openCombo(combo)
            return
        }
        if let date = await router.pickDay() { store.setMeal(date, "dinner", [dish.id]) }
    }
}
