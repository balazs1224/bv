# Vizuális rendszer

Ez a dokumentum írja le, hogyan illeszkednek a fotórealisztikus, AI-generált illusztrációk a
Biztonsági Döntéstár adatmodelljébe és felületébe: a hero/awareness megkülönböztetést, a
hotspot-rendszert, a reszponzív kép-konténer technikát, a kalibrációs eszközt és az AI-tartalom
jelölésének elvét. A tényleges fájl-leképezésért lásd [`IMAGE-INTEGRATION.md`](../IMAGE-INTEGRATION.md);
a szituáció-szintű pedagógiai összefüggésekért lásd [`scenario-learning-map.md`](./scenario-learning-map.md).

## 1. Két kép, két szerep — nem ugyanaz

A rendszer szándékosan **nem** egy "illusztráció szituációnként" modellt követ. Egy szituációhoz
legfeljebb két kép tartozik, és ezeknek eltérő a pedagógiai funkciója:

| | Hero (`visual.hero`) | Awareness (`visual.awareness`) |
|---|---|---|
| Szerep | Kontextusadás — "hova kerülök, mikor, milyen helyszínen" | Aktív helyzetfelismerési feladat forrása |
| Mikor jelenik meg | Egyszer, a `brief` szakaszban (és a dashboard/lista-nézetekben, kisebb méretben) | Az `awareness-map` szakaszban, interaktív hotspotokkal |
| Interaktivitás | Nincs — statikus kontextuskép | Igen — kattintható/billentyűzettel elérhető jelölőpontok |
| Ismétlődik-e szakaszonként | Nem — a `SceneViewport` a további szakaszokban egy elvont, stilizált ambient illusztrációt (`CorridorIllustration`) használ, hogy a hero kép ne kophasson el ismétlődéstől | Nem — kizárólag a saját szakaszában jelenik meg |

Emiatt a 7 alapszituációból csak kettőnek (ESET 07, Kritikus pont) van `awareness` képe: ez a két
szituáció rendelkezik ténylegesen az `awareness-map` szakasztípussal. A többi öt szituáció egyetlen
döntési pontból áll, ott a helyszíni tudatosság gyakorlása nem indokolt — nekik csak hero képük van.

**Nincs külön "eredmény" kép.** A `result` szakasz nem kap saját illusztrációt: a képernyő a korábbi
megfigyeléseket, döntéseket és kockázatváltozásokat foglalja össze szövegesen/adatvezérelten (lásd
`docs/pedagogiai-koncepcio.md` 8. és 9. pont), nem egy újabb generált vizuállal.

## 2. Adatmodell

```ts
// src/lib/types.ts
export interface ScenarioImage {
  src: string;
  alt: string;
  width: number;   // natív pixelszélesség
  height: number;  // natív pixelmagasság
}

export interface ScenarioVisual {
  hero?: ScenarioImage;
  awareness?: ScenarioImage;
}

export interface Scenario extends ScenarioSummary {
  // ...
  visual?: ScenarioVisual;
}
```

Fontos elv: **egyetlen komponens sem tartalmaz szituáció-azonosító alapú elágazást** (nincs
`if (scenario.id === "eset-07")` jellegű kód). Minden komponens (`SituationBrief`, `AwarenessMap`,
`MissionBrief`, `SituationRow`) kizárólag a `scenario.visual` adatmodellen keresztül kapja meg,
melyik képet jelenítse meg — új szituáció felvétele vagy meglévő kép cseréje tiszta adatmódosítás,
nem igényel komponensváltoztatást.

## 3. Reszponzív, letterbox-mentes kép-konténer

A hotspot-koordináták (lásd lent) az **kép ténylegesen megjelenített területéhez** viszonyított
százalékos értékek. Ha a konténer aránya eltér a kép natív arányától, `object-fit: contain` mellett
letterbox-sáv keletkezik, és a százalékos koordináták elcsúsznak a valós pixelpozíciótól.

Ennek elkerülésére a `ScenarioImageFrame` (`src/components/shared/scenario-image.tsx`) a konténer
CSS `aspect-ratio`-ját **a kép natív `width`/`height` értékéből számítja**, és `object-fit: cover`-t
használ. Mivel a konténer aránya mindig megegyezik a kép arányával, sosem keletkezik letterbox-sáv —
a százalékos koordináták a konténer tényleges méretétől függetlenül, minden képernyőméreten
pontosan ugyanazt a pixelpozíciót jelölik.

A komponens emellett:
- hiányzó kép vagy betöltési hiba (`onError`) esetén egy semleges, feliratozott helyőrzőt jelenít
  meg (`fallbackLabel` prop) — nem tör el, nem generál pótlásképp más tartalmat;
- `next/image`-et használ (`fill` + számított `aspectRatio`), `priority`-t csak a ténylegesen
  above-the-fold hero képeknél kap (pl. `SituationBrief`, `MissionBrief`), a többi kép lustán töltődik;
- `sizes` attribútumot minden hívási helyen a tényleges elrendezéshez igazítva kap (pl. `72px` a lista
  thumbnailekhez, `(min-width: 1024px) 50vw, 100vw` a hasáb-elrendezésű brief képhez).

## 4. Hotspot-rendszer (awareness-map)

Az `AwarenessMarker` (`src/lib/types.ts`) két jelölőtípust támogat:

- **`type: "point"`** — egyetlen fizikai pont (pl. személy, kamera, kijárat, tárgy). `x`/`y`: a
  jelölő középpontja, százalékban a kép területéhez viszonyítva.
- **`type: "area"`** — térbeli viszony/zóna, amikor a jelenség nem egyetlen ponthoz köthető (pl.
  "biztonságos kommunikációs távolság"). `x`/`y`: a terület bal felső sarka, `width`/`height`:
  kiterjedés, mind százalékban.

Ez a megkülönböztetés azért szükséges, mert egy relációs fogalmat (távolságtartás) hibás lenne egy
ponthoz rögzíteni — az área típus lehetővé teszi, hogy a jelölés a tényleges térbeli kiterjedést
fedje le.

**A hotspotok vizuálisan teljesen láthatatlanok felfedezés előtt.** Ez a rendszer legfontosabb
pedagógiai szabálya: nincs előre kirajzolt kör, terület-körvonal, sorszám vagy szín — a hitbox
(a kattintható terület) létezik és a megadott `x`/`y`/`width`/`height` koordinátákon pontosan
elhelyezkedik, de `background: transparent`, körvonal és felirat nélkül. A tanulónak ténylegesen
végig kell néznie a fotót, és saját belátása szerint kell kattintania a releváns pontokra — a
rendszer nem súgja meg előre, hol vannak a jelek. Csak **sikeres kattintás után** jelenik meg egy
visszafogott, primary színű jelölő pipával; a jelölő kategóriája és felirata (`aria-label`, illetve
a szekvenciális lista sora) ekkor válik láthatóvá. Téves/üres területre kattintva a visszajelzés
visszafogott ("Ezen a területen nincs kiemelt jel. Nézd át a helyszínt tovább."), nincs pontlevonás,
hangjelzés vagy játékos büntetés.

**Kettős interakciós útvonal (akadálymentesség) — nem egy triviális, mindig helyes lista.** A
képen lévő hotspot-gomboknak van egy funkcionális párja egy szekvenciális, billentyűzettel/
képernyőolvasóval bejárható listában, ugyanazt a `toggle(id)` állapotot vezérelve — a feladat
vizuális letapogatás nélkül, kizárólag Tab/Enter navigációval is teljesíthető. Fontos különbség
azonban: a lista **nem** a valódi jelölők egyszerű, azonos sorrendű felsorolása. A `AwarenessMap`
minden induláskor a valódi jelölőket **véletlenszerűen megkeveri**, és kiegészíti néhány
(scenario-független, generikus) **csali** elemmel (`DECOY_PROMPTS`, `src/components/scenario/
awareness-map.tsx`) — ezek felfedezés előtt szövegszinten megkülönböztethetetlenek a valódi
jelölőktől ("Lehetséges jel a helyszínen"). Egy csalira kattintva a kép üres területére kattintáshoz
hasonló, nem büntető visszajelzés érkezik, és nem növeli a `found` számlálót. Enélkül a lista N darab
mindig-helyes gombból állna, amit vak végigkattintással triviálisan meg lehetne oldani — a csalikkal
a lista ugyanazt a felismerés-és-döntés logikát gyakoroltatja, mint a fotó vizuális átvizsgálása.

## 5. Kalibrációs debug mód

A hotspot-koordinátákat a tényleges fotókhoz vizuálisan kalibráltuk, de a pontos pixelillesztés
finomítható maradt. Ehhez létezik egy fejlesztői segédeszköz:

- **Aktiválás:** `?debugHotspots=1` az URL-ben, **kizárólag development módban**
  (`src/lib/use-debug-hotspots.ts` — `process.env.NODE_ENV === "production"` esetén korán visszatér,
  ezt a Next.js build-time konstansként eliminálja éles buildben, tehát a funkció production
  build-ben semmilyen query paraméterrel nem aktiválható).
- **Megjelenítés:** `HotspotCalibrationOverlay` (`src/components/scenario/hotspot-calibration-overlay.tsx`)
  — kattintásra kiszámítja a kattintott pont %-os koordinátáját a kép tényleges megjelenített
  területéhez képest (`getBoundingClientRect()` alapján), megjeleníti a jelölők jelenlegi
  középpontjait (piros pontok), és egy gombbal vágólapra másolható koordinátát ad. Emellett maguk a
  `HotspotButton` hitboxok is kapnak egy halvány lime körvonalat/szaggatott keretet debug módban —
  így a pontos kattintható terület kiterjedése (nem csak a középpontja) is látható, kizárólag ekkor.

## 6. Kép-leltár és hotspot-koordináták

| Szituáció | Hero | Awareness | Megjegyzés |
|---|---|---|---|
| ESET 03 | `eset-03/hero.webp` | — | egyetlen döntési pont, nincs helyszíni tudatossági szakasz |
| ESET 07 | `eset-07/hero.webp` | `eset-07/awareness.webp` | 7 jelölő (6 pont + 1 terület), lásd lent |
| ESET 11 | `eset-11/hero.webp` | — | |
| ESET 15 | `eset-15/hero.webp` | — | |
| ESET 19 | `eset-19/hero.webp` | — | |
| ESET 22 | `eset-22/hero.webp` | — | ld. 7. pont — dokumentációs lánc, nem "akció" |
| Kritikus pont | `kritikus-pont/hero.webp` | `kritikus-pont/awareness.webp` | 5 jelölő (4 pont + 1 terület), parancsnoki→helyszíni váltás |

Minden kép 1600×900 px, WebP, ~60–95 kB. Az alt szövegek a hero képeknél leíróak (a jelenetet írják
le), az awareness képeknél szándékosan **generikusak** (pl. *"Helyzetfelismerési feladathoz tartozó
helyszíni kép egy zárkakörleti folyosóról."*) — nem sorolják fel a megtalálandó jelölőket, hogy a
képernyőolvasó-használó ne kapjon előnyt/spoilert a feladat vizuális verziójához képest. A teljes,
akadálymentes összefoglalás (mit tartalmazott a kép) csak a feladat teljesítése *után* válik
elérhetővé, a szekvenciális lista felfedett elemein keresztül.

### ESET 07 — `awarenessMarkers` (`src/lib/data/scenarios/eset07.ts`)

| id | típus | pozíció (%) | kategória | címke |
|---|---|---|---|---|
| m1 | point | x=65, y=37 | személy | Feldúlt fogvatartott |
| m2 | point | x=79, y=40 | személy | Visszahúzódó fogvatartott |
| m3 | point | x=55, y=31 | tanú | Szemlélők csoportja |
| m4 | point | x=45, y=14 | kijárat | Körlet kijárata |
| m5 | point | x=77, y=6 | kamera | Kamerával lefedett terület |
| m6 | point | x=56, y=73 | tárgy | Szabadon hagyott tárgy a folyosón |
| m7 | area | x=27, y=50, w=15, h=20 | távolság | Biztonságos kommunikációs távolság |

Mind a 7 jelölő vizuálisan kalibrálva van a tényleges fotóhoz — nincs köztük `needsCalibration`
jelölésű elem.

### Kritikus pont — `awarenessMarkers` (`src/lib/data/scenarios/kritikuspont.ts`)

| id | típus | pozíció (%) | kategória | címke | kalibráció |
|---|---|---|---|---|---|
| m1 | point | x=64, y=46 | személy | Ismeretlen okból jelenlévő személy | kész |
| m2 | point | x=60, y=33 | kijárat | Kijárati irány | **`needsCalibration: true`** |
| m3 | point | x=23, y=8 | kamera | CCTV kamera | kész |
| m4 | point | x=10, y=48 | tárgy | Nyitva hagyott technikai szekrény | kész |
| m5 | area | x=30, y=54, w=22, h=18 | távolság | Biztonságos megközelítési távolság | kész |

`m2` (Kijárati irány) kezdő koordinátája vizuálisan becsült, de még **véglegesítésre vár** — a
`needsCalibration: true` flag ezt jelzi az adatmodellben, és a `?debugHotspots=1` móddal könnyen
finomítható. A jelölő funkcionálisan teljes értékű (kattintható, felfedezhető), csak a pixelpontosság
igényel egy utolsó vizuális ellenőrzést.

**Fontos pedagógiai döntés:** az `m1` jelölő ("Ismeretlen okból jelenlévő személy") szövege
tudatosan semleges — *"A jelenlét oka egyelőre nem tisztázott – ez önmagában információhiány, nem
gyanúsítás."* A cél az információhiány felismertetése, nem egy személy előítéletes "gyanús
elkövetőként" való megbélyegzése.

## 7. ESET 22 — nem akció, hanem dokumentációs lánc

Az ESET 22 hero képe két kollégát ábrázol dokumentáció közben (CCTV-monitorok, jegyzetek, rádió). A
tanulónak itt **nem** kell "akciót" várnia — a `Scenario.processChain` mező (`["Tény", "Forrás",
"Időrend", "Intézkedés", "Dokumentáció"]`) jeleníti meg ezt explicit módon a `SituationBrief`
felületén, a `ProcessChain` komponensen (`src/components/system/process-chain.tsx`) keresztül,
mielőtt a tanuló a döntési pontra érne.

## 8. Kritikus pont — parancsnoki nézet → helyszíni nézet váltás

A záró szituáció hero képe az irányítótermet mutatja (CCTV-falak, rádiós egyeztetés) — ez a
**parancsnoki/információs nézet**. Az `awareness-map` szakasz elérésekor a narratíva explicit módon
jelzi a váltást a **helyszíni nézetre**: *"Az irányítóteremből kilépve, kollégáddal a folyosói jelzés
helyszínére érkezel. Az imént még a monitorfalon láttad az intézetet — most a valós térben kell
felmérned."* Ez a vizuális és szöveges váltás erősíti azt, hogy a záró gyakorlat több nézőpontot és
kompetenciát mozgósít egyetlen összefüggő döntéssorozatban.

## 9. AI-generált tartalom jelölése

A felületen használt fotórealisztikus illusztrációk **AI-generált, demonstrációs célú** vizuális
anyagok — nem valódi büntetés-végrehajtási létesítmények, nem valós személyek felvételei. Ez a tény:

- itt, a technikai dokumentációban explicit módon rögzítve van;
- a `docs/pedagogiai-koncepcio.md` és a `README.md` is megemlíti demonstrációs kontextusként;
- szándékosan **nincs** minden képre égetett vízjelként ráhelyezve — ez rontaná a felület oktatási,
  nem marketing jellegét, és a képek amúgy sem lettek se szerkesztve, se felirattal ellátva (lásd 10.
  pont).

Éles, pályázaton kívüli bevezetés esetén ez a jelölés egy dedikált "Módszertan/Rólunk" felületi
elemként (pl. tooltip vagy külön oldal) jelenne meg minden tanuló számára láthatóan — ennek
implementálása jelen demó keretein túlmutat, de az adatmodell (`ScenarioImage`) és a dokumentációs
szerkezet ezt nem zárja ki.

## 10. Amit a rendszer sosem tesz a képekkel

- Nincs a képfájlba égetett hotspot, felirat vagy vízjel — minden interaktív réteg HTML/CSS
  (`AwarenessMap` overlay-ei), a képfájlok érintetlenek.
- Nincs komponensben szituáció-azonosító alapú elágazás képválasztáshoz.
- Nincs "eredmény" kép — a `result` szakasz a korábbi adatokból építkezik, nem kap saját generált
  illusztrációt.
- Nincs automatikus helyettesítő kép generálása hiányzó fájl esetén — a `ScenarioImageFrame`
  helyőrzőt mutat, és ez a dokumentum jelzi az állapotot.
