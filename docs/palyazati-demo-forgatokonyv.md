# Pályázati demó forgatókönyv (~5 perc)

Ez a forgatókönyv a `/demo` oldalon elérhető **Bemutató módot** kíséri végig. A Bemutató mód nem
videó és nem mockup — egy vezérlősáv (`DemoModeBanner`) navigálja a bemutatót a valódi, élesen
kattintható felületen keresztül, lépésenként rövid magyarázattal, "Előző/Következő" gombokkal, és
bármikor kiléphető ("Kilépés a bemutatóból"). A lépések és időzítések a kódban is rögzítve vannak
(`src/lib/demo-mode-context.tsx` — `DEMO_STEPS`), így ez a dokumentum és a tényleges felületi szöveg
nem futhat szét egymástól.

Az időzítések irányadóak egy élő, ~5 perces bemutatóhoz — nem szigorú stopperidők.

---

## 0:00–0:35 — 1. lépés: A probléma

**Felület:** tanulói dashboard (`/`)

Nyisd meg a dashboardot, és fogalmazd meg a kiindulópontot: a szolgálati döntéshozatal nem szabályok
bemagolásáról szól, hanem helyzetfüggő ítélőképességről. Mutasd meg, hogy ez első pillantásra sem
egy kvíz-felület — a "Mai szituáció" blokk egy konkrét, időbélyegzett helyzetet vezet fel fotóval és
strukturált metaadatokkal (helyszín, idő, kompetencia), nem egy kérdés-válasz listát.

*Mondat, amit érdemes kimondani:* "Ez a rendszer nem azt kérdezi, ismeri-e a szabályt — azt
szimulálja, mit tenne a kolléga egy konkrét, hiányos információjú helyzetben."

## 0:35–1:05 — 2. lépés: A kompetenciamodell

**Felület:** `/kepzesek`

Mutasd meg a fejlesztési lánc fejlécét (Észlelés → Értékelés → Kommunikáció → Beavatkozási döntés →
Együttműködés → Dokumentáció → Komplex alkalmazás) és a kilenc modult. A hangsúly: ez nem kilenc
különálló lecke, hanem egy fejlődési ív — az utolsó, záró modul az összes korábbi kompetenciát
egyszerre mozgósítja.

## 1:05–3:05 — 3. lépés: ESET 07 — gyorsított bejárás

**Felület:** `/szituacio/eset-07`

Ez a bemutató magja, ezért kap a legtöbb időt. Vidd végig gyorsan, de valódi kattintásokkal:

1. **Helyzet (brief):** mutasd meg a fotórealisztikus helyszínképet és a mellette lévő strukturált
   infópanelt (idő, ESET-kód, helyszín, elsődleges/másodlagos kompetencia) — hangsúlyozd, hogy ez
   nem marketing hero-banner, hanem oktatási infópanel.
2. **Megfigyelés:** jelölj ki 2–3 releváns információt a listából.
3. **Első döntés:** válaszd a "B" opciót (strukturált helyzetértékelés + támogatás bevonása), és
   mutasd meg a `FeedbackPanel` mezőit — Döntésed, Miért, Csökkentett kockázat, **Fennmaradó
   kockázat**, Kompetenciahatás, Mit jegyezz meg. Mutasd meg, hogy a jobb oldali kockázati profil
   élőben, "A döntés hatására módosult" jelzéssel változik.
4. **Helyszíni tudatosság (awareness):** kattints rá 2–3 hotspotra a valódi fotón — mutasd meg, hogy
   ez egy tényleges vizuális felismerési feladat, nem csak egy másik szöveges lista. Emeld ki: a
   kategória és a felirat csak felfedezés után jelenik meg, nem előtte.
5. **Kommunikáció:** válaszd a nyugodt, megértő megközelítést, mutasd meg a dimenziónkénti
   (hangnem/világosság/kontroll/eszkaláció/információszerzés) kiértékelést.

*Mondat, amit érdemes kimondani:* "Minden döntés valós következménnyel jár — a kockázati profil nem
egy statikus grafika, hanem a döntéseid alapján változik."

## 3:05–3:50 — 4. lépés: Eredmény

**Felület:** ugyanaz a szituáció, `result` szakasz

Juss el az Eredmény képernyőig (a fennmaradó döntési pontok gyors végigkattintásával). Mutasd meg a
hierarchiát: Szituáció lezárva → Döntési minőség (nem csak szám, kvalitatív minősítés is) →
Kockázatkezelés (hány dimenzió mérséklődött, mi maradt fenn) → Kompetenciahatás → Erősség /
Fejlesztendő terület → **Következő ajánlott gyakorlat** (a determinisztikus ajánlómotor kimenete,
nem statikus szöveg).

*Mondat, amit érdemes kimondani:* "A pontszám itt is látszik, de nem ez a fő üzenet — a fő üzenet az,
hogyan gondolkodott a tanuló, és mit érdemes utána gyakorolnia."

## 3:50–4:35 — 5. lépés: Kritikus pont — kitekintés

**Felület:** `/szituacio/muvelet-kritikus-pont`

Nyisd meg a záró komplex szituáció Helyzet képernyőjét. Mutasd meg az irányítótermi hero képet és a
"Záró komplex szituáció" jelzést a `closingNote` szöveggel: itt nincs egyetlen izolált készség, a
korábbi modulok kompetenciáit egyszerre kell alkalmazni. Nem kell végigjátszani — a lényeg a
narratív súlypont bemutatása.

## 4:35–5:15 — 6. lépés: Oktatói nézet

**Felület:** `/oktato`

Zárd a bemutatót az oktatói analitikával. A hangsúly nem a diagramok száma, hanem hogy az oktató
**címkézett mintázat-insightokat** lát (Gyakori döntési hiba, Nehéz kompetencia, Szituációs
mintázat, Fejlődési trend) — nem csak azt, hány pontot ért el a csoport, hanem azt is, milyen döntési
mintázatokban bizonytalan.

*Záró mondat:* "Ez különbözteti meg egy hagyományos kvíz-statisztikától: nem csak azt méri, hányan
válaszoltak jól, hanem azt is, hol és hogyan bizonytalanodnak el a döntéshozatalban."

---

## Amit tudatosan nem mondunk

- Nem állítunk igazolatlan, konkrét hatékonysági számokat (pl. "X%-kal javítja a döntéshozatalt") —
  a rendszer jelenleg demonstrációs mock adatokkal működik, ezt a felület is jelzi (`InsightList`,
  `AdaptiveRecommendation` láblécszövegei).
- Nem állítjuk, hogy a képek valódi büntetés-végrehajtási létesítményeket mutatnak — AI-generált,
  demonstrációs illusztrációk (lásd `docs/visual-system.md` 9. pont).
- Nem hivatkozunk konkrét, nem létező BV-szabályzatra vagy belső eljárásrendre.
