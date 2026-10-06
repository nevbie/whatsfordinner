import { useMemo, useState } from 'react'
import { DishMeta } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { formatDay } from '../components/format'
import { Sheet } from '../components/Sheet'
import type { Dish } from '../data/types'
import { useLang } from '../i18n'
import { addDays, todayISO } from '../logic/dates'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'
import { matchesQuery, sortByName } from './DishesView'

export function DishPicker({ title, filter }: { title: string; filter?: (d: Dish) => boolean }) {
  const { t, lang } = useLang()
  const { dishes, state } = useStore()
  const ui = useUI()
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    const favs = new Set(state.favorites)
    return dishes
      .filter((d) => (filter ? filter(d) : true) && (!query || matchesQuery(d, query)))
      .sort((a, b) => Number(favs.has(b.id)) - Number(favs.has(a.id)) || Number(a.kind === 'side' || a.kind === 'party') - Number(b.kind === 'side' || b.kind === 'party') || sortByName(a, b, lang))
  }, [dishes, filter, query, lang, state.favorites])

  return (
    <Sheet title={title} onClose={() => ui.finish(null)}>
      <input className="search" type="search" autoFocus placeholder={t('dishes.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul className="list">
        {list.map((d) => (
          <li key={d.id} className="list-row" onClick={() => ui.finish(d.id)}>
            <div className="grow">
              <DishName dish={d} size="sm" />
              <DishMeta dish={d} />
            </div>
            {state.favorites.includes(d.id) && <span className="fav on">♥</span>}
          </li>
        ))}
      </ul>
    </Sheet>
  )
}

export function DayPicker() {
  const { t, lang } = useLang()
  const { state, dishById } = useStore()
  const ui = useUI()
  const today = todayISO()
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))
  return (
    <Sheet title={t('dish.planFor')} onClose={() => ui.finish(null)}>
      <ul className="list">
        {days.map((date) => {
          const entry = state.plan[date]
          return (
            <li key={date} className="list-row" onClick={() => ui.finish(date)}>
              <span className="day-name">{date === today ? t('plan.today') : formatDay(date, lang, { weekday: 'long', day: 'numeric', month: 'numeric' })}</span>
              <span className="muted small grow right">
                {entry
                  ? entry.dishes
                      .map((id) => dishById.get(id))
                      .map((d) => (d ? d.name[lang] || d.name.orig : ''))
                      .join(', ')
                  : '—'}
              </span>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
