import { bake, d, rc } from './define'
import type { Dish, Recipe } from '../types'


export const moreBakeDishes: Dish[] = [
  // ───────── Desserts ─────────
  bake('bkDessert', {
    id: 'crema-catalana', o: 'Crema catalana', l: 'ca', de: 'Crema Catalana', en: 'Crema catalana (Catalan custard)', c: 'spanish', t: 'veggie sweet oven', e: 2,
    i: 'milk egg sugar cinnamon oranges cornstarch',
    recipe: rc({
      serves: ['4 Portionen', 'Serves 4'],
      time: ['ca. 1 Std. + mind. 2 Std. Kühlzeit', 'about 1 h + at least 2 h chilling'],
      ing: [
        ['450 ml Milch', '1 Zimtstange', '1 Stück Bio-Orangenschale', '4 Eigelb (M)', '50 g Zucker', '1 TL Speisestärke', '2–3 EL brauner Zucker zum Bestreuen'],
        ['450 ml milk', '1 cinnamon stick', '1 strip of organic orange peel', '4 egg yolks (medium)', '50 g sugar', '1 tsp cornflour', '2–3 tbsp brown sugar for the topping'],
      ],
      steps: [
        [
          'Backofen auf 130 °C Ober-/Unterhitze (110 °C Umluft) vorheizen. Ein tiefes Blech mit etwa 1 l kochendem Wasser auf die mittlere Schiene schieben – das wird das Wasserbad.',
          'Milch mit Zimtstange und Orangenschale in einem Topf zum Kochen bringen.',
          'Eigelb, Zucker und Stärke in einer Schüssel glatt rühren und mit 3 EL der heißen Milch verdünnen. Die Mischung unter ständigem Rühren in die kochende Milch geben und etwa 1 Minute leise köcheln lassen, bis sie leicht andickt.',
          'Topf vom Herd ziehen, Zimtstange und Orangenschale herausfischen.',
          'Creme auf 4 flache ofenfeste Schälchen verteilen, ins Wasserbad stellen und ca. 35 Minuten garen.',
          'Abkühlen lassen und mindestens 2 Stunden im Kühlschrank fest werden lassen.',
          'Kurz vor dem Servieren gleichmäßig mit braunem Zucker bestreuen und mit einem Küchenbrenner zu einer knackigen Kruste karamellisieren.',
        ],
        [
          'Preheat the oven to 130 °C conventional (110 °C fan). Slide a deep tray with about 1 l of boiling water onto the middle rack – this is your water bath.',
          'Bring the milk to the boil with the cinnamon stick and orange peel.',
          'Whisk egg yolks, sugar and cornflour until smooth and loosen with 3 tbsp of the hot milk. Stir this mixture into the boiling milk and simmer gently for about 1 minute, stirring constantly, until slightly thickened.',
          'Take the pan off the heat and remove the cinnamon stick and orange peel.',
          'Divide the custard between 4 shallow ovenproof dishes, set them in the water bath and cook for about 35 minutes.',
          'Leave to cool, then chill for at least 2 hours until set.',
          'Just before serving, sprinkle evenly with brown sugar and caramelise with a kitchen blowtorch until crisp.',
        ],
      ],
      source: 'Rezeptausdruck',
    }),
  }),
  bake('bkDessert', {
    id: 'creme-brulee-ohne-ei', o: 'Crème brûlée ohne Ei', en: 'Egg-free crème brûlée', c: 'french', t: 'veggie sweet oven', e: 2,
    i: 'cream milk cornstarch sugar vanilla',
    recipe: rc({
      serves: ['4 Portionen', 'Serves 4'],
      time: ['ca. 40 Min. + mind. 2 Std. Kühlzeit', 'about 40 min + at least 2 h chilling'],
      ing: [
        ['2 EL Vanillezucker', '1 EL Puderzucker', '40 g Speisestärke', '300 ml Milch', '200 ml Sahne', '1 TL Zucker (zum Abflämmen, ggf. mehr)'],
        ['2 tbsp vanilla sugar', '1 tbsp icing sugar', '40 g cornflour', '300 ml milk', '200 ml cream', '1 tsp sugar (for the crust, more if needed)'],
      ],
      steps: [
        [
          'Backofen auf 150 °C Ober-/Unterhitze vorheizen.',
          'Vanillezucker, Puderzucker und Stärke in einer Schüssel vermengen. Milch und Sahne nach und nach dazugießen und klümpchenfrei verrühren.',
          'Die Masse auf 4 Förmchen verteilen. Förmchen in eine Auflaufform stellen und so viel heißes Wasser angießen, dass sie zur Hälfte darin stehen.',
          'Im Ofen ca. 25 Minuten stocken lassen.',
          'Abkühlen lassen und mindestens 2 Stunden kalt stellen.',
          'Vor dem Servieren dünn mit Zucker bestreuen und mit dem Brenner goldbraun karamellisieren.',
        ],
        [
          'Preheat the oven to 150 °C conventional.',
          'Mix vanilla sugar, icing sugar and cornflour in a bowl. Gradually pour in the milk and cream, whisking until there are no lumps.',
          'Divide between 4 ramekins. Place them in a baking dish and pour in hot water until it comes halfway up the sides.',
          'Bake for about 25 minutes until set.',
          'Leave to cool, then chill for at least 2 hours.',
          'Before serving, sprinkle thinly with sugar and caramelise with a blowtorch until golden.',
        ],
      ],
      source: 'Rezeptausdruck',
    }),
  }),
  bake('bkDessert', {
    id: 'fondant-chocolat', o: 'Fondant au chocolat', l: 'fr', de: 'Fondant au chocolat (Schokoküchlein mit flüssigem Kern)', en: 'Chocolate fondant (molten chocolate cake)', c: 'french', t: 'veggie sweet kids oven', e: 1,
    i: 'dark_chocolate butter egg sugar flour cocoa',
    recipe: rc({
      serves: ['4–5 Förmchen', '4–5 ramekins'],
      time: ['ca. 25 Min.', 'about 25 min'],
      ing: [
        ['50 g Zartbitterschokolade (+ 4–5 Stückchen für den Kern)', '50 g Butter (+ etwas für die Förmchen)', '1 Ei + 1 Eigelb', '60 g Zucker', '50 g Mehl', '2 TL Kakao'],
        ['50 g dark chocolate (+ 4–5 small pieces for the centre)', '50 g butter (+ a little for the ramekins)', '1 egg + 1 egg yolk', '60 g sugar', '50 g flour', '2 tsp cocoa powder'],
      ],
      steps: [
        [
          'Backofen auf 160 °C Umluft vorheizen.',
          'Schokolade mit Butter im Wasserbad schmelzen.',
          'Förmchen mit Butter einfetten und gleichmäßig mit etwas Kakao ausstäuben.',
          'Schokoladen-Butter kurz durchrühren und 2 Minuten abkühlen lassen.',
          'Ei und Eigelb mit dem Zucker weiß-schaumig schlagen, dann das Mehl dazugeben und weiterschlagen.',
          'Schokoladen-Butter dazugeben und alles gleichmäßig verrühren.',
          'Teig in die Förmchen gießen und in die Mitte jeweils ein Stück Schokolade stecken – das gibt den flüssigen Kern.',
          'Gut 10 Minuten backen: Der Rand ist fest, die Mitte noch weich. Sofort servieren.',
        ],
        [
          'Preheat the oven to 160 °C fan.',
          'Melt the chocolate and butter over a water bath.',
          'Grease the ramekins with butter and dust evenly with a little cocoa.',
          'Stir the chocolate butter briefly and leave to cool for 2 minutes.',
          'Beat the egg and egg yolk with the sugar until pale and fluffy, then add the flour and keep beating.',
          'Add the chocolate butter and stir until evenly combined.',
          'Pour the batter into the ramekins and push a piece of chocolate into the centre of each – that gives the molten core.',
          'Bake for a good 10 minutes: the edges should be set, the centre still soft. Serve straight away.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkDessert', {
    id: 'kinder-tiramisu', o: 'Kinder-Tiramisu', en: 'Children’s tiramisu (no coffee, no alcohol)', c: 'italian', t: 'veggie sweet kids', e: 1,
    i: 'ladyfingers mascarpone quark strawberries sugar cocoa',
    n: ['Ohne Kaffee und Alkohol – Löffelbiskuits z. B. in Kakao oder Saft tränken.', 'No coffee or alcohol – soak the ladyfingers in cocoa or juice instead.'],
  }),
  bake('bkDessert', {
    id: 'himbeer-baiser-sahne', o: 'Himbeer-Baiser-Sahne-Nachtisch mit gerösteten Mandeln', en: 'Raspberry meringue cream dessert with toasted almonds', c: 'german', t: 'veggie sweet kids summer', e: 1,
    i: 'raspberries meringue cream almonds sugar',
  }),
  bake('bkDessert', {
    id: 'apple-crumble', o: 'Apple crumble', l: 'en', de: 'Apple Crumble', en: 'Apple crumble', c: 'fusion', t: 'veggie sweet kids oven', e: 1,
    i: 'apples flour butter sugar oats cinnamon',
  }),
  bake('bkDessert', {
    id: 'zimtparfait', o: 'Zimtparfait', en: 'Cinnamon parfait', c: 'german', t: 'veggie sweet winter', e: 2,
    i: 'cream egg sugar cinnamon',
  }),
  bake('bkDessert', {
    id: 'joghurt-honig-walnuss', o: 'Γιαούρτι με μέλι και καρύδια', l: 'el', r: 'Giaoúrti me méli kai karýdia', de: 'Griechischer Joghurt mit Honig und Walnüssen', en: 'Greek yoghurt with honey and walnuts', c: 'greek', t: 'veggie sweet', e: 1,
    i: 'yogurt honey walnuts',
  }),
  bake('bkDessert', {
    id: 'trifle', o: 'Trifle', l: 'en', en: 'Trifle', c: 'fusion', t: 'veggie sweet kids social', e: 1,
    i: 'sponge_cake mango raspberries cream mascarpone yogurt',
    n: ['Mit Fertigkuchen, frischer Mango, Sahne/Mascarpone oder Joghurt und Himbeeren schichten.', 'Layer ready-made cake, fresh mango, cream/mascarpone or yoghurt and raspberries.'],
  }),
  bake('bkDessert', {
    id: 'baklava', o: 'Baklava', l: 'tr', en: 'Baklava', c: 'turkish', t: 'veggie sweet oven', e: 3,
    i: 'yufka walnuts pistachios butter sugar honey lemon',
  }),

  // ───────── Pastries & bread ─────────
  bake('bkPastry', {
    id: 'zitronenmuffins', o: 'Zitronenmuffins', en: 'Lemon muffins', c: 'german', t: 'veggie sweet kids oven', e: 1,
    i: 'flour lemon yogurt egg sugar oil',
    recipe: rc({
      serves: ['12 Muffins', '12 muffins'],
      time: ['ca. 40 Min.', 'about 40 min'],
      ing: [
        ['Trocken: 260 g Mehl', '1½ TL Natron', '2 TL Backpulver', '130 g Zucker', '1 Prise Salz', '1 EL abgeriebene Zitronenschale', 'Feucht: 2 Eier (M)', '100 g Öl (oder 120 g geschmolzene Butter)', '210 g Joghurt', '3 EL Zitronensaft', 'Guss: Puderzucker (mit etwas Zitronensaft angerührt)'],
        ['Dry: 260 g flour', '1½ tsp bicarbonate of soda', '2 tsp baking powder', '130 g sugar', '1 pinch of salt', '1 tbsp grated lemon zest', 'Wet: 2 eggs (medium)', '100 g oil (or 120 g melted butter)', '210 g yoghurt', '3 tbsp lemon juice', 'Glaze: icing sugar (mixed with a little lemon juice)'],
      ],
      steps: [
        [
          'Backofen auf 175 °C Ober-/Unterhitze vorheizen, ein 12er-Muffinblech mit Papierförmchen auslegen.',
          'Alle trockenen Zutaten in einer Schüssel mischen.',
          'In einer zweiten Schüssel Eier, Öl, Joghurt und Zitronensaft verquirlen.',
          'Feuchte Zutaten zu den trockenen geben und nur kurz verrühren, bis gerade alles feucht ist – Klümpchen sind in Ordnung.',
          'Teig auf die Förmchen verteilen und 18–20 Minuten backen (Stäbchenprobe).',
          'Abkühlen lassen, Puderzucker mit wenig Zitronensaft zu einem dicken Guss rühren und über die Muffins ziehen.',
        ],
        [
          'Preheat the oven to 175 °C conventional and line a 12-hole muffin tin with paper cases.',
          'Mix all the dry ingredients in a bowl.',
          'In a second bowl, whisk eggs, oil, yoghurt and lemon juice.',
          'Add the wet ingredients to the dry ones and stir only briefly, just until everything is moistened – lumps are fine.',
          'Divide between the cases and bake for 18–20 minutes (skewer test).',
          'Leave to cool, stir icing sugar with a little lemon juice into a thick glaze and drizzle over the muffins.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'franzbroetchen', o: 'Franzbrötchen', en: 'Franzbrötchen (Hamburg cinnamon pastries)', c: 'german', t: 'veggie sweet kids oven', e: 3,
    i: 'flour butter yeast milk sugar cinnamon vanilla',
    recipe: rc({
      serves: ['ca. 13–14 Stück', 'about 13–14 pastries'],
      time: ['ca. 2 Std. (davon ca. 1 Std. Kühl- und Ruhezeit)', 'about 2 h (including about 1 h chilling and resting)'],
      ing: [
        ['Plunderteig: 500 g Weizenmehl Type 550', '250 ml Vollmilch (kalt)', '80 g Zucker', '50 g Butter (kalt)', '42 g frische Hefe (kalt)', '1 Päckchen Bourbon-Vanillezucker', '1 TL Salz', 'Mehl zum Ausrollen', 'Butterplatte: 200 g Butter', '2 EL Mehl', 'Füllung: 100 g Zucker', '2 EL Zimt', '50 g Butter (geschmolzen)', 'Topping: 2 EL Zucker', '1 TL Zimt'],
        ['Dough: 500 g plain flour (German type 550)', '250 ml whole milk (cold)', '80 g sugar', '50 g butter (cold)', '42 g fresh yeast (cold)', '1 sachet bourbon vanilla sugar', '1 tsp salt', 'flour for rolling', 'Butter slab: 200 g butter', '2 tbsp flour', 'Filling: 100 g sugar', '2 tbsp cinnamon', '50 g butter (melted)', 'Topping: 2 tbsp sugar', '1 tsp cinnamon'],
      ],
      steps: [
        [
          'Teig: Alle Teigzutaten etwa 5 Minuten zu einem glatten Teig kneten, in Folie wickeln und 15 Minuten kalt stellen.',
          'Butterplatte: Butter längs halbieren, auf bemehltes Backpapier legen, mit Mehl bestäuben, Papier darüberklappen und die Butter zu einer Platte von ca. 25 × 20 cm ausrollen. Ebenfalls kalt stellen.',
          'Einschlagen: Teig auf bemehlter Fläche zu einem Rechteck von ca. 50 × 25 cm ausrollen. Butterplatte auf eine Hälfte legen, die andere Teighälfte darüberklappen und die Ränder rundum fest zusammendrücken, damit keine Butter austritt.',
          'Erste Tour: Das Päckchen vorsichtig zu einem langen Rechteck (ca. 60 × 25 cm) ausrollen. Wie einen Brief in Drittel falten, in Folie wickeln und 15 Minuten kühlen.',
          'Zweite Tour: Teig um 90° drehen, sodass die offene Seite zu dir zeigt, wieder lang ausrollen, in Drittel falten und weitere 15 Minuten kühlen. Teig und Butter sollen immer kalt bleiben – wird die Butter weich, lieber etwas länger kühlen.',
          'Letzte Tour: Teig erneut lang ausrollen, das rechte Drittel zur Mitte und das linke darüberlegen. Mit der geschlossenen Seite nach oben auf ca. 50 × 40 cm (3–5 mm dick) ausrollen.',
          'Füllung: Teig mit der geschmolzenen Butter bestreichen. Zucker und Zimt mischen und den Großteil darüberstreuen, etwas für das Topping zurückbehalten.',
          'Backofen auf 180 °C Umluft vorheizen. Teig von der langen Seite her eng aufrollen und in ca. 4 cm breite Stücke schneiden.',
          'Jedes Stück mit einem bemehlten Kochlöffelstiel in der Mitte parallel zu den Schnittflächen tief eindrücken, sodass die typische Form entsteht.',
          'Auf 2 mit Backpapier belegte Bleche setzen, 30 Minuten gehen lassen und dann etwas flach drücken.',
          '15–20 Minuten goldbraun backen und noch heiß mit dem restlichen Zimt-Zucker bestreuen.',
        ],
        [
          'Dough: Knead all dough ingredients for about 5 minutes into a smooth dough, wrap in cling film and chill for 15 minutes.',
          'Butter slab: Halve the butter lengthways, place on floured baking paper, dust with flour, fold the paper over and roll the butter into a slab of about 25 × 20 cm. Chill as well.',
          'Enclosing the butter: Roll the dough out on a floured surface to a rectangle of about 50 × 25 cm. Lay the butter slab on one half, fold the other half over and press the edges firmly together so no butter escapes.',
          'First fold: Carefully roll the parcel into a long rectangle (about 60 × 25 cm). Fold it in thirds like a letter, wrap and chill for 15 minutes.',
          'Second fold: Turn the dough 90° so the open side faces you, roll it out long again, fold in thirds and chill for another 15 minutes. Dough and butter should always stay cold – if the butter softens, chill a little longer.',
          'Last fold: Roll the dough out long once more, fold the right third into the middle and the left third over it. With the closed side up, roll out to about 50 × 40 cm (3–5 mm thick).',
          'Filling: Brush the dough with the melted butter. Mix sugar and cinnamon and sprinkle most of it over the dough, keeping some back for the topping.',
          'Preheat the oven to 180 °C fan. Roll the dough up tightly from the long side and cut into pieces about 4 cm wide.',
          'Press the floured handle of a wooden spoon deep into the middle of each piece, parallel to the cut sides, to create the typical shape.',
          'Place on 2 baking trays lined with baking paper, leave to rise for 30 minutes, then flatten slightly.',
          'Bake for 15–20 minutes until golden and sprinkle with the remaining cinnamon sugar while still hot.',
        ],
      ],
      source: 'Rezeptausdruck',
    }),
  }),
  bake('bkPastry', {
    id: 'dinkel-quark-brot', o: 'Dinkel-Vollkornbrot mit Quark', en: 'Wholemeal spelt bread with quark', c: 'german', t: 'veggie oven', e: 2,
    i: 'spelt_flour quark yeast olive_oil',
    recipe: rc({
      serves: ['1 Brot', '1 loaf'],
      time: ['ca. 1 Std. 50 Min. (davon 1 Std. Gehzeit)', 'about 1 h 50 min (including 1 h rising)'],
      ing: [
        ['600 g Dinkel-Vollkornmehl', '1 Pck. Trockenhefe', '2 TL Salz', '1 EL Zucker', '3 EL Olivenöl', '150 g Quark', 'ca. 400 ml warmes Wasser'],
        ['600 g wholemeal spelt flour', '1 sachet dried yeast', '2 tsp salt', '1 tbsp sugar', '3 tbsp olive oil', '150 g quark', 'about 400 ml warm water'],
      ],
      steps: [
        [
          'Mehl, Trockenhefe, Salz und Zucker in einer großen Schüssel mischen.',
          'Olivenöl, Quark und das warme Wasser dazugeben und alles einige Minuten zu einem weichen, leicht klebrigen Teig kneten.',
          'Zugedeckt an einem warmen Ort 1 Stunde gehen lassen.',
          'Backofen auf 200 °C vorheizen. Teig kurz durchkneten, zu einem Laib formen und in eine gefettete Kastenform legen oder auf ein mit Backpapier belegtes Blech setzen.',
          'Ca. 40 Minuten backen. Das Brot ist fertig, wenn es beim Klopfen auf die Unterseite hohl klingt. Auf einem Gitter auskühlen lassen.',
        ],
        [
          'Mix flour, dried yeast, salt and sugar in a large bowl.',
          'Add olive oil, quark and the warm water and knead for a few minutes into a soft, slightly sticky dough.',
          'Cover and leave to rise in a warm place for 1 hour.',
          'Preheat the oven to 200 °C. Knead the dough briefly, shape into a loaf and place in a greased loaf tin or on a tray lined with baking paper.',
          'Bake for about 40 minutes. The bread is done when it sounds hollow when tapped underneath. Cool on a wire rack.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'rosinenbroetchen', o: 'Rosinenbrötchen', en: 'Raisin buns', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'flour raisins milk butter yeast egg sugar',
    recipe: rc({
      serves: ['12 Brötchen', '12 buns'],
      time: ['ca. 1 Std. 40 Min. (davon 1 Std. Gehzeit)', 'about 1 h 40 min (including 1 h rising)'],
      ing: [
        ['80 g Butter', '250 ml Milch (+ etwas zum Bestreichen)', '500 g Mehl', '40 g Zucker', '1 Pck. Vanillezucker', '1 Pck. Trockenhefe', '1 Prise Salz', '1 Ei', '125 g Rosinen'],
        ['80 g butter', '250 ml milk (+ a little for brushing)', '500 g flour', '40 g sugar', '1 sachet vanilla sugar', '1 sachet dried yeast', '1 pinch of salt', '1 egg', '125 g raisins'],
      ],
      steps: [
        [
          'Butter mit der Milch in einem Topf schmelzen und lauwarm abkühlen lassen.',
          'Mehl, Zucker, Vanillezucker, Hefe, Salz, Ei und Rosinen in eine Schüssel geben, die Milch-Butter dazugießen und alles zu einem glatten Teig kneten.',
          'Zugedeckt 60 Minuten gehen lassen.',
          'Teig zu einer Rolle formen, in 12 Stücke teilen und daraus runde Brötchen formen. Auf ein mit Backpapier belegtes Blech setzen.',
          'Backofen auf 200 °C vorheizen. Brötchen mit Milch bestreichen und ca. 13 Minuten goldbraun backen.',
        ],
        [
          'Melt the butter with the milk in a pan and let it cool to lukewarm.',
          'Put flour, sugar, vanilla sugar, yeast, salt, egg and raisins in a bowl, pour in the milk and butter and knead into a smooth dough.',
          'Cover and leave to rise for 60 minutes.',
          'Shape the dough into a log, divide into 12 pieces and form round buns. Place on a tray lined with baking paper.',
          'Preheat the oven to 200 °C. Brush the buns with milk and bake for about 13 minutes until golden.',
        ],
      ],
      tip: [
        'Halbe Menge für 6 Brötchen (1 Blech): 40 g Butter, 125 ml Milch, 250 g Mehl, 20 g Zucker, ½ Pck. Vanillezucker, ½ Pck. Trockenhefe, ½ Ei, 1 Prise Salz, 80 g Rosinen – Zubereitung gleich, 200 °C ca. 13 Min.',
        'Half quantity for 6 buns (1 tray): 40 g butter, 125 ml milk, 250 g flour, 20 g sugar, ½ sachet vanilla sugar, ½ sachet dried yeast, ½ egg, 1 pinch of salt, 80 g raisins – same method, 200 °C for about 13 min.',
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'apfelmus-hafer-muffins', o: 'Apfelmus-Haferflocken-Muffins', en: 'Apple sauce and oat muffins', c: 'german', t: 'vegan sweet kids oven', e: 1,
    i: 'apple_sauce oats flour brown_sugar cinnamon',
    recipe: rc({
      serves: ['ca. 9–12 Muffins', 'about 9–12 muffins'],
      time: ['ca. 35 Min.', 'about 35 min'],
      ing: [
        ['200 g Mehl', '1 EL Backpulver', '1 TL Zimt', '200 g Apfelmus', '50 g Haferflocken', '(60 g brauner Zucker)'],
        ['200 g flour', '1 tbsp baking powder', '1 tsp cinnamon', '200 g apple sauce', '50 g rolled oats', '(60 g brown sugar)'],
      ],
      steps: [
        [
          'Backofen auf 180 °C Ober-/Unterhitze vorheizen, ein Muffinblech mit Papierförmchen auslegen.',
          'Mehl und Backpulver in eine Schüssel sieben, Zimt untermischen.',
          'Apfelmus, Haferflocken und nach Geschmack den braunen Zucker dazugeben und alles kurz zu einem dicken Teig verrühren.',
          'Teig auf die Förmchen verteilen und ca. 20–25 Minuten backen (Stäbchenprobe).',
        ],
        [
          'Preheat the oven to 180 °C conventional and line a muffin tin with paper cases.',
          'Sift flour and baking powder into a bowl and mix in the cinnamon.',
          'Add apple sauce, oats and, if you like, the brown sugar, and stir briefly into a thick batter.',
          'Divide between the cases and bake for about 20–25 minutes (skewer test).',
        ],
      ],
      tip: ['Ist der Teig sehr fest, einen Schuss Milch oder Öl dazugeben.', 'If the batter is very stiff, add a splash of milk or oil.'],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'bananenmuffins', o: 'Bananenmuffins', en: 'Banana muffins with chocolate chips', c: 'german', t: 'veggie sweet kids oven', e: 1,
    i: 'bananas flour egg sugar dark_chocolate oil',
    recipe: rc({
      serves: ['12 Muffins', '12 muffins'],
      time: ['ca. 35 Min.', 'about 35 min'],
      ing: [
        ['4 Bananen (zerdrückt)', '2 Eier', '190 g Mehl', '130 g Zucker', '100 g Schokotropfen', '80 ml Öl', '1,5 TL Backpulver'],
        ['4 bananas (mashed)', '2 eggs', '190 g flour', '130 g sugar', '100 g chocolate chips', '80 ml oil', '1.5 tsp baking powder'],
      ],
      steps: [
        [
          'Backofen auf 180 °C vorheizen, ein 12er-Muffinblech mit Papierförmchen auslegen.',
          'Eier, Zucker und Öl verrühren.',
          'Erst die Schokotropfen, dann die zerdrückten Bananen unterrühren.',
          'Mehl mit Backpulver mischen und nur kurz unterheben.',
          'Teig auf die Förmchen verteilen und 20–25 Minuten backen.',
        ],
        [
          'Preheat the oven to 180 °C and line a 12-hole muffin tin with paper cases.',
          'Whisk eggs, sugar and oil together.',
          'Stir in first the chocolate chips, then the mashed bananas.',
          'Mix flour with baking powder and fold in briefly.',
          'Divide between the cases and bake for 20–25 minutes.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'zimtschnecken', o: 'Zimtschnecken mit Kardamom', en: 'Cinnamon rolls with cardamom', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'flour butter milk yeast sugar cinnamon cardamom',
    recipe: rc({
      serves: ['ca. 16 Stück', 'about 16 rolls'],
      time: ['ca. 1 Std. 30 Min.', 'about 1 h 30 min'],
      ing: [
        ['Teig: 500 g Mehl', '1 Pck. Trockenhefe', '½ TL Salz', '75 g Zucker', '1 TL Kardamom', '75 g Butter', '280 ml Milch', 'Füllung: 40 g geschmolzene Butter', '50 g Zucker', '1 Pck. Vanillezucker', '1 EL Zimt', 'Zum Bestreichen: 1 Eigelb oder etwas Milch'],
        ['Dough: 500 g flour', '1 sachet dried yeast', '½ tsp salt', '75 g sugar', '1 tsp ground cardamom', '75 g butter', '280 ml milk', 'Filling: 40 g melted butter', '50 g sugar', '1 sachet vanilla sugar', '1 tbsp cinnamon', 'For brushing: 1 egg yolk or a little milk'],
      ],
      steps: [
        [
          'Mehl, Hefe, Salz, Zucker und Kardamom in einer Schüssel mischen.',
          'Butter mit der Milch erwärmen, bis die Butter geschmolzen ist (nur lauwarm, nicht heiß).',
          'Warme Milch-Butter zu den trockenen Zutaten geben und zu einem glatten Teig kneten.',
          'Zugedeckt 30 Minuten gehen lassen.',
          'Teig auf bemehlter Fläche zu einem Rechteck von ca. 5 mm Dicke ausrollen.',
          'Für die Füllung Butter, Zucker, Vanillezucker und Zimt verrühren und den Teig damit bestreichen.',
          'Teig locker aufrollen und in ca. 2 cm dicke Scheiben schneiden. Mit Abstand auf ein mit Backpapier belegtes Blech legen und nochmals kurz gehen lassen.',
          'Backofen auf 180–200 °C vorheizen. Schnecken mit Eigelb oder Milch bestreichen und ca. 20 Minuten goldbraun backen.',
        ],
        [
          'Mix flour, yeast, salt, sugar and cardamom in a bowl.',
          'Warm the butter with the milk until the butter has melted (lukewarm only, not hot).',
          'Add the warm milk and butter to the dry ingredients and knead into a smooth dough.',
          'Cover and leave to rise for 30 minutes.',
          'Roll the dough out on a floured surface into a rectangle about 5 mm thick.',
          'For the filling, stir together butter, sugar, vanilla sugar and cinnamon and spread over the dough.',
          'Roll the dough up loosely and cut into slices about 2 cm thick. Place spaced apart on a tray lined with baking paper and leave to rise again briefly.',
          'Preheat the oven to 180–200 °C. Brush the rolls with egg yolk or milk and bake for about 20 minutes until golden.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'galette-des-rois', o: 'Galette des rois aux pommes', l: 'fr', de: 'Galette des Rois mit Äpfeln (Dreikönigskuchen)', en: 'Galette des rois with apples (Epiphany pie)', c: 'french', t: 'veggie sweet kids oven social winter', e: 2,
    i: 'puff_pastry apples butter sugar vanilla egg',
    n: ['Zum Dreikönigstag: Wer die versteckte Bohne findet, ist König oder Königin.', 'For Epiphany: whoever finds the hidden bean is king or queen for the day.'],
    recipe: rc({
      serves: ['1 Galette (ca. 8 Stücke)', '1 galette (about 8 slices)'],
      time: ['ca. 1 Std. 45 Min. (inkl. 30 Min. Kühlen)', 'about 1 h 45 min (incl. 30 min chilling)'],
      ing: [
        ['8 Äpfel', '30 g Butter', '2 TL Zucker', '1 Vanilleschote', '2 Rollen Blätterteig (rund)', '1 Eigelb', '1 getrocknete Bohne (oder eine Porzellanfigur)'],
        ['8 apples', '30 g butter', '2 tsp sugar', '1 vanilla pod', '2 rolls of puff pastry (round)', '1 egg yolk', '1 dried bean (or a small porcelain figure)'],
      ],
      steps: [
        [
          'Äpfel schälen, entkernen und würfeln.',
          'Butter in einem Topf schmelzen, Äpfel, Zucker sowie Mark und Schote der Vanille dazugeben und einige Minuten weich dünsten (compoter). Schote entfernen und das Kompott vollständig abkühlen lassen.',
          'Einen Blätterteigkreis auf ein mit Backpapier belegtes Blech legen und das Apfelkompott darauf verteilen, dabei rundum 2 cm Rand frei lassen.',
          'Die Bohne irgendwo im Apfelkompott verstecken!',
          'Den freien Rand mit verquirltem Eigelb bestreichen.',
          'Zweiten Teigkreis darauflegen und den Rand gut andrücken, damit die Füllung nicht ausläuft.',
          'Oberfläche mit Eigelb bestreichen und die Galette mindestens 30 Minuten kühlen.',
          'Backofen auf 180 °C vorheizen.',
          'Galette nochmals mit Eigelb bestreichen, mit einem Messer ein Muster in die Oberfläche ritzen (nicht durchschneiden) und 40–45 Minuten goldbraun backen.',
        ],
        [
          'Peel, core and dice the apples.',
          'Melt the butter in a pan, add the apples, sugar and the vanilla seeds and pod, and stew for a few minutes until soft (compoter). Remove the pod and let the compote cool completely.',
          'Place one puff pastry round on a tray lined with baking paper and spread the apple compote over it, leaving a 2 cm border all round.',
          'Hide the bean somewhere in the apple compote!',
          'Brush the border with beaten egg yolk.',
          'Lay the second pastry round on top and press the edges together firmly so the filling cannot leak.',
          'Brush the top with egg yolk and chill the galette for at least 30 minutes.',
          'Preheat the oven to 180 °C.',
          'Brush with egg yolk once more, score a pattern into the top with a knife (without cutting through) and bake for 40–45 minutes until golden.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkPastry', {
    id: 'granola', o: 'Knuspermüsli', de: 'Granola / Knuspermüsli', en: 'Granola', c: 'german', t: 'vegan sweet kids oven', e: 1,
    i: 'oats almonds pumpkin_seeds sunflower_seeds coconut maple_syrup olive_oil brown_sugar cinnamon',
    recipe: rc({
      serves: ['ca. 1 großes Glas', 'about 1 large jar'],
      time: ['ca. 55 Min.', 'about 55 min'],
      ing: [
        ['3 Tassen kernige Haferflocken', '1 Tasse Kürbiskerne', '1 Tasse Sonnenblumenkerne', '1 Tasse Kokoschips', '1¼ Tassen grob gehackte Mandeln', '¼ Tasse Ahornsirup', '⅓ Tasse Olivenöl', '¼ Tasse brauner Zucker', '1 TL Zimt', '1 TL Salz', 'optional: Leinsamen, gehackte Datteln'],
        ['3 cups jumbo rolled oats', '1 cup pumpkin seeds', '1 cup sunflower seeds', '1 cup coconut chips', '1¼ cups roughly chopped almonds', '¼ cup maple syrup', '⅓ cup olive oil', '¼ cup brown sugar', '1 tsp cinnamon', '1 tsp salt', 'optional: linseeds, chopped dates'],
      ],
      steps: [
        [
          'Backofen auf 150 °C Ober-/Unterhitze vorheizen, ein Blech mit Backpapier auslegen.',
          'Haferflocken, Kerne, Kokoschips, Mandeln, Zucker, Zimt und Salz (und nach Wunsch Leinsamen) in einer großen Schüssel mischen.',
          'Ahornsirup und Olivenöl dazugeben und alles gründlich vermengen, bis alles leicht überzogen ist.',
          'Gleichmäßig auf dem Blech verteilen und ca. 45 Minuten goldbraun rösten, dabei alle 15 Minuten wenden.',
          'Auf dem Blech vollständig abkühlen lassen (dann wird es knusprig), nach Wunsch gehackte Datteln untermischen und luftdicht aufbewahren.',
        ],
        [
          'Preheat the oven to 150 °C conventional and line a tray with baking paper.',
          'Mix oats, seeds, coconut chips, almonds, sugar, cinnamon and salt (and linseeds, if using) in a large bowl.',
          'Add maple syrup and olive oil and mix thoroughly until everything is lightly coated.',
          'Spread evenly on the tray and toast for about 45 minutes until golden, turning every 15 minutes.',
          'Leave to cool completely on the tray (that is when it gets crunchy), mix in chopped dates if you like and store airtight.',
        ],
      ],
      family: true,
    }),
  }),

  // ───────── Sweets ─────────
  bake('bkSweets', {
    id: 'trueffelspitzen', g: 'pralinen', o: 'Trüffelspitzen', en: 'Truffle kisses (piped chocolate nougat truffles)', c: 'german', t: 'veggie sweet', e: 2,
    i: 'dark_chocolate milk_chocolate cream coconut_fat nougat pistachios',
    recipe: rc({
      serves: ['ca. 40 Pralinen', 'about 40 chocolates'],
      time: ['ca. 30 Min. + Kühlzeit', 'about 30 min + chilling'],
      ing: [
        ['150 g Zartbitterschokolade', '100 g Vollmilchschokolade', '200 g Sahne', '100 g Kokosfett', '200 g Nuss-Nougat', 'gehackte Pistazien zum Bestreuen', 'Pralinen-Papierförmchen'],
        ['150 g dark chocolate', '100 g milk chocolate', '200 g cream', '100 g coconut fat', '200 g hazelnut nougat', 'chopped pistachios for sprinkling', 'paper sweet cases'],
      ],
      steps: [
        [
          'Beide Schokoladen, Sahne und Kokosfett bei schwacher Hitze schmelzen.',
          'Nougat in kleinen Stücken dazugeben und darin schmelzen lassen.',
          'Alles glatt mixen und kalt stellen, bis die Masse spritzfähig fest ist.',
          'Mit einem Spritzbeutel mit Sterntülle in Papierförmchen spritzen und mit Pistazien bestreuen. Kühl aufbewahren.',
        ],
        [
          'Melt both chocolates, cream and coconut fat over a low heat.',
          'Add the nougat in small pieces and let it melt in.',
          'Blend until smooth and chill until firm enough to pipe.',
          'Pipe into paper cases using a piping bag with a star nozzle and sprinkle with pistachios. Keep cool.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'mozartkugeln', g: 'pralinen', o: 'Mozartkugeln', en: 'Mozart balls (nougat, marzipan and chocolate)', c: 'austrian', t: 'veggie sweet', e: 2,
    i: 'marzipan nougat rose_water sugar cocoa pistachios',
    recipe: rc({
      serves: ['ca. 25 Kugeln', 'about 25 balls'],
      time: ['ca. 45 Min. + Kühlzeit', 'about 45 min + chilling'],
      ing: [
        ['200 g Nuss-Nougat', '200 g Marzipan', '2 EL Rosenwasser', '100 g Puderzucker', '100–200 g Kakaoglasur', 'gehackte Pistazien'],
        ['200 g hazelnut nougat', '200 g marzipan', '2 tbsp rose water', '100 g icing sugar', '100–200 g cocoa coating', 'chopped pistachios'],
      ],
      steps: [
        [
          'Nougat zu kleinen Kugeln formen und kalt stellen.',
          'Marzipan mit Rosenwasser und Puderzucker glatt verkneten.',
          'Marzipan portionsweise flach drücken und jede Nougatkugel damit umhüllen, zu glatten Kugeln rollen.',
          'Kakaoglasur schmelzen, die Kugeln eintauchen, abtropfen lassen und mit Pistazien bestreuen. Fest werden lassen.',
        ],
        [
          'Shape the nougat into small balls and chill.',
          'Knead marzipan with rose water and icing sugar until smooth.',
          'Flatten portions of marzipan and wrap each nougat ball in it, rolling into smooth balls.',
          'Melt the cocoa coating, dip the balls, let the excess drip off and sprinkle with pistachios. Leave to set.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'butterpralinen', g: 'pralinen', o: 'Butterpralinen', en: 'Chocolate butter truffles', c: 'german', t: 'veggie sweet', e: 1,
    i: 'butter dark_chocolate pudding_powder rum_aroma chocolate_sprinkles',
    recipe: rc({
      serves: ['ca. 20 Pralinen', 'about 20 chocolates'],
      time: ['ca. 30 Min. + Kühlzeit', 'about 30 min + chilling'],
      ing: [
        ['50 g Butter (weich)', '150 g Schokolade (geschmolzen)', '1 Pck. Schoko-Dessertpulver', '6 Tropfen Rumaroma', 'Schokostreusel zum Wälzen'],
        ['50 g butter (soft)', '150 g chocolate (melted)', '1 sachet chocolate dessert powder', '6 drops rum flavouring', 'chocolate sprinkles for rolling'],
      ],
      steps: [
        [
          'Butter schaumig schlagen.',
          'Geschmolzene, leicht abgekühlte Schokolade, Dessertpulver und Rumaroma dazugeben und gut verrühren.',
          'Masse kurz kalt stellen, dann kleine Kugeln formen und in Schokostreuseln wälzen. Kühl aufbewahren.',
        ],
        [
          'Beat the butter until fluffy.',
          'Add the melted, slightly cooled chocolate, dessert powder and rum flavouring and mix well.',
          'Chill the mixture briefly, then shape small balls and roll them in chocolate sprinkles. Keep cool.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'nusstrueffel', g: 'pralinen', o: 'Nusstrüffel', en: 'Hazelnut truffles', c: 'german', t: 'veggie sweet', e: 1,
    i: 'hazelnuts dark_chocolate butter sugar vanilla',
    recipe: rc({
      serves: ['ca. 25 Trüffel', 'about 25 truffles'],
      time: ['ca. 30 Min. + Kühlzeit', 'about 30 min + chilling'],
      ing: [
        ['75 g Butter (weich)', '200 g Zartbitterschokolade (geschmolzen)', '75 g Puderzucker', '1 Pck. Vanillezucker', '100 g gemahlene, leicht geröstete Haselnüsse'],
        ['75 g butter (soft)', '200 g dark chocolate (melted)', '75 g icing sugar', '1 sachet vanilla sugar', '100 g ground, lightly toasted hazelnuts'],
      ],
      steps: [
        [
          'Haselnüsse in einer trockenen Pfanne leicht anrösten und abkühlen lassen.',
          'Butter schaumig schlagen, geschmolzene Schokolade, Puderzucker und Vanillezucker unterrühren.',
          'Die Hälfte der Haselnüsse in die Masse geben und kurz kalt stellen.',
          'Kleine Kugeln formen und in den restlichen Haselnüssen wälzen. Kühl aufbewahren.',
        ],
        [
          'Lightly toast the hazelnuts in a dry pan and leave to cool.',
          'Beat the butter until fluffy, then stir in the melted chocolate, icing sugar and vanilla sugar.',
          'Add half the hazelnuts to the mixture and chill briefly.',
          'Shape small balls and roll them in the remaining hazelnuts. Keep cool.',
        ],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'kaffeegewuerz', o: 'Kaffeegewürz', en: 'Coffee spice blend', c: 'german', t: 'vegan', e: 1,
    i: 'cardamom cinnamon vanilla coriander cloves nutmeg ginger black_pepper',
    recipe: rc({
      serves: ['1 kleines Glas', '1 small jar'],
      time: ['ca. 5 Min.', 'about 5 min'],
      ing: [
        ['Kardamom', 'Zimt', 'Vanille', 'Koriander', 'Nelken', 'Muskatnuss', 'Ingwer', 'Pfeffer (alles gemahlen)'],
        ['Cardamom', 'Cinnamon', 'Vanilla', 'Coriander', 'Cloves', 'Nutmeg', 'Ginger', 'Pepper (all ground)'],
      ],
      steps: [
        ['Alle gemahlenen Gewürze nach Geschmack mischen, luftdicht aufbewahren und je eine Prise pro Tasse zum Kaffee geben.'],
        ['Mix all the ground spices to taste, store airtight and add a pinch per cup of coffee.'],
      ],
      family: true,
    }),
  }),
  bake('bkSweets', {
    id: 'churchkhela', o: 'ჩურჩხელა', l: 'ka', r: 'Churchkhela', de: 'Churchkhela (Walnuss-Traubensaft-Süßigkeit)', en: 'Churchkhela (walnuts in grape juice)', c: 'georgian', t: 'vegan sweet', e: 3,
    i: 'walnuts grape_juice flour',
    recipe: rc({
      serves: ['ca. 6–8 Stränge', 'about 6–8 strands'],
      time: ['ca. 1 Std. + mehrere Tage Trocknen', 'about 1 h + several days drying'],
      ing: [
        ['ca. 200 g Walnusshälften', '1 l Traubensaft', 'ca. 100 g Mehl', 'Küchengarn und eine dicke Nadel'],
        ['about 200 g walnut halves', '1 l grape juice', 'about 100 g flour', 'kitchen string and a large needle'],
      ],
      steps: [
        [
          'Walnusshälften mit Nadel und Garn zu ca. 25 cm langen Ketten auffädeln; oben eine Schlaufe zum Aufhängen lassen.',
          'Etwa ein Viertel des Traubensafts mit dem Mehl glatt rühren. Den übrigen Saft aufkochen, die Mehlmischung unter Rühren einlaufen lassen und bei kleiner Hitze rühren, bis eine dicke, glänzende Masse entsteht (wie dicker Pudding).',
          'Die Nussketten in die heiße Masse tauchen, herausziehen und kurz abtropfen lassen. Aufhängen, einige Minuten antrocknen lassen und den Vorgang mehrmals wiederholen, bis eine gleichmäßige, etwa 1 cm dicke Hülle entstanden ist.',
          'An einem luftigen, trockenen Ort mehrere Tage aufhängen, bis die Oberfläche nicht mehr klebt. Zum Servieren in Scheiben schneiden.',
        ],
        [
          'Thread the walnut halves onto string with the needle to make strands about 25 cm long, leaving a loop at the top for hanging.',
          'Stir about a quarter of the grape juice with the flour until smooth. Bring the rest of the juice to the boil, pour in the flour mixture while stirring and keep stirring over a low heat until thick and glossy (like a thick pudding).',
          'Dip the walnut strands into the hot mixture, pull them out and let them drip briefly. Hang them up, let them dry for a few minutes and repeat several times until they have an even coating about 1 cm thick.',
          'Hang in an airy, dry place for several days until the surface is no longer sticky. Slice to serve.',
        ],
      ],
      source: 'Artanuji (georgische Rezeptkarte)',
    }),
  }),

  // ───────── Sweet dinners ─────────
  d({
    id: 'pancakes', s: 'dough', o: 'Pancakes', l: 'en', en: 'American pancakes', c: 'american', t: 'veggie sweet kids', e: 1,
    i: 'flour egg milk sugar',
    recipe: rc({
      serves: ['ca. 10–12 Pancakes', 'about 10–12 pancakes'],
      time: ['ca. 35 Min. (inkl. 15 Min. Ruhezeit)', 'about 35 min (incl. 15 min resting)'],
      ing: [
        ['2 Eier', '2 EL Zucker', '1 Prise Salz', '200 ml Milch', '200 g Mehl', '1 TL Backpulver', 'Butter oder Öl für die Pfanne'],
        ['2 eggs', '2 tbsp sugar', '1 pinch of salt', '200 ml milk', '200 g flour', '1 tsp baking powder', 'butter or oil for the pan'],
      ],
      steps: [
        [
          'Eier trennen. Für besonders fluffige Pancakes das Eiweiß steif schlagen (man kann die Eier aber auch ganz verwenden).',
          'Eigelb mit dem Zucker cremig schlagen und die Milch unterrühren.',
          'Salz, Mehl (am besten gesiebt) und Backpulver einrühren, bis ein glatter Teig entsteht. Zum Schluss den Eischnee vorsichtig unterheben.',
          'Teig 15 Minuten ruhen lassen.',
          'Eine Pfanne bei mittlerer Hitze erhitzen und leicht fetten. Je eine kleine Kelle Teig hineingeben.',
          'Sobald sich an der Oberfläche kleine Bläschen bilden, wenden und die zweite Seite goldbraun backen.',
        ],
        [
          'Separate the eggs. For extra fluffy pancakes, beat the whites until stiff (you can also use the eggs whole).',
          'Beat the yolks with the sugar until creamy and stir in the milk.',
          'Stir in salt, flour (ideally sifted) and baking powder to make a smooth batter. Finally, gently fold in the beaten egg whites.',
          'Leave the batter to rest for 15 minutes.',
          'Heat a frying pan over a medium heat and grease lightly. Add a small ladle of batter per pancake.',
          'As soon as small bubbles appear on the surface, flip and cook the second side until golden.',
        ],
      ],
      family: true,
    }),
  }),
  d({ id: 'kirschmichel', s: 'bread', o: 'Kirschmichel', en: 'Cherry bread pudding', c: 'german', t: 'veggie sweet kids oven', e: 2, i: 'bread_roll cherries milk egg sugar butter almonds cinnamon' }),
  d({ id: 'zwetschgenknoedel', g: 'obstknoedel', s: 'dough', o: 'Zwetschgenknödel', en: 'Plum dumplings', c: 'austrian', t: 'veggie sweet kids', e: 3, i: 'plums quark flour egg butter breadcrumbs sugar cinnamon' }),
  d({ id: 'marillenknoedel', g: 'obstknoedel', s: 'dough', o: 'Marillenknödel', en: 'Apricot dumplings', c: 'austrian', t: 'veggie sweet kids summer', e: 3, i: 'apricots quark flour egg butter breadcrumbs sugar' }),
]

/** Recipes for dishes that already exist elsewhere (attached by id). */
export const MORE_BAKE_RECIPES: Record<string, Recipe> = {
  'creme-brulee': rc({
    serves: ['ca. 4 Förmchen', 'about 4 ramekins'],
    time: ['ca. 1 Std. 15 Min. + Kühlzeit', 'about 1 h 15 min + chilling'],
    ing: [
      ['165 ml Sahne', '150 ml Milch (1,5 %)', '1 Päckchen Vanillezucker', '85 g Zucker (+ etwas zum Karamellisieren)', 'gemahlene Vanilleschote aus der Mühle', '1 Ei'],
      ['165 ml cream', '150 ml milk (1.5 %)', '1 sachet vanilla sugar', '85 g sugar (+ a little for caramelising)', 'ground vanilla pod from the mill', '1 egg'],
    ],
    steps: [
      [
        'Backofen auf 180 °C vorheizen.',
        'Sahne, Milch, Vanillezucker, Zucker, gemahlene Vanille und Ei gut miteinander verrühren.',
        'Die Masse durch ein Sieb gießen und auf die Förmchen verteilen.',
        'Förmchen auf die Fettpfanne stellen und so viel kochendes Wasser angießen, dass sie etwa zur Hälfte im Wasser stehen.',
        'Ca. 55 Minuten stocken lassen, dann abkühlen lassen und kalt stellen.',
        'Vor dem Karamellisieren die Förmchen 10 Minuten ins Gefrierfach stellen – so bleibt die Creme kalt, während die Oberfläche brennt.',
        'Dünn mit Zucker bestreuen und mit dem Brenner zu einer goldbraunen Kruste abflämmen.',
      ],
      [
        'Preheat the oven to 180 °C.',
        'Whisk cream, milk, vanilla sugar, sugar, ground vanilla and egg together well.',
        'Pour the mixture through a sieve and divide between the ramekins.',
        'Place the ramekins on the deep oven tray and pour in boiling water until they stand about halfway in water.',
        'Bake for about 55 minutes until set, then leave to cool and chill.',
        'Before caramelising, put the ramekins in the freezer for 10 minutes – this keeps the custard cold while the top is torched.',
        'Sprinkle thinly with sugar and caramelise with a blowtorch to a golden crust.',
      ],
    ],
    tip: ['Wichtig: Die Masse unbedingt durch ein Sieb gießen – so wird die Creme ganz glatt.', 'Important: always pour the mixture through a sieve – that makes the custard perfectly smooth.'],
    family: true,
  }),
  muffins: rc({
    serves: ['9–12 Muffins', '9–12 muffins'],
    time: ['ca. 35 Min.', 'about 35 min'],
    ing: [
      ['280 g Mehl', '125 g Zucker', '1 Prise Salz', '15 g Backpulver', '½ Apfel, püriert (≈ 2 EL Apfelmus)', '100 ml Öl', '150 ml Mineralwasser', 'nach Lust: Früchte, Schokolade oder Nüsse', 'nach Lust: Zimt oder Vanille', 'Papierförmchen'],
      ['280 g flour', '125 g sugar', '1 pinch of salt', '15 g baking powder', '½ apple, puréed (≈ 2 tbsp apple sauce)', '100 ml oil', '150 ml sparkling mineral water', 'as you like: fruit, chocolate or nuts', 'as you like: cinnamon or vanilla', 'paper cases'],
    ],
    steps: [
      [
        'Backofen auf 180 °C Umluft vorheizen, ein Muffinblech mit Papierförmchen auslegen.',
        'Mehl, Zucker, Salz und Backpulver (und nach Wunsch Zimt oder Vanille) in einer Schüssel mischen.',
        'Apfelpüree, Öl und Mineralwasser dazugeben und nur kurz zu einem glatten Teig verrühren.',
        'Nach Lust Früchte, Schokostückchen oder Nüsse unterheben.',
        'Teig auf 9–12 Förmchen verteilen und 20–25 Minuten backen (Stäbchenprobe).',
      ],
      [
        'Preheat the oven to 180 °C fan and line a muffin tin with paper cases.',
        'Mix flour, sugar, salt and baking powder (and cinnamon or vanilla, if using) in a bowl.',
        'Add the apple purée, oil and mineral water and stir briefly into a smooth batter.',
        'Fold in fruit, chocolate pieces or nuts as you like.',
        'Divide between 9–12 cases and bake for 20–25 minutes (skewer test).',
      ],
    ],
    vegan: ['Das Grundrezept kommt ohne Ei und Milch aus und ist damit vegan.', 'This basic recipe uses no egg or dairy, so it is vegan.'],
    family: true,
  }),
  kaiserschmarrn: rc({
    serves: ['4 Personen', 'Serves 4'],
    time: ['ca. 45 Min.', 'about 45 min'],
    ing: [
      ['8 Eier (L)', '80 g Zucker', '240 g Mehl', '280 ml Vollmilch', '1 Prise Salz', '120 g Butter', '60 g Mandelblättchen', 'Puderzucker', 'Apfelmus: 8 Äpfel', '400 ml Wasser', '1 TL Zimt', '4 TL Bourbon-Vanillezucker'],
      ['8 eggs (large)', '80 g sugar', '240 g flour', '280 ml whole milk', '1 pinch of salt', '120 g butter', '60 g flaked almonds', 'icing sugar', 'Apple sauce: 8 apples', '400 ml water', '1 tsp cinnamon', '4 tsp bourbon vanilla sugar'],
    ],
    steps: [
      [
        'Eier trennen. Eigelb und Zucker hell und cremig aufschlagen, dann Mehl und Milch im Wechsel einrühren, bis ein glatter Teig entsteht. Etwas quellen lassen.',
        'Für das Apfelmus die Äpfel schälen, entkernen und würfeln. Mit Wasser, Zimt und Vanillezucker in einen Topf geben, zugedeckt ca. 10 Minuten weich dünsten und grob pürieren.',
        'Backofen auf 50 °C stellen, um den ersten Schmarrn darin warm zu halten.',
        'Eiweiß mit einer Prise Salz zu festem Schnee schlagen und locker unter den Teig heben.',
        'Ein Viertel der Butter in einer großen beschichteten Pfanne aufschäumen lassen und die Hälfte des Teigs hineingießen. Mit Deckel ca. 5 Minuten backen, bis die Unterseite goldbraun ist.',
        'Den Fladen vierteln, die Stücke wenden und weitere 2 Minuten backen. Dann mit zwei Pfannenwendern in mundgerechte Stücke zupfen.',
        'Ein weiteres Viertel der Butter, die Hälfte der Mandeln und 1 EL Puderzucker dazugeben und unter Schwenken leicht karamellisieren. Im Ofen warm halten.',
        'Mit dem restlichen Teig, Butter und Mandeln eine zweite Portion genauso zubereiten.',
        'Mit Puderzucker bestäuben und mit dem warmen oder kalten Apfelmus servieren.',
      ],
      [
        'Separate the eggs. Beat the yolks and sugar until pale and creamy, then stir in the flour and milk alternately to make a smooth batter. Let it rest a little.',
        'For the apple sauce, peel, core and dice the apples. Put them in a pan with the water, cinnamon and vanilla sugar, cover and stew for about 10 minutes until soft, then roughly purée.',
        'Set the oven to 50 °C to keep the first batch warm.',
        'Beat the egg whites with a pinch of salt until stiff and fold loosely into the batter.',
        'Melt a quarter of the butter in a large non-stick pan until foaming and pour in half the batter. Cover and cook for about 5 minutes until golden underneath.',
        'Cut the pancake into quarters, turn the pieces and cook for another 2 minutes. Then tear into bite-sized pieces with two spatulas.',
        'Add another quarter of the butter, half the almonds and 1 tbsp icing sugar and toss until lightly caramelised. Keep warm in the oven.',
        'Make a second batch the same way with the remaining batter, butter and almonds.',
        'Dust with icing sugar and serve with the warm or cold apple sauce.',
      ],
    ],
    source: 'SZ-Magazin',
  }),
  waffeln: rc({
    serves: ['ca. 8–10 Waffeln', 'about 8–10 waffles'],
    time: ['ca. 40 Min.', 'about 40 min'],
    ing: [
      ['125 g Butter (weich)', '2 kleine Eier', '250 g Mehl', '2 TL Backpulver', '150 g Joghurt', '250 ml Milch', '100 g Apfelmus', 'etwas Öl oder Butter für das Waffeleisen'],
      ['125 g butter (soft)', '2 small eggs', '250 g flour', '2 tsp baking powder', '150 g yoghurt', '250 ml milk', '100 g apple sauce', 'a little oil or butter for the waffle iron'],
    ],
    steps: [
      [
        'Butter cremig rühren und die Eier nacheinander unterschlagen.',
        'Joghurt, Milch und Apfelmus dazugeben und glatt rühren.',
        'Mehl mit Backpulver mischen und kurz unterrühren, bis ein glatter, dickflüssiger Teig entsteht. 10 Minuten ruhen lassen.',
        'Waffeleisen vorheizen und leicht fetten.',
        'Je eine kleine Kelle Teig in die Mitte geben, Eisen schließen und die Waffeln goldbraun backen.',
        'Auf einem Gitter kurz abkühlen lassen, damit sie knusprig bleiben, und warm servieren.',
      ],
      [
        'Beat the butter until creamy and beat in the eggs one at a time.',
        'Add yoghurt, milk and apple sauce and stir until smooth.',
        'Mix flour with baking powder and stir in briefly to make a smooth, thick batter. Leave to rest for 10 minutes.',
        'Preheat the waffle iron and grease it lightly.',
        'Pour a small ladle of batter into the centre, close the iron and bake the waffles until golden.',
        'Let them cool briefly on a wire rack so they stay crisp, and serve warm.',
      ],
    ],
    tip: ['Der Teig ist nur durch das Apfelmus gesüßt – wer es süßer mag, gibt 2–3 EL Zucker dazu oder serviert mit Puderzucker.', 'The batter is sweetened only by the apple sauce – add 2–3 tbsp sugar if you like it sweeter, or serve with icing sugar.'],
    family: true,
  }),
}
