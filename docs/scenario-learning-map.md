# Szituáció → tanulási térkép

Ez a táblázat minden meglévő szituációt a hozzá tartozó kompetenciákkal, vizuális feladattal,
döntési mechanikával, visszacsatolással és ajánlott következő gyakorlattal köt össze — annak
dokumentálására, hogy a 7 alapszituáció + 1 záró komplex gyakorlat egyetlen összefüggő fejlődési
modellt alkot, nem hét különálló, egymástól független leckét.

A kompetencia-konvenció (`src/lib/types.ts`, `ScenarioSummary.competencies`): a tömb **[0]** indexe
az **elsődleges** kompetencia, a többi elem a **másodlagos** kompetenciák listája. Ugyanez a sorrend
jelenik meg a `SituationBrief`-en a szituáció elején, és a `ResultScreen`-en a lezáráskor — ezzel
zárva a tanulási hurkot.

| Szituáció | Elsődleges kompetencia | Másodlagos kompetenciák | Vizuális feladat | Döntési mechanika | Visszacsatolás | Ajánlott következő modul |
|---|---|---|---|---|---|---|
| **ESET 03** – Reggeli ellenőrzés során eltérés észlelhető | Helyzetfelismerés | Kockázatértékelés, Dokumentáció | Hero kép (kontextus) | 1 döntési pont (2 opció) | FeedbackPanel (Döntésed/Miért/Kockázat/Kompetenciahatás) | Információgyűjtés és jelentés |
| **ESET 07** – Feszültség egy zárkakörleten | Helyzetfelismerés | Kockázatértékelés, Kommunikáció, Deeszkaláció | Hero + **Awareness** (7 jelölő, interaktív) | Megfigyelés → Döntés (4 opció) → Awareness → Kommunikáció (3 választás) | FeedbackPanel + kommunikációs metrikák (hangnem/világosság/kontroll/eszkaláció/információszerzés) | Dinamikus kockázatértékelés |
| **ESET 11** – Látogatást követő szokatlan viselkedés | Helyzetfelismerés | Kommunikáció, Deeszkaláció | Hero kép (kontextus) | 1 döntési pont (2 opció) | FeedbackPanel | Professzionális kommunikáció |
| **ESET 15** – Két fogvatartott közötti fokozódó konfliktus | Kockázatértékelés | Konfliktuskezelés, Deeszkaláció, Együttműködés | Hero kép (kontextus) | 1 döntési pont (3 opció) | FeedbackPanel | Csapatmunka és eszkaláció |
| **ESET 19** – Újonnan befogadott személy fokozott feszültséget mutat | Helyzetfelismerés | Kommunikáció, Információgyűjtés | Hero kép (kontextus) | 1 döntési pont | FeedbackPanel | Információgyűjtés és jelentés |
| **ESET 22** – Rendkívüli eseményt követő információgyűjtés | Információgyűjtés | Dokumentáció, Együttműködés | Hero kép (kontextus) + explicit **folyamatlánc**: Tény → Forrás → Időrend → Intézkedés → Dokumentáció | 1 döntési pont — tudatosan **nem** akció-orientált | FeedbackPanel | Rendkívüli esemény utóértékelése |
| **Művelet: Kritikus pont** (záró komplex szituáció) | Helyzetfelismerés | Kockázatértékelés, Konfliktuskezelés, Kommunikáció, Deeszkaláció, Információgyűjtés, Együttműködés, Dokumentáció (mind a 8) | Hero (irányítóterem) + **Awareness** (5 jelölő, parancsnoki→helyszíni váltás) | Megfigyelés → Döntés (priorizálás) → Awareness → Kommunikáció → Döntés (dokumentáció) | FeedbackPanel minden döntési ponton + záró `closingNote` | Csapatmunka és eszkaláció |

## Amit a táblázat mutat

- **Nehézségi gradiens:** az öt egyszerű, egy döntési pontos szituáció (03, 11, 15, 19, 22) alapozza
  meg azokat a kompetenciákat, amelyeket a két többszakaszos, vizuálisan gazdagabb szituáció (07,
  Kritikus pont) már összefonva, magasabb komplexitásban kér számon.
- **A Kritikus pont az egyetlen szituáció, amely mind a 8 kompetenciát mozgósítja** — ez a záró,
  komplex gyakorlat szerepét adatszinten is alátámasztja, nem csak szövegesen (lásd
  `Scenario.closingNote`).
- **Az "ajánlott következő modul" mező** jelenleg statikus (`Scenario.nextModule`), és
  fallback-értékként szolgál a `ResultScreen`-en — a ténylegesen megjelenő ajánlást a tanuló adott
  futásának kompetencia-deltái alapján a determinisztikus `recommendFromDeltas()` (lásd
  `src/lib/adaptive-recommendation.ts`) számítja ki, ez felülírhatja a statikus alapértéket, ha a
  tényleges teljesítmény más területet jelöl ki fejlesztendőnek.
- **Vizuális feladat csak ott jelenik meg awareness-formában, ahol az önálló pedagógiai értéket ad**
  — a többi szituációnál a hero kép kontextust ad, de nem lenne indokolt egy egyetlen döntési pontos
  gyakorlathoz külön helyszíni tudatossági feladatot generálni.
