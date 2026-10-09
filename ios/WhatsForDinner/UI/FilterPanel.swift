import SwiftUI
import WFDCore

private let STAPLE_ICONS = ["bread": "🥖", "pasta": "🍝", "rice": "🍚", "potatoes": "🥔", "dough": "🥟"]

/// The filter panel shared by suggestions and the dish list (web: FilterBar).
@MainActor
struct FilterPanel: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Binding var filters: Filters
    var showEatOut = true

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Picker("", selection: $filters.diet) {
                ForEach(["any", "veggie", "vegan"], id: \.self) { d in
                    Text(lang.t("filter.diet.\(d)")).tag(d)
                }
            }
            .pickerStyle(.segmented)

            group(lang.t("filter.cuisine")) {
                ForEach(REGIONS, id: \.self) { r in
                    Chip(label: lang.t("region.\(r)"), on: filters.regions.contains(r)) { filters.regions = toggled(filters.regions, r) }
                }
                ForEach(CUISINE_GROUPS, id: \.self) { c in
                    Chip(label: lang.t("cg.\(c)"), on: filters.cuisines.contains(c)) { filters.cuisines = toggled(filters.cuisines, c) }
                }
            }

            group(lang.t("filter.staple")) {
                ForEach(STAPLES, id: \.self) { s in
                    Chip(label: "\(STAPLE_ICONS[s] ?? "") \(lang.t("staple.\(s)"))", on: filters.staples.contains(s)) { filters.staples = toggled(filters.staples, s) }
                }
            }

            group(lang.t("filter.props")) {
                Chip(label: "🧒 \(lang.t("filter.kids"))", on: filters.kids) { filters.kids.toggle() }
                Chip(label: lang.t("filter.noSpicy"), on: filters.noSpicy) { filters.noSpicy.toggle() }
                Chip(label: "⏱ \(lang.t("filter.quick"))", on: filters.maxEffort == 1) { filters.maxEffort = filters.maxEffort == 1 ? 3 : 1 }
                Chip(label: lang.t("filter.noProject"), on: filters.maxEffort == 2) { filters.maxEffort = filters.maxEffort == 2 ? 3 : 2 }
                Chip(label: "🍮 \(lang.t("filter.sweet"))", on: filters.sweetOnly) { filters.sweetOnly.toggle() }
            }

            group(lang.t("filter.loved")) {
                Chip(label: "♥ \(lang.t("filter.favorites"))", on: filters.favoritesOnly) { filters.favoritesOnly.toggle() }
                if !store.state.labels.isEmpty {
                    Chip(label: "👍 \(lang.t("filter.noDislikes"))", on: filters.noDislikes) { filters.noDislikes.toggle() }
                }
                ForEach(store.state.labels) { l in
                    Chip(label: "★ \(l.name)", on: filters.favLabels.contains(l.id), color: l.color) { filters.favLabels = toggled(filters.favLabels, l.id) }
                }
                if showEatOut {
                    Chip(label: "🍽 \(lang.t("filter.eatOut"))", on: filters.eatOut) { filters.eatOut.toggle() }
                }
            }
        }
    }

    private func group<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Caption(text: title)
            ChipRow { content() }
        }
    }
}

/// "Filter" chip with the number of active filters.
@MainActor
struct FilterToggle: View {
    @Environment(LangModel.self) private var lang
    let count: Int
    @Binding var shown: Bool

    var body: some View {
        Chip(label: count > 0 ? "⚙︎ \(lang.t("suggest.filters")) · \(count)" : "⚙︎ \(lang.t("suggest.filters"))", on: shown) { shown.toggle() }
    }
}
