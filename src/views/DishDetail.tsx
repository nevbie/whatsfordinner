import { comboIcon, DishMeta, FavButton } from '../components/DishMeta'
import { DishName } from '../components/DishName'
import { Sheet } from '../components/Sheet'
import { useDishStats } from '../components/useDishStats'
import { regionOf, staplesOf } from '../data/classify'
import { builtinDishes } from '../data/dishes'
import { ingredientName } from '../data/ingredients'
import { COURSE_LABELS, TAG_LABELS, useLang } from '../i18n'
import { todayISO } from '../logic/dates'
import { useStore } from '../store/StoreContext'
import { useUI } from '../ui'
import { comboTypeOf } from './SuggestView'

const builtinIds = new Set(builtinDishes.map((d) => d.id))
const isBuiltin = (id: string) => builtinIds.has(id)

export function DishDetail({ id }: { id: string }) {
  const { t, lang, pick } = useLang()
  const { dishById, dishes, setDay, deleteDish, state, toggleFavorite, toggleLabelFavorite } = useStore()
  const ui = useUI()
  const { counts } = useDishStats()
  const dish = dishById.get(id)
  if (!dish) return null
  const combo = comboTypeOf(dish)
  const r = dish.recipe
  const times = counts.get(dish.id) ?? 0

  const planFor = async () => {
    const date = await ui.pickDay()
    if (date) setDay(date, { dishes: [dish.id] })
  }

  return (
    <Sheet title={<DishName dish={dish} size="lg" />} onClose={ui.close}>
      <div className="row between">
        <DishMeta dish={dish} />
        {dish.kind !== 'combo' && <FavButton dish={dish} />}
      </div>
      <div className="chips static">
        {regionOf(dish) && <span className="chip">{t(`region.${regionOf(dish)!}`)}</span>}
        {staplesOf(dish).map((st) => (
          <span key={st} className="chip">
            {t(`staple.${st}`)}
          </span>
        ))}
        {dish.course && <span className="chip">{pick(COURSE_LABELS[dish.course])}</span>}
        {dish.tags.map((tag) => (
          <span key={tag} className="chip">
            {pick(TAG_LABELS[tag])}
          </span>
        ))}
        {state.customDishes[dish.id] && <span className="chip">{t(isBuiltin(dish.id) ? 'dish.edited' : 'dish.custom')}</span>}
        {times > 0 && <span className="chip">{t('dish.timesEaten', { n: times })}</span>}
      </div>

      {dish.kind !== 'combo' && (
        <section className="loved-by">
          <div className="label">{t('dish.lovedBy')}</div>
          <div className="chips">
            <button className={`chip ${state.favorites.includes(dish.id) ? 'on' : ''}`} aria-pressed={state.favorites.includes(dish.id)} onClick={() => toggleFavorite(dish.id)}>
              ♥ {t('dish.family')}
            </button>
            {state.labels.map((l) => {
              const on = (state.labelFavorites[l.id] ?? []).includes(dish.id)
              return (
                <button key={l.id} className={`chip lbl-chip lbl-${l.color % 8} ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleLabelFavorite(l.id, dish.id)}>
                  ★ {l.name}
                </button>
              )
            })}
          </div>
          {state.labels.length === 0 && <p className="muted small">{t('labels.none')}</p>}
        </section>
      )}

      {dish.group && (
        <section>
          <div className="label">{t('dish.variants')}</div>
          <div className="chips">
            {dishes
              .filter((v) => v.group === dish.group && v.id !== dish.id)
              .map((v) => (
                <button key={v.id} className="chip" onClick={() => ui.openDish(v.id)}>
                  {v.name[lang] || v.name.orig}
                </button>
              ))}
          </div>
        </section>
      )}

      <div className="actions">
        {dish.kind !== 'combo' && (
          <>
            <button className="btn primary" onClick={() => setDay(todayISO(), { dishes: [dish.id] })}>
              {t('suggest.takeToday')}
            </button>
            <button className="btn" onClick={planFor}>
              {t('dish.planFor')}
            </button>
          </>
        )}
        {combo && (
          <button className={`btn ${dish.kind === 'combo' ? 'primary' : ''}`} onClick={() => ui.openCombo(combo, dish.kind === 'combo' ? undefined : dish.id)}>
            {comboIcon(combo)} {t('suggest.buildMeal')}
          </button>
        )}
      </div>

      {dish.note && <p>{dish.note[lang]}</p>}

      {dish.kind !== 'combo' && dish.kind !== 'eatout' && (
        <section>
          <h3>{t('dish.ingredients')}</h3>
          {dish.ingredients.length ? (
            <div className="chips static">
              {dish.ingredients.map((i) => (
                <span key={i} className="chip ing">
                  {ingredientName(i, lang)}
                </span>
              ))}
            </div>
          ) : (
            <p className="muted small">{t('dish.noIngredients')}</p>
          )}
        </section>
      )}

      {dish.pairsWith && (
        <section>
          <h3>{t('dish.pairs')}</h3>
          <ul className="plain">
            {dish.pairsWith.map((pid) => {
              const p = dishById.get(pid)
              return p ? (
                <li key={pid}>
                  <button className="link-row" onClick={() => ui.openDish(pid)}>
                    <DishName dish={p} size="sm" />
                  </button>
                </li>
              ) : null
            })}
          </ul>
        </section>
      )}

      {r && (
        <section className="recipe">
          <h3>{t('dish.recipe')}</h3>
          <p className="muted small">
            {r.serves[lang]} · {r.time[lang]}
          </p>
          <ul className="ing-list">
            {r.ingredients[lang].map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <h4>{t('dish.steps')}</h4>
          <ol className="steps">
            {r.steps[lang].map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
          {r.vegan && (
            <p className="callout">
              <strong>🌱 {t('dish.vegan')}:</strong> {r.vegan[lang]}
            </p>
          )}
          {r.tip && (
            <p className="callout">
              <strong>💡 {t('dish.tip')}:</strong> {r.tip[lang]}
            </p>
          )}
          {r.kids && (
            <p className="callout">
              <strong>🧒 {t('dish.kids')}:</strong> {r.kids[lang]}
            </p>
          )}
          {r.source && (
            <p className="muted small">
              {t('dish.source')}: {r.source}
            </p>
          )}
        </section>
      )}

      {dish.kind !== 'combo' && (
        <div className="actions">
          <button className="btn" onClick={() => ui.openForm(dish.id)}>
            {t('dish.edit')}
          </button>
          {state.customDishes[dish.id] && (
            <button
              className="btn danger"
              onClick={() => {
                // an edited built-in dish falls back to the original; an own dish is gone
                if (confirm(t(isBuiltin(dish.id) ? 'dish.resetConfirm' : 'dish.deleteConfirm'))) {
                  deleteDish(dish.id)
                  if (!isBuiltin(dish.id)) ui.close()
                }
              }}
            >
              {t(isBuiltin(dish.id) ? 'dish.reset' : 'dish.delete')}
            </button>
          )}
        </div>
      )}
    </Sheet>
  )
}
