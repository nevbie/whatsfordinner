import Foundation
import Observation
import WFDCore

/// UI language: follows the device (German → de, everything else → en) with a switch in the settings.
@MainActor
@Observable
final class LangModel {
    let strings: Strings
    var lang: Lang {
        didSet { UserDefaults.standard.set(lang.rawValue, forKey: Self.key) }
    }

    private static let key = "wfd:lang"

    init(strings: Strings) {
        self.strings = strings
        if let stored = UserDefaults.standard.string(forKey: Self.key), let l = Lang(rawValue: stored) {
            lang = l
        } else {
            let preferred = Locale.preferredLanguages.first ?? "en"
            lang = preferred.hasPrefix("de") ? .de : .en
        }
    }

    var l: Localizer { Localizer(strings: strings, lang: lang) }

    func t(_ key: String, _ vars: [String: String] = [:]) -> String { l.t(key, vars) }
    func t(_ key: String, n: Int) -> String { l.t(key, n: n) }
    func pick(_ pair: [String]?) -> String { l.pick(pair) }

    var locale: Locale { Locale(identifier: lang == .de ? "de_DE" : "en_GB") }

    /// Date of an ISO day formatted with a template, e.g. "EEEdM" → "Mo., 5.10.".
    func day(_ iso: String, _ template: String = "EEEdM") -> String {
        let f = DateFormatter()
        f.locale = locale
        f.setLocalizedDateFormatFromTemplate(template)
        return f.string(from: fromISO(iso))
    }
}
