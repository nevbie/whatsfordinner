import { useMemo, useState } from 'react'
import { DishName } from '../components/DishName'
import { formatDay } from '../components/format'
import { useDishStats } from '../components/useDishStats'
import { useLang } from '../i18n'
import { todayISO } from '../logic/dates'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

const PAGE = 30

export function HistoryView() {
  const { t, lang } = useLang()
  const { state, dishById, setMeal } = useStore()
  const ui = useUI()
  const { counts } = useDishStats()
  const [limit, setLimit] = useState(PAGE)
  const [pastDate, setPastDate] = useState('')
  const today = todayISO()

  const past = useMemo(
    () =>
      Object.entries(state.plan)
        .filter(([date, e]) => date <= today && e.dishes.length > 0)
        .sort(([a], [b]) => b.localeCompare(a)),
    [state.plan, today],
  )
  const top = useMemo(
    () =>
      [...counts.entries()]
        .filter(([id]) => dishById.get(id)?.kind !== 'side')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    [counts, dishById],
  )

  const addPast = async () => {
    if (!pastDate || pastDate > today) return
    const id = await ui.pickDish(t('plan.pickDish'))
    if (!id) return
    const existing = state.plan[pastDate]?.dishes ?? []
    setMeal(pastDate, 'dinner', [...existing, id])
    setPastDate('')
  }

  return (
    <div className="view">
      <h1>{t('history.title')}</h1>

      <div className="card row gap wrap">
        <label className="grow">
          <span className="small muted">{t('history.addPast')}</span>
          <input type="date" max={today} value={pastDate} onChange={(e) => setPastDate(e.target.value)} />
        </label>
        <button className="btn" disabled={!pastDate} onClick={addPast}>
          ＋ {t('plan.add')}
        </button>
      </div>

      {past.length === 0 ? (
        <p className="muted">{t('history.empty')}</p>
      ) : (
        <>
          {top.length > 0 && (
            <>
              <h2>{t('history.top')}</h2>
              <ol className="list top">
                {top.map(([id, n]) => {
                  const d = dishById.get(id)
                  return d ? (
                    <li key={id} className="list-row" onClick={() => ui.openDish(id)}>
                      <div className="grow">
                        <DishName dish={d} size="sm" />
                      </div>
                      <span className="count">{n}×</span>
                    </li>
                  ) : null
                })}
              </ol>
            </>
          )}
          <h2>{t('history.recent')}</h2>
          <ul className="list">
            {past.slice(0, limit).map(([date, entry]) => (
              <li key={date} className="history-row">
                <span className="history-date">{formatDay(date, lang, { weekday: 'short', day: 'numeric', month: 'short', year: date.slice(0, 4) === today.slice(0, 4) ? undefined : 'numeric' })}</span>
                <span className="grow">
                  {entry.dishes.map((id) => {
                    const d = dishById.get(id)
                    return d ? (
                      <button key={id} className="link-row" onClick={() => ui.openDish(id)}>
                        <DishName dish={d} size="sm" />
                      </button>
                    ) : null
                  })}
                </span>
              </li>
            ))}
          </ul>
          {past.length > limit && (
            <button className="btn wide" onClick={() => setLimit(limit + PAGE)}>
              …
            </button>
          )}
        </>
      )}
    </div>
  )
}
