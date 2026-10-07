import type { Dish, PartyCourse } from '../types'
import { d, type Def } from './define'

/** Components for the Teller (plate) and salad builders – from the family notebook ("Beilagen", "Salate"). */
const side = (co: Def['co'], def: Omit<Def, 'k' | 'co' | 'c'> & { c?: Def['c'] }) => d({ c: 'german', ...def, k: 'side', co })

const partyDish = (course: PartyCourse | PartyCourse[], def: Omit<Def, 'k'>): Dish => {
  const dish = d({ ...def, k: 'party' })
  dish.party = Array.isArray(course) ? course : [course]
  return dish
}

export const tellerSides: Dish[] = [
  // starchy sides
  side('plStarch', { id: 'pl-bratkartoffeln', o: 'Bratkartoffeln', en: 'Fried potatoes', t: 'vegan kids', i: 'potatoes onion oil' }),
  side('plStarch', { id: 'pl-pellkartoffeln', o: 'Pellkartoffeln', en: 'Jacket-boiled potatoes', t: 'vegan kids', e: 1, i: 'potatoes caraway' }),
  side('plStarch', { id: 'pl-salzkartoffeln', o: 'Salzkartoffeln', en: 'Boiled potatoes', t: 'vegan kids', e: 1, i: 'potatoes' }),
  side('plStarch', { id: 'pl-kartoffelpuffer', o: 'Kartoffelpuffer', en: 'Potato fritters', t: 'veggie kids', i: 'potatoes egg onion oil' }),
  side('plStarch', { id: 'pl-kartoffelbrei', o: 'Kartoffelbrei / Stampf', en: 'Mashed potatoes', t: 'veggie kids', e: 1, i: 'potatoes milk butter nutmeg' }),
  side('plStarch', { id: 'pl-kartoffelknoedel', o: 'Kartoffelknödel', en: 'Potato dumplings', t: 'vegan kids winter', i: 'potatoes cornstarch' }),
  side('plStarch', { id: 'pl-kartoffelgratin', o: 'Kartoffelgratin', en: 'Potato gratin', t: 'veggie kids oven', i: 'potatoes cream cheese garlic nutmeg' }),
  side('plStarch', { id: 'pl-gruenkernkloesse', o: 'Grünkernklöße', en: 'Green spelt dumplings', t: 'veggie', i: 'green_spelt egg onion breadcrumbs' }),
  side('plStarch', { id: 'pl-spaetzle', o: 'Spätzle', en: 'Spätzle (egg noodles)', t: 'veggie kids', e: 1, i: 'spaetzle butter' }),
  side('plStarch', { id: 'pl-spaghetti', o: 'Spaghetti', l: 'it', en: 'Spaghetti', t: 'vegan kids', e: 1, i: 'spaghetti' }),
  side('plStarch', { id: 'pl-bandnudeln', o: 'Bandnudeln', en: 'Tagliatelle', t: 'veggie kids', e: 1, i: 'tagliatelle' }),
  side('plStarch', { id: 'pl-spiralnudeln', o: 'Spiralnudeln', en: 'Fusilli', t: 'vegan kids', e: 1, i: 'pasta' }),
  side('plStarch', { id: 'pl-rigatoni', o: 'Rigatoni', l: 'it', en: 'Rigatoni', t: 'vegan kids', e: 1, i: 'pasta' }),
  side('plStarch', { id: 'pl-penne', o: 'Penne', l: 'it', en: 'Penne', t: 'vegan kids', e: 1, i: 'pasta' }),
  side('plStarch', { id: 'pl-reis', o: 'Reis', en: 'Rice', t: 'vegan kids', e: 1, i: 'rice' }),
  // vegetable sides
  side('plVeg', { id: 'pl-bohnen', o: 'Bohnengemüse', en: 'Green beans', t: 'vegan', e: 1, i: 'green_beans butter savory' }),
  side('plVeg', { id: 'pl-karotten-kohlrabi', o: 'Karotten & Kohlrabi', en: 'Carrots & kohlrabi', t: 'veggie kids', e: 1, i: 'carrot kohlrabi butter' }),
  side('plVeg', { id: 'pl-erbsen', o: 'Erbsen', en: 'Peas', t: 'veggie kids', e: 1, i: 'peas butter' }),
  side('plVeg', { id: 'pl-brokkoli', o: 'Brokkoli', en: 'Broccoli', t: 'vegan kids', e: 1, i: 'broccoli' }),
  side('plVeg', { id: 'pl-blumenkohl', o: 'Blumenkohl', en: 'Cauliflower', t: 'veggie kids', e: 1, i: 'cauliflower butter breadcrumbs' }),
  side('plVeg', { id: 'pl-spinat', o: 'Spinat', en: 'Spinach', t: 'veggie', e: 1, i: 'spinach cream garlic' }),
  side('plVeg', { id: 'pl-rosenkohl', o: 'Rosenkohl', en: 'Brussels sprouts', t: 'vegan winter', e: 1, i: 'brussels_sprouts butter' }),
  side('plVeg', { id: 'pl-wirsing', o: 'Rahmwirsing', en: 'Creamed savoy cabbage', t: 'veggie winter', i: 'savoy_cabbage cream nutmeg' }),
  side('plVeg', { id: 'pl-rotkohl', o: 'Rotkohl', en: 'Braised red cabbage', t: 'vegan kids winter', i: 'red_cabbage apples onion' }),
  side('plVeg', { id: 'pl-chinakohl', o: 'Chinakohl', en: 'Napa cabbage', t: 'vegan', e: 1, i: 'napa_cabbage' }),
]

export const saladParts: Dish[] = [
  d({ id: 'salat-baukasten', o: 'Salat nach Wahl', de: 'Salat-Baukasten', en: 'Salad of your choice', c: 'german', k: 'combo', combo: 'salad', t: 'veggie summer', e: 1, i: '' }),
  // bases
  side('slBase', { id: 'sl-blattsalat', o: 'Grüner Blattsalat', en: 'Green leaf salad', t: 'vegan kids', e: 1, i: 'lettuce' }),
  side('slBase', { id: 'sl-feldsalat', o: 'Feldsalat', en: 'Lamb’s lettuce', t: 'vegan winter', e: 1, i: 'lamb_lettuce' }),
  side('slBase', { id: 'sl-rucola', o: 'Rucola', en: 'Rocket', t: 'vegan', e: 1, i: 'rocket' }),
  side('slBase', { id: 'sl-radicchio-mix', o: 'Blattsalat mit Radicchio', en: 'Leaf salad with radicchio', t: 'vegan', e: 1, i: 'lettuce radicchio' }),
  side('slBase', { id: 'sl-gurke-tomate', o: 'Gurke & Tomate', en: 'Cucumber & tomato', t: 'vegan kids summer', e: 1, i: 'cucumber tomato' }),
  // extras
  side('slExtra', { id: 'sl-radieschen', o: 'Radieschen', en: 'Radishes', t: 'vegan', e: 1, i: 'radish' }),
  side('slExtra', { id: 'sl-oliven', o: 'Oliven', en: 'Olives', t: 'vegan', e: 1, i: 'olives' }),
  side('slExtra', { id: 'sl-avocado', o: 'Avocado', en: 'Avocado', t: 'vegan', e: 1, i: 'avocado' }),
  side('slExtra', { id: 'sl-feta', o: 'Feta', en: 'Feta', t: 'veggie', e: 1, i: 'feta' }),
  side('slExtra', { id: 'sl-rucola-extra', o: 'Etwas Rucola', en: 'A handful of rocket', t: 'vegan', e: 1, i: 'rocket' }),
  side('slExtra', { id: 'sl-radicchio', o: 'Radicchio', l: 'it', en: 'Radicchio', t: 'vegan', e: 1, i: 'radicchio' }),
  side('slExtra', { id: 'sl-mais-paprika', o: 'Mais & Paprika', en: 'Sweetcorn & bell pepper', t: 'vegan kids', e: 1, i: 'corn bell_pepper' }),
  // toppings
  side('slTopping', { id: 'sl-granatapfel', o: 'Granatapfelkerne', en: 'Pomegranate seeds', t: 'vegan', e: 1, i: 'pomegranate' }),
  side('slTopping', { id: 'sl-sonnenblumenkerne', o: 'Sonnenblumenkerne', en: 'Sunflower seeds', t: 'vegan', e: 1, i: 'sunflower_seeds' }),
  side('slTopping', { id: 'sl-walnuesse', o: 'Walnüsse', en: 'Walnuts', t: 'vegan', e: 1, i: 'walnuts' }),
  side('slTopping', { id: 'sl-kraeuter', o: 'Frische Kräuter', en: 'Fresh herbs', t: 'vegan', e: 1, i: 'herbs' }),
  side('slTopping', { id: 'sl-kuerbiskerne', o: 'Kürbiskerne', en: 'Pumpkin seeds', t: 'vegan', e: 1, i: 'pumpkin_seeds' }),
  side('slTopping', { id: 'sl-pinienkerne', o: 'Pinienkerne', en: 'Pine nuts', t: 'vegan', e: 1, i: 'pine_nuts' }),
  // dressings
  side('slDressing', { id: 'sl-sahne-kraeuter', o: 'Sahne-Kräuter-Dressing', en: 'Creamy herb dressing', t: 'veggie kids', e: 1, i: 'cream herbs vinegar' }),
  side('slDressing', { id: 'sl-essig-oel', o: 'Essig-Öl', en: 'Oil & vinegar', t: 'vegan kids', e: 1, i: 'vinegar oil mustard' }),
  side('slDressing', { id: 'sl-zitrone', o: 'Zitronen-Dressing', en: 'Lemon dressing', t: 'vegan', e: 1, i: 'lemon olive_oil honey' }),
  side('slDressing', { id: 'sl-senf-joghurt', o: 'Senf-Joghurt-Dressing', en: 'Mustard yoghurt dressing', t: 'veggie', e: 1, i: 'yogurt mustard honey' }),
  side('slDressing', { id: 'sl-kraeuter-vinaigrette', o: 'Kräuter-Vinaigrette', en: 'Herb vinaigrette', t: 'vegan', e: 1, i: 'herbs vinegar olive_oil' }),
  side('slDressing', { id: 'sl-thousand-island', o: 'Thousand Island', l: 'en', de: 'Thousand-Island-Dressing', en: 'Thousand Island dressing', t: 'veggie kids', e: 1, i: 'mayonnaise ketchup gherkins' }),
  side('slDressing', { id: 'sl-kuerbiskernoel', o: 'Kürbiskernöl-Dressing', en: 'Pumpkin seed oil dressing', c: 'austrian', t: 'vegan', e: 1, i: 'pumpkin_seed_oil vinegar' }),
]

/** Dishes marked on the menus of the family's favourite Beijing restaurants. */
export const chineseExtras: Dish[] = [
  d({ id: 'laocu-huasheng', o: '老醋花生', l: 'zh', r: 'Lǎocù huāshēng', de: 'Erdnüsse in altem Essig', en: 'Peanuts in aged vinegar', c: 'chinese', k: 'side', co: 'cold', t: 'vegan', e: 1, i: 'peanuts black_vinegar sugar coriander' }),
  d({ id: 'suoyi-huanggua', o: '蓑衣黄瓜', l: 'zh', r: 'Suōyī huángguā', de: 'Gurke „Regenmantel“ (fein eingeschnitten)', en: '“Raincoat” cucumber (finely scored)', c: 'chinese', k: 'side', co: 'cold', t: 'vegan summer', e: 1, i: 'cucumber garlic chili_oil rice_vinegar' }),
  d({ id: 'chuanbei-liangfen', o: '川北凉粉', l: 'zh', r: 'Chuānběi liángfěn', de: 'Kaltes Bohnengelee nach Sichuan-Art', en: 'Northern Sichuan cold bean jelly', c: 'chinese', k: 'side', co: 'cold', t: 'vegan spicy', e: 2, i: 'mung_bean_jelly chili_oil garlic soy_sauce sichuan_pepper' }),
  d({ id: 'sixi-kaofu', o: '四喜烤麸', l: 'zh', r: 'Sìxǐ kǎofū', de: 'Weizengluten „Vier Freuden“ mit Pilzen', en: '“Four joys” braised wheat gluten', c: 'chinese', k: 'side', co: 'cold', t: 'vegan', i: 'wheat_gluten shiitake wood_ear peanuts soy_sauce' }),
  d({ id: 'lanmei-shanyao', o: '蓝莓山药', l: 'zh', r: 'Lánméi shānyào', de: 'Yamswurzel mit Blaubeersoße', en: 'Chinese yam with blueberry sauce', c: 'chinese', k: 'side', co: 'cold', t: 'vegan kids sweet', e: 1, i: 'chinese_yam blueberries' }),
  d({ id: 'ganbian-doujiao', o: '干煸豆角', l: 'zh', r: 'Gānbiān dòujiǎo', de: 'Trocken gebratene grüne Bohnen', en: 'Dry-fried green beans', c: 'chinese', k: 'side', co: 'veg', t: 'meat spicy', i: 'green_beans minced_pork dried_chili garlic sichuan_pepper' }),
  d({ id: 'shousi-baocai', o: '手撕包菜', l: 'zh', r: 'Shǒusī bāocài', de: 'Handgerissener Weißkohl', en: 'Hand-torn cabbage stir-fry', c: 'chinese', k: 'side', co: 'veg', t: 'vegan', e: 1, i: 'white_cabbage dried_chili garlic black_vinegar' }),
  d({ id: 'xianggu-youcai', o: '香菇油菜', l: 'zh', r: 'Xiānggū yóucài', de: 'Pak Choi mit Shiitake', en: 'Bok choy with shiitake', c: 'chinese', k: 'side', co: 'veg', t: 'vegan kids', e: 1, i: 'pak_choi shiitake garlic oyster_sauce' }),
  d({ id: 'kugua-jidan', o: '苦瓜炒鸡蛋', l: 'zh', r: 'Kǔguā chǎo jīdàn', de: 'Bittermelone mit Ei', en: 'Bitter melon with egg', c: 'chinese', k: 'side', co: 'egg', t: 'veggie', e: 1, i: 'bitter_melon egg garlic' }),
  // Jiaozi fillings – variants of 饺子
  d({ id: 'jiaozi-zhurou-baicai', g: 'jiaozi', s: 'dough', o: '猪肉白菜饺子', l: 'zh', r: 'Zhūròu báicài jiǎozi', de: 'Jiaozi mit Schwein und Chinakohl', en: 'Jiaozi with pork and napa cabbage', c: 'chinese', co: 'meal', t: 'meat kids social', e: 3, i: 'minced_pork flour napa_cabbage ginger spring_onion' }),
  d({ id: 'jiaozi-zhurou-huixiang', g: 'jiaozi', s: 'dough', o: '猪肉茴香饺子', l: 'zh', r: 'Zhūròu huíxiāng jiǎozi', de: 'Jiaozi mit Schwein und Fenchelgrün', en: 'Jiaozi with pork and fennel', c: 'chinese', co: 'meal', t: 'meat social', e: 3, i: 'minced_pork flour fennel_bulb ginger' }),
  d({ id: 'jiaozi-zhurou-jiucai', g: 'jiaozi', s: 'dough', o: '猪肉韭菜饺子', l: 'zh', r: 'Zhūròu jiǔcài jiǎozi', de: 'Jiaozi mit Schwein und Schnittknoblauch', en: 'Jiaozi with pork and garlic chives', c: 'chinese', co: 'meal', t: 'meat social', e: 3, i: 'minced_pork flour chinese_chives ginger' }),
  d({ id: 'jiaozi-sanxian', g: 'jiaozi', s: 'dough', o: '三鲜饺子', l: 'zh', r: 'Sānxiān jiǎozi', de: 'Jiaozi „Drei Köstlichkeiten“ (Schwein, Garnelen, Ei)', en: '“Three delicacies” jiaozi (pork, prawns, egg)', c: 'chinese', co: 'meal', t: 'meat fish social', e: 3, i: 'minced_pork flour prawns egg chinese_chives' }),
  d({ id: 'jiaozi-jidan-jiucai', g: 'jiaozi', s: 'dough', o: '韭菜鸡蛋饺子', l: 'zh', r: 'Jiǔcài jīdàn jiǎozi', de: 'Jiaozi mit Ei und Schnittknoblauch', en: 'Jiaozi with egg and garlic chives', c: 'chinese', co: 'meal', t: 'veggie social', e: 3, i: 'egg flour chinese_chives glass_noodles' }),
]

/** From the family's Vorspeisen/Fingerfood list. */
export const fingerFoodExtras: Dish[] = [
  d({ id: 'espinacas-garbanzos', o: 'Espinacas con garbanzos', l: 'es', de: 'Spinat mit Kichererbsen', en: 'Spinach with chickpeas', c: 'spanish', k: 'side', co: 'tapaVeg', t: 'vegan', e: 1, i: 'spinach chickpeas garlic cumin paprika_powder olive_oil' }),
  d({ id: 'judias-blancas', o: 'Judías blancas con tomate', l: 'es', de: 'Weiße Bohnen in Tomatensoße', en: 'White beans in tomato sauce', c: 'spanish', k: 'side', co: 'tapaVeg', t: 'vegan kids', e: 1, i: 'white_beans tomato garlic olive_oil' }),
  partyDish('dip', { id: 'rote-bete-joghurt', o: 'Rote-Bete-Joghurt', en: 'Beetroot yoghurt dip', c: 'mideast', t: 'veggie', e: 1, i: 'beetroot yogurt garlic dill' }),
  partyDish('snack', { id: 'tomate-mozzarella-spiesse', o: 'Tomaten-Mozzarella-Spieße', en: 'Tomato and mozzarella skewers', c: 'italian', t: 'veggie kids summer', e: 1, i: 'cherry_tomatoes mozzarella basil' }),
  partyDish('snack', { id: 'baguette-kaese', o: 'Baguette & Käse', en: 'Baguette and cheese', c: 'french', t: 'veggie kids', e: 1, i: 'baguette cheese grapes' }),
  partyDish('snack', { id: 'knabbereien', o: 'Knabbereien', en: 'Nibbles (crisps, pretzel sticks, nuts)', c: 'german', t: 'vegan kids', e: 1, i: 'crisps pretzels peanuts' }),
  partyDish('salad', { id: 'feldsalat', o: 'Feldsalat mit Walnüssen', en: 'Lamb’s lettuce with walnuts', c: 'german', t: 'vegan winter', e: 1, i: 'lamb_lettuce walnuts vinegar oil' }),
  partyDish('salad', { id: 'rote-bete-salat', o: 'Rote-Bete-Salat', en: 'Beetroot salad', c: 'german', t: 'vegan', e: 1, i: 'beetroot apples onion vinegar oil' }),
]

