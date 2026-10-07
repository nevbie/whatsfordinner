import { regionOf, staplesOf } from '../data/classify'
import type { Dish, Region, Staple } from '../data/types'

/** Finer cuisine choice on top of the region chips (several can be picked). */
export type CuisineGroup = 'german' | 'italian' | 'french' | 'spanish' | 'oriental' | 'american' | 'chinese' | 'indian' | 'eastasia'
export const CUISINE_GROUPS: CuisineGroup[] = ['german', 'italian', 'french', 'spanish', 'oriental', 'american', 'chinese', 'indian', 'eastasia']

const GROUP_CUISINES: Record<CuisineGroup, string[]> = {
  german: ['german', 'austrian', 'swiss'],
  italian: ['italian'],
  french: ['french'],
  spanish: ['spanish'],
  oriental: ['greek', 'turkish', 'mideast', 'persian', 'northafrican', 'georgian', 'eastern'],
  american: ['american', 'mexican'],
  chinese: ['chinese'],
  indian: ['indian'],
  eastasia: ['thai', 'vietnamese', 'japanese', 'korean', 'fusion'],
}

export interface Filters {
  diet: 'any' | 'veggie' | 'vegan'
  kids: boolean
  noSpicy: boolean
  maxEffort: 1 | 2 | 3
  favoritesOnly: boolean
  /** favourites of these labels (people / groups); empty = no restriction */
  favLabels: string[]
  /** only sweet dishes (Grießbrei, Arme Ritter, Kaiserschmarrn …) */
  sweetOnly: boolean
  eatOut: boolean
  /** empty = all cuisines; otherwise the dish belongs to one of them */
  cuisines: CuisineGroup[]
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
  favLabels: [],
  sweetOnly: false,
  eatOut: false,
  cuisines: [],
  regions: [],
  staples: [],
}

/** Merge stored filters (possibly from an older app version) with the defaults. */
export function normalizeFilters(raw: (Partial<Filters> & { cuisine?: string }) | null | undefined): Filters {
  const { cuisine, ...rest } = raw ?? {}
  const f: Filters = { ...DEFAULT_FILTERS, ...rest }
  // older versions stored a single cuisine
  if (!Array.isArray(f.cuisines)) f.cuisines = []
  if (cuisine && CUISINE_GROUPS.includes(cuisine as CuisineGroup) && !f.cuisines.length) f.cuisines = [cuisine as CuisineGroup]
  f.cuisines = f.cuisines.filter((c) => CUISINE_GROUPS.includes(c))
  if (!Array.isArray(f.regions)) f.regions = []
  if (!Array.isArray(f.staples)) f.staples = []
  if (!Array.isArray(f.favLabels)) f.favLabels = []
  return f
}

export function inCuisineGroups(dish: Dish, groups: CuisineGroup[]): boolean {
  return !groups.length || groups.some((g) => GROUP_CUISINES[g].includes(dish.cuisine))
}

/** Diet / kids / spice / effort checks shared by suggestions, the dish list and the meal builder. */
export function matchesDiet(dish: Dish, f: Pick<Filters, 'diet' | 'kids' | 'noSpicy' | 'maxEffort'> & { sweetOnly?: boolean }): boolean {
  if (dish.kind === 'eatout' || dish.kind === 'combo') return true
  if (f.diet === 'veggie' && !dish.tags.includes('veggie')) return false
  if (f.diet === 'vegan' && !dish.tags.includes('vegan')) return false
  if (f.kids && !dish.tags.includes('kids')) return false
  if (f.noSpicy && dish.tags.includes('spicy')) return false
  if (f.sweetOnly && !dish.tags.includes('sweet')) return false
  if (dish.effort > f.maxEffort) return false
  return true
}

/** Is the dish a favourite of at least one of the given labels? */
export function isLabelFavorite(dishId: string, labelIds: string[], labelFavorites: Record<string, string[]>): boolean {
  return labelIds.some((l) => labelFavorites[l]?.includes(dishId))
}

export function matchesFilters(dish: Dish, f: Filters, favorites: ReadonlySet<string>, labelFavorites: Record<string, string[]> = {}): boolean {
  const favLabelsOk = !f.favLabels.length || isLabelFavorite(dish.id, f.favLabels, labelFavorites)
  if (dish.kind === 'eatout') return f.eatOut && (!f.favoritesOnly || favorites.has(dish.id)) && favLabelsOk
  if (f.favoritesOnly && !favorites.has(dish.id)) return false
  if (!favLabelsOk) return false
  if (f.sweetOnly && dish.kind === 'combo') return false
  if (f.regions.length) {
    const region = regionOf(dish)
    if (!region || !f.regions.includes(region)) return false
  }
  if (f.staples.length && !staplesOf(dish).some((s) => f.staples.includes(s))) return false
  if (!inCuisineGroups(dish, f.cuisines)) return false
  return matchesDiet(dish, f)
}

/** Number of filters that differ from the defaults (shown as a badge on the filter button). */
export function activeFilterCount(f: Filters): number {
  return (
    Number(f.diet !== 'any') +
    f.regions.length +
    f.staples.length +
    f.cuisines.length +
    Number(f.kids) +
    Number(f.noSpicy) +
    Number(f.maxEffort < 3) +
    Number(f.favoritesOnly) +
    Number(f.sweetOnly) +
    f.favLabels.length +
    Number(f.eatOut)
  )
}
