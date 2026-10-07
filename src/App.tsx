import { useEffect, useState } from 'react'
import { useLang, type I18nKey } from './i18n'
import { useStore } from './store/StoreContext'
import { useUI } from './ui'
import { ComboBuilder } from './views/ComboBuilder'
import { DishDetail } from './views/DishDetail'
import { DishesView } from './views/DishesView'
import { DishForm } from './views/DishForm'
import { HistoryView } from './views/HistoryView'
import { DayPicker, DishPicker } from './views/Pickers'
import { PartyListView } from './views/PartyListView'
import { PartyView } from './views/PartyView'
import { PlanView } from './views/PlanView'
import { SettingsView } from './views/SettingsView'
import { SuggestView } from './views/SuggestView'

const TABS = [
  { id: 'suggest', icon: '🎲', label: 'nav.suggest' },
  { id: 'plan', icon: '📅', label: 'nav.plan' },
  { id: 'dishes', icon: '📖', label: 'nav.dishes' },
  { id: 'party', icon: '🎉', label: 'nav.party' },
  { id: 'history', icon: '🕘', label: 'nav.history' },
  { id: 'settings', icon: '⚙︎', label: 'nav.settingsShort' },
] as const satisfies readonly { id: string; icon: string; label: I18nKey }[]

type TabId = (typeof TABS)[number]['id']

function tabFromHash(): TabId {
  const h = location.hash.replace('#/', '')
  return (TABS.find((t) => t.id === h)?.id ?? 'suggest') as TabId
}

export function App() {
  const { t } = useLang()
  const ui = useUI()
  const store = useStore()
  const [tab, setTab] = useState<TabId>(tabFromHash)

  useEffect(() => {
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Invite link: ?join=CODE
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('join')
    if (!code || !store.syncAvailable) return
    history.replaceState(null, '', location.pathname + location.hash)
    if (store.familyCode !== code && confirm(t('settings.joinPrompt', { code }))) {
      store.joinFamily(code).then((ok) => !ok && alert(t('settings.joinFail')))
    }
    // run once on start
  }, [])

  const go = (id: TabId) => {
    location.hash = `#/${id}`
    setTab(id)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <main>
        {tab === 'suggest' && <SuggestView />}
        {tab === 'plan' && <PlanView />}
        {tab === 'dishes' && <DishesView />}
        {tab === 'party' && <PartyListView />}
        {tab === 'history' && <HistoryView />}
        {tab === 'settings' && <SettingsView />}
      </main>
      <nav className="tabbar">
        {TABS.map((x) => (
          <button key={x.id} className={tab === x.id ? 'on' : ''} onClick={() => go(x.id)} aria-current={tab === x.id ? 'page' : undefined}>
            <span className="tab-icon" aria-hidden>
              {x.icon}
            </span>
            <span className="tab-label">{t(x.label)}</span>
          </button>
        ))}
      </nav>
      {ui.overlays.map((o, i) => {
        switch (o.type) {
          case 'dish':
            return <DishDetail key={i} id={o.id} />
          case 'combo':
            return <ComboBuilder key={i} combo={o.combo} seedId={o.seedId} date={o.date} meal={o.meal} />
          case 'form':
            return <DishForm key={i} id={o.id} kind={o.kind} />
          case 'party':
            return <PartyView key={i} id={o.id} />
          case 'pickDish':
            return <DishPicker key={i} title={o.title} filter={o.filter} />
          case 'pickDay':
            return <DayPicker key={i} />
        }
      })}
    </div>
  )
}
