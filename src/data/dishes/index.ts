import type { Dish } from '../types'
import { abendbrotDishes } from './abendbrot'
import { chineseDishes } from './chinese'
import { KIDS_FAVOURITES } from './kids'
import { familyDishes } from './family'
import { indianDishes } from './indian'
import { moreDishes } from './more'
import { partyDishes } from './party'
import { restaurants } from './restaurants'
import { tapasDishes } from './tapas'

const all: Dish[] = [...familyDishes, ...moreDishes, ...chineseDishes, ...indianDishes, ...tapasDishes, ...abendbrotDishes, ...partyDishes, ...restaurants]

// The Kinderliebling tag on dinners comes only from the reviewed list in kids.ts.
export const builtinDishes: Dish[] = all.map((d) => {
  if (d.kind !== 'dish') return d
  const tags = d.tags.filter((t) => t !== 'kids')
  return { ...d, tags: KIDS_FAVOURITES.has(d.id) ? [...tags, 'kids'] : tags }
})
