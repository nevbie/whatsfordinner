import SwiftUI
import UIKit

/// Berry & Peach palette (top of src/styles.css), light and dark.
enum Theme {
    static let brand = dynamic(0x5B2A4E, 0xE7B6D6)
    static let accent = dynamic(0xD9404C, 0xF2707A)
    static let accentText = dynamic(0xFFFFFF, 0x1D1219)
    static let accentSoft = dynamic(0xFDE2DC, 0x4C2433)
    static let highlight = dynamic(0xF7A76C, 0xF7A76C)
    static let bg = dynamic(0xFFF5EE, 0x1D1219)
    static let surface = dynamic(0xFFFFFF, 0x2A1A25)
    static let surface2 = dynamic(0xFFECE2, 0x362230)
    static let text = dynamic(0x3B2235, 0xF8EBF2)
    static let muted = dynamic(0x6E5A69, 0xBEA8B8)
    static let line = dynamic(0xF1DDD4, 0x47303F)
    static let danger = dynamic(0xB4233A, 0xFF8A8A)

    private static let labelLight: [UInt32] = [0x2563EB, 0xDB2777, 0x059669, 0x9333EA, 0xD97706, 0x0891B2, 0xDC2626, 0x65A30D]
    private static let labelDark: [UInt32] = [0x60A5FA, 0xF472B6, 0x34D399, 0xC084FC, 0xFBBF24, 0x22D3EE, 0xF87171, 0xA3E635]

    /// Colour of a person/group label.
    static func label(_ index: Int) -> Color {
        let i = ((index % 8) + 8) % 8
        return dynamic(labelLight[i], labelDark[i])
    }

    static func dynamic(_ light: UInt32, _ dark: UInt32) -> Color {
        Color(UIColor { traits in
            UIColor(hex: traits.userInterfaceStyle == .dark ? dark : light)
        })
    }
}

extension UIColor {
    convenience init(hex: UInt32) {
        self.init(
            red: CGFloat((hex >> 16) & 0xFF) / 255,
            green: CGFloat((hex >> 8) & 0xFF) / 255,
            blue: CGFloat(hex & 0xFF) / 255,
            alpha: 1
        )
    }
}

/// White rounded card like the web's `.card`.
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).stroke(Theme.line, lineWidth: 1))
    }
}

extension View {
    func card() -> some View { modifier(CardModifier()) }
}

/// Filled / outlined capsule buttons (web `.btn`, `.btn.primary`).
struct PillButtonStyle: ButtonStyle {
    var primary = false
    var danger = false
    var small = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(small ? .subheadline.weight(.semibold) : .body.weight(.semibold))
            .padding(.horizontal, small ? 10 : 14)
            .padding(.vertical, small ? 6 : 9)
            .foregroundStyle(primary ? Theme.accentText : (danger ? Theme.danger : Theme.text))
            .background(primary ? Theme.accent : Theme.surface2, in: Capsule())
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}
