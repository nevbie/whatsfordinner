import SwiftUI
import WFDCore

// Small building blocks shared by the screens (web: src/components/*).

/// Original name (in its script) with the romanisation in brackets, then the translation.
@MainActor
struct DishNameView: View {
    @Environment(LangModel.self) private var lang
    let dish: Dish
    var size: Size = .md

    enum Size { case sm, md, lg }

    var body: some View {
        let translation = dish.name.text(lang.lang)
        VStack(alignment: .leading, spacing: 1) {
            nameLine
                .font(mainFont)
                .foregroundColor(Theme.text)
                .fixedSize(horizontal: false, vertical: true)
            if !translation.isEmpty && translation != dish.name.orig {
                Text(translation)
                    .font(size == .lg ? .subheadline : .caption)
                    .foregroundColor(Theme.muted)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .multilineTextAlignment(.leading)
    }

    private var nameLine: Text {
        var t = Text(dish.name.orig)
        if let roman = dish.name.roman, !roman.isEmpty {
            t = t + Text(" (\(roman))").foregroundColor(Theme.muted).font(size == .lg ? .body : .caption)
        }
        return t
    }

    private var mainFont: Font {
        switch size {
        case .sm: return .subheadline.weight(.semibold)
        case .md: return .headline
        case .lg: return .title3.weight(.bold)
        }
    }
}

/// "Italienisch · schnell · zuletzt vor 12 Tagen · 🌱 · ★★★"
@MainActor
struct DishMetaView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    let dish: Dish
    var showLast = true
    var compact = false

    var body: some View {
        Text(metaText)
            .font(.caption)
            .foregroundColor(Theme.muted)
            .fixedSize(horizontal: false, vertical: true)
    }

    private var metaText: String {
        var parts: [String] = []
        if dish.kind == "eatout" {
            parts.append(lang.t((dish.takeaway ?? false) ? "dish.takeaway" : "dish.restaurantOnly"))
            if let place = dish.place, !place.isEmpty { parts.append(place) }
        } else {
            parts.append(lang.l.cuisine(dish.cuisine))
            if dish.kind != "combo" { parts.append(lang.t("dish.effort\(dish.effort)")) }
        }
        if showLast {
            let stats = store.stats
            if let next = stats.next[dish.id] {
                parts.append(lang.t("dish.plannedOn", ["d": lang.day(next)]))
            } else if let last = stats.last[dish.id] {
                let n = daysBetween(last, stats.today)
                parts.append(n == 0 ? lang.t("dish.lastEatenToday") : lang.t("dish.lastEaten", n: n))
            } else if dish.kind != "combo" && dish.kind != "eatout" && !compact {
                parts.append(lang.t("dish.neverEaten"))
            }
        }
        if dish.has("vegan") { parts.append("🌱") } else if dish.has("veggie") { parts.append("🥕") }
        if let r = dish.rating, r > 0 { parts.append(String(repeating: "★", count: min(5, r))) }
        if dish.has("spicy") { parts.append("🌶") }
        return parts.joined(separator: " · ")
    }
}

func comboIcon(_ type: String) -> String {
    ["chinese": "🥢", "indian": "🍛", "tapas": "🫒", "abendbrot": "🥨", "teller": "🍽", "salad": "🥗"][type] ?? "🍽"
}

@MainActor
struct FavButton: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    let dish: Dish

    var body: some View {
        let on = store.isFavorite(dish.id)
        Button {
            store.toggleFavorite(dish.id)
        } label: {
            Image(systemName: on ? "heart.fill" : "heart")
                .font(.title3)
                .foregroundStyle(on ? Theme.accent : Theme.muted)
                .frame(width: 36, height: 36)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(lang.t(on ? "dish.unfavorite" : "dish.favorite"))
    }
}

/// Small coloured tags of the people whose favourite this is (★) or who don't like it (👎).
@MainActor
struct FanTags: View {
    @Environment(FamilyStore.self) private var store
    let dish: Dish

    var body: some View {
        let fans = store.state.labels.filter { store.isLabelFavorite($0.id, dish.id) }
        let haters = store.state.labels.filter { store.isLabelDislike($0.id, dish.id) }
        if !fans.isEmpty || !haters.isEmpty {
            FlowLayout(spacing: 4) {
                ForEach(fans) { l in LabelTag(text: "★ \(l.name)", color: l.color) }
                ForEach(haters) { l in LabelTag(text: "👎 \(l.name)", color: l.color, outlined: true) }
            }
        }
    }
}

@MainActor
struct LabelTag: View {
    let text: String
    let color: Int
    var outlined = false

    var body: some View {
        Text(text)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .foregroundStyle(outlined ? Theme.label(color) : Color.white)
            .background(outlined ? Color.clear : Theme.label(color), in: Capsule())
            .overlay(Capsule().stroke(Theme.label(color), lineWidth: outlined ? 1 : 0))
    }
}

/// Toggle chip (web `.chip`, `.chip.on`).
@MainActor
struct Chip: View {
    let label: String
    var on = false
    var color: Int? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline)
                .lineLimit(1)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .foregroundStyle(foreground)
                .background(background, in: Capsule())
                .overlay(Capsule().stroke(border, lineWidth: 1))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(on ? .isSelected : [])
    }

    private var foreground: Color {
        if on { return color == nil ? Theme.accentText : .white }
        return color.map { Theme.label($0) } ?? Theme.text
    }

    private var background: Color {
        if on { return color.map { Theme.label($0) } ?? Theme.accent }
        return Theme.surface
    }

    private var border: Color {
        if on { return .clear }
        return color.map { Theme.label($0) } ?? Theme.line
    }
}

/// Static (non-tappable) chip.
@MainActor
struct StaticChip: View {
    let label: String

    var body: some View {
        Text(label)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .foregroundStyle(Theme.text)
            .background(Theme.surface2, in: Capsule())
    }
}

/// Horizontally scrolling row of chips.
@MainActor
struct ChipRow<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) { content }
                .padding(.vertical, 1)
        }
    }
}

/// Wrapping layout for chips.
struct FlowLayout: Layout {
    var spacing: CGFloat = 6

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = arrange(width: proposal.width ?? .infinity, subviews: subviews)
        let width = rows.map(\.width).max() ?? 0
        let height = rows.map(\.height).reduce(0, +) + spacing * CGFloat(max(0, rows.count - 1))
        return CGSize(width: proposal.width ?? width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var y = bounds.minY
        for row in arrange(width: bounds.width, subviews: subviews) {
            var x = bounds.minX
            for i in row.indices {
                let size = subviews[i].sizeThatFits(.unspecified)
                subviews[i].place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(width: min(size.width, bounds.width), height: size.height))
                x += min(size.width, bounds.width) + spacing
            }
            y += row.height + spacing
        }
    }

    private struct Row {
        var indices: [Int] = []
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func arrange(width: CGFloat, subviews: Subviews) -> [Row] {
        var rows: [Row] = []
        var current = Row()
        for i in subviews.indices {
            let size = subviews[i].sizeThatFits(.unspecified)
            let w = min(size.width, width)
            if !current.indices.isEmpty && current.width + spacing + w > width {
                rows.append(current)
                current = Row()
            }
            current.width += (current.indices.isEmpty ? 0 : spacing) + w
            current.height = max(current.height, size.height)
            current.indices.append(i)
        }
        if !current.indices.isEmpty { rows.append(current) }
        return rows
    }
}

/// − value + (web Stepper).
@MainActor
struct StepperRow: View {
    let label: String
    let value: Int
    let range: ClosedRange<Int>
    let onChange: (Int) -> Void

    var body: some View {
        HStack {
            if !label.isEmpty {
                Text(label)
                Spacer()
            }
            Button {
                onChange(max(range.lowerBound, value - 1))
            } label: {
                Image(systemName: "minus.circle").font(.title2)
            }
            .buttonStyle(.plain)
            .disabled(value <= range.lowerBound)
            .accessibilityLabel("\(label) −")
            Text("\(value)")
                .font(.body.monospacedDigit().weight(.semibold))
                .frame(minWidth: 28)
            Button {
                onChange(min(range.upperBound, value + 1))
            } label: {
                Image(systemName: "plus.circle").font(.title2)
            }
            .buttonStyle(.plain)
            .disabled(value >= range.upperBound)
            .accessibilityLabel("\(label) +")
        }
        .foregroundStyle(Theme.text)
    }
}

/// 1–5 star rating; tapping the current value again clears it.
@MainActor
struct StarsEditor: View {
    let value: Int
    let onChange: (Int) -> Void

    var body: some View {
        HStack(spacing: 2) {
            ForEach(1...5, id: \.self) { n in
                Button {
                    onChange(value == n ? 0 : n)
                } label: {
                    Image(systemName: n <= value ? "star.fill" : "star")
                        .foregroundStyle(n <= value ? Theme.highlight : Theme.muted)
                        .font(.title3)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

/// Text field that saves on submit / when it loses focus (so typing stays smooth while syncing).
@MainActor
struct CommitField: View {
    let placeholder: String
    let value: String
    var multiline = false
    var clearAfterCommit = false
    let onCommit: (String) -> Void

    @State private var draft = ""
    @FocusState private var focused: Bool

    var body: some View {
        field
            .focused($focused)
            .onAppear { draft = value }
            .onChange(of: value) { _, newValue in
                if !focused { draft = newValue }
            }
            .onChange(of: focused) { _, isFocused in
                if !isFocused { commit() }
            }
            .onSubmit { commit() }
    }

    @ViewBuilder private var field: some View {
        if multiline {
            TextField(placeholder, text: $draft, axis: .vertical)
                .lineLimit(2...6)
                .textFieldStyle(.roundedBorder)
        } else {
            TextField(placeholder, text: $draft)
                .textFieldStyle(.roundedBorder)
                .submitLabel(.done)
        }
    }

    private func commit() {
        if draft != value { onCommit(draft) }
        if clearAfterCommit { draft = "" }
    }
}

/// Small grey section caption.
@MainActor
struct Caption: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.caption.weight(.semibold))
            .foregroundStyle(Theme.muted)
            .textCase(.uppercase)
    }
}

/// Navigation wrapper for every sheet: title and a close button.
@MainActor
struct SheetScaffold<Content: View>: View {
    @Environment(Router.self) private var router
    @Environment(LangModel.self) private var lang
    let title: String
    var onClose: (() -> Void)? = nil
    @ViewBuilder let content: Content

    var body: some View {
        NavigationStack {
            content
                .background(Theme.bg)
                .navigationTitle(title)
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            if let onClose { onClose() } else { router.close() }
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .symbolRenderingMode(.hierarchical)
                                .font(.title3)
                        }
                        .accessibilityLabel(lang.t("close"))
                    }
                }
        }
    }
}

/// Persisted filters per device (web: usePersistentFilters).
enum FilterStorage {
    static func load(_ key: String) -> Filters {
        normalizeFilters(UserDefaults.standard.data(forKey: key))
    }

    static func save(_ key: String, _ filters: Filters) {
        if let data = try? JSONEncoder().encode(filters) { UserDefaults.standard.set(data, forKey: key) }
    }
}
