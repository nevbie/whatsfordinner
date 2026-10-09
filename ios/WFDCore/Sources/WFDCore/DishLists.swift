import Foundation

// Dish list helpers – search, sort, areas, merged built-in + family dishes, stats.

/// Built-in dishes replaced by the family's edits (same id), plus their own dishes.
public func mergedDishes(builtin: [Dish], custom: [String: Dish]) -> [Dish] {
    let builtinIds = Set(builtin.map(\.id))
    let own = custom.values.filter { !builtinIds.contains($0.id) }.sorted { $0.id < $1.id }
    return builtin.map { custom[$0.id] ?? $0 } + own
}

/// Visible dishes: without the ones the family removed (they still show in the history).
public func visibleDishes(_ all: [Dish], hidden: [String]) -> [Dish] {
    let h = Set(hidden)
    return all.filter { !h.contains($0.id) }
}

public func searchText(_ d: Dish, _ catalog: DishCatalog) -> String {
    let ings = d.ingredients.flatMap { [catalog.ingredientName($0, .de), catalog.ingredientName($0, .en)] }
    return ([d.name.orig, d.name.roman ?? "", d.name.de, d.name.en] + ings).joined(separator: " ").lowercased()
}

public func matchesQuery(_ d: Dish, _ q: String, _ catalog: DishCatalog) -> Bool {
    let words = q.lowercased().split(whereSeparator: { $0.isWhitespace }).map(String.init)
    if words.isEmpty { return true }
    let text = searchText(d, catalog)
    return words.allSatisfy { text.contains($0) }
}

/// One-line label: translation (or original).
public func dishLabel(_ d: Dish, _ lang: Lang) -> String {
    let t = d.name.text(lang)
    return t.isEmpty ? d.name.orig : t
}

public func compareNames(_ a: String, _ b: String, _ lang: Lang) -> ComparisonResult {
    a.compare(b, options: [.caseInsensitive], range: nil, locale: Locale(identifier: lang.rawValue))
}

public func sortByName(_ a: Dish, _ b: Dish, _ lang: Lang) -> Bool {
    compareNames(dishLabel(a, lang), dishLabel(b, lang), lang) == .orderedAscending
}

/// Areas of the dish list.
public let DISH_AREAS = ["all", "food", "eatout", "side", "party", "bake", "drink"]

/// Which section of the list a dish belongs to.
public func areaOf(_ d: Dish) -> String {
    if d.kind == "eatout" { return "eatout" }
    if d.course == "drink" || (d.party?.contains("drink") ?? false) { return "drink" }
    if d.kind == "bake" { return "bake" }
    if d.kind == "party" { return "party" }
    if d.kind == "side" { return "side" }
    return "food"
}

/// Last-eaten dates, eat counts and upcoming plan dates, derived from the shared plan.
public struct DishStats: Sendable {
    public var today: String
    public var last: [String: String]
    public var counts: [String: Int]
    public var next: [String: String]

    public init(plan: [String: DayEntry], today: String) {
        self.today = today
        last = lastEaten(plan, today)
        var counts: [String: Int] = [:]
        var next: [String: String] = [:]
        for (date, entry) in plan {
            for id in dayDishIds(entry) {
                if date <= today {
                    counts[id, default: 0] += 1
                } else if let n = next[id], n <= date {
                    continue
                } else {
                    next[id] = date
                }
            }
        }
        self.counts = counts
        self.next = next
    }
}

/// Dishes of one meal of a day.
public func mealIds(_ state: FamilyState, _ date: String, _ meal: String) -> [String] {
    meal == "dinner" ? (state.plan[date]?.dishes ?? []) : (state.plan[date]?.meals?[meal] ?? [])
}

/// The day entry after replacing one meal's dishes (keeps the other meals) – StoreContext.setMeal.
public func entryWithMeal(_ state: FamilyState, _ date: String, _ meal: String, _ ids: [String]) -> DayEntry {
    var entry = state.plan[date] ?? DayEntry()
    if meal == "dinner" {
        entry.dishes = ids
    } else {
        var meals = entry.meals ?? [:]
        if ids.isEmpty { meals[meal] = nil } else { meals[meal] = ids }
        entry.meals = meals
    }
    return entry
}

/// The day entry after toggling a day marker.
public func entryTogglingLabel(_ state: FamilyState, _ date: String, _ label: String) -> DayEntry {
    var entry = state.plan[date] ?? DayEntry()
    let labels = entry.labels ?? []
    let next = labels.contains(label) ? labels.filter { $0 != label } : labels + [label]
    entry.labels = next.isEmpty ? nil : next
    return entry
}
