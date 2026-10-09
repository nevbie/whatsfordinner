import Foundation

// Region and staple classification – mirrors src/data/classify.ts.

public let REGIONS = ["europe", "asia", "other"]
public let STAPLES = ["bread", "pasta", "rice", "potatoes", "dough"]

private let EUROPE: Set<String> = ["german", "austrian", "swiss", "french", "italian", "spanish", "greek", "eastern", "georgian"]
private let ASIA: Set<String> = ["chinese", "indian", "thai", "vietnamese", "japanese", "korean", "fusion"]

public func regionOf(_ dish: Dish) -> String? {
    if dish.cuisine == "restaurant" { return nil }
    if EUROPE.contains(dish.cuisine) { return "europe" }
    if ASIA.contains(dish.cuisine) { return "asia" }
    return "other"
}

/// Ingredient → staple. Gnocchi and Schupfnudeln count as both pasta and potatoes.
private let STAPLE_INGREDIENTS: [String: [String]] = [
    "rice": ["rice", "basmati", "risotto_rice", "paella_rice", "sushi_rice", "pudding_rice"],
    "pasta": ["pasta", "spaghetti", "tagliatelle", "lasagna_sheets", "tortellini", "spaetzle", "maultaschen", "wheat_noodles", "glass_noodles", "rice_noodles", "gnocchi", "schupfnudeln"],
    "potatoes": ["potatoes", "sweet_potato", "potato_salad", "gnocchi", "schupfnudeln"],
    "bread": ["bread", "baguette", "bread_roll", "flatbread", "burger_buns", "tortillas", "pretzels", "atta"],
    "dough": [],
]

/// Chinese and Indian main dishes are eaten with rice (and roti / naan).
private let EATEN_WITH: [String: [String]] = [
    "meat": ["rice"], "fish": ["rice"], "tofu": ["rice"], "egg": ["rice"], "veg": ["rice"],
    "curry": ["rice", "bread"], "dal": ["rice", "bread"], "sabzi": ["rice", "bread"],
]

private let STAPLES_BY_COMBO: [String: [String]] = [
    "chinese": ["rice"], "indian": ["bread", "rice"], "tapas": ["bread", "potatoes"], "abendbrot": ["bread"], "teller": ["potatoes"], "salad": [],
]

public func staplesOf(_ dish: Dish) -> [String] {
    if let s = dish.staples { return s }
    if dish.kind == "combo" {
        guard let combo = dish.combo else { return [] }
        return STAPLES_BY_COMBO[combo] ?? []
    }
    var found = Set<String>()
    for s in STAPLES where (STAPLE_INGREDIENTS[s] ?? []).contains(where: { dish.ingredients.contains($0) }) {
        found.insert(s)
    }
    if dish.cuisine == "chinese" || dish.cuisine == "indian", let course = dish.course {
        for s in EATEN_WITH[course] ?? [] { found.insert(s) }
    }
    return STAPLES.filter { found.contains($0) }
}
