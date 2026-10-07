import { useLang } from '../i18n'

/** 1–5 star rating; tapping the current value again clears it. Read-only without onChange. */
export function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const { t } = useLang()
  if (!onChange) return value ? <span className="stars" aria-label={t('dish.ratingN', { n: value })}>{'★'.repeat(value)}</span> : null
  return (
    <span className="stars edit" role="radiogroup" aria-label={t('dish.rating')}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} className={n <= value ? 'on' : ''} onClick={() => onChange(value === n ? 0 : n)}>
          ★
        </button>
      ))}
    </span>
  )
}
