// swift-tools-version:5.9
import PackageDescription

/// UI-free logic of "Was gibt's heute?" (data model, suggestions, meal builders, party planner).
/// No Firebase, no UIKit – builds and tests on Linux with `swift test`.
let package = Package(
    name: "WFDCore",
    platforms: [.iOS(.v17), .macOS(.v13)],
    products: [
        .library(name: "WFDCore", targets: ["WFDCore"]),
    ],
    targets: [
        .target(name: "WFDCore"),
        .testTarget(name: "WFDCoreTests", dependencies: ["WFDCore"]),
    ]
)
