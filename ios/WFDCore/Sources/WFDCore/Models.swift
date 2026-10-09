import Foundation

// Data model – mirrors src/data/types.ts of the web app.
//
// Enumerated values (cuisine, kind, course, tags …) are kept as plain strings so that data written by
// a newer web version (a new cuisine, a new tag) never breaks decoding on the phone. Every type decodes
// leniently: missing or broken fields fall back to the same defaults the web app uses.
// Encoding omits nil values, so nothing is ever written as null to Firestore.

public enum Lang: String, Codable, Sendable, CaseIterable {
    case de, en
}

/// Text available in both UI languages.
public struct I18nText: Codable, Equatable, Hashable, Sendable {
    public var de: String
    public var en: String

    public init(de: String, en: String) {
        self.de = de
        self.en = en
    }

    public subscript(lang: Lang) -> String { lang == .de ? de : en }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        de = c.lenient(String.self, .de, "")
        en = c.lenient(String.self, .en, "")
    }

    enum CodingKeys: String, CodingKey { case de, en }
}

/// Lists of lines in both languages (recipe ingredients / steps).
public struct I18nLines: Codable, Equatable, Hashable, Sendable {
    public var de: [String]
    public var en: [String]

    public init(de: [String], en: [String]) {
        self.de = de
        self.en = en
    }

    public subscript(lang: Lang) -> [String] { lang == .de ? de : en }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        de = c.lenient([String].self, .de, [])
        en = c.lenient([String].self, .en, [])
    }

    enum CodingKeys: String, CodingKey { case de, en }
}

public struct DishName: Codable, Equatable, Hashable, Sendable {
    /// Name in the original language/script, e.g. 麻婆豆腐 or पालक पनीर.
    public var orig: String
    /// Language code of `orig` (de, it, zh, hi …).
    public var lang: String
    /// Romanisation for non-Latin scripts.
    public var roman: String?
    public var de: String
    public var en: String

    public init(orig: String, lang: String, roman: String? = nil, de: String, en: String) {
        self.orig = orig
        self.lang = lang
        self.roman = roman
        self.de = de
        self.en = en
    }

    /// Translation in the UI language (may be empty for odd data).
    public func text(_ l: Lang) -> String { l == .de ? de : en }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        orig = c.lenient(String.self, .orig, "")
        lang = c.lenient(String.self, .lang, "de")
        roman = c.lenientOptional(String.self, .roman)
        de = c.lenient(String.self, .de, "")
        en = c.lenient(String.self, .en, "")
        if orig.isEmpty { orig = de.isEmpty ? en : de }
    }

    enum CodingKeys: String, CodingKey { case orig, lang, roman, de, en }
}

public struct Recipe: Codable, Equatable, Hashable, Sendable {
    public var serves: I18nText
    public var time: I18nText
    public var ingredients: I18nLines
    public var steps: I18nLines
    public var vegan: I18nText?
    public var tip: I18nText?
    public var kids: I18nText?
    public var source: String?
    /// handwritten family recipe
    public var family: Bool?

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        serves = c.lenient(I18nText.self, .serves, I18nText(de: "", en: ""))
        time = c.lenient(I18nText.self, .time, I18nText(de: "", en: ""))
        ingredients = c.lenient(I18nLines.self, .ingredients, I18nLines(de: [], en: []))
        steps = c.lenient(I18nLines.self, .steps, I18nLines(de: [], en: []))
        vegan = c.lenientOptional(I18nText.self, .vegan)
        tip = c.lenientOptional(I18nText.self, .tip)
        kids = c.lenientOptional(I18nText.self, .kids)
        source = c.lenientOptional(String.self, .source)
        family = c.lenientOptional(Bool.self, .family)
    }

    enum CodingKeys: String, CodingKey { case serves, time, ingredients, steps, vegan, tip, kids, source, family }
}

public struct Dish: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var name: DishName
    /// german, italian, chinese … or 'restaurant'
    public var cuisine: String
    /// dish | side | combo | eatout | party | bake
    public var kind: String
    /// role in a meal builder / baking category
    public var course: String?
    public var tags: [String]
    /// 1 = quick, 2 = normal, 3 = elaborate
    public var effort: Int
    /// Ingredient keys (first = main ingredient) or free text for own dishes.
    public var ingredients: [String]
    public var note: I18nText?
    public var pairsWith: [String]?
    public var staples: [String]?
    public var party: [String]?
    /// variant group
    public var group: String?
    /// for kind == combo: chinese | indian | tapas | abendbrot | teller | salad
    public var combo: String?
    public var recipe: Recipe?
    public var custom: Bool?
    public var takeaway: Bool?
    public var url: String?
    public var place: String?
    public var address: String?
    public var phone: String?
    public var rating: Int?

    public init(id: String, name: DishName, cuisine: String, kind: String, course: String? = nil, tags: [String] = [], effort: Int = 2, ingredients: [String] = []) {
        self.id = id
        self.name = name
        self.cuisine = cuisine
        self.kind = kind
        self.course = course
        self.tags = tags
        self.effort = effort
        self.ingredients = ingredients
    }

    public func has(_ tag: String) -> Bool { tags.contains(tag) }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, "")
        name = c.lenientOptional(DishName.self, .name) ?? DishName(orig: id, lang: "de", de: id, en: id)
        cuisine = c.lenient(String.self, .cuisine, "german")
        kind = c.lenient(String.self, .kind, "dish")
        course = c.lenientOptional(String.self, .course)
        tags = c.lenient([String].self, .tags, [])
        let e = c.lenientOptional(Int.self, .effort) ?? c.lenientOptional(Double.self, .effort).map { Int($0) } ?? 2
        effort = min(3, max(1, e))
        ingredients = c.lenient([String].self, .ingredients, [])
        note = c.lenientOptional(I18nText.self, .note)
        pairsWith = c.lenientOptional([String].self, .pairsWith)
        staples = c.lenientOptional([String].self, .staples)
        party = c.lenientOptional([String].self, .party)
        group = c.lenientOptional(String.self, .group)
        combo = c.lenientOptional(String.self, .combo)
        recipe = c.lenientOptional(Recipe.self, .recipe)
        custom = c.lenientOptional(Bool.self, .custom)
        takeaway = c.lenientOptional(Bool.self, .takeaway)
        url = c.lenientOptional(String.self, .url)
        place = c.lenientOptional(String.self, .place)
        address = c.lenientOptional(String.self, .address)
        phone = c.lenientOptional(String.self, .phone)
        rating = c.lenientOptional(Int.self, .rating) ?? c.lenientOptional(Double.self, .rating).map { Int($0) }
    }

    enum CodingKeys: String, CodingKey {
        case id, name, cuisine, kind, course, tags, effort, ingredients, note, pairsWith, staples, party, group, combo, recipe, custom, takeaway, url, place, address, phone, rating
    }
}

/// Meals besides dinner that can be planned for a day.
public let EXTRA_MEALS = ["breakfast", "lunch", "coffee"]
/// All meals of a day ('dinner' = DayEntry.dishes).
public let ALL_MEALS = ["dinner", "breakfast", "lunch", "coffee"]

/// One planned / eaten day: `dishes` is dinner, `meals` the other meals.
public struct DayEntry: Codable, Equatable, Hashable, Sendable {
    public var dishes: [String]
    public var meals: [String: [String]]?
    /// day markers: 'out', 'event', 'away:<labelId>' or free text
    public var labels: [String]?
    public var note: String?
    /// dinner of that day is over
    public var done: Bool?

    public init(dishes: [String] = [], meals: [String: [String]]? = nil, labels: [String]? = nil, note: String? = nil, done: Bool? = nil) {
        self.dishes = dishes
        self.meals = meals
        self.labels = labels
        self.note = note
        self.done = done
    }

    public var isDone: Bool { done ?? false }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        dishes = c.lenient([String].self, .dishes, [])
        meals = c.lenientOptional([String: [String]].self, .meals)
        labels = c.lenientOptional([String].self, .labels)
        note = c.lenientOptional(String.self, .note)
        done = c.lenientOptional(Bool.self, .done)
    }

    enum CodingKeys: String, CodingKey { case dishes, meals, labels, note, done }
}

/// All dish ids of a day, dinner and the other meals.
public func dayDishIds(_ entry: DayEntry?) -> [String] {
    guard let entry else { return [] }
    return entry.dishes + EXTRA_MEALS.flatMap { entry.meals?[$0] ?? [] }
}

public struct PartyGuest: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var name: String
    public var note: String?

    public init(id: String, name: String, note: String? = nil) {
        self.id = id
        self.name = name
        self.note = note
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, UUID().uuidString)
        name = c.lenient(String.self, .name, "")
        note = c.lenientOptional(String.self, .note)
    }

    enum CodingKeys: String, CodingKey { case id, name, note }
}

public struct PartyItem: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var course: String
    public var dishId: String?
    public var text: String?
    public var locked: Bool?
    public var broughtBy: String?

    public init(id: String, course: String, dishId: String? = nil, text: String? = nil, locked: Bool? = nil, broughtBy: String? = nil) {
        self.id = id
        self.course = course
        self.dishId = dishId
        self.text = text
        self.locked = locked
        self.broughtBy = broughtBy
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, UUID().uuidString)
        course = c.lenient(String.self, .course, "main")
        dishId = c.lenientOptional(String.self, .dishId)
        text = c.lenientOptional(String.self, .text)
        locked = c.lenientOptional(Bool.self, .locked)
        broughtBy = c.lenientOptional(String.self, .broughtBy)
    }

    enum CodingKeys: String, CodingKey { case id, course, dishId, text, locked, broughtBy }
}

public struct PartyTodo: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var phase: String
    public var text: String
    public var done: Bool?

    public init(id: String, phase: String, text: String, done: Bool? = nil) {
        self.id = id
        self.phase = phase
        self.text = text
        self.done = done
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, UUID().uuidString)
        phase = c.lenient(String.self, .phase, "week")
        text = c.lenient(String.self, .text, "")
        done = c.lenientOptional(Bool.self, .done)
    }

    enum CodingKeys: String, CodingKey { case id, phase, text, done }
}

public struct Party: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var title: String
    public var date: String
    public var time: String?
    /// menu | buffet | finger | interactive
    public var format: String
    public var adults: Int
    public var kids: Int
    public var veggie: Int
    public var vegan: Int
    public var allergies: String?
    public var guests: [PartyGuest]
    public var items: [PartyItem]
    /// ingredient key / free text → ticked off
    public var shopping: [String: Bool]
    public var extraShopping: [String]
    public var todos: [PartyTodo]
    public var note: String?

    public init(id: String, title: String, date: String, time: String? = nil, format: String, adults: Int, kids: Int, veggie: Int = 0, vegan: Int = 0, allergies: String? = nil, guests: [PartyGuest] = [], items: [PartyItem] = [], shopping: [String: Bool] = [:], extraShopping: [String] = [], todos: [PartyTodo] = [], note: String? = nil) {
        self.id = id
        self.title = title
        self.date = date
        self.time = time
        self.format = format
        self.adults = adults
        self.kids = kids
        self.veggie = veggie
        self.vegan = vegan
        self.allergies = allergies
        self.guests = guests
        self.items = items
        self.shopping = shopping
        self.extraShopping = extraShopping
        self.todos = todos
        self.note = note
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, UUID().uuidString)
        title = c.lenient(String.self, .title, "")
        date = c.lenient(String.self, .date, todayISO())
        time = c.lenientOptional(String.self, .time)
        format = c.lenient(String.self, .format, "menu")
        adults = c.lenient(Int.self, .adults, 2)
        kids = c.lenient(Int.self, .kids, 0)
        veggie = c.lenient(Int.self, .veggie, 0)
        vegan = c.lenient(Int.self, .vegan, 0)
        allergies = c.lenientOptional(String.self, .allergies)
        guests = c.lenientArray(PartyGuest.self, .guests)
        items = c.lenientArray(PartyItem.self, .items)
        shopping = c.lenient([String: Bool].self, .shopping, [:])
        extraShopping = c.lenient([String].self, .extraShopping, [])
        todos = c.lenientArray(PartyTodo.self, .todos)
        note = c.lenientOptional(String.self, .note)
    }

    enum CodingKeys: String, CodingKey { case id, title, date, time, format, adults, kids, veggie, vegan, allergies, guests, items, shopping, extraShopping, todos, note }
}

/// A person or group with their own favourites, e.g. "Eric", "C&J".
public struct FavLabel: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var id: String
    public var name: String
    /// index into the label colour palette
    public var color: Int

    public init(id: String, name: String, color: Int) {
        self.id = id
        self.name = name
        self.color = color
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = c.lenient(String.self, .id, UUID().uuidString)
        name = c.lenient(String.self, .name, "?")
        color = c.lenient(Int.self, .color, 0)
    }

    enum CodingKeys: String, CodingKey { case id, name, color }
}

public struct FamilySettings: Codable, Equatable, Hashable, Sendable {
    public var adults: Int
    public var kids: Int
    /// Do not suggest a dish again within this many days.
    public var avoidDays: Int
    /// custom builder composition: builder → group key → count
    public var builderCounts: [String: [String: Int]]?

    public static let defaults = FamilySettings(adults: 2, kids: 2, avoidDays: 10)

    public init(adults: Int, kids: Int, avoidDays: Int, builderCounts: [String: [String: Int]]? = nil) {
        self.adults = adults
        self.kids = kids
        self.avoidDays = avoidDays
        self.builderCounts = builderCounts
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        adults = c.lenient(Int.self, .adults, 2)
        kids = c.lenient(Int.self, .kids, 2)
        avoidDays = c.lenient(Int.self, .avoidDays, 10)
        builderCounts = c.lenientOptional([String: [String: Int]].self, .builderCounts)
    }

    enum CodingKeys: String, CodingKey { case adults, kids, avoidDays, builderCounts }
}

/// State shared by all phones of a family (one Firestore document).
public struct FamilyState: Codable, Equatable, Sendable {
    public var favorites: [String]
    /// key: ISO date YYYY-MM-DD
    public var plan: [String: DayEntry]
    public var customDishes: [String: Dish]
    public var settings: FamilySettings
    public var parties: [String: Party]
    public var labels: [FavLabel]
    /// label id → favourite dish ids
    public var labelFavorites: [String: [String]]
    /// label id → dish ids that person doesn't like
    public var labelDislikes: [String: [String]]
    /// built-in dishes the family removed from their list
    public var hiddenDishes: [String]

    public init(favorites: [String] = [], plan: [String: DayEntry] = [:], customDishes: [String: Dish] = [:], settings: FamilySettings = .defaults, parties: [String: Party] = [:], labels: [FavLabel] = [], labelFavorites: [String: [String]] = [:], labelDislikes: [String: [String]] = [:], hiddenDishes: [String] = []) {
        self.favorites = favorites
        self.plan = plan
        self.customDishes = customDishes
        self.settings = settings
        self.parties = parties
        self.labels = labels
        self.labelFavorites = labelFavorites
        self.labelDislikes = labelDislikes
        self.hiddenDishes = hiddenDishes
    }

    public static func empty() -> FamilyState { FamilyState() }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        favorites = c.lenient([String].self, .favorites, [])
        plan = c.lenientDict(DayEntry.self, .plan)
        customDishes = c.lenientDict(Dish.self, .customDishes).filter { !$0.value.id.isEmpty }
        settings = c.lenient(FamilySettings.self, .settings, .defaults)
        parties = c.lenientDict(Party.self, .parties)
        labels = c.lenientArray(FavLabel.self, .labels)
        labelFavorites = c.lenient([String: [String]].self, .labelFavorites, [:])
        labelDislikes = c.lenient([String: [String]].self, .labelDislikes, [:])
        hiddenDishes = c.lenient([String].self, .hiddenDishes, [])
    }

    enum CodingKeys: String, CodingKey { case favorites, plan, customDishes, settings, parties, labels, labelFavorites, labelDislikes, hiddenDishes }
}

// MARK: - lenient decoding helpers

extension KeyedDecodingContainer {
    /// Decode a value, falling back to `fallback` when it is missing, null or of the wrong type.
    func lenient<T: Decodable>(_ type: T.Type, _ key: Key, _ fallback: T) -> T {
        ((try? decodeIfPresent(type, forKey: key)) ?? nil) ?? fallback
    }

    /// Decode an optional value; missing, null or broken values become nil.
    func lenientOptional<T: Decodable>(_ type: T.Type, _ key: Key) -> T? {
        (try? decodeIfPresent(type, forKey: key)) ?? nil
    }

    /// Decode a dictionary, skipping single entries that cannot be decoded.
    func lenientDict<T: Decodable>(_ type: T.Type, _ key: Key) -> [String: T] {
        guard let raw = (try? decodeIfPresent([String: Lossy<T>].self, forKey: key)) ?? nil else { return [:] }
        return raw.compactMapValues { $0.value }
    }

    /// Decode an array, skipping single elements that cannot be decoded.
    func lenientArray<T: Decodable>(_ type: T.Type, _ key: Key) -> [T] {
        guard let raw = (try? decodeIfPresent([Lossy<T>].self, forKey: key)) ?? nil else { return [] }
        return raw.compactMap { $0.value }
    }
}

/// Wrapper that never fails to decode; `value` is nil when the element is broken.
struct Lossy<T: Decodable>: Decodable {
    let value: T?
    init(from decoder: Decoder) throws {
        value = try? T(from: decoder)
    }
}
