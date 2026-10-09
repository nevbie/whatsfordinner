import Foundation

// Local-time ISO dates (YYYY-MM-DD) – mirrors src/logic/dates.ts.

private func calendar() -> Calendar {
    var c = Calendar(identifier: .gregorian)
    c.timeZone = TimeZone.current
    return c
}

private func pad(_ n: Int, _ width: Int) -> String {
    let s = String(n)
    return s.count >= width ? s : String(repeating: "0", count: width - s.count) + s
}

/// Year, month, day of an ISO date; nil when it cannot be parsed.
public func isoParts(_ iso: String) -> (year: Int, month: Int, day: Int)? {
    let parts = iso.split(separator: "-").compactMap { Int($0) }
    guard parts.count == 3 else { return nil }
    return (parts[0], parts[1], parts[2])
}

public func toISO(_ date: Date) -> String {
    let c = calendar().dateComponents([.year, .month, .day], from: date)
    return "\(pad(c.year ?? 2000, 4))-\(pad(c.month ?? 1, 2))-\(pad(c.day ?? 1, 2))"
}

/// Noon of that local day (noon avoids daylight-saving edge cases in date arithmetic).
public func fromISO(_ iso: String) -> Date {
    guard let p = isoParts(iso) else { return Date() }
    var comps = DateComponents()
    comps.year = p.year
    comps.month = p.month
    comps.day = p.day
    comps.hour = 12
    return calendar().date(from: comps) ?? Date()
}

public func todayISO() -> String { toISO(Date()) }

public func addDays(_ iso: String, _ days: Int) -> String {
    let d = calendar().date(byAdding: .day, value: days, to: fromISO(iso)) ?? fromISO(iso)
    return toISO(d)
}

/// Whole days from a to b (b - a).
public func daysBetween(_ a: String, _ b: String) -> Int {
    calendar().dateComponents([.day], from: fromISO(a), to: fromISO(b)).day ?? 0
}

/// Day of week like JavaScript's getDay(): 0 = Sunday … 6 = Saturday.
public func weekday(_ iso: String) -> Int {
    calendar().component(.weekday, from: fromISO(iso)) - 1
}

/// Month 1–12.
public func monthOf(_ iso: String) -> Int {
    isoParts(iso)?.month ?? calendar().component(.month, from: Date())
}

/// Monday of the week containing iso.
public func weekStart(_ iso: String) -> String {
    let offset = (weekday(iso) + 6) % 7
    return addDays(iso, -offset)
}

/// Next Saturday (or today if it is Saturday) – default date for a party.
public func nextSaturday(_ today: String) -> String {
    let offset = (6 - weekday(today) + 7) % 7
    return addDays(today, offset)
}
