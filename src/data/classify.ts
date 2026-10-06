import type { Course, Cuisine, Dish, Region, Staple } from './types'

const EUROPE = new Set<Cuisine>(['german', 'austrian', 'swiss', 'french', 'italian', 'spanish', 'greek', 'eastern'])
const ASIA = new Set<Cuisine>(['chinese', 'indian', 'thai', 'vietnamese', 'japanese', 'korean', 'fusion'])

export function regionOf(dish: Dish): Region | undefined {
  if (dish.cuisine === 'restaurant') return undefined
  if (EUROPE.has(dish.cuisine)) return 'europe'
  if (ASIA.has(dish.cuisine)) return 'asia'
  return 'other'
}

/** Ingredient → staple. Gnocchi and Schupfnudeln count as both pasta and potatoes. */
const STAPLE_INGREDIENTS: Record<Staple, string[]> = {
  rice: ['rice', 'basmati', 'risotto_rice', 'paella_rice', 'sushi_rice', 'pudding_rice'],
  pasta: ['pasta', 'spaghetti', 'tagliatelle', 'lasagna_sheets', 'tortellini', 'spaetzle', 'maultaschen', 'wheat_noodles', 'glass_noodles', 'rice_noodles', 'gnocchi', 'schupfnudeln'],
  potatoes: ['potatoes', 'sweet_potato', 'potato_salad', 'gnocchi', 'schupfnudeln'],
  bread: ['bread', 'baguette', 'bread_roll', 'flatbread', 'burger_buns', 'tortillas', 'pretzels', 'atta'],
  dough: [],
}

/** Chinese and Indian main dishes are eaten with rice (and roti / naan). */
const EATEN_WITH: Partial<Record<Course, Staple[]>> = {
  meat: ['rice'],
  fish: ['rice'],
  tofu: ['rice'],
  egg: ['rice'],
  veg: ['rice'],
  curry: ['rice', 'bread'],
  dal: ['rice', 'bread'],
  sabzi: ['rice', 'bread'],
}

export const STAPLES: Staple[] = ['bread', 'pasta', 'rice', 'potatoes', 'dough']

export function staplesOf(dish: Dish): Staple[] {
  if (dish.staples) return dish.staples
  if (dish.kind === 'combo') return dish.combo === 'indian' ? ['rice', 'bread'] : ['rice']
  const found = new Set<Staple>()
  for (const s of STAPLES) if (STAPLE_INGREDIENTS[s].some((i) => dish.ingredients.includes(i))) found.add(s)
  if ((dish.cuisine === 'chinese' || dish.cuisine === 'indian') && dish.course) EATEN_WITH[dish.course]?.forEach((s) => found.add(s))
  return STAPLES.filter((s) => found.has(s))
}
