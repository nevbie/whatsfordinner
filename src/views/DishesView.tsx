import { useMemo, useState } from 'react'
import { DishMeta, FavButton } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { FilterBar, usePersistentFilters } from '../components/FilterBar'
import { useDishStats } from '../components/useDishStats'
import type { Dish, Lang } from '../data/types'
import { ingredientName } from '../data/ingredients'
import { useLang } from '../i18n'
import { matchesFilters } from '../logic/filters'
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

export function DishesView() {
  const { t, lang } = useLang()
  const { dishes, state } = useStore()
  const ui = useUI()
  const { last } = useDishStats()
  const [filters, setFilters] = usePersistentFilters('wfd:filters:dishes')
  const [query, setQuery] = useState('')
  const [showSides, setShowSides] = useState(false)
  const [sort, setSort] = useState<'name' | 'recent'>('name')

  const list = useMemo(() => {
    const favs = new Set(state.favorites)
    const out = dishes.filter((d) => {
      if (d.kind === 'side' && !showSides) return false
      // restaurants only with the "eating out" chip (or when searching for them)
      if (d.kind === 'eatout') {
        if (!filters.eatOut && !query) return false
      } else if (!matchesFilters(d, filters, favs)) return false
      return !query || matchesQuery(d, query)
    })
    if (sort === 'recent') out.sort((a, b) => (last.get(a.id) ?? '').localeCompare(last.get(b.id) ?? '') || sortByName(a, b, lang))
    else out.sort((a, b) => sortByName(a, b, lang))
    return out
  }, [dishes, state.favorites, filters, query, showSides, sort, last, lang])

  return (
    <div className="view">
      <h1>{t('nav.dishes')}</h1>
      <input className="search" type="search" placeholder={t('dishes.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="row between">
        <label className="check">
          <input type="checkbox" checked={showSides} onChange={(e) => setShowSides(e.target.checked)} /> {t('dishes.showSides')}
        </label>
        <div className="segmented small">
          <button className={sort === 'name' ? 'on' : ''} onClick={() => setSort('name')}>
            {t('dishes.sort.name')}
          </button>
          <button className={sort === 'recent' ? 'on' : ''} onClick={() => setSort('recent')}>
            {t('dishes.sort.recent')}
          </button>
        </div>
      </div>
      <p className="muted small">{t('dishes.count', { n: list.length })}</p>
      <ul className="list">
        {list.map((d) => (
          <li key={d.id} className="list-row" onClick={() => ui.openDish(d.id)}>
            <div className="grow">
              <DishName dish={d} size="sm" />
              <DishMeta dish={d} />
            </div>
            {d.kind !== 'combo' && <FavButton dish={d} />}
          </li>
        ))}
      </ul>
      <button className="fab" onClick={() => ui.openForm()} aria-label={t('dishes.add')}>
        ＋ {t('dishes.add')}
      </button>
    </div>
  )
}
