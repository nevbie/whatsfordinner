import type { DayEntry, Dish, FamilyState } from '../data/types'
import { addDays, daysBetween, fromISO } from './dates'
import { matchesFilters, type Filters } from './filters'

export type Rng = () => number

/** Most recent date (≤ today) each dish was eaten. */
export function lastEaten(plan: Record<string, DayEntry>, today: string): Map<string, string> {
  const last = new Map<string, string>()
  for (const [date, entry] of Object.entries(plan)) {
    if (date > today) continue
    for (const id of entry.dishes) {
      const prev = last.get(id)
      if (!prev || prev < date) last.set(id, date)
    }
  }
  return last
}

/** Dishes already planned for the coming week (after today). */
export function plannedSoon(plan: Record<string, DayEntry>, today: string, days = 7): Set<string> {
  const until = addDays(today, days)
  const ids = new Set<string>()
  for (const [date, entry] of Object.entries(plan)) {
    if (date > today && date <= until) entry.dishes.forEach((id) => ids.add(id))
  }
  return ids
}

export function season(today: string): 'winter' | 'summer' | 'mid' {
  const m = fromISO(today).getMonth() + 1
  if (m >= 11 || m <= 2) return 'winter'
  if (m >= 5 && m <= 8) return 'summer'
  return 'mid'
}

export interface SuggestContext {
  state: FamilyState
  filters: Filters
  today: string
}

/** Relative chance of a dish being suggested; 0 = never. */
export function weight(dish: Dish, ctx: SuggestContext, last: Map<string, string>, soon: Set<string>): number {
  const favorites = new Set(ctx.state.favorites)
  if (dish.kind === 'side') return 0
  if (!matchesFilters(dish, ctx.filters, favorites)) return 0
  if (soon.has(dish.id)) return 0

  let w = 1
  // Chinese/Indian main dishes are many; keep them from crowding out the rest.
  // The "Chinesisch/Indisch (diverse)" entries stand for a whole meal and get a boost.
  if (dish.kind === 'combo') w = 1.5
  else if (dish.cuisine === 'chinese' || dish.cuisine === 'indian') w = 0.35
  if (favorites.has(dish.id)) w *= 2.5
  if (dish.tags.includes('sweet')) w *= 0.6
  if (dish.kind === 'eatout') w *= 0.8

  const s = season(ctx.today)
  if (s === 'summer' && dish.tags.includes('winter')) w *= 0.25
  if (s === 'winter' && dish.tags.includes('summer')) w *= 0.25

  const eaten = last.get(dish.id)
  if (eaten) {
    const ago = daysBetween(eaten, ctx.today)
    if (ago < ctx.state.settings.avoidDays) return 0
    // the longer ago, the more likely (up to ×2)
    w *= Math.min(2, 1 + (ago - ctx.state.settings.avoidDays) / 30)
  }
  return w
}

/** Weighted random pick of up to n distinct dishes. */
export function suggest(dishes: Dish[], ctx: SuggestContext, n: number, exclude: ReadonlySet<string> = new Set(), rng: Rng = Math.random): Dish[] {
  const last = lastEaten(ctx.state.plan, ctx.today)
  const soon = plannedSoon(ctx.state.plan, ctx.today)
  const pool = dishes
    .filter((d) => !exclude.has(d.id))
    .map((d) => ({ d, w: weight(d, ctx, last, soon) }))
    .filter((x) => x.w > 0)
  const out: Dish[] = []
  while (out.length < n && pool.length) {
    const total = pool.reduce((s, x) => s + x.w, 0)
    let r = rng() * total
    let i = 0
    for (; i < pool.length - 1; i++) {
      r -= pool[i].w
      if (r < 0) break
    }
    out.push(pool[i].d)
    pool.splice(i, 1)
  }
  return out
}
