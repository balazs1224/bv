# Pedagógiai koncepció

## 1. Az oktatási probléma

A büntetés-végrehajtási szolgálati munka nagy része nem szabályok betartásáról szól, hanem
**helyzetfüggő ítélőképességről**: ugyanaz a szabályismeret két különböző kontextusban két eltérő,
mindkettő esetben helyes döntést igényelhet. A hagyományos, tananyag-felolvasás + zárthelyi kvíz
típusú képzés jól méri a szabályismeretet, de nem méri és nem fejleszti azt, ami a szolgálatban
ténylegesen számít: hogyan ismeri fel valaki a releváns jeleket egy zajos, hiányos információjú
helyzetben, hogyan mérlegel kockázatot valós időben, és hogyan kommunikál nyomás alatt.

A Biztonsági Döntéstár erre a résre épül: nem azt kérdezi, "tudod-e a szabályt", hanem azt szimulálja,
"mit tennél, amikor a szabály alkalmazása maga igényel értelmezést".

## 2. Célcsoport

Elsődlegesen a büntetés-végrehajtási állomány szolgálatot teljesítő, közvetlen fogvatartotti
kontaktusban lévő tagjai — mind az alapképzésben lévő új belépők (akiknek a mintázatfelismerés még
nem rutin), mind a tapasztaltabb állomány (akiknek a rendszeres, változatos szituációs gyakorlás
tartja frissen a döntési reflexeket). A kilenc modul nehézségi gradiense (kezdő → középes → haladó →
záró komplex gyakorlat) mindkét csoportot kiszolgálja: az új belépő az alapoktól indul, a tapasztalt
kolléga a haladó/záró gyakorlatokkal tartja karban a kompetenciáit.

Másodlagos célcsoport az **oktató/kiképző állomány**, akik a rendszer oktatói nézetén keresztül
csoportszintű mintázatokat, tipikus hibákat és fejlesztendő területeket látnak — nem az egyéni
tanulói felületet használva, hanem egy külön, aggregált nézetben.

## 3. Tanulási cél

A rendszer nem lexikális tudást (szabályok felsorolása), hanem **alkalmazott, szituációhoz kötött
döntési kompetenciát** fejleszt. A tanulási cél operacionalizálva: a tanuló egy adott szolgálati
helyzetben (a) észreveszi a releváns jeleket hiányos információ mellett, (b) tudatosan mérlegeli a
kockázatot több dimenzió mentén, (c) arányos, indokolható döntést hoz, (d) ha szükséges, szakszerűen
kommunikál, és (e) a döntés következményét és a tanulságot integrálja a következő hasonló
helyzethez.

## 4. Kompetenciamodell

Nyolc kompetencia (`src/lib/data/meta.ts` — `COMPETENCIES`): **helyzetfelismerés, kockázatértékelés,
konfliktuskezelés, kommunikáció, deeszkaláció, információgyűjtés, együttműködés, dokumentáció.**
Minden szituáció egy elsődleges és egy vagy több másodlagos kompetenciát fejleszt (konvenció:
`Scenario.competencies[0]` = elsődleges — lásd `docs/scenario-learning-map.md`). A kompetenciák nem
elszigetelt kategóriák: a záró komplex gyakorlat (Kritikus pont) mind a nyolcat egyszerre mozgósítja,
demonstrálva, hogy a valós szolgálati helyzetek ritkán különíthetők el egyetlen készségre.

## 5. Szituációalapú oktatási modell

A tananyag alapegysége nem a lecke, hanem a **szituáció**: egy konkrét, időbélyegzett, helyszínhez
kötött esemény, amelyet a tanuló szakaszosan dolgoz fel (`Scenario.stages`). A szakasztípusok
(`brief`, `observation`, `awareness-map`, `decision`, `communication`, `result`) egy közös motorra
épülnek (`scenario-engine.ts`, `ScenarioRunner`), de szituációnként eltérő kombinációban és
sorrendben jelennek meg — a modell rugalmas, nem egy fix "5 lépéses varázsló".

## 6. A döntési hurok

A rendszer gerince egy explicit, minden szituációban visszaköszönő hurok:

**FELISMERÉS → KOCKÁZATÉRTÉKELÉS → DÖNTÉS → KÖVETKEZMÉNY → REFLEXIÓ → ADAPTÍV GYAKORLÁS**

Ez nem csak dokumentációs metafora — a felületen is végigkövethető: a `RiskProfile` élőben mutatja a
kockázati dimenziók változását egy döntés hatására ("A döntés hatására módosult" jelzéssel), a
`FeedbackPanel` explicit mezőkben mutatja a döntést, annak indoklását, a csökkentett *és* a
fennmaradó kockázatot, a kompetenciahatást és a megjegyzendő tanulságot, a `ResultScreen` pedig a
lezáráskor visszavezet a kompetenciákhoz és egy konkrét következő gyakorlathoz.

## 7. Formatív visszacsatolás

Minden döntés és kommunikációs választás után azonnali, strukturált visszajelzés érkezik — nem csak
"helyes/helytelen" minősítés, hanem: *miért* volt megfelelő vagy nem megfelelő a választás, *milyen*
kockázatot csökkentett, *milyen* kockázat maradt fenn, és *mit* érdemes megjegyezni belőle. A
kommunikációs szakasz emellett dimenziónkénti (hangnem, világosság, kontroll, eszkalációs kockázat,
információszerzés) metrikát is mutat, hogy a tanuló ne csak azt lássa, hogy "rosszul kommunikált",
hanem azt is, *melyik dimenzióban*.

## 8. Reflexió

A `result` szakasz szándékosan nem egy újabb feladat, hanem egy megállási pont: összegzi a döntési
minőséget (nem csak számszerű pontszámot, hanem kvalitatív minősítést is — pl. "Megfontolt,
szakszerű döntés"), a kockázatkezelés eredményét (hány dimenzió mérséklődött, mi maradt fenn), a
kompetenciahatást szituáció-szinten, valamint explicit erősség/fejlesztendő terület megfogalmazást.
A cél, hogy a tanuló ne csak az eredményt lássa, hanem *hogyan gondolkodott* a helyzetben.

## 9. Adaptív gyakorlás

A rendszer **determinisztikus, szabályalapú** ajánlómotort használ (`src/lib/adaptive-recommendation.ts`)
— tudatosan **nem** gépi tanulási modellt, és a felületi szövegezés is ezt tükrözi ("Az eredményeid
alapján ezt érdemes következőként gyakorolnod", sosem "Az AI szerint..."). Két bemenetet kezel:

- **`recommendFromLevels`** — a tanuló teljes kompetenciaprofilja alapján (dashboard szintű ajánlás):
  a küszöbérték (65%) alatti kompetenciák közül a leggyengébbet ajánlja; ha minden kompetencia a
  küszöb felett van, a relatíve legalacsonyabbat, hogy az ajánlás sosem áll meg üresen.
- **`recommendFromDeltas`** — egy adott lezárt szituáció kompetencia-deltái alapján (eredmény
  képernyő szintű ajánlás): a legkevésbé pozitív/leginkább negatív irányba mozdult kompetenciát
  ajánlja a szituációhoz statikusan rendelt `nextModule` mint alapérték felülírásával.

Az átláthatóság szándékos: a küszöbérték és a kiválasztási logika kódban olvasható, tesztelhető,
nem egy fekete doboz.

## 10. Oktatói visszacsatolás

Az oktatói nézet (`/oktato`) nem csupán nyers diagramokat mutat, hanem **címkézett, narratív
mintázat-insightokat** (`INSTRUCTOR_INSIGHTS`, kategóriákkal: *Gyakori döntési hiba*, *Nehéz
kompetencia*, *Szituációs mintázat*, *Fejlődési trend*) — a cél, hogy az oktató ne csak azt lássa,
"hány pontot ért el a csoport", hanem azt is, *milyen döntési mintázatokban bizonytalan* a tanulói
állomány. A jelenlegi adatok demonstrációs mock adatok (`src/lib/data/instructor.ts`), élesben ezek
a tényleges döntésnaplókból számolódnának — ezt a felület is jelzi (`InsightList` láblécszövege).

## 11. A vizuális helyzetfelismerés szerepe

A fotórealisztikus képek nem díszítőelemek. A **hero** kép kontextust ad ("hol és mikor vagyok"), az
**awareness** kép egy tényleges interaktív információforrás: a tanulónak vizuálisan kell azonosítania
releváns jeleket egy valós fotón (kattintható/billentyűzettel elérhető jelölőpontokkal), mielőtt a
későbbi döntésekhez eljutna. Ez a mechanika szándékosan különbözik a szöveges "Megfigyelés"
szakasztól (`observation` — "mit tartasz fontos információnak" listaválasztás): az egyik a szöveges
releváns-információ-kiválasztást gyakorolja, a másik a valós vizuális letapogatást. Részletek:
`docs/visual-system.md`.

## 12. Technikai megvalósítás

Next.js (App Router) + React + TypeScript, teljes egészében adatvezérelt architektúrával: a
szituációk, modulok, kompetenciák és oktatói mock adatok típusos TypeScript struktúrákban élnek
(`src/lib/types.ts`, `src/lib/data/**`), a felületi komponensek pedig ezekből az adatokból építik fel
a szakaszokat — nincs szituáció-specifikus elágazás a komponensekben. A jelenlegi állapot **frontend
demo, strukturált mock adatokkal**, valós backenddel és LMS-sel később integrálható adatmodellre
építve; a döntésnaplózás, felhasználókezelés és perzisztens tanulói profil még nincs bekötve éles
backendhez.

## 13. Akadálymentesség

Minden hero kép értelmes `alt` szöveggel rendelkezik; az awareness képek `alt` szövege szándékosan
generikus (nem sorolja fel a megtalálandó jelölőket, hogy ne adjon spoiler-előnyt). Minden hotspot
billentyűzettel elérhető, és van egy vele funkcionálisan azonos, szekvenciális lista-alapú út a
feladat teljesítésére — így a képernyőolvasó-használó a vizuális letapogatás kihagyásával, de
ugyanazt a döntési logikát alkalmazva tudja teljesíteni a feladatot. Részletek: `docs/visual-system.md`
4. pont.

## 14. Továbbfejleszthetőség

A demo tudatosan hagy nyitva pontokat, amelyek éles bevezetéshez szükségesek, de a pályázati
bemutató kereteit meghaladják:
- valós backend + perzisztens tanulói profil és döntésnapló (jelenleg minden állapot kliensoldali,
  munkamenet-szintű);
- az oktatói nézet mock adatainak valós, aggregált döntésnaplókra cserélése;
- LMS-integráció (pl. SCORM/xAPI export a döntésnaplókból);
- a hotspot-koordináták finomhangolása a `?debugHotspots=1` móddal ott, ahol
  `needsCalibration: true` jelzi (lásd `docs/visual-system.md` 6. pont);
- valós, jogtiszta fotóanyagra váltás — az adatmodell (`ScenarioImage`) ezt tiszta fájlcsereként
  támogatja, kódváltoztatás nélkül (lásd `IMAGE-INTEGRATION.md`).
