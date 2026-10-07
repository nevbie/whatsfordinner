import type { Dish } from '../types'
import { d } from './define'

/** Eating out / takeaway. Ids of the first paper-list entries are kept so the history still matches. */
const r = (id: string, name: string, extra: { takeaway?: boolean; url?: string; note?: [string, string]; en?: string } = {}): Dish => ({
  ...d({ id, o: name, en: extra.en ?? name, c: 'restaurant', k: 'eatout', e: 1, i: '', n: extra.note }),
  takeaway: extra.takeaway,
  url: extra.url,
})

export const restaurants: Dish[] = [
  // restaurants
  r('r-fuenf', 'fuenf', { url: 'https://fuenf.de/' }),
  r('r-lemoni', 'Lemoni'),
  r('r-millestelle', 'Mille Stelle'),
  r('r-luvino', 'Luvino'),
  r('r-chang-tong', 'Chang Tong'),
  r('r-hermes', 'Hermes'),
  r('r-mariannes-flammkuchen', 'Marianne’s Flammkuchen', { note: ['Flammkuchen', 'Tarte flambée'] }),
  r('r-ambe', 'Ambe – Georgisches Restaurant', { en: 'Ambe – Georgian restaurant', note: ['Georgische Küche: Khachapuri, Khinkali …', 'Georgian food: khachapuri, khinkali …'] }),
  r('r-indisch', 'Indisches Restaurant', { en: 'Indian restaurant' }),
  r('r-olivenbaum', 'Olivenbaum'),
  r('r-thai', 'Thai-Restaurant', { en: 'Thai restaurant' }),
  // takeaway
  r('r-aroy-aroy', 'Aroy Aroy', { takeaway: true, note: ['Thailändisch', 'Thai'] }),
  r('r-yous-pizza', 'You’s Pizza', { takeaway: true, note: ['Pizza', 'Pizza'] }),
  r('r-pizza-doener', 'Pizza Döner Neureut', { takeaway: true, note: ['Pizza & Döner', 'Pizza & kebab'] }),
  r('r-thasy-tamil', 'Thasy Tamil', { takeaway: true, note: ['Tamilische Küche', 'Tamil food'] }),
  r('r-asia-lidl', 'Asia-Take-away (Lidl)', { en: 'Asian takeaway (Lidl)', takeaway: true }),
]
