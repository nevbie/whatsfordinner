import SwiftUI
import WFDCore

/// Pick a dish (favourites first, sides/party/baking last).
@MainActor
struct DishPickerView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let itemId: UUID
    let title: String
    let filter: ((Dish) -> Bool)?

    @State private var query = ""

    private var list: [Dish] {
        let favs = Set(store.state.favorites)
        let l = lang.lang
        let secondary: (Dish) -> Bool = { $0.kind == "side" || $0.kind == "party" || $0.kind == "bake" }
        return store.dishes
            .filter { (filter?($0) ?? true) && matchesQuery($0, query, store.catalog) }
            .sorted { a, b in
                let fa = favs.contains(a.id), fb = favs.contains(b.id)
                if fa != fb { return fa }
                let sa = secondary(a), sb = secondary(b)
                if sa != sb { return !sa }
                return sortByName(a, b, l)
            }
    }

    var body: some View {
        SheetScaffold(title: title, onClose: { router.finish(itemId, nil) }) {
            List(list) { d in
                Button {
                    router.finish(itemId, d.id)
                } label: {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 3) {
                            DishNameView(dish: d, size: .sm)
                            DishMetaView(dish: d)
                            FanTags(dish: d)
                        }
                        Spacer()
                        if store.isFavorite(d.id) {
                            Image(systemName: "heart.fill").foregroundStyle(Theme.accent)
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .listRowBackground(Theme.bg)
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: lang.t("dishes.search"))
        }
    }
}

/// Pick one of the next 14 days.
@MainActor
struct DayPickerView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let itemId: UUID

    var body: some View {
        let today = store.stats.today
        SheetScaffold(title: lang.t("dish.planFor"), onClose: { router.finish(itemId, nil) }) {
            List((0..<14).map { addDays(today, $0) }, id: \.self) { date in
                Button {
                    router.finish(itemId, date)
                } label: {
                    HStack {
                        Text(date == today ? lang.t("plan.today") : lang.day(date, "EEEEdM"))
                            .font(.subheadline.weight(.semibold))
                        Spacer()
                        Text(plannedText(date))
                            .font(.caption)
                            .foregroundStyle(Theme.muted)
                            .lineLimit(1)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .listRowBackground(Theme.bg)
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
        }
        .presentationDetents([.medium, .large])
    }

    private func plannedText(_ date: String) -> String {
        guard let entry = store.state.plan[date] else { return "—" }
        return entry.dishes.compactMap { store.dishById[$0] }.map { dishLabel($0, lang.lang) }.joined(separator: ", ")
    }
}
