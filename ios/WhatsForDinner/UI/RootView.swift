import SwiftUI
import WFDCore

/// Six tabs at the bottom like the web app (a system TabView would hide the sixth behind "More").
@MainActor
struct RootView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        content
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Theme.bg.ignoresSafeArea())
            .safeAreaInset(edge: .bottom, spacing: 0) { TabBar() }
            .sheet(item: router.binding(at: 0)) { item in
                OverlayHost(item: item, index: 0)
            }
            .onChange(of: scenePhase) { _, phase in
                if phase == .active { store.refreshDay() }
            }
    }

    @ViewBuilder private var content: some View {
        switch router.tab {
        case .suggest: SuggestView()
        case .plan: PlanView()
        case .dishes: DishesView()
        case .party: PartyListView()
        case .history: HistoryView()
        case .settings: SettingsView()
        }
    }
}

@MainActor
private struct TabBar: View {
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    private struct TabDef {
        let tab: AppTab
        let icon: String
        let key: String
    }

    private let tabs: [TabDef] = [
        TabDef(tab: .suggest, icon: "dice", key: "nav.suggest"),
        TabDef(tab: .plan, icon: "calendar", key: "nav.plan"),
        TabDef(tab: .dishes, icon: "book", key: "nav.dishes"),
        TabDef(tab: .party, icon: "party.popper", key: "nav.party"),
        TabDef(tab: .history, icon: "clock.arrow.circlepath", key: "nav.history"),
        TabDef(tab: .settings, icon: "gearshape", key: "nav.settingsShort"),
    ]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(tabs, id: \.tab) { def in
                let tab = def.tab
                Button {
                    router.tab = tab
                } label: {
                    VStack(spacing: 2) {
                        Image(systemName: def.icon).font(.system(size: 19))
                        Text(lang.t(def.key)).font(.system(size: 10, weight: .medium)).lineLimit(1).minimumScaleFactor(0.7)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 6)
                    .foregroundStyle(router.tab == tab ? Theme.accent : Theme.muted)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(router.tab == tab ? .isSelected : [])
            }
        }
        .padding(.horizontal, 4)
        .background(Theme.surface.ignoresSafeArea(edges: .bottom))
        .overlay(alignment: .top) { Divider() }
    }
}

/// One sheet of the overlay stack; presents the next one on top of itself.
@MainActor
struct OverlayHost: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let item: OverlayItem
    let index: Int

    var body: some View {
        overlayContent
            .sheet(item: router.binding(at: index + 1)) { next in
                OverlayHost(item: next, index: index + 1)
            }
            .environment(store)
            .environment(lang)
            .environment(router)
            .tint(Theme.accent)
    }

    private var overlayContent: AnyView {
        switch item.overlay {
        case let .dish(id):
            return AnyView(DishDetailView(id: id))
        case let .combo(type, seedId, date, meal):
            return AnyView(ComboBuilderView(store: store, combo: type, seedId: seedId, date: date, meal: meal))
        case let .form(id, kind):
            return AnyView(DishFormView(store: store, lang: lang.lang, id: id, kind: kind))
        case let .party(id):
            return AnyView(PartyView(id: id))
        case let .pickDish(title, filter):
            return AnyView(DishPickerView(itemId: item.id, title: title, filter: filter))
        case .pickDay:
            return AnyView(DayPickerView(itemId: item.id))
        }
    }
}
