import { regionOf, staplesOf } from '../data/classify'
import type { Dish, Region, Staple } from '../data/types'

/** Finer cuisine choice on top of the region chips. */
export type CuisineGroup = 'any' | 'german' | 'italian' | 'chinese' | 'indian'
export const CUISINE_GROUPS: CuisineGroup[] = ['any', 'german', 'italian', 'chinese', 'indian']

export interface Filters {
  diet: 'any' | 'veggie' | 'vegan'
  kids: boolean
  noSpicy: boolean
  maxEffort: 1 | 2 | 3
  favoritesOnly: boolean
  eatOut: boolean
  cuisine: CuisineGroup
  /** empty = all regions */
  regions: Region[]
  /** empty = any staple; otherwise the dish needs at least one of them */
  staples: Staple[]
}

export const DEFAULT_FILTERS: Filters = {
  diet: 'any',
  kids: false,
  noSpicy: false,
  maxEffort: 3,
  favoritesOnly: false,
  eatOut: false,
  cuisine: 'any',
  regions: [],
  staples: [],
}

/** Merge stored filters (possibly from an older app version) with the defaults. */
export function normalizeFilters(raw: Partial<Filters> | null | undefined): Filters {
  const f = { ...DEFAULT_FILTERS, ...(raw ?? {}) }
  if (!CUISINE_GROUPS.includes(f.cuisine)) f.cuisine = 'any'
  if (!Array.isArray(f.regions)) f.regions = []
  if (!Array.isArray(f.staples)) f.staples = []
  return f
}

export function inCuisineGroup(dish: Dish, group: CuisineGroup): boolean {
  switch (group) {
    case 'any':
      return true
    case 'german':
      return dish.cuisine === 'german' || dish.cuisine === 'austrian'
    case 'italian':
    case 'chinese':
    case 'indian':
      return dish.cuisine === group
  }
}

/** Diet / kids / spice / effort checks shared by suggestions, the dish list and the meal builder. */
export function matchesDiet(dish: Dish, f: Pick<Filters, 'diet' | 'kids' | 'noSpicy' | 'maxEffort'>): boolean {
  if (dish.kind === 'eatout' || dish.kind === 'combo') return true
  if (f.diet === 'veggie' && !dish.tags.includes('veggie')) return false
  if (f.diet === 'vegan' && !dish.tags.includes('vegan')) return false
  if (f.kids && !dish.tags.includes('kids')) return false
  if (f.noSpicy && dish.tags.includes('spicy')) return false
  if (dish.effort > f.maxEffort) return false
  return true
}

export function matchesFilters(dish: Dish, f: Filters, favorites: ReadonlySet<string>): boolean {
  if (dish.kind === 'eatout') return f.eatOut && (!f.favoritesOnly || favorites.has(dish.id))
  if (f.favoritesOnly && !favorites.has(dish.id)) return false
  if (f.regions.length) {
    const region = regionOf(dish)
    if (!region || !f.regions.includes(region)) return false
  }
  if (f.staples.length && !staplesOf(dish).some((s) => f.staples.includes(s))) return false
  if (!inCuisineGroup(dish, f.cuisine)) return false
  return matchesDiet(dish, f)
}

/** Number of filters that differ from the defaults (shown as a badge on the filter button). */
export function activeFilterCount(f: Filters): number {
  return (
    Number(f.diet !== 'any') +
    f.regions.length +
    f.staples.length +
    Number(f.cuisine !== 'any') +
    Number(f.kids) +
    Number(f.noSpicy) +
    Number(f.maxEffort < 3) +
    Number(f.favoritesOnly) +
    Number(f.eatOut)
  )
}
