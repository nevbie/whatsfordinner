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
  /** variant group: dishes with the same g are variants of each other (e.g. Schupfnudeln mit …) */
  g?: string
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
    group: def.g,
  }
}

/** Compact bilingual recipe: [German, English] pairs. */
export interface RecipeDef {
  serves: [string, string]
  time: [string, string]
  ing: [string[], string[]]
  steps: [string[], string[]]
  tip?: [string, string]
  vegan?: [string, string]
  kids?: [string, string]
  source?: string
  /** handwritten family recipe (shows the 📝 Familienrezept badge) */
  family?: boolean
}

export function rc(r: RecipeDef): Recipe {
  const pair = (x?: [string, string]) => (x ? { de: x[0], en: x[1] } : undefined)
  return {
    serves: { de: r.serves[0], en: r.serves[1] },
    time: { de: r.time[0], en: r.time[1] },
    ingredients: { de: r.ing[0], en: r.ing[1] },
    steps: { de: r.steps[0], en: r.steps[1] },
    tip: pair(r.tip),
    vegan: pair(r.vegan),
    kids: pair(r.kids),
    source: r.source,
    family: r.family,
  }
}

export type BakeCourse = 'bkCake' | 'bkDessert' | 'bkPastry' | 'bkSweets'

/** Backen & Desserts entry (kind 'bake'). Party roles follow from the course (cake / dessert). */
export function bake(course: BakeCourse, def: Omit<Def, 'k' | 'co'>): Dish {
  return d({ ...def, k: 'bake', co: course })
}
