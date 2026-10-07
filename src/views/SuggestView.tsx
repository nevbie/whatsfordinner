import { useEffect, useState } from 'react'
import { comboIcon, DishMeta, FavButton } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { FanTags } from '../components/FanTags'
import { FilterBar, usePersistentFilters } from '../components/FilterBar'
import { formatDay } from '../components/format'
import type { Dish } from '../data/types'
import { useLang } from '../i18n'
import { comboTypeOfDish } from '../logic/combos'
import { addDays, todayISO } from '../logic/dates'
import { activeFilterCount, DEFAULT_FILTERS } from '../logic/filters'
import { suggest } from '../logic/suggest'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

const COUNT = 3

/** Chinese/Indian dishes and the "(diverse)" entries can be expanded into a full meal. */
export function comboTypeOf(dish: Dish) {
  if (dish.kind === 'combo') return dish.combo
  return comboTypeOfDish(dish)
}

export function SuggestView() {
  const { t, lang } = useLang()
  const { state, dishes, dishById, setDay } = useStore()
  const ui = useUI()
  const [filters, setFilters] = usePersistentFilters('wfd:filters:suggest')
  const [showFilters, setShowFilters] = useState(false)
  const [ids, setIds] = useState<string[]>([])
  const [round, setRound] = useState(0)
  const today = todayISO()

  // Re-draw only when asked (filters / "other ideas"), not on every plan change.
  useEffect(() => {
    setIds((prev) => {
      const exclude = new Set(round > 0 ? prev : [])
      let next = suggest(dishes, { state, filters, today }, COUNT, exclude)
      if (next.length < COUNT) next = suggest(dishes, { state, filters, today }, COUNT)
      return next.map((d) => d.id)
    })
  }, [filters, round])

  // Once today's dinner is marked as over, everything here is about tomorrow.
  const todayDone = !!state.plan[today]?.done
  const target = todayDone ? addDays(today, 1) : today
  const targetEntry = state.plan[target]
  const suggestions = ids.map((id) => dishById.get(id)).filter((d): d is Dish => !!d)

  const setTodayDone = (done: boolean) => {
    const entry = state.plan[today] ?? { dishes: [] }
    setDay(today, { ...entry, done })
  }
  const take = (dish: Dish) => {
    const combo = comboTypeOf(dish)
    if (dish.kind === 'combo' && combo) return ui.openCombo(combo, undefined, target)
    setDay(target, { dishes: [dish.id] })
  }
  const planLater = async (dish: Dish) => {
    if (dish.kind === 'combo' && dish.combo) return ui.openCombo(dish.combo)
    const date = await ui.pickDay()
    if (date) setDay(date, { dishes: [dish.id] })
  }

  return (
    <div className="view compact">
      <header className="title-row">
        <h1>{todayDone ? t('appTitleTomorrow') : t('appTitle')}</h1>
        <span className="muted small">{formatDay(today, lang, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </header>

      <section className="card today">
        <div className="today-line">
        <span className="eyebrow">{todayDone ? t('suggest.tomorrow') : t('suggest.today')}</span>
        {targetEntry?.dishes.length ? (
          <div className="today-dishes">
            {targetEntry.dishes.map((id) => {
              const d = dishById.get(id)
              return d ? (
                <button key={id} className="link-row" onClick={() => ui.openDish(id)}>
                  <DishName dish={d} size="sm" />
                </button>
              ) : null
            })}
          </div>
        ) : (
          <span className="muted small">{todayDone ? t('suggest.nothingTomorrow') : t('suggest.nothingToday')}</span>
        )}
        </div>
        {todayDone ? (
          <p className="small done-row">
            ✓ {t('suggest.todayDone')}{' '}
            <button className="link-btn" onClick={() => setTodayDone(false)}>
              {t('undo')}
            </button>
          </p>
        ) : (
          <label className="check small done-row">
            <input type="checkbox" checked={false} onChange={() => setTodayDone(true)} /> {t('suggest.markDone')}
          </label>
        )}
      </section>

      <div className="row between section-head">
        <h2>{t('suggest.ideas')}</h2>
        <div className="row gap-sm">
          <button className="chip" onClick={() => setRound((r) => r + 1)}>
            🎲 {t('suggest.more')}
          </button>
          <button className={`chip ${showFilters ? 'on' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
            ⚙︎ {t('suggest.filters')}
            {activeFilterCount(filters) > 0 && <span className="count-badge">{activeFilterCount(filters)}</span>}
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="card filter-panel">
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="row between">
            <button className="btn" disabled={activeFilterCount(filters) === 0} onClick={() => setFilters(DEFAULT_FILTERS)}>
              {t('filter.reset')}
            </button>
            <button className="btn primary" onClick={() => setShowFilters(false)}>
              {t('filter.close')}
            </button>
          </div>
        </div>
      )}

      {suggestions.length === 0 && <p className="muted">{t('suggest.none')}</p>}
      <div className="stack tight">
        {suggestions.map((dish) => {
          const combo = comboTypeOf(dish)
          return (
            <article key={dish.id} className="card suggestion" onClick={() => ui.openDish(dish.id)}>
              <div className="row between top">
                <DishName dish={dish} size="md" />
                {dish.kind !== 'combo' && <FavButton dish={dish} />}
              </div>
              <div className="card-foot">
                <div className="grow">
                  <DishMeta dish={dish} compact />
                  <FanTags dish={dish} />
                </div>
                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                  {dish.kind !== 'combo' && (
                    <button className="btn sm primary" onClick={() => take(dish)}>
                      {todayDone ? t('suggest.tomorrowShort') : t('suggest.todayShort')}
                    </button>
                  )}
                  {dish.kind !== 'combo' && (
                    <button className="btn sm icon-only" onClick={() => planLater(dish)} aria-label={t('suggest.plan')} title={t('suggest.plan')}>
                      📅
                    </button>
                  )}
                  {combo && (
                    <button
                      className={`btn sm ${dish.kind === 'combo' ? 'primary' : 'icon-only'}`}
                      onClick={() => ui.openCombo(combo, dish.kind === 'combo' ? undefined : dish.id, dish.kind === 'combo' ? target : undefined)}
                      aria-label={t('suggest.buildMeal')}
                      title={t('suggest.buildMeal')}
                    >
                      {comboIcon(combo)}
                      {dish.kind === 'combo' ? ` ${t('suggest.buildShort')}` : ''}
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="quick-row">
        <button className="btn quick" onClick={() => ui.openCombo('chinese', undefined, target)} title={t('combo.chinese')}>
          <span className="quick-icon" aria-hidden>🥢</span>
          <span lang="zh">家常菜</span>
        </button>
        <button className="btn quick" onClick={() => ui.openCombo('indian', undefined, target)} title={t('combo.indian')}>
          <span className="quick-icon" aria-hidden>🍛</span>
          <span lang="hi">थाली</span>
        </button>
        <button className="btn quick" onClick={() => ui.openCombo('tapas', undefined, target)} title={t('combo.tapas')}>
          <span className="quick-icon" aria-hidden>🫒</span>
          <span lang="es">Tapas</span>
        </button>
        <button className="btn quick" onClick={() => ui.openCombo('abendbrot', undefined, target)} title={t('combo.abendbrot')}>
          <span className="quick-icon" aria-hidden>🥨</span>
          <span>{t('combo.abendbrot')}</span>
        </button>
        <button className="btn quick" onClick={() => (location.hash = '#/party')} title={t('suggest.hosting')}>
          <span className="quick-icon" aria-hidden>🎉</span>
          <span>{t('nav.party')}</span>
        </button>
      </div>
    </div>
  )
}
