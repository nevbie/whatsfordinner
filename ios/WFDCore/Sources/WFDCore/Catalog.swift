import Foundation

// Built-in data (shared/dishes.json) and UI texts (shared/strings.json).

/// Contents of shared/dishes.json: built-in dishes and the ingredient dictionary.
public struct DishCatalog: Sendable {
    public var version: Int
    public var dishes: [Dish]
    /// ingredient key → [de, en]
    public var ingredients: [String: [String]]

    public static let empty = DishCatalog(version: 0, dishes: [], ingredients: [:])

    public init(version: Int, dishes: [Dish], ingredients: [String: [String]]) {
        self.version = version
        self.dishes = dishes
        self.ingredients = ingredients
    }

    public init(data: Data) throws {
        let raw = try JSONDecoder().decode(Raw.self, from: data)
        version = raw.version ?? 1
        dishes = raw.dishes.filter { !$0.id.isEmpty }
        ingredients = raw.ingredients ?? [:]
    }

    private struct Raw: Decodable {
        var version: Int?
        var dishes: [Dish]
        var ingredients: [String: [String]]?
    }

    public func ingredientName(_ key: String, _ lang: Lang) -> String {
        guard let entry = ingredients[key], entry.count >= 2 else { return key }
        return entry[lang == .de ? 0 : 1]
    }

    /// Map typed ingredient names back to dictionary keys where possible; keep the rest as free text.
    public func parseIngredients(_ text: String) -> [String] {
        var lookup: [String: String] = [:]
        for (key, names) in ingredients {
            lookup[key] = key
            for n in names { lookup[n.lowercased()] = key }
        }
        return text
            .components(separatedBy: CharacterSet(charactersIn: ",;\n"))
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
            .map { lookup[$0] ?? lookup[$0.lowercased()] ?? $0 }
    }
}

/// Contents of shared/strings.json.
public struct Strings: Sendable {
    public var de: [String: String]
    public var en: [String: String]
    public var tags: [String: [String]]
    public var cuisines: [String: [String]]
    public var courses: [String: [String]]
    /// format → [icon, de, en]
    public var partyFormats: [String: [String]]
    public var partyCourses: [String: [String]]
    public var todoPhases: [String: [String]]
    public var langNames: [String: [String]]

    public static let empty = Strings(de: [:], en: [:], tags: [:], cuisines: [:], courses: [:], partyFormats: [:], partyCourses: [:], todoPhases: [:], langNames: [:])

    public init(de: [String: String], en: [String: String], tags: [String: [String]], cuisines: [String: [String]], courses: [String: [String]], partyFormats: [String: [String]], partyCourses: [String: [String]], todoPhases: [String: [String]], langNames: [String: [String]]) {
        self.de = de
        self.en = en
        self.tags = tags
        self.cuisines = cuisines
        self.courses = courses
        self.partyFormats = partyFormats
        self.partyCourses = partyCourses
        self.todoPhases = todoPhases
        self.langNames = langNames
    }

    public init(data: Data) throws {
        let r = try JSONDecoder().decode(Raw.self, from: data)
        self.init(de: r.de, en: r.en, tags: r.tags ?? [:], cuisines: r.cuisines ?? [:], courses: r.courses ?? [:], partyFormats: r.partyFormats ?? [:], partyCourses: r.partyCourses ?? [:], todoPhases: r.todoPhases ?? [:], langNames: r.langNames ?? [:])
    }

    private struct Raw: Decodable {
        var de: [String: String]
        var en: [String: String]
        var tags: [String: [String]]?
        var cuisines: [String: [String]]?
        var courses: [String: [String]]?
        var partyFormats: [String: [String]]?
        var partyCourses: [String: [String]]?
        var todoPhases: [String: [String]]?
        var langNames: [String: [String]]?
    }
}

/// Order of tags, cuisines and languages as in the web app (JSON objects lose their order when decoded).
public let TAG_ORDER = ["meat", "fish", "veggie", "vegan", "kids", "spicy", "oven", "sweet", "social", "winter", "summer"]
public let CUISINE_ORDER = ["german", "austrian", "swiss", "french", "italian", "spanish", "greek", "turkish", "mideast", "persian", "northafrican", "eastern", "american", "mexican", "chinese", "indian", "thai", "vietnamese", "japanese", "korean", "georgian", "fusion", "restaurant"]
public let LANG_ORDER = ["de", "en", "it", "fr", "es", "ca", "el", "tr", "ar", "fa", "hu", "pl", "zh", "hi", "ta", "ml", "mr", "th", "vi", "ja", "ko"]

/// Builder roles for the dish form.
public let CHINESE_COURSES = ["meat", "fish", "tofu", "egg", "veg", "cold", "soup", "staple", "meal"]
public let INDIAN_COURSES = ["curry", "dal", "sabzi", "raita", "chutney", "salad", "side", "bread", "rice", "drink", "dessert", "snack", "meal"]
public let OTHER_BUILDERS: [(String, [String])] = [
    ("tapas", ["tapaVeg", "tapaMeat", "tapaFish", "tapaBread"]),
    ("abendbrot", ["abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra"]),
    ("teller", ["plMain", "plStarch", "plVeg"]),
    ("salad", ["slBase", "slExtra", "slTopping", "slDressing"]),
]
public let BAKE_COURSES = ["bkCake", "bkDessert", "bkPastry", "bkSweets"]

/// Translates UI keys; placeholders like {n} are replaced.
public struct Localizer: Sendable {
    public var strings: Strings
    public var lang: Lang

    public init(strings: Strings, lang: Lang) {
        self.strings = strings
        self.lang = lang
    }

    public func t(_ key: String, _ vars: [String: String] = [:]) -> String {
        let dict = lang == .de ? strings.de : strings.en
        var s = dict[key] ?? key
        for (k, v) in vars { s = s.replacingOccurrences(of: "{\(k)}", with: v) }
        return s
    }

    public func t(_ key: String, n: Int) -> String { t(key, ["n": String(n)]) }

    /// [de, en] pair → text in the UI language.
    public func pick(_ pair: [String]?) -> String {
        guard let pair, !pair.isEmpty else { return "" }
        let i = lang == .de ? 0 : 1
        return pair.count > i ? pair[i] : pair[0]
    }

    public func tag(_ key: String) -> String { strings.tags[key].map { pick($0) } ?? key }
    public func cuisine(_ key: String) -> String { strings.cuisines[key].map { pick($0) } ?? key }
    public func course(_ key: String) -> String { strings.courses[key].map { pick($0) } ?? key }
    public func partyCourse(_ key: String) -> String { strings.partyCourses[key].map { pick($0) } ?? key }
    public func todoPhase(_ key: String) -> String { strings.todoPhases[key].map { pick($0) } ?? key }
    public func langName(_ key: String) -> String { strings.langNames[key].map { pick($0) } ?? key }

    /// (icon, name) of a party format.
    public func partyFormat(_ key: String) -> (icon: String, name: String) {
        guard let v = strings.partyFormats[key], v.count >= 3 else { return ("🎉", key) }
        return (v[0], lang == .de ? v[1] : v[2])
    }

    /// Language codes for the dish form, in the web app's order.
    public var langCodes: [String] {
        LANG_ORDER.filter { strings.langNames[$0] != nil } + strings.langNames.keys.filter { !LANG_ORDER.contains($0) }.sorted()
    }
}
