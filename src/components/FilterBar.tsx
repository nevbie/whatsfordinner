import { useState } from 'react'
import { useLang } from '../i18n'
import { useStore } from '../store/StoreContext'
import { STAPLES } from '../data/classify'
import type { Region, Staple } from '../data/types'
import { CUISINE_GROUPS, DEFAULT_FILTERS, normalizeFilters, type Filters } from '../logic/filters'

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
  const { state } = useStore()
  const toggle = (k: 'kids' | 'noSpicy' | 'favoritesOnly' | 'sweetOnly' | 'noDislikes' | 'eatOut') => onChange({ ...filters, [k]: !filters[k] })
  const effortChip = (max: 1 | 2, label: string) => (
    <button className={`chip ${filters.maxEffort === max ? 'on' : ''}`} aria-pressed={filters.maxEffort === max} onClick={() => onChange({ ...filters, maxEffort: filters.maxEffort === max ? 3 : max })}>
      {label}
    </button>
  )
  const chip = (on: boolean, label: string, onClick: () => void, extra = '') => (
    <button className={`chip ${extra} ${on ? 'on' : ''}`} aria-pressed={on} onClick={onClick}>
      {label}
    </button>
  )
  return (
    <div className="filters">
      <div className="segmented small" role="group">
        {(['any', 'veggie', 'vegan'] as const).map((d) => (
          <button key={d} className={filters.diet === d ? 'on' : ''} aria-pressed={filters.diet === d} onClick={() => onChange({ ...filters, diet: d })}>
            {t(`filter.diet.${d}`)}
          </button>
        ))}
      </div>
      <div className="filter-group">
        <div className="filter-label">{t('filter.cuisine')}</div>
        <div className="chips scroll-row" role="group" aria-label={t('filter.cuisine')}>
          {REGIONS.map((r) => (
            <span key={r} style={{ display: 'contents' }}>
              {chip(filters.regions.includes(r), t(`region.${r}`), () => onChange({ ...filters, regions: toggleIn(filters.regions, r) }), 'region-chip')}
            </span>
          ))}
          {CUISINE_GROUPS.map((c) => (
            <span key={c} style={{ display: 'contents' }}>
              {chip(filters.cuisines.includes(c), t(`cg.${c}`), () => onChange({ ...filters, cuisines: toggleIn(filters.cuisines, c) }))}
            </span>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">{t('filter.staple')}</div>
        <div className="chips scroll-row" role="group" aria-label={t('filter.staple')}>
          {STAPLES.map((st) => (
            <span key={st} style={{ display: 'contents' }}>
              {chip(filters.staples.includes(st), `${STAPLE_ICONS[st]} ${t(`staple.${st}`)}`, () => onChange({ ...filters, staples: toggleIn(filters.staples, st) }))}
            </span>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">{t('filter.props')}</div>
        <div className="chips scroll-row">
          {chip(filters.kids, `🧒 ${t('filter.kids')}`, () => toggle('kids'))}
          {chip(filters.noSpicy, t('filter.noSpicy'), () => toggle('noSpicy'))}
          {effortChip(1, `⏱ ${t('filter.quick')}`)}
          {effortChip(2, t('filter.noProject'))}
          {chip(filters.sweetOnly, `🍮 ${t('filter.sweet')}`, () => toggle('sweetOnly'))}
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">{t('filter.loved')}</div>
        <div className="chips scroll-row">
          {chip(filters.favoritesOnly, `♥ ${t('filter.favorites')}`, () => toggle('favoritesOnly'))}
          {state.labels.length > 0 && chip(filters.noDislikes, `👍 ${t('filter.noDislikes')}`, () => toggle('noDislikes'))}
          {state.labels.map((l) => (
            <span key={l.id} style={{ display: 'contents' }}>
              {chip(filters.favLabels.includes(l.id), `★ ${l.name}`, () => onChange({ ...filters, favLabels: toggleIn(filters.favLabels, l.id) }), `lbl-chip lbl-${l.color % 8}`)}
            </span>
          ))}
          {showEatOut && chip(filters.eatOut, `🍽 ${t('filter.eatOut')}`, () => toggle('eatOut'))}
        </div>
      </div>
    </div>
  )
}
