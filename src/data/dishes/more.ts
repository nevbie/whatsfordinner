import { d } from './define'

/** Additional family classics (German and international) to widen the choice. */
export const moreDishes = [
  // German / Austrian
  d({ id: 'kartoffelsuppe', o: 'Kartoffelsuppe', en: 'Potato soup', c: 'german', t: 'veggie kids winter', i: 'potatoes carrot leek celeriac onion broth marjoram', n: ['Wer mag, mit Würstchen.', 'Optionally with sausages.'] }),
  d({ id: 'linsen-spaetzle', o: 'Linsen mit Spätzle', en: 'Lentils with spätzle and sausages', c: 'german', t: 'meat kids winter', i: 'brown_lentils spaetzle frankfurters carrot onion vinegar', n: ['Schwäbisch: „Linsa mit Spätzla ond Saitawürschtla“.', 'Swabian classic.'] }),
  d({ id: 'erbseneintopf', o: 'Erbseneintopf', en: 'Split pea stew', c: 'german', t: 'meat winter', i: 'split_peas potatoes carrot leek frankfurters broth' }),
  d({ id: 'koenigsberger-klopse', s: 'potatoes', o: 'Königsberger Klopse', en: 'Meatballs in caper cream sauce', c: 'german', t: 'meat kids', i: 'minced_mixed capers cream bread_roll egg onion potatoes' }),
  d({ id: 'senfeier', o: 'Senfeier', en: 'Eggs in mustard sauce', c: 'german', t: 'veggie kids', e: 1, i: 'egg mustard butter flour milk potatoes' }),
  d({ id: 'pellkartoffeln-quark', o: 'Pellkartoffeln mit Kräuterquark', en: 'Jacket potatoes with herb quark', c: 'german', t: 'veggie kids summer', e: 1, i: 'potatoes quark herbs linseed_oil' }),
  d({ id: 'spinat-spiegelei', o: 'Rahmspinat mit Spiegelei und Kartoffeln', en: 'Creamed spinach with fried egg and potatoes', c: 'german', t: 'veggie kids', e: 1, i: 'spinach egg potatoes cream' }),
  d({ id: 'kuerbissuppe', o: 'Kürbissuppe', en: 'Pumpkin soup', c: 'german', t: 'vegan kids winter', e: 1, i: 'pumpkin onion ginger coconut_milk broth bread' }),
  d({ id: 'huehnerfrikassee', o: 'Hühnerfrikassee', en: 'Chicken fricassee', c: 'german', t: 'meat kids', i: 'chicken mushrooms peas asparagus cream rice' }),
  d({ id: 'gefuellte-paprika', o: 'Gefüllte Paprika', en: 'Stuffed peppers', c: 'german', t: 'meat kids oven', i: 'bell_pepper minced_mixed rice canned_tomatoes onion' }),
  d({ id: 'kartoffelsalat-wuerstchen', o: 'Kartoffelsalat mit Würstchen', en: 'Potato salad with sausages', c: 'german', t: 'meat kids summer', e: 1, i: 'potatoes frankfurters gherkins onion broth mustard' }),
  d({ id: 'gruene-sosse', o: 'Grie Soß', de: 'Frankfurter Grüne Soße', en: 'Frankfurt green sauce with eggs and potatoes', c: 'german', t: 'veggie summer', e: 1, i: 'herbs egg potatoes sour_cream yogurt' }),
  d({ id: 'arme-ritter', o: 'Arme Ritter', en: 'French toast', c: 'german', t: 'veggie sweet kids', e: 1, i: 'bread egg milk cinnamon sugar' }),
  d({ id: 'dampfnudeln', s: 'dough', o: 'Dampfnudeln mit Vanillesoße', en: 'Steamed yeast dumplings with vanilla sauce', c: 'german', t: 'veggie sweet kids winter', e: 3, i: 'flour yeast milk butter sugar vanilla' }),
  d({ id: 'scheiterhaufen', o: 'Scheiterhaufen', en: 'Bread and apple pudding', c: 'german', t: 'veggie sweet kids oven', i: 'bread_roll apples milk egg sugar raisins cinnamon', n: ['Auflauf aus altbackenen Brötchen und Äpfeln – gut für Reste.', 'Bake of stale rolls and apples – great for leftovers.'] }),
  d({ id: 'germknoedel', s: 'dough', o: 'Germknödel', en: 'Yeast dumplings with plum jam and poppy seeds', c: 'austrian', t: 'veggie sweet kids winter', e: 3, i: 'flour yeast milk plum_jam poppy_seeds butter' }),
  // Italian / Mediterranean
  d({ id: 'carbonara', o: 'Spaghetti alla carbonara', l: 'it', de: 'Spaghetti Carbonara', en: 'Spaghetti carbonara', c: 'italian', t: 'meat kids', e: 1, i: 'spaghetti guanciale egg pecorino black_pepper' }),
  d({ id: 'pasta-pesto', o: 'Pasta al pesto genovese', l: 'it', de: 'Nudeln mit Pesto', en: 'Pasta with pesto', c: 'italian', t: 'veggie kids', e: 1, i: 'pasta basil pine_nuts parmesan garlic olive_oil' }),
  d({ id: 'gnocchi-pomodoro', o: 'Gnocchi al pomodoro', l: 'it', de: 'Gnocchi mit Tomatensoße', en: 'Gnocchi with tomato sauce', c: 'italian', t: 'veggie kids', e: 1, i: 'gnocchi canned_tomatoes mozzarella basil' }),
  d({ id: 'minestrone', o: 'Minestrone', l: 'it', de: 'Minestrone (Gemüsesuppe)', en: 'Minestrone (vegetable soup)', c: 'italian', t: 'vegan', i: 'zucchini carrot celery white_beans canned_tomatoes pasta' }),
  d({ id: 'shakshuka', o: 'شكشوكة', l: 'ar', r: 'Shakshūka', de: 'Shakshuka (Eier in Tomatensoße)', en: 'Shakshuka (eggs in tomato sauce)', c: 'mideast', t: 'veggie', e: 1, i: 'egg canned_tomatoes bell_pepper onion cumin flatbread' }),
  d({ id: 'moussaka', o: 'Μουσακάς', l: 'el', r: 'Mousakás', de: 'Moussaka', en: 'Moussaka', c: 'greek', t: 'meat oven', e: 3, i: 'eggplant minced_beef potatoes canned_tomatoes milk cinnamon' }),
  d({ id: 'paella', o: 'Paella', l: 'es', en: 'Paella', c: 'spanish', t: 'fish social', e: 3, i: 'paella_rice prawns chicken bell_pepper peas saffron' }),
  d({ id: 'boerek', s: 'dough', o: 'Börek', l: 'tr', en: 'Börek (filled filo pastry)', c: 'turkish', t: 'veggie kids oven', i: 'yufka feta spinach egg yogurt' }),
  d({ id: 'lahmacun', s: 'bread dough', o: 'Lahmacun', l: 'tr', en: 'Lahmacun (Turkish flatbread with minced meat)', c: 'turkish', t: 'meat oven', i: 'flour minced_beef tomato bell_pepper onion parsley lemon' }),
  d({ id: 'pierogi', s: 'dough potatoes', o: 'Pierogi ruskie', l: 'pl', de: 'Piroggen mit Kartoffel-Quark-Füllung', en: 'Pierogi with potato and cheese filling', c: 'eastern', t: 'veggie kids', e: 3, i: 'flour potatoes quark onion sour_cream' }),
  d({ id: 'tacos', o: 'Tacos', l: 'es', en: 'Tacos', c: 'mexican', t: 'meat kids social', i: 'tortillas minced_beef black_beans tomato avocado cheese lime' }),
  // East / South-East Asia
  d({ id: 'pad-thai', o: 'ผัดไทย', l: 'th', r: 'Phat Thai', de: 'Pad Thai (gebratene Reisnudeln)', en: 'Pad Thai (stir-fried rice noodles)', c: 'thai', t: 'fish kids', i: 'rice_noodles prawns egg tofu bean_sprouts peanuts lime fish_sauce' }),
  d({ id: 'pho', o: 'Phở bò', l: 'vi', de: 'Phở (Reisnudelsuppe mit Rind)', en: 'Phở (beef rice noodle soup)', c: 'vietnamese', t: 'meat', e: 3, i: 'rice_noodles beef star_anise ginger onion bean_sprouts thai_basil lime' }),
  d({ id: 'japanisches-curry', o: 'カレーライス', l: 'ja', r: 'Karē raisu', de: 'Japanisches Curry mit Reis', en: 'Japanese curry rice', c: 'japanese', t: 'meat kids', i: 'curry_roux chicken potatoes carrot onion rice', n: ['Mild und süßlich – ein Kinderliebling in Japan.', 'Mild and slightly sweet – a children’s favourite in Japan.'] }),
  d({ id: 'okonomiyaki', s: 'dough', o: 'お好み焼き', l: 'ja', r: 'Okonomiyaki', de: 'Okonomiyaki (japanischer Kohlpfannkuchen)', en: 'Okonomiyaki (Japanese cabbage pancake)', c: 'japanese', t: 'kids', i: 'white_cabbage flour egg bacon spring_onion mayonnaise' }),
  d({ id: 'bibimbap', o: '비빔밥', l: 'ko', r: 'Bibimbap', de: 'Bibimbap (Reisschüssel mit Gemüse)', en: 'Bibimbap (rice bowl with vegetables)', c: 'korean', t: 'meat', i: 'rice beef spinach carrot bean_sprouts egg gochujang' }),
  d({ id: 'sushi', o: '寿司', l: 'ja', r: 'Sushi', de: 'Sushi (selbst gerollt)', en: 'Sushi (rolled at home)', c: 'japanese', t: 'fish kids social', e: 3, i: 'sushi_rice nori salmon cucumber avocado soy_sauce' }),
]
