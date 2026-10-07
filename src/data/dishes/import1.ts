import type { Dish, Recipe } from '../types'
import { bake, d, rc } from './define'

/** Import 2026-10-07 (prepared with the rezepte-digitalisieren skill). */

const party = (dish: Dish, course: Dish['party']) => ({ ...dish, party: course })

export const import1Dishes: Dish[] = [
  bake('bkCake', {
    id: 'konfetti-kuchen',
    o: 'Konfetti-Kuchen vom Blech',
    en: 'Funfetti sheet cake',
    c: 'german',
    t: 'veggie sweet oven kids social',
    e: 1,
    i: 'flour sugar egg oil orange_soda sprinkles',
    recipe: rc({
      serves: ['½ Blech', '½ baking tray'],
      time: ['ca. 40 Min.', 'about 40 min'],
      ing: [
        ['200 g Weizenmehl', '100 g Zucker', '2–3 mittelgroße Eier', '75 ml Sonnenblumenöl', '90 ml Orangenlimonade', '½ Pck. Backpulver', 'Guss: 200 g Puderzucker, 3–4 EL Orangenlimonade oder -saft', 'bunte Zuckerstreusel'],
        ['200 g plain flour', '100 g sugar', '2–3 medium eggs', '75 ml sunflower oil', '90 ml orange soda', '½ sachet baking powder', 'Icing: 200 g icing sugar, 3–4 tbsp orange soda or juice', 'rainbow sprinkles'],
      ],
      steps: [
        [
          'Ofen auf 175 °C Ober-/Unterhitze heizen, ein halbes Blech mit Backpapier belegen.',
          'Eier mit Zucker hell aufschlagen. Mehl und Backpulver abwechselnd mit dem Öl unterrühren, die Limonade nur kurz einarbeiten – wer mag, hebt ein paar Streusel unter.',
          'Teig verstreichen und 20–25 Min. backen.',
          'Abgekühlt mit dem Guss aus Puderzucker und Limonade überziehen und mit Streuseln bestreuen.',
        ],
        [
          'Heat the oven to 175 °C conventional and line half a tray with baking paper.',
          'Whisk eggs and sugar until pale. Stir in flour and baking powder alternately with the oil, then briefly mix in the soda – fold in a few sprinkles if you like.',
          'Spread out and bake for 20–25 min.',
          'Once cool, cover with icing made from icing sugar and soda and scatter with sprinkles.',
        ],
      ],
      tip: ['Für ein ganzes Blech alles verdoppeln.', 'Double everything for a full tray.'],
      source: 'backenmachtgluecklich.de',
    }),
  }),
  bake('bkPastry', {
    id: 'doros-brot',
    o: 'Doros Brot',
    de: 'Doros Dinkel-Vollkornbrot',
    en: 'Doro’s wholemeal spelt bread',
    c: 'german',
    t: 'vegan oven',
    i: 'spelt_flour oats linseed sesame yeast',
    recipe: rc({
      serves: ['1 Kastenform (30 cm)', '1 loaf tin (30 cm)'],
      time: ['ca. 1 Std. 45 Min.', 'about 1 h 45 min'],
      ing: [
        ['gut 300 g (320 g) Dinkelvollkornmehl', '50 g Weizenvollkornmehl', '50 g Weizenmehl', '50 g Haferflocken', '50–100 g Körner (Leinsamen, geschroteter Sesam …)', '1 TL Zucker', '1–2 TL Salz', '1 Pck. Trockenhefe', '350 ml lauwarmes Wasser (evtl. teils Joghurt)'],
        ['a good 300 g (320 g) wholemeal spelt flour', '50 g wholemeal wheat flour', '50 g plain wheat flour', '50 g rolled oats', '50–100 g seeds (linseed, crushed sesame …)', '1 tsp sugar', '1–2 tsp salt', '1 sachet dried yeast', '350 ml lukewarm water (part yoghurt if you like)'],
      ],
      steps: [
        ['Alle trockenen Zutaten mischen, das lauwarme Wasser dazugeben und zu einem weichen Teig verrühren.', 'Kastenform fetten, Teig einfüllen und gehen lassen.', 'Eine Schale Wasser mit in den Ofen stellen und das Brot bei 190 °C Ober-/Unterhitze 60 Min. backen.'],
        ['Mix all dry ingredients, add the lukewarm water and stir into a soft dough.', 'Grease the loaf tin, fill in the dough and leave to rise.', 'Put a dish of water in the oven and bake at 190 °C conventional for 60 min.'],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'kuemmelbrot',
    o: 'Kümmelbrot',
    en: 'Caraway bread',
    c: 'german',
    t: 'vegan oven',
    e: 3,
    i: 'flour rye_flour caraway yeast oil',
    recipe: rc({
      serves: ['1–2 Laibe', '1–2 loaves'],
      time: ['ca. 2–3 Std. inkl. Gehzeit', 'about 2–3 h incl. proving'],
      ing: [
        ['1 kg Weizenmehl Type 1050', 'etwas Roggenmehl', 'ca. 6 EL Öl', '1 EL Salz', 'Hefe', '15–20 g Kümmel', 'Wasser nach Bedarf'],
        ['1 kg wheat flour type 1050', 'a little rye flour', 'about 6 tbsp oil', '1 tbsp salt', 'yeast', '15–20 g caraway seeds', 'water as needed'],
      ],
      steps: [
        ['Alles mit so viel Wasser verkneten, dass ein geschmeidiger Teig entsteht.', 'Gehen lassen und dabei 3–4-mal falten.', 'Ofen auf 230 °C heizen, Brot formen und 20–30 Min. (oder länger) backen.'],
        ['Knead everything with enough water to make a smooth dough.', 'Leave to rise, folding it 3–4 times.', 'Heat the oven to 230 °C, shape the loaf and bake for 20–30 min (or longer).'],
      ],
      tip: ['Hefe- und Wassermenge stehen nicht auf dem Zettel.', 'The note gives no amounts for yeast and water.'],
      family: true,
    }),
  }),
  party(
    d({
      id: 'auberginenkuchen',
      k: 'party',
      o: 'Auberginenkuchen mit Tomatensoße',
      en: 'Aubergine cake with tomato sauce',
      c: 'french',
      t: 'veggie oven summer social',
      e: 3,
      i: 'eggplant egg creme_fraiche thyme tomato onion garlic white_wine olive_oil',
      recipe: rc({
        serves: ['Springform Ø 18 cm, 8–10 Stücke', '18 cm springform, 8–10 slices'],
        time: ['ca. 1½ Std.', 'about 1½ h'],
        ing: [
          ['1,3 kg Auberginen', 'Salz', '300 ml Olivenöl', '2 EL Zitronensaft', '½ Bund Thymian', '3 Eier', '3 EL Crème fraîche', 'Pfeffer, Muskat', 'Soße: 1,3 kg Tomaten, 1 Zwiebel, 1–2 Knoblauchzehen, 2 EL Olivenöl, 50 ml Weißwein, Salz, Cayenne, Zucker'],
          ['1.3 kg aubergines', 'salt', '300 ml olive oil', '2 tbsp lemon juice', '½ bunch thyme', '3 eggs', '3 tbsp crème fraîche', 'pepper, nutmeg', 'Sauce: 1.3 kg tomatoes, 1 onion, 1–2 garlic cloves, 2 tbsp olive oil, 50 ml white wine, salt, cayenne, sugar'],
        ],
        steps: [
          [
            'Auberginen schälen, in dünne Scheiben schneiden, salzen, Wasser ziehen lassen und trocken tupfen; dann in Olivenöl goldbraun braten.',
            'Eine kleine Springform mit Backpapier auslegen und Boden und Rand mit einem Teil der Scheiben auskleiden; genauso viele für den Deckel zurücklegen.',
            'Die übrigen Scheiben mit Zitronensaft, Thymian, Eiern und Crème fraîche fein pürieren, würzen, einfüllen und mit den restlichen Scheiben abdecken.',
            'Bei 200 °C Ober-/Unterhitze ca. 30 Min. (Umluft 180 °C, 40 Min.) backen.',
            'Für die Soße Tomaten häuten und würfeln, mit Zwiebel und Knoblauch in Öl andünsten, mit Wein ablöschen und dicklich einkochen; pikant abschmecken.',
            'Kuchen etwas abkühlen lassen, stürzen und mit Soße und Thymian servieren – warm oder kalt.',
          ],
          [
            'Peel the aubergines, slice thinly, salt them, let the water draw out and pat dry; then fry in olive oil until golden.',
            'Line a small springform with baking paper and cover base and sides with some of the slices; keep the same amount for the top.',
            'Purée the remaining slices with lemon juice, thyme, eggs and crème fraîche, season, fill in and cover with the remaining slices.',
            'Bake at 200 °C conventional for about 30 min (fan 180 °C, 40 min).',
            'For the sauce, peel and dice the tomatoes, sweat with onion and garlic in oil, add the wine and simmer until thick; season well.',
            'Let the cake cool a little, turn it out and serve with the sauce and thyme – warm or cold.',
          ],
        ],
        tip: ['Lässt sich gut am Vortag vorbereiten.', 'Easy to make the day before.'],
        source: 'Zeitschrift (Ausschnitt)',
      }),
    }),
    ['starter'],
  ),
  d({
    id: 'aloo-pyaz-tamatar',
    o: 'आलू प्याज़ टमाटर भुजिया',
    l: 'hi',
    r: 'Ālū pyāz ṭamāṭar bhujiyā',
    de: 'Kartoffeln mit Zwiebeln und Tomaten',
    en: 'Potato, onion and tomato bhujia',
    c: 'indian',
    k: 'side',
    co: 'sabzi',
    t: 'veggie spicy',
    e: 1,
    i: 'potatoes onion tomato green_chili ginger turmeric garam_masala ghee',
    recipe: rc({
      serves: ['2 Portionen', '2 servings'],
      time: ['ca. 30 Min.', 'about 30 min'],
      ing: [
        ['1½ Zwiebeln in feinen Scheiben + 1 Zwiebel geviertelt', '250 g sehr kleine Kartoffeln', '2 Tomaten, geviertelt', '2 grüne + 2 rote Chilis, längs halbiert', '1 cm Ingwer, gerieben', '½ TL Zucker, ½ TL Salz', 'je ¼ TL Chilipulver, Kurkuma, Garam Masala, gemahlener Koriander', '¼ Tasse Wasser', '2 EL Ghee'],
        ['1½ onions, thinly sliced + 1 onion, quartered', '250 g very small potatoes', '2 tomatoes, quartered', '2 green + 2 red chillies, halved lengthways', '1 cm ginger, grated', '½ tsp sugar, ½ tsp salt', '¼ tsp each chilli powder, turmeric, garam masala, ground coriander', '¼ cup water', '2 tbsp ghee'],
      ],
      steps: [
        ['Zwiebelscheiben im Ghee langsam hellbraun braten.', 'Kartoffeln mit Salz, Chilipulver und Kurkuma dazugeben, Wasser angießen und zugedeckt bei kleiner Hitze weich garen.', 'Tomaten, Zwiebelviertel, Chilis, Ingwer, Koriander und Zucker zufügen und bei starker Hitze 2–3 Min. mitgaren – die Tomaten sollen ganz bleiben.', 'Mit Garam Masala bestreuen und heiß servieren.'],
        ['Fry the sliced onion slowly in the ghee until light brown.', 'Add the potatoes with salt, chilli powder and turmeric, pour in the water and cook covered over low heat until tender.', 'Add tomatoes, onion quarters, chillies, ginger, coriander and sugar and cook over high heat for 2–3 min – the tomatoes should keep their shape.', 'Sprinkle with garam masala and serve hot.'],
      ],
      kids: ['Für Kinder die Chilis weglassen.', 'Leave out the chillies for the kids.'],
      source: 'Rezeptausdruck',
    }),
  }),
  d({
    id: 'naan-pfanne',
    g: 'naan',
    o: 'नान',
    l: 'hi',
    r: 'Nān',
    de: 'Naan aus der Pfanne (ohne Hefe)',
    en: 'Pan naan (no yeast)',
    c: 'indian',
    k: 'side',
    co: 'bread',
    t: 'veggie kids',
    e: 1,
    i: 'flour yogurt milk butter baking_powder',
    recipe: rc({
      serves: ['4 Fladen (ca. 22 × 16 cm)', '4 flatbreads (about 22 × 16 cm)'],
      time: ['ca. 30 Min.', 'about 30 min'],
      ing: [
        ['160 g Mehl', '½ TL Backpulver', '¼ TL Natron', '½ TL Zucker', '¾ TL Salz', '50 ml Milch', '3 EL Butter (ca. 27 g), geschmolzen', '65 g Naturjoghurt'],
        ['160 g flour', '½ tsp baking powder', '¼ tsp bicarbonate of soda', '½ tsp sugar', '¾ tsp salt', '50 ml milk', '3 tbsp butter (about 27 g), melted', '65 g plain yoghurt'],
      ],
      steps: [
        ['Mehl, Backpulver, Natron, Zucker und Salz mischen.', 'Milch, Butter und Joghurt verrühren, dazugeben und zu einem weichen, elastischen Teig kneten.', 'In 4 Stücke teilen und dünn zu Fladen ausrollen.', 'In einer Pfanne ohne Öl bei mittlerer bis hoher Hitze von jeder Seite ca. 2 Min. backen und in ein Tuch wickeln, damit sie weich bleiben.'],
        ['Mix flour, baking powder, bicarbonate, sugar and salt.', 'Stir together milk, butter and yoghurt, add and knead into a soft, elastic dough.', 'Divide into 4 and roll out thinly.', 'Cook in a dry pan over medium-high heat for about 2 min per side and wrap in a tea towel to keep them soft.'],
      ],
      family: true,
    }),
  }),
]

/** Recipes for dishes that already existed. */
export const IMPORT1_RECIPES: Record<string, Recipe> = {
  kartoffelgratin: rc({
    serves: ['1 Auflaufform', '1 baking dish'],
    time: ['ca. 45 Min.', 'about 45 min'],
    ing: [
      ['500 g Kartoffeln', '⅛ l Milch', '⅛ l Sahne', 'Knoblauch', 'Rosmarin', 'Salz, Pfeffer', 'Käse zum Überbacken'],
      ['500 g potatoes', '125 ml milk', '125 ml cream', 'garlic', 'rosemary', 'salt, pepper', 'cheese for topping'],
    ],
    steps: [
      ['Kartoffeln schälen und in dünne Scheiben schneiden. Ofen auf 220 °C Ober-/Unterhitze heizen.', 'Kartoffeln mit Milch, Sahne, Knoblauch, Rosmarin, Salz und Pfeffer aufkochen und 10 Min. köcheln lassen.', 'In eine gefettete Form geben und mit Käse bestreuen.', '15–20 Min. goldbraun überbacken.'],
      ['Peel the potatoes and slice thinly. Heat the oven to 220 °C conventional.', 'Bring the potatoes to the boil with milk, cream, garlic, rosemary, salt and pepper and simmer for 10 min.', 'Transfer to a greased dish and sprinkle with cheese.', 'Bake for 15–20 min until golden.'],
    ],
    family: true,
  }),
  zimtparfait: rc({
    serves: ['6–8 Portionen', '6–8 servings'],
    time: ['Pflaumen 2 Tage vorher, Parfait mind. 3 Std. gefrieren', 'prunes 2 days ahead, parfait frozen for at least 3 h'],
    ing: [
      ['Parfait: 5 Eigelb, 125 g Zucker, ½ EL Zimt, 2 EL Cognac, ½ l Sahne', 'Pflaumen: 36 Trockenpflaumen, ½ l Wasser, 4 EL Honig, Rotwein (z. B. Burgunder) zum Bedecken, 1 TL Bitterorangenmarmelade oder -schale'],
      ['Parfait: 5 egg yolks, 125 g sugar, ½ tbsp cinnamon, 2 tbsp cognac, 500 ml double cream', 'Prunes: 36 dried prunes, 500 ml water, 4 tbsp honey, red wine (e.g. Burgundy) to cover, 1 tsp bitter orange marmalade or zest'],
    ],
    steps: [
      ['Pflaumen (2 Tage vorher): dicht in eine Schüssel legen. Wasser mit Honig zu Sirup kochen und darübergießen.', 'Rotwein mit der Orangenmarmelade verrühren und aufgießen, bis die Pflaumen bedeckt sind; 2 Tage ziehen lassen.', 'Parfait: Eigelb hell und schaumig rühren, Zucker und Zimt dazu und rühren, bis die Masse dick ist; Cognac unterrühren.', 'Sahne steif schlagen, unterheben, in eine Form füllen und mind. 3 Std. gefrieren.', '1 Std. vor dem Servieren in den Kühlschrank stellen und mit den Pflaumen servieren.'],
      ['Prunes (2 days ahead): pack them tightly into a bowl. Boil water and honey to a syrup and pour over.', 'Stir the red wine with the marmalade and pour over until the prunes are covered; leave for 2 days.', 'Parfait: whisk the yolks until pale, add sugar and cinnamon and whisk until thick; stir in the cognac.', 'Whip the cream, fold in, pour into a mould and freeze for at least 3 h.', 'Move to the fridge 1 h before serving and serve with the prunes.'],
    ],
    family: true,
  }),
  'pad-thai': rc({
    serves: ['4 Portionen', '4 servings'],
    time: ['30 Min.', '30 min'],
    ing: [
      ['2 EL Tamarindenpaste', '5 EL brauner Zucker', '6 EL Fischsoße', '2 TL Chilipulver', '300 g Reisnudeln', '150 g Hähnchenfilet', '1 Zwiebel, 4 Knoblauchzehen', '2 Eier', '6 EL Erdnüsse', '100 g Sojasprossen', '1 Bund Lauchzwiebeln', '3 EL Öl', '1 Limette'],
      ['2 tbsp tamarind paste', '5 tbsp brown sugar', '6 tbsp fish sauce', '2 tsp chilli powder', '300 g rice noodles', '150 g chicken breast', '1 onion, 4 garlic cloves', '2 eggs', '6 tbsp peanuts', '100 g bean sprouts', '1 bunch spring onions', '3 tbsp oil', '1 lime'],
    ],
    steps: [
      ['Tamarinde und Zucker in etwa 120 ml heißem Wasser auflösen, Fischsoße und Chili einrühren.', 'Reisnudeln in heißem Wasser biegsam einweichen. Hähnchen in Streifen schneiden, Zwiebel und Knoblauch hacken, Erdnüsse grob hacken, Lauchzwiebeln in Ringe schneiden.', 'Im sehr heißen Wok Knoblauch, Zwiebel und Hähnchen anbraten, Nudeln und die halbe Soße dazugeben und ständig wenden.', 'Alles an den Rand schieben, die Eier in der Mitte stocken lassen und untermischen. Restliche Soße, Sprossen, einen Teil der Erdnüsse und die Lauchzwiebeln unterheben.', 'Mit Limettenspalten und den übrigen Erdnüssen servieren.'],
      ['Dissolve tamarind and sugar in about 120 ml hot water; stir in fish sauce and chilli.', 'Soak the rice noodles in hot water until pliable. Slice the chicken, chop onion and garlic, roughly chop the peanuts, slice the spring onions.', 'In a very hot wok, fry garlic, onion and chicken, add the noodles and half the sauce and keep tossing.', 'Push everything to the side, scramble the eggs in the middle and mix in. Toss in the rest of the sauce, the sprouts, some of the peanuts and the spring onions.', 'Serve with lime wedges and the remaining peanuts.'],
    ],
    kids: ['Chili in der Soße weglassen und am Tisch nachwürzen.', 'Leave the chilli out of the sauce and add it at the table.'],
    source: 'REWE Deine Küche',
  }),
  bibimbap: rc({
    serves: ['4 Portionen', '4 servings'],
    time: ['45 Min.', '45 min'],
    ing: [
      ['200 g Sushi-Reis', '200 g junger Spinat', '2 Möhren, ½ Gurke, 1 rote Zwiebel', '1 Knoblauchzehe', '100 g Sojasprossen', '½ Bund Koriander', '2 EL Sesam', '3 EL Erdnussöl, 1 EL Reisessig', '400 g Rinderhack', '2 EL Sojasoße, 1 EL brauner Zucker', '4 Eier', '200 g Kimchi'],
      ['200 g sushi rice', '200 g baby spinach', '2 carrots, ½ cucumber, 1 red onion', '1 garlic clove', '100 g bean sprouts', '½ bunch coriander', '2 tbsp sesame seeds', '3 tbsp peanut oil, 1 tbsp rice vinegar', '400 g minced beef', '2 tbsp soy sauce, 1 tbsp brown sugar', '4 eggs', '200 g kimchi'],
    ],
    steps: [
      ['Schalen im Ofen bei 60 °C vorwärmen und den Reis kochen. Gemüse putzen und in feine Streifen bzw. Scheiben schneiden.', 'Sesam trocken rösten. Gurke mit Knoblauch kurz braten und mit Reisessig ablöschen; Spinat in der Pfanne zusammenfallen lassen; Sprossen kurz anbraten.', 'Hack krümelig braten und mit Sojasoße und Zucker glasieren. Spiegeleier mit weichem Eigelb braten.', 'Reis in die warmen Schalen geben, Gemüse, Kimchi und Hack daneben anrichten, mit Sesam und Koriander bestreuen und je ein Spiegelei daraufsetzen. Am Tisch alles verrühren.'],
      ['Warm the bowls in the oven at 60 °C and cook the rice. Prepare the vegetables and cut into thin strips or slices.', 'Toast the sesame in a dry pan. Briefly fry the cucumber with garlic and splash with rice vinegar; wilt the spinach in the pan; quickly fry the sprouts.', 'Fry the mince until crumbly and glaze with soy sauce and sugar. Fry eggs with runny yolks.', 'Put rice in the warm bowls, arrange vegetables, kimchi and mince around it, sprinkle with sesame and coriander and top each with an egg. Mix everything at the table.'],
    ],
    source: 'REWE Deine Küche',
  }),
  'hack-kartoffel-auflauf': rc({
    serves: ['1 Kastenform', '1 loaf tin'],
    time: ['ca. 1 Std. 15 Min.', 'about 1 h 15 min'],
    ing: [
      ['500 g Kartoffeln', '1 Zwiebel, 1 Knoblauchzehe', '500 g gemischtes Hackfleisch', '2 EL Tomatenmark', '250 g passierte Tomaten', '2 Möhren', '200 g TK-Brechbohnen', 'Béchamelsoße (ca. 250 ml)', '1 Tomate', 'Salz, Pfeffer', 'Dazu: 300 g Joghurt mit Petersilie und Schnittlauch'],
      ['500 g potatoes', '1 onion, 1 garlic clove', '500 g mixed mince', '2 tbsp tomato purée', '250 g passata', '2 carrots', '200 g frozen cut green beans', 'béchamel sauce (about 250 ml)', '1 tomato', 'salt, pepper', 'To serve: 300 g yoghurt with parsley and chives'],
    ],
    steps: [
      ['Kartoffeln 20 Min. kochen, abschrecken, pellen; alle bis auf 2 in Scheiben schneiden.', 'Hack anbraten, Zwiebel und Knoblauch dazu, Tomatenmark kurz mitrösten, mit passierten Tomaten ablöschen, kurz köcheln und würzen.', 'Möhren raspeln und mit den Bohnen 8 Min. in Salzwasser garen.', 'Béchamel zubereiten, Ofen auf 175 °C Ober-/Unterhitze heizen.', 'In die gefettete Kastenform Kartoffeln, Hack und Gemüse schichten, Béchamel darübergießen.', 'Die 2 übrigen Kartoffeln darüberraspeln, mit Tomatenscheiben belegen und 30–35 Min. backen.', 'Joghurt mit Kräutern, Salz und Pfeffer verrühren und dazu reichen.'],
      ['Boil the potatoes for 20 min, refresh and peel; slice all but 2.', 'Brown the mince, add onion and garlic, briefly fry the tomato purée, add the passata, simmer and season.', 'Grate the carrots and cook with the beans in salted water for 8 min.', 'Make the béchamel and heat the oven to 175 °C conventional.', 'Layer potatoes, mince and vegetables in the greased loaf tin and pour the béchamel over.', 'Grate the 2 remaining potatoes on top, cover with tomato slices and bake for 30–35 min.', 'Mix the yoghurt with herbs, salt and pepper and serve alongside.'],
    ],
    family: true,
  }),
  spinatknoedel: rc({
    serves: ['ca. 4 Portionen', 'about 4 servings'],
    time: ['ca. 1 Std.', 'about 1 h'],
    ing: [
      ['300 g altbackenes Weißbrot', '⅛–¼ l lauwarme Milch', '800 g Spinat', '30 g Butter', '1 kleine Zwiebel, 1 Knoblauchzehe', '2 Eier', '1 EL Mehl, 1 EL Semmelbrösel', 'Salz', 'Zum Servieren: braune Butter, Parmesan'],
      ['300 g stale white bread', '125–250 ml lukewarm milk', '800 g spinach', '30 g butter', '1 small onion, 1 garlic clove', '2 eggs', '1 tbsp flour, 1 tbsp breadcrumbs', 'salt', 'To serve: browned butter, Parmesan'],
    ],
    steps: [
      ['Brot würfeln und mit der lauwarmen Milch befeuchten.', 'Spinat waschen, kurz in Salzwasser garen, sehr gut ausdrücken und fein hacken.', 'Zwiebel und Knoblauch fein hacken und in der Butter andünsten.', 'Alles mit Eiern, Mehl und Semmelbröseln verkneten und salzen.', 'Knödel formen und in leicht siedendem Salzwasser ca. 15 Min. ziehen lassen. Mit brauner Butter und Parmesan servieren.'],
      ['Dice the bread and moisten with the lukewarm milk.', 'Wash the spinach, blanch in salted water, squeeze out very well and chop finely.', 'Finely chop onion and garlic and soften in the butter.', 'Knead everything with eggs, flour and breadcrumbs and season with salt.', 'Shape dumplings and simmer gently in salted water for about 15 min. Serve with browned butter and Parmesan.'],
    ],
    family: true,
  }),
}
