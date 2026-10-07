import type { Dish } from '../types'
import { d } from './define'

/** Eating out / takeaway – Neureut, Eggenstein-Leopoldshafen and around. Old ids are kept so the history still matches. */
interface Info {
  takeaway?: boolean
  url?: string
  note?: [string, string]
  en?: string
  place?: string
  address?: string
  phone?: string
}
const r = (id: string, name: string, x: Info = {}): Dish => ({
  ...d({ id, o: name, en: x.en ?? name, c: 'restaurant', k: 'eatout', e: 1, i: '', n: x.note }),
  takeaway: x.takeaway,
  url: x.url,
  place: x.place,
  address: x.address,
  phone: x.phone,
})

export const restaurants: Dish[] = [
  // restaurants
  r('r-fuenf', 'fünf', {
    url: 'https://fuenf.de/#currentcard',
    place: 'Neureut',
    address: 'Kanalweg 52, 76149 Karlsruhe',
    note: ['International, Karte wechselt wöchentlich, Bio & vegetarisch, Biergarten', 'International, weekly changing menu, organic & vegetarian, beer garden'],
  }),
  r('r-lemoni', 'Lemoni', { place: 'Neureut', address: 'Neureuter Hauptstr. 300, 76149 Karlsruhe', phone: '0721 66998160', note: ['Griechisch / mediterran', 'Greek / Mediterranean'] }),
  r('r-millestelle', 'Mille Stelle', { place: 'Leopoldshafen', address: 'Moltkestraße 21, 76344 Eggenstein-Leopoldshafen', note: ['Italienisch (im Hotel Mille Stelle)', 'Italian (at Hotel Mille Stelle)'] }),
  r('r-luvino', 'Salvatore Luvino', { note: ['Italienisch', 'Italian'] }),
  r('r-chang-tong', 'Chang Tong', { place: 'Eggenstein-Leopoldshafen', address: 'Sportplatzweg 13, 76344 Eggenstein-Leopoldshafen', note: ['Thailändisch', 'Thai'] }),
  r('r-hermes', 'Restaurant Hermes', { place: 'Neureut', address: 'Neureuter Hauptstr. 52, 76149 Karlsruhe', phone: '0721 7880300', note: ['Griechisch', 'Greek'] }),
  r('r-mariannes-flammkuchen', 'Marianne’s Flammkuchen', { place: 'Karlsruhe (Innenstadt)', note: ['Flammkuchen satt (all you can eat)', 'All-you-can-eat tarte flambée'] }),
  r('r-ambe', 'Ambe – Georgisches Restaurant', { en: 'Ambe – Georgian restaurant', place: 'Stutensee', note: ['Georgische Küche: Khachapuri, Khinkali …', 'Georgian food: khachapuri, khinkali …'] }),
  r('r-indisch', 'Indisches Restaurant', { en: 'Indian restaurant' }),
  r('r-olivenbaum', 'Olivenbaum'),
  r('r-thai', 'Thai-Restaurant', { en: 'Thai restaurant' }),
  // takeaway
  r('r-aroy-aroy', 'Aroy Aroy', { takeaway: true, place: 'Karlsruhe', address: 'Joachim-Kurzaj-Weg 5a, 76189 Karlsruhe', note: ['Thailändisch, auch über Wolt', 'Thai, also via Wolt'] }),
  r('r-yous-pizza', 'You’s Pizza', { takeaway: true, place: 'Am Zinken', note: ['Pizza, auch über Uber Eats', 'Pizza, also via Uber Eats'] }),
  r('r-pizza-doener', 'Pizza Döner Neureut', { takeaway: true, place: 'Neureut', address: 'Holbeinstraße 5, 76149 Karlsruhe', note: ['Pizza & Döner', 'Pizza & kebab'] }),
  r('r-thasy-tamil', 'Thasy Tamil', { takeaway: true, place: 'Karlsruhe', address: 'Wilhelmstraße 8, Karlsruhe', note: ['Tamilisch / sri-lankisch, auch über Uber Eats', 'Tamil / Sri Lankan, also via Uber Eats'] }),
  r('r-asia-lidl', 'Asia-Take-away (Lidl)', { en: 'Asian takeaway (Lidl)', takeaway: true }),
]
