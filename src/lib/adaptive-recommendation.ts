// Determinisztikus, szabályalapú ajánlómotor.
// Szándékosan NEM AI/ML — egyszerű küszöbértékek alapján dönt, hogy a rendszer
// viselkedése átlátható és tesztelhető maradjon. Lásd docs/pedagogiai-koncepcio.md.

import type { CompetencyKey } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";

export interface RecommendationResult {
  moduleTitle: string;
  competency: CompetencyKey;
  reason: string;
}

const WEAK_THRESHOLD = 65;

// Kompetencia -> ajánlott modul cím. A sorrend nem számít a kiválasztásban,
// csak azt rendeli hozzá, melyik modul fejleszti elsődlegesen az adott kompetenciát.
const MODULE_FOR_COMPETENCY: Record<CompetencyKey, string> = {
  helyzetfelismeres: "Helyzetfelismerés zárt intézeti környezetben",
  kockazatertekeles: "Dinamikus kockázatértékelés",
  konfliktuskezeles: "Konfliktushelyzetek felismerése",
  kommunikacio: "Professzionális kommunikáció",
  deeszkalacio: "Deeszkalációs alapelvek",
  informaciogyujtes: "Információgyűjtés és jelentés",
  egyuttmukodes: "Csapatmunka és eszkaláció",
  dokumentacio: "Rendkívüli esemény utóértékelése",
};

/**
 * A tanuló teljes kompetenciaprofilja alapján ajánl következő modult:
 * a küszöbérték alatti kompetenciák közül a leggyengébbet választja.
 * Ha minden kompetencia a küszöb felett van, a legalacsonyabbat ajánlja
 * (folyamatos fejlődés elve), nem áll meg ajánlás nélkül.
 */
export function recommendFromLevels(levels: Record<CompetencyKey, number>): RecommendationResult {
  const entries = Object.entries(levels) as [CompetencyKey, number][];
  const belowThreshold = entries.filter(([, value]) => value < WEAK_THRESHOLD);
  const pool = belowThreshold.length > 0 ? belowThreshold : entries;
  const [competency, value] = pool.reduce((min, cur) => (cur[1] < min[1] ? cur : min));

  return {
    moduleTitle: MODULE_FOR_COMPETENCY[competency],
    competency,
    reason:
      belowThreshold.length > 0
        ? `Az eredményeid alapján a(z) „${COMPETENCIES[competency].label}” területen van most a legtöbb fejlődési lehetőség (${value}%).`
        : `A kompetenciáid kiegyenlítettek – a(z) „${COMPETENCIES[competency].label}” áll jelenleg a legalacsonyabban (${value}%), innen érdemes tovább építkezned.`,
  };
}

/**
 * Egy lezárt szituáció kompetenciahatásai (delta) alapján ajánl következő modult:
 * a legnegatívabb (vagy legkevésbé pozitív) hatású kompetenciát választja.
 */
export function recommendFromDeltas(
  deltas: Partial<Record<CompetencyKey, number>>,
  fallbackModuleTitle: string
): RecommendationResult {
  const entries = Object.entries(deltas) as [CompetencyKey, number][];
  if (entries.length === 0) {
    return {
      moduleTitle: fallbackModuleTitle,
      competency: "helyzetfelismeres",
      reason: "Ehhez a szituációhoz még nincs elég döntési adat – folytasd a gyakorlást a képzési tervben.",
    };
  }

  const [competency, value] = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min));

  return {
    moduleTitle: MODULE_FOR_COMPETENCY[competency] ?? fallbackModuleTitle,
    competency,
    reason:
      value < 0
        ? `Ebben a szituációban a(z) „${COMPETENCIES[competency].label}” döntéseid gyengébbre sikerültek (${value}%) – ezt érdemes következőként gyakorolnod.`
        : `A többihez képest a(z) „${COMPETENCIES[competency].label}” fejlődött legkevésbé ebben a szituációban (${value >= 0 ? "+" : ""}${value}%) – ezt érdemes következőként gyakorolnod.`,
  };
}
