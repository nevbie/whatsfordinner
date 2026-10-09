import Foundation
import Observation
import SwiftUI
import WFDCore

enum AppTab: String, CaseIterable {
    case suggest, plan, dishes, party, history, settings
}

/// Sheets stacked on top of the current tab (dish detail, builder, form, party, pickers).
enum Overlay {
    case dish(id: String)
    case combo(type: String, seedId: String?, date: String?, meal: String?)
    case form(id: String?, kind: String?)
    case party(id: String)
    case pickDish(title: String, filter: ((Dish) -> Bool)?)
    case pickDay
}

struct OverlayItem: Identifiable {
    let id = UUID()
    let overlay: Overlay
    var resolve: ((String?) -> Void)?
}

@MainActor
@Observable
final class Router {
    var tab: AppTab = .suggest
    private(set) var stack: [OverlayItem] = []
    @ObservationIgnored private var results: [UUID: String] = [:]

    func open(_ o: Overlay) {
        stack.append(OverlayItem(overlay: o))
    }

    func openDish(_ id: String) { open(.dish(id: id)) }
    func openCombo(_ type: String, seedId: String? = nil, date: String? = nil, meal: String? = nil) {
        open(.combo(type: type, seedId: seedId, date: date, meal: meal))
    }
    func openForm(id: String? = nil, kind: String? = nil) { open(.form(id: id, kind: kind)) }
    func openParty(_ id: String) { open(.party(id: id)) }

    /// Close the top sheet.
    func close() {
        if !stack.isEmpty { pop(to: stack.count - 1) }
    }

    /// Close a picker and hand its result to the waiting caller.
    func finish(_ id: UUID, _ result: String?) {
        results[id] = result
        if let i = stack.firstIndex(where: { $0.id == id }) { pop(to: i) }
    }

    /// Remove all sheets from index `count` on. Pickers resolve after their sheet is gone, so callers can
    /// safely present the next sheet.
    func pop(to count: Int) {
        while stack.count > max(0, count) {
            let item = stack.removeLast()
            guard let resolve = item.resolve else { continue }
            let value = results.removeValue(forKey: item.id)
            Task { @MainActor in
                try? await Task.sleep(nanoseconds: 450_000_000)
                resolve(value)
            }
        }
    }

    func pickDish(_ title: String, filter: ((Dish) -> Bool)? = nil) async -> String? {
        await withCheckedContinuation { (cont: CheckedContinuation<String?, Never>) in
            var item = OverlayItem(overlay: .pickDish(title: title, filter: filter))
            item.resolve = { cont.resume(returning: $0) }
            stack.append(item)
        }
    }

    func pickDay() async -> String? {
        await withCheckedContinuation { (cont: CheckedContinuation<String?, Never>) in
            var item = OverlayItem(overlay: .pickDay)
            item.resolve = { cont.resume(returning: $0) }
            stack.append(item)
        }
    }

    /// Binding for the sheet at a stack position (swipe-down sets it to nil).
    func binding(at index: Int) -> Binding<OverlayItem?> {
        Binding(
            get: { self.stack.indices.contains(index) ? self.stack[index] : nil },
            set: { newValue in
                if newValue == nil, self.stack.count > index { self.pop(to: index) }
            }
        )
    }
}
