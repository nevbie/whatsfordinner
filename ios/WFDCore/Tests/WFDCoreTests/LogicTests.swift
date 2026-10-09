import Foundation
import XCTest
@testable import WFDCore

/// Port of src/__tests__/logic.test.ts against shared/dishes.json.
final class LogicTests: XCTestCase {
    private let all = Shared.dishes
    private func d(_ id: String) -> Dish { Shared.dish(id) }
    private func ctx(_ state: FamilyState = .empty(), _ filters: Filters = .defaults) -> SuggestContext {
        SuggestContext(state: state, filters: filters, today: TODAY)
    }
    private func opts(_ type: String = "chinese", adults: Int = 2, kids: Int = 2, diet: String = "any", drink: Bool = false, counts: [String: Int]? = nil) -> ComboOptions {
        ComboOptions(type: type, adults: adults, kids: kids, diet: diet, drink: drink, counts: counts)
    }
    private func pick(_ o: ComboOptions) -> PickContext { PickContext(options: o) }
    private func dishesOf(_ entries: [ComboEntry]) -> [Dish?] { entries.map { $0.dishId.flatMap { Shared.byId[$0] } } }
    private func filters(_ change: (inout Filters) -> Void) -> Filters {
        var f = Filters.defaults
        change(&f)
        return f
    }

    // MARK: dates

    func testDates() {
        XCTAssertEqual(weekStart("2026-10-06"), "2026-10-05")
        XCTAssertEqual(weekStart("2026-10-11"), "2026-10-05")
        XCTAssertEqual(addDays("2026-12-31", 1), "2027-01-01")
        XCTAssertEqual(addDays("2026-03-29", 1), "2026-03-30")
        XCTAssertEqual(daysBetween("2026-10-01", "2026-10-06"), 5)
        XCTAssertEqual(nextSaturday("2026-10-06"), "2026-10-10")
        XCTAssertEqual(nextSaturday("2026-10-10"), "2026-10-10")
        XCTAssertEqual(season("2026-12-01"), "winter")
        XCTAssertEqual(season("2026-07-01"), "summer")
        XCTAssertEqual(season("2026-10-01"), "mid")
    }

    // MARK: suggest

    func testNeverSuggestsSidesRecentOrPlanned() {
        var state = FamilyState.empty()
        state.plan[addDays(TODAY, -3)] = DayEntry(dishes: ["lasagne"])
        state.plan[addDays(TODAY, 2)] = DayEntry(dishes: ["pizza"])
        for seed in 1..<30 {
            let out = suggest(all, ctx(state), 5, rng: seeded(seed))
            XCTAssertEqual(out.count, 5)
            for x in out {
                XCTAssertNotEqual(x.kind, "side")
                XCTAssertNotEqual(x.kind, "eatout")
                XCTAssertFalse(["lasagne", "pizza"].contains(x.id))
            }
        }
    }

    func testRespectsDietFilters() {
        let out = suggest(all, ctx(.empty(), filters { $0.diet = "vegan" }), 20, rng: seeded(3))
        for x in out where x.kind == "dish" { XCTAssertTrue(x.has("vegan"), x.id) }
    }

    func testRestaurantsOnlyWhenEatingOut() {
        let out = suggest(all, ctx(.empty(), filters { $0.eatOut = true }), 300, rng: seeded(5))
        XCTAssertTrue(out.contains { $0.kind == "eatout" })
    }

    // MARK: combos

    func testChineseDishCount() {
        XCTAssertEqual(chineseDishCount(2, 2), 3)
        XCTAssertEqual(chineseDishCount(3, 2), 4)
        XCTAssertEqual(chineseDishCount(1, 0), 2)
    }

    func testCompleteChineseMeal() {
        for seed in 1..<50 {
            let o = opts(adults: 3, kids: 2)
            let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(seed)))
            XCTAssertTrue(ds.allSatisfy { $0 != nil })
            let dishes = ds.compactMap { $0 }
            XCTAssertEqual(dishes.count, 5)
            XCTAssertEqual(dishes.last?.course, "staple")
            XCTAssertLessThanOrEqual(dishes.filter { $0.has("spicy") }.count, 1)
            let mains = dishes.filter { $0.course != "staple" }.compactMap { $0.ingredients.first }
            XCTAssertEqual(Set(mains).count, mains.count)
        }
    }

    func testVegetarianThali() {
        for seed in 1..<30 {
            let o = opts("indian", diet: "veggie", drink: true)
            let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(seed))).compactMap { $0 }
            let courses = ds.map { $0.course ?? "" }
            XCTAssertEqual(courses.count, 8)
            XCTAssertEqual(Array(courses.prefix(4)), ["dal", "curry", "sabzi", "raita"])
            XCTAssertEqual(Array(courses.suffix(3)), ["bread", "rice", "drink"])
            for x in ds { XCTAssertTrue(x.has("veggie"), x.id) }
        }
    }

    func testSeedLockedAndRerollChangesOneEntry() {
        let o = opts()
        let filled = fillEntries(initialEntries(o, seed: d("gongbao-jiding")), all, pick(o), rng: seeded(7))
        XCTAssertEqual(filled[0].dishId, "gongbao-jiding")
        let rerolled = rerollEntry(filled, 1, all, pick(o), rng: seeded(8))
        XCTAssertEqual(rerolled[0].dishId, "gongbao-jiding")
        XCTAssertNotEqual(rerolled[1].dishId, filled[1].dishId)
        XCTAssertEqual(rerolled[2].dishId, filled[2].dishId)
    }

    func testOneDishMealGetsASide() {
        let o = opts()
        let filled = fillEntries(initialEntries(o, seed: d("jiaozi")), all, pick(o), rng: seeded(2))
        XCTAssertEqual(filled.first?.dishId, "jiaozi")
        XCTAssertEqual(filled.count, 2)
    }

    // MARK: region and staple filters

    func testStaples() {
        XCTAssertEqual(staplesOf(d("spaghetti-bolognese")), ["pasta"])
        XCTAssertEqual(staplesOf(d("pizza")), ["dough"])
        XCTAssertEqual(staplesOf(d("jiaozi")), ["dough"])
        XCTAssertEqual(staplesOf(d("raclette")), ["potatoes"])
        XCTAssertEqual(staplesOf(d("palak-paneer")), ["bread", "rice"])
        XCTAssertEqual(staplesOf(d("mapo-doufu")), ["rice"])
    }

    func testRegionFilter() {
        let favs = Set<String>()
        XCTAssertTrue(matchesFilters(d("lasagne"), filters { $0.regions = ["europe"] }, favs))
        XCTAssertFalse(matchesFilters(d("lasagne"), filters { $0.regions = ["asia"] }, favs))
        XCTAssertTrue(matchesFilters(d("chinesisch"), filters { $0.regions = ["asia"] }, favs))
        XCTAssertTrue(matchesFilters(d("falafel"), filters { $0.regions = ["europe", "other"] }, favs))
    }

    func testStapleFilter() {
        let favs = Set<String>()
        XCTAssertTrue(matchesFilters(d("lasagne"), filters { $0.staples = ["rice", "pasta"] }, favs))
        XCTAssertFalse(matchesFilters(d("lasagne"), filters { $0.staples = ["potatoes"] }, favs))
        let out = suggest(all, ctx(.empty(), filters { $0.staples = ["potatoes"]; $0.regions = ["europe"] }), 30, rng: seeded(4))
        XCTAssertGreaterThan(out.count, 10)
        for x in out {
            XCTAssertTrue(staplesOf(x).contains("potatoes"), x.id)
            XCTAssertEqual(regionOf(x), "europe")
        }
    }

    func testOutdatedStoredFilters() {
        XCTAssertEqual(normalizeFilters(#"{"cuisine":"european"}"#.data(using: .utf8)).cuisines, [])
        XCTAssertEqual(normalizeFilters(#"{"cuisine":"italian"}"#.data(using: .utf8)).cuisines, ["italian"])
        XCTAssertEqual(normalizeFilters(#"{}"#.data(using: .utf8)).staples, [])
        XCTAssertEqual(normalizeFilters("garbage".data(using: .utf8)), .defaults)
        let f = filters { $0.diet = "vegan"; $0.cuisines = ["indian"] }
        let data = try? JSONEncoder().encode(f)
        XCTAssertEqual(normalizeFilters(data), f)
        XCTAssertEqual(activeFilterCount(f), 2)
    }

    // MARK: party planner

    private func baseParty() -> Party { newParty(date: "2026-12-12", settings: .defaults, lang: .de) }
    private func pctx(_ seed: Int) -> PartySuggestContext { PartySuggestContext(pool: all, favorites: [], today: TODAY, rng: seeded(seed)) }

    func testPartyMenuWithVegetarianAlternative() {
        for s in 1..<20 {
            var p = baseParty()
            p.veggie = 2
            let items = suggestPartyItems(p, pctx(s))
            let courses = items.map(\.course)
            XCTAssertEqual(courses.filter { $0 == "main" }.count, 2)
            for c in ["starter", "side", "dessert", "drink"] { XCTAssertTrue(courses.contains(c), c) }
            let mains = items.filter { $0.course == "main" }.compactMap { $0.dishId.flatMap { Shared.byId[$0] } }
            XCTAssertTrue(mains.contains { $0.has("veggie") })
            XCTAssertEqual(Set(items.compactMap(\.dishId)).count, items.count)
        }
    }

    func testPartyAllVegan() {
        var p = baseParty()
        p.format = "buffet"
        p.adults = 6
        p.kids = 0
        p.vegan = 6
        for item in suggestPartyItems(p, pctx(3)) {
            guard let dish = item.dishId.flatMap({ Shared.byId[$0] }) else { return XCTFail("no dish") }
            XCTAssertTrue(dish.has("vegan"), dish.id)
        }
    }

    func testPartyInteractiveMain() {
        var p = baseParty()
        p.format = "interactive"
        let main = suggestPartyItems(p, pctx(5)).first { $0.course == "main" }
        let dish = main?.dishId.flatMap { Shared.byId[$0] }
        XCTAssertTrue(dish?.has("social") ?? false)
    }

    func testPartyKeepsHandPickedAndBrought() {
        var p = baseParty()
        p.items = [PartyItem(id: "x", course: "dessert", dishId: "tiramisu", locked: true), PartyItem(id: "y", course: "drink", text: "Wein", broughtBy: "g1")]
        let items = suggestPartyItems(p, pctx(9))
        XCTAssertEqual(items.filter { $0.course == "dessert" }.map(\.dishId), ["tiramisu"])
        XCTAssertEqual(items.filter { $0.course == "drink" }.count, 1)
    }

    func testShoppingListWithoutBroughtItems() {
        var p = baseParty()
        p.items = [PartyItem(id: "a", course: "dessert", dishId: "tiramisu"), PartyItem(id: "b", course: "dip", dishId: "guacamole", broughtBy: "g1")]
        let keys = shoppingList(p, Shared.byId).map(\.key)
        XCTAssertTrue(keys.contains("mascarpone"))
        XCTAssertFalse(keys.contains("avocado"))
    }

    func testDefaultChecklist() {
        let text = defaultTodos(format: "interactive", kids: 2, lang: .en).map(\.text).joined(separator: ",")
        XCTAssertNotNil(text.range(of: "raclette", options: .caseInsensitive))
    }

    // MARK: sweet dishes

    func testSweetFilter() {
        let f = filters { $0.sweetOnly = true }
        let sweet = all.filter { $0.kind == "dish" && matchesFilters($0, f, []) }.map(\.id)
        for id in ["griessbrei", "arme-ritter", "kaiserschmarrn", "milchreis"] { XCTAssertTrue(sweet.contains(id), id) }
        for id in sweet { XCTAssertTrue(d(id).has("sweet"), id) }
        XCTAssertFalse(matchesFilters(d("chinesisch"), f, []))
    }

    // MARK: labels and variants

    private func withLabels() -> FamilyState {
        var s = FamilyState.empty()
        s.labels = [FavLabel(id: "e", name: "Eric", color: 0), FavLabel(id: "cj", name: "C&J", color: 1)]
        s.labelFavorites = ["e": ["lasagne", "pizza"], "cj": ["kaesespaetzle"]]
        return s
    }

    func testLabelFavouriteFilter() {
        let s = withLabels()
        let f = filters { $0.favLabels = ["cj"] }
        XCTAssertTrue(matchesFilters(d("kaesespaetzle"), f, [], s.labelFavorites))
        XCTAssertFalse(matchesFilters(d("lasagne"), f, [], s.labelFavorites))
    }

    func testWaitingLabel() {
        var s = withLabels()
        s.plan[addDays(TODAY, -2)] = DayEntry(dishes: ["lasagne"])
        XCTAssertEqual(waitingLabel(s, lastEaten(s.plan, TODAY)), "cj")
    }

    func testOneVariantPerRound() {
        let f = filters { $0.sweetOnly = true }
        for seed in 1..<40 {
            let groups = suggest(all, ctx(.empty(), f), 6, rng: seeded(seed)).compactMap(\.group)
            XCTAssertEqual(Set(groups).count, groups.count)
        }
    }

    func testVariantsAreSeparateDishes() {
        XCTAssertEqual(d("schupfnudeln").group, "schupfnudeln")
        XCTAssertEqual(d("schupfnudeln-apfelmus").group, "schupfnudeln")
        XCTAssertTrue(d("fischstaebchen-selbst").name.orig.contains("selbstgemacht"))
        XCTAssertNotNil(Shared.byId["haehnchen-pilz-mais"])
    }

    // MARK: tapas, Abendbrot, Teller, salad, baking

    func testTapasEvening() {
        for seed in 1..<30 {
            let o = opts("tapas")
            let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(seed)))
            XCTAssertEqual(ds.count, 5)
            XCTAssertTrue(ds.allSatisfy { $0 != nil })
            let courses = ds.compactMap { $0?.course }
            for c in ["tapaVeg", "tapaMeat", "tapaFish", "tapaBread"] { XCTAssertTrue(courses.contains(c), c) }
            XCTAssertEqual(Set(ds.compactMap { $0?.id }).count, 5)
        }
        XCTAssertEqual(d("tapas").combo, "tapas")
        XCTAssertEqual(d("tortilla-espanola").name.orig, "Tortilla de patatas")
    }

    func testAbendbrot() {
        for seed in 1..<30 {
            let o = opts("abendbrot")
            let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(seed)))
            XCTAssertTrue(ds.allSatisfy { $0 != nil })
            let courses = ds.compactMap { $0?.course }
            for c in ["abBread", "abCheese", "abSpread", "abVeg", "abExtra"] { XCTAssertTrue(courses.contains(c), c) }
            XCTAssertTrue(courses.contains { $0 == "abMeat" || $0 == "abFish" })
        }
        let o = opts("abendbrot", diet: "veggie")
        for x in dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(3))).compactMap({ $0 }) {
            XCTAssertTrue(x.has("veggie"), x.id)
        }
        XCTAssertEqual(d("brotzeit").combo, "abendbrot")
    }

    func testTellerPlate() {
        let o = opts("teller")
        for seed in 1..<20 {
            let ds = dishesOf(fillEntries(initialEntries(o, seed: d("schnitzel")), all, pick(o), rng: seeded(seed)))
            XCTAssertEqual(ds.map { $0?.course }, ["plMain", "plStarch", "plVeg"])
            XCTAssertEqual(ds.first??.id, "schnitzel")
        }
    }

    func testSalad() {
        let o = opts("salad")
        let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(4)))
        XCTAssertEqual(ds.map { $0?.course }, ["slBase", "slExtra", "slExtra", "slTopping", "slDressing"])
        XCTAssertNotEqual(ds[1]?.id, ds[2]?.id)
    }

    func testNeverSuggestsBakingForDinner() {
        let out = suggest(all, ctx(), 400, rng: seeded(9))
        XCTAssertFalse(out.contains { $0.kind == "bake" })
    }

    func testCakesForThePartyPlanner() {
        var party = newParty(date: "2026-10-10", settings: .defaults, lang: .de)
        party.format = "buffet"
        party.adults = 12
        let items = suggestPartyItems(party, PartySuggestContext(pool: all, favorites: [], today: TODAY, rng: seeded(2)))
        let cake = items.first { $0.course == "cake" }
        XCTAssertEqual(cake?.dishId.flatMap { Shared.byId[$0] }?.kind, "bake")
    }

    func testFamilyRecipesAttached() {
        for id in ["kaesekuchen", "kaiserschmarrn", "waffeln", "haehnchen-suesskartoffel"] { XCTAssertNotNil(Shared.byId[id]?.recipe, id) }
    }

    // MARK: composition & meals

    func testOwnComposition() {
        let o = opts("salad", counts: ["slBase": 1, "slExtra": 3, "slTopping": 0, "slDressing": 1])
        let ds = dishesOf(fillEntries(initialEntries(o), all, pick(o), rng: seeded(3)))
        XCTAssertEqual(ds.map { $0?.course }, ["slBase", "slExtra", "slExtra", "slExtra", "slDressing"])
    }

    func testDefaultCounts() {
        XCTAssertEqual(defaultCounts(opts("salad")), ["slBase": 1, "slExtra": 2, "slTopping": 1, "slDressing": 1])
        XCTAssertEqual(defaultCounts(opts("chinese")), ["main": 1, "veg": 1, "soup": 1, "staple": 1])
        XCTAssertEqual(groupKeyOf("veg2"), "veg")
        XCTAssertEqual(groupKeyOf("abSpread2"), "abSpread")
    }

    func testOtherMealsCountAsEaten() {
        let plan = ["2026-03-01": DayEntry(dishes: ["lasagne"], meals: ["lunch": ["minestrone"], "coffee": ["kaesekuchen"]])]
        let last = lastEaten(plan, TODAY)
        XCTAssertEqual(last["minestrone"], "2026-03-01")
        XCTAssertEqual(last["kaesekuchen"], "2026-03-01")
    }

    // MARK: dislikes

    func testDislikes() {
        var state = FamilyState.empty()
        state.labels = [FavLabel(id: "j", name: "J", color: 0)]
        state.labelDislikes = ["j": ["lasagne"]]
        let lasagne = d("lasagne")
        let withDislike = weight(lasagne, ctx(state), [:], [])
        let normal = weight(lasagne, ctx(), [:], [])
        XCTAssertLessThan(withDislike, normal * 0.2)
        XCTAssertEqual(weight(lasagne, ctx(state, filters { $0.favLabels = ["j"] }), [:], []), 0)
        XCTAssertEqual(weight(lasagne, ctx(state, filters { $0.noDislikes = true }), [:], []), 0)
        // away that day: the dislike does not count
        state.plan[TODAY] = DayEntry(labels: ["away:j"])
        XCTAssertEqual(weight(lasagne, ctx(state), [:], []), normal)
    }
}
