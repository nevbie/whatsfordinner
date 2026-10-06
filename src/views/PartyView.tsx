import { useMemo, useState } from 'react'
import { DishName } from '../components/DishName'
import { formatDay } from '../components/format'
import { Sheet } from '../components/Sheet'
import { Stepper } from '../components/Stepper'
import { TextField } from '../components/TextField'
import { ingredientName } from '../data/ingredients'
import type { Party, PartyCourse, PartyItem, TodoPhase } from '../data/types'
import { PARTY_COURSE_LABELS, PARTY_FORMAT_LABELS, TODO_PHASE_LABELS, useLang } from '../i18n'
import { addDays, todayISO } from '../logic/dates'
import { defaultTodos, guestTotal, PARTY_COURSES, PARTY_FORMATS, partyCoursesOf, partyTemplate, rerollPartyItem, shoppingList, suggestPartyItems, TODO_PHASES, uid } from '../logic/party'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

type Tab = 'menu' | 'guests' | 'shopping' | 'todos'
const TABS: Tab[] = ['menu', 'guests', 'shopping', 'todos']

/** Last day of each to-do phase relative to the party date. */
const PHASE_OFFSET: Record<TodoPhase, number> = { week: -7, daybefore: -1, morning: 0, before: 0 }

export function PartyView({ id }: { id: string }) {
  const { t, lang, pick } = useLang()
  const { state, dishes, saveParty, deleteParty } = useStore()
  const ui = useUI()
  const [tab, setTab] = useState<Tab>('menu')
  const party = state.parties[id]
  const favorites = useMemo(() => new Set(state.favorites), [state.favorites])
  if (!party) return null

  const update = (patch: Partial<Party>) => saveParty({ ...party, ...patch })
  const ctx = { pool: dishes, favorites, today: todayISO(), rng: Math.random }

  return (
    <Sheet
      title={<span>🎉 {party.title}</span>}
      onClose={ui.close}
      footer={
        <div className="segmented tabs-4" role="tablist">
          {TABS.map((x) => (
            <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>
              {t(`party.tab.${x}`)}
            </button>
          ))}
        </div>
      }
    >
      <div className="form party-head">
        <label>
          {t('party.name')}
          <TextField value={party.title} onCommit={(title) => update({ title: title || party.title })} />
        </label>
        <div className="row gap">
          <label className="grow">
            {t('party.date')}
            <input type="date" value={party.date} onChange={(e) => e.target.value && update({ date: e.target.value })} />
          </label>
          <label className="grow">
            {t('party.time')}
            <input type="time" value={party.time ?? ''} onChange={(e) => update({ time: e.target.value || undefined })} />
          </label>
        </div>
        <div className="format-grid" role="group" aria-label={t('party.format')}>
          {PARTY_FORMATS.map((f) => {
            const [icon, de, en] = PARTY_FORMAT_LABELS[f]
            return (
              <button
                key={f}
                className={`chip ${party.format === f ? 'on' : ''}`}
                aria-pressed={party.format === f}
                onClick={() => {
                  if (f === party.format) return
                  // fresh checklist for the new format unless the family already started ticking
                  const todos = party.todos.some((x) => x.done) ? party.todos : defaultTodos({ format: f, kids: party.kids }, lang)
                  update({ format: f, todos })
                }}
              >
                {icon} {pick([de, en])}
              </button>
            )
          })}
        </div>
      </div>

      {tab === 'menu' && <MenuTab party={party} update={update} onSuggest={() => update({ items: suggestPartyItems(party, ctx) })} onReroll={(itemId) => update({ items: rerollPartyItem(party, itemId, ctx) })} />}
      {tab === 'guests' && <GuestsTab party={party} update={update} />}
      {tab === 'shopping' && <ShoppingTab party={party} update={update} />}
      {tab === 'todos' && <TodosTab party={party} update={update} />}

      <section>
        <h3>{t('party.notes')}</h3>
        <TextField multiline value={party.note ?? ''} onCommit={(note) => update({ note: note || undefined })} aria-label={t('party.notes')} />
      </section>
      <button
        className="btn danger wide"
        onClick={() => {
          if (confirm(t('party.deleteConfirm'))) {
            deleteParty(party.id)
            ui.close()
          }
        }}
      >
        {t('party.delete')}
      </button>
    </Sheet>
  )

}

function MenuTab({ party, update, onSuggest, onReroll }: { party: Party; update(p: Partial<Party>): void; onSuggest(): void; onReroll(id: string): void }) {
  const { t, pick } = useLang()
  const { dishById } = useStore()
  const ui = useUI()
  const [extraCourses, setExtraCourses] = useState<PartyCourse[]>([])
  const tpl = partyTemplate(party.format, guestTotal(party))
  const shown = PARTY_COURSES.filter((c) => (tpl[c] ?? 0) > 0 || party.items.some((i) => i.course === c) || extraCourses.includes(c))
  const hidden = PARTY_COURSES.filter((c) => !shown.includes(c))
  const setItem = (itemId: string, patch: Partial<PartyItem>) => update({ items: party.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) })
  const remove = (itemId: string) => update({ items: party.items.filter((i) => i.id !== itemId) })
  const addDish = async (course: PartyCourse) => {
    const dishId = await ui.pickDish(pick(PARTY_COURSE_LABELS[course]), (d) => partyCoursesOf(d).includes(course))
    if (dishId) update({ items: [...party.items, { id: uid(), course, dishId, locked: true }] })
  }
  const addText = (course: PartyCourse, text: string) => text.trim() && update({ items: [...party.items, { id: uid(), course, text: text.trim() }] })

  return (
    <section>
      <button className="btn primary wide" onClick={onSuggest}>
        ✨ {t('party.suggest')}
      </button>
      <p className="muted small">{t('party.suggestHint')}</p>
      {shown.map((course) => (
        <div key={course} className="course-block">
          <h3>{pick(PARTY_COURSE_LABELS[course])}</h3>
          <ul className="plain party-items">
            {party.items
              .filter((i) => i.course === course)
              .map((item) => {
                const dish = item.dishId ? dishById.get(item.dishId) : undefined
                return (
                  <li key={item.id} className="party-item">
                    <div className="row between top">
                      {dish ? (
                        <button className="link-row grow" onClick={() => ui.openDish(dish.id)}>
                          <DishName dish={dish} size="sm" />
                        </button>
                      ) : (
                        <span className="grow dn-orig">{item.text}</span>
                      )}
                      {dish && (
                        <button className="icon-btn small" onClick={() => onReroll(item.id)} aria-label={t('combo.reroll')} title={t('combo.reroll')}>
                          ↻
                        </button>
                      )}
                      <button className="icon-btn small" onClick={() => remove(item.id)} aria-label={t('combo.remove')}>
                        ✕
                      </button>
                    </div>
                    <select className="who" value={item.broughtBy ?? ''} onChange={(e) => setItem(item.id, { broughtBy: e.target.value || undefined })} aria-label={t('party.who')}>
                      <option value="">🏠 {t('party.us')}</option>
                      {party.guests.map((g) => (
                        <option key={g.id} value={g.id}>
                          🎁 {g.name}
                        </option>
                      ))}
                    </select>
                  </li>
                )
              })}
          </ul>
          <div className="row gap">
            <button className="chip" onClick={() => addDish(course)}>
              ＋ {t('party.addDish')}
            </button>
            <TextField className="grow small-input" value="" placeholder={t('party.addText')} onCommit={(v) => addText(course, v)} />
          </div>
        </div>
      ))}
      {hidden.length > 0 && (
        <select className="chip select add-course" value="" onChange={(e) => e.target.value && setExtraCourses([...extraCourses, e.target.value as PartyCourse])}>
          <option value="">＋ {t('party.addCourse')}</option>
          {hidden.map((c) => (
            <option key={c} value={c}>
              {pick(PARTY_COURSE_LABELS[c])}
            </option>
          ))}
        </select>
      )}
    </section>
  )
}

function GuestsTab({ party, update }: { party: Party; update(p: Partial<Party>): void }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const total = guestTotal(party)
  const addGuest = () => {
    if (!name.trim()) return
    update({ guests: [...party.guests, { id: uid(), name: name.trim(), note: note.trim() || undefined }] })
    setName('')
    setNote('')
  }
  return (
    <section className="form">
      <Stepper label={t('party.adults')} value={party.adults} min={1} max={60} onChange={(adults) => update({ adults })} />
      <Stepper label={t('party.kids')} value={party.kids} min={0} max={40} onChange={(kids) => update({ kids })} />
      <Stepper label={`🥕 ${t('party.veggie')}`} value={party.veggie} min={0} max={total - party.vegan} onChange={(veggie) => update({ veggie })} />
      <Stepper label={`🌱 ${t('party.vegan')}`} value={party.vegan} min={0} max={total - party.veggie} onChange={(vegan) => update({ vegan })} />
      <label>
        {t('party.allergies')}
        <TextField multiline value={party.allergies ?? ''} onCommit={(allergies) => update({ allergies: allergies || undefined })} />
      </label>
      <div>
        <div className="label">{t('party.guestList')}</div>
        <ul className="plain">
          {party.guests.map((g) => (
            <li key={g.id} className="row between guest-row">
              <span>
                <strong>{g.name}</strong>
                {g.note && <span className="muted small"> · {g.note}</span>}
                {party.items.some((i) => i.broughtBy === g.id) && <span className="muted small"> · 🎁 {party.items.filter((i) => i.broughtBy === g.id).length}</span>}
              </span>
              <button
                className="icon-btn small"
                onClick={() => update({ guests: party.guests.filter((x) => x.id !== g.id), items: party.items.map((i) => (i.broughtBy === g.id ? { ...i, broughtBy: undefined } : i)) })}
                aria-label={t('combo.remove')}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="row gap wrap">
          <input className="grow" placeholder={t('party.guestName')} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGuest()} />
          <input className="grow" placeholder={t('party.guestNote')} value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGuest()} />
          <button className="btn" onClick={addGuest} disabled={!name.trim()}>
            {t('party.add')}
          </button>
        </div>
      </div>
    </section>
  )
}

function ShoppingTab({ party, update }: { party: Party; update(p: Partial<Party>): void }) {
  const { t, lang } = useLang()
  const { dishById } = useStore()
  const entries = shoppingList(party, dishById).sort((a, b) => Number(!!party.shopping[a.key]) - Number(!!party.shopping[b.key]) || ingredientName(a.key, lang).localeCompare(ingredientName(b.key, lang), lang))
  const toggle = (key: string) => update({ shopping: { ...party.shopping, [key]: !party.shopping[key] } })
  const dishLabel = (dishId: string) => {
    const d = dishById.get(dishId)
    return d ? d.name[lang] || d.name.orig : dishId
  }
  return (
    <section>
      <p className="muted small">{t('party.shoppingHint')}</p>
      {entries.length === 0 && party.extraShopping.length === 0 && <p className="muted">{t('party.shoppingEmpty')}</p>}
      <ul className="plain shopping">
        {entries.map((e) => (
          <li key={e.key}>
            <label className={`check ${party.shopping[e.key] ? 'ticked' : ''}`}>
              <input type="checkbox" checked={!!party.shopping[e.key]} onChange={() => toggle(e.key)} />
              <span>
                {ingredientName(e.key, lang)}
                <span className="muted small"> · {[...new Set(e.dishIds)].map(dishLabel).join(', ')}</span>
              </span>
            </label>
          </li>
        ))}
        {party.extraShopping.map((text) => (
          <li key={`x-${text}`} className="row between">
            <label className={`check ${party.shopping[`x:${text}`] ? 'ticked' : ''}`}>
              <input type="checkbox" checked={!!party.shopping[`x:${text}`]} onChange={() => toggle(`x:${text}`)} />
              <span>{text}</span>
            </label>
            <button className="icon-btn small" onClick={() => update({ extraShopping: party.extraShopping.filter((x) => x !== text) })} aria-label={t('combo.remove')}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <TextField value="" placeholder={`＋ ${t('party.extraItem')}`} onCommit={(v) => v.trim() && !party.extraShopping.includes(v.trim()) && update({ extraShopping: [...party.extraShopping, v.trim()] })} />
      {Object.values(party.shopping).some(Boolean) && (
        <button className="btn wide" onClick={() => update({ shopping: {} })}>
          {t('party.resetChecks')}
        </button>
      )}
    </section>
  )
}

function TodosTab({ party, update }: { party: Party; update(p: Partial<Party>): void }) {
  const { t, lang, pick } = useLang()
  const [phase, setPhase] = useState<TodoPhase>('daybefore')
  const setDone = (todoId: string, done: boolean) => update({ todos: party.todos.map((x) => (x.id === todoId ? { ...x, done } : x)) })
  return (
    <section>
      {TODO_PHASES.map((ph) => {
        const list = party.todos.filter((x) => x.phase === ph)
        if (!list.length) return null
        return (
          <div key={ph}>
            <h3>
              {pick(TODO_PHASE_LABELS[ph])}
              <span className="muted small"> · {formatDay(addDays(party.date, PHASE_OFFSET[ph]), lang)}</span>
            </h3>
            <ul className="plain">
              {list.map((x) => (
                <li key={x.id} className="row between">
                  <label className={`check ${x.done ? 'ticked' : ''}`}>
                    <input type="checkbox" checked={!!x.done} onChange={(e) => setDone(x.id, e.target.checked)} />
                    <span>{x.text}</span>
                  </label>
                  <button className="icon-btn small" onClick={() => update({ todos: party.todos.filter((y) => y.id !== x.id) })} aria-label={t('combo.remove')}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <div className="row gap wrap todo-add">
        <select value={phase} onChange={(e) => setPhase(e.target.value as TodoPhase)} aria-label={t('weekday')}>
          {TODO_PHASES.map((ph) => (
            <option key={ph} value={ph}>
              {pick(TODO_PHASE_LABELS[ph])}
            </option>
          ))}
        </select>
        <TextField className="grow" value="" placeholder={`＋ ${t('party.todoAdd')}`} onCommit={(v) => v.trim() && update({ todos: [...party.todos, { id: uid(), phase, text: v.trim() }] })} />
      </div>
      {party.todos.length === 0 && (
        <button className="btn wide" onClick={() => update({ todos: defaultTodos(party, lang) })}>
          {t('party.todoDefaults')}
        </button>
      )}
    </section>
  )
}
