import Foundation
import Observation
import WFDCore

/// The family state plus all actions – the native counterpart of src/store/StoreContext.tsx.
@MainActor
@Observable
final class FamilyStore {
    let catalog: DishCatalog
    let loadError: String?
    /// Firebase is configured (FirebaseConfig.plist present and valid).
    let syncAvailable: Bool

    private(set) var state: FamilyState
    private(set) var familyCode: String?
    var syncError: String? = nil

    /// Built-in dishes (with the family's edits) and own dishes, including removed ones (for the history).
    private(set) var allDishes: [Dish] = []
    /// Dishes shown in lists and suggestions (without removed ones).
    private(set) var dishes: [Dish] = []
    private(set) var dishById: [String: Dish] = [:]
    private(set) var stats: DishStats

    @ObservationIgnored private var backend: FamilyBackend? = nil
    @ObservationIgnored private let builtinIds: Set<String>
    @ObservationIgnored private var lastCustom: [String: Dish]? = nil
    @ObservationIgnored private var lastHidden: [String]? = nil

    private static let familyKey = "wfd:family"

    init(catalog: DishCatalog, loadError: String? = nil) {
        self.catalog = catalog
        self.loadError = loadError
        builtinIds = Set(catalog.dishes.map(\.id))
        syncAvailable = FirebaseService.isConfigured
        let initial = LocalStorage.read()
        state = initial
        stats = DishStats(plan: initial.plan, today: todayISO())
        familyCode = syncAvailable ? UserDefaults.standard.string(forKey: Self.familyKey) : nil
        recompute()
        connect()
    }

    // MARK: backend

    private func connect() {
        backend?.stop()
        syncError = nil
        let next: FamilyBackend
        if let code = familyCode {
            next = FirebaseBackend(code: code)
        } else {
            next = LocalBackend()
        }
        backend = next
        next.start(
            onState: { [weak self, weak next] s in
                guard let self, let next, self.backend === next else { return }
                self.setState(s)
                // keep a local copy so the app opens instantly and keeps the data when the family is left
                if self.familyCode != nil { LocalStorage.write(s) }
            },
            onError: { [weak self] message in
                self?.syncError = message
            }
        )
    }

    private func setState(_ s: FamilyState) {
        state = s
        recompute()
    }

    private func recompute() {
        if lastCustom != state.customDishes || allDishes.isEmpty {
            allDishes = mergedDishes(builtin: catalog.dishes, custom: state.customDishes)
            dishById = Dictionary(allDishes.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })
            lastCustom = state.customDishes
            lastHidden = nil
        }
        if lastHidden != state.hiddenDishes {
            dishes = visibleDishes(allDishes, hidden: state.hiddenDishes)
            lastHidden = state.hiddenDishes
        }
        stats = DishStats(plan: state.plan, today: todayISO())
    }

    /// Call when the app becomes active again (the day may have changed).
    func refreshDay() {
        if stats.today != todayISO() { stats = DishStats(plan: state.plan, today: todayISO()) }
    }

    private func run(_ op: FamilyOp) {
        backend?.send(op)
    }

    func isBuiltin(_ id: String) -> Bool { builtinIds.contains(id) }

    // MARK: plan

    func setDay(_ date: String, _ entry: DayEntry?) {
        run(.setDay(date: date, entry: entry))
    }

    /// Replace the dishes of one meal of a day, keeping the other meals.
    func setMeal(_ date: String, _ meal: String, _ ids: [String]) {
        setDay(date, entryWithMeal(state, date, meal, ids))
    }

    func mealIds(_ date: String, _ meal: String) -> [String] {
        WFDCore.mealIds(state, date, meal)
    }

    // MARK: dishes

    func isFavorite(_ id: String) -> Bool { state.favorites.contains(id) }

    func toggleFavorite(_ id: String) {
        run(.setFavorite(id: id, on: !state.favorites.contains(id)))
    }

    func saveDish(_ dish: Dish) { run(.saveDish(dish)) }
    func deleteDish(_ id: String) { run(.deleteDish(id: id)) }
    func setHidden(_ dishId: String, _ on: Bool) { run(.setHidden(dishId: dishId, on: on)) }

    // MARK: settings, parties, labels

    func updateSettings(_ patch: SettingsPatch) { run(.updateSettings(patch)) }
    func saveParty(_ party: Party) { run(.saveParty(party)) }
    func deleteParty(_ id: String) { run(.deleteParty(id: id)) }

    func addLabel(_ name: String) {
        let used = Set(state.labels.map(\.color))
        let color = (0..<8).first { !used.contains($0) } ?? state.labels.count % 8
        let label = FavLabel(id: "l-\(base36Now())", name: name, color: color)
        run(.saveLabels(state.labels + [label]))
    }

    func renameLabel(_ id: String, _ name: String) {
        run(.saveLabels(state.labels.map { $0.id == id ? FavLabel(id: $0.id, name: name, color: $0.color) : $0 }))
    }

    func deleteLabel(_ id: String) {
        run(.deleteLabel(id: id, remaining: state.labels.filter { $0.id != id }))
    }

    func label(_ id: String) -> FavLabel? { state.labels.first { $0.id == id } }

    func isLabelFavorite(_ labelId: String, _ dishId: String) -> Bool { (state.labelFavorites[labelId] ?? []).contains(dishId) }
    func isLabelDislike(_ labelId: String, _ dishId: String) -> Bool { (state.labelDislikes[labelId] ?? []).contains(dishId) }

    /// A person can't love and dislike the same dish: setting one clears the other.
    func toggleLabelFavorite(_ labelId: String, _ dishId: String) {
        let on = !isLabelFavorite(labelId, dishId)
        if on && isLabelDislike(labelId, dishId) { run(.setLabelDislike(labelId: labelId, dishId: dishId, on: false)) }
        run(.setLabelFavorite(labelId: labelId, dishId: dishId, on: on))
    }

    func toggleLabelDislike(_ labelId: String, _ dishId: String) {
        let on = !isLabelDislike(labelId, dishId)
        if on && isLabelFavorite(labelId, dishId) { run(.setLabelFavorite(labelId: labelId, dishId: dishId, on: false)) }
        run(.setLabelDislike(labelId: labelId, dishId: dishId, on: on))
    }

    // MARK: family sync

    func createFamily() async throws -> String {
        let code = newFamilyCode()
        try await FirebaseService.createFamily(code: code, initial: state)
        UserDefaults.standard.set(code, forKey: Self.familyKey)
        familyCode = code
        connect()
        return code
    }

    func joinFamily(_ input: String) async throws -> Bool {
        let code = cleanCode(input)
        guard try await FirebaseService.familyExists(code: code) else { return false }
        UserDefaults.standard.set(code, forKey: Self.familyKey)
        familyCode = code
        connect()
        return true
    }

    func leaveFamily() {
        LocalStorage.write(state)
        UserDefaults.standard.removeObject(forKey: Self.familyKey)
        familyCode = nil
        connect()
    }
}
