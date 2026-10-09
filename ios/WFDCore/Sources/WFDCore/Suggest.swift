import Foundation

// Dinner suggestions – mirrors src/logic/suggest.ts (same weights and rules).

/// Random number generator returning values in [0, 1).
public typealias Rng = () -> Double

public func systemRng() -> Double { Double.random(in: 0..<1) }

/// Most recent date (≤ today) each dish was eaten.
public func lastEaten(_ plan: [String: DayEntry], _ today: String) -> [String: String] {
    var last: [String: String] = [:]
    for (date, entry) in plan where date <= today {
        for id in dayDishIds(entry) {
            if let prev = last[id], prev >= date { continue }
            last[id] = date
        }
    }
    return last
}

/// Dishes already planned for the coming days (after today).
public func plannedSoon(_ plan: [String: DayEntry], _ today: String, days: Int = 7) -> Set<String> {
    let until = addDays(today, days)
    var ids = Set<String>()
    for (date, entry) in plan where date > today && date <= until {
        dayDishIds(entry).forEach { ids.insert($0) }
    }
    return ids
}

/// winter | summer | mid
public func season(_ today: String) -> String {
    let m = monthOf(today)
    if m >= 11 || m <= 2 { return "winter" }
    if m >= 5 && m <= 8 { return "summer" }
    return "mid"
}

public struct SuggestContext {
    public var state: FamilyState
    public var filters: Filters
    public var today: String

    public init(state: FamilyState, filters: Filters, today: String) {
        self.state = state
        self.filters = filters
        self.today = today
    }
}

/// The label whose favourites have waited the longest (or were never cooked) gets a boost.
public func waitingLabel(_ state: FamilyState, _ last: [String: String]) -> String? {
    var best: String?
    var bestDate = "9999"
    for label in state.labels {
        let favs = state.labelFavorites[label.id] ?? []
        if favs.isEmpty { continue }
        var latest = ""
        for id in favs {
            let date = last[id] ?? ""
            if date > latest { latest = date }
        }
        if latest < bestDate {
            bestDate = latest
            best = label.id
        }
    }
    return best
}

/// Relative chance of a dish being suggested; 0 = never.
public func weight(_ dish: Dish, _ ctx: SuggestContext, _ last: [String: String], _ soon: Set<String>, _ waiting: String? = nil) -> Double {
    let favorites = Set(ctx.state.favorites)
    if dish.kind == "side" || dish.kind == "party" || dish.kind == "bake" { return 0 }
    if !matchesFilters(dish, ctx.filters, favorites, ctx.state.labelFavorites, ctx.state.labelDislikes) { return 0 }
    if soon.contains(dish.id) { return 0 }

    var w = 1.0
    if dish.kind == "combo" { w = 1.5 } else if dish.cuisine == "chinese" || dish.cuisine == "indian" { w = 0.35 }
    if favorites.contains(dish.id) { w *= 2.5 }
    let fans = ctx.state.labels.filter { ctx.state.labelFavorites[$0.id]?.contains(dish.id) ?? false }
    if !fans.isEmpty { w *= 1.8 }
    if let waiting, fans.contains(where: { $0.id == waiting }) { w *= 1.6 }
    // someone doesn't like it: much rarer (unless that person is away that day)
    let away = Set((ctx.state.plan[ctx.today]?.labels ?? []).filter { $0.hasPrefix("away:") }.map { String($0.dropFirst(5)) })
    for l in dislikersOf(dish.id, ctx.state.labelDislikes) where !away.contains(l) { w *= 0.15 }
    if dish.has("sweet") { w *= 0.6 }
    if dish.kind == "eatout" { w *= 0.8 }

    let s = season(ctx.today)
    if s == "summer" && dish.has("winter") { w *= 0.25 }
    if s == "winter" && dish.has("summer") { w *= 0.25 }

    if let eaten = last[dish.id] {
        let ago = daysBetween(eaten, ctx.today)
        let avoid = ctx.state.settings.avoidDays
        if ago < avoid { return 0 }
        w *= min(2, 1 + Double(ago - avoid) / 30)
    }
    return w
}

/// Weighted random pick of up to n distinct dishes (one variant group per round).
public func suggest(_ dishes: [Dish], _ ctx: SuggestContext, _ n: Int, exclude: Set<String> = [], rng: Rng = systemRng) -> [Dish] {
    let last = lastEaten(ctx.state.plan, ctx.today)
    let soon = plannedSoon(ctx.state.plan, ctx.today)
    let waiting = waitingLabel(ctx.state, last)
    var pool: [(d: Dish, w: Double)] = dishes
        .filter { !exclude.contains($0.id) }
        .map { ($0, weight($0, ctx, last, soon, waiting)) }
        .filter { $0.w > 0 }
    var out: [Dish] = []
    while out.count < n && !pool.isEmpty {
        let total = pool.reduce(0) { $0 + $1.w }
        var r = rng() * total
        var i = 0
        while i < pool.count - 1 {
            r -= pool[i].w
            if r < 0 { break }
            i += 1
        }
        let picked = pool[i].d
        out.append(picked)
        pool.remove(at: i)
        if let g = picked.group { pool.removeAll { $0.d.group == g } }
    }
    return out
}
