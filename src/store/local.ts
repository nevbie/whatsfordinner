import type { FamilyState } from '../data/types'
import { keepEntry, normalize, type Backend } from './backend'

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
        if (keepEntry(entry)) plan[date] = entry
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
    saveParty: (party) => update((s) => ({ ...s, parties: { ...s.parties, [party.id]: party } })),
    saveLabels: (labels) => update((s) => ({ ...s, labels })),
    deleteLabel: (id, remaining) =>
      update((s) => {
        const labelFavorites = { ...s.labelFavorites }
        delete labelFavorites[id]
        const labelDislikes = { ...s.labelDislikes }
        delete labelDislikes[id]
        return { ...s, labels: remaining, labelFavorites, labelDislikes }
      }),
    setLabelDislike: (labelId, dishId, on) =>
      update((s) => {
        const cur = s.labelDislikes[labelId] ?? []
        const next = on ? [...new Set([...cur, dishId])] : cur.filter((x) => x !== dishId)
        return { ...s, labelDislikes: { ...s.labelDislikes, [labelId]: next } }
      }),
    setHidden: (dishId, on) =>
      update((s) => ({ ...s, hiddenDishes: on ? [...new Set([...s.hiddenDishes, dishId])] : s.hiddenDishes.filter((x) => x !== dishId) })),
    setLabelFavorite: (labelId, dishId, on) =>
      update((s) => {
        const cur = s.labelFavorites[labelId] ?? []
        const next = on ? [...new Set([...cur, dishId])] : cur.filter((x) => x !== dishId)
        return { ...s, labelFavorites: { ...s.labelFavorites, [labelId]: next } }
      }),
    deleteParty: (id) =>
      update((s) => {
        const parties = { ...s.parties }
        delete parties[id]
        return { ...s, parties }
      }),
  }
}
