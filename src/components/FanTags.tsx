import type { Dish } from '../data/types'
import { useStore } from '../store/StoreContext'

/** Small coloured tags of the people/groups whose favourite this dish is. */
export function FanTags({ dish }: { dish: Dish }) {
  const { state } = useStore()
  const fans = state.labels.filter((l) => state.labelFavorites[l.id]?.includes(dish.id))
  const haters = state.labels.filter((l) => state.labelDislikes[l.id]?.includes(dish.id))
  if (!fans.length && !haters.length) return null
  return (
    <span className="fan-tags">
      {fans.map((l) => (
        <span key={l.id} className={`fan-tag lbl-${l.color % 8}`}>
          ★ {l.name}
        </span>
      ))}
      {haters.map((l) => (
        <span key={l.id} className={`fan-tag dislike lbl-${l.color % 8}`}>
          👎 {l.name}
        </span>
      ))}
    </span>
  )
}
