import Foundation

// Changes to the family state. Each operation can be applied locally (like src/store/local.ts) or
// translated into Firestore field-level updates (exactly like src/store/firebase.ts). Keeping the
// translation here makes it testable without Firebase.

/// Partial settings update (settings.<key> in Firestore). Only non-nil fields are written.
public struct SettingsPatch: Equatable, Sendable {
    public var adults: Int?
    public var kids: Int?
    public var avoidDays: Int?
    public var builderCounts: [String: [String: Int]]?

    public init(adults: Int? = nil, kids: Int? = nil, avoidDays: Int? = nil, builderCounts: [String: [String: Int]]? = nil) {
        self.adults = adults
        self.kids = kids
        self.avoidDays = avoidDays
        self.builderCounts = builderCounts
    }
}

public enum FamilyOp: Equatable, Sendable {
    case setDay(date: String, entry: DayEntry?)
    case setFavorite(id: String, on: Bool)
    case saveDish(Dish)
    case deleteDish(id: String)
    case updateSettings(SettingsPatch)
    case saveParty(Party)
    case deleteParty(id: String)
    case saveLabels([FavLabel])
    case deleteLabel(id: String, remaining: [FavLabel])
    case setLabelFavorite(labelId: String, dishId: String, on: Bool)
    case setLabelDislike(labelId: String, dishId: String, on: Bool)
    case setHidden(dishId: String, on: Bool)
}

/// A day entry is kept when it has dishes, is marked as done or has day markers.
public func keepEntry(_ entry: DayEntry?) -> Bool {
    guard let entry else { return false }
    return !dayDishIds(entry).isEmpty || entry.isDone || !(entry.labels ?? []).isEmpty
}

private func adding(_ list: [String], _ id: String) -> [String] { list.contains(id) ? list : list + [id] }

/// Apply an operation to the state (local backend semantics).
public func apply(_ op: FamilyOp, to state: FamilyState) -> FamilyState {
    var s = state
    switch op {
    case let .setDay(date, entry):
        if let entry, keepEntry(entry) { s.plan[date] = entry } else { s.plan[date] = nil }
    case let .setFavorite(id, on):
        s.favorites = on ? adding(s.favorites, id) : s.favorites.filter { $0 != id }
    case let .saveDish(dish):
        s.customDishes[dish.id] = dish
    case let .deleteDish(id):
        s.customDishes[id] = nil
    case let .updateSettings(p):
        if let v = p.adults { s.settings.adults = v }
        if let v = p.kids { s.settings.kids = v }
        if let v = p.avoidDays { s.settings.avoidDays = v }
        if let v = p.builderCounts { s.settings.builderCounts = v }
    case let .saveParty(party):
        s.parties[party.id] = party
    case let .deleteParty(id):
        s.parties[id] = nil
    case let .saveLabels(labels):
        s.labels = labels
    case let .deleteLabel(id, remaining):
        s.labels = remaining
        s.labelFavorites[id] = nil
        s.labelDislikes[id] = nil
    case let .setLabelFavorite(labelId, dishId, on):
        let cur = s.labelFavorites[labelId] ?? []
        s.labelFavorites[labelId] = on ? adding(cur, dishId) : cur.filter { $0 != dishId }
    case let .setLabelDislike(labelId, dishId, on):
        let cur = s.labelDislikes[labelId] ?? []
        s.labelDislikes[labelId] = on ? adding(cur, dishId) : cur.filter { $0 != dishId }
    case let .setHidden(dishId, on):
        s.hiddenDishes = on ? adding(s.hiddenDishes, dishId) : s.hiddenDishes.filter { $0 != dishId }
    }
    return s
}

/// Value of a Firestore field update. `.set` holds a JSON-compatible value (String, NSNumber, arrays, maps).
public enum FieldChange {
    case set(Any)
    case delete
    case arrayUnion([String])
    case arrayRemove([String])
}

/// One field-level update: path components (e.g. ["plan", "2026-10-09"]) and the change.
public struct FieldUpdate {
    public var path: [String]
    public var change: FieldChange

    public init(_ path: [String], _ change: FieldChange) {
        self.path = path
        self.change = change
    }
}

/// Field-level Firestore updates for an operation – the same fields and shapes as the web app.
public func firestoreUpdates(_ op: FamilyOp) throws -> [FieldUpdate] {
    switch op {
    case let .setDay(date, entry):
        if let entry, keepEntry(entry) { return [FieldUpdate(["plan", date], .set(try jsonValue(entry)))] }
        return [FieldUpdate(["plan", date], .delete)]
    case let .setFavorite(id, on):
        return [FieldUpdate(["favorites"], on ? .arrayUnion([id]) : .arrayRemove([id]))]
    case let .saveDish(dish):
        return [FieldUpdate(["customDishes", dish.id], .set(try jsonValue(dish)))]
    case let .deleteDish(id):
        return [FieldUpdate(["customDishes", id], .delete)]
    case let .updateSettings(p):
        var out: [FieldUpdate] = []
        if let v = p.adults { out.append(FieldUpdate(["settings", "adults"], .set(NSNumber(value: v)))) }
        if let v = p.kids { out.append(FieldUpdate(["settings", "kids"], .set(NSNumber(value: v)))) }
        if let v = p.avoidDays { out.append(FieldUpdate(["settings", "avoidDays"], .set(NSNumber(value: v)))) }
        if let v = p.builderCounts { out.append(FieldUpdate(["settings", "builderCounts"], .set(try jsonValue(v)))) }
        return out
    case let .saveParty(party):
        return [FieldUpdate(["parties", party.id], .set(try jsonValue(party)))]
    case let .deleteParty(id):
        return [FieldUpdate(["parties", id], .delete)]
    case let .saveLabels(labels):
        return [FieldUpdate(["labels"], .set(try jsonValue(labels)))]
    case let .deleteLabel(id, remaining):
        return [
            FieldUpdate(["labels"], .set(try jsonValue(remaining))),
            FieldUpdate(["labelFavorites", id], .delete),
            FieldUpdate(["labelDislikes", id], .delete),
        ]
    case let .setLabelFavorite(labelId, dishId, on):
        return [FieldUpdate(["labelFavorites", labelId], on ? .arrayUnion([dishId]) : .arrayRemove([dishId]))]
    case let .setLabelDislike(labelId, dishId, on):
        return [FieldUpdate(["labelDislikes", labelId], on ? .arrayUnion([dishId]) : .arrayRemove([dishId]))]
    case let .setHidden(dishId, on):
        return [FieldUpdate(["hiddenDishes"], on ? .arrayUnion([dishId]) : .arrayRemove([dishId]))]
    }
}

// MARK: - JSON bridging (Codable ↔ Firestore maps)

/// Encode a value to a JSON-compatible object (dictionaries, arrays, strings, numbers). nil fields are omitted.
public func jsonValue<T: Encodable>(_ value: T) throws -> Any {
    let data = try JSONEncoder().encode(value)
    return try JSONSerialization.jsonObject(with: data, options: [.fragmentsAllowed])
}

/// Drop everything that is not plain JSON (timestamps, references, NaN …) from data read from Firestore.
public func sanitizeJSON(_ value: Any) -> Any? {
    switch value {
    case let s as String:
        return s
    case let n as NSNumber:
        if let d = n as? Double, !d.isFinite { return nil }
        return n
    case let a as [Any]:
        return a.compactMap(sanitizeJSON)
    case let m as [String: Any]:
        return m.compactMapValues(sanitizeJSON)
    default:
        return nil
    }
}

/// Decode the family document (as read from Firestore) leniently; never fails.
public func decodeFamilyState(_ object: [String: Any]?) -> FamilyState {
    guard let object, let clean = sanitizeJSON(object), JSONSerialization.isValidJSONObject(clean),
          let data = try? JSONSerialization.data(withJSONObject: clean),
          let state = try? JSONDecoder().decode(FamilyState.self, from: data)
    else { return .empty() }
    return state
}

// MARK: - Family code

private let CODE_ALPHABET = Array("ABCDEFGHJKLMNPQRSTUVWXYZ23456789")

/// New random family code XXXX-XXXX-XXXX.
public func newFamilyCode() -> String {
    var gen = SystemRandomNumberGenerator()
    let chars = (0..<12).map { _ in CODE_ALPHABET[Int(UInt8.random(in: 0...255, using: &gen)) % CODE_ALPHABET.count] }
    let s = String(chars)
    return "\(s.prefix(4))-\(s.dropFirst(4).prefix(4))-\(s.dropFirst(8))"
}

/// Normalise user input ("abcd efgh-jkmn") to the stored form.
public func cleanCode(_ code: String) -> String {
    let allowed = Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
    let c = String(code.uppercased().filter { allowed.contains($0) })
    guard c.count == 12 else { return c }
    return "\(c.prefix(4))-\(c.dropFirst(4).prefix(4))-\(c.dropFirst(8))"
}

/// Firestore document id: families/{CODE without dashes}.
public func familyDocId(_ code: String) -> String {
    cleanCode(code).replacingOccurrences(of: "-", with: "")
}
