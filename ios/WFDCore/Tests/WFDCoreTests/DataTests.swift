import Foundation
import XCTest
@testable import WFDCore

/// Port of src/__tests__/data.test.ts against shared/dishes.json.
final class DataTests: XCTestCase {
    func testLoadsTheSharedData() {
        XCTAssertGreaterThan(Shared.dishes.count, 400)
        XCTAssertGreaterThan(Shared.catalog.ingredients.count, 300)
        XCTAssertEqual(Shared.strings.de["appTitle"], "Was gibt’s heute?")
        XCTAssertNotNil(Shared.strings.en["nav.suggest"])
    }

    func testUniqueIds() {
        let ids = Shared.dishes.map(\.id)
        XCTAssertEqual(Set(ids).count, ids.count)
    }

    func testOnlyKnownIngredientKeys() {
        let unknown = Shared.dishes.flatMap { d in d.ingredients.filter { Shared.catalog.ingredients[$0] == nil }.map { "\(d.id): \($0)" } }
        XCTAssertEqual(unknown, [])
    }

    func testNamesInBothLanguages() {
        for d in Shared.dishes {
            XCTAssertFalse(d.name.orig.isEmpty, d.id)
            XCTAssertFalse(d.name.de.isEmpty, d.id)
            XCTAssertFalse(d.name.en.isEmpty, d.id)
        }
    }

    func testRomanisationForNonLatinNames() {
        let latin = CharacterSet(charactersIn: Unicode.Scalar(UInt32(0x0000))!...Unicode.Scalar(UInt32(0x024F))!)
            .union(CharacterSet(charactersIn: Unicode.Scalar(UInt32(0x1E00))!...Unicode.Scalar(UInt32(0x1EFF))!))
            .union(CharacterSet(charactersIn: Unicode.Scalar(UInt32(0x2018))!...Unicode.Scalar(UInt32(0x201E))!))
            .union(.whitespaces)
            .union(CharacterSet(charactersIn: ".,()/'’–-"))
        for d in Shared.dishes {
            let nonLatin = d.name.orig.unicodeScalars.contains { !latin.contains($0) }
            if nonLatin { XCTAssertFalse((d.name.roman ?? "").isEmpty, d.id) }
        }
    }

    func testChineseAndIndianDishesHaveACourse() {
        for d in Shared.dishes where (d.cuisine == "chinese" || d.cuisine == "indian") && d.kind != "combo" && d.kind != "party" {
            XCTAssertNotNil(d.course, d.id)
        }
    }

    func testPairsWithPointsAtExistingDishes() {
        let ids = Set(Shared.dishes.map(\.id))
        for d in Shared.dishes {
            for p in d.pairsWith ?? [] { XCTAssertTrue(ids.contains(p), "\(d.id) → \(p)") }
        }
    }

    func testVeganSubsetOfVeggie() {
        for d in Shared.dishes {
            if d.has("vegan") { XCTAssertTrue(d.has("veggie"), d.id) }
            if d.has("veggie") {
                XCTAssertFalse(d.has("meat"), d.id)
                XCTAssertFalse(d.has("fish"), d.id)
            }
        }
    }

    func testBilingualRecipes() {
        for d in Shared.dishes {
            guard let r = d.recipe else { continue }
            XCTAssertEqual(r.steps.de.count, r.steps.en.count, d.id)
            XCTAssertEqual(r.ingredients.de.count, r.ingredients.en.count, d.id)
        }
    }

    func testKidsFavouritesExcludeReviewedDishes() {
        let tagged = Shared.dishes.filter { $0.kind == "dish" && $0.has("kids") }.map(\.id)
        XCTAssertFalse(tagged.isEmpty)
        for removed in ["arme-ritter", "dampfnudeln", "raclette", "dan-chaofan", "butter-chicken", "pasta-pesto"] {
            XCTAssertFalse(tagged.contains(removed), removed)
        }
    }

    func testEveryUIStringExistsInBothLanguages() {
        XCTAssertEqual(Set(Shared.strings.de.keys), Set(Shared.strings.en.keys))
        let l = Localizer(strings: Shared.strings, lang: .de)
        XCTAssertEqual(l.t("dishes.count", ["n": "5"]).contains("5"), true)
        XCTAssertEqual(l.partyFormat("buffet").name, "Buffet")
        XCTAssertEqual(l.cuisine("italian"), "Italienisch")
        XCTAssertEqual(Localizer(strings: Shared.strings, lang: .en).tag("spicy"), "Spicy")
    }
}
