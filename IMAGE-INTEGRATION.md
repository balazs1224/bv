# Kép-integráció – forrás → cél leképezés

Ez a dokumentum rögzíti, hogyan kerültek a pályázathoz kapott, AI-generált fotórealisztikus
illusztrációk a `public/scenarios/` alá, milyen néven, és milyen döntések mentén. Célja, hogy a
leképezés visszakereshető legyen, és hogy egy esetleges jövőbeli képcsere (pl. valódi, jogtiszta
fotóanyagra váltás) ne igényeljen kód- vagy adatmodell-változtatást — csak fájlcserét ugyanazon az
elérési úton.

## Állapot

Mind a 9 célkép elkészült és be van kötve. Egyetlen szituáció sincs képhiányos állapotban jelenleg,
de a rendszer erre az esetre is fel van készítve: ha egy `Scenario.visual.hero` vagy
`visual.awareness` mező hiányzik, vagy a fájl nem tölthető be, a `ScenarioImageFrame`
(`src/components/shared/scenario-image.tsx`) egy semleges, feliratozott helyőrzőt jelenít meg
kép helyett (nem generál pótlólagos illusztrációt, nem tör el semmit) — így ez a dokumentum
később is aktuális marad, ha egy kép ideiglenesen hiányozna.

## Forrás → cél leképezés

A kapott csomag 10 PNG fájlt tartalmazott. A fájlnevek tartalom alapján, vizuális átnézéssel lettek
beazonosítva (a pályázati leírásban szereplő elnevezések és a ténylegesen kapott fájlnevek nem
egyeztek karakterre pontosan). Az alábbi táblázat a végleges, ténylegesen felhasznált leképezés:

| Eredeti fájlnév | Cél útvonal | Szituáció |
|---|---|---|
| `Guard Inspecting Detention Corridor.png` | `public/scenarios/eset-03/hero.webp` | ESET 03 – Reggeli ellenőrzés |
| `Tense Scene in a Prison Corridor.png` | `public/scenarios/eset-07/hero.webp` | ESET 07 – Feszültség egy zárkakörleten |
| `Tense Confrontation in a Detention Hallway.png` | `public/scenarios/eset-07/awareness.webp` | ESET 07 – helyszíni tudatosság |
| `Solitary Walk Through the Prison Corridor.png` | `public/scenarios/eset-11/hero.webp` | ESET 11 – Látogatást követő viselkedés |
| `Tense Confrontation in Common Area.png` | `public/scenarios/eset-15/hero.webp` | ESET 15 – Két fogvatartott közötti konfliktus |
| `Tense Booking Room Encounter.png` | `public/scenarios/eset-19/hero.webp` | ESET 19 – Újonnan befogadott személy |
| `image-gen-1(2).png` | `public/scenarios/eset-22/hero.webp` | ESET 22 – Rendkívüli esemény utóértékelése |
| `Night Shift Security Control Room.png` | `public/scenarios/kritikus-pont/hero.webp` | Művelet: Kritikus pont – irányítótermi hero |
| `Fluorescent Shadows in the Secure Corridor.png` | `public/scenarios/kritikus-pont/awareness.webp` | Művelet: Kritikus pont – helyszíni tudatosság |

**Nem felhasznált tartalék:** `image-gen-1.png` — a csomagban ez az `image-gen-1(2).png` közeli
variánsa volt (hasonló jelenet, eltérő kompozícióval). A pályázati specifikáció kifejezetten
tartalék/kihagyandó képként hivatkozott egy hasonló elnevezésű fájlra, ezért ez a variáns szándékosan
**nincs** felhasználva sehol a felületen.

## Konverzió

Minden kép `sharp`-pal lett feldolgozva (`resize width=1600, withoutEnlargement`, `webp quality=82`),
így egységesen 16:9 arányú, ~60–95 kB méretű, webre optimalizált fájlokat kapott minden szituáció.
A pontos `width`/`height` érték (1600×900) minden érintett `Scenario.visual.*` bejegyzésben szerepel
— ez teszi lehetővé, hogy a megjelenítő konténer CSS `aspect-ratio`-ja pontosan illeszkedjen a kép
natív arányához, letterbox-drift nélkül (lásd `docs/visual-system.md`).

## Hol vannak bekötve

A leképezés a `src/lib/data/scenarios/*.ts` fájlokban, minden `Scenario.visual` mezőjében található,
típusosan (`ScenarioVisual`, `ScenarioImage` — lásd `src/lib/types.ts`). A komponensek (pl.
`SituationBrief`, `AwarenessMap`, `MissionBrief`, `SituationRow`) sosem hivatkoznak szituáció-azonosító
alapján képfájlra — mindig a `scenario.visual` adatmodellen keresztül kapják meg a képet, így új
szituáció felvétele vagy meglévő kép cseréje tisztán adatszintű módosítás.
