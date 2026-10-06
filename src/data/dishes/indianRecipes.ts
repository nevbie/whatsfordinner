import type { Recipe } from '../types'

const SRC = 'Indischer Kochkurs'
const P4 = { de: '4 Personen', en: '4 people' }

/** Recipes from the family's "Indischer Kochkurs" booklet (German original, English translation). */
export const indianRecipes: Record<string, Recipe> = {
  'aloo-keema-matar': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 45 Min.', en: 'approx. 45 min' },
    ingredients: {
      de: ['400 g Lamm- oder Rinderhack', '300 g festkochende Kartoffeln, in 1,5-cm-Würfeln', '150 g Erbsen (TK)', '2 Zwiebeln, fein gehackt', '2 Tomaten, fein gehackt (oder 200 g aus der Dose)', '1 EL Ingwer-Knoblauch-Paste', '1–2 grüne Chilis, längs geschlitzt', '3 EL Ghee oder Öl', 'Ganz: 1 Lorbeerblatt, 1 TL Kreuzkümmel, 3 Nelken, 3 Kardamomkapseln, 3 cm Zimtstange', 'Pulver: 1 TL Kurkuma, 1 TL Kashmiri-Chili, 2 TL Koriander, 1 TL Kreuzkümmel, 1 TL Garam Masala', '2 EL Naturjoghurt (optional), Salz, frischer Koriander'],
      en: ['400 g minced lamb or beef', '300 g waxy potatoes, in 1.5 cm cubes', '150 g peas (frozen)', '2 onions, finely chopped', '2 tomatoes, finely chopped (or 200 g canned)', '1 tbsp ginger-garlic paste', '1–2 green chillies, slit lengthwise', '3 tbsp ghee or oil', 'Whole: 1 bay leaf, 1 tsp cumin, 3 cloves, 3 cardamom pods, 3 cm cinnamon stick', 'Ground: 1 tsp turmeric, 1 tsp Kashmiri chilli, 2 tsp coriander, 1 tsp cumin, 1 tsp garam masala', '2 tbsp plain yogurt (optional), salt, fresh coriander'],
    },
    steps: {
      de: ['Ghee erhitzen, ganze Gewürze 30 Sek. anbraten, bis der Kreuzkümmel knistert.', 'Zwiebeln 8–10 Min. goldbraun braten – nicht abkürzen, das gibt die Süße.', 'Ingwer-Knoblauch-Paste und Chilis 1 Min. mitbraten.', 'Hackfleisch zugeben, zerdrücken und kräftig anbraten, bis es krümelig und nicht mehr rosa ist.', 'Gewürzpulver (außer Garam Masala) und Salz 1 Min. rösten. Tomaten und Joghurt einrühren und bhunen, bis sich das Öl absetzt (ca. 8 Min.).', 'Kartoffeln und 200 ml Wasser zugeben, zugedeckt 15 Min. köcheln.', 'Erbsen dazu, 5 Min. ohne Deckel einkochen – Keema ist eher trocken als soßig.', 'Garam Masala und Koriander unterheben, abschmecken.'],
      en: ['Heat the ghee and fry the whole spices for 30 s until the cumin crackles.', 'Fry the onions for 8–10 min until golden – don’t rush, this gives sweetness.', 'Add ginger-garlic paste and chillies, fry 1 min.', 'Add the mince, break it up and brown well until crumbly and no longer pink.', 'Toast the ground spices (except garam masala) and salt for 1 min. Stir in tomatoes and yogurt and bhuno until the oil separates (about 8 min).', 'Add potatoes and 200 ml water, cover and simmer 15 min.', 'Add peas and reduce uncovered for 5 min – keema is rather dry than saucy.', 'Fold in garam masala and coriander, season to taste.'],
    },
    vegan: { de: '120 g Sojagranulat 10 Min. in heißer Gemüsebrühe einweichen, ausdrücken und statt Hack anbraten (oder 400 g gehackte Champignons / 200 g gekochte braune Linsen). Öl statt Ghee, Joghurt weglassen.', en: 'Soak 120 g soy mince in hot vegetable stock for 10 min, squeeze and fry instead of mince (or 400 g chopped mushrooms / 200 g cooked brown lentils). Oil instead of ghee, skip the yogurt.' },
    kids: { de: 'Erbsen abzählen, Gewürze abmessen (ab ca. 7 Jahren). Chili weglassen und am Tisch extra reichen.', en: 'Count peas, measure spices (from about 7). Leave out chilli and serve it separately.' },
  },
  'egg-masala': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 35 Min.', en: 'approx. 35 min' },
    ingredients: {
      de: ['6 Eier', '2 Paprika (klassisch grün), in 2-cm-Stücken', '1 große Zwiebel, 2 Tomaten, fein gehackt', '1 TL Ingwer-Knoblauch-Paste, 1 grüne Chili', '3 EL Öl', '1 TL Kreuzkümmel, optional ½ TL Senfsaat und 8 Curryblätter', '½ TL Kurkuma, 1 TL Kashmiri-Chili, 1½ TL Koriander, ½ TL Garam Masala, ½ TL Kasuri Methi, Salz'],
      en: ['6 eggs', '2 bell peppers (classically green), in 2 cm pieces', '1 large onion, 2 tomatoes, finely chopped', '1 tsp ginger-garlic paste, 1 green chilli', '3 tbsp oil', '1 tsp cumin, optionally ½ tsp mustard seeds and 8 curry leaves', '½ tsp turmeric, 1 tsp Kashmiri chilli, 1½ tsp coriander, ½ tsp garam masala, ½ tsp kasuri methi, salt'],
    },
    steps: {
      de: ['Eier 9 Min. kochen, abschrecken, schälen, rundum leicht einritzen.', '1 EL Öl mit einer Prise Kurkuma, Chili und Salz erhitzen, Eier darin 2 Min. rollen. Herausnehmen.', 'Restliches Öl, Kreuzkümmel (Senfsaat/Curryblätter) anbraten. Zwiebel 6 Min. goldgelb braten.', 'Paste und Chili 1 Min., dann Tomaten und Gewürzpulver zugeben und bhunen, bis sich das Öl absetzt.', 'Paprika 4–5 Min. mitbraten – sie soll noch Biss haben.', 'Eier und 100 ml Wasser dazu, 5 Min. köcheln.', 'Kasuri Methi zerreiben, Garam Masala und Koriander darüber.'],
      en: ['Boil the eggs 9 min, cool, peel and score lightly all round.', 'Heat 1 tbsp oil with a pinch of turmeric, chilli and salt, roll the eggs in it for 2 min. Remove.', 'Fry cumin (mustard seeds/curry leaves) in the remaining oil. Fry the onion 6 min until golden.', 'Add paste and chilli for 1 min, then tomatoes and ground spices; bhuno until the oil separates.', 'Fry the peppers 4–5 min – they should keep some bite.', 'Add the eggs and 100 ml water, simmer 5 min.', 'Crumble over kasuri methi, add garam masala and coriander.'],
    },
    vegan: { de: '400 g festen Tofu würfeln, knusprig anbraten und statt der Eier zugeben; ¼ TL Kala Namak gibt Ei-Geschmack. Oder 1 Dose Kichererbsen (Shimla Mirch Chana).', en: 'Fry 400 g firm tofu cubes until crisp and use instead of eggs; ¼ tsp kala namak tastes like egg. Or 1 can of chickpeas (Shimla Mirch Chana).' },
    tip: { de: 'Passt zu Roti, Kachumber und Minz-Chutney. Masala am Vortag kochen, Eier erst beim Aufwärmen zugeben.', en: 'Goes with roti, kachumber and mint chutney. Make the masala the day before; add the eggs when reheating.' },
  },
  'aloo-gobi': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 40 Min.', en: 'approx. 40 min' },
    ingredients: {
      de: ['1 Blumenkohl (ca. 700 g), in kleinen Röschen', '400 g festkochende Kartoffeln, in 2-cm-Würfeln', '1 Zwiebel, 2 Tomaten, fein gehackt', '1 EL Ingwer-Knoblauch-Paste, 1 grüne Chili', '3 EL Öl, 1 TL Kreuzkümmel', '½ TL Kurkuma, 1 TL Kashmiri-Chili, 1½ TL Koriander, ½ TL Garam Masala, 1 TL Kasuri Methi, Salz', 'optional ½ TL Amchur oder Zitronensaft', '2 cm Ingwer in Streifen, frischer Koriander'],
      en: ['1 cauliflower (approx. 700 g), in small florets', '400 g waxy potatoes, in 2 cm cubes', '1 onion, 2 tomatoes, finely chopped', '1 tbsp ginger-garlic paste, 1 green chilli', '3 tbsp oil, 1 tsp cumin', '½ tsp turmeric, 1 tsp Kashmiri chilli, 1½ tsp coriander, ½ tsp garam masala, 1 tsp kasuri methi, salt', 'optionally ½ tsp amchur or lemon juice', '2 cm ginger in strips, fresh coriander'],
    },
    steps: {
      de: ['Blumenkohl 10 Min. in Salzwasser legen, abtropfen.', 'Kreuzkümmel in Öl anbraten, Zwiebel 5 Min. goldgelb braten.', 'Paste und Chili 1 Min., dann Tomaten und Pulver (außer Garam Masala) bhunen, bis sich das Öl absetzt.', 'Kartoffeln 3 Min. mitbraten, dann Blumenkohl und Salz zugeben und wenden.', 'Zugedeckt bei kleiner Hitze 15–20 Min. garen, nur 2 EL Wasser – das Gemüse gart im eigenen Dampf.', 'Deckel ab, 3–5 Min. braten, bis die Ränder leicht braun werden.', 'Garam Masala, Amchur und Kasuri Methi darüber, mit Ingwer und Koriander bestreuen.'],
      en: ['Soak the cauliflower 10 min in salted water, drain.', 'Fry cumin in oil, fry the onion 5 min until golden.', 'Paste and chilli 1 min, then tomatoes and ground spices (except garam masala); bhuno until the oil separates.', 'Fry potatoes 3 min, then add cauliflower and salt and toss.', 'Cover and cook on low heat 15–20 min with only 2 tbsp water – the vegetables steam in their own moisture.', 'Uncover and fry 3–5 min until the edges brown slightly.', 'Add garam masala, amchur and kasuri methi, sprinkle with ginger and coriander.'],
    },
    tip: { de: 'Knuspriger: Gemüse mit Öl und Gewürzen 25 Min. bei 220 °C im Ofen rösten, dann mit der Masala mischen.', en: 'Crispier: roast the vegetables with oil and spices for 25 min at 220 °C, then mix with the masala.' },
    kids: { de: 'Blumenkohl in kleine Röschen zupfen (ab ca. 5 Jahren).', en: 'Pull the cauliflower into small florets (from about 5).' },
  },
  'palak-paneer': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 35 Min.', en: 'approx. 35 min' },
    ingredients: {
      de: ['500 g frischer Blattspinat (oder 450 g TK)', '250 g Paneer, in 2-cm-Würfeln', '1 Zwiebel, 1 Tomate, gehackt', '1 EL Ingwer-Knoblauch-Paste, 1–2 grüne Chilis', '2 EL Ghee oder Öl, 1 TL Kreuzkümmel', '½ TL Kurkuma, 1 TL Koriander, ½ TL Kashmiri-Chili, ½ TL Garam Masala, 1 TL Kasuri Methi, Salz', '3 EL Sahne', 'optional: 1 EL Ghee mit 2 Knoblauchzehen in Scheiben'],
      en: ['500 g fresh leaf spinach (or 450 g frozen)', '250 g paneer, in 2 cm cubes', '1 onion, 1 tomato, chopped', '1 tbsp ginger-garlic paste, 1–2 green chillies', '2 tbsp ghee or oil, 1 tsp cumin', '½ tsp turmeric, 1 tsp coriander, ½ tsp Kashmiri chilli, ½ tsp garam masala, 1 tsp kasuri methi, salt', '3 tbsp cream', 'optional: 1 tbsp ghee with 2 sliced garlic cloves'],
    },
    steps: {
      de: ['Spinat 1–2 Min. blanchieren, in Eiswasser legen, ausdrücken und mit den Chilis und 3–4 EL Wasser pürieren.', 'Paneer 10 Min. in warmes Salzwasser legen (oder in Ghee goldbraun braten).', 'Kreuzkümmel in Ghee anbraten, Zwiebel 6–8 Min. goldbraun braten.', 'Paste 1 Min., dann Tomate und Pulver (außer Garam Masala) bhunen, bis sich das Öl absetzt.', 'Spinatpüree und 100 ml Wasser 5 Min. köcheln – nicht länger, sonst wird er olivgrün.', 'Paneer, Garam Masala, Kasuri Methi und Sahne zugeben, 2 Min. ziehen lassen.', 'Optional: Knoblauch in Ghee bräunen und als Tadka darübergießen.'],
      en: ['Blanch the spinach 1–2 min, plunge into ice water, squeeze and blend with the chillies and 3–4 tbsp water.', 'Soak paneer 10 min in warm salted water (or fry golden in ghee).', 'Fry cumin in ghee, fry the onion 6–8 min until golden.', 'Paste 1 min, then tomato and ground spices (except garam masala); bhuno until the oil separates.', 'Simmer spinach purée with 100 ml water for 5 min – no longer or it turns olive green.', 'Add paneer, garam masala, kasuri methi and cream, let stand 2 min.', 'Optional: brown garlic in ghee and pour over as tadka.'],
    },
    tip: { de: 'Paneer selbst machen: 2 l Vollmilch aufkochen, 4 EL Zitronensaft einrühren, durch ein Tuch abgießen, 1 Std. beschweren. Ergibt ca. 250 g.', en: 'Homemade paneer: bring 2 l whole milk to the boil, stir in 4 tbsp lemon juice, strain through a cloth, press for 1 h. Makes approx. 250 g.' },
    vegan: { de: '300 g festen Tofu knusprig anbraten (Palak Tofu); Cashewcreme oder Kokosmilch statt Sahne, Öl statt Ghee.', en: 'Fry 300 g firm tofu until crisp (palak tofu); cashew cream or coconut milk instead of cream, oil instead of ghee.' },
  },
  'masoor-dal': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 30 Min.', en: 'approx. 30 min' },
    ingredients: {
      de: ['200 g rote Linsen', '800 ml Wasser, ½ TL Kurkuma, 1 TL Salz', '1 Tomate, gehackt', 'Tadka: 2 EL Ghee oder Öl, 1 TL Kreuzkümmel, 2 getrocknete rote Chilis, 1 Prise Hing, 3 Knoblauchzehen in Scheiben, 1 kleine Zwiebel (optional), ½ TL Kashmiri-Chili', 'Saft ½ Zitrone, frischer Koriander'],
      en: ['200 g red lentils', '800 ml water, ½ tsp turmeric, 1 tsp salt', '1 tomato, chopped', 'Tadka: 2 tbsp ghee or oil, 1 tsp cumin, 2 dried red chillies, 1 pinch hing, 3 garlic cloves sliced, 1 small onion (optional), ½ tsp Kashmiri chilli', 'Juice of ½ lemon, fresh coriander'],
    },
    steps: {
      de: ['Linsen waschen, bis das Wasser klar ist.', 'Mit Wasser, Kurkuma und Tomate aufkochen, abschäumen, 20 Min. halb zugedeckt köcheln. Kräftig verrühren, salzen – wie eine dicke Suppe.', 'Tadka kurz vor dem Servieren: Ghee erhitzen, Kreuzkümmel und Chilis anbraten, Hing, dann Knoblauch (und Zwiebel) goldbraun. Vom Herd, Chilipulver einrühren.', 'Tadka zischend über das Dal gießen, Zitrone und Koriander dazu.'],
      en: ['Wash the lentils until the water runs clear.', 'Bring to the boil with water, turmeric and tomato, skim, simmer half-covered 20 min. Whisk well and salt – like a thick soup.', 'Tadka just before serving: heat ghee, fry cumin and chillies, add hing, then garlic (and onion) until golden. Off the heat, stir in chilli powder.', 'Pour the sizzling tadka over the dal, add lemon and coriander.'],
    },
    tip: { de: 'Bengalische Variante: Tadka mit Senföl, Panch Phoron und 2 roten Chilis.', en: 'Bengali variant: tadka with mustard oil, panch phoron and 2 red chillies.' },
    kids: { de: 'Linsen waschen, bis das Wasser klar ist (ab ca. 5 Jahren).', en: 'Wash the lentils until the water runs clear (from about 5).' },
  },
  'pudina-chutney': {
    source: SRC,
    serves: { de: '1 kleines Glas', en: '1 small jar' },
    time: { de: '10 Min.', en: '10 min' },
    ingredients: {
      de: ['1 großes Bund Minze (ca. 40 g Blätter)', '1 kleine Handvoll Koriander (optional)', '½ kleine Zwiebel', '1–2 grüne Chilis, 2 cm Ingwer', 'Saft ½ Zitrone, ½ TL gerösteter Kreuzkümmel, ½ TL Zucker, Salz, 1 Prise Kala Namak', '2–3 EL Eiswasser'],
      en: ['1 large bunch of mint (approx. 40 g leaves)', '1 small handful coriander (optional)', '½ small onion', '1–2 green chillies, 2 cm ginger', 'Juice of ½ lemon, ½ tsp roasted cumin, ½ tsp sugar, salt, 1 pinch kala namak', '2–3 tbsp ice water'],
    },
    steps: {
      de: ['Minzblätter abzupfen – Stängel machen es bitter.', 'Alles fein pürieren, nur so viel Eiswasser wie nötig.', 'Abschmecken: frisch, sauer, scharf. Am selben Tag essen.'],
      en: ['Pick the mint leaves – stems make it bitter.', 'Blend everything finely with as little ice water as needed.', 'Season: fresh, sour, hot. Eat the same day.'],
    },
    tip: { de: 'Joghurt-Variante: 2 EL Chutney unter 150 g Joghurt – milder Dip für Kinder.', en: 'Yogurt version: 2 tbsp chutney into 150 g yogurt – a mild dip for kids.' },
  },
  'kokos-chutney': {
    source: SRC,
    serves: { de: '1 Schälchen, 4 Personen', en: '1 small bowl, 4 people' },
    time: { de: '20 Min.', en: '20 min' },
    ingredients: {
      de: ['100 g frische Kokosnuss, geraspelt (oder TK-Kokos; Ersatz: 60 g Kokosraspel eingeweicht)', '2 EL Chana Dal', '½ Bund Koriander', '2 grüne Chilis, 1 cm Ingwer', '1 TL Tamarindenpaste oder Saft ½ Limette, Salz', 'ca. 100 ml Wasser', 'Tadka: 1 EL Kokosöl, ½ TL Senfsaat, ½ TL Urad Dal (optional), 1 getrocknete rote Chili, 8–10 Curryblätter, 1 Prise Hing'],
      en: ['100 g fresh coconut, grated (or frozen; substitute: 60 g desiccated coconut, soaked)', '2 tbsp chana dal', '½ bunch coriander', '2 green chillies, 1 cm ginger', '1 tsp tamarind paste or juice of ½ lime, salt', 'approx. 100 ml water', 'Tadka: 1 tbsp coconut oil, ½ tsp mustard seeds, ½ tsp urad dal (optional), 1 dried red chilli, 8–10 curry leaves, 1 pinch hing'],
    },
    steps: {
      de: ['Chana Dal trocken 3–4 Min. goldbraun rösten, Chilis die letzten 30 Sek. mitrösten. Abkühlen.', 'Chana Dal zuerst allein fein mahlen.', 'Kokos, Koriander, Chilis, Ingwer, Tamarinde, Salz und halbes Wasser zu einer dicken, leicht körnigen Paste mixen.', 'Tadka: Kokosöl erhitzen, Senfsaat springen lassen, Urad Dal bräunen, Chili, Curryblätter und Hing – sofort über das Chutney gießen.'],
      en: ['Dry-roast the chana dal 3–4 min until golden, add the chillies for the last 30 s. Cool.', 'Grind the chana dal finely on its own first.', 'Blend coconut, coriander, chillies, ginger, tamarind, salt and half the water to a thick, slightly grainy paste.', 'Tadka: heat coconut oil, let the mustard seeds pop, brown the urad dal, add chilli, curry leaves and hing – pour over the chutney immediately.'],
    },
  },
  raita: {
    source: SRC,
    serves: P4,
    time: { de: '10 Min.', en: '10 min' },
    ingredients: {
      de: ['400 g Naturjoghurt (3,5 %)', '½ Salatgurke, grob geraspelt', '½ TL gerösteter, gemahlener Kreuzkümmel', 'Salz, 1 Prise Kala Namak, 1 Prise Chili', 'einige Minzblätter'],
      en: ['400 g plain yogurt (3.5 %)', '½ cucumber, coarsely grated', '½ tsp roasted ground cumin', 'salt, 1 pinch kala namak, 1 pinch chilli', 'a few mint leaves'],
    },
    steps: {
      de: ['Kreuzkümmel ohne Fett rösten und mörsern – das ist der Geschmack von Raita.', 'Gurke salzen, 5 Min. stehen lassen, kräftig ausdrücken.', 'Joghurt glatt rühren, Gurke und Gewürze unterheben, mit Chili und Minze bestreuen. Kalt servieren.'],
      en: ['Dry-roast the cumin and grind it – that is the taste of raita.', 'Salt the cucumber, leave 5 min, squeeze firmly.', 'Stir the yogurt smooth, fold in cucumber and spices, sprinkle with chilli and mint. Serve cold.'],
    },
    vegan: { de: 'Ungesüßter Soja- oder Kokosjoghurt, evtl. ein Spritzer Zitrone.', en: 'Unsweetened soy or coconut yogurt, maybe a squeeze of lemon.' },
    kids: { de: '„Gurken-Joghurt mit Zauberpulver“: Gurke raspeln und ausdrücken, Joghurt rühren (ab ca. 5 Jahren).', en: '“Cucumber yogurt with magic powder”: grate and squeeze the cucumber, stir the yogurt (from about 5).' },
  },
  roti: {
    source: SRC,
    serves: { de: '8 Stück', en: '8 pieces' },
    time: { de: 'Teig 10 Min. + 30 Min. Ruhe, Backen 15 Min.', en: 'Dough 10 min + 30 min rest, cooking 15 min' },
    ingredients: {
      de: ['250 g Atta (Chapati-Mehl) – Ersatz: 150 g feines Weizenvollkornmehl + 100 g Type 550', 'ca. 170 ml lauwarmes Wasser, ½ TL Salz, 1 TL Öl', 'Atta zum Ausrollen, optional Ghee zum Bestreichen'],
      en: ['250 g atta (chapati flour) – substitute: 150 g fine wholemeal flour + 100 g plain flour', 'approx. 170 ml lukewarm water, ½ tsp salt, 1 tsp oil', 'atta for rolling, optional ghee for brushing'],
    },
    steps: {
      de: ['Mehl und Salz mischen, Wasser nach und nach zugeben, 8–10 Min. weich kneten, Öl einkneten. 30 Min. ruhen lassen.', '8 Kugeln formen, auf 15–18 cm ausrollen – gleichmäßig dünn ist wichtiger als rund.', 'Pfanne ohne Fett stark erhitzen, Roti auflegen, wenden, sobald Bläschen erscheinen (ca. 30 Sek.).', 'Zweite Seite 40 Sek. backen, bis braune Punkte kommen.', 'Phulka-Trick: mit der Zange über die Gasflamme halten – es bläst sich auf. Auf Elektroherd: mit einem Tuch auf die Ränder drücken.', 'In ein Tuch gewickelt warm halten, optional mit Ghee bestreichen.'],
      en: ['Mix flour and salt, add water gradually, knead 8–10 min until soft, knead in the oil. Rest 30 min.', 'Form 8 balls, roll out to 15–18 cm – even thickness matters more than roundness.', 'Heat a dry pan until very hot, cook the roti, flip when small bubbles appear (about 30 s).', 'Cook the second side 40 s until brown spots appear.', 'Phulka trick: hold over a gas flame with tongs – it puffs up. On electric hobs: press the edges with a cloth.', 'Keep warm wrapped in a cloth, optionally brush with ghee.'],
    },
    kids: { de: '„Luftballon-Brot“: Teig kneten, Kugeln rollen, ausrollen (ab ca. 6 Jahren); Erwachsene backen.', en: '“Balloon bread”: knead, roll balls, roll out (from about 6); adults do the cooking.' },
  },
  naan: {
    source: SRC,
    serves: { de: '8 Stück', en: '8 pieces' },
    time: { de: 'Teig 15 Min. + 1,5–2 Std. Gehzeit, Backen 20 Min.', en: 'Dough 15 min + 1.5–2 h rising, cooking 20 min' },
    ingredients: {
      de: ['400 g Weizenmehl Type 550', '1 Päckchen Trockenhefe, 1 TL Zucker', '1 TL Salz, ½ TL Backpulver', '125 g Naturjoghurt, ca. 150 ml lauwarme Milch, 2 EL Öl', 'Butter-Naan: 50 g Butter, geschmolzen', 'Garlic-Naan: zusätzlich 4 Knoblauchzehen, 2 EL Koriander, optional 1 TL Nigella'],
      en: ['400 g plain flour', '1 sachet dried yeast, 1 tsp sugar', '1 tsp salt, ½ tsp baking powder', '125 g plain yogurt, approx. 150 ml lukewarm milk, 2 tbsp oil', 'Butter naan: 50 g melted butter', 'Garlic naan: additionally 4 garlic cloves, 2 tbsp coriander, optionally 1 tsp nigella'],
    },
    steps: {
      de: ['Hefe und Zucker in der Milch auflösen, 5 Min. schäumen lassen.', 'Mit Mehl, Salz, Backpulver, Joghurt und Öl 8 Min. kneten, gehen lassen, bis er sich verdoppelt.', 'In 8 Stücke teilen, 10 Min. entspannen, oval ca. 5 mm dick ausziehen. Für Garlic-Naan Knoblauch, Koriander, Nigella aufdrücken.', 'Gusseisenpfanne sehr heiß, Unterseite befeuchten, feuchte Seite nach unten, Deckel drauf, 1 Min.', 'Wenden und Oberseite 30–40 Sek. bräunen (oder über der Gasflamme).', 'Sofort mit Butter bestreichen.'],
      en: ['Dissolve yeast and sugar in the milk, leave 5 min until foamy.', 'Knead with flour, salt, baking powder, yogurt and oil for 8 min, let rise until doubled.', 'Divide into 8, rest 10 min, stretch into ovals about 5 mm thick. For garlic naan press on garlic, coriander, nigella.', 'Heat a cast-iron pan very hot, wet the underside, place wet side down, cover, 1 min.', 'Flip and brown the top 30–40 s (or over a gas flame).', 'Brush with butter immediately.'],
    },
    tip: { de: 'Ofen-Methode: Grill auf 275 °C mit Pizzastein, 2–3 Min.', en: 'Oven method: grill at 275 °C with a pizza stone, 2–3 min.' },
  },
  basmati: {
    source: SRC,
    serves: P4,
    time: { de: '30 Min. Einweichen + 25 Min.', en: '30 min soaking + 25 min' },
    ingredients: {
      de: ['300 g Basmati', '450 ml Wasser (1 : 1,5 nach dem Einweichen)', '½ TL Salz, 1 TL Ghee oder Öl', 'Jeera Rice: zusätzlich 1 TL Kreuzkümmel, 1 Lorbeerblatt, 2 Kardamomkapseln'],
      en: ['300 g basmati', '450 ml water (1 : 1.5 after soaking)', '½ tsp salt, 1 tsp ghee or oil', 'Jeera rice: additionally 1 tsp cumin, 1 bay leaf, 2 cardamom pods'],
    },
    steps: {
      de: ['Reis 3–4 Mal waschen, bis das Wasser fast klar ist.', '30 Min. einweichen, gut abtropfen – so brechen die Körner nicht.', 'Für Jeera Rice: Kreuzkümmel, Lorbeer, Kardamom 30 Sek. in Ghee anbraten, Reis 1 Min. mitschwenken.', 'Wasser und Salz zugeben, aufkochen, Deckel drauf, kleinste Stufe 12 Min. Nicht umrühren!', 'Vom Herd, 10 Min. ruhen lassen, mit der Gabel auflockern.'],
      en: ['Wash the rice 3–4 times until the water is almost clear.', 'Soak 30 min, drain well – that keeps the grains whole.', 'For jeera rice: fry cumin, bay leaf and cardamom in ghee 30 s, toss the rice in for 1 min.', 'Add water and salt, bring to the boil, cover, lowest heat 12 min. Don’t stir!', 'Off the heat, rest 10 min, fluff with a fork.'],
    },
    tip: { de: 'Reste-Tipp: Kalter Reis wird zu Lemon Rice.', en: 'Leftover tip: cold rice becomes lemon rice.' },
  },
  'mango-lassi': {
    source: SRC,
    serves: { de: '4 Gläser', en: '4 glasses' },
    time: { de: '10 Min.', en: '10 min' },
    ingredients: {
      de: ['400 g Mangopüree (Dose, Alphonso oder Kesar) oder 2 sehr reife Mangos', '400 g Naturjoghurt, gekühlt', '200 ml kalte Milch', '1–2 EL Zucker oder Honig (Dosenpüree ist oft schon süß)', '¼ TL Kardamom, 4–6 Eiswürfel', 'optional: Safranfäden, gehackte Pistazien'],
      en: ['400 g mango purée (canned, Alphonso or Kesar) or 2 very ripe mangoes', '400 g plain yogurt, chilled', '200 ml cold milk', '1–2 tbsp sugar or honey (canned purée is often sweetened)', '¼ tsp cardamom, 4–6 ice cubes', 'optional: saffron threads, chopped pistachios'],
    },
    steps: {
      de: ['Frische Mangos schälen, Fruchtfleisch vom Stein schneiden.', 'Alles im Mixer 1 Min. schaumig mixen.', 'Abschmecken: zu dick → Milch, zu sauer → Zucker.', 'In Gläser füllen, mit Safranmilch und Pistazien garnieren.'],
      en: ['Peel fresh mangoes and cut the flesh off the stone.', 'Blend everything 1 min until frothy.', 'Adjust: too thick → milk, too sour → sugar.', 'Pour into glasses, garnish with saffron milk and pistachios.'],
    },
    vegan: { de: 'Sojajoghurt und Hafer- oder Kokosmilch.', en: 'Soy yogurt and oat or coconut milk.' },
  },
  kachumber: {
    source: SRC,
    serves: P4,
    time: { de: '10 Min.', en: '10 min' },
    ingredients: {
      de: ['1 Salatgurke, 2 Tomaten, 1 rote Zwiebel', '1 grüne Chili (optional), ½ Bund Koriander', 'Saft 1 Zitrone, ½ TL gerösteter Kreuzkümmel, Salz, 1 Prise Chaat Masala'],
      en: ['1 cucumber, 2 tomatoes, 1 red onion', '1 green chilli (optional), ½ bunch coriander', 'Juice of 1 lemon, ½ tsp roasted cumin, salt, 1 pinch chaat masala'],
    },
    steps: {
      de: ['Gurke, Tomaten, Zwiebel in 5-mm-Würfel, Chili und Koriander fein hacken.', 'Erst kurz vor dem Servieren mit Zitrone und Gewürzen mischen.'],
      en: ['Dice cucumber, tomatoes and onion (5 mm), finely chop chilli and coriander.', 'Mix with lemon and spices just before serving.'],
    },
  },
  'jeera-aloo': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 30 Min.', en: 'approx. 30 min' },
    ingredients: {
      de: ['600 g festkochende Kartoffeln', '3 EL Öl, 1½ TL Kreuzkümmel, 1 grüne Chili, 1 TL geriebener Ingwer', '½ TL Kurkuma, 1 TL Koriander, ½ TL Kashmiri-Chili, ½ TL Amchur, Salz, frischer Koriander'],
      en: ['600 g waxy potatoes', '3 tbsp oil, 1½ tsp cumin, 1 green chilli, 1 tsp grated ginger', '½ tsp turmeric, 1 tsp coriander, ½ tsp Kashmiri chilli, ½ tsp amchur, salt, fresh coriander'],
    },
    steps: {
      de: ['Kartoffeln in der Schale bissfest kochen, abkühlen, schälen, würfeln.', 'Kreuzkümmel in Öl knistern lassen, Chili und Ingwer kurz, Pulver 20 Sek. rösten.', 'Kartoffeln und Salz 5–7 Min. braten, bis sie eine goldene Kruste haben.', 'Mit Amchur und Koriander bestreuen.'],
      en: ['Boil potatoes in their skins until just done, cool, peel, dice.', 'Let cumin crackle in oil, briefly fry chilli and ginger, toast ground spices 20 s.', 'Fry potatoes with salt 5–7 min until golden-crusted.', 'Sprinkle with amchur and coriander.'],
    },
  },
  'chana-masala': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 35 Min.', en: 'approx. 35 min' },
    ingredients: {
      de: ['2 Dosen Kichererbsen (ca. 480 g abgetropft)', '2 Zwiebeln, 3 Tomaten, fein gehackt', '1 EL Ingwer-Knoblauch-Paste, 1–2 grüne Chilis, 3 EL Öl', '1 TL Kreuzkümmel, 1 Lorbeerblatt', '½ TL Kurkuma, 1 TL Kashmiri-Chili, 2 TL Koriander, 1 TL Garam Masala, 1 TL Amchur, Salz', 'Ingwerstreifen und Koriander'],
      en: ['2 cans chickpeas (approx. 480 g drained)', '2 onions, 3 tomatoes, finely chopped', '1 tbsp ginger-garlic paste, 1–2 green chillies, 3 tbsp oil', '1 tsp cumin, 1 bay leaf', '½ tsp turmeric, 1 tsp Kashmiri chilli, 2 tsp coriander, 1 tsp garam masala, 1 tsp amchur, salt', 'ginger strips and coriander'],
    },
    steps: {
      de: ['Kreuzkümmel und Lorbeer in Öl anbraten, Zwiebeln 10 Min. dunkelgolden braten.', 'Paste und Chilis 1 Min., dann Tomaten und Pulver (außer Garam Masala und Amchur) bhunen.', 'Kichererbsen und 300 ml Wasser 15 Min. köcheln, einige zerdrücken, damit die Soße sämig wird.', 'Garam Masala und Amchur einrühren, mit Ingwer und Koriander bestreuen.'],
      en: ['Fry cumin and bay leaf in oil, fry onions 10 min until deep golden.', 'Paste and chillies 1 min, then tomatoes and ground spices (except garam masala and amchur); bhuno.', 'Simmer chickpeas with 300 ml water 15 min, mash some to thicken the sauce.', 'Stir in garam masala and amchur, sprinkle with ginger and coriander.'],
    },
    tip: { de: 'Ein Beutel Schwarztee, 10 Min. mitgekocht, gibt die dunkle Farbe der Pindi Chole.', en: 'A black tea bag simmered for 10 min gives the dark colour of Pindi chole.' },
  },
  'bhindi-masala': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 30 Min.', en: 'approx. 30 min' },
    ingredients: {
      de: ['500 g Okra', '2 Zwiebeln in Streifen, 1 Tomate, gehackt', '1 TL Ingwer-Knoblauch-Paste, 3 EL Öl, 1 TL Kreuzkümmel', '½ TL Kurkuma, 1 TL Kashmiri-Chili, 1½ TL Koriander, ½ TL Amchur, ½ TL Garam Masala, Salz'],
      en: ['500 g okra', '2 onions in strips, 1 tomato, chopped', '1 tsp ginger-garlic paste, 3 tbsp oil, 1 tsp cumin', '½ tsp turmeric, 1 tsp Kashmiri chilli, 1½ tsp coriander, ½ tsp amchur, ½ tsp garam masala, salt'],
    },
    steps: {
      de: ['Okra waschen und ganz trocken tupfen – Nässe macht sie schleimig. In 2-cm-Stücke schneiden.', 'In 2 EL Öl ohne Deckel 8–10 Min. braten. Herausnehmen.', 'Kreuzkümmel, Zwiebeln 6 Min., dann Paste, Tomate und Pulver bhunen.', 'Okra zurück, erst jetzt salzen, 3 Min. braten. Amchur und Garam Masala darüber.'],
      en: ['Wash the okra and pat completely dry – moisture makes it slimy. Cut into 2 cm pieces.', 'Fry in 2 tbsp oil uncovered 8–10 min. Remove.', 'Cumin, onions 6 min, then paste, tomato and ground spices; bhuno.', 'Return the okra, salt only now, fry 3 min. Add amchur and garam masala.'],
    },
  },
  dosa: {
    source: SRC,
    serves: { de: 'ca. 12 Dosas', en: 'approx. 12 dosas' },
    time: { de: '6 Std. Einweichen + 8–12 Std. Fermentieren', en: '6 h soaking + 8–12 h fermenting' },
    ingredients: {
      de: ['300 g Reis (Parboiled oder Langkorn)', '100 g geschälte Urad Dal', '½ TL Bockshornkleesamen, 1 TL Salz', 'Öl oder Ghee zum Ausbacken'],
      en: ['300 g rice (parboiled or long grain)', '100 g split hulled urad dal', '½ tsp fenugreek seeds, 1 tsp salt', 'oil or ghee for frying'],
    },
    steps: {
      de: ['Reis und Urad Dal (mit Bockshornklee) getrennt 6 Std. einweichen.', 'Getrennt mit wenig Wasser fein mahlen, mischen, salzen.', 'Zugedeckt warm 8–12 Std. fermentieren, bis der Teig Blasen wirft.', 'Pfanne mit Öl abreiben, eine Kelle Teig spiralförmig dünn ausstreichen.', 'Öl darüberträufeln, 2 Min. knusprig backen, zusammenklappen.'],
      en: ['Soak rice and urad dal (with fenugreek) separately for 6 h.', 'Grind separately with little water, mix, salt.', 'Cover and ferment somewhere warm 8–12 h until bubbly.', 'Wipe a pan with oil, spread a ladle of batter thinly in a spiral.', 'Drizzle with oil, cook 2 min until crisp, fold.'],
    },
    tip: { de: 'Idli: Teig dicker lassen, in der Idli-Form 10–12 Min. dämpfen. Masala Dosa: mit gewürzten Kartoffeln füllen. Am Vortag beginnen!', en: 'Idli: keep the batter thicker, steam 10–12 min in an idli mould. Masala dosa: fill with spiced potatoes. Start the day before!' },
  },
  'onion-pakora': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 30 Min.', en: 'approx. 30 min' },
    ingredients: {
      de: ['3 Zwiebeln, in dünnen Halbringen', '120 g Kichererbsenmehl (Besan), 2 EL Reismehl', '1 grüne Chili, ½ Bund Koriander', '½ TL Ajwain, ½ TL Kurkuma, ½ TL Kashmiri-Chili, 1 TL Salz', '3–4 EL Wasser, Öl zum Frittieren'],
      en: ['3 onions, thinly sliced into half rings', '120 g chickpea flour (besan), 2 tbsp rice flour', '1 green chilli, ½ bunch coriander', '½ tsp ajwain, ½ tsp turmeric, ½ tsp Kashmiri chilli, 1 tsp salt', '3–4 tbsp water, oil for deep-frying'],
    },
    steps: {
      de: ['Zwiebeln mit dem Salz verkneten, 10 Min. ziehen lassen.', 'Mehl, Gewürze, Chili und Koriander untermischen, nur so viel Wasser, dass es klebt.', 'Bei 175 °C kleine Häufchen 4–5 Min. goldbraun frittieren.'],
      en: ['Knead the onions with the salt, leave 10 min.', 'Mix in flour, spices, chilli and coriander, with just enough water to bind.', 'Deep-fry small heaps at 175 °C for 4–5 min until golden.'],
    },
    kids: { de: 'Frittieren ist Sache der Erwachsenen.', en: 'Deep-frying is for adults only.' },
  },
  papad: {
    source: SRC,
    serves: P4,
    time: { de: '5 Min.', en: '5 min' },
    ingredients: { de: ['8 Papad aus dem Indienladen', 'für Masala Papad: etwas Kachumber und Chaat Masala'], en: ['8 papads from the Indian shop', 'for masala papad: some kachumber and chaat masala'] },
    steps: {
      de: ['Mit der Zange über der Gasflamme rösten oder einzeln 40–60 Sek. in die Mikrowelle.', 'Masala Papad: sofort mit Kachumber belegen, mit Chaat Masala bestreuen.'],
      en: ['Toast over a gas flame with tongs or microwave individually 40–60 s.', 'Masala papad: top with kachumber immediately and sprinkle with chaat masala.'],
    },
  },
  achar: {
    source: SRC,
    serves: { de: '1 Glas', en: '1 jar' },
    time: { de: '15 Min. + 1 Tag ziehen', en: '15 min + 1 day' },
    ingredients: {
      de: ['2 Karotten in Stiften, 4 grüne Chilis, längs halbiert', '1 TL Salz, ½ TL Kurkuma, Saft 1 Zitrone', '3 EL Senföl, 1 TL Senfsaat (gemörsert), ½ TL Bockshornklee, 1 Prise Hing, ½ TL Kashmiri-Chili'],
      en: ['2 carrots in sticks, 4 green chillies halved lengthwise', '1 tsp salt, ½ tsp turmeric, juice of 1 lemon', '3 tbsp mustard oil, 1 tsp mustard seeds (crushed), ½ tsp fenugreek, 1 pinch hing, ½ tsp Kashmiri chilli'],
    },
    steps: {
      de: ['Gemüse mit Salz und Kurkuma 1 Std. ziehen lassen.', 'Senföl erhitzen, bis es leicht raucht, etwas abkühlen, Gewürze einrühren.', 'Öl und Zitronensaft über das Gemüse, ins Glas füllen.', '1 Tag ziehen lassen, hält ca. 1 Woche.'],
      en: ['Mix vegetables with salt and turmeric, leave 1 h.', 'Heat mustard oil until it just smokes, cool slightly, stir in spices.', 'Pour oil and lemon juice over the vegetables, fill into a jar.', 'Leave 1 day; keeps about 1 week.'],
    },
  },
  'gajar-halwa': {
    source: SRC,
    serves: P4,
    time: { de: 'ca. 60 Min.', en: 'approx. 60 min' },
    ingredients: {
      de: ['600 g Karotten, fein geraspelt', '750 ml Vollmilch, 80–100 g Zucker', '3 EL Ghee, ½ TL Kardamom', '2 EL Rosinen, 2 EL Cashews oder Mandeln, optional Safran'],
      en: ['600 g carrots, finely grated', '750 ml whole milk, 80–100 g sugar', '3 tbsp ghee, ½ tsp cardamom', '2 tbsp raisins, 2 tbsp cashews or almonds, optional saffron'],
    },
    steps: {
      de: ['Karotten und Milch 35–45 Min. köcheln, bis die Milch fast verkocht ist.', 'Zucker zugeben, 10 Min. weiter einkochen.', 'Ghee einrühren, 5 Min. braten, bis es glänzt.', 'Kardamom, Nüsse, Rosinen untermischen, warm servieren.'],
      en: ['Simmer carrots and milk 35–45 min until the milk has almost evaporated.', 'Add sugar, reduce another 10 min.', 'Stir in ghee and fry 5 min until glossy.', 'Mix in cardamom, nuts and raisins, serve warm.'],
    },
    vegan: { de: 'Hafer- oder Kokosmilch, Kokosöl statt Ghee.', en: 'Oat or coconut milk, coconut oil instead of ghee.' },
  },
  'masala-chai': {
    source: SRC,
    serves: { de: '4 Tassen', en: '4 cups' },
    time: { de: '10 Min.', en: '10 min' },
    ingredients: {
      de: ['500 ml Wasser, 300 ml Milch', '4 TL kräftiger Schwarztee (Assam), 3–4 TL Zucker', '3 cm Ingwer, 4 Kardamomkapseln, 2 Nelken, 1 Stück Zimt, 4 Pfefferkörner (optional)'],
      en: ['500 ml water, 300 ml milk', '4 tsp strong black tea (Assam), 3–4 tsp sugar', '3 cm ginger, 4 cardamom pods, 2 cloves, 1 piece cinnamon, 4 peppercorns (optional)'],
    },
    steps: {
      de: ['Wasser mit Ingwer und Gewürzen 3–4 Min. kochen.', 'Tee 1–2 Min. mitkochen.', 'Milch und Zucker zugeben, zwei- bis dreimal aufsteigen lassen.', 'Durch ein Sieb in Tassen gießen.'],
      en: ['Boil water with ginger and spices 3–4 min.', 'Add tea and boil 1–2 min.', 'Add milk and sugar and let it rise two or three times.', 'Strain into cups.'],
    },
  },
  chaas: {
    source: SRC,
    serves: P4,
    time: { de: '5 Min.', en: '5 min' },
    ingredients: {
      de: ['300 g Naturjoghurt, 700 ml kaltes Wasser', '½ TL gerösteter Kreuzkümmel, ¼ TL Kala Namak, Salz', '1 Handvoll Minze und Koriander, 1 cm Ingwer, optional 1 grüne Chili'],
      en: ['300 g plain yogurt, 700 ml cold water', '½ tsp roasted cumin, ¼ tsp kala namak, salt', '1 handful mint and coriander, 1 cm ginger, optional 1 green chilli'],
    },
    steps: {
      de: ['Alles im Mixer 30 Sek. schaumig mixen.', 'Eiskalt servieren, optional mit Senfsaat-Curryblatt-Tadka.'],
      en: ['Blend everything 30 s until frothy.', 'Serve ice cold, optionally with a mustard seed and curry leaf tadka.'],
    },
  },
}
