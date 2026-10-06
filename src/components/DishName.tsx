import type { Dish } from '../data/types'
import { useLang } from '../i18n'

/** Original name (in its script) with the romanisation in brackets, then the translation in the UI language. */
export function DishName({ dish, size = 'md' }: { dish: Dish; size?: 'sm' | 'md' | 'lg' }) {
  const { lang } = useLang()
  const { orig, roman, lang: origLang } = dish.name
  const translation = dish.name[lang]
  return (
    <span className={`dn dn-${size}`}>
      <span className="dn-line">
        <span className="dn-orig" lang={origLang}>
          {orig}
        </span>
        {roman && <span className="dn-roman"> ({roman})</span>}
      </span>
      {translation && translation !== orig && <span className="dn-trans">{translation}</span>}
    </span>
  )
}

/** One-line label: translation (or original) – used in compact lists. */
export function dishLabel(dish: Dish, lang: 'de' | 'en'): string {
  return dish.name[lang] || dish.name.orig
}
