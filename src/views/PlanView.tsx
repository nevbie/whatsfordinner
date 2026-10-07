import { useState } from 'react'
import { comboIcon } from '../components/DishMeta'
import { dishLabel } from '../components/DishName'
import { formatDay } from '../components/format'
import { useLang } from '../i18n'
import { addDays, todayISO, weekStart } from '../logic/dates'
import { DEFAULT_FILTERS } from '../logic/filters'
import { guestTotal, newParty } from '../logic/party'
import { suggest } from '../logic/suggest'
import { dayDishIds, EXTRA_MEALS, type DayEntry, type Dish } from '../data/types'
import { useStore, type Meal } from '../store/StoreContext'
import { useUI } from '../ui'

export function PlanView() {
  const { t, lang } = useLang()
  const { state, dishes, dishById, setDay, setMeal, saveParty } = useStore()
  const ui = useUI()
  const today = todayISO()
  const [start, setStart] = useState(() => weekStart(today))
  const [expanded, setExpanded] = useState<string | null>(null)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

  const mealIds = (date: string, meal: Meal) => (meal === 'dinner' ? state.plan[date]?.dishes : state.plan[date]?.meals?.[meal]) ?? []

  const addDish = async (date: string, meal: Meal = 'dinner', only?: (d: Dish) => boolean) => {
    // Kaffee & Kuchen: offer cakes, desserts and sweets first
    const filter = only ?? (meal === 'coffee' ? (d: Dish) => d.kind === 'bake' || d.tags.includes('sweet') : undefined)
    const id = await ui.pickDish(only ? t('plan.eatout') : meal === 'dinner' ? t('plan.pickDish') : t(`meal.${meal}`), filter)
    if (!id) return
    const dish = dishById.get(id)
    if (dish?.kind === 'combo' && dish.combo) return ui.openCombo(dish.combo, undefined, date, meal)
    setMeal(date, meal, [...mealIds(date, meal), id])
  }

  const removeDish = (date: string, meal: Meal, index: number) => {
    const next = mealIds(date, meal).filter((_, i) => i !== index)
    const entry = state.plan[date]
    if (!next.length && dayDishIds(entry).length <= 1 && !entry.done) return setDay(date, null)
    setMeal(date, meal, next)
  }

  const clearDay = (date: string) => {
    if (!confirm(t('plan.clearConfirm'))) return
    const entry = state.plan[date]
    setDay(date, entry.done ? { dishes: [], done: true } : null)
  }

  const [customLabel, setCustomLabel] = useState('')
  const toggleLabel = (date: string, label: string) => {
    const entry: DayEntry = state.plan[date] ?? { dishes: [] }
    const labels = entry.labels ?? []
    const next = labels.includes(label) ? labels.filter((l) => l !== label) : [...labels, label]
    const updated: DayEntry = { ...entry, labels: next }
    if (!next.length) delete updated.labels
    setDay(date, updated)
  }
  const labelText = (label: string) => {
    if (label === 'out' || label === 'event') return t(`plan.label.${label}`)
    if (label.startsWith('away:')) return `👤 ${t('plan.label.away', { name: state.labels.find((l) => l.id === label.slice(5))?.name ?? '?' })}`
    return label
  }
  const presetLabels = ['out', 'event', ...state.labels.map((l) => `away:${l.id}`)]

  /** Suggest dishes for the given (empty) days, avoiding repeats within the week. */
  const fill = (targets: string[]) => {
    const exclude = new Set(days.flatMap((d) => state.plan[d]?.dishes ?? []))
    const picks = suggest(dishes, { state, filters: DEFAULT_FILTERS, today }, targets.length, exclude)
    targets.forEach((date, i) => {
      const dish = picks[i]
      if (!dish) return
      // a "Chinesisch/Indisch (diverse)" pick stays a placeholder the family can expand later
      setDay(date, { ...state.plan[date], dishes: [dish.id] })
    })
  }

  // days where everyone is out don't need a dinner
  const emptyFuture = days.filter((d) => d >= today && !state.plan[d]?.dishes.length && !state.plan[d]?.labels?.includes('out'))
  const partiesOn = (date: string) => Object.values(state.parties).filter((p) => p.date === date)
  const createParty = (date: string) => {
    const party = newParty(date, state.settings, lang)
    saveParty(party)
    ui.openParty(party.id)
  }

  return (
    <div className="view compact plan-view">
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
          const open = expanded === date
          const dishIds = entry?.dishes ?? []
          const allIds = dayDishIds(entry)
          const extraMeals = EXTRA_MEALS.filter((m) => entry?.meals?.[m]?.length)
          return (
            <li key={date} className={`day ${isToday ? 'today' : ''} ${past ? 'past' : ''} ${entry?.labels?.includes('out') ? 'out' : ''}`}>
              <div className="day-row">
                <div className="day-when">
                  <span className="day-name">{formatDay(date, lang, { weekday: 'short' })}</span>
                  <span className="day-date">{formatDay(date, lang, { day: 'numeric', month: 'numeric' })}</span>
                </div>
                <div className="day-main">
                  {!!entry?.labels?.length && (
                    <span className="day-labels">
                      {entry.labels.map((l) => (
                        <span key={l} className="day-label">
                          {labelText(l)}
                        </span>
                      ))}
                    </span>
                  )}
                  {extraMeals.map((m) => (
                    <span key={m} className="day-meal">
                      <span className="meal-tag">{t(`meal.short.${m}`)}</span>
                      {entry!.meals![m]!.map((id, i) => (
                        <button key={`${id}-${i}`} className="day-dish" onClick={() => ui.openDish(id)}>
                          {dishById.get(id) ? dishLabel(dishById.get(id)!, lang) : id}
                        </button>
                      ))}
                    </span>
                  ))}
                  {extraMeals.length > 0 && dishIds.length > 0 && <span className="meal-tag">{t('meal.short.dinner')}</span>}
                  {dishIds.map((id, i) => {
                    const d = dishById.get(id)
                    return (
                      <button key={`${id}-${i}`} className="day-dish" onClick={() => (d?.kind === 'combo' && d.combo ? ui.openCombo(d.combo, undefined, date) : ui.openDish(id))}>
                        {d ? (
                          <>
                            <span lang={d.name.lang}>{d.name.orig}</span>
                            {dishLabel(d, lang) !== d.name.orig && dishIds.length === 1 && <span className="muted"> · {dishLabel(d, lang)}</span>}
                          </>
                        ) : (
                          id
                        )}
                      </button>
                    )
                  })}
                  {partiesOn(date).map((p) => (
                    <button key={p.id} className="day-dish party-link" onClick={() => ui.openParty(p.id)}>
                      🎉 <strong>{p.title}</strong>
                      <span className="muted small"> · {t('party.guestsCount', { n: guestTotal(p) })}</span>
                    </button>
                  ))}
                  {!allIds.length && !partiesOn(date).length && !entry?.labels?.includes('out') && (
                    <span className="day-empty">
                      <button className="link-btn" onClick={() => addDish(date)}>
                        ＋ {t('plan.add')}
                      </button>
                      {date >= today && (
                        <button className="link-btn" onClick={() => fill([date])} aria-label={t('plan.suggest')} title={t('plan.suggest')}>
                          🎲
                        </button>
                      )}
                    </span>
                  )}
                  {isToday && (
                    <label className="check small day-done">
                      <input type="checkbox" checked={!!entry?.done} onChange={(e) => setDay(date, { ...(entry ?? { dishes: [] }), done: e.target.checked })} /> {t('plan.done')}
                    </label>
                  )}
                </div>
                {allIds.length > 0 && (
                  <button
                    className="icon-btn small day-clear"
                    onClick={() => (allIds.length === 1 ? setDay(date, entry!.done ? { dishes: [], done: true } : null) : clearDay(date))}
                    aria-label={t('plan.clear')}
                    title={t('plan.clear')}
                  >
                    ✕
                  </button>
                )}
                <button className={`icon-btn small day-more ${open ? 'on' : ''}`} onClick={() => setExpanded(open ? null : date)} aria-expanded={open} aria-label={t('plan.actions')} title={t('plan.actions')}>
                  ⋯
                </button>
              </div>
              {open && (
                <div className="day-actions">
                  {(['dinner', ...EXTRA_MEALS] as Meal[]).flatMap((m) =>
                    mealIds(date, m).map((id, i) => (
                      <button key={`${m}-${id}-${i}`} className="chip" onClick={() => removeDish(date, m, i)}>
                        ✕ {dishById.get(id) ? dishLabel(dishById.get(id)!, lang) : id}
                      </button>
                    )),
                  )}
                  <button className="chip" onClick={() => addDish(date)}>
                    ＋ {t('meal.dinner')}
                  </button>
                  {EXTRA_MEALS.map((m) => (
                    <button key={m} className="chip" onClick={() => addDish(date, m)}>
                      ＋ {t(`meal.${m}`)}
                    </button>
                  ))}
                  <button className="chip" onClick={() => addDish(date, 'dinner', (d) => d.kind === 'eatout')}>
                    {t('plan.eatout')}
                  </button>
                  {(['chinese', 'indian', 'tapas', 'abendbrot', 'salad'] as const).map((c) => (
                    <button key={c} className="chip" onClick={() => ui.openCombo(c, undefined, date)} aria-label={t(`combo.${c}`)} title={t(`combo.${c}`)}>
                      {comboIcon(c)}
                    </button>
                  ))}
                  <button className="chip" onClick={() => createParty(date)} aria-label={t('party.new')} title={t('party.new')}>
                    🎉
                  </button>
                  <div className="label day-action-head">{t('plan.labels')}</div>
                  {[...presetLabels, ...(entry?.labels ?? []).filter((l) => !presetLabels.includes(l))].map((l) => (
                    <button key={l} className={`chip ${entry?.labels?.includes(l) ? 'on' : ''}`} aria-pressed={!!entry?.labels?.includes(l)} onClick={() => toggleLabel(date, l)}>
                      {labelText(l)}
                    </button>
                  ))}
                  <form
                    className="row gap-sm label-input"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (customLabel.trim()) toggleLabel(date, customLabel.trim())
                      setCustomLabel('')
                    }}
                  >
                    <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder={t('plan.labelCustom')} />
                    <button className="chip" type="submit" disabled={!customLabel.trim()}>
                      ＋
                    </button>
                  </form>
                </div>
              )}
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
