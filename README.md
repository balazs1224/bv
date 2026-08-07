# Biztonsági Döntéstár

Interaktív szituációs képzési platform a büntetés-végrehajtási állomány számára.
Frontend demo a Belügyi Tudományos Tanács „Az év rendvédelmi digitális tananyagfejlesztője 2026”
pályázatára (kategória: Büntetés-végrehajtás).

A platform szituációalapú döntéshozatali tréninget nyújt hagyományos e-learning/kvíz helyett:
**FELISMERÉS → KOCKÁZATÉRTÉKELÉS → DÖNTÉS → KÖVETKEZMÉNY → REFLEXIÓ → ADAPTÍV GYAKORLÁS.**

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
- `/demo` – vezetett, ~5 perces pályázati bemutató
