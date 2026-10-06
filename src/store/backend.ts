import type { DayEntry, Dish, FamilySettings, FamilyState } from '../data/types'
import { DEFAULT_SETTINGS, emptyState } from '../data/types'

/** Storage for the shared family state: localStorage on this device, or Firebase for the family. */
export interface Backend {
  subscribe(onState: (s: FamilyState) => void, onError: (e: unknown) => void): () => void
  setDay(date: string, entry: DayEntry | null): Promise<void>
  setFavorite(id: string, on: boolean): Promise<void>
  saveDish(dish: Dish): Promise<void>
  deleteDish(id: string): Promise<void>
  updateSettings(patch: Partial<FamilySettings>): Promise<void>
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
  }
}
