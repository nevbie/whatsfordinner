import { useEffect, useState } from 'react'
import { comboIcon, DishMeta, FavButton } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { FilterBar, usePersistentFilters } from '../components/FilterBar'
import { formatDay } from '../components/format'
import type { Dish } from '../data/types'
import { useLang } from '../i18n'
import { todayISO } from '../logic/dates'
import { activeFilterCount } from '../logic/filters'
import { suggest } from '../logic/suggest'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

const COUNT = 3

/** Chinese/Indian dishes and the "(diverse)" entries can be expanded into a full meal. */
export function comboTypeOf(dish: Dish) {
  if (dish.kind === 'combo') return dish.combo
  if (dish.cuisine === 'chinese' || dish.cuisine === 'indian') return dish.cuisine
  return undefined
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

  const todayEntry = state.plan[today]
  const suggestions = ids.map((id) => dishById.get(id)).filter((d): d is Dish => !!d)

  const takeToday = (dish: Dish) => {
    const combo = comboTypeOf(dish)
    if (dish.kind === 'combo' && combo) return ui.openCombo(combo, undefined, today)
    setDay(today, { dishes: [dish.id] })
  }
  const planLater = async (dish: Dish) => {
    if (dish.kind === 'combo' && dish.combo) return ui.openCombo(dish.combo)
    const date = await ui.pickDay()
    if (date) setDay(date, { dishes: [dish.id] })
  }

  return (
    <div className="view">
      <header className="hero">
        <h1>{t('appTitle')}</h1>
        <p className="muted">{formatDay(today, lang, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </header>

      <section className="card today">
        {todayEntry ? (
          <>
            <div className="eyebrow">{t('suggest.today')}</div>
            <ul className="plain">
              {todayEntry.dishes.map((id) => {
                const d = dishById.get(id)
                return d ? (
                  <li key={id}>
                    <button className="link-row" onClick={() => ui.openDish(id)}>
                      <DishName dish={d} size="sm" />
                    </button>
                  </li>
                ) : null
              })}
            </ul>
          </>
        ) : (
          <p className="muted">{t('suggest.nothingToday')}</p>
        )}
      </section>

      <div className="row between">
        <h2>{t('nav.suggest')}</h2>
        <button className={`chip ${showFilters ? 'on' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
          ⚙︎ {t('suggest.filters')}
          {activeFilterCount(filters) > 0 && <span className="count-badge">{activeFilterCount(filters)}</span>}
        </button>
      </div>
      {showFilters && <FilterBar filters={filters} onChange={setFilters} />}

      {suggestions.length === 0 && <p className="muted">{t('suggest.none')}</p>}
      <div className="stack">
        {suggestions.map((dish) => {
          const combo = comboTypeOf(dish)
          return (
            <article key={dish.id} className="card suggestion" onClick={() => ui.openDish(dish.id)}>
              <div className="row between top">
                <DishName dish={dish} size="lg" />
                {dish.kind !== 'combo' && <FavButton dish={dish} />}
              </div>
              <DishMeta dish={dish} />
              <div className="actions" onClick={(e) => e.stopPropagation()}>
                {dish.kind !== 'combo' && (
                  <button className="btn primary" onClick={() => takeToday(dish)}>
                    {t('suggest.takeToday')}
                  </button>
                )}
                {dish.kind !== 'combo' && (
                  <button className="btn" onClick={() => planLater(dish)}>
                    {t('suggest.plan')}
                  </button>
                )}
                {combo && (
                  <button className={`btn ${dish.kind === 'combo' ? 'primary' : ''}`} onClick={() => ui.openCombo(combo, dish.kind === 'combo' ? undefined : dish.id)}>
                    {comboIcon(combo)} {t('suggest.buildMeal')}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      <button className="btn wide" onClick={() => setRound((r) => r + 1)}>
        🎲 {t('suggest.more')}
      </button>

      <h2>{t('suggest.mealBuilder')}</h2>
      <div className="row gap">
        <button className="btn tile" onClick={() => ui.openCombo('chinese')}>
          <span className="tile-icon">🥢</span>
          <span lang="zh">家常菜</span>
          <span className="muted">{t('suggest.buildChinese')}</span>
        </button>
        <button className="btn tile" onClick={() => ui.openCombo('indian')}>
          <span className="tile-icon">🍛</span>
          <span lang="hi">थाली</span>
          <span className="muted">{t('suggest.buildIndian')}</span>
        </button>
      </div>
    </div>
  )
}
