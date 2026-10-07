import type { DayEntry, Dish, FamilySettings, FamilyState, FavLabel, Party } from '../data/types'
import { dayDishIds, DEFAULT_SETTINGS, emptyState } from '../data/types'

/** Storage for the shared family state: localStorage on this device, or Firebase for the family. */
export interface Backend {
  subscribe(onState: (s: FamilyState) => void, onError: (e: unknown) => void): () => void
  setDay(date: string, entry: DayEntry | null): Promise<void>
  setFavorite(id: string, on: boolean): Promise<void>
  saveDish(dish: Dish): Promise<void>
  deleteDish(id: string): Promise<void>
  updateSettings(patch: Partial<FamilySettings>): Promise<void>
  saveParty(party: Party): Promise<void>
  deleteParty(id: string): Promise<void>
  saveLabels(labels: FavLabel[]): Promise<void>
  deleteLabel(id: string, remaining: FavLabel[]): Promise<void>
  setLabelFavorite(labelId: string, dishId: string, on: boolean): Promise<void>
  setLabelDislike(labelId: string, dishId: string, on: boolean): Promise<void>
  setHidden(dishId: string, on: boolean): Promise<void>
}

/** A day entry is kept when it has dishes or is marked as done. */
export function keepEntry(entry: DayEntry | null): entry is DayEntry {
  return !!entry && (dayDishIds(entry).length > 0 || !!entry.done || !!entry.labels?.length)
}

/** Fill in missing fields of state coming from storage. */
export function normalize(raw: Partial<FamilyState> | undefined | null): FamilyState {
  const base = emptyState()
  if (!raw) return base
  return {
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    plan: raw.plan ?? {},
    customDishes: raw.customDishes ?? {},
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings ?? {}) },
    parties: raw.parties ?? {},
    labels: Array.isArray(raw.labels) ? raw.labels : [],
    labelFavorites: raw.labelFavorites ?? {},
    labelDislikes: raw.labelDislikes ?? {},
    hiddenDishes: Array.isArray(raw.hiddenDishes) ? raw.hiddenDishes : [],
  }
}
