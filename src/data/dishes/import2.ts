import type { Dish } from '../types'
import { bake, d, rc } from './define'

/** Photos of 7 Oct 2026, second batch: cakes, Arabic and Chinese sweets, pasta dough, a cocktail. */

const withParty = (dish: Dish, party: Dish['party']): Dish => ({ ...dish, party })

export const import2Dishes: Dish[] = [
  bake('bkCake', {
    id: 'fatimas-rhabarberkuechlein',
    o: 'Fatimas Rhabarberküchlein',
    en: 'Fatima’s little rhubarb cakes',
    c: 'german',
    t: 'veggie sweet oven summer',
    i: 'rhubarb quark flour butter sugar egg',
    recipe: rc({
      serves: ['1 Form oder ca. 12 Küchlein', '1 tin or about 12 small cakes'],
      time: ['ca. 1 Std.', 'about 1 h'],
      ing: [
        ['500 g Magerquark', '½ Pck. Backpulver', '1 Pck. Vanillezucker', '150 g Zucker', '100 g Butter', '1 Ei', '200 g Mehl (etwas mehr oder weniger)', 'Rhabarber nach Belieben'],
        ['500 g low-fat quark', '½ sachet baking powder', '1 sachet vanilla sugar', '150 g sugar', '100 g butter', '1 egg', '200 g flour (a little more or less)', 'rhubarb as you like'],
      ],
      steps: [
        ['Ofen auf 170 °C heizen, Form bzw. Muffinblech fetten.', 'Butter, Zucker, Vanillezucker und Ei cremig rühren, dann den Quark unterrühren.', 'Mehl mit Backpulver mischen und unterrühren, bis ein weicher Teig entsteht – je nach Quark etwas mehr oder weniger Mehl.', 'Rhabarber in kleine Stücke schneiden, unterheben oder obenauf verteilen.', '30–50 Min. backen (kleine Küchlein kürzer, eine große Form länger).'],
        ['Heat the oven to 170 °C and grease the tin or muffin tray.', 'Beat butter, sugar, vanilla sugar and egg until creamy, then stir in the quark.', 'Mix flour and baking powder and stir in until you have a soft batter – a little more or less flour depending on the quark.', 'Cut the rhubarb into small pieces and fold in or scatter on top.', 'Bake for 30–50 min (small cakes need less, one big tin more).'],
      ],
      tip: ['Die Rhabarbermenge steht nicht auf der Karte – ca. 300–400 g passen gut.', 'The card gives no amount of rhubarb – about 300–400 g works well.'],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'himbeer-kaese-blechkuchen',
    o: 'Himbeer-Käse-Blechkuchen',
    en: 'Raspberry cheesecake traybake',
    c: 'german',
    t: 'sweet oven summer social',
    e: 3,
    i: 'raspberries quark flour butter sugar egg cake_glaze',
    recipe: rc({
      serves: ['1 Blech', '1 baking tray'],
      time: ['ca. 1 Std. 45 Min. + Abkühlen', 'about 1 h 45 min + cooling'],
      ing: [
        ['Boden: 250 g Mehl, 75 g Zucker, 1 Prise Salz, 125 g kalte Butter in Stücken, 1 Ei, 2–3 TL Backpulver, nach Wunsch etwas Kakao', 'Füllung: 150–250 g Butter (geschmolzen, abgekühlt), 500 g Magerquark, 150–200 g Zucker, 1 Pck. Vanillezucker, 3 Eier, 1 Pck. Vanillepuddingpulver', 'Belag: 500 g Himbeeren, 2 Pck. Tortenguss (mit Fruchtsaft)'],
        ['Base: 250 g flour, 75 g sugar, 1 pinch salt, 125 g cold butter in pieces, 1 egg, 2–3 tsp baking powder, a little cocoa if you like', 'Filling: 150–250 g butter (melted, cooled), 500 g low-fat quark, 150–200 g sugar, 1 sachet vanilla sugar, 3 eggs, 1 sachet vanilla custard powder', 'Topping: 500 g raspberries, 2 sachets cake glaze (made with fruit juice)'],
      ],
      steps: [
        ['Zutaten für den Boden rasch zu einem Knetteig verarbeiten, zur Kugel formen und in Folie 30 Min. kühlen.', 'Teig auf dem gefetteten Blech ausrollen.', 'Für die Füllung Quark, Zucker, Vanillezucker, Eier und Puddingpulver verrühren und die abgekühlte Butter unterrühren; auf den Boden streichen.', 'In den nicht vorgeheizten Ofen schieben und bei 180 °C ca. 50 Min. backen, dann auskühlen lassen.', 'Himbeeren auf dem Kuchen verteilen, Tortenguss mit Fruchtsaft nach Packung kochen und darübergießen.'],
        ['Quickly knead the base ingredients into a dough, shape into a ball and chill in cling film for 30 min.', 'Roll out on the greased tray.', 'For the filling, stir together quark, sugar, vanilla sugar, eggs and custard powder, then mix in the cooled butter; spread over the base.', 'Put into the cold oven and bake at 180 °C for about 50 min, then let cool.', 'Spread the raspberries over the cake, make the glaze with fruit juice as per packet and pour over.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'zitronentorte',
    o: 'Zitronentorte',
    en: 'Lemon cream tart',
    c: 'german',
    t: 'sweet summer',
    e: 3,
    i: 'lemon quark yogurt honey cream gelatine flour butter limoncello',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 45 Min. + 5 Std. Kühlen', 'about 45 min + 5 h chilling'],
      ing: [
        ['Teig: 250 g Mehl, 75 g Zucker, 1 Prise Salz, 160 g Butter, 1 Ei', 'Belag: 11 Blatt weiße Gelatine, 3 unbehandelte Zitronen, 400 g Magerquark, 300 g Naturjoghurt, 5 EL flüssiger Honig, 2 cl Limoncello, 200 ml Sahne', 'Guss: ½ Pck. klarer Tortenguss, etwas Zucker'],
        ['Pastry: 250 g flour, 75 g sugar, 1 pinch salt, 160 g butter, 1 egg', 'Filling: 11 sheets white gelatine, 3 unwaxed lemons, 400 g low-fat quark, 300 g plain yoghurt, 5 tbsp runny honey, 2 cl limoncello, 200 ml cream', 'Glaze: ½ sachet clear cake glaze, a little sugar'],
      ],
      steps: [
        ['Mürbeteig kneten und 30 Min. kalt stellen. Ofen auf 180 °C Ober-/Unterhitze heizen.', 'Teig ausrollen, eine mit Backpapier ausgelegte Springform damit auskleiden und einen Rand hochziehen. Mit Hülsenfrüchten beschwert ca. 25 Min. blind backen, dann auskühlen lassen.', 'Gelatine einweichen. Eine Zitrone in dünne Scheiben schneiden, die anderen auspressen.', 'Quark, Joghurt, Honig und Zitronensaft verrühren (3 EL Saft für den Guss zurückbehalten). Gelatine mit dem Limoncello lösen und unterrühren, geschlagene Sahne unterheben.', 'Creme auf den Boden streichen und ca. 4 Std. kühlen.', 'Zitronenscheiben darauflegen, Tortenguss mit dem restlichen Saft, Wasser und Zucker kochen, darübergießen und fest werden lassen.'],
        ['Knead the shortcrust and chill for 30 min. Heat the oven to 180 °C conventional.', 'Roll out, line a springform covered with baking paper and push up a rim. Blind-bake weighed down with dried beans for about 25 min, then let cool.', 'Soak the gelatine. Slice one lemon thinly and juice the others.', 'Stir together quark, yoghurt, honey and lemon juice (keep 3 tbsp juice for the glaze). Dissolve the gelatine with the limoncello and stir in, then fold in the whipped cream.', 'Spread the cream over the base and chill for about 4 h.', 'Arrange the lemon slices on top, cook the glaze with the remaining juice, water and sugar, pour over and let set.'],
      ],
      source: 'EatSmarter',
    }),
  }),
  bake('bkPastry', {
    id: 'apfel-hefezopf',
    o: 'Apfel-Hefezopf',
    en: 'Apple-filled yeast plait',
    c: 'german',
    t: 'veggie sweet oven',
    e: 3,
    i: 'apples flour yeast butter milk sugar cinnamon',
    recipe: rc({
      serves: ['1 Zopf (Teig 45 × 30 cm)', '1 plait (dough 45 × 30 cm)'],
      time: ['ca. 1 Std. 45 Min. inkl. Gehzeit', 'about 1 h 45 min incl. proving'],
      ing: [
        ['Füllung: 400 g Äpfel, 50 g Zucker, ½ TL Zimt, 1 EL Zitronensaft, 40 g Butter, 1 gestr. EL Mehl', 'Teig: 375 g Mehl, 1 Pck. Hefe, 50 g Zucker, 170 ml Milch, 100 g Butter', 'Zum Bestreichen: 2 EL Sahne, 1 EL Zimtzucker'],
        ['Filling: 400 g apples, 50 g sugar, ½ tsp cinnamon, 1 tbsp lemon juice, 40 g butter, 1 level tbsp flour', 'Dough: 375 g flour, 1 sachet yeast, 50 g sugar, 170 ml milk, 100 g butter', 'To brush: 2 tbsp cream, 1 tbsp cinnamon sugar'],
      ],
      steps: [
        ['Äpfel würfeln und mit Zucker, Zimt, Zitronensaft und Butter kurz dünsten, Mehl einrühren, aufkochen und abkühlen lassen.', 'Milch mit Butter lauwarm erwärmen, mit Mehl, Hefe und Zucker zu einem glatten Teig kneten und gehen lassen.', 'Teig zu einem Rechteck (ca. 45 × 30 cm) ausrollen. Die Füllung längs in die Mitte geben, an den Enden ca. 2 cm frei lassen.', 'Beide Seiten in je 8 schräge Streifen schneiden und abwechselnd über die Füllung legen, sodass ein Zopf entsteht.', 'Mit Sahne bestreichen, mit Zimtzucker bestreuen und bei 180 °C ca. 20 Min. backen.'],
        ['Dice the apples and briefly cook with sugar, cinnamon, lemon juice and butter, stir in the flour, bring to the boil and let cool.', 'Warm milk with butter until lukewarm, knead with flour, yeast and sugar into a smooth dough and leave to rise.', 'Roll the dough into a rectangle (about 45 × 30 cm). Spread the filling lengthways down the middle, leaving about 2 cm free at the ends.', 'Cut each side into 8 diagonal strips and fold them alternately over the filling to make a plait.', 'Brush with cream, sprinkle with cinnamon sugar and bake at 180 °C for about 20 min.'],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'esh-el-bulbul',
    o: 'عش البلبل',
    l: 'ar',
    r: 'ʿIsh al-bulbul',
    de: 'Nachtigallennester (Nudelnester mit Pistazien und Sirup)',
    en: 'Nightingale’s nests (pastry nests with pistachios and syrup)',
    c: 'mideast',
    t: 'veggie sweet oven social',
    e: 3,
    i: 'vermicelli butter pistachios hazelnuts sugar lemon rose_water orange_blossom_water',
    recipe: rc({
      serves: ['1 Blech', '1 baking tray'],
      time: ['ca. 1 Std. + Sirup', 'about 1 h + syrup'],
      ing: [
        ['500 g feine Nudeln (Fadennudeln/Kadaifi)', '250 g Butter', '150 g Pistazien', '100 g Haselnüsse', '2 EL Rosenwasser', 'Sirup: 500 g Zucker, 300 g Wasser, 1 Zitrone, Orangenblüten- oder Rosenwasser'],
        ['500 g fine noodles (vermicelli/kataifi)', '250 g butter', '150 g pistachios', '100 g hazelnuts', '2 tbsp rose water', 'Syrup: 500 g sugar, 300 g water, 1 lemon, orange blossom or rose water'],
      ],
      steps: [
        ['Sirup: Zucker und Wasser aufkochen, Zitronensaft dazugeben und köcheln, bis er dickflüssig wie Honig ist; mit Orangenblüten- oder Rosenwasser abschmecken und abkühlen lassen.', 'Nudeln mit 100 g geschmolzener Butter mischen, das Blech mit 50 g Butter fetten. Ofen auf 180 °C heizen.', 'Aus den Nudeln kleine Nester drehen und auf das Blech setzen, mit 50 g Butter beträufeln und goldbraun backen.', 'Restliche Butter weich rühren, gehackte Pistazien und Haselnüsse mit Rosenwasser untermischen und in die Nester füllen.', 'Die heißen Nester mit dem kalten Sirup übergießen.'],
        ['Syrup: boil sugar and water, add the lemon juice and simmer until thick like honey; flavour with orange blossom or rose water and let cool.', 'Mix the noodles with 100 g melted butter and grease the tray with 50 g butter. Heat the oven to 180 °C.', 'Twist the noodles into small nests, place on the tray, drizzle with 50 g butter and bake until golden.', 'Soften the remaining butter, mix in chopped pistachios and hazelnuts with the rose water and fill the nests.', 'Pour the cold syrup over the hot nests.'],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'panda-kekse',
    o: '熊猫饼干',
    l: 'zh',
    r: 'Xióngmāo bǐnggān',
    de: 'Panda-Kekse (mit Matcha und Kakao)',
    en: 'Panda cookies (matcha and cocoa)',
    c: 'chinese',
    t: 'veggie sweet oven kids',
    e: 3,
    i: 'flour butter icing_sugar egg matcha cocoa cornstarch',
    recipe: rc({
      serves: ['1 Rolle (ca. 20 cm), ca. 30 Kekse', '1 log (about 20 cm), about 30 cookies'],
      time: ['ca. 1 Std. 15 Min.', 'about 1 h 15 min'],
      ing: [
        ['120 g Mehl Type 405 (große Menge: 160 g)', '60 g Butter (80 g)', '40 g Puderzucker (65 g)', '18 g verquirltes Ei (25 g)', '2 TL Kakao (5 g)', '2 TL Matchapulver (5 g)', '5 g Maisstärke (10 g)'],
        ['120 g cake flour (large batch: 160 g)', '60 g butter (80 g)', '40 g icing sugar (65 g)', '18 g beaten egg (25 g)', '2 tsp cocoa (5 g)', '2 tsp matcha powder (5 g)', '5 g cornflour (10 g)'],
      ],
      steps: [
        ['Butter mit Puderzucker cremig rühren, Ei einrühren, Mehl (gesiebt) und Stärke zu einem glatten Teig kneten.', 'Teig in 120 g, 80 g und 30 g teilen: das große Stück mit Matcha grün färben, das mittlere hell lassen, das kleine mit Kakao dunkel färben.', 'Aus dem hellen Teig das Gesicht formen, aus dem Kakaoteig Ohren, Augen und Nase; zu einer ca. 20 cm langen Panda-Rolle zusammensetzen und mit dem grünen Teig umhüllen.', 'Rolle in Folie ca. 20 Min. ins Gefrierfach legen.', 'In 0,5 cm dicke Scheiben schneiden und bei 165 °C ca. 15–20 Min. backen.'],
        ['Cream butter and icing sugar, stir in the egg, then knead in the sifted flour and cornflour to a smooth dough.', 'Divide into 120 g, 80 g and 30 g: colour the big piece green with matcha, leave the middle one plain and colour the small one with cocoa.', 'Shape the face from the plain dough and ears, eyes and nose from the cocoa dough; assemble into a panda log about 20 cm long and wrap in the green dough.', 'Freeze the log in cling film for about 20 min.', 'Cut into 0.5 cm slices and bake at 165 °C for about 15–20 min.'],
      ],
      tip: ['Die Zahlen in Klammern sind die größere Menge vom Zettel.', 'The numbers in brackets are the larger batch from the note.'],
      family: true,
    }),
  }),
  d({
    id: 'pl-hausnudeln',
    k: 'side',
    co: 'plStarch',
    o: 'Selbstgemachte Nudeln',
    en: 'Homemade pasta',
    c: 'italian',
    t: 'vegan kids',
    e: 3,
    i: 'semolina olive_oil',
    recipe: rc({
      serves: ['4 Portionen (500 g Grieß)', '4 servings (500 g semolina)'],
      time: ['ca. 1 Std.', 'about 1 h'],
      ing: [
        ['500 g / 250 g / 100 g / 50 g Hartweizengrieß', '240 / 120 / 48 / 24 ml Wasser', '1⅓ TL / ⅔ TL / 1 Prise / 1 Prise Salz', '2 EL / 1 EL / ca. 1 TL / ca. 1 kl. TL Olivenöl'],
        ['500 g / 250 g / 100 g / 50 g durum wheat semolina', '240 / 120 / 48 / 24 ml water', '1⅓ tsp / ⅔ tsp / 1 pinch / 1 pinch salt', '2 tbsp / 1 tbsp / about 1 tsp / about 1 small tsp olive oil'],
      ],
      steps: [
        ['Grieß, Wasser, Salz und Öl zu einem festen, glatten Teig kneten (ca. 10 Min.) und abgedeckt 30 Min. ruhen lassen.', 'Dünn ausrollen oder durch die Nudelmaschine drehen und in die gewünschte Form schneiden.', 'In reichlich Salzwasser 2–4 Min. kochen.'],
        ['Knead semolina, water, salt and oil into a firm, smooth dough (about 10 min) and rest covered for 30 min.', 'Roll out thinly or put through the pasta machine and cut into the shape you like.', 'Cook in plenty of salted water for 2–4 min.'],
      ],
      tip: ['Bunte Nudeln: gelb mit Safran oder Kurkuma, grün mit Spinatsaft oder pürierten Kräutern (z. B. Basilikum), rot mit Tomatenmark oder Rote-Bete-Saft, schwarz mit Tintenfischtinte – dafür etwas Wasser weglassen.', 'Coloured pasta: yellow with saffron or turmeric, green with spinach juice or puréed herbs (e.g. basil), red with tomato purée or beetroot juice, black with squid ink – use a little less water.'],
      family: true,
    }),
  }),
  withParty(
    d({
      id: 'alarmed-bison',
      k: 'party',
      o: 'Alarmed Bison',
      l: 'en',
      de: 'Alarmed Bison (Büffelgraswodka mit Birne)',
      en: 'Alarmed Bison (bison grass vodka with pear)',
      c: 'eastern',
      t: 'vegan social',
      e: 1,
      i: 'bison_grass_vodka pears lemon simple_syrup',
      recipe: rc({
        serves: ['1 Glas', '1 glass'],
        time: ['ca. 10 Min.', 'about 10 min'],
        ing: [
          ['4 cl Büffelgraswodka', '2 cl Zuckersirup', '2 cl Zitronensaft', '4–5 cl Birnenpüree', '3 Eiswürfel + Crushed Ice', 'Deko: 2 dünne halbe Birnenscheiben'],
          ['4 cl bison grass vodka', '2 cl sugar syrup', '2 cl lemon juice', '4–5 cl pear purée', '3 ice cubes + crushed ice', 'Garnish: 2 thin half slices of pear'],
        ],
        steps: [
          ['Birnenpüree: Birne schälen, würfeln, mit 1–2 EL Wasser weich kochen, pürieren und kühlen.', 'Wodka, Sirup, Zitronensaft und Birnenpüree mit den Eiswürfeln kräftig schütteln.', 'In ein Glas mit Crushed Ice abseihen und mit den Birnenscheiben garnieren.'],
          ['Pear purée: peel and dice a pear, cook until soft with 1–2 tbsp water, purée and chill.', 'Shake vodka, syrup, lemon juice and pear purée hard with the ice cubes.', 'Strain into a glass with crushed ice and garnish with the pear slices.'],
        ],
        tip: ['Zweite Variante vom Zettel: 5 cl Büffelgraswodka, 5 cl Birnenpüree, 2 cl frischer Zitronensaft, 2 cl Vanille-Zimt-Sirup.', 'Second version from the note: 5 cl bison grass vodka, 5 cl pear purée, 2 cl fresh lemon juice, 2 cl vanilla-cinnamon syrup.'],
        family: true,
      }),
    }),
    ['drink'],
  ),
]

