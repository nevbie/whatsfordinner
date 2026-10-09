package de.nevbie.whatsfordinner.core

import kotlin.math.min

/** Random source in [0, 1). */
typealias Rng = () -> Double

val defaultRng: Rng = { Math.random() }

class SuggestContext(val state: FamilyState, val filters: Filters, val today: String)

/** Port of src/logic/suggest.ts – same weights and rules as the web app. */
object Suggest {
    /** Most recent date (≤ today) each dish was eaten. */
    fun lastEaten(plan: Map<String, DayEntry>, today: String): Map<String, String> {
        val last = HashMap<String, String>()
        for ((date, entry) in plan) {
            if (date > today) continue
            for (id in dayDishIds(entry)) {
                val prev = last[id]
                if (prev == null || prev < date) last[id] = date
            }
        }
        return last
    }

    /** Dishes already planned for the coming week (after today). */
    fun plannedSoon(plan: Map<String, DayEntry>, today: String, days: Int = 7): Set<String> {
        val until = Dates.addDays(today, days)
        val ids = HashSet<String>()
        for ((date, entry) in plan) if (date > today && date <= until) ids.addAll(dayDishIds(entry))
        return ids
    }

    fun season(today: String): String {
        val m = Dates.fromISO(today).monthValue
        if (m >= 11 || m <= 2) return "winter"
        if (m in 5..8) return "summer"
        return "mid"
    }

    /**
     * Fairness between the family's favourite labels: the label whose favourites have waited the
     * longest (or were never cooked) gets a boost.
     */
    fun waitingLabel(state: FamilyState, last: Map<String, String>): String? {
        var best: String? = null
        var bestDate = "9999"
        for (label in state.labels) {
            val favs = state.labelFavorites[label.id] ?: emptyList()
            if (favs.isEmpty()) continue
            var latest = ""
            for (id in favs) {
                val date = last[id] ?: ""
                if (date > latest) latest = date
            }
            if (latest < bestDate) {
                bestDate = latest
                best = label.id
            }
        }
        return best
    }

    /** Relative chance of a dish being suggested; 0 = never. */
    fun weight(dish: Dish, ctx: SuggestContext, last: Map<String, String>, soon: Set<String>, waiting: String? = null): Double {
        val state = ctx.state
        val favorites = state.favorites.toSet()
        if (dish.kind == Kind.SIDE || dish.kind == Kind.PARTY || dish.kind == Kind.BAKE) return 0.0
        if (!FilterLogic.matchesFilters(dish, ctx.filters, favorites, state.labelFavorites, state.labelDislikes)) return 0.0
        if (dish.id in soon) return 0.0

        var w = 1.0
        // Chinese/Indian main dishes are many; keep them from crowding out the rest.
        if (dish.kind == Kind.COMBO) w = 1.5
        else if (dish.cuisine == "chinese" || dish.cuisine == "indian") w = 0.35
        if (dish.id in favorites) w *= 2.5
        val fans = state.labels.filter { state.labelFavorites[it.id]?.contains(dish.id) == true }
        if (fans.isNotEmpty()) w *= 1.8
        if (waiting != null && fans.any { it.id == waiting }) w *= 1.6
        // someone doesn't like it: much rarer (unless that person is marked as away that day)
        val away = (state.plan[ctx.today]?.labels ?: emptyList()).filter { it.startsWith("away:") }.map { it.substring(5) }.toSet()
        for (l in FilterLogic.dislikersOf(dish.id, state.labelDislikes)) if (l !in away) w *= 0.15
        if (dish.has("sweet")) w *= 0.6
        if (dish.kind == Kind.EATOUT) w *= 0.8

        val s = season(ctx.today)
        if (s == "summer" && dish.has("winter")) w *= 0.25
        if (s == "winter" && dish.has("summer")) w *= 0.25

        val eaten = last[dish.id]
        if (eaten != null) {
            val ago = Dates.daysBetween(eaten, ctx.today)
            if (ago < state.settings.avoidDays) return 0.0
            // the longer ago, the more likely (up to ×2)
            w *= min(2.0, 1 + (ago - state.settings.avoidDays) / 30.0)
        }
        return w
    }

    /** Weighted random pick of up to n distinct dishes. */
    fun suggest(dishes: List<Dish>, ctx: SuggestContext, n: Int, exclude: Set<String> = emptySet(), rng: Rng = defaultRng): List<Dish> {
        val last = lastEaten(ctx.state.plan, ctx.today)
        val soon = plannedSoon(ctx.state.plan, ctx.today)
        val waiting = waitingLabel(ctx.state, last)
        val pool = dishes
            .filter { it.id !in exclude }
            .map { it to weight(it, ctx, last, soon, waiting) }
            .filter { it.second > 0 }
            .toMutableList()
        val out = mutableListOf<Dish>()
        while (out.size < n && pool.isNotEmpty()) {
            val total = pool.sumOf { it.second }
            var r = rng() * total
            var i = 0
            while (i < pool.size - 1) {
                r -= pool[i].second
                if (r < 0) break
                i++
            }
            val picked = pool[i].first
            out.add(picked)
            pool.removeAt(i)
            // only one variant of a dish per round
            if (picked.group != null) pool.removeAll { it.first.group == picked.group }
        }
        return out
    }
}
