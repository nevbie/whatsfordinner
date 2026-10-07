import { d } from './define'

/**
 * Single tapas for the tapas-evening builder. Tortilla, albóndigas and gambas (family.ts) also
 * work as a dinner on their own; the rest are only combined (kind 'side').
 */
const tortilla = d({ id: 'tortilla-espanola', o: 'Tortilla de patatas', l: 'es', de: 'Spanische Kartoffeltortilla', en: 'Spanish potato omelette', c: 'spanish', co: 'tapaVeg', t: 'veggie kids', i: 'egg potatoes onion olive_oil', n: ['Dick, saftig, am besten lauwarm.', 'Thick and juicy, best served warm.'] })
tortilla.party = ['snack', 'main']

export const tapasDishes = [
  tortilla,
  d({ id: 'albondigas', o: 'Albóndigas en salsa', l: 'es', de: 'Hackbällchen in Tomatensoße', en: 'Meatballs in tomato sauce', c: 'spanish', co: 'tapaMeat', t: 'meat kids', i: 'minced_mixed canned_tomatoes onion garlic paprika_powder bread' }),
  d({ id: 'patatas-bravas', o: 'Patatas bravas', l: 'es', de: 'Patatas bravas (Kartoffeln mit scharfer Soße)', en: 'Patatas bravas (potatoes with spicy sauce)', c: 'spanish', k: 'side', co: 'tapaVeg', t: 'vegan', e: 1, i: 'potatoes canned_tomatoes paprika_powder chili garlic olive_oil', n: ['Für Kinder mit Aioli statt Brava-Soße.', 'For kids with aioli instead of brava sauce.'] }),
  d({ id: 'pimientos-padron', o: 'Pimientos de Padrón', l: 'es', de: 'Gebratene Padrón-Paprika', en: 'Fried Padrón peppers', c: 'spanish', k: 'side', co: 'tapaVeg', t: 'vegan', e: 1, i: 'padron_peppers olive_oil sea_salt', n: ['„Unos pican y otros no“ – manche sind scharf, manche nicht.', '“Some are hot, some are not.”'] }),
  d({ id: 'champinones-ajillo', o: 'Champiñones al ajillo', l: 'es', de: 'Knoblauch-Champignons', en: 'Garlic mushrooms', c: 'spanish', k: 'side', co: 'tapaVeg', t: 'vegan', e: 1, i: 'mushrooms garlic parsley olive_oil' }),
  d({ id: 'pan-con-tomate', o: 'Pan con tomate', l: 'es', de: 'Brot mit Tomate', en: 'Bread with tomato', c: 'spanish', k: 'side', co: 'tapaBread', t: 'vegan kids', e: 1, i: 'baguette tomato garlic olive_oil' }),
  d({ id: 'jamon-queso', o: 'Jamón serrano y queso manchego', l: 'es', de: 'Serrano-Schinken und Manchego', en: 'Serrano ham and Manchego cheese', c: 'spanish', k: 'side', co: 'tapaBread', t: 'meat kids', e: 1, i: 'serrano_ham manchego olives' }),
  d({ id: 'croquetas', o: 'Croquetas de jamón', l: 'es', de: 'Schinken-Kroketten', en: 'Ham croquettes', c: 'spanish', k: 'side', co: 'tapaMeat', t: 'meat kids', e: 3, i: 'serrano_ham milk flour butter breadcrumbs egg' }),
  d({ id: 'chorizo-vino', o: 'Chorizo al vino', l: 'es', de: 'Chorizo in Rotwein', en: 'Chorizo in red wine', c: 'spanish', k: 'side', co: 'tapaMeat', t: 'meat', e: 1, i: 'chorizo red_wine bay_leaf' }),
  d({ id: 'calamares', o: 'Calamares a la romana', l: 'es', de: 'Frittierte Tintenfischringe', en: 'Fried squid rings', c: 'spanish', k: 'side', co: 'tapaFish', t: 'fish kids', i: 'squid flour egg lemon olive_oil' }),
  d({ id: 'boquerones', o: 'Boquerones en vinagre', l: 'es', de: 'Eingelegte Sardellen', en: 'Marinated anchovies', c: 'spanish', k: 'side', co: 'tapaFish', t: 'fish', e: 1, i: 'fresh_anchovies vinegar garlic parsley olive_oil' }),
  d({ id: 'ensaladilla', o: 'Ensaladilla rusa', l: 'es', de: 'Spanischer Kartoffelsalat mit Thunfisch', en: 'Spanish potato salad with tuna', c: 'spanish', k: 'side', co: 'tapaFish', t: 'fish kids', e: 1, i: 'potatoes tuna carrot peas mayonnaise egg' }),
  d({ id: 'aceitunas', o: 'Aceitunas aliñadas', l: 'es', de: 'Marinierte Oliven', en: 'Marinated olives', c: 'spanish', k: 'side', co: 'tapaBread', t: 'vegan', e: 1, i: 'olives garlic oregano olive_oil' }),
]
