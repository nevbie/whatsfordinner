import { describe, expect, it } from 'vitest'
import { builtinDishes } from '../data/dishes'
import { emptyState, type Dish } from '../data/types'
import { chineseDishCount, fillEntries, initialEntries, rerollEntry, type ComboOptions } from '../logic/combos'
import { addDays, weekStart } from '../logic/dates'
import { DEFAULT_FILTERS } from '../logic/filters'
import { suggest } from '../logic/suggest'

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
