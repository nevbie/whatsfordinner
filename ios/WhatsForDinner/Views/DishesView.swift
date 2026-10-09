import SwiftUI
import WFDCore

private let FILTER_KEY = "wfd:filters:dishes"

/// All dishes in one list with search over everything, areas, filters and sort.
@MainActor
struct DishesView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    @State private var filters = FilterStorage.load(FILTER_KEY)
    @State private var query = ""
    @State private var area = "all"
    @State private var sortRecent = false
    @State private var showFilters = false

    private var list: [Dish] {
        let favs = Set(store.state.favorites)
        let last = store.stats.last
        let l = lang.lang
        var out = store.dishes.filter { d in
            if area != "all" && areaOf(d) != area { return false }
            if d.kind == "eatout" {
                if filters.favoritesOnly && !favs.contains(d.id) { return false }
            } else if !matchesFilters(d, filters, favs, store.state.labelFavorites, store.state.labelDislikes) {
                return false
            }
            return query.isEmpty || matchesQuery(d, query, store.catalog)
        }
        if sortRecent {
            out.sort { a, b in
                let la = last[a.id] ?? "", lb = last[b.id] ?? ""
                return la != lb ? la < lb : sortByName(a, b, l)
            }
        } else {
            out.sort { sortByName($0, $1, l) }
        }
        return out
    }

    var body: some View {
        let items = list
        let active = activeFilterCount(filters)
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        TextField(lang.t("dishes.searchAll"), text: $query)
                            .textFieldStyle(.roundedBorder)
                            .autocorrectionDisabled()
                        FilterToggle(count: active, shown: $showFilters)
                    }
                    ChipRow {
                        ForEach(DISH_AREAS, id: \.self) { a in
                            Chip(label: lang.t("dishes.area.\(a)"), on: area == a) { area = a }
                        }
                    }
                    if showFilters { filterPanel(count: items.count, active: active) }
                    HStack {
                        Text(items.count == 1 ? lang.t("dishes.countOne") : lang.t("dishes.count", n: items.count))
                        Spacer()
                        if active > 0 && !showFilters {
                            Button("\(lang.t("filter.active", n: active)) · \(lang.t("filter.reset"))") { filters = .defaults }
                                .buttonStyle(.borderless)
                        }
                    }
                    .font(.caption)
                    .foregroundStyle(Theme.muted)
                    if area == "eatout" {
                        Button(lang.t("dish.newRestaurant")) { router.openForm(kind: "eatout") }
                            .buttonStyle(PillButtonStyle())
                    }
                }
                .listRowBackground(Theme.bg)
            }
            Section {
                ForEach(items) { d in
                    DishRow(dish: d)
                }
            }
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
        .background(Theme.bg)
        .navigationTitle(lang.t("nav.dishes"))
        .overlay(alignment: .bottomTrailing) {
            if query.isEmpty {
                Button {
                    router.openForm()
                } label: {
                    Label(lang.t("dishes.add"), systemImage: "plus")
                }
                .buttonStyle(PillButtonStyle(primary: true))
                .shadow(radius: 3, y: 1)
                .padding(16)
            }
        }
        .onChange(of: filters) { _, newValue in FilterStorage.save(FILTER_KEY, newValue) }
    }

    private func filterPanel(count: Int, active: Int) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            FilterPanel(filters: $filters)
            Picker("", selection: $sortRecent) {
                Text(lang.t("dishes.sort.name")).tag(false)
                Text(lang.t("dishes.sort.recent")).tag(true)
            }
            .pickerStyle(.segmented)
            HStack {
                Button(lang.t("filter.reset")) { filters = .defaults }
                    .buttonStyle(PillButtonStyle(small: true))
                    .disabled(active == 0)
                Spacer()
                Button(lang.t("filter.done", n: count)) { showFilters = false }
                    .buttonStyle(PillButtonStyle(primary: true, small: true))
            }
        }
        .card()
    }
}

@MainActor
struct DishRow: View {
    @Environment(Router.self) private var router
    let dish: Dish

    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 3) {
                DishNameView(dish: dish, size: .sm)
                DishMetaView(dish: dish)
                FanTags(dish: dish)
            }
            Spacer(minLength: 4)
            if dish.kind != "combo" { FavButton(dish: dish) }
        }
        .contentShape(Rectangle())
        .onTapGesture { router.openDish(dish.id) }
        .listRowBackground(Theme.bg)
    }
}
