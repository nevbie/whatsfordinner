package de.nevbie.whatsfordinner.core

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit

/** ISO dates (YYYY-MM-DD, local time) – port of src/logic/dates.ts. */
object Dates {
    fun fromISO(iso: String): LocalDate = LocalDate.parse(iso)
    fun toISO(d: LocalDate): String = d.toString()
    fun todayISO(): String = LocalDate.now().toString()
    fun addDays(iso: String, days: Int): String = fromISO(iso).plusDays(days.toLong()).toString()

    /** Whole days from a to b (b - a). */
    fun daysBetween(a: String, b: String): Int = ChronoUnit.DAYS.between(fromISO(a), fromISO(b)).toInt()

    /** Monday of the week containing iso. */
    fun weekStart(iso: String): String {
        val d = fromISO(iso)
        val offset = (d.dayOfWeek.value - DayOfWeek.MONDAY.value) // Monday = 0 … Sunday = 6
        return d.minusDays(offset.toLong()).toString()
    }

    /** Next Saturday (or today if it is Saturday) – default date for a party. */
    fun nextSaturday(today: String): String {
        val d = fromISO(today)
        val offset = (DayOfWeek.SATURDAY.value - d.dayOfWeek.value + 7) % 7
        return d.plusDays(offset.toLong()).toString()
    }

    fun isValid(iso: String): Boolean = runCatching { fromISO(iso) }.isSuccess && iso.length == 10
}
