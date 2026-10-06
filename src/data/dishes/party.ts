import type { PartyCourse } from '../types'
import { d, type Def } from './define'

/** Dishes for hosting guests – only used in the party planner (kind 'party'). */
const p = (course: PartyCourse | PartyCourse[], def: Omit<Def, 'k'>) => {
  const dish = d({ ...def, k: 'party' })
  dish.party = Array.isArray(course) ? course : [course]
  return dish
}

export const partyDishes = [
  // starters
  p('starter', { id: 'bruschetta', o: 'Bruschetta', l: 'it', de: 'Bruschetta (geröstetes Brot mit Tomaten)', en: 'Bruschetta (toasted bread with tomatoes)', c: 'italian', t: 'vegan', e: 1, i: 'baguette tomato garlic basil olive_oil' }),
  p('starter', { id: 'caprese', o: 'Insalata caprese', l: 'it', de: 'Tomate-Mozzarella', en: 'Tomato and mozzarella', c: 'italian', t: 'veggie kids summer', e: 1, i: 'mozzarella tomato basil olive_oil' }),
  p('starter', { id: 'antipasti', o: 'Antipasti misti', l: 'it', de: 'Gemischte Antipasti', en: 'Mixed antipasti', c: 'italian', t: 'social', e: 1, i: 'prosciutto olives grilled_vegetables mozzarella baguette' }),
  p('starter', { id: 'carpaccio', o: 'Carpaccio di manzo', l: 'it', de: 'Rindercarpaccio', en: 'Beef carpaccio', c: 'italian', t: 'meat', e: 1, i: 'beef parmesan rocket lemon olive_oil' }),
  p('starter', { id: 'gazpacho', o: 'Gazpacho', l: 'es', de: 'Gazpacho (kalte Tomatensuppe)', en: 'Gazpacho (cold tomato soup)', c: 'spanish', t: 'vegan summer', e: 1, i: 'tomato cucumber bell_pepper garlic olive_oil bread' }),
  p('starter', { id: 'melone-schinken', o: 'Prosciutto e melone', l: 'it', de: 'Melone mit Schinken', en: 'Melon with prosciutto', c: 'italian', t: 'meat summer', e: 1, i: 'melon prosciutto' }),
  p(['starter', 'snack'], { id: 'chunjuan', o: '春卷', l: 'zh', r: 'Chūnjuǎn', de: 'Frühlingsrollen', en: 'Spring rolls', c: 'chinese', t: 'veggie kids', i: 'spring_roll_wrappers napa_cabbage carrot glass_noodles mushrooms soy_sauce' }),
  p('starter', { id: 'miso-suppe', o: '味噌汁', l: 'ja', r: 'Misoshiru', de: 'Misosuppe', en: 'Miso soup', c: 'japanese', t: 'vegan', e: 1, i: 'miso tofu wakame spring_onion' }),
  p('starter', { id: 'kuerbissuppe-party', o: 'Kürbissuppe im Glas', en: 'Pumpkin soup in glasses', c: 'german', t: 'vegan kids winter', e: 1, i: 'pumpkin onion ginger coconut_milk broth' }),
  // salads
  p('salad', { id: 'kartoffelsalat', o: 'Schwäbischer Kartoffelsalat', en: 'Swabian potato salad', c: 'german', t: 'vegan kids', i: 'potatoes onion broth vinegar oil chives' }),
  p('salad', { id: 'nudelsalat', o: 'Nudelsalat', en: 'Pasta salad', c: 'german', t: 'veggie kids', e: 1, i: 'pasta peas corn gherkins mayonnaise yogurt' }),
  p('salad', { id: 'horiatiki', o: 'Χωριάτικη σαλάτα', l: 'el', r: 'Choriátiki saláta', de: 'Griechischer Bauernsalat', en: 'Greek village salad', c: 'greek', t: 'veggie summer', e: 1, i: 'tomato cucumber feta olives red_onion oregano olive_oil' }),
  p('salad', { id: 'tabouleh', o: 'تبولة', l: 'ar', r: 'Tabbūla', de: 'Taboulé (Petersilien-Bulgur-Salat)', en: 'Tabbouleh (parsley and bulgur salad)', c: 'mideast', t: 'vegan summer', e: 1, i: 'parsley bulgur tomato mint lemon olive_oil' }),
  p('salad', { id: 'couscous-salat', o: 'Couscous-Salat', en: 'Couscous salad', c: 'northafrican', t: 'vegan kids', e: 1, i: 'couscous bell_pepper cucumber chickpeas mint lemon' }),
  p('salad', { id: 'krautsalat', o: 'Krautsalat', en: 'Coleslaw (German style)', c: 'german', t: 'vegan', e: 1, i: 'white_cabbage carrot vinegar oil caraway' }),
  p('salad', { id: 'caesar-salad', o: 'Caesar salad', l: 'en', de: 'Caesar Salad', en: 'Caesar salad', c: 'american', t: 'kids', e: 1, i: 'lettuce parmesan croutons chicken anchovies egg' }),
  p('salad', { id: 'gruener-salat', o: 'Grüner Salat mit Vinaigrette', en: 'Green salad with vinaigrette', c: 'german', t: 'vegan kids', e: 1, i: 'lettuce cucumber cherry_tomatoes vinegar olive_oil mustard' }),
  // sides
  p('side', { id: 'kraeuterbaguette', o: 'Kräuterbaguette', en: 'Herb baguette', c: 'french', t: 'veggie kids oven', e: 1, i: 'baguette butter herbs garlic' }),
  p('side', { id: 'folienkartoffeln', o: 'Folienkartoffeln mit Sour Cream', en: 'Jacket potatoes with sour cream', c: 'german', t: 'veggie kids oven', e: 1, i: 'potatoes sour_cream chives' }),
  p('side', { id: 'grillgemuese', o: 'Grillgemüse', en: 'Grilled vegetables', c: 'german', t: 'vegan summer', e: 1, i: 'zucchini bell_pepper eggplant mushrooms olive_oil' }),
  p('side', { id: 'maiskolben', o: 'Maiskolben', en: 'Corn on the cob', c: 'american', t: 'veggie kids summer', e: 1, i: 'corn butter' }),
  // finger food / snacks
  p('snack', { id: 'kaesespiesse', o: 'Käse-Trauben-Spieße', en: 'Cheese and grape skewers', c: 'german', t: 'veggie kids', e: 1, i: 'cheese grapes' }),
  p('snack', { id: 'blaetterteigschnecken', o: 'Blätterteigschnecken', en: 'Puff pastry pinwheels', c: 'german', t: 'veggie kids oven', e: 1, i: 'puff_pastry cream_cheese spinach cheese' }),
  p('snack', { id: 'mini-pizzen', o: 'Mini-Pizzen', en: 'Mini pizzas', c: 'italian', t: 'kids oven', i: 'flour yeast canned_tomatoes mozzarella ham' }),
  p('snack', { id: 'wrap-roellchen', o: 'Wrap-Röllchen', en: 'Wrap pinwheels', c: 'american', t: 'kids', e: 1, i: 'tortillas cream_cheese ham lettuce' }),
  p('snack', { id: 'gefuellte-eier', o: 'Gefüllte Eier', en: 'Devilled eggs', c: 'german', t: 'veggie', e: 1, i: 'egg mayonnaise mustard paprika_powder chives' }),
  p('snack', { id: 'datiles-bacon', o: 'Dátiles con bacon', l: 'es', de: 'Datteln im Speckmantel', en: 'Dates wrapped in bacon', c: 'spanish', t: 'meat oven', e: 1, i: 'dates bacon' }),
  p('snack', { id: 'tortilla-espanola', o: 'Tortilla española', l: 'es', de: 'Spanische Kartoffeltortilla', en: 'Spanish potato omelette', c: 'spanish', t: 'veggie kids', i: 'potatoes egg onion olive_oil' }),
  p('snack', { id: 'empanadas', o: 'Empanadas', l: 'es', de: 'Empanadas (gefüllte Teigtaschen)', en: 'Empanadas (filled pastries)', c: 'mexican', t: 'meat kids oven', e: 3, i: 'flour minced_beef onion bell_pepper egg' }),
  p('snack', { id: 'onigiri', o: 'おにぎり', l: 'ja', r: 'Onigiri', de: 'Onigiri (Reisbällchen)', en: 'Onigiri (rice balls)', c: 'japanese', t: 'fish kids', i: 'sushi_rice nori salmon' }),
  p('snack', { id: 'mini-frikadellen', o: 'Mini-Frikadellen', en: 'Mini meatballs', c: 'german', t: 'meat kids', i: 'minced_mixed bread_roll egg onion mustard' }),
  p('snack', { id: 'laugengebaeck', o: 'Laugengebäck', en: 'Pretzel bites', c: 'german', t: 'vegan kids', e: 1, i: 'pretzels' }),
  p(['snack', 'starter'], { id: 'edamame', o: '枝豆', l: 'ja', r: 'Edamame', de: 'Edamame (Sojabohnen)', en: 'Edamame (soybeans)', c: 'japanese', t: 'vegan kids', e: 1, i: 'edamame' }),
  // dips
  p('dip', { id: 'tzatziki', o: 'Τζατζίκι', l: 'el', r: 'Tzatzíki', de: 'Tzatziki', en: 'Tzatziki', c: 'greek', t: 'veggie kids', e: 1, i: 'yogurt cucumber garlic dill olive_oil' }),
  p('dip', { id: 'guacamole', o: 'Guacamole', l: 'es', en: 'Guacamole', c: 'mexican', t: 'vegan', e: 1, i: 'avocado lime tomato red_onion coriander' }),
  p('dip', { id: 'hummus', o: 'حمص', l: 'ar', r: 'Ḥummuṣ', de: 'Hummus', en: 'Hummus', c: 'mideast', t: 'vegan kids', e: 1, i: 'chickpeas tahini lemon garlic olive_oil' }),
  p('dip', { id: 'baba-ganoush', o: 'بابا غنوج', l: 'ar', r: 'Bābā ghanūj', de: 'Baba Ganoush (Auberginencreme)', en: 'Baba ganoush (aubergine dip)', c: 'mideast', t: 'vegan', e: 1, i: 'eggplant tahini lemon garlic' }),
  p('dip', { id: 'kraeuterquark', o: 'Kräuterquark', en: 'Herb quark dip', c: 'german', t: 'veggie kids', e: 1, i: 'quark herbs garlic' }),
  p('dip', { id: 'aioli', o: 'Allioli', l: 'ca', de: 'Aioli', en: 'Aioli', c: 'spanish', t: 'veggie', e: 1, i: 'garlic egg olive_oil lemon' }),
  p('dip', { id: 'obatzda', o: 'Obatzda', en: 'Obatzda (Bavarian cheese spread)', c: 'german', t: 'veggie', e: 1, i: 'camembert butter onion paprika_powder' }),
  p('dip', { id: 'salsa', o: 'Salsa roja', l: 'es', de: 'Tomatensalsa', en: 'Tomato salsa', c: 'mexican', t: 'vegan spicy', e: 1, i: 'tomato red_onion chili lime coriander' }),
  // desserts
  p('dessert', { id: 'tiramisu', o: 'Tiramisù', l: 'it', de: 'Tiramisu', en: 'Tiramisu', c: 'italian', t: 'veggie sweet', i: 'mascarpone ladyfingers coffee egg sugar cocoa' }),
  p('dessert', { id: 'panna-cotta', o: 'Panna cotta', l: 'it', en: 'Panna cotta', c: 'italian', t: 'sweet kids', i: 'cream sugar vanilla gelatine berries' }),
  p('dessert', { id: 'mousse-chocolat', o: 'Mousse au chocolat', l: 'fr', en: 'Chocolate mousse', c: 'french', t: 'veggie sweet kids', i: 'dark_chocolate egg cream sugar' }),
  p('dessert', { id: 'rote-gruetze', o: 'Rote Grütze mit Vanillesoße', en: 'Red berry pudding with vanilla sauce', c: 'german', t: 'veggie sweet kids summer', e: 1, i: 'berries cornstarch sugar milk vanilla' }),
  p('dessert', { id: 'obstsalat', o: 'Obstsalat', en: 'Fruit salad', c: 'german', t: 'vegan sweet kids', e: 1, i: 'apples bananas grapes oranges berries lemon' }),
  p('dessert', { id: 'creme-brulee', o: 'Crème brûlée', l: 'fr', en: 'Crème brûlée', c: 'french', t: 'veggie sweet oven', e: 3, i: 'cream egg sugar vanilla' }),
  p('dessert', { id: 'mango-sticky-rice', o: 'ข้าวเหนียวมะม่วง', l: 'th', r: 'Khao niao mamuang', de: 'Mango mit Klebreis', en: 'Mango sticky rice', c: 'thai', t: 'vegan sweet', i: 'sticky_rice mango coconut_milk sugar' }),
  p('dessert', { id: 'spaghettieis', o: 'Spaghettieis', en: 'Spaghetti ice cream', c: 'german', t: 'veggie sweet kids summer', e: 1, i: 'vanilla_ice_cream strawberries cream white_chocolate' }),
  // cakes
  p('cake', { id: 'kaesekuchen', o: 'Käsekuchen', en: 'German cheesecake', c: 'german', t: 'veggie sweet kids oven', i: 'quark flour butter egg sugar lemon' }),
  p('cake', { id: 'schwarzwaelder', o: 'Schwarzwälder Kirschtorte', en: 'Black Forest gateau', c: 'german', t: 'veggie sweet', e: 3, i: 'cherries cream dark_chocolate flour egg sugar kirsch' }),
  p('cake', { id: 'apfelkuchen', o: 'Apfelkuchen', en: 'Apple cake', c: 'german', t: 'veggie sweet kids oven', i: 'apples flour butter egg sugar cinnamon' }),
  p('cake', { id: 'brownies', o: 'Brownies', l: 'en', en: 'Brownies', c: 'american', t: 'veggie sweet kids oven', e: 1, i: 'dark_chocolate butter sugar egg flour' }),
  p('cake', { id: 'marmorkuchen', o: 'Marmorkuchen', en: 'Marble cake', c: 'german', t: 'veggie sweet kids oven', i: 'flour butter sugar egg cocoa milk' }),
  p('cake', { id: 'muffins', o: 'Muffins', l: 'en', en: 'Muffins', c: 'american', t: 'veggie sweet kids oven', e: 1, i: 'flour butter sugar egg milk berries' }),
  // drinks
  p('drink', { id: 'limonade', o: 'Hausgemachte Limonade', en: 'Homemade lemonade', c: 'german', t: 'vegan kids summer', e: 1, i: 'lemon sugar mint sparkling_water' }),
  p('drink', { id: 'eistee', o: 'Eistee', en: 'Iced tea', c: 'german', t: 'vegan kids summer', e: 1, i: 'black_tea lemon sugar peaches' }),
  p('drink', { id: 'erdbeerbowle', o: 'Erdbeerbowle', en: 'Strawberry punch (with wine)', c: 'german', t: 'vegan summer social', e: 1, i: 'strawberries white_wine sparkling_wine sugar' }),
  p('drink', { id: 'sangria', o: 'Sangría', l: 'es', de: 'Sangria', en: 'Sangria', c: 'spanish', t: 'vegan summer social', e: 1, i: 'red_wine oranges lemon sugar cinnamon' }),
  p('drink', { id: 'gluehwein', o: 'Glühwein', en: 'Mulled wine', c: 'german', t: 'vegan winter social', e: 1, i: 'red_wine oranges cinnamon cloves star_anise sugar' }),
  p('drink', { id: 'kinderpunsch', o: 'Kinderpunsch', en: 'Children’s punch', c: 'german', t: 'vegan kids winter', e: 1, i: 'apple_juice black_tea oranges cinnamon cloves' }),
]
