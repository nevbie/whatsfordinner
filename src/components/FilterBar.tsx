import { useState } from 'react'
import { useLang } from '../i18n'
import { STAPLES } from '../data/classify'
import type { Region, Staple } from '../data/types'
import { CUISINE_GROUPS, DEFAULT_FILTERS, normalizeFilters, type CuisineGroup, type Filters } from '../logic/filters'

const REGIONS: Region[] = ['europe', 'asia', 'other']

const STAPLE_ICONS: Record<Staple, string> = { bread: '🥖', pasta: '🍝', rice: '🍚', potatoes: '🥔', dough: '🥟' }

function toggleIn<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

/** Filters persisted per device. */
export function usePersistentFilters(key: string): [Filters, (f: Filters) => void] {
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      return normalizeFilters(JSON.parse(localStorage.getItem(key) ?? '{}'))
    } catch {
      return DEFAULT_FILTERS
    }
  })
  const set = (f: Filters) => {
    setFilters(f)
    try {
      localStorage.setItem(key, JSON.stringify(f))
    } catch {
      /* ignore */
    }
  }
  return [filters, set]
}

export function FilterBar({ filters, onChange, showEatOut = true }: { filters: Filters; onChange(f: Filters): void; showEatOut?: boolean }) {
  const { t } = useLang()
  const toggle = (k: 'kids' | 'noSpicy' | 'favoritesOnly' | 'eatOut') => onChange({ ...filters, [k]: !filters[k] })
  const effortChip = (max: 1 | 2, label: string) => (
    <button className={`chip ${filters.maxEffort === max ? 'on' : ''}`} aria-pressed={filters.maxEffort === max} onClick={() => onChange({ ...filters, maxEffort: filters.maxEffort === max ? 3 : max })}>
      {label}
    </button>
  )
  return (
    <div className="filters">
      <div className="segmented" role="group">
        {(['any', 'veggie', 'vegan'] as const).map((d) => (
          <button key={d} className={filters.diet === d ? 'on' : ''} aria-pressed={filters.diet === d} onClick={() => onChange({ ...filters, diet: d })}>
            {t(`filter.diet.${d}`)}
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label={t('filter.region')}>
        {REGIONS.map((r) => (
          <button key={r} className={`chip ${filters.regions.includes(r) ? 'on' : ''}`} aria-pressed={filters.regions.includes(r)} onClick={() => onChange({ ...filters, regions: toggleIn(filters.regions, r) })}>
            {t(`region.${r}`)}
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label={t('filter.staple')}>
        {STAPLES.map((s) => (
          <button key={s} className={`chip ${filters.staples.includes(s) ? 'on' : ''}`} aria-pressed={filters.staples.includes(s)} onClick={() => onChange({ ...filters, staples: toggleIn(filters.staples, s) })}>
            {STAPLE_ICONS[s]} {t(`staple.${s}`)}
          </button>
        ))}
      </div>
      <div className="chips">
        <select className="chip select" value={filters.cuisine} onChange={(e) => onChange({ ...filters, cuisine: e.target.value as CuisineGroup })} aria-label={t('filter.cuisine')}>
          {CUISINE_GROUPS.map((c) => (
            <option key={c} value={c}>
              {t(`cg.${c}`)}
            </option>
          ))}
        </select>
        <button className={`chip ${filters.kids ? 'on' : ''}`} aria-pressed={filters.kids} onClick={() => toggle('kids')}>
          🧒 {t('filter.kids')}
        </button>
        <button className={`chip ${filters.noSpicy ? 'on' : ''}`} aria-pressed={filters.noSpicy} onClick={() => toggle('noSpicy')}>
          {t('filter.noSpicy')}
        </button>
        {effortChip(1, `⏱ ${t('filter.quick')}`)}
        {effortChip(2, t('filter.noProject'))}
        <button className={`chip ${filters.favoritesOnly ? 'on' : ''}`} aria-pressed={filters.favoritesOnly} onClick={() => toggle('favoritesOnly')}>
          ♥ {t('filter.favorites')}
        </button>
        {showEatOut && (
          <button className={`chip ${filters.eatOut ? 'on' : ''}`} aria-pressed={filters.eatOut} onClick={() => toggle('eatOut')}>
            🍽 {t('filter.eatOut')}
          </button>
        )}
      </div>
    </div>
  )
}
