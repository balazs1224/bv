import type { MicroExercise } from "@/lib/types";

export const MICRO_EXERCISES: MicroExercise[] = [
  {
    id: "mi1",
    question: "Mely információk fontosak egy konfliktus kezdeti értékelésekor?",
    competency: "kockazatertekeles",
    options: [
      { id: "a", text: "Csak a hangerő mértéke", correct: false },
      { id: "b", text: "A jelenlévők száma, pozíciója, és a viselkedési jelek együttesen", correct: true },
      { id: "c", text: "Kizárólag az, hogy ki kezdte a szóváltást", correct: false },
    ],
    explanation:
      "A kezdeti értékelés akkor megbízható, ha több tényezőt együttesen vesz figyelembe: kik vannak jelen, hol helyezkednek el, és milyen viselkedési jeleket mutatnak – nem csupán egyetlen, könnyen észlelhető jelet.",
  },
  {
    id: "mi2",
    question: "Felismered az eszkaláció korai jeleit? Melyik az, ami NEM tipikus korai jel?",
    competency: "helyzetfelismeres",
    options: [
      { id: "a", text: "Emelkedő hangerő és feszült testtartás", correct: false },
      { id: "b", text: "Nyugodt, nyitott testbeszéd", correct: true },
      { id: "c", text: "Visszahúzódó vagy kerülő magatartás a környezetben", correct: false },
    ],
    explanation:
      "A nyugodt, nyitott testbeszéd jellemzően a helyzet stabilitására utal, nem az eszkaláció korai jele. A feszült testtartás és a kerülő magatartás ezzel szemben gyakori figyelmeztető jelek.",
  },
  {
    id: "mi3",
    question: "Melyik kommunikációs megközelítés csökkenti leginkább a félreértés kockázatát?",
    competency: "kommunikacio",
    options: [
      { id: "a", text: "Rövid, egyértelmű mondatok, nyugodt hangnemben", correct: true },
      { id: "b", text: "Minél több információ egyszerre, gyors tempóban", correct: false },
      { id: "c", text: "Kizárólag zárt igen/nem kérdések feltevése", correct: false },
    ],
    explanation:
      "A rövid, világos mondatok nyugodt hangnemben egyszerre biztosítják az érthetőséget és a kontroll benyomását, ami csökkenti a félreértés és az eszkaláció esélyét.",
  },
  {
    id: "mi4",
    question: "Mit érdemes dokumentálni egy esemény utóértékeléséhez?",
    competency: "dokumentacio",
    options: [
      { id: "a", text: "Kizárólag a végkimenetelt, részletek nélkül", correct: false },
      { id: "b", text: "Az időrendi lefolyást, a tényeket és a meghozott intézkedéseket, elkülönítve a feltételezésektől", correct: true },
      { id: "c", text: "Csak a saját szubjektív véleményt a történtekről", correct: false },
    ],
    explanation:
      "A pontos, visszakereshető dokumentáció időrendi, tényalapú, és egyértelműen elkülöníti a megfigyelt tényeket a feltételezésektől vagy véleményektől.",
  },
  {
    id: "mi5",
    question: "Mikor érdemes támogatást bevonni egy alakuló konfliktus esetén?",
    competency: "egyuttmukodes",
    options: [
      { id: "a", text: "Csak akkor, ha már fizikai konfliktus történt", correct: false },
      { id: "b", text: "Amint a kockázatértékelés alapján a helyzet ezt indokolja – lehetőleg korán", correct: true },
      { id: "c", text: "Soha, mert az önálló fellépés mindig hatékonyabb", correct: false },
    ],
    explanation:
      "A támogatás korai, arányos bevonása csökkenti a személyi és eszkalációs kockázatot, és nem jelent gyengeséget – a szolgálati együttműködés része.",
  },
];
