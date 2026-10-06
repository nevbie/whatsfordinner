import { useState } from 'react'
import { dishLabel } from '../components/DishName'
import { formatDay } from '../components/format'
import { useLang } from '../i18n'
import { addDays, todayISO, weekStart } from '../logic/dates'
import { DEFAULT_FILTERS } from '../logic/filters'
import { guestTotal, newParty } from '../logic/party'
import { suggest } from '../logic/suggest'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

export function PlanView() {
  const { t, lang } = useLang()
  const { state, dishes, dishById, setDay, saveParty } = useStore()
  const ui = useUI()
  const today = todayISO()
  const [start, setStart] = useState(() => weekStart(today))
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

  const addDish = async (date: string) => {
    const id = await ui.pickDish(t('plan.pickDish'))
    if (!id) return
    const dish = dishById.get(id)
    if (dish?.kind === 'combo' && dish.combo) return ui.openCombo(dish.combo, undefined, date)
    const existing = state.plan[date]?.dishes ?? []
    setDay(date, { ...state.plan[date], dishes: [...existing, id] })
  }

  const removeDish = (date: string, index: number) => {
    const entry = state.plan[date]
    const next = entry.dishes.filter((_, i) => i !== index)
    setDay(date, next.length || entry.done ? { ...entry, dishes: next } : null)
  }

  /** Suggest dishes for the given (empty) days, avoiding repeats within the week. */
  const fill = (targets: string[]) => {
    const exclude = new Set(days.flatMap((d) => state.plan[d]?.dishes ?? []))
    const picks = suggest(dishes, { state, filters: DEFAULT_FILTERS, today }, targets.length, exclude)
    targets.forEach((date, i) => {
      const dish = picks[i]
      if (!dish) return
      // a "Chinesisch/Indisch (diverse)" pick stays a placeholder the family can expand later
      setDay(date, { dishes: [dish.id] })
    })
  }

  const emptyFuture = days.filter((d) => d >= today && !state.plan[d]?.dishes.length)
  const partiesOn = (date: string) => Object.values(state.parties).filter((p) => p.date === date)
  const createParty = (date: string) => {
    const party = newParty(date, state.settings, lang)
    saveParty(party)
    ui.openParty(party.id)
  }

  return (
    <div className="view">
      <h1>{t('plan.title')}</h1>
      <div className="row between week-nav">
        <button className="icon-btn" onClick={() => setStart(addDays(start, -7))} aria-label="←">
          ‹
        </button>
        <button className="chip" onClick={() => setStart(weekStart(today))}>
          {formatDay(days[0], lang, { day: 'numeric', month: 'short' })} – {formatDay(days[6], lang, { day: 'numeric', month: 'short' })}
        </button>
        <button className="icon-btn" onClick={() => setStart(addDays(start, 7))} aria-label="→">
          ›
        </button>
      </div>

      <ul className="days">
        {days.map((date) => {
          const entry = state.plan[date]
          const isToday = date === today
          const past = date < today
          return (
            <li key={date} className={`day ${isToday ? 'today' : ''} ${past ? 'past' : ''}`}>
              <div className="day-head">
                <span className="day-name">
                  {formatDay(date, lang, { weekday: 'long' })}
                  {isToday && <span className="badge">{t('plan.today')}</span>}
                </span>
                <span className="muted small">{formatDay(date, lang, { day: 'numeric', month: 'numeric' })}</span>
              </div>
              {entry?.dishes.length ? (
                <ul className="day-dishes">
                  {entry.dishes.map((id, i) => {
                    const d = dishById.get(id)
                    return (
                      <li key={`${id}-${i}`}>
                        <button className="link-row" onClick={() => (d?.kind === 'combo' && d.combo ? ui.openCombo(d.combo, undefined, date) : ui.openDish(id))}>
                          {d ? (
                            <>
                              <span lang={d.name.lang}>{d.name.orig}</span>
                              {dishLabel(d, lang) !== d.name.orig && <span className="muted"> · {dishLabel(d, lang)}</span>}
                            </>
                          ) : (
                            id
                          )}
                        </button>
                        <button className="icon-btn small" onClick={() => removeDish(date, i)} aria-label={t('plan.clear')}>
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                !partiesOn(date).length && <p className="muted small">{t('plan.empty')}</p>
              )}
              {partiesOn(date).map((p) => (
                <button key={p.id} className="link-row party-link" onClick={() => ui.openParty(p.id)}>
                  🎉 <strong>{p.title}</strong>
                  <span className="muted small">
                    {p.time ? ` · ${p.time}` : ''} · {t('party.guestsCount', { n: guestTotal(p) })}
                  </span>
                </button>
              ))}
              {isToday && (
                <label className="check small">
                  <input type="checkbox" checked={!!entry?.done} onChange={(e) => setDay(date, { ...(entry ?? { dishes: [] }), done: e.target.checked })} /> {t('plan.done')}
                </label>
              )}
              <div className="day-actions">
                <button className="chip" onClick={() => addDish(date)}>
                  ＋ {t('plan.add')}
                </button>
                {!entry?.dishes.length && date >= today && (
                  <button className="chip" onClick={() => fill([date])} aria-label={t('plan.suggest')} title={t('plan.suggest')}>
                    🎲
                  </button>
                )}
                <button className="chip" onClick={() => ui.openCombo('chinese', undefined, date)} aria-label={t('combo.chinese')} title={t('combo.chinese')}>
                  🥢
                </button>
                <button className="chip" onClick={() => ui.openCombo('indian', undefined, date)} aria-label={t('combo.indian')} title={t('combo.indian')}>
                  🍛
                </button>
                <button className="chip" onClick={() => createParty(date)} aria-label={t('party.new')} title={t('party.new')}>
                  🎉
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      {emptyFuture.length > 0 && (
        <button className="btn wide" onClick={() => fill(emptyFuture)}>
          🎲 {t('plan.fillWeek')}
        </button>
      )}
    </div>
  )
}
