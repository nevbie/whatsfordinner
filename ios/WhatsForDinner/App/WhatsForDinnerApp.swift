import SwiftUI
import WFDCore

@main
struct WhatsForDinnerApp: App {
    @State private var store: FamilyStore
    @State private var lang: LangModel
    @State private var router = Router()

    init() {
        let resources = AppResources.load()
        FirebaseService.configureIfAvailable()
        _lang = State(initialValue: LangModel(strings: resources.strings))
        _store = State(initialValue: FamilyStore(catalog: resources.catalog, loadError: resources.error))
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
                .environment(lang)
                .environment(router)
                .tint(Theme.accent)
        }
    }
}

/// Built-in dishes and UI texts bundled from ../shared (see project.yml).
struct AppResources {
    var catalog: DishCatalog
    var strings: Strings
    var error: String?

    static func load(bundle: Bundle = .main) -> AppResources {
        var errors: [String] = []
        var catalog = DishCatalog.empty
        var strings = Strings.empty
        if let url = bundle.url(forResource: "dishes", withExtension: "json") {
            do {
                catalog = try DishCatalog(data: Data(contentsOf: url))
            } catch {
                errors.append("dishes.json: \(error.localizedDescription)")
            }
        } else {
            errors.append("dishes.json missing")
        }
        if let url = bundle.url(forResource: "strings", withExtension: "json") {
            do {
                strings = try Strings(data: Data(contentsOf: url))
            } catch {
                errors.append("strings.json: \(error.localizedDescription)")
            }
        } else {
            errors.append("strings.json missing")
        }
        return AppResources(catalog: catalog, strings: strings, error: errors.isEmpty ? nil : errors.joined(separator: "; "))
    }
}
