import type { CompetencyKey, CompetencyMeta, RiskDimensionKey, RiskDimensionMeta } from "@/lib/types";

export const COMPETENCIES: Record<CompetencyKey, CompetencyMeta> = {
  helyzetfelismeres: {
    key: "helyzetfelismeres",
    label: "Helyzetfelismerés",
    shortLabel: "Felismerés",
    description: "A releváns jelek, kockázati tényezők és környezeti információk gyors, pontos azonosítása.",
  },
  kockazatertekeles: {
    key: "kockazatertekeles",
    label: "Kockázatértékelés",
    shortLabel: "Kockázat",
    description: "A rendelkezésre álló információk alapján reális, arányos kockázatbecslés.",
  },
  konfliktuskezeles: {
    key: "konfliktuskezeles",
    label: "Konfliktuskezelés",
    shortLabel: "Konfliktus",
    description: "Feszült helyzetek szakszerű, arányos és jogszerű kezelése.",
  },
  kommunikacio: {
    key: "kommunikacio",
    label: "Kommunikáció",
    shortLabel: "Kommunikáció",
    description: "Világos, nyugodt és kontrollált kommunikáció szolgálati helyzetekben.",
  },
  deeszkalacio: {
    key: "deeszkalacio",
    label: "Deeszkaláció",
    shortLabel: "Deeszkaláció",
    description: "A feszültség csökkentése, a helyzet stabilizálása erőszak nélkül.",
  },
  informaciogyujtes: {
    key: "informaciogyujtes",
    label: "Információgyűjtés",
    shortLabel: "Infógyűjtés",
    description: "Releváns információk célzott, rendszerezett összegyűjtése döntés előtt.",
  },
  egyuttmukodes: {
    key: "egyuttmukodes",
    label: "Szolgálati együttműködés",
    shortLabel: "Együttműk.",
    description: "Kollégák, ügyeletes és vezetői lánc bevonása a megfelelő időpontban.",
  },
  dokumentacio: {
    key: "dokumentacio",
    label: "Dokumentációs pontosság",
    shortLabel: "Dokumentáció",
    description: "Az esemény és a meghozott intézkedések pontos, visszakereshető rögzítése.",
  },
};

export const COMPETENCY_ORDER: CompetencyKey[] = [
  "helyzetfelismeres",
  "kockazatertekeles",
  "konfliktuskezeles",
  "kommunikacio",
  "deeszkalacio",
  "informaciogyujtes",
  "egyuttmukodes",
  "dokumentacio",
];

export const RISK_DIMENSIONS: Record<RiskDimensionKey, RiskDimensionMeta> = {
  szemelyi: {
    key: "szemelyi",
    label: "Személyi kockázat",
    description: "Az érintett személyek testi épségét, biztonságát fenyegető tényezők.",
  },
  kornyezeti: {
    key: "kornyezeti",
    label: "Környezeti kockázat",
    description: "A helyszín adottságaiból eredő kockázatok (zsúfoltság, rálátás, tárgyak).",
  },
  eszkalacios: {
    key: "eszkalacios",
    label: "Eszkalációs kockázat",
    description: "A helyzet elfajulásának valószínűsége a jelenlegi dinamika alapján.",
  },
  informaciohiany: {
    key: "informaciohiany",
    label: "Információhiány",
    description: "Mennyire hiányos a döntéshez szükséges kép a helyzetről.",
  },
  eroforrasigeny: {
    key: "eroforrasigeny",
    label: "Erőforrásigény",
    description: "Szükséges-e további személyzet, támogatás vagy speciális intézkedés.",
  },
};

export const RISK_DIMENSION_ORDER: RiskDimensionKey[] = [
  "szemelyi",
  "kornyezeti",
  "eszkalacios",
  "informaciohiany",
  "eroforrasigeny",
];
