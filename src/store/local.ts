import type { FamilyState } from '../data/types'
import { normalize, type Backend } from './backend'

const KEY = 'wfd:state'

export function readLocal(): FamilyState {
  try {
    return normalize(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
  } catch {
    return normalize(null)
  }
}

export function writeLocal(state: FamilyState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked – keep working in memory */
  }
}

/** Single-device storage. Also keeps several tabs in sync via the storage event. */
export function localBackend(): Backend {
  let state = readLocal()
  const listeners = new Set<(s: FamilyState) => void>()
  const emit = () => listeners.forEach((l) => l(state))
  const update = async (fn: (s: FamilyState) => FamilyState) => {
    state = fn(state)
    writeLocal(state)
    emit()
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = readLocal()
      emit()
    }
  }

  return {
    subscribe(onState) {
      listeners.add(onState)
      if (listeners.size === 1) window.addEventListener('storage', onStorage)
      onState(state)
      return () => {
        listeners.delete(onState)
        if (!listeners.size) window.removeEventListener('storage', onStorage)
      }
    },
    setDay: (date, entry) =>
      update((s) => {
        const plan = { ...s.plan }
        if (entry && entry.dishes.length) plan[date] = entry
        else delete plan[date]
        return { ...s, plan }
      }),
    setFavorite: (id, on) =>
      update((s) => ({ ...s, favorites: on ? [...new Set([...s.favorites, id])] : s.favorites.filter((f) => f !== id) })),
    saveDish: (dish) => update((s) => ({ ...s, customDishes: { ...s.customDishes, [dish.id]: dish } })),
    deleteDish: (id) =>
      update((s) => {
        const customDishes = { ...s.customDishes }
        delete customDishes[id]
        return { ...s, customDishes }
      }),
    updateSettings: (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
  }
}
