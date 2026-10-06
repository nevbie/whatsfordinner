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
 */
export type DishKind = 'dish' | 'side' | 'combo' | 'eatout'

export type ComboType = 'chinese' | 'indian'

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
}

export const DEFAULT_SETTINGS: FamilySettings = { adults: 2, kids: 2, avoidDays: 10 }

export function emptyState(): FamilyState {
  return { favorites: [], plan: {}, customDishes: {}, settings: { ...DEFAULT_SETTINGS } }
}
