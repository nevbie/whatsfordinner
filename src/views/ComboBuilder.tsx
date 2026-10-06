import { useMemo, useState } from 'react'
import { DishName } from '../components/DishName'
import { formatDay } from '../components/format'
import { Sheet } from '../components/Sheet'
import { Stepper } from '../components/Stepper'
import type { ComboType, Course } from '../data/types'
import { useLang, type I18nKey } from '../i18n'
import { fillEntries, initialEntries, pickForSlot, rerollEntry, slotCandidates, type ComboEntry, type ComboOptions } from '../logic/combos'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

const ALL_COURSES: Record<ComboType, Course[]> = {
  chinese: ['meat', 'fish', 'tofu', 'egg', 'veg', 'cold', 'soup', 'staple', 'meal'],
  indian: ['curry', 'dal', 'sabzi', 'raita', 'chutney', 'salad', 'side', 'bread', 'rice', 'drink', 'dessert', 'snack', 'meal'],
}

const SLOT_KEYS = new Set(['main', 'main2', 'veg', 'veg2', 'soup', 'cold', 'staple', 'meal', 'side', 'dal', 'curry', 'curry2', 'sabzi', 'raita', 'bread', 'rice', 'drink', 'dessert'])

export function ComboBuilder({ combo, seedId, date }: { combo: ComboType; seedId?: string; date?: string }) {
  const { t, lang } = useLang()
  const { state, dishes, dishById, setDay } = useStore()
  const ui = useUI()
  const seed = seedId ? dishById.get(seedId) : undefined
  const favorites = useMemo(() => new Set(state.favorites), [state.favorites])

  const [options, setOptions] = useState<ComboOptions>({
    type: combo,
    adults: state.settings.adults,
    kids: state.settings.kids,
    diet: 'any',
    noSpicy: false,
    drink: false,
    dessert: false,
  })
  const ctx = (o: ComboOptions) => ({ options: o, favorites, prefer: new Set(seed?.pairsWith ?? []) })
  const build = (o: ComboOptions) => fillEntries(initialEntries(o, seed), dishes, ctx(o))
  const [entries, setEntries] = useState<ComboEntry[]>(() => {
    // re-open a day that already holds a combo of this cuisine: start from what is planned
    const planned = date ? state.plan[date]?.dishes.map((id) => dishById.get(id)).filter((d) => d && d.cuisine === combo && d.course) : undefined
    if (planned?.length && !seed) return planned.map((d) => ({ slot: { key: 'extra', roles: [d!.course!] }, dishId: d!.id, locked: true }))
    return build(options)
  })

  const change = (patch: Partial<ComboOptions>) => {
    const o = { ...options, ...patch }
    setOptions(o)
    // keep what the family locked, rebuild the rest for the new settings
    const locked = entries.filter((e) => e.locked && e.dishId)
    const fresh = initialEntries(o, seed)
    for (const l of locked) {
      const i = fresh.findIndex((f) => !f.dishId && l.slot.roles.some((r) => f.slot.roles.includes(r)))
      if (i >= 0) fresh[i] = { ...fresh[i], dishId: l.dishId, locked: true }
    }
    setEntries(fillEntries(fresh, dishes, ctx(o)))
  }

  const update = (i: number, patch: Partial<ComboEntry>) => setEntries(entries.map((e, j) => (j === i ? { ...e, ...patch } : e)))

  const choose = async (i: number) => {
    const slot = entries[i].slot
    const allowed = new Set(slotCandidates(slot, dishes, { ...options, diet: 'any', noSpicy: false }).map((d) => d.id))
    const id = await ui.pickDish(t('combo.pick'), (d) => allowed.has(d.id))
    if (id) update(i, { dishId: id, locked: true })
  }

  const addSlot = () => {
    const slot = { key: 'extra', roles: ALL_COURSES[combo] }
    const chosen = entries.map((e) => (e.dishId ? dishById.get(e.dishId) : undefined)).filter((d) => d !== undefined)
    const dish = pickForSlot(slot, chosen, dishes, ctx(options), Math.random)
    setEntries([...entries, { slot, dishId: dish?.id, locked: false }])
  }

  const plan = async () => {
    const target = date ?? (await ui.pickDay())
    if (!target) return
    const ids = entries.map((e) => e.dishId).filter((x): x is string => !!x)
    setDay(target, { dishes: ids })
    ui.close()
  }

  const slotLabel = (key: string) => t(`slot.${SLOT_KEYS.has(key) ? key : 'extra'}` as I18nKey)

  return (
    <Sheet
      title={
        <span className="combo-title">
          {combo === 'chinese' ? '🥢 ' : '🍛 '}
          {t(combo === 'chinese' ? 'combo.chinese' : 'combo.indian')}
          {date && <span className="muted small"> · {formatDay(date, lang)}</span>}
        </span>
      }
      onClose={ui.close}
      footer={
        <div className="row gap end">
          <button className="btn" onClick={() => setEntries(fillEntries(entries, dishes, ctx(options)))}>
            🎲 {t('combo.shuffle')}
          </button>
          <button className="btn primary" onClick={plan}>
            {date ? t('combo.plan') : t('suggest.plan')}
          </button>
        </div>
      }
    >
      <p className="muted small">{t(combo === 'chinese' ? 'combo.introChinese' : 'combo.introIndian')}</p>
      <div className="combo-options">
        <Stepper label={t('combo.adults')} value={options.adults} min={1} max={8} onChange={(adults) => change({ adults })} />
        <Stepper label={t('combo.kids')} value={options.kids} min={0} max={8} onChange={(kids) => change({ kids })} />
        <div className="segmented small">
          {(['any', 'veggie', 'vegan'] as const).map((d) => (
            <button key={d} className={options.diet === d ? 'on' : ''} onClick={() => change({ diet: d })}>
              {t(`filter.diet.${d}`)}
            </button>
          ))}
        </div>
        <div className="chips">
          <button className={`chip ${options.noSpicy ? 'on' : ''}`} onClick={() => change({ noSpicy: !options.noSpicy })}>
            {t('filter.noSpicy')}
          </button>
          {combo === 'indian' && (
            <>
              <button className={`chip ${options.drink ? 'on' : ''}`} onClick={() => change({ drink: !options.drink })}>
                🥭 {t('combo.drink')}
              </button>
              <button className={`chip ${options.dessert ? 'on' : ''}`} onClick={() => change({ dessert: !options.dessert })}>
                🍮 {t('combo.dessert')}
              </button>
            </>
          )}
        </div>
      </div>

      <ul className="combo-list">
        {entries.map((e, i) => {
          const d = e.dishId ? dishById.get(e.dishId) : undefined
          return (
            <li key={i} className={`combo-row ${e.locked ? 'locked' : ''}`}>
              <div className="slot-label">{slotLabel(e.slot.key)}</div>
              <div className="row between top">
                {d ? (
                  <button className="link-row grow" onClick={() => ui.openDish(d.id)}>
                    <DishName dish={d} size="md" />
                    {d.tags.includes('spicy') && <span> 🌶</span>}
                  </button>
                ) : (
                  <span className="muted grow">{t('combo.noMatch')}</span>
                )}
                <div className="combo-actions">
                  <button className="icon-btn" onClick={() => setEntries(rerollEntry(entries, i, dishes, ctx(options)))} aria-label={t('combo.reroll')} title={t('combo.reroll')}>
                    ↻
                  </button>
                  <button className={`icon-btn ${e.locked ? 'on' : ''}`} onClick={() => update(i, { locked: !e.locked })} aria-pressed={e.locked} aria-label={e.locked ? t('combo.unlock') : t('combo.lock')} title={e.locked ? t('combo.unlock') : t('combo.lock')}>
                    {e.locked ? '🔒' : '🔓'}
                  </button>
                  <button className="icon-btn" onClick={() => choose(i)} aria-label={t('combo.pick')} title={t('combo.pick')}>
                    ☰
                  </button>
                  <button className="icon-btn" onClick={() => setEntries(entries.filter((_, j) => j !== i))} aria-label={t('combo.remove')} title={t('combo.remove')}>
                    ✕
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <button className="btn wide" onClick={addSlot}>
        ＋ {t('combo.addSlot')}
      </button>
    </Sheet>
  )
}
