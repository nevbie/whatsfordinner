import type { Dish, PartyCourse, Recipe } from '../types'
import { abendbrotDishes } from './abendbrot'
import { CAKE_RECIPES, cakeDishes } from './bakeCakes'
import { MORE_BAKE_RECIPES, moreBakeDishes } from './bakeMore'
import { chineseDishes } from './chinese'
import { IMPORT1_RECIPES, import1Dishes } from './import1'
import { KIDS_FAVOURITES } from './kids'
import { familyDishes } from './family'
import { indianDishes } from './indian'
import { moreDishes } from './more'
import { NOTEBOOK_RECIPES, notebookDishes } from './notebook'
import { partyDishes } from './party'
import { restaurants } from './restaurants'
import { chineseExtras, fingerFoodExtras, saladParts, tellerSides } from './sides'
import { tapasDishes } from './tapas'

const all: Dish[] = [
  ...familyDishes,
  ...moreDishes,
  ...notebookDishes,
  ...chineseDishes,
  ...chineseExtras,
  ...indianDishes,
  ...tapasDishes,
  ...abendbrotDishes,
  ...tellerSides,
  ...saladParts,
  ...partyDishes,
  ...fingerFoodExtras,
  ...cakeDishes,
  ...moreBakeDishes,
  ...import1Dishes,
  ...restaurants,
]

/** Recipes from the family's photos for dishes that already existed. */
const RECIPES: Record<string, Recipe> = { ...CAKE_RECIPES, ...MORE_BAKE_RECIPES, ...NOTEBOOK_RECIPES, ...IMPORT1_RECIPES, 'pl-kartoffelgratin': IMPORT1_RECIPES.kartoffelgratin }

/** Teller mains: served with a starchy side and a vegetable; pairs = preferred sides. */
const PLATE_MAINS: Record<string, string> = {
  schnitzel: 'pl-bratkartoffeln pl-erbsen',
  'cordon-bleu': 'pl-bratkartoffeln pl-erbsen pl-karotten-kohlrabi',
  rinderrouladen: 'pl-kartoffelknoedel pl-rotkohl pl-spaetzle',
  fischstaebchen: 'pl-kartoffelbrei pl-erbsen pl-salzkartoffeln',
  'fischstaebchen-selbst': 'pl-kartoffelbrei pl-erbsen pl-salzkartoffeln',
  'haehnchen-bratschlauch': 'pl-reis pl-salzkartoffeln pl-brokkoli',
  'koenigsberger-klopse': 'pl-salzkartoffeln pl-reis pl-karotten-kohlrabi',
  huehnerfrikassee: 'pl-reis pl-erbsen',
  schweinemedaillons: 'pl-spaetzle pl-bohnen pl-bandnudeln',
}

/** Variant groups and other tweaks of existing dishes. */
const PATCHES: Record<string, Partial<Dish>> = {
  lasagne: { group: 'lasagne' },
  quiche: { group: 'quiche' },
  gemuesequiche: { group: 'quiche' },
  'thai-curry': { group: 'thai-curry' },
  'spaghetti-bolognese': { group: 'nudeln' },
  carbonara: { group: 'nudeln' },
  'pasta-pesto': { group: 'nudeln' },
  'spaghetti-salmone': { group: 'nudeln' },
  jiaozi: { group: 'jiaozi' },
  pfannkuchen: { group: 'pfannkuchen' },
  pancakes: { group: 'pfannkuchen' },
  'vitello-tonnato': { party: ['starter', 'main'] as PartyCourse[] },
}

// The Kinderliebling tag on dinners comes only from the reviewed list in kids.ts.
export const builtinDishes: Dish[] = all.map((dish) => {
  let d: Dish = { ...dish, ...PATCHES[dish.id] }
  if (RECIPES[d.id]) d.recipe = RECIPES[d.id]
  if (PLATE_MAINS[d.id]) d = { ...d, course: 'plMain', pairsWith: [...(d.pairsWith ?? []), ...PLATE_MAINS[d.id].split(' ')] }
  if (d.kind !== 'dish') return d
  const tags = d.tags.filter((t) => t !== 'kids')
  return { ...d, tags: KIDS_FAVOURITES.has(d.id) ? [...tags, 'kids'] : tags }
})
