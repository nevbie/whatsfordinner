import type { Dish } from '../data/types'

export type CuisineGroup = 'any' | 'german' | 'european' | 'asian' | 'chinese' | 'indian' | 'world'

export interface Filters {
  diet: 'any' | 'veggie' | 'vegan'
  kids: boolean
  noSpicy: boolean
  maxEffort: 1 | 2 | 3
  favoritesOnly: boolean
  eatOut: boolean
  cuisine: CuisineGroup
}

export const DEFAULT_FILTERS: Filters = {
  diet: 'any',
  kids: false,
  noSpicy: false,
  maxEffort: 3,
  favoritesOnly: false,
  eatOut: false,
  cuisine: 'any',
}

const EUROPEAN = new Set(['german', 'austrian', 'swiss', 'french', 'italian', 'spanish', 'greek', 'eastern'])
const ASIAN = new Set(['chinese', 'indian', 'thai', 'vietnamese', 'japanese', 'korean', 'fusion'])

export function inCuisineGroup(dish: Dish, group: CuisineGroup): boolean {
  switch (group) {
    case 'any':
      return true
    case 'german':
      return dish.cuisine === 'german' || dish.cuisine === 'austrian'
    case 'european':
      return EUROPEAN.has(dish.cuisine)
    case 'asian':
      return ASIAN.has(dish.cuisine)
    case 'chinese':
    case 'indian':
      return dish.cuisine === group
    case 'world':
      return !EUROPEAN.has(dish.cuisine) && dish.cuisine !== 'restaurant'
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
  if (dish.kind === 'combo') return f.cuisine === 'any' || f.cuisine === 'asian' || f.cuisine === 'world' || f.cuisine === dish.combo
  if (!inCuisineGroup(dish, f.cuisine)) return false
  return matchesDiet(dish, f)
}
