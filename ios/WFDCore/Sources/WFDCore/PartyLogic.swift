import Foundation

// Party planner – mirrors src/logic/party.ts.

public let PARTY_COURSES = ["starter", "salad", "main", "side", "snack", "dip", "dessert", "cake", "drink"]
public let PARTY_FORMATS = ["menu", "buffet", "finger", "interactive"]
public let TODO_PHASES = ["week", "daybefore", "morning", "before"]

/// Courses where vegetarian/vegan guests need at least one option.
private let CORE: Set<String> = ["starter", "salad", "main", "snack"]

/// Party roles of a dish – explicit for party dishes, derived for the everyday ones.
public func partyCoursesOf(_ d: Dish) -> [String] {
    if let p = d.party { return p }
    if d.kind == "eatout" || d.kind == "combo" { return [] }
    if d.kind == "bake" {
        if d.course == "bkCake" || d.course == "bkPastry" { return ["cake"] }
        if d.course == "bkDessert" { return ["dessert"] }
        return d.course != nil ? [] : ["cake", "dessert"]
    }
    if d.kind == "dish" { return d.has("sweet") ? ["dessert"] : ["main"] }
    switch d.course {
    case "raita", "chutney": return ["dip"]
    case "salad", "cold": return ["salad"]
    case "snack": return ["snack"]
    case "dessert": return ["dessert"]
    case "drink": return ["drink"]
    case "soup": return ["starter"]
    case "bread", "rice", "staple", "side": return ["side"]
    default: return []
    }
}

/// Raclette, fondue, BBQ, hot pot, tacos … – dishes everyone cooks or assembles at the table.
public func isInteractive(_ d: Dish) -> Bool {
    d.kind == "dish" && d.has("social") && !d.has("sweet")
}

public func guestTotal(_ p: Party) -> Int { p.adults + p.kids }

/// How many dishes of each course a format needs for the number of guests.
public func partyTemplate(_ format: String, _ total: Int) -> [String: Int] {
    let t = Double(total)
    switch format {
    case "buffet":
        return ["main": max(2, jsRound(t / 6)), "salad": max(2, jsRound(t / 8)), "side": 1, "dip": 1, "dessert": max(1, jsRound(t / 10)), "cake": total >= 10 ? 1 : 0, "drink": 1]
    case "finger":
        return ["snack": min(10, max(4, jsRound(t / 3))), "dip": 2, "dessert": 1, "cake": 1, "drink": 1]
    case "interactive":
        return ["main": 1, "salad": 2, "side": 1, "dip": 2, "dessert": 1, "drink": 1]
    default:
        return ["starter": 1, "main": 1, "side": 1, "dessert": 1, "drink": 1]
    }
}

/// Short random id like the web's Math.random().toString(36).slice(2, 10).
public func uid() -> String {
    let chars = Array("abcdefghijklmnopqrstuvwxyz0123456789")
    return String((0..<8).map { _ in chars[Int.random(in: 0..<chars.count)] })
}

/// Base-36 timestamp like Date.now().toString(36).
public func base36Now() -> String {
    String(Int(Date().timeIntervalSince1970 * 1000), radix: 36)
}

public struct PartySuggestContext {
    public var pool: [Dish]
    public var favorites: Set<String>
    public var today: String
    public var rng: Rng

    public init(pool: [Dish], favorites: Set<String>, today: String, rng: @escaping Rng = systemRng) {
        self.pool = pool
        self.favorites = favorites
        self.today = today
        self.rng = rng
    }
}

private func weightFor(_ d: Dish, _ course: String, _ party: Party, _ ctx: PartySuggestContext) -> Double {
    var w = 1.0
    if ctx.favorites.contains(d.id) { w *= 2 }
    if party.kids > 0 && d.has("kids") { w *= 1.5 }
    if party.kids > 0 && d.has("spicy") { w *= 0.3 }
    if course != "main" { w *= (d.kind == "party" || d.kind == "bake") ? 1.5 : 0.4 }
    if party.format == "buffet" && d.effort == 3 { w *= 0.5 }
    if course == "main" {
        if party.format == "buffet" && d.has("oven") { w *= 2.5 }
        if d.cuisine == "chinese" || d.cuisine == "indian" { w *= 0.3 }
        if party.format == "menu" && d.effort == 1 { w *= 0.5 }
    }
    let s = season(party.date.isEmpty ? ctx.today : party.date)
    if s == "summer" && d.has("winter") { w *= 0.2 }
    if s == "winter" && d.has("summer") { w *= 0.2 }
    return w
}

private func pickWeighted(_ cands: [Dish], _ course: String, _ party: Party, _ ctx: PartySuggestContext) -> Dish? {
    guard !cands.isEmpty else { return nil }
    let ws = cands.map { weightFor($0, course, party, ctx) }
    var r = ctx.rng() * ws.reduce(0, +)
    for (i, w) in ws.enumerated() {
        r -= w
        if r < 0 { return cands[i] }
    }
    return cands.last
}

/// Suggest a menu. Hand-picked, typed-in and brought items are kept; the rest is (re-)filled.
public func suggestPartyItems(_ party: Party, _ ctx: PartySuggestContext) -> [PartyItem] {
    let total = guestTotal(party)
    let kept = party.items.filter { ($0.locked ?? false) || $0.text != nil || $0.broughtBy != nil }
    var used = Set(kept.compactMap(\.dishId))
    let byId = Dictionary(ctx.pool.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })
    let tpl = partyTemplate(party.format, total)
    let vegNeed = party.veggie + party.vegan
    let everyoneVeg = total > 0 && vegNeed >= total
    let everyoneVegan = total > 0 && party.vegan >= total
    var out = kept

    for course in PARTY_COURSES {
        var count = tpl[course] ?? 0
        let keptHere = kept.filter { $0.course == course }.map { $0.dishId.flatMap { byId[$0] } }
        if party.format == "menu" && course == "main" && vegNeed > 0 && !everyoneVeg { count = 2 }
        count -= keptHere.count
        if count <= 0 { continue }

        var cands = ctx.pool.filter { !used.contains($0.id) && partyCoursesOf($0).contains(course) }
        if party.format == "interactive" && course == "main" {
            cands = cands.filter(isInteractive)
        } else if course == "main" {
            cands = cands.filter { !isInteractive($0) }
        }
        if everyoneVegan {
            cands = cands.filter { $0.has("vegan") }
        } else if everyoneVeg {
            cands = cands.filter { $0.has("veggie") }
        }

        let keptVegan = keptHere.contains { $0?.has("vegan") ?? false }
        let keptVeggie = keptHere.contains { $0?.has("veggie") ?? false }
        let needVegan = party.vegan > 0 && CORE.contains(course) && !keptVegan
        let needVeggie = vegNeed > 0 && CORE.contains(course) && !keptVeggie && !needVegan

        for n in 0..<count {
            let free = cands.filter { !used.contains($0.id) }
            var pool = free
            if n == 0 && needVegan {
                pool = free.filter { $0.has("vegan") }
            } else if n == 0 && needVeggie {
                pool = free.filter { $0.has("veggie") }
            }
            guard let dish = pickWeighted(pool.isEmpty ? free : pool, course, party, ctx) else { break }
            used.insert(dish.id)
            out.append(PartyItem(id: uid(), course: course, dishId: dish.id))
        }
    }
    return out
}

/// Replace one item's dish by another fitting dish of the same course.
public func rerollPartyItem(_ party: Party, _ itemId: String, _ ctx: PartySuggestContext) -> [PartyItem] {
    guard let item = party.items.first(where: { $0.id == itemId }) else { return party.items }
    let used = Set(party.items.compactMap(\.dishId))
    let total = guestTotal(party)
    var cands = ctx.pool.filter { !used.contains($0.id) && partyCoursesOf($0).contains(item.course) }
    if party.format == "interactive" && item.course == "main" { cands = cands.filter(isInteractive) }
    if total > 0 && party.vegan >= total {
        cands = cands.filter { $0.has("vegan") }
    } else if total > 0 && party.veggie + party.vegan >= total {
        cands = cands.filter { $0.has("veggie") }
    }
    let old = item.dishId.flatMap { id in ctx.pool.first { $0.id == id } }
    if old?.has("vegan") ?? false, party.vegan > 0 {
        cands = cands.filter { $0.has("vegan") }
    } else if old?.has("veggie") ?? false, party.veggie + party.vegan > 0 {
        cands = cands.filter { $0.has("veggie") }
    }
    guard let next = pickWeighted(cands, item.course, party, ctx) else { return party.items }
    return party.items.map { i in
        guard i.id == itemId else { return i }
        var c = i
        c.dishId = next.id
        c.text = nil
        c.locked = false
        return c
    }
}

public struct ShoppingEntry: Equatable, Sendable {
    public var key: String
    public var dishIds: [String]
}

/// Combined ingredient list of everything the family makes themselves (not what guests bring).
public func shoppingList(_ party: Party, _ byId: [String: Dish]) -> [ShoppingEntry] {
    var order: [String] = []
    var map: [String: [String]] = [:]
    for item in party.items {
        guard item.broughtBy == nil, let dishId = item.dishId else { continue }
        for ing in byId[dishId]?.ingredients ?? [] {
            if map[ing] == nil { order.append(ing) }
            map[ing, default: []].append(dishId)
        }
    }
    return order.map { ShoppingEntry(key: $0, dishIds: map[$0] ?? []) }
}

private let TODO_TEXT: [String: (String, String)] = [
    "invite": ("Gäste einladen und nach Allergien/Vorlieben fragen", "Invite guests and ask about allergies/preferences"),
    "menu": ("Menü festlegen und verteilen, wer was mitbringt", "Fix the menu and who brings what"),
    "dry": ("Getränke und haltbare Zutaten einkaufen", "Buy drinks and non-perishables"),
    "fresh": ("Frische Zutaten einkaufen", "Buy fresh ingredients"),
    "dessert": ("Nachtisch / Kuchen vorbereiten", "Prepare dessert / cake"),
    "salads": ("Dips und Salatdressings vorbereiten", "Prepare dips and dressings"),
    "chill": ("Getränke kalt stellen, Eiswürfel machen", "Chill drinks, make ice cubes"),
    "dishes": ("Geschirr, Gläser, Besteck und Stühle zählen", "Count plates, glasses, cutlery and chairs"),
    "device": ("Raclette-/Fondue-Gerät bzw. Grill und Brennstoff prüfen", "Check raclette/fondue set or BBQ and fuel"),
    "table": ("Tisch decken", "Set the table"),
    "buffet": ("Buffet aufbauen, Servierlöffel bereitlegen", "Set up the buffet with serving spoons"),
    "labels": ("Gerichte beschriften (vegetarisch, Allergene)", "Label dishes (vegetarian, allergens)"),
    "chop": ("Gemüse schneiden, Platten anrichten", "Chop vegetables, arrange platters"),
    "kids": ("Spielecke / Beschäftigung für Kinder vorbereiten", "Prepare a play corner for kids"),
    "oven": ("Ofen vorheizen, Brot aufbacken", "Preheat oven, warm up bread"),
    "serve": ("Snacks und Getränke hinstellen", "Put out snacks and drinks"),
    "music": ("Musik und Deko", "Music and decoration"),
]

/// Default checklist for a party, in the current UI language.
public func defaultTodos(format f: String, kids: Int, lang: Lang) -> [PartyTodo] {
    var keys: [(String, String)] = [
        ("week", "invite"), ("week", "menu"), ("week", "dry"),
        ("daybefore", "fresh"), ("daybefore", "dessert"), ("daybefore", "salads"), ("daybefore", "chill"), ("daybefore", "dishes"),
    ]
    if f == "interactive" { keys.append(("daybefore", "device")) }
    keys.append(("morning", f == "buffet" || f == "finger" ? "buffet" : "table"))
    if f == "buffet" || f == "finger" { keys.append(("morning", "labels")) }
    keys.append(("morning", "chop"))
    if kids > 0 { keys.append(("morning", "kids")) }
    keys += [("before", "oven"), ("before", "serve"), ("before", "music")]
    return keys.map { phase, k in
        let text = TODO_TEXT[k].map { lang == .de ? $0.0 : $0.1 } ?? k
        return PartyTodo(id: uid(), phase: phase, text: text)
    }
}

public func newParty(date: String, settings: FamilySettings, lang: Lang) -> Party {
    var p = Party(
        id: "p-\(base36Now())\(uid().prefix(4))",
        title: lang == .de ? "Einladung" : "Party",
        date: date,
        format: "menu",
        adults: settings.adults + 4,
        kids: settings.kids
    )
    p.todos = defaultTodos(format: p.format, kids: p.kids, lang: lang)
    return p
}

/// Last day of each to-do phase relative to the party date.
public let PHASE_OFFSET: [String: Int] = ["week": -7, "daybefore": -1, "morning": 0, "before": 0]
