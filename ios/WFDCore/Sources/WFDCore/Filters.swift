import Foundation

// Filters – mirrors src/logic/filters.ts.

/// Finer cuisine choice on top of the region chips (several can be picked).
public let CUISINE_GROUPS = ["german", "italian", "french", "spanish", "oriental", "american", "chinese", "indian", "eastasia"]

private let GROUP_CUISINES: [String: [String]] = [
    "german": ["german", "austrian", "swiss"],
    "italian": ["italian"],
    "french": ["french"],
    "spanish": ["spanish"],
    "oriental": ["greek", "turkish", "mideast", "persian", "northafrican", "georgian", "eastern"],
    "american": ["american", "mexican"],
    "chinese": ["chinese"],
    "indian": ["indian"],
    "eastasia": ["thai", "vietnamese", "japanese", "korean", "fusion"],
]

public struct Filters: Codable, Equatable, Hashable, Sendable {
    /// any | veggie | vegan
    public var diet: String = "any"
    public var kids = false
    public var noSpicy = false
    public var maxEffort = 3
    public var favoritesOnly = false
    /// favourites of these labels; empty = no restriction
    public var favLabels: [String] = []
    public var sweetOnly = false
    public var noDislikes = false
    public var eatOut = false
    public var cuisines: [String] = []
    public var regions: [String] = []
    public var staples: [String] = []

    public static let defaults = Filters()

    public init() {}

    /// Merge stored filters (possibly from an older app version) with the defaults (normalizeFilters).
    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        diet = c.lenient(String.self, .diet, "any")
        if !["any", "veggie", "vegan"].contains(diet) { diet = "any" }
        kids = c.lenient(Bool.self, .kids, false)
        noSpicy = c.lenient(Bool.self, .noSpicy, false)
        maxEffort = min(3, max(1, c.lenient(Int.self, .maxEffort, 3)))
        favoritesOnly = c.lenient(Bool.self, .favoritesOnly, false)
        favLabels = c.lenient([String].self, .favLabels, [])
        sweetOnly = c.lenient(Bool.self, .sweetOnly, false)
        noDislikes = c.lenient(Bool.self, .noDislikes, false)
        eatOut = c.lenient(Bool.self, .eatOut, false)
        cuisines = c.lenient([String].self, .cuisines, [])
        // older versions stored a single cuisine
        if let single = c.lenientOptional(String.self, .cuisine), cuisines.isEmpty, CUISINE_GROUPS.contains(single) {
            cuisines = [single]
        }
        cuisines = cuisines.filter { CUISINE_GROUPS.contains($0) }
        regions = c.lenient([String].self, .regions, [])
        staples = c.lenient([String].self, .staples, [])
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(diet, forKey: .diet)
        try c.encode(kids, forKey: .kids)
        try c.encode(noSpicy, forKey: .noSpicy)
        try c.encode(maxEffort, forKey: .maxEffort)
        try c.encode(favoritesOnly, forKey: .favoritesOnly)
        try c.encode(favLabels, forKey: .favLabels)
        try c.encode(sweetOnly, forKey: .sweetOnly)
        try c.encode(noDislikes, forKey: .noDislikes)
        try c.encode(eatOut, forKey: .eatOut)
        try c.encode(cuisines, forKey: .cuisines)
        try c.encode(regions, forKey: .regions)
        try c.encode(staples, forKey: .staples)
    }

    enum CodingKeys: String, CodingKey { case diet, kids, noSpicy, maxEffort, favoritesOnly, favLabels, sweetOnly, noDislikes, eatOut, cuisines, regions, staples, cuisine }
}

/// Decode stored filters from JSON (bad data → defaults).
public func normalizeFilters(_ data: Data?) -> Filters {
    guard let data, let f = try? JSONDecoder().decode(Filters.self, from: data) else { return .defaults }
    return f
}

public func inCuisineGroups(_ dish: Dish, _ groups: [String]) -> Bool {
    groups.isEmpty || groups.contains { (GROUP_CUISINES[$0] ?? []).contains(dish.cuisine) }
}

/// Diet / kids / spice / effort checks shared by suggestions, the dish list and the meal builder.
public func matchesDiet(_ dish: Dish, diet: String, kids: Bool, noSpicy: Bool, maxEffort: Int, sweetOnly: Bool = false) -> Bool {
    if dish.kind == "eatout" || dish.kind == "combo" { return true }
    if diet == "veggie" && !dish.has("veggie") { return false }
    if diet == "vegan" && !dish.has("vegan") { return false }
    if kids && !dish.has("kids") { return false }
    if noSpicy && dish.has("spicy") { return false }
    if sweetOnly && !dish.has("sweet") { return false }
    if dish.effort > maxEffort { return false }
    return true
}

/// Is the dish a favourite of at least one of the given labels?
public func isLabelFavorite(_ dishId: String, _ labelIds: [String], _ labelFavorites: [String: [String]]) -> Bool {
    labelIds.contains { labelFavorites[$0]?.contains(dishId) ?? false }
}

/// Labels (people) that don't like the dish.
public func dislikersOf(_ dishId: String, _ labelDislikes: [String: [String]]) -> [String] {
    labelDislikes.filter { $0.value.contains(dishId) }.map(\.key)
}

public func matchesFilters(_ dish: Dish, _ f: Filters, _ favorites: Set<String>, _ labelFavorites: [String: [String]] = [:], _ labelDislikes: [String: [String]] = [:]) -> Bool {
    let dislikers = dislikersOf(dish.id, labelDislikes)
    if f.noDislikes && !dislikers.isEmpty { return false }
    // cooking for someone: skip what they don't like
    if f.favLabels.contains(where: { dislikers.contains($0) }) { return false }
    let favLabelsOk = f.favLabels.isEmpty || isLabelFavorite(dish.id, f.favLabels, labelFavorites)
    if dish.kind == "eatout" { return f.eatOut && (!f.favoritesOnly || favorites.contains(dish.id)) && favLabelsOk }
    if f.favoritesOnly && !favorites.contains(dish.id) { return false }
    if !favLabelsOk { return false }
    if f.sweetOnly && dish.kind == "combo" { return false }
    if !f.regions.isEmpty {
        guard let region = regionOf(dish), f.regions.contains(region) else { return false }
    }
    if !f.staples.isEmpty && !staplesOf(dish).contains(where: { f.staples.contains($0) }) { return false }
    if !inCuisineGroups(dish, f.cuisines) { return false }
    return matchesDiet(dish, diet: f.diet, kids: f.kids, noSpicy: f.noSpicy, maxEffort: f.maxEffort, sweetOnly: f.sweetOnly)
}

/// Number of filters that differ from the defaults (badge on the filter button).
public func activeFilterCount(_ f: Filters) -> Int {
    (f.diet != "any" ? 1 : 0) + f.regions.count + f.staples.count + f.cuisines.count
        + (f.kids ? 1 : 0) + (f.noSpicy ? 1 : 0) + (f.maxEffort < 3 ? 1 : 0) + (f.favoritesOnly ? 1 : 0)
        + (f.sweetOnly ? 1 : 0) + (f.noDislikes ? 1 : 0) + f.favLabels.count + (f.eatOut ? 1 : 0)
}

/// Add or remove an element.
public func toggled<T: Equatable>(_ list: [T], _ item: T) -> [T] {
    list.contains(item) ? list.filter { $0 != item } : list + [item]
}
