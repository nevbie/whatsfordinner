import { loadDensity, saveDensity, type Density } from '../display'
import { dishLabel } from '../components/DishName'
import { useState } from 'react'
import { Stepper } from '../components/Stepper'
import { TextField } from '../components/TextField'
import { useLang } from '../i18n'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

export function SettingsView() {
  const { t, lang, setLang } = useLang()
  const [density, setDensity] = useState<Density>(loadDensity)
  const store = useStore()
  const { state, updateSettings, familyCode, syncAvailable, syncError } = store
  const ui = useUI()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [labelName, setLabelName] = useState('')
  const addLabel = () => {
    if (!labelName.trim()) return
    store.addLabel(labelName.trim())
    setLabelName('')
  }

  const shareLink = familyCode ? `${location.origin}${location.pathname}?join=${familyCode}` : ''

  const act = async (fn: () => Promise<void>) => {
    setBusy(true)
    setMsg(null)
    try {
      await fn()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: t('appTitle'), text: familyCode ?? '', url: shareLink }).catch(() => {})
    } else {
      await navigator.clipboard?.writeText(shareLink)
      setMsg(t('settings.copied'))
    }
  }

  return (
    <div className="view">
      <h1>{t('nav.settings')}</h1>

      <section className="card">
        <h2>{t('settings.language')}</h2>
        <div className="segmented">
          <button className={lang === 'de' ? 'on' : ''} onClick={() => setLang('de')}>
            Deutsch
          </button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            English
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{t('settings.display')}</h2>
        <div className="segmented">
          {(['auto', 'compact', 'normal'] as const).map((d) => (
            <button
              key={d}
              className={density === d ? 'on' : ''}
              aria-pressed={density === d}
              onClick={() => {
                setDensity(d)
                saveDensity(d)
              }}
            >
              {t(`settings.display.${d}`)}
            </button>
          ))}
        </div>
        <p className="small muted">{t('settings.displayHint')}</p>
      </section>

      <section className="card">
        <h2>{t('settings.family')}</h2>
        <Stepper label={t('combo.adults')} value={state.settings.adults} min={1} max={8} onChange={(adults) => updateSettings({ adults })} />
        <Stepper label={t('combo.kids')} value={state.settings.kids} min={0} max={8} onChange={(kids) => updateSettings({ kids })} />
        <p className="small muted">{t('settings.avoidDays')}</p>
        <Stepper label="" value={state.settings.avoidDays} min={0} max={60} onChange={(avoidDays) => updateSettings({ avoidDays })} />
      </section>

      <section className="card">
        <h2>{t('labels.title')}</h2>
        <p className="small muted">{t('labels.hint')}</p>
        <ul className="plain label-list">
          {store.state.labels.map((l) => (
            <li key={l.id} className="row gap">
              <span className={`fan-tag lbl-${l.color % 8}`}>★</span>
              <TextField className="grow" value={l.name} onCommit={(name) => name.trim() && store.renameLabel(l.id, name.trim())} aria-label={t('party.guestName')} />
              <button
                className="icon-btn small"
                onClick={() => confirm(t('labels.deleteConfirm', { name: l.name })) && store.deleteLabel(l.id)}
                aria-label={t('combo.remove')}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="row gap">
          <input className="grow" placeholder={t('labels.placeholder')} value={labelName} onChange={(e) => setLabelName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLabel()} />
          <button className="btn" onClick={addLabel} disabled={!labelName.trim()}>
            {t('party.add')}
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{t('settings.hidden')}</h2>
        {store.state.hiddenDishes.length === 0 ? (
          <p className="small muted">{t('settings.hiddenNone')}</p>
        ) : (
          <ul className="plain">
            {store.state.hiddenDishes.map((id) => (
              <li key={id} className="row between">
                <span>{store.dishById.get(id) ? dishLabel(store.dishById.get(id)!, lang) : id}</span>
                <button className="btn sm" onClick={() => store.setHidden(id, false)}>
                  {t('settings.restore')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>{t('settings.sync')}</h2>
        {!syncAvailable ? (
          <p className="small muted">{t('settings.syncNotConfigured')}</p>
        ) : familyCode ? (
          <>
            <p>
              {t('settings.syncOn')}: <strong className="code">{familyCode}</strong>
            </p>
            <div className="row gap wrap">
              <button className="btn" onClick={share}>
                {t('settings.share')}
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  if (confirm(t('settings.leaveConfirm'))) store.leaveFamily()
                }}
              >
                {t('settings.leave')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="small muted">{t('settings.syncOff')}</p>
            <button className="btn primary" disabled={busy} onClick={() => act(async () => void (await store.createFamily()))}>
              {t('settings.create')}
            </button>
            <p className="small muted">{t('settings.createHint')}</p>
            <div className="row gap">
              <input className="grow" placeholder={t('settings.joinPlaceholder')} value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" />
              <button
                className="btn"
                disabled={busy || code.trim().length < 12}
                onClick={() =>
                  act(async () => {
                    if (!(await store.joinFamily(code))) setMsg(t('settings.joinFail'))
                  })
                }
              >
                {t('settings.join')}
              </button>
            </div>
          </>
        )}
        {msg && <p className="small">{msg}</p>}
        {syncError && (
          <p className="small error">
            {t('settings.error')}: {syncError}
          </p>
        )}
      </section>

      <section className="card">
        <button className="btn" onClick={() => ui.openForm()}>
          ＋ {t('dishes.add')}
        </button>
      </section>

      <section className="card">
        <h2>{t('settings.about')}</h2>
        <p className="small muted">{t('settings.aboutText')}</p>
      </section>
    </div>
  )
}
