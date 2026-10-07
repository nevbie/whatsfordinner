import { d, rc } from './define'
import type { Dish, PartyCourse, Recipe } from '../types'

/**
 * Dinners from the family's recipe notebook (rezepte-digitalisiert.md, entries 2, 19–24, 36),
 * plus recipes for existing dishes (#33/#52, #40).
 */

const withParty = (dish: Dish, party: PartyCourse[]): Dish => {
  dish.party = party
  return dish
}


const kuerbisTaboule = d({
  id: 'kuerbis-taboule', o: 'Kürbis-Taboulé mit Rosinen und Couscous', en: 'Pumpkin tabbouleh with raisins and couscous', c: 'fusion', t: 'veggie winter', i: 'pumpkin couscous red_onion sunflower_seeds raisins mint parsley lemon honey vinegar broth',
  recipe: rc({
    serves: ['4 Portionen', '4 servings'],
    time: ['ca. 45 Min.', 'about 45 min'],
    ing: [
      ['300 ml Gemüsebrühe', '150 g Couscous (oder Bulgur, Hirse, Hafer)', '1 kg Hokkaido-Kürbis', '120 g rote Zwiebeln', '60 g Sonnenblumenkerne', '5 EL weißer Balsamico', '2 TL Honig', '3 EL Rapsöl (plus etwas zum Braten)', '50 g Rosinen (oder getrocknete Cranberrys oder Datteln)', '5 EL Zitronensaft', 'Salz, schwarzer Pfeffer', '1 Bund Minze', '2 Bund glatte Petersilie'],
      ['300 ml vegetable stock', '150 g couscous (or bulgur, millet, oats)', '1 kg Hokkaido pumpkin', '120 g red onions', '60 g sunflower seeds', '5 tbsp white balsamic vinegar', '2 tsp honey', '3 tbsp rapeseed oil (plus a little for frying)', '50 g raisins (or dried cranberries or dates)', '5 tbsp lemon juice', 'Salt, black pepper', '1 bunch mint', '2 bunches flat-leaf parsley'],
    ],
    steps: [
      ['Brühe aufkochen, über den Couscous gießen und zugedeckt etwa 15 Minuten ziehen lassen, dann mit einer Gabel auflockern.', 'Kürbis waschen (Hokkaido muss nicht geschält werden), entkernen und in ca. 1,5 cm große Würfel schneiden. In etwas Öl bei mittlerer bis starker Hitze 10–12 Minuten braten, bis die Würfel weich und leicht gebräunt sind.', 'Zwiebeln in feine Streifen schneiden. Sonnenblumenkerne in einer trockenen Pfanne goldbraun rösten.', 'Für das Dressing Balsamico, Honig, Öl, Zitronensaft, Salz und Pfeffer verrühren, Rosinen und Sonnenblumenkerne dazugeben.', 'Couscous, Kürbis und Zwiebeln in einer großen Schüssel mischen, das Dressing unterheben und kurz durchziehen lassen.', 'Minze und Petersilie hacken, unterheben und den Salat noch einmal abschmecken.'],
      ['Bring the stock to the boil, pour it over the couscous, cover and leave to soak for about 15 minutes, then fluff up with a fork.', 'Wash the pumpkin (no need to peel Hokkaido), remove the seeds and cut into roughly 1.5 cm cubes. Fry in a little oil over medium-high heat for 10–12 minutes until tender and lightly browned.', 'Slice the onions into thin strips. Toast the sunflower seeds in a dry pan until golden.', 'For the dressing, whisk vinegar, honey, oil, lemon juice, salt and pepper, then add the raisins and sunflower seeds.', 'Combine couscous, pumpkin and onions in a large bowl, fold in the dressing and leave to stand briefly.', 'Chop the mint and parsley, fold them in and season the salad once more.'],
    ],
    tip: ['Schmeckt warm und kalt – gut zum Mitnehmen oder fürs Buffet.', 'Good warm or cold – ideal for packed lunches or a buffet.'],
    source: 'Ausdruck',
  }),
})
kuerbisTaboule.party = ['salad', 'main']

const GEO = 'Georgische Rezeptkarten (Artanuji)'

export const notebookDishes: Dish[] = [
  // Suppen
  d({ id: 'zwiebelsuppe', o: 'Zwiebelsuppe', en: 'French onion soup', c: 'french', t: 'veggie winter oven', i: 'onion broth baguette gruyere white_wine butter', n: ['Mit Käse überbackenem Baguette.', 'With cheese-topped baguette, gratinated.'] }),
  d({ id: 'huehnersuppe', o: 'Hühnersuppe', en: 'Chicken soup', c: 'german', t: 'meat winter', i: 'soup_chicken carrot celeriac leek onion parsley pasta' }),
  d({ id: 'mercimek-corbasi', o: 'Mercimek çorbası', l: 'tr', de: 'Rote Linsensuppe', en: 'Red lentil soup', c: 'turkish', t: 'veggie winter', e: 1, i: 'red_lentils onion carrot tomato_paste cumin butter lemon', n: ['Mit Zitrone und Chiliflocken-Butter.', 'With lemon and chilli-flake butter.'] }),
  d({ id: 'tangmian', o: '汤面', l: 'zh', r: 'Tāngmiàn', de: 'Asiatische Nudelsuppe', en: 'Asian noodle soup', c: 'chinese', co: 'meal', t: 'meat', e: 1, i: 'wheat_noodles broth chicken pak_choi egg spring_onion soy_sauce ginger' }),

  // Europäisch
  d({ id: 'semmelknoedel', o: 'Semmelknödel mit Pilzrahmsoße', en: 'Bread dumplings with creamy mushroom sauce', c: 'german', t: 'veggie winter', i: 'bread_roll mushrooms cream milk egg onion parsley butter' }),
  d({ id: 'spinatknoedel', o: 'Spinatknödel mit Butter und Parmesan', en: 'Spinach dumplings with butter and parmesan', c: 'austrian', t: 'veggie', i: 'spinach bread_roll egg milk onion butter parmesan', n: ['Südtiroler Art.', 'South Tyrolean style.'] }),
  d({ id: 'ravioli', o: 'Ravioli', l: 'it', en: 'Ravioli', c: 'italian', t: 'veggie', e: 1, i: 'ravioli butter sage parmesan', n: ['Z. B. mit Salbeibutter oder Tomatensoße.', 'E.g. with sage butter or tomato sauce.'] }),
  d({ id: 'bratkartoffeln-wuerstchen', o: 'Bratkartoffeln mit Würstchen, Erbsen und Möhren', en: 'Fried potatoes with sausages, peas and carrots', c: 'german', t: 'meat', e: 1, i: 'potatoes frankfurters peas carrot onion butter' }),
  d({ id: 'krautnudeln', o: 'Krautnudeln', de: 'Krautnudeln (Krautfleckerl)', en: 'Cabbage noodles (Krautfleckerl)', c: 'austrian', t: 'veggie winter', i: 'white_cabbage pasta onion sugar caraway butter', n: ['Weißkohl in Butter mit etwas Zucker karamellisiert, mit Nudeln vermischt.', 'White cabbage caramelised in butter with a little sugar, tossed with noodles.'] }),
  d({ id: 'wurstsalat', o: 'Wurstsalat mit Brot', en: 'Sausage salad with bread', c: 'german', t: 'meat summer', e: 1, i: 'fleischwurst gherkins onion vinegar oil chives bread' }),

  // Nudeln
  d({ id: 'penne-arrabbiata', g: 'nudeln', o: 'Penne all’arrabbiata', l: 'it', de: 'Penne Arrabbiata', en: 'Penne arrabbiata (spicy tomato sauce)', c: 'italian', t: 'vegan spicy', e: 1, i: 'pasta canned_tomatoes garlic chili olive_oil parsley' }),
  d({ id: 'nudeln-schinken-sahne', g: 'nudeln', o: 'Nudeln mit Schinken-Sahne-Soße', en: 'Pasta with ham and cream sauce', c: 'german', t: 'meat', e: 1, i: 'pasta ham cream onion parmesan' }),
  d({ id: 'nudeln-tomatensosse', g: 'nudeln', o: 'Nudeln mit Tomatensoße', en: 'Pasta with tomato sauce', c: 'italian', t: 'veggie', e: 1, i: 'pasta canned_tomatoes onion garlic basil olive_oil parmesan' }),
  d({ id: 'nudeln-gemuesesosse', g: 'nudeln', o: 'Nudeln mit Gemüsesoße', en: 'Pasta with vegetable sauce', c: 'italian', t: 'veggie', e: 1, i: 'pasta zucchini bell_pepper carrot canned_tomatoes onion garlic parmesan' }),
  d({ id: 'nudeln-brokkoli-mandeln', g: 'nudeln', o: 'Nudeln mit Brokkoli-Sahne-Soße und Mandeln', en: 'Pasta with creamy broccoli sauce and almonds', c: 'german', t: 'veggie', e: 1, i: 'pasta broccoli cream almonds garlic parmesan' }),
  d({ id: 'nudeln-erbsen-schinken', g: 'nudeln', o: 'Nudeln mit Erbsen-Schinken-Sahne', en: 'Pasta with peas, ham and cream', c: 'german', t: 'meat', e: 1, i: 'pasta peas ham cream onion parmesan' }),
  d({ id: 'nudeln-auberginenragout', g: 'nudeln', o: 'Nudeln mit Auberginenragout', en: 'Pasta with aubergine ragout', c: 'italian', t: 'veggie', i: 'pasta eggplant canned_tomatoes onion garlic olive_oil basil parmesan' }),

  // Quiche
  d({ id: 'quiche-lorraine', g: 'quiche', s: 'dough', o: 'Quiche lorraine', l: 'fr', de: 'Quiche Lorraine', en: 'Quiche Lorraine', c: 'french', t: 'meat oven', i: 'flour butter egg cream bacon onion nutmeg' }),
  d({ id: 'quiche-spinat-tomate', g: 'quiche', s: 'dough', o: 'Spinat-Tomaten-Quiche', en: 'Spinach and tomato quiche', c: 'french', t: 'veggie oven', i: 'flour butter egg cream spinach cherry_tomatoes cheese' }),
  d({ id: 'quiche-brokkoli', g: 'quiche', s: 'dough', o: 'Brokkoli-Quiche', en: 'Broccoli quiche', c: 'french', t: 'veggie oven', i: 'flour butter egg cream broccoli cheese' }),

  // Lasagne
  d({ id: 'lasagne-vegetarisch', g: 'lasagne', o: 'Lasagna vegetariana', l: 'it', de: 'Vegetarische Lasagne', en: 'Vegetarian lasagna', c: 'italian', t: 'veggie oven', e: 3, i: 'lasagna_sheets zucchini bell_pepper carrot canned_tomatoes milk butter flour mozzarella parmesan' }),
  d({ id: 'lasagne-spinat-lachs', g: 'lasagne', o: 'Spinat-Lachs-Lasagne', en: 'Spinach and salmon lasagna', c: 'italian', t: 'fish oven', e: 3, i: 'lasagna_sheets salmon spinach milk butter flour parmesan garlic' }),

  // Orientalisch / Türkisch
  d({ id: 'kumpir', o: 'Kumpir', l: 'tr', de: 'Kumpir (gefüllte Ofenkartoffel)', en: 'Kumpir (loaded baked potato)', c: 'turkish', t: 'veggie oven', i: 'potatoes butter cheese corn olives gherkins red_cabbage yogurt', n: ['Riesige Ofenkartoffel mit Butter und Käse zerdrückt, jeder belegt selbst.', 'Huge baked potato mashed with butter and cheese – everyone adds their own toppings.'] }),
  d({ id: 'bulgur-pilavi', o: 'Bulgur pilavı', l: 'tr', de: 'Bulgur-Pilaw', en: 'Bulgur pilaf', c: 'turkish', t: 'veggie', e: 1, i: 'bulgur tomato_paste onion bell_pepper butter broth yogurt', n: ['Mit Joghurt oder Cacık.', 'With yogurt or cacık.'] }),
  d({ id: 'kisir', o: 'Kısır', l: 'tr', de: 'Bulgursalat', en: 'Bulgur salad', c: 'turkish', t: 'vegan summer', e: 1, i: 'bulgur tomato_paste parsley spring_onion mint cucumber lemon pomegranate_molasses olive_oil lettuce' }),
  d({ id: 'gemuese-couscous', o: 'Gemüse-Couscous', en: 'Vegetable couscous', c: 'northafrican', t: 'vegan', i: 'couscous zucchini carrot bell_pepper chickpeas onion ras_el_hanout raisins' }),

  // Asiatisch
  d({ id: 'lachscurry-ofen', o: 'Lachscurry mit Spinat aus dem Ofen', en: 'Oven-baked salmon curry with spinach', c: 'fusion', t: 'fish oven', i: 'salmon spinach coconut_milk curry_paste onion garlic ginger rice' }),
  d({ id: 'thai-curry-haehnchen', g: 'thai-curry', o: 'แกงไก่', l: 'th', r: 'Kaeng kai', de: 'Thai-Curry mit Hähnchen und Gemüse', en: 'Thai curry with chicken and vegetables', c: 'thai', t: 'meat spicy', i: 'chicken curry_paste coconut_milk bell_pepper zucchini carrot thai_basil fish_sauce rice' }),

  kuerbisTaboule,

  // Georgisch
  d({
    id: 'khinkali', o: 'ხინკალი', l: 'ka', r: 'Khinkali', de: 'Chinkali (georgische Fleischteigtaschen)', en: 'Khinkali (Georgian meat dumplings)', c: 'georgian', t: 'meat', e: 3, s: 'dough', i: 'minced_mixed flour onion coriander cumin black_pepper',
    recipe: rc({
      serves: ['4 Portionen (ca. 25 Stück)', '4 servings (about 25 dumplings)'],
      time: ['ca. 1 Std. 30 Min.', 'about 1 h 30 min'],
      ing: [
        ['500 g Mehl', '1 Glas (ca. 250 ml) Wasser', '400 g gemischtes Hackfleisch (Schwein und Rind)', '3 Zwiebeln', '1 Bund Koriander', '1 TL Kreuzkümmel', 'Schwarzer Pfeffer, Salz', 'ca. 150 ml lauwarmes Wasser für die Füllung'],
        ['500 g flour', '1 glass (about 250 ml) water', '400 g mixed minced pork and beef', '3 onions', '1 bunch coriander', '1 tsp cumin', 'Black pepper, salt', 'about 150 ml lukewarm water for the filling'],
      ],
      steps: [
        ['Mehl mit 1 TL Salz und dem Wasser zu einem festen, glatten Teig kneten. Zugedeckt mindestens 30 Minuten ruhen lassen.', 'Zwiebeln sehr fein hacken oder reiben, Koriander hacken. Mit Hackfleisch, Kreuzkümmel, reichlich Pfeffer und Salz mischen.', 'Nach und nach das lauwarme Wasser einkneten, bis die Füllung weich und saftig ist – so entsteht beim Kochen die Brühe in den Taschen.', 'Teig portionsweise dünn (ca. 2 mm) ausrollen und Kreise von etwa 10 cm Durchmesser ausstechen.', 'Je einen Esslöffel Füllung in die Mitte setzen, den Rand rundherum in Falten nach oben legen und oben zu einem kleinen Knoten zusammendrehen.', 'In einem großen Topf reichlich Salzwasser zum Kochen bringen. Die Khinkali portionsweise hineingeben und sanft köcheln lassen, bis sie oben schwimmen, dann noch 2–3 Minuten ziehen lassen.', 'Heiß mit frisch gemahlenem schwarzem Pfeffer servieren. Mit der Hand am Knoten fassen, anbeißen und zuerst die Brühe trinken.'],
        ['Knead the flour with 1 tsp salt and the water into a firm, smooth dough. Cover and rest for at least 30 minutes.', 'Chop or grate the onions very finely and chop the coriander. Mix with the mince, cumin, plenty of pepper and salt.', 'Gradually knead in the lukewarm water until the filling is soft and juicy – this becomes the broth inside the dumplings.', 'Roll out the dough in batches very thinly (about 2 mm) and cut out circles about 10 cm across.', 'Put a tablespoon of filling in the centre of each, pleat the edge upwards all the way round and twist the top into a little knot.', 'Bring a large pot of salted water to the boil. Add the khinkali in batches and simmer gently until they float, then leave them for another 2–3 minutes.', 'Serve hot with freshly ground black pepper. Hold them by the knot, bite a small hole and sip the broth first.'],
      ],
      tip: ['Den Teigknoten isst man traditionell nicht mit.', 'Traditionally the doughy knot is left on the plate.'],
      source: GEO,
    }),
  }),
  d({
    id: 'lobio', o: 'ლობიო ქოთანში', l: 'ka', r: 'Lobio kotanshi', de: 'Lobio (Bohnen im Tontopf)', en: 'Lobio (beans in a clay pot)', c: 'georgian', t: 'vegan winter', i: 'kidney_beans onion garlic coriander mint savory',
    recipe: rc({
      serves: ['4 Portionen', '4 servings'],
      time: ['ca. 2 Std. 30 Min. (plus Einweichen über Nacht)', 'about 2 h 30 min (plus soaking overnight)'],
      ing: [
        ['500 g getrocknete rote Bohnen', '2 Zwiebeln', '2 Knoblauchzehen', '1 Bund Koriander', 'einige Stiele Minze', '1 TL Bohnenkraut (getrocknet)', 'Pfeffer, Salz', 'etwas Öl'],
        ['500 g dried red beans', '2 onions', '2 garlic cloves', '1 bunch coriander', 'a few sprigs of mint', '1 tsp dried summer savory', 'Pepper, salt', 'a little oil'],
      ],
      steps: [
        ['Bohnen über Nacht in reichlich Wasser einweichen.', 'Einweichwasser abgießen, Bohnen mit frischem Wasser bedeckt aufkochen und 1½–2 Stunden köcheln lassen, bis sie ganz weich sind. Erst gegen Ende salzen.', 'Zwiebeln würfeln und in etwas Öl glasig dünsten. Knoblauch mit etwas Salz im Mörser zerstoßen, Koriander und Minze hacken.', 'Zwiebeln, Knoblauch, Kräuter, Bohnenkraut und Pfeffer zu den Bohnen geben und alles kräftig zerdrücken, sodass ein Teil der Bohnen stückig bleibt.', 'Noch einige Minuten köcheln lassen oder im Tontopf (bzw. einer Auflaufform) bei 180 °C Ober-/Unterhitze ca. 15 Minuten im Ofen überbacken.', 'Abschmecken und direkt im Topf servieren.'],
        ['Soak the beans overnight in plenty of water.', 'Drain, cover with fresh water, bring to the boil and simmer for 1½–2 hours until very tender. Salt only towards the end.', 'Dice the onions and soften them in a little oil. Crush the garlic with a little salt in a mortar; chop the coriander and mint.', 'Add onions, garlic, herbs, savory and pepper to the beans and mash vigorously, leaving some beans chunky.', 'Simmer for a few more minutes, or bake in a clay pot (or baking dish) at 180 °C conventional for about 15 minutes.', 'Season and serve straight from the pot.'],
      ],
      tip: ['Dazu passen Mchadi (Maisfladen) und eingelegtes Gemüse.', 'Serve with mchadi (cornbread) and pickled vegetables.'],
      source: GEO,
    }),
  }),
  d({
    id: 'imeruli-khachapuri', o: 'იმერული ხაჭაპური', l: 'ka', r: 'Imeruli khachapuri', de: 'Imeruli Chatschapuri (Käsebrot)', en: 'Imeruli khachapuri (cheese bread)', c: 'georgian', t: 'veggie oven', e: 3, s: 'dough', i: 'flour sulguni sour_milk egg baking_soda',
    recipe: rc({
      serves: ['5 Fladen', '5 flatbreads'],
      time: ['ca. 45 Min. (plus 1–2 Std. Ruhezeit)', 'about 45 min (plus 1–2 h resting)'],
      ing: [
        ['1 kg Mehl', '2 Gläser (ca. 500 ml) Sauermilch oder Matsoni', '2 Eier', '700–800 g Salzlakenkäse (Imeretischer Käse oder Sulguni)', '1 TL Natron', 'Salz'],
        ['1 kg flour', '2 glasses (about 500 ml) soured milk or matsoni', '2 eggs', '700–800 g brined cheese (Imeretian or sulguni)', '1 tsp baking soda', 'Salt'],
      ],
      steps: [
        ['Natron in die Sauermilch rühren und kurz schäumen lassen. Eier und etwas Salz unterrühren.', 'Nach und nach das Mehl einarbeiten und zu einem weichen, nicht klebenden Teig kneten. Zugedeckt 1–2 Stunden ruhen lassen.', 'Käse zerbröseln oder grob reiben (ist er sehr salzig, vorher kurz wässern).', 'Ofen auf 220 °C Ober-/Unterhitze vorheizen.', 'Teig in 5 Portionen teilen. Jede zu einem flachen Kreis drücken, eine Portion Käse in die Mitte geben, den Rand darüber zusammenfassen und gut verschließen.', 'Mit der Naht nach unten vorsichtig zu einem runden, ca. 1 cm dicken Fladen flach drücken.', 'Auf einem Blech mit Backpapier 15–20 Minuten goldbraun backen. Heiß mit Butter bestreichen und in Stücke schneiden.'],
        ['Stir the baking soda into the soured milk and let it foam briefly. Mix in the eggs and a little salt.', 'Gradually work in the flour and knead into a soft dough that no longer sticks. Cover and rest for 1–2 hours.', 'Crumble or coarsely grate the cheese (if it is very salty, soak it briefly first).', 'Preheat the oven to 220 °C conventional.', 'Divide the dough into 5 portions. Press each into a flat round, put a portion of cheese in the middle, gather the edge over it and seal well.', 'Turn seam-side down and carefully press into a round flatbread about 1 cm thick.', 'Bake on a lined tray for 15–20 minutes until golden. Brush with butter while hot and cut into wedges.'],
      ],
      tip: ['Ersatz für georgischen Käse: halb Mozzarella, halb Feta.', 'Substitute for Georgian cheese: half mozzarella, half feta.'],
      source: GEO,
    }),
  }),
  d({
    id: 'mchadi', o: 'მჭადი და ყველი', l: 'ka', r: 'Mchadi da kveli', de: 'Mchadi mit Käse (Maisfladen)', en: 'Mchadi with cheese (Georgian cornbread)', c: 'georgian', t: 'veggie', i: 'cornmeal sulguni oil',
    recipe: rc({
      serves: ['4 Portionen', '4 servings'],
      time: ['ca. 40 Min.', 'about 40 min'],
      ing: [
        ['3 Gläser (ca. 450 g) grobes Maismehl', '1½ Gläser (ca. 375 ml) warmes Wasser', 'Salz', '500 g Käse (Sulguni oder Imeretischer Käse)', 'Öl zum Braten'],
        ['3 glasses (about 450 g) coarse cornmeal', '1½ glasses (about 375 ml) warm water', 'Salt', '500 g cheese (sulguni or Imeretian)', 'Oil for frying'],
      ],
      steps: [
        ['Maismehl mit Salz mischen, das warme Wasser nach und nach zugeben und zu einem formbaren Teig kneten.', 'Mit nassen Händen kleine, längliche, etwa 1,5 cm dicke Fladen formen.', 'Eine Pfanne mit etwas Öl erhitzen, die Fladen hineinlegen und zugedeckt bei schwacher bis mittlerer Hitze langsam braten, bis die Unterseite goldbraun ist.', 'Wenden und ohne Deckel fertig braten, bis auch die zweite Seite knusprig ist.', 'Heiß mit in Scheiben geschnittenem Käse servieren.'],
        ['Mix the cornmeal with salt, gradually add the warm water and knead into a pliable dough.', 'With wet hands, shape small oval cakes about 1.5 cm thick.', 'Heat a little oil in a frying pan, add the cakes, cover and fry slowly over low to medium heat until golden underneath.', 'Turn them over and finish frying uncovered until the second side is crisp too.', 'Serve hot with sliced cheese.'],
      ],
      tip: ['Passt gut zu Lobio.', 'Goes well with lobio.'],
      source: GEO,
    }),
  }),
  withParty(d({
    id: 'pkhali', k: 'party', o: 'ისპანახის ფხალი', l: 'ka', r: 'Ispanakhis pkhali', de: 'Pchali (Spinat-Walnuss-Bällchen)', en: 'Pkhali (spinach and walnut balls)', c: 'georgian', t: 'vegan', i: 'spinach walnuts onion garlic coriander celery fenugreek vinegar pomegranate',
    recipe: rc({
      serves: ['4–6 Portionen als Vorspeise', '4–6 servings as a starter'],
      time: ['ca. 30 Min.', 'about 30 min'],
      ing: [
        ['500 g Spinat', '1 Glas (ca. 100 g) Walnusskerne', '½ Zwiebel', '2 Knoblauchzehen', '½ Bund Koriander', '1 kleine Stange Staudensellerie (oder etwas Selleriegrün)', '½ TL gemahlener Bockshornklee', '1 EL Weinessig', 'Pfeffer, Salz', 'Granatapfelkerne zum Garnieren'],
        ['500 g spinach', '1 glass (about 100 g) walnuts', '½ onion', '2 garlic cloves', '½ bunch coriander', '1 small celery stick (or some celery leaves)', '½ tsp ground fenugreek', '1 tbsp wine vinegar', 'Pepper, salt', 'Pomegranate seeds to garnish'],
      ],
      steps: [
        ['Spinat waschen, 1–2 Minuten in kochendem Wasser blanchieren, kalt abschrecken und sehr gründlich ausdrücken. Fein hacken.', 'Walnüsse mit Knoblauch und etwas Salz im Mixer oder Mörser fein mahlen.', 'Zwiebel, Koriander und Sellerie sehr fein hacken.', 'Spinat, Walnusspaste, Zwiebel, Kräuter, Bockshornklee, Essig und Pfeffer gut verkneten und abschmecken.', 'Zu kleinen Kugeln oder Talern formen, mit dem Daumen eine Mulde eindrücken und mit Granatapfelkernen garnieren. Kalt servieren.'],
        ['Wash the spinach, blanch for 1–2 minutes in boiling water, refresh in cold water and squeeze out very thoroughly. Chop finely.', 'Grind the walnuts with the garlic and a little salt in a blender or mortar.', 'Chop the onion, coriander and celery very finely.', 'Knead spinach, walnut paste, onion, herbs, fenugreek, vinegar and pepper together well and season.', 'Shape into small balls or patties, press a dent into each with your thumb and garnish with pomegranate seeds. Serve cold.'],
      ],
      source: GEO,
    }),
  }), ['starter', 'dip']),
  withParty(d({
    id: 'badrijani-nigvzit', k: 'party', o: 'ნიგვზიანი ბადრიჯანი', l: 'ka', r: 'Nigvziani badrijani', de: 'Badridschani (Auberginenröllchen mit Walnusspaste)', en: 'Badrijani (aubergine rolls with walnut paste)', c: 'georgian', t: 'vegan', e: 3, i: 'eggplant walnuts coriander celery garlic onion oil pomegranate',
    recipe: rc({
      serves: ['ca. 30 Röllchen', 'about 30 rolls'],
      time: ['ca. 1 Std. (plus 1–2 Std. Ziehzeit)', 'about 1 h (plus 1–2 h salting)'],
      ing: [
        ['2 kg Auberginen', '3 Gläser (ca. 300 g) Walnusskerne', '1 Bund Koriander', '½ Bund Staudensellerie oder Selleriegrün', '½ TL getrocknete Gewürzmischung (z. B. Chmeli Suneli)', '4–5 Knoblauchzehen', '1 kleine Zwiebel', 'Öl zum Braten', 'Salz', 'Kerne von 1 Granatapfel'],
        ['2 kg aubergines', '3 glasses (about 300 g) walnuts', '1 bunch coriander', '½ bunch celery or celery leaves', '½ tsp dried spice mix (e.g. khmeli suneli)', '4–5 garlic cloves', '1 small onion', 'Oil for frying', 'Salt', 'Seeds of 1 pomegranate'],
      ],
      steps: [
        ['Auberginen längs in 5–7 mm dicke Scheiben schneiden, von beiden Seiten salzen und 1–2 Stunden Wasser ziehen lassen.', 'Scheiben gut ausdrücken bzw. trocken tupfen und portionsweise in Öl von beiden Seiten goldbraun und weich braten. Auf Küchenpapier abtropfen und abkühlen lassen.', 'Für die Paste Walnüsse, Knoblauch, Zwiebel, Koriander, Sellerie und Gewürze fein mahlen. Mit so viel Wasser verrühren, dass eine streichfähige Paste entsteht, und etwas kräftiger salzen, als man es pur mag.', 'Jede Auberginenscheibe dünn mit Paste bestreichen und von der schmalen Seite her aufrollen.', 'Auf einer Platte anrichten und mit Granatapfelkernen und Korianderblättchen garnieren.'],
        ['Slice the aubergines lengthways 5–7 mm thick, salt both sides and leave for 1–2 hours to draw out the water.', 'Squeeze or pat the slices dry and fry in batches in oil until golden and soft on both sides. Drain on kitchen paper and leave to cool.', 'For the paste, finely grind walnuts, garlic, onion, coriander, celery and spices. Stir in enough water to make a spreadable paste and salt it a little more than tastes right on its own.', 'Spread each aubergine slice thinly with paste and roll up from the narrow end.', 'Arrange on a platter and garnish with pomegranate seeds and coriander leaves.'],
      ],
      tip: ['Lässt sich gut am Vortag vorbereiten.', 'Easy to prepare the day before.'],
      source: GEO,
    }),
  }), ['starter']),
]

/** Recipes for dishes that already exist (attached by id). */
export const NOTEBOOK_RECIPES: Record<string, Recipe> = {
  'haehnchen-suesskartoffel': rc({
    serves: ['4 Portionen', '4 servings'],
    time: ['ca. 45 Min.', 'about 45 min'],
    ing: [
      ['4 Hähnchenfilets (à ca. 150 g)', '1 EL Sonnenblumenöl', 'Marinade: 4 Stiele Thymian, 2 EL Ahornsirup, 3 EL Zitronensaft, Salz, Chilipulver', 'Sauce: 1 Zwiebel, 1 TL Mehl, 150 ml Gemüsebrühe, 4 EL angedickte Preiselbeeren, Pfeffer, Salz', 'Brei: 1 kg Süßkartoffeln, Salz, 50 g Butter, 200 ml Kochwasser'],
      ['4 chicken breast fillets (about 150 g each)', '1 tbsp sunflower oil', 'Marinade: 4 sprigs thyme, 2 tbsp maple syrup, 3 tbsp lemon juice, salt, chilli powder', 'Sauce: 1 onion, 1 tsp flour, 150 ml vegetable stock, 4 tbsp thickened cranberry sauce (lingonberries), pepper, salt', 'Mash: 1 kg sweet potatoes, salt, 50 g butter, 200 ml cooking water'],
    ],
    steps: [
      ['Ofen auf 150 °C Ober-/Unterhitze (Umluft 125 °C) vorheizen.', 'Für die Marinade die Thymianblättchen abzupfen und mit Ahornsirup, Zitronensaft, Salz und Chilipulver verrühren.', 'Hähnchenfilets waschen und trocken tupfen. In einer Pfanne im Öl rundherum ca. 3 Minuten anbraten.', 'Fleisch in eine Auflaufform legen, mit der Marinade bestreichen und im Ofen ca. 15 Minuten garen. Die Pfanne mit dem Bratfett beiseitestellen.', 'Inzwischen die Süßkartoffeln schälen, grob würfeln und in kochendem Salzwasser ca. 15 Minuten garen. Abgießen und dabei das Kochwasser auffangen.', 'Butter und 200 ml Kochwasser zu den Süßkartoffeln geben und grob stampfen.', 'Für die Sauce die Zwiebel würfeln und im Bratfett ca. 4 Minuten anbraten. Mit dem Mehl bestäuben, mit der Brühe ablöschen und aufkochen.', 'Preiselbeeren unterrühren, mit Pfeffer und Salz abschmecken. Hähnchen mit Brei und Sauce servieren.'],
      ['Preheat the oven to 150 °C conventional (125 °C fan oven).', 'For the marinade, strip the thyme leaves and stir them with maple syrup, lemon juice, salt and chilli powder.', 'Wash the chicken fillets and pat dry. Sear in the oil in a frying pan for about 3 minutes on all sides.', 'Put the chicken in a baking dish, brush with the marinade and cook in the oven for about 15 minutes. Keep the pan with the cooking fat.', 'Meanwhile peel the sweet potatoes, cut into rough chunks and boil in salted water for about 15 minutes. Drain, saving the cooking water.', 'Add the butter and 200 ml of the cooking water to the sweet potatoes and mash roughly.', 'For the sauce, dice the onion and fry in the pan fat for about 4 minutes. Dust with the flour, deglaze with the stock and bring to the boil.', 'Stir in the cranberries and season with pepper and salt. Serve the chicken with the mash and sauce.'],
    ],
    family: true,
  }),
  'goi-cuon': rc({
    serves: ['4 Portionen (8 Rollen)', '4 servings (8 rolls)'],
    time: ['ca. 40 Min.', 'about 40 min'],
    ing: [
      ['Dip: 1 Knoblauchzehe, 1 Stück Ingwer, 2 EL Sojasoße, 2 EL Honig, Saft von 1 Limette, 100 g Erdnussbutter', '40 g Reisnudeln', '1 Möhre', '½ Gurke', '½ rote Paprika', '1 Bund Koriander', '¼ Eisbergsalat', '150 g Tofu', '3 EL Öl', '8 Blätter Reispapier'],
      ['Dip: 1 garlic clove, 1 piece of ginger, 2 tbsp soy sauce, 2 tbsp honey, juice of 1 lime, 100 g peanut butter', '40 g rice noodles', '1 carrot', '½ cucumber', '½ red bell pepper', '1 bunch coriander', '¼ iceberg lettuce', '150 g tofu', '3 tbsp oil', '8 rice paper sheets'],
    ],
    steps: [
      ['Für den Dip Knoblauch und Ingwer fein reiben und mit Sojasoße, Honig, Limettensaft und Erdnussbutter verrühren. Mit etwas Wasser cremig rühren.', 'Reisnudeln nach Packungsangabe garen, abschrecken und gut abtropfen lassen.', 'Möhre, Gurke und Paprika in feine Streifen schneiden, Salat in Streifen zupfen, Korianderblättchen abzupfen.', 'Tofu trocken tupfen, in Streifen schneiden und im Öl rundherum knusprig braten.', 'Ein Reispapierblatt kurz in lauwarmes Wasser tauchen und auf ein feuchtes Brett legen.', 'Im unteren Drittel etwas Salat, Nudeln, Gemüse, Tofu und Koriander verteilen. Die Seiten einschlagen und von unten straff aufrollen. Mit den übrigen Blättern ebenso verfahren.', 'Sommerrollen mit dem Erdnussdip servieren.'],
      ['For the dip, finely grate the garlic and ginger and stir with soy sauce, honey, lime juice and peanut butter. Thin with a little water until creamy.', 'Cook the rice noodles according to the packet, rinse under cold water and drain well.', 'Cut the carrot, cucumber and pepper into thin strips, tear the lettuce into strips and pick the coriander leaves.', 'Pat the tofu dry, cut into strips and fry in the oil until crisp all over.', 'Dip a rice paper sheet briefly into lukewarm water and lay it on a damp board.', 'Arrange a little lettuce, noodles, vegetables, tofu and coriander on the lower third. Fold in the sides and roll up tightly from the bottom. Repeat with the remaining sheets.', 'Serve the summer rolls with the peanut dip.'],
    ],
    tip: ['Statt Tofu schmecken auch gegarte Garnelen. Jeder rollt selbst – macht Kindern Spaß.', 'Cooked prawns work instead of tofu. Let everyone roll their own – kids love it.'],
    vegan: ['Honig durch Ahornsirup ersetzen.', 'Replace the honey with maple syrup.'],
    source: 'REWE Deine Küche',
  }),
}
