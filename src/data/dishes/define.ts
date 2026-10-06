import type { ComboType, Course, Cuisine, Dish, DishKind, Recipe, Staple, Tag } from '../types'

/** Compact dish definition used by the data files. */
export interface Def {
  id: string
  /** original name */
  o: string
  /** language of the original name, default 'de' */
  l?: string
  /** romanisation */
  r?: string
  /** German name/translation – defaults to the original name */
  de?: string
  /** English translation */
  en: string
  c: Cuisine
  k?: DishKind
  co?: Course
  /** space separated tags */
  t?: string
  /** effort, default 2 */
  e?: 1 | 2 | 3
  /** space separated ingredient keys, main ingredient first */
  i: string
  /** note [de, en] */
  n?: [string, string]
  /** space separated staples, overriding the ones derived from the ingredients */
  s?: string
  /** space separated ids of dishes that go well with it */
  p?: string
  combo?: ComboType
  recipe?: Recipe
}

export function d(def: Def): Dish {
  const tags = (def.t ?? '').split(/\s+/).filter(Boolean) as Tag[]
  if (tags.includes('vegan') && !tags.includes('veggie')) tags.push('veggie')
  return {
    id: def.id,
    name: { orig: def.o, lang: def.l ?? 'de', roman: def.r, de: def.de ?? def.o, en: def.en },
    cuisine: def.c,
    kind: def.k ?? 'dish',
    course: def.co,
    tags,
    effort: def.e ?? 2,
    ingredients: def.i.split(/\s+/).filter(Boolean),
    note: def.n ? { de: def.n[0], en: def.n[1] } : undefined,
    staples: def.s !== undefined ? (def.s.split(/\s+/).filter(Boolean) as Staple[]) : undefined,
    pairsWith: def.p ? def.p.split(/\s+/) : undefined,
    combo: def.combo,
    recipe: def.recipe,
  }
}
