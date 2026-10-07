import { d } from './define'

/** Components of a German Abendbrot (cold supper) for the Abendbrot builder. */
export const abendbrotDishes = [
  // bread
  d({ id: 'ab-vollkornbrot', o: 'Vollkornbrot', en: 'Wholegrain bread', c: 'german', k: 'side', co: 'abBread', t: 'vegan kids', e: 1, i: 'wholegrain_bread butter' }),
  d({ id: 'ab-bauernbrot', o: 'Bauernbrot', en: 'Rye-wheat farmhouse bread', c: 'german', k: 'side', co: 'abBread', t: 'vegan kids', e: 1, i: 'bread butter' }),
  d({ id: 'ab-brezeln', o: 'Brezen mit Butter', en: 'Pretzels with butter', c: 'german', k: 'side', co: 'abBread', t: 'veggie kids', e: 1, i: 'pretzels butter' }),
  d({ id: 'ab-broetchen', o: 'Aufbackbrötchen', en: 'Bake-off rolls', c: 'german', k: 'side', co: 'abBread', t: 'vegan kids', e: 1, i: 'bread_roll butter' }),
  d({ id: 'ab-knaecke', o: 'Knäckebrot', en: 'Crispbread', c: 'german', k: 'side', co: 'abBread', t: 'vegan kids', e: 1, i: 'crispbread' }),
  // cheese
  d({ id: 'ab-gouda', o: 'Gouda und Butterkäse', en: 'Gouda and butter cheese', c: 'german', k: 'side', co: 'abCheese', t: 'veggie kids', e: 1, i: 'cheese' }),
  d({ id: 'ab-bergkaese', o: 'Bergkäse', en: 'Mountain cheese', c: 'german', k: 'side', co: 'abCheese', t: 'veggie', e: 1, i: 'mountain_cheese' }),
  d({ id: 'ab-camembert', o: 'Camembert', l: 'fr', en: 'Camembert', c: 'french', k: 'side', co: 'abCheese', t: 'veggie', e: 1, i: 'camembert' }),
  d({ id: 'ab-frischkaese', o: 'Frischkäse mit Kräutern', en: 'Herb cream cheese', c: 'german', k: 'side', co: 'abCheese', t: 'veggie kids', e: 1, i: 'cream_cheese herbs' }),
  // cold cuts / fish
  d({ id: 'ab-aufschnitt', o: 'Wurstaufschnitt (Salami, Kochschinken)', en: 'Cold cuts (salami, ham)', c: 'german', k: 'side', co: 'abMeat', t: 'meat kids', e: 1, i: 'cold_cuts ham' }),
  d({ id: 'ab-leberwurst', o: 'Leberwurst', en: 'Liver sausage spread', c: 'german', k: 'side', co: 'abMeat', t: 'meat', e: 1, i: 'liver_sausage' }),
  d({ id: 'ab-fleischsalat', o: 'Fleischsalat', en: 'German meat salad', c: 'german', k: 'side', co: 'abMeat', t: 'meat', e: 1, i: 'cold_cuts gherkins mayonnaise' }),
  d({ id: 'ab-raeucherlachs', o: 'Räucherlachs mit Meerrettich', en: 'Smoked salmon with horseradish', c: 'german', k: 'side', co: 'abFish', t: 'fish', e: 1, i: 'smoked_salmon horseradish lemon' }),
  d({ id: 'ab-matjes', o: 'Matjes mit Zwiebeln', en: 'Matjes herring with onions', c: 'german', k: 'side', co: 'abFish', t: 'fish', e: 1, i: 'matjes onion sour_cream' }),
  // spreads
  d({ id: 'ab-schnittlauchbrot', o: 'Butter mit Schnittlauch', en: 'Butter with chives', c: 'german', k: 'side', co: 'abSpread', t: 'veggie kids', e: 1, i: 'butter chives' }),
  d({ id: 'ab-eiersalat', o: 'Eiersalat', en: 'Egg salad', c: 'german', k: 'side', co: 'abSpread', t: 'veggie kids', e: 1, i: 'egg mayonnaise chives' }),
  d({ id: 'ab-honig', o: 'Honig und Marmelade', en: 'Honey and jam', c: 'german', k: 'side', co: 'abSpread', t: 'veggie sweet kids', e: 1, i: 'honey jam' }),
  // raw vegetables
  d({ id: 'ab-gemuesesticks', o: 'Gemüsesticks (Gurke, Paprika, Karotte, Kohlrabi)', en: 'Vegetable sticks (cucumber, pepper, carrot, kohlrabi)', c: 'german', k: 'side', co: 'abVeg', t: 'vegan kids', e: 1, i: 'cucumber bell_pepper carrot kohlrabi' }),
  d({ id: 'ab-radieschen', o: 'Radieschen und Kirschtomaten', en: 'Radishes and cherry tomatoes', c: 'german', k: 'side', co: 'abVeg', t: 'vegan kids', e: 1, i: 'radish cherry_tomatoes' }),
  d({ id: 'ab-tomatensalat', o: 'Tomatensalat mit Zwiebeln', en: 'Tomato and onion salad', c: 'german', k: 'side', co: 'abVeg', t: 'vegan summer', e: 1, i: 'tomato onion vinegar oil chives' }),
  // extras
  d({ id: 'ab-gurken', o: 'Gewürzgurken', en: 'Gherkins', c: 'german', k: 'side', co: 'abExtra', t: 'vegan kids', e: 1, i: 'gherkins' }),
  d({ id: 'ab-eier', o: 'Gekochte Eier', en: 'Boiled eggs', c: 'german', k: 'side', co: 'abExtra', t: 'veggie kids', e: 1, i: 'egg' }),
  d({ id: 'ab-obst', o: 'Obstteller', en: 'Fruit plate', c: 'german', k: 'side', co: 'abExtra', t: 'vegan kids', e: 1, i: 'apples grapes bananas' }),
]
