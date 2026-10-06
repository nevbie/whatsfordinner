import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ComboType, Dish } from './data/types'

/** Overlays (sheets) stacked on top of the current tab. The phone's back button closes the top one. */
export type Overlay =
  | { type: 'dish'; id: string }
  | { type: 'combo'; combo: ComboType; seedId?: string; date?: string }
  | { type: 'form'; id?: string }
  | { type: 'party'; id: string }
  | { type: 'pickDish'; title: string; filter?: (d: Dish) => boolean; resolve(id: string | null): void }
  | { type: 'pickDay'; resolve(date: string | null): void }

interface UIValue {
  overlays: Overlay[]
  open(o: Overlay): void
  close(): void
  /** Close a picker overlay and hand its result to the waiting caller. */
  finish(result: string | null): void
  openDish(id: string): void
  openCombo(combo: ComboType, seedId?: string, date?: string): void
  openForm(id?: string): void
  openParty(id: string): void
  pickDish(title: string, filter?: (d: Dish) => boolean): Promise<string | null>
  pickDay(): Promise<string | null>
}

const Ctx = createContext<UIValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const depth = useRef(0)
  const pendingResult = useRef<string | null>(null)

  useEffect(() => {
    const onPop = () => {
      if (depth.current > 0) {
        depth.current--
        const result = pendingResult.current
        pendingResult.current = null
        setOverlays((o) => {
          const top = o[o.length - 1]
          // resolve after the overlay is gone, so callers can safely open the next one
          if (top?.type === 'pickDish' || top?.type === 'pickDay') setTimeout(() => top.resolve(result), 0)
          return o.slice(0, -1)
        })
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = useCallback((o: Overlay) => {
    depth.current++
    history.pushState({ overlay: depth.current }, '')
    setOverlays((s) => [...s, o])
  }, [])

  const close = useCallback(() => {
    if (depth.current > 0) history.back()
  }, [])

  const finish = useCallback(
    (result: string | null) => {
      pendingResult.current = result
      close()
    },
    [close],
  )

  const value: UIValue = {
    overlays,
    open,
    close,
    finish,
    openDish: (id) => open({ type: 'dish', id }),
    openCombo: (combo, seedId, date) => open({ type: 'combo', combo, seedId, date }),
    openForm: (id) => open({ type: 'form', id }),
    openParty: (id) => open({ type: 'party', id }),
    pickDish: (title, filter) =>
      new Promise((resolve) => {
        let done = false
        open({
          type: 'pickDish',
          title,
          filter,
          resolve: (id) => {
            if (done) return
            done = true
            resolve(id)
          },
        })
      }),
    pickDay: () =>
      new Promise((resolve) => {
        let done = false
        open({
          type: 'pickDay',
          resolve: (date) => {
            if (done) return
            done = true
            resolve(date)
          },
        })
      }),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useUI(): UIValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useUI outside UIProvider')
  return v
}
