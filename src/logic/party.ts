import type { Dish, FamilySettings, Lang, Party, PartyCourse, PartyFormat, PartyItem, PartyTodo, TodoPhase } from '../data/types'
import { season, type Rng } from './suggest'

export const PARTY_COURSES: PartyCourse[] = ['starter', 'salad', 'main', 'side', 'snack', 'dip', 'dessert', 'cake', 'drink']
export const PARTY_FORMATS: PartyFormat[] = ['menu', 'buffet', 'finger', 'interactive']
export const TODO_PHASES: TodoPhase[] = ['week', 'daybefore', 'morning', 'before']

/** Courses where vegetarian/vegan guests need at least one option. */
const CORE: PartyCourse[] = ['starter', 'salad', 'main', 'snack']

/** Party roles of a dish – explicit for party dishes, derived for the everyday ones. */
export function partyCoursesOf(d: Dish): PartyCourse[] {
  if (d.party) return d.party
  if (d.kind === 'eatout' || d.kind === 'combo') return []
  if (d.kind === 'dish') return d.tags.includes('sweet') ? ['dessert'] : ['main']
  switch (d.course) {
    case 'raita':
    case 'chutney':
      return ['dip']
    case 'salad':
    case 'cold':
      return ['salad']
    case 'snack':
      return ['snack']
    case 'dessert':
      return ['dessert']
    case 'drink':
      return ['drink']
    case 'soup':
      return ['starter']
    case 'bread':
    case 'rice':
    case 'staple':
    case 'side':
      return ['side']
    default:
      return []
  }
}

/** Raclette, fondue, BBQ, hot pot, tacos … – dishes everyone cooks or assembles at the table. */
export function isInteractive(d: Dish): boolean {
  return d.kind === 'dish' && d.tags.includes('social') && !d.tags.includes('sweet')
}

export const guestTotal = (p: Pick<Party, 'adults' | 'kids'>) => p.adults + p.kids

/** How many dishes of each course a format needs for the number of guests. */
export function partyTemplate(format: PartyFormat, total: number): Partial<Record<PartyCourse, number>> {
  const r = (x: number) => Math.round(x)
  switch (format) {
    case 'menu':
      return { starter: 1, main: 1, side: 1, dessert: 1, drink: 1 }
    case 'buffet':
      return { main: Math.max(2, r(total / 6)), salad: Math.max(2, r(total / 8)), side: 1, dip: 1, dessert: Math.max(1, r(total / 10)), cake: total >= 10 ? 1 : 0, drink: 1 }
    case 'finger':
      return { snack: Math.min(10, Math.max(4, r(total / 3))), dip: 2, dessert: 1, cake: 1, drink: 1 }
    case 'interactive':
      return { main: 1, salad: 2, side: 1, dip: 2, dessert: 1, drink: 1 }
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10)

interface SuggestCtx {
  pool: Dish[]
  favorites: ReadonlySet<string>
  today: string
  rng: Rng
}

function weightFor(d: Dish, course: PartyCourse, party: Party, ctx: SuggestCtx): number {
  let w = 1
  if (ctx.favorites.has(d.id)) w *= 2
  if (party.kids > 0 && d.tags.includes('kids')) w *= 1.5
  if (party.kids > 0 && d.tags.includes('spicy')) w *= 0.3
  // prefer real party food over everyday desserts like Grießbrei
  if (course !== 'main') w *= d.kind === 'party' ? 1.5 : 0.4
  if (party.format === 'buffet' && d.effort === 3) w *= 0.5
  if (course === 'main') {
    // buffets want dishes that sit well on a table (bakes, one-pots); quick pan dishes and
    // single Chinese/Indian components belong in the meal builder instead
    if (party.format === 'buffet' && d.tags.includes('oven')) w *= 2.5
    if (d.cuisine === 'chinese' || d.cuisine === 'indian') w *= 0.3
    if (party.format === 'menu' && d.effort === 1) w *= 0.5
  }
  const s = season(party.date || ctx.today)
  if (s === 'summer' && d.tags.includes('winter')) w *= 0.2
  if (s === 'winter' && d.tags.includes('summer')) w *= 0.2
  return w
}
function pickWeighted(cands: Dish[], course: PartyCourse, party: Party, ctx: SuggestCtx): Dish | undefined {
  if (!cands.length) return undefined
  const ws = cands.map((d) => weightFor(d, course, party, ctx))
  let r = ctx.rng() * ws.reduce((a, b) => a + b, 0)
  for (let i = 0; i < cands.length; i++) {
    r -= ws[i]
    if (r < 0) return cands[i]
  }
  return cands[cands.length - 1]
}

/**
 * Suggest a menu for the party. Items the family chose by hand, typed in, or that a guest
 * brings are kept; the rest is (re-)filled according to the format and the guests' diets.
 */
export function suggestPartyItems(party: Party, ctx: SuggestCtx): PartyItem[] {
  const total = guestTotal(party)
  const kept = party.items.filter((i) => i.locked || i.text || i.broughtBy)
  const used = new Set(kept.map((i) => i.dishId).filter(Boolean))
  const byId = new Map(ctx.pool.map((d) => [d.id, d]))
  const tpl = partyTemplate(party.format, total)
  const vegNeed = party.veggie + party.vegan
  const everyoneVeg = total > 0 && vegNeed >= total
  const everyoneVegan = total > 0 && party.vegan >= total
  const out = [...kept]

  for (const course of PARTY_COURSES) {
    let count = tpl[course] ?? 0
    const keptHere = kept.filter((i) => i.course === course).map((i) => (i.dishId ? byId.get(i.dishId) : undefined))
    // a menu with one main gets a vegetarian alternative when some guests need it
    if (party.format === 'menu' && course === 'main' && vegNeed > 0 && !everyoneVeg) count = 2
    count -= keptHere.length
    if (count <= 0) continue

    let cands = ctx.pool.filter((d) => !used.has(d.id) && partyCoursesOf(d).includes(course))
    if (party.format === 'interactive' && course === 'main') cands = cands.filter(isInteractive)
    else if (course === 'main') cands = cands.filter((d) => !isInteractive(d))
    if (everyoneVegan) cands = cands.filter((d) => d.tags.includes('vegan'))
    else if (everyoneVeg) cands = cands.filter((d) => d.tags.includes('veggie'))

    const keptVegan = keptHere.some((d) => d?.tags.includes('vegan'))
    const keptVeggie = keptHere.some((d) => d?.tags.includes('veggie'))
    const needVegan = party.vegan > 0 && CORE.includes(course) && !keptVegan
    const needVeggie = vegNeed > 0 && CORE.includes(course) && !keptVeggie && !needVegan

    for (let n = 0; n < count; n++) {
      const free = cands.filter((d) => !used.has(d.id))
      let pool = free
      if (n === 0 && needVegan) pool = free.filter((d) => d.tags.includes('vegan'))
      else if (n === 0 && needVeggie) pool = free.filter((d) => d.tags.includes('veggie'))
      const dish = pickWeighted(pool.length ? pool : free, course, party, ctx)
      if (!dish) break
      used.add(dish.id)
      out.push({ id: uid(), course, dishId: dish.id })
    }
  }
  return out
}

/** Replace one item's dish by another fitting dish of the same course. */
export function rerollPartyItem(party: Party, itemId: string, ctx: SuggestCtx): PartyItem[] {
  const item = party.items.find((i) => i.id === itemId)
  if (!item) return party.items
  const used = new Set(party.items.map((i) => i.dishId).filter(Boolean))
  const total = guestTotal(party)
  let cands = ctx.pool.filter((d) => !used.has(d.id) && partyCoursesOf(d).includes(item.course))
  if (party.format === 'interactive' && item.course === 'main') cands = cands.filter(isInteractive)
  if (total > 0 && party.vegan >= total) cands = cands.filter((d) => d.tags.includes('vegan'))
  else if (total > 0 && party.veggie + party.vegan >= total) cands = cands.filter((d) => d.tags.includes('veggie'))
  // keep the vegetarian/vegan character of the item it replaces
  const old = item.dishId ? ctx.pool.find((d) => d.id === item.dishId) : undefined
  if (old?.tags.includes('vegan') && party.vegan > 0) cands = cands.filter((d) => d.tags.includes('vegan'))
  else if (old?.tags.includes('veggie') && party.veggie + party.vegan > 0) cands = cands.filter((d) => d.tags.includes('veggie'))
  const next = pickWeighted(cands, item.course, party, ctx)
  return next ? party.items.map((i) => (i.id === itemId ? { ...i, dishId: next.id, text: undefined, locked: false } : i)) : party.items
}

export interface ShoppingEntry {
  key: string
  /** names of the dishes that need it */
  dishIds: string[]
}

/** Combined ingredient list of everything the family makes themselves (not what guests bring). */
export function shoppingList(party: Party, byId: Map<string, Dish>): ShoppingEntry[] {
  const map = new Map<string, string[]>()
  for (const item of party.items) {
    if (item.broughtBy || !item.dishId) continue
    const dish = byId.get(item.dishId)
    for (const ing of dish?.ingredients ?? []) map.set(ing, [...(map.get(ing) ?? []), item.dishId])
  }
  return [...map.entries()].map(([key, dishIds]) => ({ key, dishIds }))
}

const TODO_TEXT: Record<string, [string, string]> = {
  invite: ['Gäste einladen und nach Allergien/Vorlieben fragen', 'Invite guests and ask about allergies/preferences'],
  menu: ['Menü festlegen und verteilen, wer was mitbringt', 'Fix the menu and who brings what'],
  dry: ['Getränke und haltbare Zutaten einkaufen', 'Buy drinks and non-perishables'],
  fresh: ['Frische Zutaten einkaufen', 'Buy fresh ingredients'],
  dessert: ['Nachtisch / Kuchen vorbereiten', 'Prepare dessert / cake'],
  salads: ['Dips und Salatdressings vorbereiten', 'Prepare dips and dressings'],
  chill: ['Getränke kalt stellen, Eiswürfel machen', 'Chill drinks, make ice cubes'],
  dishes: ['Geschirr, Gläser, Besteck und Stühle zählen', 'Count plates, glasses, cutlery and chairs'],
  device: ['Raclette-/Fondue-Gerät bzw. Grill und Brennstoff prüfen', 'Check raclette/fondue set or BBQ and fuel'],
  table: ['Tisch decken', 'Set the table'],
  buffet: ['Buffet aufbauen, Servierlöffel bereitlegen', 'Set up the buffet with serving spoons'],
  labels: ['Gerichte beschriften (vegetarisch, Allergene)', 'Label dishes (vegetarian, allergens)'],
  chop: ['Gemüse schneiden, Platten anrichten', 'Chop vegetables, arrange platters'],
  kids: ['Spielecke / Beschäftigung für Kinder vorbereiten', 'Prepare a play corner for kids'],
  oven: ['Ofen vorheizen, Brot aufbacken', 'Preheat oven, warm up bread'],
  serve: ['Snacks und Getränke hinstellen', 'Put out snacks and drinks'],
  music: ['Musik und Deko', 'Music and decoration'],
}

/** Default checklist for a party, in the current UI language. */
export function defaultTodos(party: Pick<Party, 'format' | 'kids'>, lang: Lang): PartyTodo[] {
  const f = party.format
  const keys: [TodoPhase, string][] = [
    ['week', 'invite'],
    ['week', 'menu'],
    ['week', 'dry'],
    ['daybefore', 'fresh'],
    ['daybefore', 'dessert'],
    ['daybefore', 'salads'],
    ['daybefore', 'chill'],
    ['daybefore', 'dishes'],
    ...(f === 'interactive' ? ([['daybefore', 'device']] as [TodoPhase, string][]) : []),
    ['morning', f === 'buffet' || f === 'finger' ? 'buffet' : 'table'],
    ...(f === 'buffet' || f === 'finger' ? ([['morning', 'labels']] as [TodoPhase, string][]) : []),
    ['morning', 'chop'],
    ...(party.kids > 0 ? ([['morning', 'kids']] as [TodoPhase, string][]) : []),
    ['before', 'oven'],
    ['before', 'serve'],
    ['before', 'music'],
  ]
  return keys.map(([phase, k]) => ({ id: uid(), phase, text: TODO_TEXT[k][lang === 'de' ? 0 : 1] }))
}

export function newParty(date: string, settings: FamilySettings, lang: Lang): Party {
  const base = {
    id: `p-${Date.now().toString(36)}${uid().slice(0, 4)}`,
    title: lang === 'de' ? 'Einladung' : 'Party',
    date,
    format: 'menu' as PartyFormat,
    adults: settings.adults + 4,
    kids: settings.kids,
    veggie: 0,
    vegan: 0,
    guests: [],
    items: [],
    shopping: {},
    extraShopping: [],
  }
  return { ...base, todos: defaultTodos(base, lang) }
}
