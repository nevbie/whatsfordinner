import { describe, expect, it } from 'vitest'
import { builtinDishes } from '../data/dishes'
import { INGREDIENTS } from '../data/ingredients'

describe('dish data', () => {
  it('has unique ids', () => {
    const ids = builtinDishes.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses only known ingredient keys', () => {
    const unknown = builtinDishes.flatMap((d) => d.ingredients.filter((i) => !INGREDIENTS[i]).map((i) => `${d.id}: ${i}`))
    expect(unknown).toEqual([])
  })

  it('has names in both languages and the original name', () => {
    for (const d of builtinDishes) {
      expect(d.name.orig, d.id).toBeTruthy()
      expect(d.name.de, d.id).toBeTruthy()
      expect(d.name.en, d.id).toBeTruthy()
    }
  })

  it('has a romanisation for every non-Latin original name', () => {
    const nonLatin = /[^\u0000-ɏḀ-ỿ‘-„\s.,()/'’–-]/
    for (const d of builtinDishes) {
      if (nonLatin.test(d.name.orig)) expect(d.name.roman, d.id).toBeTruthy()
    }
  })

  it('gives every Chinese and Indian dish a course for the meal builder', () => {
    for (const d of builtinDishes) {
      if ((d.cuisine === 'chinese' || d.cuisine === 'indian') && d.kind !== 'combo' && d.kind !== 'party') expect(d.course, d.id).toBeDefined()
    }
  })

  it('only points pairsWith at existing dishes', () => {
    const ids = new Set(builtinDishes.map((d) => d.id))
    for (const d of builtinDishes) for (const p of d.pairsWith ?? []) expect(ids.has(p), `${d.id} → ${p}`).toBe(true)
  })

  it('keeps vegan ⊂ veggie and no meat in veggie dishes', () => {
    for (const d of builtinDishes) {
      if (d.tags.includes('vegan')) expect(d.tags, d.id).toContain('veggie')
      if (d.tags.includes('veggie')) {
        expect(d.tags, d.id).not.toContain('meat')
        expect(d.tags, d.id).not.toContain('fish')
      }
    }
  })

  it('has bilingual recipes with matching step counts', () => {
    for (const d of builtinDishes.filter((x) => x.recipe)) {
      const r = d.recipe!
      expect(r.steps.de.length, d.id).toBe(r.steps.en.length)
      expect(r.ingredients.de.length, d.id).toBe(r.ingredients.en.length)
    }
  })
})
