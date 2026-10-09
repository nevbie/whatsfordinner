/**
 * Exports the built-in data for the native Android (Kotlin) and iOS (Swift) apps:
 *   shared/dishes.json  – all built-in dishes (incl. recipes) and the ingredient dictionary
 *   shared/strings.json – UI texts (de/en) and label tables
 * Run with `npm run export:native` after changing dishes, recipes or texts.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { builtinDishes } from '../src/data/dishes'
import { INGREDIENTS } from '../src/data/ingredients'
import { COURSE_LABELS, CUISINE_LABELS, LANG_NAMES, PARTY_COURSE_LABELS, PARTY_FORMAT_LABELS, STRINGS, TAG_LABELS, TODO_PHASE_LABELS } from '../src/i18n'

const out = new URL('../shared/', import.meta.url)
mkdirSync(out, { recursive: true })

// drop undefined fields so the JSON stays small and stable
const clean = <T>(x: T): T => JSON.parse(JSON.stringify(x))

const dishes = { version: 1, dishes: clean(builtinDishes), ingredients: INGREDIENTS }
writeFileSync(new URL('dishes.json', out), JSON.stringify(dishes, null, 1) + '\n')

const strings = {
  version: 1,
  de: STRINGS.de,
  en: STRINGS.en,
  tags: TAG_LABELS,
  cuisines: CUISINE_LABELS,
  courses: COURSE_LABELS,
  partyFormats: PARTY_FORMAT_LABELS,
  partyCourses: PARTY_COURSE_LABELS,
  todoPhases: TODO_PHASE_LABELS,
  langNames: LANG_NAMES,
}
writeFileSync(new URL('strings.json', out), JSON.stringify(strings, null, 1) + '\n')
console.log(`exported ${builtinDishes.length} dishes, ${Object.keys(INGREDIENTS).length} ingredients, ${Object.keys(STRINGS.de).length} strings`)
