import type { Lang } from '../data/types'
import { fromISO } from '../logic/dates'

export function formatDay(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'numeric' }): string {
  return new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', opts).format(fromISO(iso))
}
