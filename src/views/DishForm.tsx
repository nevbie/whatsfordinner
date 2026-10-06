import { useState } from 'react'
import { Sheet } from '../components/Sheet'
import { INGREDIENTS, ingredientName } from '../data/ingredients'
import { STAPLES, staplesOf } from '../data/classify'
import type { Course, Cuisine, Dish, DishKind, Staple, Tag } from '../data/types'
import { COURSE_LABELS, CUISINE_LABELS, LANG_NAMES, TAG_LABELS, useLang } from '../i18n'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'

const TAGS = Object.keys(TAG_LABELS) as Tag[]
const CHINESE_COURSES: Course[] = ['meat', 'fish', 'tofu', 'egg', 'veg', 'cold', 'soup', 'staple', 'meal']
const INDIAN_COURSES: Course[] = ['curry', 'dal', 'sabzi', 'raita', 'chutney', 'salad', 'side', 'bread', 'rice', 'drink', 'dessert', 'snack', 'meal']

/** Map typed ingredient names back to dictionary keys where possible; keep the rest as free text. */
function parseIngredients(text: string): string[] {
  const lookup = new Map<string, string>()
  for (const [key, [de, en]] of Object.entries(INGREDIENTS)) {
    lookup.set(key, key)
    lookup.set(de.toLowerCase(), key)
    lookup.set(en.toLowerCase(), key)
  }
  return text
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => lookup.get(s.toLowerCase()) ?? s)
}

export function DishForm({ id }: { id?: string }) {
  const { t, lang, pick } = useLang()
  const { dishById, saveDish } = useStore()
  const ui = useUI()
  const existing = id ? dishById.get(id) : undefined

  const [orig, setOrig] = useState(existing?.name.orig ?? '')
  const [origLang, setOrigLang] = useState(existing?.name.lang ?? lang)
  const [roman, setRoman] = useState(existing?.name.roman ?? '')
  const [de, setDe] = useState(existing?.name.de ?? '')
  const [en, setEn] = useState(existing?.name.en ?? '')
  const [cuisine, setCuisine] = useState<Cuisine>(existing?.cuisine ?? 'german')
  const [kind, setKind] = useState<DishKind>(existing?.kind ?? 'dish')
  const [course, setCourse] = useState<Course | ''>(existing?.course ?? '')
  const [tags, setTags] = useState<Tag[]>(existing?.tags ?? [])
  const [effort, setEffort] = useState<1 | 2 | 3>(existing?.effort ?? 2)
  const [staples, setStaples] = useState<Staple[]>(existing ? staplesOf(existing) : [])
  const [ingredients, setIngredients] = useState((existing?.ingredients ?? []).map((i) => ingredientName(i, lang)).join(', '))
  const [note, setNote] = useState(existing?.note?.[lang] ?? '')
  const [error, setError] = useState('')

  const courses = cuisine === 'chinese' ? CHINESE_COURSES : cuisine === 'indian' ? INDIAN_COURSES : []

  const save = () => {
    if (!orig.trim()) return setError(t('form.required'))
    const finalTags = [...tags]
    if (finalTags.includes('vegan') && !finalTags.includes('veggie')) finalTags.push('veggie')
    const dish: Dish = {
      ...existing,
      id: existing?.id ?? `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: { orig: orig.trim(), lang: origLang, roman: roman.trim() || undefined, de: de.trim() || orig.trim(), en: en.trim() || orig.trim() },
      cuisine: kind === 'eatout' ? 'restaurant' : cuisine,
      kind,
      course: courses.includes(course as Course) ? (course as Course) : undefined,
      tags: finalTags,
      effort,
      staples,
      ingredients: parseIngredients(ingredients),
      // the note is entered once; keep the other language's text if it existed
      note: note.trim() ? { de: lang === 'de' ? note.trim() : existing?.note?.de ?? note.trim(), en: lang === 'en' ? note.trim() : existing?.note?.en ?? note.trim() } : undefined,
      custom: true,
    }
    saveDish(dish)
    ui.close()
  }

  return (
    <Sheet
      title={existing ? t('form.titleEdit') : t('form.titleNew')}
      onClose={ui.close}
      footer={
        <div className="row gap end">
          <button className="btn" onClick={ui.close}>
            {t('form.cancel')}
          </button>
          <button className="btn primary" onClick={save}>
            {t('form.save')}
          </button>
        </div>
      }
    >
      <div className="form">
        <label>
          {t('form.orig')} *
          <input value={orig} onChange={(e) => setOrig(e.target.value)} lang={origLang} autoFocus={!existing} />
        </label>
        <div className="row gap">
          <label className="grow">
            {t('form.lang')}
            <select value={origLang} onChange={(e) => setOrigLang(e.target.value)}>
              {Object.entries(LANG_NAMES).map(([code, names]) => (
                <option key={code} value={code}>
                  {pick(names)}
                </option>
              ))}
            </select>
          </label>
          <label className="grow">
            {t('form.roman')}
            <input value={roman} onChange={(e) => setRoman(e.target.value)} />
          </label>
        </div>
        <label>
          {t('form.de')}
          <input value={de} onChange={(e) => setDe(e.target.value)} lang="de" />
        </label>
        <label>
          {t('form.en')}
          <input value={en} onChange={(e) => setEn(e.target.value)} lang="en" />
        </label>
        <div className="row gap">
          <label className="grow">
            {t('form.kind')}
            <select value={kind} onChange={(e) => setKind(e.target.value as DishKind)}>
              {(['dish', 'side', 'eatout'] as const).map((k) => (
                <option key={k} value={k}>
                  {t(`form.kind.${k}`)}
                </option>
              ))}
            </select>
          </label>
          {kind !== 'eatout' && (
            <label className="grow">
              {t('form.cuisine')}
              <select value={cuisine} onChange={(e) => setCuisine(e.target.value as Cuisine)}>
                {(Object.keys(CUISINE_LABELS) as Cuisine[])
                  .filter((c) => c !== 'restaurant')
                  .map((c) => (
                    <option key={c} value={c}>
                      {pick(CUISINE_LABELS[c])}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>
        {courses.length > 0 && kind !== 'eatout' && (
          <label>
            {t('form.course')}
            <select value={course} onChange={(e) => setCourse(e.target.value as Course)}>
              <option value="">{t('form.none')}</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {pick(COURSE_LABELS[c])}
                </option>
              ))}
            </select>
          </label>
        )}
        {kind !== 'eatout' && (
          <>
            <div>
              <div className="label">{t('form.tags')}</div>
              <div className="chips">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`chip ${tags.includes(tag) ? 'on' : ''}`}
                    aria-pressed={tags.includes(tag)}
                    onClick={() => setTags(tags.includes(tag) ? tags.filter((x) => x !== tag) : [...tags, tag])}
                  >
                    {pick(TAG_LABELS[tag])}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">{t('filter.staple')}</div>
              <div className="chips">
                {STAPLES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`chip ${staples.includes(st) ? 'on' : ''}`}
                    aria-pressed={staples.includes(st)}
                    onClick={() => setStaples(staples.includes(st) ? staples.filter((x) => x !== st) : [...staples, st])}
                  >
                    {t(`staple.${st}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">{t('form.effort')}</div>
              <div className="segmented">
                {([1, 2, 3] as const).map((e) => (
                  <button key={e} type="button" className={effort === e ? 'on' : ''} onClick={() => setEffort(e)}>
                    {t(`dish.effort${e}`)}
                  </button>
                ))}
              </div>
            </div>
            <label>
              {t('form.ingredients')}
              <textarea rows={3} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
            </label>
          </>
        )}
        <label>
          {t('form.note')}
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
      </div>
    </Sheet>
  )
}
