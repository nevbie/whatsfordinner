import Foundation

// Meal builders (Chinese, Indian thali, tapas, Abendbrot, Teller, salad) – mirrors src/logic/combos.ts.

public let COMBO_TYPES = ["chinese", "indian", "tapas", "abendbrot", "teller", "salad"]

public struct ComboSlot: Equatable, Hashable, Sendable {
    public var key: String
    public var roles: [String]

    public init(key: String, roles: [String]) {
        self.key = key
        self.roles = roles
    }
}

public struct ComboEntry: Equatable, Hashable, Sendable {
    public var slot: ComboSlot
    public var dishId: String?
    public var locked: Bool

    public init(slot: ComboSlot, dishId: String? = nil, locked: Bool = false) {
        self.slot = slot
        self.dishId = dishId
        self.locked = locked
    }
}

public struct ComboOptions: Equatable, Sendable {
    public var type: String
    public var adults: Int
    public var kids: Int
    public var diet: String
    public var noSpicy: Bool
    public var drink: Bool
    public var dessert: Bool
    /// soft filters: preferred when something fits, ignored for a slot otherwise
    public var kidsFav: Bool
    public var quick: Bool
    public var favs: Bool
    /// own composition: number of slots per group key (see COMPOSE_GROUPS)
    public var counts: [String: Int]?

    public init(type: String, adults: Int = 2, kids: Int = 2, diet: String = "any", noSpicy: Bool = false, drink: Bool = false, dessert: Bool = false, kidsFav: Bool = false, quick: Bool = false, favs: Bool = false, counts: [String: Int]? = nil) {
        self.type = type
        self.adults = adults
        self.kids = kids
        self.diet = diet
        self.noSpicy = noSpicy
        self.drink = drink
        self.dessert = dessert
        self.kidsFav = kidsFav
        self.quick = quick
        self.favs = favs
        self.counts = counts
    }
}

private let PROTEIN = ["meat", "fish", "tofu"]

/// Number of dishes (without rice) for a Chinese meal.
public func chineseDishCount(_ adults: Int, _ kids: Int) -> Int {
    max(2, min(6, jsRound(Double(adults) + Double(kids) * 0.5)))
}

/// Number of tapas for a tapas evening (4–7).
public func tapasCount(_ adults: Int, _ kids: Int) -> Int {
    max(4, min(7, jsRound(Double(adults) + Double(kids) * 0.5) + 2))
}

/// JavaScript Math.round (halves round up).
public func jsRound(_ x: Double) -> Int { Int((x + 0.5).rounded(.down)) }

private let TAPA_COURSES: Set<String> = ["tapaVeg", "tapaMeat", "tapaFish", "tapaBread"]
private let ABENDBROT_COURSES: Set<String> = ["abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra"]
private let TELLER_COURSES: Set<String> = ["plMain", "plStarch", "plVeg"]
private let SALAD_COURSES: Set<String> = ["slBase", "slExtra", "slTopping", "slDressing"]

/// Which builder a dish belongs to.
public func comboTypeOfDish(_ d: Dish) -> String? {
    if let c = d.course {
        if TAPA_COURSES.contains(c) { return "tapas" }
        if ABENDBROT_COURSES.contains(c) { return "abendbrot" }
        if TELLER_COURSES.contains(c) { return "teller" }
        if SALAD_COURSES.contains(c) { return "salad" }
    }
    if d.cuisine == "chinese" || d.cuisine == "indian" { return d.cuisine }
    return nil
}

/// Builder for a dish: the "(diverse)" combo entries and every builder component.
public func comboTypeOf(_ d: Dish) -> String? {
    if d.kind == "combo" { return d.combo }
    return comboTypeOfDish(d)
}

/// Groups the family can count when changing a builder's composition.
public let COMPOSE_GROUPS: [String: [ComboSlot]] = [
    "chinese": [
        ComboSlot(key: "main", roles: ["meat", "fish", "tofu"]),
        ComboSlot(key: "meat", roles: ["meat"]),
        ComboSlot(key: "fish", roles: ["fish"]),
        ComboSlot(key: "tofu", roles: ["tofu"]),
        ComboSlot(key: "veg", roles: ["veg", "egg"]),
        ComboSlot(key: "egg", roles: ["egg"]),
        ComboSlot(key: "soup", roles: ["soup", "cold"]),
        ComboSlot(key: "cold", roles: ["cold"]),
        ComboSlot(key: "meal", roles: ["meal"]),
        ComboSlot(key: "staple", roles: ["staple"]),
    ],
    "indian": [
        ComboSlot(key: "dal", roles: ["dal"]),
        ComboSlot(key: "curry", roles: ["curry"]),
        ComboSlot(key: "sabzi", roles: ["sabzi"]),
        ComboSlot(key: "raita", roles: ["raita"]),
        ComboSlot(key: "chutney", roles: ["chutney"]),
        ComboSlot(key: "salad", roles: ["salad"]),
        ComboSlot(key: "side", roles: ["chutney", "salad", "side"]),
        ComboSlot(key: "snack", roles: ["snack"]),
        ComboSlot(key: "meal", roles: ["meal"]),
        ComboSlot(key: "bread", roles: ["bread"]),
        ComboSlot(key: "rice", roles: ["rice"]),
        ComboSlot(key: "drink", roles: ["drink"]),
        ComboSlot(key: "dessert", roles: ["dessert"]),
    ],
    "tapas": [
        ComboSlot(key: "tapaVeg", roles: ["tapaVeg"]),
        ComboSlot(key: "tapaMeat", roles: ["tapaMeat"]),
        ComboSlot(key: "tapaFish", roles: ["tapaFish"]),
        ComboSlot(key: "tapaBread", roles: ["tapaBread"]),
    ],
    "abendbrot": [
        ComboSlot(key: "abBread", roles: ["abBread"]),
        ComboSlot(key: "abCheese", roles: ["abCheese"]),
        ComboSlot(key: "abMeat", roles: ["abMeat", "abFish"]),
        ComboSlot(key: "abFish", roles: ["abFish"]),
        ComboSlot(key: "abSpread", roles: ["abSpread"]),
        ComboSlot(key: "abVeg", roles: ["abVeg"]),
        ComboSlot(key: "abExtra", roles: ["abExtra"]),
        ComboSlot(key: "abMore", roles: ["abMeat", "abFish", "abCheese"]),
    ],
    "teller": [
        ComboSlot(key: "plMain", roles: ["plMain"]),
        ComboSlot(key: "plStarch", roles: ["plStarch"]),
        ComboSlot(key: "plVeg", roles: ["plVeg"]),
    ],
    "salad": [
        ComboSlot(key: "slBase", roles: ["slBase"]),
        ComboSlot(key: "slExtra", roles: ["slExtra"]),
        ComboSlot(key: "slTopping", roles: ["slTopping"]),
        ComboSlot(key: "slDressing", roles: ["slDressing"]),
    ],
]

/// All roles that can be added as an "extra" slot per builder.
public let ALL_BUILDER_COURSES: [String: [String]] = [
    "tapas": ["tapaVeg", "tapaMeat", "tapaFish", "tapaBread"],
    "abendbrot": ["abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra"],
    "teller": ["plStarch", "plVeg"],
    "salad": ["slExtra", "slTopping", "slDressing"],
    "chinese": ["meat", "fish", "tofu", "egg", "veg", "cold", "soup", "staple", "meal"],
    "indian": ["curry", "dal", "sabzi", "raita", "chutney", "salad", "side", "bread", "rice", "drink", "dessert", "snack", "meal"],
]

/// Group key of a default slot key ('veg2' → 'veg').
public func groupKeyOf(_ slotKey: String) -> String {
    var s = slotKey
    while let last = s.last, last.isASCII, last.isNumber { s.removeLast() }
    return s
}

/// The default composition as counts per group (for the composition editor).
public func defaultCounts(_ o: ComboOptions) -> [String: Int] {
    var plain = o
    plain.counts = nil
    var counts: [String: Int] = [:]
    for s in comboSlots(plain) { counts[groupKeyOf(s.key), default: 0] += 1 }
    return counts
}

public func comboSlots(_ o: ComboOptions, seed: Dish? = nil) -> [ComboSlot] {
    if let counts = o.counts, seed?.course != "meal" {
        return (COMPOSE_GROUPS[o.type] ?? []).flatMap { g in
            (0..<max(0, counts[g.key] ?? 0)).map { i in ComboSlot(key: i == 0 ? g.key : "\(g.key)\(i + 1)", roles: g.roles) }
        }
    }
    if seed?.course == "meal" {
        return o.type == "chinese"
            ? [ComboSlot(key: "meal", roles: ["meal"]), ComboSlot(key: "side", roles: ["cold", "soup"])]
            : [ComboSlot(key: "meal", roles: ["meal"]), ComboSlot(key: "raita", roles: ["raita"]), ComboSlot(key: "side", roles: ["chutney", "salad", "side"])]
    }
    switch o.type {
    case "teller":
        return [ComboSlot(key: "plMain", roles: ["plMain"]), ComboSlot(key: "plStarch", roles: ["plStarch"]), ComboSlot(key: "plVeg", roles: ["plVeg"])]
    case "salad":
        return [
            ComboSlot(key: "slBase", roles: ["slBase"]),
            ComboSlot(key: "slExtra", roles: ["slExtra"]),
            ComboSlot(key: "slExtra2", roles: ["slExtra"]),
            ComboSlot(key: "slTopping", roles: ["slTopping"]),
            ComboSlot(key: "slDressing", roles: ["slDressing"]),
        ]
    case "abendbrot":
        let veg = o.diet != "any"
        var slots = [
            ComboSlot(key: "abBread", roles: ["abBread"]),
            ComboSlot(key: "abCheese", roles: ["abCheese"]),
            veg ? ComboSlot(key: "abSpread2", roles: ["abSpread", "abCheese"]) : ComboSlot(key: "abMeat", roles: ["abMeat", "abFish"]),
            ComboSlot(key: "abSpread", roles: ["abSpread"]),
            ComboSlot(key: "abVeg", roles: ["abVeg"]),
            ComboSlot(key: "abExtra", roles: ["abExtra"]),
        ]
        if o.adults + o.kids >= 5 { slots.insert(ComboSlot(key: "abBread2", roles: ["abBread"]), at: 1) }
        if o.adults + o.kids >= 6 { slots.append(ComboSlot(key: "abMore", roles: veg ? ["abCheese", "abSpread"] : ["abMeat", "abFish", "abCheese"])) }
        return slots
    case "tapas":
        var slots = [
            ComboSlot(key: "tapaVeg", roles: ["tapaVeg"]),
            ComboSlot(key: "tapaMeat", roles: ["tapaMeat"]),
            ComboSlot(key: "tapaFish", roles: ["tapaFish"]),
            ComboSlot(key: "tapaBread", roles: ["tapaBread"]),
        ]
        let more = [
            ComboSlot(key: "tapaVeg2", roles: ["tapaVeg"]),
            ComboSlot(key: "tapaMeat2", roles: ["tapaMeat"]),
            ComboSlot(key: "tapaFish2", roles: ["tapaFish", "tapaVeg"]),
        ]
        let n = tapasCount(o.adults, o.kids)
        for m in more where slots.count < n { slots.append(m) }
        return slots
    case "chinese":
        var slots = [ComboSlot(key: "main", roles: PROTEIN), ComboSlot(key: "veg", roles: ["veg", "egg"])]
        let more = [
            ComboSlot(key: "soup", roles: ["soup", "cold"]),
            ComboSlot(key: "veg2", roles: ["veg", "egg", "tofu"]),
            ComboSlot(key: "main2", roles: PROTEIN),
            ComboSlot(key: "cold", roles: ["cold", "soup"]),
        ]
        let n = chineseDishCount(o.adults, o.kids)
        for s in more where slots.count < n { slots.append(s) }
        slots.append(ComboSlot(key: "staple", roles: ["staple"]))
        return slots
    default:
        var slots = [ComboSlot(key: "dal", roles: ["dal"]), ComboSlot(key: "curry", roles: ["curry"]), ComboSlot(key: "sabzi", roles: ["sabzi"])]
        if o.adults + o.kids >= 6 { slots.append(ComboSlot(key: "curry2", roles: ["curry"])) }
        slots.append(ComboSlot(key: "raita", roles: o.kids > 0 ? ["raita"] : ["raita", "chutney", "salad"]))
        slots.append(ComboSlot(key: "side", roles: ["chutney", "salad", "side"]))
        slots.append(ComboSlot(key: "bread", roles: ["bread"]))
        slots.append(ComboSlot(key: "rice", roles: ["rice"]))
        if o.drink { slots.append(ComboSlot(key: "drink", roles: ["drink"])) }
        if o.dessert { slots.append(ComboSlot(key: "dessert", roles: ["dessert"])) }
        return slots
    }
}

public func initialEntries(_ o: ComboOptions, seed: Dish? = nil) -> [ComboEntry] {
    let slots = comboSlots(o, seed: seed)
    var entries = slots.map { ComboEntry(slot: $0) }
    if let seed, let course = seed.course, let i = slots.firstIndex(where: { $0.roles.contains(course) }) {
        entries[i] = ComboEntry(slot: slots[i], dishId: seed.id, locked: true)
    }
    return entries
}

/// Dishes counted as staples don't take part in the "same main ingredient" rule.
private let STAPLE_ROLES: Set<String> = ["staple", "bread", "rice", "drink"]

private func mainIngredient(_ d: Dish) -> String? {
    if let c = d.course, STAPLE_ROLES.contains(c) { return nil }
    return d.ingredients.first
}

/// Preferred defaults: plain rice / roti appear most often.
private let DEFAULT_BOOST: [String: Double] = ["mifan": 5, "basmati": 3, "roti": 3, "raita": 2]

public struct PickContext {
    public var options: ComboOptions
    public var favorites: Set<String>
    /// dishes to prefer (e.g. the seed's pairsWith)
    public var prefer: Set<String>
    /// dishes someone at the table doesn't like
    public var avoid: Set<String>

    public init(options: ComboOptions, favorites: Set<String> = [], prefer: Set<String> = [], avoid: Set<String> = []) {
        self.options = options
        self.favorites = favorites
        self.prefer = prefer
        self.avoid = avoid
    }
}

private func weighted(_ cands: [Dish], _ ctx: PickContext, _ rng: Rng) -> Dish? {
    guard !cands.isEmpty else { return nil }
    let ws: [Double] = cands.map { d in
        var w = DEFAULT_BOOST[d.id] ?? 1
        if ctx.favorites.contains(d.id) { w *= 2 }
        if ctx.prefer.contains(d.id) { w *= ctx.options.type == "teller" ? 25 : 5 }
        if d.effort == 3 { w *= 0.4 }
        if ctx.avoid.contains(d.id) { w *= 0.1 }
        return w
    }
    var r = rng() * ws.reduce(0, +)
    for (i, w) in ws.enumerated() {
        r -= w
        if r < 0 { return cands[i] }
    }
    return cands.last
}

/// Candidate dishes for a slot, before the "fits with the others" rules.
public func slotCandidates(_ slot: ComboSlot, _ pool: [Dish], _ o: ComboOptions) -> [Dish] {
    pool.filter { d in
        guard let c = d.course else { return false }
        return comboTypeOfDish(d) == o.type && slot.roles.contains(c)
            && matchesDiet(d, diet: o.diet, kids: false, noSpicy: o.noSpicy, maxEffort: 3)
    }
}

public func pickForSlot(_ slot: ComboSlot, _ chosen: [Dish], _ pool: [Dish], _ ctx: PickContext, _ rng: Rng) -> Dish? {
    let o = ctx.options
    let taken = Set(chosen.map(\.id))
    let groups = Set(chosen.compactMap(\.group))
    let mains = Set(chosen.compactMap(mainIngredient))
    let spicyCount = chosen.filter { $0.has("spicy") }.count
    let base = slotCandidates(slot, pool, o).filter { d in
        !taken.contains(d.id) && !(d.group.map { groups.contains($0) } ?? false)
    }
    let distinctMain: (Dish) -> Bool = { d in
        guard let m = mainIngredient(d) else { return true }
        return !mains.contains(m)
    }
    // With kids at the table, at most one spicy dish.
    let spiceOk: (Dish) -> Bool = { d in o.kids == 0 || !d.has("spicy") || spicyCount == 0 }
    let soft: (Dish) -> Bool = { d in
        (!o.kidsFav || d.has("kids")) && (!o.quick || d.effort == 1) && (!o.favs || ctx.favorites.contains(d.id))
    }
    let preferred = base.filter(soft)
    return weighted(preferred.filter { distinctMain($0) && spiceOk($0) }, ctx, rng)
        ?? weighted(preferred.filter(spiceOk), ctx, rng)
        ?? weighted(base.filter { distinctMain($0) && spiceOk($0) }, ctx, rng)
        ?? weighted(base.filter(spiceOk), ctx, rng)
        ?? weighted(base, ctx, rng)
}

/// Fill every unlocked entry (in order) with a fitting dish.
public func fillEntries(_ entries: [ComboEntry], _ pool: [Dish], _ ctx: PickContext, rng: Rng = systemRng) -> [ComboEntry] {
    let byId = Dictionary(pool.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })
    var result = entries.map { e -> ComboEntry in
        var e = e
        if !e.locked { e.dishId = nil }
        return e
    }
    for i in result.indices {
        if result[i].locked && result[i].dishId != nil { continue }
        let chosen = result.compactMap { $0.dishId.flatMap { byId[$0] } }
        result[i].dishId = pickForSlot(result[i].slot, chosen, pool, ctx, rng)?.id
    }
    return result
}

/// Re-pick one entry, keeping all others.
public func rerollEntry(_ entries: [ComboEntry], _ index: Int, _ pool: [Dish], _ ctx: PickContext, rng: Rng = systemRng) -> [ComboEntry] {
    guard entries.indices.contains(index) else { return entries }
    let byId = Dictionary(pool.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })
    let current = entries[index].dishId
    let others = entries.enumerated().filter { $0.offset != index }.compactMap { $0.element.dishId.flatMap { byId[$0] } }
    let withoutCurrent = pool.filter { $0.id != current }
    let next = pickForSlot(entries[index].slot, others, withoutCurrent, ctx, rng)?.id ?? current
    var out = entries
    out[index].dishId = next
    out[index].locked = false
    return out
}
