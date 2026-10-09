import Foundation
import XCTest
@testable import WFDCore

/// The real shared data of the repository (../../../shared from this file).
enum Shared {
    static let root: URL = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent() // WFDCoreTests
        .deletingLastPathComponent() // Tests
        .deletingLastPathComponent() // WFDCore
        .deletingLastPathComponent() // ios
        .deletingLastPathComponent() // repo
        .appendingPathComponent("shared")

    static let catalog: DishCatalog = {
        do {
            return try DishCatalog(data: Data(contentsOf: root.appendingPathComponent("dishes.json")))
        } catch {
            fatalError("cannot load shared/dishes.json: \(error)")
        }
    }()

    static let strings: Strings = {
        do {
            return try Strings(data: Data(contentsOf: root.appendingPathComponent("strings.json")))
        } catch {
            fatalError("cannot load shared/strings.json: \(error)")
        }
    }()

    static var dishes: [Dish] { catalog.dishes }
    static let byId: [String: Dish] = Dictionary(catalog.dishes.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })

    static func dish(_ id: String, file: StaticString = #filePath, line: UInt = #line) -> Dish {
        guard let d = byId[id] else {
            XCTFail("missing dish \(id)", file: file, line: line)
            return Dish(id: id, name: DishName(orig: id, lang: "de", de: id, en: id), cuisine: "german", kind: "dish")
        }
        return d
    }
}

/// Deterministic RNG (same Park–Miller generator as the web tests).
func seeded(_ seed: Int = 1) -> Rng {
    final class Box { var s: Int; init(_ s: Int) { self.s = s } }
    let box = Box(seed)
    return {
        box.s = (box.s * 16807) % 2147483647
        return Double(box.s - 1) / 2147483646
    }
}

let TODAY = "2026-10-06"
