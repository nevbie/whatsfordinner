import { useMemo, useState } from 'react'
import { DishMeta, FavButton } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { FanTags } from '../components/FanTags'
import { FilterBar, usePersistentFilters } from '../components/FilterBar'
import { useDishStats } from '../components/useDishStats'
import type { Dish, Lang } from '../data/types'
import { ingredientName } from '../data/ingredients'
import { useLang } from '../i18n'
import { activeFilterCount, DEFAULT_FILTERS, matchesFilters } from '../logic/filters'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

export function searchText(d: Dish): string {
  const ings = d.ingredients.flatMap((i) => [ingredientName(i, 'de'), ingredientName(i, 'en')])
  return [d.name.orig, d.name.roman ?? '', d.name.de, d.name.en, ...ings].join(' ').toLowerCase()
}

export function matchesQuery(d: Dish, q: string): boolean {
  const text = searchText(d)
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => text.includes(w))
}

export function sortByName(a: Dish, b: Dish, lang: Lang) {
  return (a.name[lang] || a.name.orig).localeCompare(b.name[lang] || b.name.orig, lang)
}

type Area = 'all' | 'food' | 'side' | 'party' | 'bake' | 'drink'
const AREAS: Area[] = ['all', 'food', 'side', 'party', 'bake', 'drink']

/** Which section of the list a dish belongs to. */
export function areaOf(d: Dish): Exclude<Area, 'all'> {
  if (d.course === 'drink' || d.party?.includes('drink')) return 'drink'
  if (d.kind === 'bake') return 'bake'
  if (d.kind === 'party') return 'party'
  if (d.kind === 'side') return 'side'
  return 'food'
}

function DishRow({ d }: { d: Dish }) {
  const ui = useUI()
  return (
    <li className="list-row" onClick={() => ui.openDish(d.id)}>
      <div className="grow">
        <DishName dish={d} size="sm" />
        <DishMeta dish={d} />
        <FanTags dish={d} />
      </div>
      {d.kind !== 'combo' && <FavButton dish={d} />}
    </li>
  )
}

export function DishesView() {
  const { t, lang } = useLang()
  const { dishes, state } = useStore()
  const ui = useUI()
  const { last } = useDishStats()
  const [filters, setFilters] = usePersistentFilters('wfd:filters:dishes')
  const [query, setQuery] = useState('')
  const [area, setArea] = useState<Area>('all')
  const [sort, setSort] = useState<'name' | 'recent'>('name')
  const [showFilters, setShowFilters] = useState(false)
  const active = activeFilterCount(filters)

  const list = useMemo(() => {
    const favs = new Set(state.favorites)
    const out = dishes.filter((d) => {
      if (area !== 'all' && areaOf(d) !== area) return false
      // restaurants only with the "eating out" chip (or when searching for them)
      if (d.kind === 'eatout') {
        if (!filters.eatOut && !query) return false
      } else if (!matchesFilters(d, filters, favs, state.labelFavorites)) return false
      return !query || matchesQuery(d, query)
    })
    if (sort === 'recent') out.sort((a, b) => (last.get(a.id) ?? '').localeCompare(last.get(b.id) ?? '') || sortByName(a, b, lang))
    else out.sort((a, b) => sortByName(a, b, lang))
    return out
  }, [dishes, state.favorites, state.labelFavorites, filters, query, area, sort, last, lang])

  return (
    <div className="view">
      <h1>{t('nav.dishes')}</h1>
      <div className="row gap search-row">
        <input className="search grow" type="search" placeholder={t('dishes.searchAll')} value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className={`chip filter-toggle ${showFilters ? 'on' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
          ⚙︎ {t('suggest.filters')}
          {active > 0 && <span className="count-badge">{active}</span>}
        </button>
      </div>
      <div className="chips scroll-row area-row" role="tablist">
        {AREAS.map((a) => (
          <button key={a} role="tab" aria-selected={area === a} className={`chip ${area === a ? 'on' : ''}`} onClick={() => setArea(a)}>
            {t(`dishes.area.${a}`)}
          </button>
        ))}
      </div>
      {showFilters && (
        <div className="card filter-panel">
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="row between wrap gap-sm">
            <div className="segmented small">
              <button className={sort === 'name' ? 'on' : ''} onClick={() => setSort('name')}>
                {t('dishes.sort.name')}
              </button>
              <button className={sort === 'recent' ? 'on' : ''} onClick={() => setSort('recent')}>
                {t('dishes.sort.recent')}
              </button>
            </div>
            <div className="row gap-sm">
              <button className="btn sm" disabled={active === 0} onClick={() => setFilters(DEFAULT_FILTERS)}>
                {t('filter.reset')}
              </button>
              <button className="btn sm primary" onClick={() => setShowFilters(false)}>
                {t('filter.done', { n: list.length })}
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="muted small row between">
        <span>{list.length === 1 ? t('dishes.countOne') : t('dishes.count', { n: list.length })}</span>
        {active > 0 && !showFilters && (
          <button className="link-btn" onClick={() => setFilters(DEFAULT_FILTERS)}>
            {t('filter.active', { n: active })} · {t('filter.reset')}
          </button>
        )}
      </p>
      <ul className="list">
        {list.map((d) => (
          <DishRow key={d.id} d={d} />
        ))}
      </ul>
      {!query && (
        <button className="fab" onClick={() => ui.openForm()} aria-label={t('dishes.add')}>
          ＋ {t('dishes.add')}
        </button>
      )}
    </div>
  )
}
