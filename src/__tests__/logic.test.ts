import { describe, expect, it } from 'vitest'
import { keepEntry } from '../store/backend'
import { builtinDishes } from '../data/dishes'
import { emptyState, type Dish } from '../data/types'
import { chineseDishCount, defaultCounts, fillEntries, initialEntries, rerollEntry, type ComboOptions } from '../logic/combos'
import { addDays, weekStart } from '../logic/dates'
import { DEFAULT_FILTERS, matchesFilters, normalizeFilters } from '../logic/filters'
import { regionOf, staplesOf } from '../data/classify'
import { lastEaten, suggest, waitingLabel, weight } from '../logic/suggest'
import { defaultTodos, newParty, shoppingList, suggestPartyItems } from '../logic/party'

/** deterministic RNG */
function seeded(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const byId = new Map(builtinDishes.map((d) => [d.id, d]))
const TODAY = '2026-10-06'

describe('dates', () => {
  it('computes the Monday of a week', () => {
    expect(weekStart('2026-10-06')).toBe('2026-10-05')
    expect(weekStart('2026-10-11')).toBe('2026-10-05')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('suggest', () => {
  it('never suggests sides, recently eaten or already planned dishes', () => {
    const state = emptyState()
    state.plan[addDays(TODAY, -3)] = { dishes: ['lasagne'] }
    state.plan[addDays(TODAY, 2)] = { dishes: ['pizza'] }
    for (let seed = 1; seed < 30; seed++) {
      const out = suggest(builtinDishes, { state, filters: DEFAULT_FILTERS, today: TODAY }, 5, new Set(), seeded(seed))
      expect(out).toHaveLength(5)
      for (const d of out) {
        expect(d.kind).not.toBe('side')
        expect(d.kind).not.toBe('eatout')
        expect(['lasagne', 'pizza']).not.toContain(d.id)
      }
    }
  })

  it('respects diet filters', () => {
    const out = suggest(builtinDishes, { state: emptyState(), filters: { ...DEFAULT_FILTERS, diet: 'vegan' }, today: TODAY }, 20, new Set(), seeded(3))
    for (const d of out) if (d.kind === 'dish') expect(d.tags).toContain('vegan')
  })

  it('only suggests restaurants when eating out is switched on', () => {
    const out = suggest(builtinDishes, { state: emptyState(), filters: { ...DEFAULT_FILTERS, eatOut: true }, today: TODAY }, 300, new Set(), seeded(5))
    expect(out.some((d) => d.kind === 'eatout')).toBe(true)
  })
})

const opts = (o: Partial<ComboOptions>): ComboOptions => ({ type: 'chinese', adults: 2, kids: 2, diet: 'any', noSpicy: false, drink: false, dessert: false, ...o })
const ctx = (o: ComboOptions) => ({ options: o, favorites: new Set<string>() })
const dishesOf = (entries: { dishId?: string }[]) => entries.map((e) => byId.get(e.dishId!)!) as Dish[]

describe('combos', () => {
  it('scales Chinese meals with the family size', () => {
    expect(chineseDishCount(2, 2)).toBe(3)
    expect(chineseDishCount(3, 2)).toBe(4)
    expect(chineseDishCount(1, 0)).toBe(2)
  })

  it('builds a complete Chinese meal with rice, distinct main ingredients and ≤ 1 spicy dish for kids', () => {
    for (let seed = 1; seed < 50; seed++) {
      const o = opts({ adults: 3, kids: 2 })
      const filled = fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(seed))
      const ds = dishesOf(filled)
      expect(ds.every(Boolean)).toBe(true)
      expect(ds).toHaveLength(5)
      expect(ds.at(-1)!.course).toBe('staple')
      expect(ds.filter((d) => d.tags.includes('spicy')).length).toBeLessThanOrEqual(1)
      const mains = ds.filter((d) => d.course !== 'staple').map((d) => d.ingredients[0])
      expect(new Set(mains).size).toBe(mains.length)
    }
  })

  it('builds a vegetarian thali', () => {
    for (let seed = 1; seed < 30; seed++) {
      const o = opts({ type: 'indian', diet: 'veggie', drink: true })
      const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(seed)))
      expect(ds.map((d) => d.course)).toEqual(['dal', 'curry', 'sabzi', 'raita', expect.any(String), 'bread', 'rice', 'drink'])
      for (const d of ds) expect(d.tags).toContain('veggie')
    }
  })

  it('keeps a seed dish locked and rerolls change one entry only', () => {
    const o = opts({})
    const seed = byId.get('gongbao-jiding')!
    const filled = fillEntries(initialEntries(o, seed), builtinDishes, ctx(o), seeded(7))
    expect(filled[0].dishId).toBe('gongbao-jiding')
    const rerolled = rerollEntry(filled, 1, builtinDishes, ctx(o), seeded(8))
    expect(rerolled[0].dishId).toBe('gongbao-jiding')
    expect(rerolled[1].dishId).not.toBe(filled[1].dishId)
    expect(rerolled[2].dishId).toBe(filled[2].dishId)
  })

  it('pairs one-dish meals like jiaozi with a side', () => {
    const o = opts({})
    const filled = fillEntries(initialEntries(o, byId.get('jiaozi')), builtinDishes, ctx(o), seeded(2))
    expect(filled.map((e) => e.dishId)[0]).toBe('jiaozi')
    expect(filled).toHaveLength(2)
  })
})

describe('region and staple filters', () => {
  const favs = new Set<string>()
  const f = (o: Partial<typeof DEFAULT_FILTERS>) => ({ ...DEFAULT_FILTERS, ...o })

  it('classifies staples from ingredients, overrides and eating habits', () => {
    expect(staplesOf(byId.get('spaghetti-bolognese')!)).toEqual(['pasta'])
    expect(staplesOf(byId.get('pizza')!)).toEqual(['dough'])
    expect(staplesOf(byId.get('jiaozi')!)).toEqual(['dough'])
    expect(staplesOf(byId.get('raclette')!)).toEqual(['potatoes'])
    // curries and Chinese mains are eaten with rice (and roti)
    expect(staplesOf(byId.get('palak-paneer')!)).toEqual(['bread', 'rice'])
    expect(staplesOf(byId.get('mapo-doufu')!)).toEqual(['rice'])
  })

  it('filters by region', () => {
    expect(matchesFilters(byId.get('lasagne')!, f({ regions: ['europe'] }), favs)).toBe(true)
    expect(matchesFilters(byId.get('lasagne')!, f({ regions: ['asia'] }), favs)).toBe(false)
    expect(matchesFilters(byId.get('chinesisch')!, f({ regions: ['asia'] }), favs)).toBe(true)
    expect(matchesFilters(byId.get('falafel')!, f({ regions: ['europe', 'other'] }), favs)).toBe(true)
  })

  it('filters by staple (any of the chosen)', () => {
    expect(matchesFilters(byId.get('lasagne')!, f({ staples: ['rice', 'pasta'] }), favs)).toBe(true)
    expect(matchesFilters(byId.get('lasagne')!, f({ staples: ['potatoes'] }), favs)).toBe(false)
    const out = suggest(builtinDishes, { state: emptyState(), filters: f({ staples: ['potatoes'], regions: ['europe'] }), today: TODAY }, 30, new Set(), seeded(4))
    expect(out.length).toBeGreaterThan(10)
    for (const d of out) {
      expect(staplesOf(d)).toContain('potatoes')
      expect(regionOf(d)).toBe('europe')
    }
  })

  it('ignores outdated stored filter values', () => {
    expect(normalizeFilters({ cuisine: 'european' } as never).cuisines).toEqual([])
    expect(normalizeFilters({ cuisine: 'italian' } as never).cuisines).toEqual(['italian'])
    expect(normalizeFilters({}).staples).toEqual([])
  })
})

describe('party planner', () => {
  const base = () => {
    const p = newParty('2026-12-12', emptyState().settings, 'de')
    return p
  }
  const ctx = (seed: number) => ({ pool: builtinDishes, favorites: new Set<string>(), today: TODAY, rng: seeded(seed) })
  const dishesOf = (items: { dishId?: string }[]) => items.map((i) => byId.get(i.dishId!)!)

  it('suggests a full menu with a vegetarian alternative', () => {
    for (let s = 1; s < 20; s++) {
      const p = { ...base(), veggie: 2 }
      const items = suggestPartyItems(p, ctx(s))
      const courses = items.map((i) => i.course)
      expect(courses.filter((c) => c === 'main')).toHaveLength(2)
      for (const c of ['starter', 'side', 'dessert', 'drink']) expect(courses).toContain(c)
      expect(dishesOf(items.filter((i) => i.course === 'main')).some((d) => d.tags.includes('veggie'))).toBe(true)
      expect(new Set(items.map((i) => i.dishId)).size).toBe(items.length)
    }
  })

  it('makes everything vegan when all guests are vegan', () => {
    const p = { ...base(), format: 'buffet' as const, adults: 6, kids: 0, vegan: 6 }
    for (const d of dishesOf(suggestPartyItems(p, ctx(3)))) expect(d.tags, d.id).toContain('vegan')
  })

  it('uses interactive mains (raclette, fondue, BBQ …) for the interactive format', () => {
    const p = { ...base(), format: 'interactive' as const }
    const main = suggestPartyItems(p, ctx(5)).find((i) => i.course === 'main')!
    expect(byId.get(main.dishId!)!.tags).toContain('social')
  })

  it('keeps hand-picked and brought items when re-suggesting', () => {
    const p = { ...base(), items: [{ id: 'x', course: 'dessert' as const, dishId: 'tiramisu', locked: true }, { id: 'y', course: 'drink' as const, text: 'Wein', broughtBy: 'g1' }] }
    const items = suggestPartyItems(p, ctx(9))
    expect(items.filter((i) => i.course === 'dessert').map((i) => i.dishId)).toEqual(['tiramisu'])
    expect(items.filter((i) => i.course === 'drink')).toHaveLength(1)
  })

  it('builds a shopping list without what guests bring', () => {
    const p = { ...base(), items: [{ id: 'a', course: 'dessert' as const, dishId: 'tiramisu' }, { id: 'b', course: 'dip' as const, dishId: 'guacamole', broughtBy: 'g1' }] }
    const keys = shoppingList(p, byId).map((e) => e.key)
    expect(keys).toContain('mascarpone')
    expect(keys).not.toContain('avocado')
  })

  it('creates a default checklist for the format', () => {
    expect(defaultTodos({ format: 'interactive', kids: 2 }, 'en').map((t) => t.text).join()).toMatch(/raclette/i)
  })
})

describe('sweet dishes filter', () => {
  it('shows only Süßspeisen like Grießbrei and Arme Ritter', () => {
    const f = { ...DEFAULT_FILTERS, sweetOnly: true }
    const sweet = builtinDishes.filter((d) => d.kind === 'dish' && matchesFilters(d, f, new Set())).map((d) => d.id)
    expect(sweet).toEqual(expect.arrayContaining(['griessbrei', 'arme-ritter', 'kaiserschmarrn', 'milchreis']))
    for (const id of sweet) expect(byId.get(id)!.tags).toContain('sweet')
    expect(matchesFilters(byId.get('chinesisch')!, f, new Set())).toBe(false)
  })
})

describe('favourite labels and variants', () => {
  const withLabels = () => {
    const s = emptyState()
    s.labels = [
      { id: 'e', name: 'Eric', color: 0 },
      { id: 'cj', name: 'C&J', color: 1 },
    ]
    s.labelFavorites = { e: ['lasagne', 'pizza'], cj: ['kaesespaetzle'] }
    return s
  }

  it('filters by label favourites', () => {
    const s = withLabels()
    const f = { ...DEFAULT_FILTERS, favLabels: ['cj'] }
    expect(matchesFilters(byId.get('kaesespaetzle')!, f, new Set(), s.labelFavorites)).toBe(true)
    expect(matchesFilters(byId.get('lasagne')!, f, new Set(), s.labelFavorites)).toBe(false)
  })

  it('boosts the label whose favourites waited longest', () => {
    const s = withLabels()
    s.plan[addDays(TODAY, -2)] = { dishes: ['lasagne'] }
    // Eric had a favourite two days ago, C&J never → C&J is waiting
    expect(waitingLabel(s, lastEaten(s.plan, TODAY))).toBe('cj')
  })

  it('never suggests two variants of the same dish at once', () => {
    const f = { ...DEFAULT_FILTERS, sweetOnly: true }
    for (let seed = 1; seed < 40; seed++) {
      const out = suggest(builtinDishes, { state: emptyState(), filters: f, today: TODAY }, 6, new Set(), seeded(seed))
      const groups = out.map((d) => d.group).filter(Boolean)
      expect(new Set(groups).size).toBe(groups.length)
    }
  })

  it('keeps variants as separate dishes in one group', () => {
    expect(byId.get('schupfnudeln')!.group).toBe('schupfnudeln')
    expect(byId.get('schupfnudeln-apfelmus')!.group).toBe('schupfnudeln')
    expect(byId.get('fischstaebchen-selbst')!.name.orig).toMatch(/selbstgemacht/)
    expect(byId.get('haehnchen-pilz-mais')).toBeDefined()
  })
})

describe('tapas evening', () => {
  it('combines veg, meat, fish and bread tapas, scaled to the family', () => {
    for (let seed = 1; seed < 30; seed++) {
      const o = opts({ type: 'tapas', adults: 2, kids: 2 })
      const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(seed)))
      expect(ds).toHaveLength(5)
      expect(ds.every(Boolean)).toBe(true)
      for (const c of ['tapaVeg', 'tapaMeat', 'tapaFish', 'tapaBread']) expect(ds.map((d) => d.course)).toContain(c)
      expect(new Set(ds.map((d) => d.id)).size).toBe(5)
    }
  })

  it('opens the builder from the Tapas entry and includes Tortilla de patatas', () => {
    expect(byId.get('tapas')!.combo).toBe('tapas')
    expect(byId.get('tortilla-espanola')!.name.orig).toBe('Tortilla de patatas')
  })
})

describe('Abendbrot', () => {
  it('builds bread, cheese, cold cuts, spread, raw veg and an extra', () => {
    for (let seed = 1; seed < 30; seed++) {
      const o = opts({ type: 'abendbrot', adults: 2, kids: 2 })
      const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(seed)))
      expect(ds.every(Boolean)).toBe(true)
      const courses = ds.map((d) => d.course)
      for (const c of ['abBread', 'abCheese', 'abSpread', 'abVeg', 'abExtra']) expect(courses).toContain(c)
      expect(courses.some((c) => c === 'abMeat' || c === 'abFish')).toBe(true)
    }
  })

  it('has no cold cuts when vegetarian', () => {
    const o = opts({ type: 'abendbrot', diet: 'veggie' })
    const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(3)))
    for (const d of ds) expect(d.tags).toContain('veggie')
  })

  it('opens from the Brotzeit entry', () => {
    expect(byId.get('brotzeit')!.combo).toBe('abendbrot')
  })
})

describe('Teller, Salat & Backen', () => {
  it('builds a plate: the main plus a starchy side and a vegetable', () => {
    const o = opts({ type: 'teller' })
    for (let seed = 1; seed < 20; seed++) {
      const ds = dishesOf(fillEntries(initialEntries(o, byId.get('schnitzel')), builtinDishes, ctx(o), seeded(seed)))
      expect(ds.map((d) => d.course)).toEqual(['plMain', 'plStarch', 'plVeg'])
      expect(ds[0].id).toBe('schnitzel')
    }
  })

  it('builds a salad with base, two different extras, topping and dressing', () => {
    const o = opts({ type: 'salad' })
    const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(4)))
    expect(ds.map((d) => d.course)).toEqual(['slBase', 'slExtra', 'slExtra', 'slTopping', 'slDressing'])
    expect(ds[1].id).not.toBe(ds[2].id)
  })

  it('never suggests baking for dinner', () => {
    const out = suggest(builtinDishes, { state: emptyState(), filters: DEFAULT_FILTERS, today: TODAY }, 400, new Set(), seeded(9))
    expect(out.some((d) => d.kind === 'bake')).toBe(false)
  })

  it('offers cakes and desserts to the party planner', () => {
    const party = { ...newParty('2026-10-10', emptyState().settings, 'de'), format: 'buffet' as const, adults: 12 }
    const items = suggestPartyItems(party, { pool: builtinDishes, favorites: new Set(), today: TODAY, rng: seeded(2) })
    const cake = items.find((i) => i.course === 'cake')
    expect(cake && byId.get(cake.dishId!)?.kind).toBe('bake')
  })

  it('attaches the family recipes to existing dishes', () => {
    for (const id of ['kaesekuchen', 'kaiserschmarrn', 'waffeln', 'haehnchen-suesskartoffel']) expect(byId.get(id)?.recipe, id).toBeDefined()
  })
})

describe('builder composition & meals', () => {
  it('builds slots from an own composition', () => {
    const o = opts({ type: 'salad', counts: { slBase: 1, slExtra: 3, slTopping: 0, slDressing: 1 } })
    const ds = dishesOf(fillEntries(initialEntries(o), builtinDishes, ctx(o), seeded(3)))
    expect(ds.map((d) => d.course)).toEqual(['slBase', 'slExtra', 'slExtra', 'slExtra', 'slDressing'])
  })

  it('shows the default composition as counts', () => {
    expect(defaultCounts(opts({ type: 'salad' }))).toEqual({ slBase: 1, slExtra: 2, slTopping: 1, slDressing: 1 })
    expect(defaultCounts(opts({ type: 'chinese', adults: 2, kids: 2 }))).toEqual({ main: 1, veg: 1, soup: 1, staple: 1 })
  })

  it('counts lunch and coffee dishes as eaten', () => {
    const plan = { '2026-03-01': { dishes: ['lasagne'], meals: { lunch: ['minestrone'], coffee: ['kaesekuchen'] } } }
    const last = lastEaten(plan, TODAY)
    expect(last.get('minestrone')).toBe('2026-03-01')
    expect(last.get('kaesekuchen')).toBe('2026-03-01')
  })
})

describe('dislikes', () => {
  it('suggests disliked dishes much less and never when cooking for that person', () => {
    const state = { ...emptyState(), labels: [{ id: 'j', name: 'J', color: 0 }], labelDislikes: { j: ['lasagne'] } }
    const ctxS = { state, filters: DEFAULT_FILTERS, today: TODAY }
    const ctxN = { state: emptyState(), filters: DEFAULT_FILTERS, today: TODAY }
    const last = new Map<string, string>()
    expect(weight(byId.get('lasagne')!, ctxS, last, new Set())).toBeLessThan(weight(byId.get('lasagne')!, ctxN, last, new Set()) * 0.2)
    expect(weight(byId.get('lasagne')!, { ...ctxS, filters: { ...DEFAULT_FILTERS, favLabels: ['j'] } }, last, new Set())).toBe(0)
    expect(weight(byId.get('lasagne')!, { ...ctxS, filters: { ...DEFAULT_FILTERS, noDislikes: true } }, last, new Set())).toBe(0)
  })
})

describe('day markers', () => {
  it('keeps a day that only has markers', () => {
    expect(keepEntry({ dishes: [], labels: ['out'] })).toBe(true)
    expect(keepEntry({ dishes: [] })).toBe(false)
  })
})
