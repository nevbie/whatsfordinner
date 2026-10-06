import { formatDay } from '../components/format'
import type { Party } from '../data/types'
import { PARTY_FORMAT_LABELS, useLang } from '../i18n'
import { addDays, fromISO, todayISO } from '../logic/dates'
import { guestTotal, newParty } from '../logic/party'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

/** Next Saturday (or today if it is Saturday) – a sensible default date for a party. */
function nextSaturday(today: string): string {
  const offset = (6 - fromISO(today).getDay() + 7) % 7
  return addDays(today, offset)
}

export function PartyListView() {
  const { t, lang, pick } = useLang()
  const { state, saveParty } = useStore()
  const ui = useUI()
  const today = todayISO()
  const parties = Object.values(state.parties).sort((a, b) => a.date.localeCompare(b.date))
  const upcoming = parties.filter((p) => p.date >= today)
  const past = parties.filter((p) => p.date < today).reverse()

  const create = () => {
    const party = newParty(nextSaturday(today), state.settings, lang)
    saveParty(party)
    ui.openParty(party.id)
  }

  const card = (p: Party) => {
    const [icon, de, en] = PARTY_FORMAT_LABELS[p.format]
    const done = p.todos.filter((x) => x.done).length
    return (
      <li key={p.id} className="list-row" onClick={() => ui.openParty(p.id)}>
        <span className="party-icon" aria-hidden>
          {icon}
        </span>
        <div className="grow">
          <div className="dn-orig">{p.title}</div>
          <div className="meta">
            {formatDay(p.date, lang, { weekday: 'short', day: 'numeric', month: 'short' })}
            {p.time ? ` · ${p.time}` : ''} · {pick([de, en])} · {t('party.guestsCount', { n: guestTotal(p) })}
            {p.todos.length > 0 && ` · ${t('party.todosCount', { done, all: p.todos.length })}`}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="view">
      <h1>{t('party.title')}</h1>
      <button className="btn primary wide" onClick={create}>
        🎉 {t('party.new')}
      </button>
      <h2>{t('party.upcoming')}</h2>
      {upcoming.length ? <ul className="list">{upcoming.map(card)}</ul> : <p className="muted">{t('party.empty')}</p>}
      {past.length > 0 && (
        <details className="past">
          <summary>
            <h2>{t('party.past')}</h2>
          </summary>
          <ul className="list">{past.map(card)}</ul>
        </details>
      )}
    </div>
  )
}
