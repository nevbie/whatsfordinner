import XCTest
@testable import WhatsForDinner

/// Runs inside the app: checks that ../shared/*.json are bundled and readable.
/// The logic itself is tested in the WFDCore package (`cd ios/WFDCore && swift test`).
final class AppResourcesTests: XCTestCase {
    func testSharedJSONIsBundled() {
        let resources = AppResources.load()
        XCTAssertNil(resources.error)
        XCTAssertGreaterThan(resources.catalog.dishes.count, 400)
        XCTAssertNotNil(resources.strings.de["appTitle"])
        XCTAssertNotNil(resources.strings.en["appTitle"])
    }

    func testWebAppIdIsMappedForFirebaseCore() {
        let s = FirebaseSettings(apiKey: "k", projectId: "p", appId: "1:1234567890:web:abcdef0123456789", authDomain: nil)
        XCTAssertEqual(s.gcmSenderID, "1234567890")
        XCTAssertEqual(s.iosAppID, "1:1234567890:ios:abcdef0123456789")
        let ios = FirebaseSettings(apiKey: "k", projectId: "p", appId: "1:1234567890:ios:abc", authDomain: nil)
        XCTAssertEqual(ios.iosAppID, "1:1234567890:ios:abc")
    }
}
