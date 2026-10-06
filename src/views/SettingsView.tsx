import { useState } from 'react'
import { Stepper } from '../components/Stepper'
import { useLang } from '../i18n'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

export function SettingsView() {
  const { t, lang, setLang } = useLang()
  const store = useStore()
  const { state, updateSettings, familyCode, syncAvailable, syncError } = store
  const ui = useUI()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

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
        <h2>{t('settings.family')}</h2>
        <Stepper label={t('combo.adults')} value={state.settings.adults} min={1} max={8} onChange={(adults) => updateSettings({ adults })} />
        <Stepper label={t('combo.kids')} value={state.settings.kids} min={0} max={8} onChange={(kids) => updateSettings({ kids })} />
        <p className="small muted">{t('settings.avoidDays')}</p>
        <Stepper label="" value={state.settings.avoidDays} min={0} max={60} onChange={(avoidDays) => updateSettings({ avoidDays })} />
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
