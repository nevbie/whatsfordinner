export type Lang = 'de' | 'en'

/** Text available in both UI languages. */
export interface I18nText {
  de: string
  en: string
}

export type Cuisine =
  | 'german'
  | 'austrian'
  | 'swiss'
  | 'french'
  | 'italian'
  | 'spanish'
  | 'greek'
  | 'turkish'
  | 'mideast'
  | 'persian'
  | 'northafrican'
  | 'eastern'
  | 'american'
  | 'mexican'
  | 'chinese'
  | 'indian'
  | 'thai'
  | 'vietnamese'
  | 'japanese'
  | 'korean'
  | 'fusion'
  | 'restaurant'

export type Tag =
  | 'meat'
  | 'fish'
  | 'veggie'
  | 'vegan'
  | 'kids'
  | 'spicy'
  | 'oven'
  | 'sweet'
  | 'social'
  | 'winter'
  | 'summer'

/**
 * Role of a dish inside a Chinese or Indian multi-dish meal.
 * Chinese: meat, fish, tofu, egg, veg, cold, soup, staple, meal (one-dish meal)
 * Indian:  curry, dal, sabzi, raita, chutney, salad, side, bread, rice, drink, dessert, snack, meal
 */
export type Course =
  | 'meat'
  | 'fish'
  | 'tofu'
  | 'egg'
  | 'veg'
  | 'cold'
  | 'soup'
  | 'staple'
  | 'curry'
  | 'dal'
  | 'sabzi'
  | 'raita'
  | 'chutney'
  | 'salad'
  | 'side'
  | 'bread'
  | 'rice'
  | 'drink'
  | 'dessert'
  | 'snack'
  | 'meal'

/**
 * dish   – a dinner on its own (may also be part of a combo when it has a course)
 * side   – only part of a combo (rice, raita, cold dishes …)
 * combo  – placeholder like "Chinesisch (diverse)" that opens the meal builder
 * eatout – restaurant / takeaway
 * party  – starters, finger food, dips, desserts, cakes, drinks for hosting guests
 */
export type DishKind = 'dish' | 'side' | 'combo' | 'eatout' | 'party'

export type ComboType = 'chinese' | 'indian'

/** Main filling component of a meal. 'dough' = pizza, tarts, dumplings, pancakes … */
export type Staple = 'bread' | 'pasta' | 'rice' | 'potatoes' | 'dough'

export type Region = 'europe' | 'asia' | 'other'

/** Role of a dish when hosting guests. */
export type PartyCourse = 'starter' | 'salad' | 'main' | 'side' | 'snack' | 'dip' | 'dessert' | 'cake' | 'drink'

export interface DishName {
  /** Name in the original language/script, e.g. 麻婆豆腐 or पालक पनीर. */
  orig: string
  /** BCP-47-ish language code of `orig` (de, it, zh, hi, ta …). */
  lang: string
  /** Romanisation for non-Latin scripts (pinyin with tones, Hindi transliteration …). */
  roman?: string
  de: string
  en: string
}

export interface Recipe {
  serves: I18nText
  time: I18nText
  ingredients: { de: string[]; en: string[] }
  steps: { de: string[]; en: string[] }
  vegan?: I18nText
  tip?: I18nText
  kids?: I18nText
  source?: string
}

export interface Dish {
  id: string
  name: DishName
  cuisine: Cuisine
  kind: DishKind
  course?: Course
  tags: Tag[]
  /** 1 = quick (≤ 30 min), 2 = normal, 3 = elaborate / weekend */
  effort: 1 | 2 | 3
  /**
   * Ingredient keys (see ingredients.ts). The first entry is the "main" ingredient, used
   * to avoid two dishes built on the same thing in one combo. Free text is allowed for
   * custom dishes and is shown as-is.
   */
  ingredients: string[]
  /** Short description / background. */
  note?: I18nText
  /** Dish ids that go well with this one. */
  pairsWith?: string[]
  /** Main staple(s); derived from the ingredients when not given (see classify.ts). */
  staples?: Staple[]
  /** Roles when hosting guests; derived when not given (see party.ts). */
  party?: PartyCourse[]
  /** For kind === 'combo'. */
  combo?: ComboType
  recipe?: Recipe
  /** true for dishes the family added themselves. */
  custom?: boolean
}

/** One planned / eaten dinner. */
export interface DayEntry {
  dishes: string[]
  note?: string
  /** dinner of that day is over – the app moves on to planning the next day */
  done?: boolean
}

export type PartyFormat = 'menu' | 'buffet' | 'finger' | 'interactive'
export type TodoPhase = 'week' | 'daybefore' | 'morning' | 'before'

export interface PartyGuest {
  id: string
  name: string
  /** e.g. "vegetarisch", "Nussallergie" */
  note?: string
}

export interface PartyItem {
  id: string
  course: PartyCourse
  /** a dish from the list … */
  dishId?: string
  /** … or free text ("Chips", "Wein") */
  text?: string
  /** set when chosen by hand – kept when the menu is re-suggested */
  locked?: boolean
  /** guest id; empty = we make it ourselves */
  broughtBy?: string
}

export interface PartyTodo {
  id: string
  phase: TodoPhase
  text: string
  done?: boolean
}

export interface Party {
  id: string
  title: string
  date: string
  time?: string
  format: PartyFormat
  adults: number
  kids: number
  veggie: number
  vegan: number
  allergies?: string
  guests: PartyGuest[]
  items: PartyItem[]
  /** ingredient key / free text → ticked off */
  shopping: Record<string, boolean>
  extraShopping: string[]
  todos: PartyTodo[]
  note?: string
}

export interface FamilySettings {
  adults: number
  kids: number
  /** Do not suggest a dish again within this many days. */
  avoidDays: number
}

/** State shared by all phones of a family. */
export interface FamilyState {
  favorites: string[]
  /** key: ISO date YYYY-MM-DD */
  plan: Record<string, DayEntry>
  customDishes: Record<string, Dish>
  settings: FamilySettings
  parties: Record<string, Party>
}

export const DEFAULT_SETTINGS: FamilySettings = { adults: 2, kids: 2, avoidDays: 10 }

export function emptyState(): FamilyState {
  return { favorites: [], plan: {}, customDishes: {}, settings: { ...DEFAULT_SETTINGS }, parties: {} }
}
