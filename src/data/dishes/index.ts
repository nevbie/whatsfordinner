import type { Dish } from '../types'
import { chineseDishes } from './chinese'
import { familyDishes } from './family'
import { indianDishes } from './indian'
import { moreDishes } from './more'
import { partyDishes } from './party'
import { restaurants } from './restaurants'
import { tapasDishes } from './tapas'

export const builtinDishes: Dish[] = [...familyDishes, ...moreDishes, ...chineseDishes, ...indianDishes, ...tapasDishes, ...partyDishes, ...restaurants]
