import type { DayEntry, Dish, FamilySettings, FamilyState, Party } from '../data/types'
import { DEFAULT_SETTINGS, emptyState } from '../data/types'

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
}

/** A day entry is kept when it has dishes or is marked as done. */
export function keepEntry(entry: DayEntry | null): entry is DayEntry {
  return !!entry && (entry.dishes.length > 0 || !!entry.done)
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
  }
}
