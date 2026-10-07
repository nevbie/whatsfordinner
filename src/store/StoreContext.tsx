import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { builtinDishes } from '../data/dishes'
import type { DayEntry, Dish, ExtraMeal, FamilySettings, FamilyState, FavLabel, Party } from '../data/types'
import { firebaseConfig } from '../firebaseConfig'
import type { Backend } from './backend'
import { localBackend, readLocal, writeLocal } from './local'

const FAMILY_KEY = 'wfd:family'

export type Meal = ExtraMeal | 'dinner'

interface StoreValue {
  state: FamilyState
  dishes: Dish[]
  dishById: Map<string, Dish>
  familyCode: string | null
  syncAvailable: boolean
  syncError: string | null
  setDay(date: string, entry: DayEntry | null): void
  /** Replace the dishes of one meal of a day, keeping the other meals. */
  setMeal(date: string, meal: Meal, ids: string[]): void
  toggleFavorite(id: string): void
  saveDish(dish: Dish): void
  deleteDish(id: string): void
  updateSettings(patch: Partial<FamilySettings>): void
  saveParty(party: Party): void
  deleteParty(id: string): void
  addLabel(name: string): void
  renameLabel(id: string, name: string): void
  deleteLabel(id: string): void
  toggleLabelFavorite(labelId: string, dishId: string): void
  toggleLabelDislike(labelId: string, dishId: string): void
  setHidden(dishId: string, on: boolean): void
  createFamily(): Promise<string>
  joinFamily(code: string): Promise<boolean>
  leaveFamily(): void
}

const Ctx = createContext<StoreValue | null>(null)

function readFamilyCode(): string | null {
  try {
    return localStorage.getItem(FAMILY_KEY)
  } catch {
    return null
  }
}

function writeFamilyCode(code: string | null) {
  try {
    if (code) localStorage.setItem(FAMILY_KEY, code)
    else localStorage.removeItem(FAMILY_KEY)
  } catch {
    /* ignore */
  }
}

// Firebase is only loaded when the family actually uses sync.
const loadFirebase = () => import('./firebase')

export function StoreProvider({ children }: { children: ReactNode }) {
  const syncAvailable = firebaseConfig !== null
  const [familyCode, setFamilyCode] = useState<string | null>(() => (syncAvailable ? readFamilyCode() : null))
  const [backend, setBackend] = useState<Backend | null>(null)
  const [state, setState] = useState<FamilyState>(readLocal)
  const [syncError, setSyncError] = useState<string | null>(null)

  // choose backend
  useEffect(() => {
    let cancelled = false
    if (!familyCode) {
      setBackend(localBackend())
      return
    }
    loadFirebase()
      .then((m) => !cancelled && setBackend(m.firebaseBackend(familyCode)))
      .catch((e) => setSyncError(String(e)))
    return () => {
      cancelled = true
    }
  }, [familyCode])

  useEffect(() => {
    if (!backend) return
    setSyncError(null)
    return backend.subscribe(
      (s) => {
        setState(s)
        // keep a local copy so the app opens instantly and works if the family is left
        if (familyCode) writeLocal(s)
      },
      (e) => setSyncError(e instanceof Error ? e.message : String(e)),
    )
  }, [backend, familyCode])

  const run = useCallback(
    (p: Promise<void> | undefined) => p?.catch((e) => setSyncError(e instanceof Error ? e.message : String(e))),
    [],
  )

  // Custom dishes with a built-in id are the family's edits of that dish and replace it.
  const allDishes = useMemo(() => {
    const custom = state.customDishes
    const builtinIds = new Set(builtinDishes.map((d) => d.id))
    return [...builtinDishes.map((d) => custom[d.id] ?? d), ...Object.values(custom).filter((d) => !builtinIds.has(d.id))]
  }, [state.customDishes])
  // removed dishes disappear from lists and suggestions but still show up in the history
  const dishes = useMemo(() => {
    const hidden = new Set(state.hiddenDishes)
    return allDishes.filter((d) => !hidden.has(d.id))
  }, [allDishes, state.hiddenDishes])
  const dishById = useMemo(() => new Map(allDishes.map((d) => [d.id, d])), [allDishes])

  const value: StoreValue = {
    state,
    dishes,
    dishById,
    familyCode,
    syncAvailable,
    syncError,
    setDay: (date, entry) => run(backend?.setDay(date, entry)),
    setMeal: (date, meal, ids) => {
      const entry: DayEntry = { ...(state.plan[date] ?? { dishes: [] }) }
      if (meal === 'dinner') entry.dishes = ids
      else {
        const meals = { ...entry.meals }
        if (ids.length) meals[meal] = ids
        else delete meals[meal]
        entry.meals = meals
      }
      run(backend?.setDay(date, entry))
    },
    toggleFavorite: (id) => run(backend?.setFavorite(id, !state.favorites.includes(id))),
    saveDish: (dish) => run(backend?.saveDish(dish)),
    deleteDish: (id) => run(backend?.deleteDish(id)),
    updateSettings: (patch) => run(backend?.updateSettings(patch)),
    saveParty: (party) => run(backend?.saveParty(party)),
    deleteParty: (id) => run(backend?.deleteParty(id)),
    addLabel: (name) => {
      const used = new Set(state.labels.map((l) => l.color))
      const color = [0, 1, 2, 3, 4, 5, 6, 7].find((c) => !used.has(c)) ?? state.labels.length % 8
      const label: FavLabel = { id: `l-${Date.now().toString(36)}`, name, color }
      run(backend?.saveLabels([...state.labels, label]))
    },
    renameLabel: (id, name) => run(backend?.saveLabels(state.labels.map((l) => (l.id === id ? { ...l, name } : l)))),
    deleteLabel: (id) => run(backend?.deleteLabel(id, state.labels.filter((l) => l.id !== id))),
    // a person can't love and dislike the same dish: setting one clears the other
    toggleLabelDislike: (labelId, dishId) => {
      const on = !(state.labelDislikes[labelId] ?? []).includes(dishId)
      if (on && (state.labelFavorites[labelId] ?? []).includes(dishId)) run(backend?.setLabelFavorite(labelId, dishId, false))
      run(backend?.setLabelDislike(labelId, dishId, on))
    },
    setHidden: (dishId, on) => run(backend?.setHidden(dishId, on)),
    toggleLabelFavorite: (labelId, dishId) => {
      const on = !(state.labelFavorites[labelId] ?? []).includes(dishId)
      if (on && (state.labelDislikes[labelId] ?? []).includes(dishId)) run(backend?.setLabelDislike(labelId, dishId, false))
      run(backend?.setLabelFavorite(labelId, dishId, on))
    },
    async createFamily() {
      const m = await loadFirebase()
      const code = m.newFamilyCode()
      await m.createFamily(code, state)
      writeFamilyCode(code)
      setFamilyCode(code)
      return code
    },
    async joinFamily(input) {
      const m = await loadFirebase()
      const code = m.cleanCode(input)
      if (!(await m.familyExists(code))) return false
      writeFamilyCode(code)
      setFamilyCode(code)
      return true
    },
    leaveFamily() {
      writeLocal(state)
      writeFamilyCode(null)
      setFamilyCode(null)
    },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): StoreValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}
