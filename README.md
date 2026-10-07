# What's for dinner? · Was gibt's heute?

A family app (installable PWA, German & English) that suggests what to cook for dinner,
keeps a weekly plan, history and favourites, and builds complete **Chinese** (家常菜) and
**Indian** (थाली thali) meals from matching dishes.

Every dish is shown with its **original name** (e.g. 麻婆豆腐 *Mápó dòufu*, पालक पनीर *Palak Paneer*,
Ossobuco, Mercimek köftesi) plus the translation in the chosen language.

## Features

- **Suggest** – three ideas at a time, weighted: favourites more often, nothing eaten in the
  last *n* days (default 10) or already planned this week, seasonal dishes in their season.
  Filters: vegetarian/vegan, region (European / Asian / Middle East & Americas), staple
  (bread, pasta & noodles, rice, potatoes, dough), kids' favourites, not spicy, quick, cuisine, favourites only,
  eating out (your restaurants).
- **Meal builder** for Chinese and Indian dinners
  - Chinese: about one dish per person (adults + ½ per child) – meat/fish/tofu, vegetables,
    soup or cold dish, … + rice; no two dishes with the same main ingredient, at most one
    spicy dish when kids eat along.
  - Indian thali: dal + curry + sabzi + raita (+ chutney/salad) + bread + rice, optional
    drink and dessert.
  - Re-roll, keep (lock), pick yourself, add or remove dishes, then plan it for a day.
- **Week** – plan every dinner, fill empty days with suggestions.
- **Dishes** – all ~200 dishes with search (name or ingredient), ingredients and, where
  available, full recipes (the 23 recipes of the *Indischer Kochkurs* booklet, DE + EN,
  incl. vegan and kids' notes). Add your own dishes or edit the built-in ones.
- **History** – what you ate, most frequent dishes, add past days.
- **Personal favourites** – labels for people or groups (e.g. "Eric", "C&J", "J") under Options; tick on each dish whose favourite it is, filter by them; suggestions favour them and give the label whose favourites waited longest a boost.
- **Variants** as separate dishes (e.g. Schupfnudeln mit Sauerkraut / mit Apfelmus), linked on the dish page; only one variant is suggested at a time.
- **"Dinner is over"** – tick it on the Suggest page or in the week plan and the app switches to planning tomorrow.
- **Guests (party planner)** – menu in courses, buffet, finger food or raclette/BBQ & co.; guest numbers with vegetarian/vegan guests and allergies; menu suggestions (incl. ~60 party dishes: starters, salads, finger food, dips, desserts, cakes, drinks); who brings what; combined shopping list; to-do timeline. Parties also show in the week plan.
- **Shared by the whole family** on several phones (optional, via Firebase – see below).

## Data

| File | Content |
| --- | --- |
| `src/data/dishes/family.ts` | your paper list (numbers in comments; merged: 25+91, 20+94, 87+90) |
| `src/data/dishes/restaurants.ts` | eating out (72–79) |
| `src/data/dishes/chinese.ts` | your handwritten Chinese list + added classics |
| `src/data/dishes/indian.ts`, `indianRecipes.ts` | Kochkurs dishes with recipes, Chicken Tikka Masala, added classics |
| `src/data/dishes/more.ts` | added German & international classics |
| `src/data/ingredients.ts` | ingredient dictionary (DE/EN) |

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # data integrity + suggestion / meal-builder logic
npm run build
```

## Deploy (GitHub Pages)

1. Repository → **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` – the workflow tests, builds and publishes to
   `https://<user>.github.io/whatsfordinner/`.
3. On the phone: open the page → *Add to Home Screen*.

## Sync between phones (Firebase, free plan)

Without this the app works fully, but stores everything on the single device.

1. Create a project at <https://console.firebase.google.com> (Analytics not needed).
2. **Build → Authentication → Sign-in method → Anonymous → enable.**
3. **Build → Firestore Database → Create database** (production mode, region e.g. `eur3`).
   Under **Rules**, paste the contents of [`firestore.rules`](firestore.rules) and publish.
4. **Project settings → Your apps → Web app (`</>`)** → register → copy `apiKey`,
   `authDomain`, `projectId`, `appId`.
5. In GitHub: **Settings → Secrets and variables → Actions → Variables** add
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_APP_ID` and re-run the deploy workflow.
   (For local development put the same keys into `.env.local`.)
6. **Authentication → Settings → Authorized domains**: add `<user>.github.io`.
7. In the app: *Settings → Share with the family → Create a new family*, then on the other
   phones *Join* with the code or open the shared link.

The family code is a random 12-character key and acts like a shared password: everyone who has it
can see and edit the plan. The Firebase web config is not secret.
