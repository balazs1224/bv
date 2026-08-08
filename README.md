# Biztonsági Döntéstár

Interaktív, szituációalapú döntéshozatali tréning platform a büntetés-végrehajtási állomány számára.
Frontend demo a Belügyi Tudományos Tanács „Az év rendvédelmi digitális tananyagfejlesztője 2026”
pályázatára (kategória: Büntetés-végrehajtás).

**Ez nem egy kvíz képekkel.** A rendszer fotórealisztikus, AI-generált szituációs képeket használ
valódi interaktív helyzetfelismerési feladatokhoz (nem díszítő illusztrációként), és minden
szituáció egy explicit, végigkövethető döntési hurkot jár be:

**FELISMERÉS → KOCKÁZATÉRTÉKELÉS → DÖNTÉS → KÖVETKEZMÉNY → REFLEXIÓ → ADAPTÍV GYAKORLÁS.**

A döntések valós időben módosítják a kockázati profilt, a visszajelzés strukturált (miért volt
megfelelő/nem megfelelő egy döntés, mi maradt fenn kockázatként, mit fejleszt), a következő ajánlott
gyakorlatot pedig egy átlátható, szabályalapú (nem "fekete doboz" AI-) motor számítja ki a tanuló
tényleges kompetenciaeredményei alapján.

## Dokumentáció

| Dokumentum | Tartalom |
|---|---|
| [`docs/pedagogiai-koncepcio.md`](docs/pedagogiai-koncepcio.md) | Oktatási probléma, célcsoport, kompetenciamodell, döntési hurok, adaptív gyakorlás, akadálymentesség, továbbfejleszthetőség |
| [`docs/scenario-learning-map.md`](docs/scenario-learning-map.md) | Szituáció → kompetencia → vizuális feladat → döntési mechanika → ajánlott következő modul táblázat |
| [`docs/visual-system.md`](docs/visual-system.md) | Hero/awareness kép-megkülönböztetés, hotspot-rendszer, kalibráció, AI-tartalom jelölése |
| [`docs/palyazati-demo-forgatokonyv.md`](docs/palyazati-demo-forgatokonyv.md) | Az 5 perces vezetett bemutató (`/demo`) időzített forgatókönyve |
| [`IMAGE-INTEGRATION.md`](IMAGE-INTEGRATION.md) | Forrás → cél kép-leképezés, konverziós paraméterek |

## Mi demonstrációs, és mi nem

Ez egy **frontend demo**, strukturált mock adatokkal (`src/lib/data/`) — nincs mögötte valós
backend, felhasználókezelés vagy perzisztens adattárolás. Ami viszont valóban működik, nem csak
látszik: a teljes döntésmotor (`src/lib/scenario-engine.ts`), a kockázatszámítás, a hotspot-alapú
helyszíni tudatossági feladat, a determinisztikus ajánlómotor
(`src/lib/adaptive-recommendation.ts`) és a Bemutató mód valódi, futó kód — nem statikus mockup vagy
videó. Az oktatói nézet és néhány KPI jelenleg demonstrációs mock adatot jelenít meg (ezt a felület
is jelzi); éles bevezetéshez ezek valós döntésnaplókra cserélendők — részletek:
`docs/pedagogiai-koncepcio.md` 14. pont.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Lucide Icons ·
Framer Motion · Recharts

Frontend-only demo, strukturált mock adatokkal (`src/lib/data`), valós backenddel és LMS-sel
később integrálható, data-driven szituáció-modellre építve (`src/lib/types.ts`).

## Fejlesztés

```bash
npm install
npm run dev
```

Nyisd meg a [http://localhost:3000](http://localhost:3000) címet.

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Fő nézetek

- `/` – tanulói vezérlőpult (kompetenciaprofil, mai szituáció, adaptív ajánlás)
- `/szituacio/[id]` – immerzív szituációs döntéshozatali motor
- `/kepzesek` – képzési modulok és a záró komplex szituáció
- `/mikrotanulas` – 5 perces gyakorlás
- `/oktato` – oktatói analitika (heatmap, csoport-összehasonlítás, insightok)
- `/oktato/szerkeszto` – szituációszerkesztő előnézet
- `/demo` – **Bemutató mód**: vezetett, ~5 perces pályázati bemutató a valódi felületen (nem videó) —
  lásd `docs/palyazati-demo-forgatokonyv.md`
