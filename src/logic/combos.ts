import type { ComboType, Course, Dish } from '../data/types'
import { matchesDiet } from './filters'
import type { Rng } from './suggest'

/**
 * Meal builder for Chinese and Indian dinners.
 *
 * Chinese home cooking (家常菜): roughly one dish per person – a meat/fish dish, a vegetable
 * dish, then soup or cold dish, more vegetables, a second main … plus rice.
 * Indian thali: dal + curry + sabzi (vegetables) + raita/chutney/salad + bread and rice,
 * optionally a drink and a dessert.
 */

export interface ComboSlot {
  key: string
  roles: Course[]
}

export interface ComboEntry {
  slot: ComboSlot
  dishId?: string
  locked: boolean
}

export interface ComboOptions {
  type: ComboType
  adults: number
  kids: number
  diet: 'any' | 'veggie' | 'vegan'
  noSpicy: boolean
  drink: boolean
  dessert: boolean
  /** soft filters: preferred when something fits, ignored for a slot otherwise */
  kidsFav?: boolean
  quick?: boolean
  favs?: boolean
}

const PROTEIN: Course[] = ['meat', 'fish', 'tofu']

/** Number of dishes (without rice) for a Chinese meal. */
export function chineseDishCount(adults: number, kids: number): number {
  return Math.max(2, Math.min(6, Math.round(adults + kids * 0.5)))
}

/** Number of tapas for a tapas evening (4–7). */
export function tapasCount(adults: number, kids: number): number {
  return Math.max(4, Math.min(7, Math.round(adults + kids * 0.5) + 2))
}

const TAPA_COURSES = new Set<Course>(['tapaVeg', 'tapaMeat', 'tapaFish', 'tapaBread'])
const ABENDBROT_COURSES = new Set<Course>(['abBread', 'abCheese', 'abMeat', 'abFish', 'abSpread', 'abVeg', 'abExtra'])
const TELLER_COURSES = new Set<Course>(['plMain', 'plStarch', 'plVeg'])
const SALAD_COURSES = new Set<Course>(['slBase', 'slExtra', 'slTopping', 'slDressing'])

/** Which builder a dish belongs to (its cuisine, or tapas for Spanish tapas). */
export function comboTypeOfDish(d: Dish): ComboType | undefined {
  if (d.course && TAPA_COURSES.has(d.course)) return 'tapas'
  if (d.course && ABENDBROT_COURSES.has(d.course)) return 'abendbrot'
  if (d.course && TELLER_COURSES.has(d.course)) return 'teller'
  if (d.course && SALAD_COURSES.has(d.course)) return 'salad'
  if (d.cuisine === 'chinese' || d.cuisine === 'indian') return d.cuisine
  return undefined
}

export function comboSlots(o: ComboOptions, seed?: Dish): ComboSlot[] {
  if (seed?.course === 'meal') {
    return o.type === 'chinese'
      ? [{ key: 'meal', roles: ['meal'] }, { key: 'side', roles: ['cold', 'soup'] }]
      : [{ key: 'meal', roles: ['meal'] }, { key: 'raita', roles: ['raita'] }, { key: 'side', roles: ['chutney', 'salad', 'side'] }]
  }
  if (o.type === 'teller') {
    // German plate: the main, a starchy side (potatoes, dumplings, pasta, rice) and a vegetable
    return [
      { key: 'plMain', roles: ['plMain'] },
      { key: 'plStarch', roles: ['plStarch'] },
      { key: 'plVeg', roles: ['plVeg'] },
    ]
  }
  if (o.type === 'salad') {
    return [
      { key: 'slBase', roles: ['slBase'] },
      { key: 'slExtra', roles: ['slExtra'] },
      { key: 'slExtra2', roles: ['slExtra'] },
      { key: 'slTopping', roles: ['slTopping'] },
      { key: 'slDressing', roles: ['slDressing'] },
    ]
  }
  if (o.type === 'abendbrot') {
    // German cold supper: bread, cheese, cold cuts or fish, a spread, raw vegetables, an extra
    const veg = o.diet !== 'any'
    const slots: ComboSlot[] = [
      { key: 'abBread', roles: ['abBread'] },
      { key: 'abCheese', roles: ['abCheese'] },
      veg ? { key: 'abSpread2', roles: ['abSpread', 'abCheese'] } : { key: 'abMeat', roles: ['abMeat', 'abFish'] },
      { key: 'abSpread', roles: ['abSpread'] },
      { key: 'abVeg', roles: ['abVeg'] },
      { key: 'abExtra', roles: ['abExtra'] },
    ]
    // bigger family: a second bread and a second cheese/cold cut
    if (o.adults + o.kids >= 5) slots.splice(1, 0, { key: 'abBread2', roles: ['abBread'] })
    if (o.adults + o.kids >= 6) slots.push({ key: 'abMore', roles: veg ? ['abCheese', 'abSpread'] : ['abMeat', 'abFish', 'abCheese'] })
    return slots
  }
  if (o.type === 'tapas') {
    // a tapas evening: something with potatoes/eggs or vegetables, meat, fish, bread/olives …
    const slots: ComboSlot[] = [
      { key: 'tapaVeg', roles: ['tapaVeg'] },
      { key: 'tapaMeat', roles: ['tapaMeat'] },
      { key: 'tapaFish', roles: ['tapaFish'] },
      { key: 'tapaBread', roles: ['tapaBread'] },
    ]
    const more: ComboSlot[] = [
      { key: 'tapaVeg2', roles: ['tapaVeg'] },
      { key: 'tapaMeat2', roles: ['tapaMeat'] },
      { key: 'tapaFish2', roles: ['tapaFish', 'tapaVeg'] },
    ]
    const n = tapasCount(o.adults, o.kids)
    for (const m of more) if (slots.length < n) slots.push(m)
    return slots
  }
  if (o.type === 'chinese') {
    const slots: ComboSlot[] = [
      { key: 'main', roles: PROTEIN },
      { key: 'veg', roles: ['veg', 'egg'] },
    ]
    const more: ComboSlot[] = [
      { key: 'soup', roles: ['soup', 'cold'] },
      { key: 'veg2', roles: ['veg', 'egg', 'tofu'] },
      { key: 'main2', roles: PROTEIN },
      { key: 'cold', roles: ['cold', 'soup'] },
    ]
    const n = chineseDishCount(o.adults, o.kids)
    for (const s of more) if (slots.length < n) slots.push(s)
    slots.push({ key: 'staple', roles: ['staple'] })
    return slots
  }
  const slots: ComboSlot[] = [
    { key: 'dal', roles: ['dal'] },
    { key: 'curry', roles: ['curry'] },
    { key: 'sabzi', roles: ['sabzi'] },
  ]
  if (o.adults + o.kids >= 6) slots.push({ key: 'curry2', roles: ['curry'] })
  slots.push(
    { key: 'raita', roles: o.kids > 0 ? ['raita'] : ['raita', 'chutney', 'salad'] },
    { key: 'side', roles: ['chutney', 'salad', 'side'] },
    { key: 'bread', roles: ['bread'] },
    { key: 'rice', roles: ['rice'] },
  )
  if (o.drink) slots.push({ key: 'drink', roles: ['drink'] })
  if (o.dessert) slots.push({ key: 'dessert', roles: ['dessert'] })
  return slots
}

/** Slot that a seed dish (e.g. the suggested 宫保鸡丁) belongs in. */
function slotForSeed(slots: ComboSlot[], seed: Dish): number {
  return slots.findIndex((s) => seed.course !== undefined && s.roles.includes(seed.course))
}

export function initialEntries(o: ComboOptions, seed?: Dish): ComboEntry[] {
  const slots = comboSlots(o, seed)
  const entries: ComboEntry[] = slots.map((slot) => ({ slot, locked: false }))
  if (seed) {
    const i = slotForSeed(slots, seed)
    if (i >= 0) entries[i] = { slot: slots[i], dishId: seed.id, locked: true }
  }
  return entries
}

/** Dishes counted as staples don't take part in the "same main ingredient" rule. */
const STAPLE_ROLES = new Set<Course>(['staple', 'bread', 'rice', 'drink'])

function mainIngredient(d: Dish): string | undefined {
  return d.course && STAPLE_ROLES.has(d.course) ? undefined : d.ingredients[0]
}

/** Preferred defaults: plain rice / roti appear most often. */
const DEFAULT_BOOST: Record<string, number> = { mifan: 5, basmati: 3, roti: 3, raita: 2 }

export interface PickContext {
  options: ComboOptions
  favorites: ReadonlySet<string>
  /** dishes to prefer (e.g. the seed's pairsWith) */
  prefer?: ReadonlySet<string>
}

function weighted(cands: Dish[], ctx: PickContext, rng: Rng): Dish | undefined {
  if (!cands.length) return undefined
  const ws = cands.map((d) => {
    let w = DEFAULT_BOOST[d.id] ?? 1
    if (ctx.favorites.has(d.id)) w *= 2
    // a plate follows the classic pairings (Schnitzel → Bratkartoffeln) much more strictly
    if (ctx.prefer?.has(d.id)) w *= ctx.options.type === 'teller' ? 25 : 5
    if (d.effort === 3) w *= 0.4
    return w
  })
  let r = rng() * ws.reduce((a, b) => a + b, 0)
  for (let i = 0; i < cands.length; i++) {
    r -= ws[i]
    if (r < 0) return cands[i]
  }
  return cands[cands.length - 1]
}

/** Candidate dishes for a slot, before the "fits with the others" rules. */
export function slotCandidates(slot: ComboSlot, pool: Dish[], o: ComboOptions): Dish[] {
  return pool.filter(
    (d) =>
      comboTypeOfDish(d) === o.type &&
      d.course !== undefined &&
      slot.roles.includes(d.course) &&
      matchesDiet(d, { diet: o.diet, kids: false, noSpicy: o.noSpicy, maxEffort: 3 }),
  )
}

export function pickForSlot(slot: ComboSlot, chosen: Dish[], pool: Dish[], ctx: PickContext, rng: Rng): Dish | undefined {
  const o = ctx.options
  const taken = new Set(chosen.map((d) => d.id))
  const groups = new Set(chosen.map((d) => d.group).filter(Boolean))
  const mains = new Set(chosen.map(mainIngredient).filter(Boolean))
  const spicyCount = chosen.filter((d) => d.tags.includes('spicy')).length
  const base = slotCandidates(slot, pool, o).filter((d) => !taken.has(d.id) && !(d.group && groups.has(d.group)))

  const distinctMain = (d: Dish) => {
    const m = mainIngredient(d)
    return !m || !mains.has(m)
  }
  // With kids at the table, at most one spicy dish.
  const spiceOk = (d: Dish) => o.kids === 0 || !d.tags.includes('spicy') || spicyCount === 0

  // soft filters (Kinderliebling, schnell, Favoriten): use them when the slot has a match
  const soft = (d: Dish) => (!o.kidsFav || d.tags.includes('kids')) && (!o.quick || d.effort === 1) && (!o.favs || ctx.favorites.has(d.id))
  const preferred = base.filter(soft)
  return (
    weighted(preferred.filter((d) => distinctMain(d) && spiceOk(d)), ctx, rng) ??
    weighted(preferred.filter(spiceOk), ctx, rng) ??
    weighted(base.filter((d) => distinctMain(d) && spiceOk(d)), ctx, rng) ??
    weighted(base.filter(spiceOk), ctx, rng) ??
    weighted(base, ctx, rng)
  )
}

/** Fill every unlocked entry (in order) with a fitting dish. */
export function fillEntries(entries: ComboEntry[], pool: Dish[], ctx: PickContext, rng: Rng = Math.random): ComboEntry[] {
  const byId = new Map(pool.map((d) => [d.id, d]))
  const result = entries.map((e) => (e.locked ? e : { ...e, dishId: undefined }))
  for (let i = 0; i < result.length; i++) {
    if (result[i].locked && result[i].dishId) continue
    const chosen = result.map((e) => (e.dishId ? byId.get(e.dishId) : undefined)).filter((d): d is Dish => !!d)
    result[i] = { ...result[i], dishId: pickForSlot(result[i].slot, chosen, pool, ctx, rng)?.id }
  }
  return result
}

/** Re-pick one entry, keeping all others. */
export function rerollEntry(entries: ComboEntry[], index: number, pool: Dish[], ctx: PickContext, rng: Rng = Math.random): ComboEntry[] {
  const byId = new Map(pool.map((d) => [d.id, d]))
  const current = entries[index].dishId
  const others = entries
    .filter((_, i) => i !== index)
    .map((e) => (e.dishId ? byId.get(e.dishId) : undefined))
    .filter((d): d is Dish => !!d)
  // exclude the current dish so the reroll actually changes something (if there is an alternative)
  const withoutCurrent = pool.filter((d) => d.id !== current)
  const next = pickForSlot(entries[index].slot, others, withoutCurrent, ctx, rng)?.id ?? current
  return entries.map((e, i) => (i === index ? { ...e, dishId: next, locked: false } : e))
}
