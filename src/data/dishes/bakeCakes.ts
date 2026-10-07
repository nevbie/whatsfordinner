import { bake, rc } from './define'
import type { Dish, Recipe } from '../types'


export const cakeDishes: Dish[] = [
  bake('bkCake', {
    id: 'apfel-zimt-kuchen', o: 'Apfel-Zimt-Kuchen', en: 'Apple cinnamon cake', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'apples flour butter egg sugar cinnamon milk',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. 15 Min.', 'about 1 h 15 min'],
      ing: [
        ['Teig: 200 g Mehl', '2 TL Backpulver', '100 g brauner Zucker', '1 Päckchen Vanillezucker', '120 g weiche Butter', '2 Eier', '120 ml Milch', 'Belag: 2–3 Äpfel', '70 g brauner Zucker + 1½ TL Zimt, gemischt', 'Guss: 40 g Puderzucker', '4 TL Milch'],
        ['Batter: 200 g flour', '2 tsp baking powder', '100 g brown sugar', '1 sachet vanilla sugar', '120 g soft butter', '2 eggs', '120 ml milk', 'Topping: 2–3 apples', '70 g brown sugar + 1½ tsp cinnamon, mixed', 'Glaze: 40 g icing sugar', '4 tsp milk'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Springform fetten. Äpfel schälen, entkernen und in dünne Spalten schneiden.', 'Butter mit Zucker und Vanillezucker schaumig schlagen, die Eier nacheinander unterrühren.', 'Mehl mit Backpulver mischen und unterrühren, dann die Milch dazugeben und alles glatt verrühren.', 'Die Hälfte des Teigs in die Form streichen, die Hälfte der Äpfel darauflegen und mit der Hälfte des Zimt-Zuckers bestreuen.', 'Restlichen Teig darauf verteilen, mit den übrigen Äpfeln belegen und den restlichen Zimt-Zucker darüberstreuen.', '50–55 Min. backen (Stäbchenprobe), etwas abkühlen lassen.', 'Puderzucker mit der Milch glatt rühren und über den Kuchen träufeln.'],
        ['Preheat the oven to 180 °C conventional and grease the tin. Peel, core and thinly slice the apples.', 'Beat butter with sugar and vanilla sugar until fluffy, then beat in the eggs one at a time.', 'Mix flour and baking powder and stir in, then add the milk and stir until smooth.', 'Spread half the batter in the tin, top with half the apples and sprinkle with half the cinnamon sugar.', 'Spread the rest of the batter on top, cover with the remaining apples and sprinkle with the rest of the cinnamon sugar.', 'Bake for 50–55 min (skewer test) and let cool a little.', 'Stir the icing sugar and milk until smooth and drizzle over the cake.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'pastinaken-aepfel-kuchen', o: 'Pastinaken-Äpfel-Kuchen', en: 'Parsnip and apple traybake', c: 'german', t: 'veggie sweet oven winter', e: 2,
    i: 'parsnips apples flour hazelnuts egg oil sugar oranges cinnamon cardamom nutmeg',
    n: ['Wie ein Rüblikuchen, nur mit Pastinaken.', 'Like a carrot cake, just with parsnips.'],
    recipe: rc({
      serves: ['1 Blech (24 Stück)', '1 baking tray (24 pieces)'],
      time: ['ca. 1 Std.', 'about 1 h'],
      ing: [
        ['400 g Dinkelmehl (Type 630)', '240 g gemahlene Nüsse', '6 TL Backpulver', '1 Prise Muskat, 1 Prise Kardamom, 1 TL Zimt', '6 Eier', '500 ml Öl', '400 g Zucker', '900 g Pastinaken', '600 g säuerliche Äpfel', 'abgeriebene Schale von 1 Orange'],
        ['400 g spelt flour (type 630)', '240 g ground nuts', '6 tsp baking powder', '1 pinch nutmeg, 1 pinch cardamom, 1 tsp cinnamon', '6 eggs', '500 ml oil', '400 g sugar', '900 g parsnips', '600 g tart apples', 'grated zest of 1 orange'],
      ],
      steps: [
        ['Backofen auf 180 °C vorheizen und ein Blech mit Backpapier auslegen. In einer Schüssel Mehl, Nüsse, Backpulver und die Gewürze vermengen.', 'In einer zweiten großen Schüssel Eier und Zucker so lange rühren, bis sich der Zucker aufgelöst hat; dann nach und nach das Öl einarbeiten.', 'Pastinaken schälen, Äpfel vom Kerngehäuse befreien, beides grob raspeln. Mit der Orangenschale unter die Eiermasse rühren.', 'Die trockenen Zutaten nur kurz unterheben, bis alles verbunden ist.', 'Teig auf dem Blech glatt streichen und 35–40 Min. backen. Wird die Oberfläche zu dunkel, mit Alufolie oder Backpapier abdecken.'],
        ['Preheat the oven to 180 °C and line a baking tray with baking paper. In a bowl, combine flour, nuts, baking powder and spices.', 'In a second large bowl, whisk eggs and sugar until the sugar has dissolved, then gradually work in the oil.', 'Peel the parsnips, core the apples and coarsely grate both. Stir into the egg mixture along with the orange zest.', 'Briefly fold in the dry ingredients until just combined.', 'Spread the batter evenly on the tray and bake for 35–40 min. Cover with foil or baking paper if the top browns too quickly.'],
      ],
      source: 'Rezeptausdruck',
    }),
  }),
  bake('bkCake', {
    id: 'schokokirschblechkuchen', o: 'Schokokirschblechkuchen', en: 'Chocolate cherry traybake', c: 'german', t: 'vegan sweet kids oven social', e: 2,
    i: 'cherries flour cocoa sugar oil',
    n: ['Ohne Ei und Milch – der Kirschsaft macht ihn saftig.', 'No eggs or dairy – the cherry juice keeps it moist.'],
    recipe: rc({
      serves: ['1 Blech', '1 baking tray'],
      time: ['ca. 45 Min.', 'about 45 min'],
      ing: [
        ['450 g Mehl', '70 g Kakao', '360 g Zucker', '1 Päckchen Backpulver', '2 Päckchen Vanillezucker', '1 Prise Salz', '500 ml Saft (aus den Kirschgläsern)', '170 g Öl (ca. 200 ml)', '2 Gläser Kirschen (je 350 g Abtropfgewicht)'],
        ['450 g flour', '70 g cocoa', '360 g sugar', '1 sachet baking powder', '2 sachets vanilla sugar', '1 pinch salt', '500 ml juice (from the cherry jars)', '170 g oil (about 200 ml)', '2 jars cherries (350 g drained weight each)'],
      ],
      steps: [
        ['Ofen auf 170 °C Umluft bzw. 180 °C Ober-/Unterhitze vorheizen, Blech mit Backpapier auslegen.', 'Kirschen abtropfen lassen und dabei den Saft auffangen (500 ml abmessen, ggf. mit Wasser auffüllen).', 'Mehl, Kakao, Zucker, Backpulver, Vanillezucker und Salz mischen. Kirschsaft und Öl dazugeben und zu einem glatten Teig verrühren.', 'Teig auf dem Blech verstreichen und die Kirschen gleichmäßig darauf verteilen.', 'Ca. 30 Min. backen und auf dem Blech auskühlen lassen.'],
        ['Preheat the oven to 170 °C fan or 180 °C conventional and line a tray with baking paper.', 'Drain the cherries, catching the juice (measure 500 ml, topping up with water if needed).', 'Mix flour, cocoa, sugar, baking powder, vanilla sugar and salt. Add cherry juice and oil and stir to a smooth batter.', 'Spread the batter on the tray and scatter the cherries evenly on top.', 'Bake for about 30 min and leave to cool on the tray.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'donauwelle', o: 'Donauwelle', en: 'Danube wave cake (cherry, custard and chocolate traybake)', c: 'german', t: 'veggie sweet kids oven social', e: 3,
    i: 'cherries flour egg sugar oil cocoa milk custard_powder butter dark_chocolate',
    recipe: rc({
      serves: ['1 Blech (39 × 26 × 4 cm)', '1 deep tray (39 × 26 × 4 cm)'],
      time: ['ca. 1 Std. 15 Min. + Kühlzeit', 'about 1 h 15 min + chilling'],
      ing: [
        ['Teig: 5 Eier', '200 g Zucker', '125 ml Sonnenblumenöl', '250 g Mehl', '2 TL Backpulver', '125 ml Wasser', '2 EL Milch', '2 EL Backkakao', '1 Glas Kirschen', 'Creme: 1 l Milch', '2 Päckchen Vanillepuddingpulver', '75 g Zucker', '200 g Butter (zimmerwarm)', 'Guss: 300 g Zartbitterkuvertüre', '1 EL Kokosöl'],
        ['Batter: 5 eggs', '200 g sugar', '125 ml sunflower oil', '250 g flour', '2 tsp baking powder', '125 ml water', '2 tbsp milk', '2 tbsp cocoa powder', '1 jar cherries', 'Cream: 1 l milk', '2 sachets vanilla custard powder', '75 g sugar', '200 g butter (room temperature)', 'Topping: 300 g dark couverture chocolate', '1 tbsp coconut oil'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Blech mit Backpapier auslegen. Kirschen gut abtropfen lassen. Eier trennen.', 'Eiweiß mit 50 g Zucker steif schlagen.', 'Eigelb mit 150 g Zucker und dem Öl schaumig schlagen. Mehl mit Backpulver mischen und abwechselnd mit dem Wasser unterrühren, dann den Eischnee unterheben.', 'Teig halbieren und unter eine Hälfte Kakao und Milch rühren.', 'Erst den hellen Teig auf dem Blech verstreichen, dann den dunklen darauf verteilen. Die Kirschen in den Teig drücken.', '25 Min. backen und vollständig auskühlen lassen.', 'Pudding mit Milch, Puddingpulver und Zucker nach Packungsanleitung kochen und abkühlen lassen (Frischhaltefolie direkt auflegen, damit sich keine Haut bildet). Butter hell und cremig aufschlagen und den Pudding löffelweise unterrühren – beides sollte Zimmertemperatur haben.', 'Creme auf den Boden streichen und kalt stellen.', 'Kuvertüre mit dem Kokosöl schmelzen, auf der Creme verteilen und mit einer Gabel oder Teigkarte Wellen ziehen. Kühl stellen, bis der Guss fest ist.'],
        ['Preheat the oven to 180 °C conventional and line the tray with baking paper. Drain the cherries well. Separate the eggs.', 'Whisk the egg whites with 50 g sugar until stiff.', 'Beat the yolks with 150 g sugar and the oil until pale. Mix flour and baking powder and stir in alternately with the water, then fold in the egg whites.', 'Divide the batter in half and stir cocoa and milk into one half.', 'Spread the light batter on the tray first, then spread the dark batter on top. Press the cherries into the batter.', 'Bake for 25 min and let cool completely.', 'Cook the custard with milk, custard powder and sugar according to the packet and let cool (cover the surface with cling film to stop a skin forming). Beat the butter until pale and creamy, then beat in the custard a spoonful at a time – both should be at room temperature.', 'Spread the cream over the base and chill.', 'Melt the couverture with the coconut oil, spread over the cream and draw waves with a fork or scraper. Chill until set.'],
      ],
      tip: ['Für kleinere Bleche (z. B. 18 × 28 cm plus 19 × 12 cm) die Menge auf beide Formen aufteilen.', 'For smaller tins (e.g. 18 × 28 cm plus 19 × 12 cm) divide the mixture between both.'],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'erdbeerkuchen', o: 'Erdbeerkuchen', en: 'Strawberry cake with custard', c: 'german', t: 'veggie sweet kids oven summer', e: 2,
    i: 'strawberries flour egg sugar butter milk custard_powder',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. + 1 Std. Kühlzeit', 'about 1 h + 1 h chilling'],
      ing: [
        ['Boden: 3 Eier', '125 g Zucker', '½ Päckchen Vanillezucker', '125 g Mehl', '1 TL Backpulver', '125 g flüssige Butter', 'Pudding: 500 ml Milch', '2 EL Zucker', '1 Päckchen Vanillepuddingpulver', 'Belag: 500 g Erdbeeren', '1 Päckchen Tortenguss', '2 EL Zucker', '250 ml Wasser'],
        ['Base: 3 eggs', '125 g sugar', '½ sachet vanilla sugar', '125 g flour', '1 tsp baking powder', '125 g melted butter', 'Custard: 500 ml milk', '2 tbsp sugar', '1 sachet vanilla custard powder', 'Topping: 500 g strawberries', '1 sachet cake glaze', '2 tbsp sugar', '250 ml water'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Springform fetten.', 'Eier, Zucker und Vanillezucker schaumig schlagen. Mehl, Backpulver und die flüssige Butter unterrühren. Teig in die Form füllen und 25 Min. backen, dann abkühlen lassen.', 'Boden auf eine Tortenplatte setzen und einen Tortenring darumlegen.', 'Ein Drittel der Milch mit Zucker und Puddingpulver glatt rühren. Restliche Milch aufkochen, die Mischung einrühren und unter Rühren 2 Min. sprudelnd kochen lassen. Auf den Boden streichen und auskühlen lassen.', 'Erdbeeren waschen, putzen, halbieren und dicht auf den Pudding legen.', 'Tortenguss mit Zucker und Wasser nach Packungsanleitung kochen und über die Erdbeeren geben. Ca. 1 Std. kühl stellen, dann den Ring lösen.'],
        ['Preheat the oven to 180 °C conventional and grease the springform.', 'Beat eggs, sugar and vanilla sugar until fluffy. Stir in flour, baking powder and melted butter. Pour into the tin, bake for 25 min and let cool.', 'Place the base on a cake plate and put a cake ring around it.', 'Stir a third of the milk with the sugar and custard powder until smooth. Bring the rest of the milk to the boil, stir in the mixture and let it bubble for 2 min, stirring. Spread over the base and let cool.', 'Wash, hull and halve the strawberries and arrange them closely on the custard.', 'Cook the cake glaze with sugar and water according to the packet and pour over the strawberries. Chill for about 1 h, then remove the ring.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'schoko-haselnuss-kuchen', o: 'Schoko-Haselnuss-Kuchen', en: 'Chocolate hazelnut loaf cake', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'hazelnuts dark_chocolate flour butter egg sugar milk vanilla',
    recipe: rc({
      serves: ['1 Kastenform', '1 loaf tin'],
      time: ['ca. 1 Std. 20 Min.', 'about 1 h 20 min'],
      ing: [
        ['4 Eier', '250 g Butter (weich)', '150 g Zucker', 'Vanille (Mark oder 1 Päckchen Vanillezucker)', '150 g Schokolade', '200 ml Milch (lauwarm)', '250 g gemahlene Haselnüsse', '250 g Mehl', '1 Päckchen Backpulver'],
        ['4 eggs', '250 g butter (soft)', '150 g sugar', 'vanilla (seeds or 1 sachet vanilla sugar)', '150 g chocolate', '200 ml milk (lukewarm)', '250 g ground hazelnuts', '250 g flour', '1 sachet baking powder'],
      ],
      steps: [
        ['Ofen auf 180 °C vorheizen, Kastenform fetten oder mit Backpapier auslegen. Schokolade fein hacken oder schmelzen.', 'Butter, Zucker und Vanille schaumig schlagen, die Eier einzeln unterrühren.', 'Schokolade und lauwarme Milch langsam unterrühren.', 'Haselnüsse, Mehl und Backpulver mischen und unterheben.', 'Teig in die Form füllen und ca. 60 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 180 °C and grease or line a loaf tin. Finely chop or melt the chocolate.', 'Beat butter, sugar and vanilla until fluffy, then beat in the eggs one at a time.', 'Slowly stir in the chocolate and the lukewarm milk.', 'Mix hazelnuts, flour and baking powder and fold in.', 'Pour into the tin and bake for about 60 min (skewer test).'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'schoko-kirsch-kuchen', o: 'Schoko-Kirsch-Kuchen', en: 'Chocolate cherry cake with almonds', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'cherries almonds dark_chocolate butter egg sugar breadcrumbs',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. 10 Min.', 'about 1 h 10 min'],
      ing: [
        ['140 g Margarine', '140 g Zucker', '4 Eier', '80 g Schokolade, gerieben', '150 g gemahlene Mandeln', '50 g Semmelbrösel', '1 Glas Kirschen, abgetropft'],
        ['140 g margarine', '140 g sugar', '4 eggs', '80 g chocolate, grated', '150 g ground almonds', '50 g breadcrumbs', '1 jar cherries, drained'],
      ],
      steps: [
        ['Ofen auf 150 °C Umluft vorheizen, Springform fetten. Kirschen gut abtropfen lassen. Eier trennen.', 'Margarine und Zucker schaumig rühren, die Eigelbe unterrühren.', 'Eiweiß steif schlagen.', 'Schokolade, Mandeln und Semmelbrösel unter die Buttermasse rühren, dann den Eischnee vorsichtig unterheben.', 'Teig in die Form füllen und glatt streichen. Kirschen darauf verteilen und leicht eindrücken.', '45 Min. backen und in der Form abkühlen lassen.'],
        ['Preheat the oven to 150 °C fan and grease the springform. Drain the cherries well. Separate the eggs.', 'Beat margarine and sugar until fluffy, then beat in the yolks.', 'Whisk the egg whites until stiff.', 'Stir chocolate, almonds and breadcrumbs into the butter mixture, then gently fold in the egg whites.', 'Spread the batter in the tin, scatter the cherries over and press them in lightly.', 'Bake for 45 min and let cool in the tin.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'bananenkuchen', o: 'Bananenkuchen', en: 'Banana marble cake', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'bananas flour apple_sauce milk butter cocoa cinnamon',
    n: ['Ohne zugesetzten Zucker – nur Bananen und Apfelmus.', 'No added sugar – sweetened just with bananas and apple sauce.'],
    recipe: rc({
      serves: ['1 kleine Springform (Ø 20 cm)', '1 small springform (20 cm)'],
      time: ['ca. 50 Min.', 'about 50 min'],
      ing: [
        ['3 sehr reife Bananen (ca. 400 g)', '150 g Apfelmus', '100 ml Milch + 1 TL für den Kakaoteig', '1 Prise Vanille', '30 g Butter (weich)', '200 g Dinkelmehl', '2 TL Backpulver', '1 TL Zimt', '1 Prise Salz', '1 EL Kakao', 'Optionales Frosting: 200 g Frischkäse, ca. 2 EL Apfelmus'],
        ['3 very ripe bananas (about 400 g)', '150 g apple sauce', '100 ml milk + 1 tsp for the cocoa batter', '1 pinch vanilla', '30 g butter (soft)', '200 g spelt flour', '2 tsp baking powder', '1 tsp cinnamon', '1 pinch salt', '1 tbsp cocoa', 'Optional frosting: 200 g cream cheese, about 2 tbsp apple sauce'],
      ],
      steps: [
        ['Ofen auf 175 °C Ober-/Unterhitze vorheizen. Springform fetten und mit Mehl ausstäuben.', 'Bananen mit dem Stabmixer pürieren.', 'Apfelmus, Milch, Vanille und Butter dazugeben und verrühren, bis nur noch kleine Butterstückchen übrig sind.', 'Mehl, Backpulver, Zimt und Salz mischen und nach und nach unterrühren.', 'Die Hälfte des Teigs abnehmen und mit Kakao und 1 TL Milch verrühren.', 'Abwechselnd ein paar Esslöffel hellen und dunklen Teig in die Form geben und 35 Min. backen.', 'Wer mag: Frischkäse mit Apfelmus glatt rühren und auf den abgekühlten Kuchen streichen.'],
        ['Preheat the oven to 175 °C conventional. Grease the springform and dust with flour.', 'Purée the bananas with a stick blender.', 'Add apple sauce, milk, vanilla and butter and stir until only small bits of butter remain.', 'Mix flour, baking powder, cinnamon and salt and stir in gradually.', 'Take off half the batter and stir in the cocoa and 1 tsp milk.', 'Spoon a few tablespoons of light and dark batter alternately into the tin and bake for 35 min.', 'Optional: stir cream cheese with apple sauce until smooth and spread over the cooled cake.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'mohnkuchen-schmand-pudding', g: 'mohnkuchen', o: 'Mohnkuchen mit Schmand & Vanillepudding', en: 'Poppy seed cake with soured cream and custard', c: 'german', t: 'veggie sweet oven', e: 3,
    i: 'poppy_seeds sour_cream custard_powder milk sugar egg flour butter',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. 45 Min.', 'about 1 h 45 min'],
      ing: [
        ['Boden: 60 g Butter', '60 g Mehl', '1 TL Backpulver', '1 Prise Salz', '1 Ei', 'Füllung: 1 Päckchen Vanillepuddingpulver', '500 ml Milch', '100 g Zucker', '200 g Mohnback (backfertige Mohnfüllung)', '1 Becher Schmand (200 g)', 'Belag: 100 g Zucker', '3 Eier', '2 Becher Schmand (400 g)', '1 Päckchen Vanillezucker'],
        ['Base: 60 g butter', '60 g flour', '1 tsp baking powder', '1 pinch salt', '1 egg', 'Filling: 1 sachet vanilla custard powder', '500 ml milk', '100 g sugar', '200 g ready-to-bake poppy seed filling', '1 tub soured cream / Schmand (200 g)', 'Topping: 100 g sugar', '3 eggs', '2 tubs soured cream / Schmand (400 g)', '1 sachet vanilla sugar'],
      ],
      steps: [
        ['Butter, Mehl, Backpulver, Salz und Ei zu einem Teig verkneten, in die gefettete Springform drücken und kühl stellen.', 'Ofen auf 175 °C vorheizen.', 'Pudding aus Puddingpulver, Milch und 100 g Zucker nach Packungsanleitung kochen. Mohn unterrühren, etwas abkühlen lassen und dann 1 Becher Schmand unterrühren. Auf den Boden streichen.', 'Für den Belag Zucker, Eier, 2 Becher Schmand und Vanillezucker verrühren und vorsichtig auf der Mohnfüllung verteilen.', 'Ca. 1 Std. backen. Im Ofen bei geöffneter Tür etwas abkühlen lassen, dann ganz auskühlen lassen und erst danach aus der Form lösen.'],
        ['Knead butter, flour, baking powder, salt and egg into a dough, press into the greased springform and chill.', 'Preheat the oven to 175 °C.', 'Cook the custard powder with milk and 100 g sugar according to the packet. Stir in the poppy seed filling, let cool a little, then stir in 1 tub of soured cream. Spread over the base.', 'For the topping, whisk sugar, eggs, 2 tubs of soured cream and vanilla sugar and pour gently over the poppy seed layer.', 'Bake for about 1 h. Let it cool a little in the oven with the door open, then cool completely before removing from the tin.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'mohnkuchen-streusel', g: 'mohnkuchen', o: 'Mohnkuchen mit Streusel', en: 'Poppy seed crumble cake', c: 'german', t: 'veggie sweet oven', e: 3,
    i: 'poppy_seeds quark sour_cream flour butter sugar egg custard_powder cinnamon',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. 30 Min.', 'about 1 h 30 min'],
      ing: [
        ['Mürbeteig: 150 g Mehl', '75 g Butter', '70 g Zucker', '1 Päckchen Vanillinzucker', '1 TL Backpulver', '1 Ei', 'Streusel: 100 g Zucker', '100 g Butter', '150 g Mehl', '1 Prise Zimt', 'Füllung: 250 g Magerquark', '200 g Schmand', '2 Eier', '2 Päckchen Vanillinzucker', '100 g Zucker', '1 Päckchen Vanillepuddingpulver', '2 Päckchen backfertige Mohnfüllung (à 250 g)', 'Puderzucker zum Bestäuben'],
        ['Shortcrust: 150 g flour', '75 g butter', '70 g sugar', '1 sachet vanilla sugar', '1 tsp baking powder', '1 egg', 'Crumble: 100 g sugar', '100 g butter', '150 g flour', '1 pinch cinnamon', 'Filling: 250 g low-fat quark', '200 g soured cream (Schmand)', '2 eggs', '2 sachets vanilla sugar', '100 g sugar', '1 sachet vanilla custard powder', '2 packs ready-to-bake poppy seed filling (250 g each)', 'icing sugar for dusting'],
      ],
      steps: [
        ['Die Zutaten für den Mürbeteig rasch zu einem glatten Teig verkneten, in Folie wickeln und 30 Min. kalt stellen.', 'Für die Streusel Zucker, Butter, Mehl und Zimt mit den Fingern zu groben Krümeln reiben und ebenfalls kühlen.', 'Ofen auf 180 °C Ober-/Unterhitze (160 °C Umluft) vorheizen. Springform fetten, den Teig hineindrücken und einen ca. 3 cm hohen Rand formen.', 'Quark, Schmand, Eier, Vanillinzucker und Zucker glatt rühren, dann Puddingpulver und Mohnfüllung untermischen. Masse auf den Teig geben.', 'Ca. 25 Min. backen, bis die Oberfläche leicht fest geworden ist. Dann die Streusel darüberstreuen und weitere ca. 20 Min. backen.', 'Vollständig abkühlen lassen, mit Puderzucker bestäuben und gekühlt servieren.'],
        ['Quickly knead the shortcrust ingredients into a smooth dough, wrap and chill for 30 min.', 'For the crumble, rub sugar, butter, flour and cinnamon between your fingers into coarse crumbs and chill as well.', 'Preheat the oven to 180 °C conventional (160 °C fan). Grease the springform, press in the dough and form a rim about 3 cm high.', 'Stir quark, soured cream, eggs, vanilla sugar and sugar until smooth, then mix in the custard powder and poppy seed filling. Pour onto the pastry.', 'Bake for about 25 min until the surface has just set. Scatter the crumble over and bake for about 20 min more.', 'Let cool completely, dust with icing sugar and serve chilled.'],
      ],
      source: 'einfach backen',
    }),
  }),
  bake('bkCake', {
    id: 'mohnkuchen-birne', g: 'mohnkuchen', o: 'Mohnkuchen mit Birne', en: 'Poppy seed cake with pears', c: 'german', t: 'veggie sweet oven', e: 2,
    i: 'poppy_seeds pears flour butter egg sugar milk',
  }),
  bake('bkCake', {
    id: 'bananen-walnuss-kuchen', o: 'Bananen-Walnuss-Kuchen', en: 'Banana walnut loaf cake', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'bananas walnuts flour butter egg sugar cornstarch milk',
    recipe: rc({
      serves: ['1 Kastenform (30 × 10 cm)', '1 loaf tin (30 × 10 cm)'],
      time: ['ca. 1 Std. 20 Min.', 'about 1 h 20 min'],
      ing: [
        ['200 g Banane (geschält)', '250 g Butter (weich)', '200 g Zucker', '1 Prise Salz', '4 Eier', '350 g Mehl', '50 g Speisestärke', '1 Päckchen Backpulver', '100 g gemahlene Walnüsse', '100 g gehackte Walnüsse (50 g für den Teig, 50 g zum Bestreuen)', '50 ml Milch'],
        ['200 g banana (peeled)', '250 g butter (soft)', '200 g sugar', '1 pinch salt', '4 eggs', '350 g flour', '50 g cornflour', '1 sachet baking powder', '100 g ground walnuts', '100 g chopped walnuts (50 g for the batter, 50 g for sprinkling)', '50 ml milk'],
      ],
      steps: [
        ['Ofen auf 180 °C Umluft vorheizen, Kastenform mit Backpapier auslegen.', 'Banane pürieren.', 'Butter, Zucker und Salz schaumig schlagen.', 'Eier einzeln unterrühren, dann das Bananenpüree dazugeben.', 'Mehl, Stärke und Backpulver mischen und sieben.', 'Mehlmischung, gemahlene Walnüsse, 50 g gehackte Walnüsse und die Milch zum Teig geben und alles verrühren.', 'Teig in die Form füllen, mit den restlichen 50 g gehackten Walnüssen bestreuen und ca. 60 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 180 °C fan and line the loaf tin with baking paper.', 'Purée the banana.', 'Beat butter, sugar and salt until fluffy.', 'Beat in the eggs one at a time, then add the banana purée.', 'Mix and sift flour, cornflour and baking powder.', 'Add the flour mixture, ground walnuts, 50 g chopped walnuts and the milk and stir everything together.', 'Pour into the tin, sprinkle with the remaining 50 g chopped walnuts and bake for about 60 min (skewer test).'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'bananen-schoko-walnuss-kuchen', o: 'Bananen-Schoko-Walnuss-Kuchen', en: 'Banana chocolate walnut loaf cake', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'bananas walnuts dark_chocolate flour egg sugar oil milk cinnamon',
    recipe: rc({
      serves: ['1 Kastenform (26 cm)', '1 loaf tin (26 cm)'],
      time: ['ca. 1 Std. 20 Min.', 'about 1 h 20 min'],
      ing: [
        ['150 g Walnusskerne', '75 g Zartbitterschokolade', '2 Eier', '100 g Zucker', '1 Päckchen Vanillezucker', '75 ml Öl', '250 g Mehl', '½ Päckchen Backpulver', '1 Prise Salz', '2 Msp. Zimt', '3 reife Bananen', '150 ml Milch'],
        ['150 g walnut halves', '75 g dark chocolate', '2 eggs', '100 g sugar', '1 sachet vanilla sugar', '75 ml oil', '250 g flour', '½ sachet baking powder', '1 pinch salt', '2 pinches cinnamon', '3 ripe bananas', '150 ml milk'],
      ],
      steps: [
        ['Ofen auf 175 °C vorheizen, Kastenform fetten oder mit Backpapier auslegen.', 'Walnüsse und Schokolade grob hacken.', 'Eier, Zucker und Vanillezucker schaumig schlagen, dann das Öl einrühren.', 'Mehl, Backpulver, Salz und Zimt mischen.', 'Bananen zerdrücken und mit der Milch verrühren.', 'Mehlmischung und Bananenmilch abwechselnd in mehreren Portionen unter die Eiermasse rühren.', 'Zum Schluss Nüsse und Schokolade unterheben, Teig in die Form füllen und ca. 60 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 175 °C and grease or line the loaf tin.', 'Roughly chop the walnuts and chocolate.', 'Beat eggs, sugar and vanilla sugar until fluffy, then stir in the oil.', 'Mix flour, baking powder, salt and cinnamon.', 'Mash the bananas and stir in the milk.', 'Stir the flour mixture and the banana milk alternately into the egg mixture in several batches.', 'Finally fold in the nuts and chocolate, pour into the tin and bake for about 60 min (skewer test).'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'butterkuchen', o: 'Butterkuchen', en: 'Butter cake with almond topping', c: 'german', t: 'veggie sweet kids oven social', e: 1,
    i: 'flour butter sugar egg cream almonds milk',
    n: ['Schnelle Variante ohne Hefe.', 'Quick version without yeast.'],
    recipe: rc({
      serves: ['1 Blech', '1 baking tray'],
      time: ['ca. 30 Min.', 'about 30 min'],
      ing: [
        ['Teig: 300 g Mehl', '150 g Zucker', '½–1 Päckchen Backpulver', '1 Päckchen Vanillezucker', '3 Eier', '200 ml Sahne', 'Belag: 125 g Butter', '125 g Zucker', '100 g Mandelblättchen', '3 EL Milch'],
        ['Batter: 300 g flour', '150 g sugar', '½–1 sachet baking powder', '1 sachet vanilla sugar', '3 eggs', '200 ml cream', 'Topping: 125 g butter', '125 g sugar', '100 g flaked almonds', '3 tbsp milk'],
      ],
      steps: [
        ['Ofen auf 200 °C Ober-/Unterhitze vorheizen, Blech fetten.', 'Mehl, Zucker, Backpulver, Vanillezucker, Eier und Sahne zu einem glatten Teig verrühren und auf dem Blech verstreichen. 10 Min. backen.', 'Inzwischen die Butter schmelzen, Zucker, Mandelblättchen und Milch dazugeben und rühren, bis sich der Zucker gelöst hat.', 'Die Mandelmasse auf dem vorgebackenen Kuchen verteilen und weitere 10 Min. goldbraun backen.'],
        ['Preheat the oven to 200 °C conventional and grease the tray.', 'Stir flour, sugar, baking powder, vanilla sugar, eggs and cream into a smooth batter and spread on the tray. Bake for 10 min.', 'Meanwhile melt the butter, add sugar, flaked almonds and milk and stir until the sugar has dissolved.', 'Spread the almond mixture over the part-baked cake and bake for another 10 min until golden.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'rhabarberkuchen', o: 'Rhabarberkuchen', en: 'Rhubarb cake', c: 'german', t: 'veggie sweet oven summer', e: 2,
    i: 'rhubarb flour butter egg sugar hazelnuts milk',
    recipe: rc({
      serves: ['1 Springform (Ø 24 cm)', '1 springform (24 cm)'],
      time: ['ca. 50 Min.', 'about 50 min'],
      ing: [
        ['100 g Butter (weich)', '70 g Zucker + etwas zum Bestreuen', '2 Eier', '190 g Dinkel-Vollkornmehl', '1 TL Backpulver', '30 g gemahlene Haselnüsse oder Mandeln', '90 ml Milch', '4–5 Stangen Rhabarber'],
        ['100 g butter (soft)', '70 g sugar + a little for sprinkling', '2 eggs', '190 g wholemeal spelt flour', '1 tsp baking powder', '30 g ground hazelnuts or almonds', '90 ml milk', '4–5 stalks rhubarb'],
      ],
      steps: [
        ['Ofen auf 160 °C vorheizen, Springform fetten. Rhabarber waschen, putzen und in Stücke schneiden (passend zum gewünschten Muster).', 'Butter und Zucker cremig rühren, dann die Eier unterrühren.', 'Mehl, Backpulver und Nüsse mischen und dazugeben.', 'Die Milch langsam unterrühren.', 'Teig in die Form streichen und die Rhabarberstücke als Muster darauflegen. Mit etwas Zucker bestreuen.', 'Ca. 30 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 160 °C and grease the springform. Wash and trim the rhubarb and cut into pieces (to suit the pattern you want).', 'Cream butter and sugar, then beat in the eggs.', 'Mix flour, baking powder and nuts and add.', 'Slowly stir in the milk.', 'Spread the batter in the tin and lay the rhubarb on top in a pattern. Sprinkle with a little sugar.', 'Bake for about 30 min (skewer test).'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'schoko-ruehrkuchen-schmand', o: 'Schoko-Rührkuchen mit Schmand', en: 'Chocolate pound cake with soured cream', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'flour butter cocoa sugar egg sour_cream dark_chocolate custard_powder milk',
    recipe: rc({
      serves: ['1 Springform (Ø 20 cm)', '1 springform (20 cm)'],
      time: ['ca. 1 Std. 5 Min.', 'about 1 h 5 min'],
      ing: [
        ['250 g weiche Butter', 'ca. 6 EL Backkakao', '200 g Zucker', '1 Päckchen Vanillepuddingpulver', '3 Eier', '100 g Schmand', '200 g Mehl', '1 Prise Salz', '3 TL Backpulver', '4 EL Milch', '100 g Zartbitter-Schokostreusel'],
        ['250 g soft butter', 'about 6 tbsp cocoa powder', '200 g sugar', '1 sachet vanilla custard powder', '3 eggs', '100 g soured cream (Schmand)', '200 g flour', '1 pinch salt', '3 tsp baking powder', '4 tbsp milk', '100 g dark chocolate sprinkles'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Springform fetten.', 'Butter mit Kakao, Zucker und Puddingpulver cremig schlagen.', 'Eier nacheinander unterrühren, dann den Schmand.', 'Mehl, Salz und Backpulver mischen und mit der Milch unterrühren. Zum Schluss die Schokostreusel unterheben.', 'Teig in die Form füllen und ca. 45 Min. backen.'],
        ['Preheat the oven to 180 °C conventional and grease the springform.', 'Beat butter with cocoa, sugar and custard powder until creamy.', 'Beat in the eggs one at a time, then the soured cream.', 'Mix flour, salt and baking powder and stir in with the milk. Finally fold in the chocolate sprinkles.', 'Pour into the tin and bake for about 45 min.'],
      ],
      tip: ['Der Teig steht in der kleinen Form recht hoch – gegen Ende Stäbchenprobe machen und bei Bedarf ein paar Minuten länger backen.', 'The batter sits quite high in the small tin – do a skewer test towards the end and bake a few minutes longer if needed.'],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'bananenbrot', g: 'bananenbrot', o: 'Bananenbrot', en: 'Banana bread', c: 'american', t: 'veggie sweet kids oven', e: 2,
    i: 'bananas flour butter sugar egg sour_cream vanilla',
    recipe: rc({
      serves: ['1 große Kastenform', '1 large loaf tin'],
      time: ['ca. 1 Std. 15 Min.', 'about 1 h 15 min'],
      ing: [
        ['3 reife Bananen (ca. 300 g ohne Schale)', '120 g weiche Butter', '110 g brauner Zucker', '2 Eier (M)', '250 g Mehl', '1 TL Backpulver', '¼ TL Salz', '¼ TL gemahlene Vanille', '100 g Schmand oder griechischer Joghurt', 'nach Belieben etwas Zimt'],
        ['3 ripe bananas (about 300 g peeled)', '120 g soft butter', '110 g brown sugar', '2 eggs (M)', '250 g flour', '1 tsp baking powder', '¼ tsp salt', '¼ tsp ground vanilla', '100 g soured cream or Greek yoghurt', 'a little cinnamon, if you like'],
      ],
      steps: [
        ['Ofen auf 175 °C Ober-/Unterhitze vorheizen, Kastenform fetten oder mit Backpapier auslegen.', 'Bananen pürieren oder fein zerdrücken.', 'Butter und braunen Zucker schaumig schlagen.', 'Eier nacheinander unterrühren.', 'Mehl, Backpulver, Salz und Vanille (und ggf. Zimt) mischen und abwechselnd mit Bananenpüree und Schmand unterrühren.', 'Teig in die Form füllen und 55–60 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 175 °C conventional and grease or line the loaf tin.', 'Purée or finely mash the bananas.', 'Beat butter and brown sugar until fluffy.', 'Beat in the eggs one at a time.', 'Mix flour, baking powder, salt and vanilla (and cinnamon, if using) and stir in alternately with the banana and soured cream.', 'Pour into the tin and bake for 55–60 min (skewer test).'],
      ],
      tip: ['Kleine Kastenform: 2 Bananen (200 g), 80 g Butter, 75 g brauner Zucker, 1–2 Eier, 165 g Mehl, ⅔ TL Backpulver, knapp ¼ TL Salz, knapp ¼ TL Vanille, 66 g Schmand. Variante: 3 Bananen, 200 g Mehl, Zimt, 100 g Apfelmus, 1 Päckchen Backpulver, 2 Eier und 50 g gehackte Walnüsse – 45 Min. bei 180 °C.', 'Small loaf tin: 2 bananas (200 g), 80 g butter, 75 g brown sugar, 1–2 eggs, 165 g flour, ⅔ tsp baking powder, just under ¼ tsp salt, just under ¼ tsp vanilla, 66 g soured cream. Variation: 3 bananas, 200 g flour, cinnamon, 100 g apple sauce, 1 sachet baking powder, 2 eggs and 50 g chopped walnuts – 45 min at 180 °C.'],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'bananenbrot-rosinen', g: 'bananenbrot', o: 'Bananenbrot mit Rosinen', en: 'Banana bread with raisins', c: 'american', t: 'veggie sweet kids oven', e: 1,
    i: 'bananas flour raisins sugar egg oil',
    recipe: rc({
      serves: ['1 Kastenform', '1 loaf tin'],
      time: ['ca. 1 Std.', 'about 1 h'],
      ing: [
        ['3 Bananen', '300 g Mehl', '100 g Zucker', '1 Ei', '½ TL Salz', '1 Päckchen Backpulver', '1 Päckchen Vanillezucker', '4 EL Öl', '4 EL Rosinen'],
        ['3 bananas', '300 g flour', '100 g sugar', '1 egg', '½ tsp salt', '1 sachet baking powder', '1 sachet vanilla sugar', '4 tbsp oil', '4 tbsp raisins'],
      ],
      steps: [
        ['Ofen auf 180 °C vorheizen, Kastenform fetten oder mit Backpapier auslegen.', 'Bananen mit einer Gabel zerdrücken und mit Ei, Zucker, Vanillezucker und Öl verrühren.', 'Mehl, Backpulver und Salz mischen und kurz unterrühren, dann die Rosinen unterheben.', 'Teig in die Form füllen und ca. 45 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 180 °C and grease or line the loaf tin.', 'Mash the bananas with a fork and stir in egg, sugar, vanilla sugar and oil.', 'Mix flour, baking powder and salt and stir in briefly, then fold in the raisins.', 'Pour into the tin and bake for about 45 min (skewer test).'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'regenbogenkuchen', o: 'Regenbogenkuchen', de: 'Regenbogenkuchen (bunter Zebrakuchen)', en: 'Rainbow cake (colourful zebra cake)', c: 'german', t: 'veggie sweet kids oven social', e: 2,
    i: 'flour egg oil sugar milk food_colouring',
    recipe: rc({
      serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
      time: ['ca. 1 Std. 10 Min.', 'about 1 h 10 min'],
      ing: [
        ['4 Eier', '250 ml Öl', '250 g Zucker', '1 Päckchen Vanillezucker', '350 g Mehl', '1 Päckchen Backpulver', '125 ml Milch', 'Lebensmittelfarbe in mehreren Farben'],
        ['4 eggs', '250 ml oil', '250 g sugar', '1 sachet vanilla sugar', '350 g flour', '1 sachet baking powder', '125 ml milk', 'food colouring in several colours'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Springform fetten oder den Boden mit Backpapier auslegen.', 'Eier, Öl, Zucker und Vanillezucker schaumig rühren.', 'Mehl und Backpulver mischen und unterrühren.', 'Zum Schluss die Milch einrühren.', 'Teig auf mehrere Schüsseln verteilen und jede Portion mit einer anderen Lebensmittelfarbe einfärben.', 'Abwechselnd je 2 EL jeder Farbe genau in die Mitte der Form geben – der Teig läuft von selbst auseinander, und es entstehen bunte Ringe.', '40–45 Min. backen (Stäbchenprobe).'],
        ['Preheat the oven to 180 °C conventional and grease the springform or line the base with baking paper.', 'Whisk eggs, oil, sugar and vanilla sugar until frothy.', 'Mix flour and baking powder and stir in.', 'Finally stir in the milk.', 'Divide the batter between several bowls and colour each portion with a different food colouring.', 'Spoon 2 tbsp of each colour in turn right into the centre of the tin – the batter spreads out by itself and forms colourful rings.', 'Bake for 40–45 min (skewer test).'],
      ],
      tip: ['Für eine Mini-Springform (Ø 13 cm) ein Viertel der Menge nehmen: 1 Ei, 62,5 ml Öl, 62,5 g Zucker, ¼ Päckchen Vanillezucker, 87,5 g Mehl, ¼ Päckchen Backpulver, 31 ml Milch.', 'For a mini springform (13 cm) use a quarter of the amounts: 1 egg, 62.5 ml oil, 62.5 g sugar, ¼ sachet vanilla sugar, 87.5 g flour, ¼ sachet baking powder, 31 ml milk.'],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'saftiger-schokokuchen', o: 'Saftiger Schokokuchen mit Kuvertüre', en: 'Moist chocolate cake with couverture', c: 'german', t: 'veggie sweet kids oven', e: 2,
    i: 'dark_chocolate flour cocoa butter egg sugar milk',
    recipe: rc({
      serves: ['1 Kastenform', '1 loaf tin'],
      time: ['ca. 1 Std. 40 Min.', 'about 1 h 40 min'],
      ing: [
        ['200 g Zartbitterkuvertüre (100 g zum Schmelzen, 100 g gehackt)', '225 g Mehl', '1 Päckchen Backpulver', '40 g Kakao', '125 g Zucker', '1 Prise Salz', '1 Päckchen Vanillezucker', '200 g Butter oder Margarine (weich)', '4 Eier', '50 ml Milch', 'Guss: 100 g Schokolade', '1 EL Öl'],
        ['200 g dark couverture chocolate (100 g for melting, 100 g chopped)', '225 g flour', '1 sachet baking powder', '40 g cocoa', '125 g sugar', '1 pinch salt', '1 sachet vanilla sugar', '200 g butter or margarine (soft)', '4 eggs', '50 ml milk', 'Glaze: 100 g chocolate', '1 tbsp oil'],
      ],
      steps: [
        ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, Kastenform fetten oder mit Backpapier auslegen. 100 g Kuvertüre schmelzen und etwas abkühlen lassen, die anderen 100 g grob hacken.', 'Butter mit Zucker, Vanillezucker und Salz schaumig schlagen, die Eier einzeln unterrühren. Die geschmolzene Kuvertüre einrühren.', 'Mehl, Backpulver und Kakao mischen und abwechselnd mit der Milch unterrühren. Gehackte Kuvertüre unterheben.', 'Teig in die Form füllen und ca. 15 Min. backen. Dann die Oberfläche der Länge nach ca. 1 cm tief einschneiden und weitere ca. 60 Min. backen (Stäbchenprobe).', 'Kuchen 10 Min. in der Form abkühlen lassen, dann herauslösen.', 'Schokolade mit dem Öl schmelzen und über den Kuchen geben.'],
        ['Preheat the oven to 180 °C conventional and grease or line the loaf tin. Melt 100 g couverture and let it cool slightly; roughly chop the other 100 g.', 'Beat butter with sugar, vanilla sugar and salt until fluffy, then beat in the eggs one at a time. Stir in the melted couverture.', 'Mix flour, baking powder and cocoa and stir in alternately with the milk. Fold in the chopped couverture.', 'Pour into the tin and bake for about 15 min. Then cut a slit about 1 cm deep along the top and bake for about 60 min more (skewer test).', 'Let the cake cool in the tin for 10 min, then turn it out.', 'Melt the chocolate with the oil and pour over the cake.'],
      ],
      family: true,
    }),
  }),
  bake('bkCake', {
    id: 'linzertorte', o: 'Linzertorte', en: 'Linzer torte', c: 'austrian', t: 'veggie sweet oven winter', e: 2,
    i: 'flour butter hazelnuts almonds sugar egg jam cinnamon cloves',
  }),
  bake('bkCake', {
    id: 'himbeer-schmand-kuchen', o: 'Himbeer-Schmand-Kuchen', en: 'Raspberry and soured cream cake', c: 'german', t: 'veggie sweet oven summer', e: 2,
    i: 'raspberries sour_cream flour butter sugar egg custard_powder',
  }),
  bake('bkCake', {
    id: 'apfelstrudel', o: 'Apfelstrudel', en: 'Apple strudel', c: 'austrian', t: 'veggie sweet kids oven', e: 3,
    i: 'apples strudel_dough raisins butter sugar cinnamon breadcrumbs',
  }),
]

/** Recipes for dishes that already exist elsewhere (attached by id). */
export const CAKE_RECIPES: Record<string, Recipe> = {
  kaesekuchen: rc({
    serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
    time: ['ca. 1 Std. 30 Min. + Auskühlen', 'about 1 h 30 min + cooling'],
    ing: [
      ['Teig: 330 g Mehl', '130 g Zucker', '130 g Butter oder Margarine', '2 Eier (M)', '2 Päckchen Vanillezucker', '1 Päckchen Backpulver', 'Füllung: 1 kg Magerquark', '300 g Zucker', '2 Päckchen Vanillepuddingpulver', '100 ml Sonnenblumenöl', '600 ml Milch', '4 Eier', 'nach Belieben abgeriebene Zitronenschale oder Rumaroma'],
      ['Pastry: 330 g flour', '130 g sugar', '130 g butter or margarine', '2 eggs (M)', '2 sachets vanilla sugar', '1 sachet baking powder', 'Filling: 1 kg low-fat quark', '300 g sugar', '2 sachets vanilla custard powder', '100 ml sunflower oil', '600 ml milk', '4 eggs', 'grated lemon zest or rum flavouring, if you like'],
    ],
    steps: [
      ['Ofen auf 200 °C Ober-/Unterhitze (175 °C Umluft) vorheizen, Springform fetten.', 'Mehl, Zucker, Butter, Eier, Vanillezucker und Backpulver zu einem glatten Knetteig verarbeiten.', 'Teig in die Form drücken und dabei einen Rand bis fast zum oberen Formrand hochziehen.', 'Für die Füllung Quark, Zucker, Puddingpulver, Öl, Milch und Eier (und ggf. Zitronenschale) gründlich verrühren. Die Masse ist sehr flüssig – das ist richtig so.', 'Füllung in die Form gießen und gut 1 Std. backen, bis sie gestockt und goldgelb ist.', 'Im Ofen bzw. in der Form vollständig auskühlen lassen und erst dann aus der Form lösen.'],
      ['Preheat the oven to 200 °C conventional (175 °C fan) and grease the springform.', 'Knead flour, sugar, butter, eggs, vanilla sugar and baking powder into a smooth dough.', 'Press the dough into the tin, pushing it up the sides almost to the top.', 'For the filling, whisk quark, sugar, custard powder, oil, milk and eggs (and lemon zest, if using) thoroughly. It will be very runny – that is how it should be.', 'Pour the filling into the tin and bake for a good hour until set and golden.', 'Let it cool completely in the tin before releasing it.'],
    ],
    source: 'Chefkoch.de (Käsekuchen von Tante Gertrud)',
  }),
  schwarzwaelder: rc({
    serves: ['1 Springform (Ø 26 cm)', '1 springform (26 cm)'],
    time: ['ca. 2 Std. + Kühlzeit', 'about 2 h + chilling'],
    ing: [
      ['Biskuitboden: 6 Eier', '180 g Zucker', 'Vanille (Mark oder Vanillezucker)', 'abgeriebene Schale von ½ Zitrone', '125 g Mehl', '50 g Speisestärke', '2 EL Kakao', '2 EL flüssige Butter', 'Füllung: 1 Glas Sauerkirschen (ca. 350 g Abtropfgewicht)', '2 EL Speisestärke', '1–2 EL Zucker', 'nach Belieben 3–4 EL Kirschwasser', '600 ml Sahne', '2 Päckchen Sahnesteif', '2 EL Zucker', 'Deko: Schokoraspeln, einige Kirschen'],
      ['Sponge: 6 eggs', '180 g sugar', 'vanilla (seeds or vanilla sugar)', 'grated zest of ½ lemon', '125 g flour', '50 g cornflour', '2 tbsp cocoa', '2 tbsp melted butter', 'Filling: 1 jar sour cherries (about 350 g drained weight)', '2 tbsp cornflour', '1–2 tbsp sugar', '3–4 tbsp kirsch, if you like', '600 ml cream', '2 sachets cream stabiliser', '2 tbsp sugar', 'Decoration: chocolate shavings, a few cherries'],
    ],
    steps: [
      ['Ofen auf 180 °C Ober-/Unterhitze vorheizen, den Boden der Springform mit Backpapier auslegen (Rand nicht fetten).', 'Eier mit Zucker, Vanille und Zitronenschale 8–10 Min. sehr hell und dick schaumig schlagen.', 'Mehl, Stärke und Kakao mischen, darübersieben und vorsichtig unterheben. Zum Schluss die flüssige Butter unterziehen.', 'Teig in die Form füllen und ca. 30 Min. backen (Stäbchenprobe). Auskühlen lassen und waagerecht zweimal durchschneiden, sodass drei Böden entstehen.', 'Kirschen abtropfen lassen, Saft auffangen. Etwas Saft mit Stärke und Zucker verrühren, den übrigen Saft aufkochen, die Stärke einrühren und kurz köcheln lassen. Kirschen unterheben (einige für die Deko beiseitelegen) und abkühlen lassen.', 'Sahne mit Sahnesteif und Zucker steif schlagen.', 'Unteren Boden nach Belieben mit Kirschwasser beträufeln, Kirschmasse darauf verteilen und etwas Sahne daraufstreichen. Zweiten Boden auflegen, beträufeln und mit Sahne bestreichen, dann den dritten Boden auflegen.', 'Torte rundherum mit Sahne einstreichen, mit Sahnetupfen und Kirschen verzieren und mit Schokoraspeln bestreuen. Mindestens 2 Std. kühl stellen.'],
      ['Preheat the oven to 180 °C conventional and line the base of the springform with baking paper (do not grease the sides).', 'Whisk the eggs with sugar, vanilla and lemon zest for 8–10 min until very pale and thick.', 'Mix flour, cornflour and cocoa, sift over and fold in gently. Finally fold in the melted butter.', 'Pour into the tin and bake for about 30 min (skewer test). Let cool and cut horizontally twice to make three layers.', 'Drain the cherries, catching the juice. Stir a little juice with the cornflour and sugar, bring the rest of the juice to the boil, stir in the cornflour mixture and simmer briefly. Fold in the cherries (keep a few back for decoration) and let cool.', 'Whip the cream with stabiliser and sugar until stiff.', 'Drizzle the bottom layer with kirsch if you like, spread the cherry mixture over it and top with some cream. Add the second layer, drizzle and spread with cream, then add the third layer.', 'Cover the whole cake with cream, decorate with rosettes of cream and cherries and sprinkle with chocolate shavings. Chill for at least 2 h.'],
    ],
    tip: ['Der Biskuitboden ist das Familienrezept; Füllung und Aufbau sind eine klassische Ergänzung.', 'The sponge base is the family recipe; the filling and assembly are a classic addition.'],
    family: true,
  }),
}
