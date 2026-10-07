import type { Dish } from '../data/types'
import { CUISINE_LABELS, useLang } from '../i18n'
import { daysBetween } from '../logic/dates'
import { useStore } from '../store/StoreContext'
import { formatDay } from './format'
import { useDishStats } from './useDishStats'

export function FavButton({ dish }: { dish: Dish }) {
  const { state, toggleFavorite } = useStore()
  const { t } = useLang()
  const on = state.favorites.includes(dish.id)
  return (
    <button
      className={`icon-btn fav ${on ? 'on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(dish.id)
      }}
      aria-pressed={on}
      aria-label={on ? t('dish.unfavorite') : t('dish.favorite')}
      title={on ? t('dish.unfavorite') : t('dish.favorite')}
    >
      {on ? '♥' : '♡'}
    </button>
  )
}

/** "Italian · quick · last eaten 12 days ago" */
export function DishMeta({ dish, showLast = true }: { dish: Dish; showLast?: boolean }) {
  const { t, pick, lang } = useLang()
  const { last, next, today } = useDishStats()
  const parts: string[] = []
  if (dish.kind === 'eatout') parts.push(t('dish.restaurant'))
  else {
    parts.push(pick(CUISINE_LABELS[dish.cuisine]))
    if (dish.kind !== 'combo') parts.push(t(`dish.effort${dish.effort}`))
  }
  if (showLast) {
    const nextDate = next.get(dish.id)
    const lastDate = last.get(dish.id)
    if (nextDate) parts.push(t('dish.plannedOn', { d: formatDay(nextDate, lang) }))
    else if (lastDate) {
      const n = daysBetween(lastDate, today)
      parts.push(n === 0 ? t('dish.lastEatenToday') : t('dish.lastEaten', { n }))
    } else if (dish.kind !== 'combo') parts.push(t('dish.neverEaten'))
  }
  return (
    <span className="meta">
      {parts.join(' · ')}
      {dish.tags.includes('vegan') ? ' · 🌱' : dish.tags.includes('veggie') ? ' · 🥕' : ''}
      {dish.tags.includes('spicy') ? ' · 🌶' : ''}
    </span>
  )
}

export function comboIcon(type: 'chinese' | 'indian' | 'tapas' | 'abendbrot') {
  return { chinese: '🥢', indian: '🍛', tapas: '🫒', abendbrot: '🥨' }[type]
}
