import Foundation
import XCTest
@testable import WFDCore

/// State operations, Firestore field mapping and JSON round trips (web compatibility).
final class SyncTests: XCTestCase {
    func testFamilyCodes() {
        let code = newFamilyCode()
        XCTAssertEqual(code.count, 14)
        XCTAssertEqual(code.split(separator: "-").count, 3)
        let allowed = Set("ABCDEFGHJKLMNPQRSTUVWXYZ23456789-")
        XCTAssertTrue(code.allSatisfy { allowed.contains($0) })
        XCTAssertEqual(cleanCode("abcd efgh-jkmn"), "ABCD-EFGH-JKMN")
        XCTAssertEqual(cleanCode("abc"), "ABC")
        XCTAssertEqual(familyDocId(" abcd-efgh-jkmn "), "ABCDEFGHJKMN")
    }

    func testDecodesAWebDocument() throws {
        let json = """
        {
          "favorites": ["lasagne"],
          "plan": {
            "2026-10-09": {"dishes": ["pizza"], "meals": {"coffee": ["kaesekuchen"]}, "labels": ["away:l-1"], "done": true},
            "broken": 42
          },
          "customDishes": {"c-1": {"id": "c-1", "name": {"orig": "Omas Suppe", "lang": "de", "de": "Omas Suppe", "en": "Grandma's soup"}, "cuisine": "german", "kind": "dish", "tags": ["veggie"], "effort": 2, "ingredients": ["carrots", "Liebe"], "custom": true, "futureField": {"x": 1}}},
          "settings": {"adults": 3, "kids": 1, "avoidDays": 7, "builderCounts": {"salad": {"slBase": 1, "slExtra": 3}}},
          "parties": {"p-1": {"id": "p-1", "title": "Geburtstag", "date": "2026-11-01", "format": "buffet", "adults": 10, "kids": 2, "veggie": 1, "vegan": 0, "guests": [{"id": "g", "name": "Anna"}], "items": [{"id": "i", "course": "main", "dishId": "lasagne", "broughtBy": "g"}], "shopping": {"eggs": true}, "extraShopping": ["Servietten"], "todos": [{"id": "t", "phase": "week", "text": "Einladen", "done": true}]}},
          "labels": [{"id": "l-1", "name": "Eric", "color": 2}],
          "labelFavorites": {"l-1": ["pizza"]},
          "labelDislikes": {},
          "hiddenDishes": ["waffeln"]
        }
        """
        let obj = try JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any]
        let s = decodeFamilyState(obj)
        XCTAssertEqual(s.favorites, ["lasagne"])
        XCTAssertEqual(s.plan.count, 1)
        XCTAssertEqual(s.plan["2026-10-09"]?.meals?["coffee"], ["kaesekuchen"])
        XCTAssertEqual(s.plan["2026-10-09"]?.isDone, true)
        XCTAssertEqual(s.customDishes["c-1"]?.name.en, "Grandma's soup")
        XCTAssertEqual(s.settings.adults, 3)
        XCTAssertEqual(s.settings.builderCounts?["salad"]?["slExtra"], 3)
        XCTAssertEqual(s.parties["p-1"]?.guests.first?.name, "Anna")
        XCTAssertEqual(s.parties["p-1"]?.shopping["eggs"], true)
        XCTAssertEqual(s.labels.first?.color, 2)
        XCTAssertEqual(s.hiddenDishes, ["waffeln"])
    }

    func testEmptyOrMissingDocument() {
        XCTAssertEqual(decodeFamilyState(nil), .empty())
        XCTAssertEqual(decodeFamilyState([:]).settings, .defaults)
        XCTAssertEqual(decodeFamilyState(["settings": ["kids": 0]]).settings, FamilySettings(adults: 2, kids: 0, avoidDays: 10))
    }

    func testEncodingNeverWritesNull() throws {
        var dish = Shared.dish("lasagne")
        dish.custom = true
        dish.rating = nil
        let obj = try jsonValue(dish) as? [String: Any]
        XCTAssertNotNil(obj)
        XCTAssertNil(obj?["rating"])
        XCTAssertNil(obj?["url"])
        XCTAssertEqual(obj?["custom"] as? Bool, true)
        let data = try JSONSerialization.data(withJSONObject: obj ?? [:])
        XCTAssertFalse(String(decoding: data, as: UTF8.self).contains("null"))
        // round trip
        let back = try JSONDecoder().decode(Dish.self, from: data)
        XCTAssertEqual(back, dish)
    }

    func testFirestoreFieldUpdates() throws {
        let day = try firestoreUpdates(.setDay(date: "2026-10-09", entry: DayEntry(dishes: ["pizza"])))
        XCTAssertEqual(day.map(\.path), [["plan", "2026-10-09"]])
        if case let .set(v) = day[0].change { XCTAssertEqual((v as? [String: Any])?["dishes"] as? [String], ["pizza"]) } else { XCTFail() }

        let cleared = try firestoreUpdates(.setDay(date: "2026-10-09", entry: DayEntry()))
        if case .delete = cleared[0].change {} else { XCTFail("empty day must be deleted") }

        let fav = try firestoreUpdates(.setFavorite(id: "x", on: true))
        XCTAssertEqual(fav[0].path, ["favorites"])
        if case let .arrayUnion(ids) = fav[0].change { XCTAssertEqual(ids, ["x"]) } else { XCTFail() }

        let del = try firestoreUpdates(.deleteLabel(id: "l1", remaining: []))
        XCTAssertEqual(del.map(\.path), [["labels"], ["labelFavorites", "l1"], ["labelDislikes", "l1"]])

        let settings = try firestoreUpdates(.updateSettings(SettingsPatch(kids: 3, builderCounts: ["salad": ["slBase": 2]])))
        XCTAssertEqual(settings.map(\.path), [["settings", "kids"], ["settings", "builderCounts"]])

        let dislike = try firestoreUpdates(.setLabelDislike(labelId: "l1", dishId: "d", on: false))
        XCTAssertEqual(dislike[0].path, ["labelDislikes", "l1"])
        if case .arrayRemove = dislike[0].change {} else { XCTFail() }
    }

    func testLocalApplyMatchesWebSemantics() {
        var s = FamilyState.empty()
        s = apply(.setFavorite(id: "a", on: true), to: s)
        s = apply(.setFavorite(id: "a", on: true), to: s)
        XCTAssertEqual(s.favorites, ["a"])
        s = apply(.setDay(date: "2026-10-09", entry: DayEntry(dishes: ["x"])), to: s)
        XCTAssertNotNil(s.plan["2026-10-09"])
        s = apply(.setDay(date: "2026-10-09", entry: DayEntry(done: false)), to: s)
        XCTAssertNil(s.plan["2026-10-09"])
        s = apply(.setDay(date: "2026-10-10", entry: DayEntry(labels: ["out"])), to: s)
        XCTAssertNotNil(s.plan["2026-10-10"])
        s = apply(.setLabelFavorite(labelId: "l", dishId: "d", on: true), to: s)
        s = apply(.setLabelDislike(labelId: "l", dishId: "e", on: true), to: s)
        s = apply(.deleteLabel(id: "l", remaining: []), to: s)
        XCTAssertNil(s.labelFavorites["l"])
        XCTAssertNil(s.labelDislikes["l"])
        s = apply(.updateSettings(SettingsPatch(avoidDays: 3)), to: s)
        XCTAssertEqual(s.settings.avoidDays, 3)
        XCTAssertEqual(s.settings.adults, 2)
    }

    func testMealHelpers() {
        var s = FamilyState.empty()
        s.plan["d"] = DayEntry(dishes: ["a"], meals: ["lunch": ["b"]])
        let e = entryWithMeal(s, "d", "coffee", ["c"])
        XCTAssertEqual(e.dishes, ["a"])
        XCTAssertEqual(e.meals?["lunch"], ["b"])
        XCTAssertEqual(e.meals?["coffee"], ["c"])
        let removed = entryWithMeal(s, "d", "lunch", [])
        XCTAssertNil(removed.meals?["lunch"])
        let labelled = entryTogglingLabel(s, "d", "out")
        XCTAssertEqual(labelled.labels, ["out"])
        s.plan["d"] = labelled
        XCTAssertNil(entryTogglingLabel(s, "d", "out").labels)
    }

    func testMergedDishesAndSearch() {
        var custom = Shared.dish("lasagne")
        custom.name.de = "Omas Lasagne"
        let own = Dish(id: "c-x", name: DishName(orig: "Eigenes", lang: "de", de: "Eigenes", en: "Own"), cuisine: "german", kind: "dish", ingredients: ["carrot"])
        let merged = mergedDishes(builtin: Shared.dishes, custom: ["lasagne": custom, "c-x": own])
        XCTAssertEqual(merged.count, Shared.dishes.count + 1)
        XCTAssertEqual(merged.first { $0.id == "lasagne" }?.name.de, "Omas Lasagne")
        XCTAssertEqual(visibleDishes(merged, hidden: ["c-x"]).count, Shared.dishes.count)
        XCTAssertTrue(matchesQuery(own, "karotte", Shared.catalog) && matchesQuery(own, "EIGEN carrot", Shared.catalog))
        XCTAssertEqual(areaOf(Shared.dish("tiramisu")) == "food", false)
        XCTAssertEqual(Shared.catalog.parseIngredients("Karotten; Liebe").last, "Liebe")
    }
}
