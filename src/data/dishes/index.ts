import type { Dish } from '../types'
import { chineseDishes } from './chinese'
import { familyDishes } from './family'
import { indianDishes } from './indian'
import { moreDishes } from './more'
import { restaurants } from './restaurants'

export const builtinDishes: Dish[] = [...familyDishes, ...moreDishes, ...chineseDishes, ...indianDishes, ...restaurants]
