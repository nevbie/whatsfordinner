---
name: rezepte-digitalisieren
description: Digitalisiert Fotos von Rezepten, Einkaufszetteln, Rezeptheft-Seiten und Speisekarten für die Familien-App „Was gibt’s heute?“ (whatsfordinner). Verwenden, wenn Fotos von handschriftlichen oder gedruckten Rezepten/Gerichtelisten abgetippt, zweisprachig (DE/EN) aufbereitet und für den Import in die App vorbereitet werden sollen – auch wenn nur „Rezepte abtippen“, „Fotos digitalisieren“ oder „für die App vorbereiten“ gesagt wird.
---

# Rezepte für „Was gibt’s heute?“ digitalisieren

Ziel: Aus Fotos eine **Import-Datei** (Markdown) machen, die später in einer Claude-Code-Sitzung im Repo
`nevbie/whatsfordinner` ohne Rückfragen in die App übernommen werden kann. Alles, was hier entschieden wird,
spart dort Arbeit – deshalb pro Eintrag die App-Felder (Art, Küche, Tags …) gleich mit festlegen.

## Ablauf

1. **Alle Fotos ansehen**, Einträge zählen, Duplikate erkennen (gleiches Rezept auf zwei Zetteln, Vorder-/Rückseite,
   doppelte und halbe Mengen → ein Eintrag, Mengen als Tipp).
2. **Mit dem Bestand abgleichen**: `references/bestand.md` listet alle Gerichte, die schon in der App sind
   (id · Originalname · deutscher Name). Pro Eintrag festhalten: *neu*, *Rezept für bestehendes Gericht `id`*
   oder *Variante von `id`*.
3. **Abtippen** nach dem Format unten. Unleserliches mit **(?)** markieren und unter „Unsicher“ sammeln.
4. **Rückfragen bündeln**: Am Ende eine kurze, nummerierte Liste offener Fragen (unsichere Mengen, fehlende Titel,
   fehlende Seiten). Nicht raten, wenn es um Mengen beim Backen geht.
5. **Datei ausgeben**: `rezepte-import-JJJJ-MM-TT.md` als Datei zum Herunterladen. Diese Datei schickt die Familie
   dann an die Claude-Code-Sitzung („bitte integrieren“).

## Regeln

- **Zweisprachig**: Namen, Zutaten und Schritte auf Deutsch UND Englisch (natürlich formuliert; metrisch; EN: tsp/tbsp,
  „fan oven“ für Umluft, „conventional“ für Ober-/Unterhitze).
- **Originalname** immer in Originalsprache/-schrift (z. B. 饺子, ხინკალი, Crema catalana); für nicht-lateinische
  Schrift zusätzlich **Lautschrift** (Pinyin mit Tönen, offizielle Transliteration).
- **Handschriftliche Familienrezepte**: Mengen exakt übernehmen, Notizen/Pfeile/Nummern in klare Schritte übersetzen,
  offensichtliche Lücken (Ofen vorheizen, Form fetten) ergänzen. Quelle: `Familienrezept`.
- **Gedruckte Rezepte** (Websites, Zeitschriften, Karten, Packungen): Zutatenliste darf übernommen werden, die
  **Schritte in eigenen Worten** kurz neu formulieren – nie den Originaltext abschreiben. Quelle = Publikation.
- **Listen ohne Rezept** (Rezeptheft-Seiten, Speisekarten): nur Name + App-Felder, Zutaten als kurze Stichworte.
  Markierte Gerichte auf Speisekarten = Lieblinge der Familie.
- Nichts erfinden, was nicht auf dem Foto steht – außer Standard-Schritten, die als solche erkennbar sind.

## App-Felder (Werte genau so verwenden)

- **Art**: `Abendessen` · `Süßes Abendessen` · `Backen: Kuchen` · `Backen: Nachtisch` · `Backen: Gebäck & Brot` ·
  `Backen: Naschwerk` · `Party: <Vorspeise|Salat|Hauptgericht|Beilage|Snack|Dip|Nachtisch|Kuchen|Getränk>` ·
  `Tapa: <Kartoffel & Gemüse|Fleisch|Fisch|Brot, Käse & Oliven>` · `Abendbrot: <Brot|Käse|Wurst|Fisch|Aufstrich|Rohkost|Extra>` ·
  `Chinesisch: <Fleisch|Fisch|Tofu|Ei|Gemüse|Kalt|Suppe|Reis/Teig|Einzelgericht>` ·
  `Indisch: <Curry|Dal|Sabzi|Raita|Chutney|Salat|Beilage|Brot|Reis|Getränk|Nachtisch|Snack|Einzelgericht>` ·
  `Teller-Hauptsache` (braucht Beilage + Gemüse, z. B. Schnitzel) · `Teller-Beilage` · `Teller-Gemüse` ·
  `Salat: <Basis|Extra|Topping|Dressing>`
- **Küche**: german, austrian, swiss, french, italian, spanish, greek, turkish, mideast, persian, northafrican, eastern,
  georgian, american, mexican, chinese, indian, thai, vietnamese, japanese, korean, fusion
- **Tags**: meat, fish, veggie, vegan, kids (nur echte Kinderlieblinge), spicy, oven, sweet, social, winter, summer
- **Aufwand**: 1 = schnell (≤ 30 Min.), 2 = normal, 3 = aufwendig/Wochenende
- **Variante von**: wenn es ein bestehendes Gericht in anderer Form ist (z. B. „Nudeln mit …“, „Quiche …“, „Jiaozi mit …“).

## Format pro Eintrag

```markdown
## <Nr>. <Originalname>
- **Status:** neu | Rezept für bestehendes Gericht `<id>` | Variante von `<id>`
- **id-Vorschlag:** kebab-case-id
- **Original:** <Name> (Sprache: de/it/zh/…; Lautschrift: …)
- **Deutsch / Englisch:** <Name DE> / <Name EN>
- **Art:** <siehe oben> · **Küche:** <…> · **Tags:** <…> · **Aufwand:** <1|2|3>
- **Quelle:** Familienrezept | <Publikation>
- **Menge / Zeit:** 1 Springform Ø 26 cm / 1 springform 26 cm · ca. 1 Std. / about 1 h · 180 °C O/U

### Zutaten
| Deutsch | English |
| --- | --- |
| 200 g Mehl | 200 g flour |

### Zubereitung
1. DE … — EN …
2. …

- **Tipp:** DE … / EN …   (optional)
- **Unsicher:** (?) Stellen mit Vorschlag   (optional)
```

Für reine Namenslisten statt dessen eine Tabelle: `Original | Deutsch | Englisch | Art | Küche | Tags | Status`.

## Am Ende der Datei

```markdown
## Offene Fragen
1. …
## Zusammenfassung
- neu: N Einträge (…)  · Rezepte für bestehende Gerichte: … · Varianten: … · übersprungen: …
```
