import { useMemo } from 'react'
import { todayISO } from '../logic/dates'
import { lastEaten } from '../logic/suggest'
import { useStore } from '../store/StoreContext'

/** Last-eaten dates, eat counts and upcoming plan dates, derived from the shared plan. */
export function useDishStats() {
  const { state } = useStore()
  return useMemo(() => {
    const today = todayISO()
    const last = lastEaten(state.plan, today)
    const counts = new Map<string, number>()
    const next = new Map<string, string>()
    for (const [date, entry] of Object.entries(state.plan)) {
      for (const id of entry.dishes) {
        if (date <= today) counts.set(id, (counts.get(id) ?? 0) + 1)
        else if (!next.has(id) || next.get(id)! > date) next.set(id, date)
      }
    }
    return { today, last, counts, next }
  }, [state.plan])
}
