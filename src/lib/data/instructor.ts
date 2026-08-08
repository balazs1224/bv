import type { CompetencyKey } from "@/lib/types";

export interface InstructorKpi {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}

export const INSTRUCTOR_KPIS: InstructorKpi[] = [
  { label: "Aktív tanulók", value: "184", delta: "+12 az elmúlt hónapban", trend: "up" },
  { label: "Képzés befejezési arány", value: "68%", delta: "+5% az előző ciklushoz képest", trend: "up" },
  { label: "Átlagos kompetenciaszint", value: "74%", delta: "+3% az elmúlt 30 napban", trend: "up" },
  { label: "Problémás kompetencia", value: "Dokumentáció", delta: "Átlag: 61%", trend: "down" },
];

export type InsightCategory =
  | "gyakori_dontesi_hiba"
  | "nehez_kompetencia"
  | "szituacios_mintazat"
  | "fejlodesi_trend";

export const INSIGHT_CATEGORY_LABEL: Record<InsightCategory, string> = {
  gyakori_dontesi_hiba: "Gyakori döntési hiba",
  nehez_kompetencia: "Nehéz kompetencia",
  szituacios_mintazat: "Szituációs mintázat",
  fejlodesi_trend: "Fejlődési trend",
};

export interface InsightItem {
  id: string;
  category: InsightCategory;
  text: string;
  tone: "info" | "warning" | "positive";
}

export const INSTRUCTOR_INSIGHTS: InsightItem[] = [
  {
    id: "i1",
    category: "gyakori_dontesi_hiba",
    text: "A tanulók 37%-a túl korán hozott döntést megfelelő helyzetértékelés nélkül.",
    tone: "warning",
  },
  {
    id: "i2",
    category: "fejlodesi_trend",
    text: "A kommunikációs kompetencia átlagosan 14%-kal javult három gyakorlás után.",
    tone: "positive",
  },
  {
    id: "i3",
    category: "nehez_kompetencia",
    text: "Az Új belépők csoportban a dokumentációs pontosság 22%-kal elmarad az átlagtól.",
    tone: "warning",
  },
  {
    id: "i4",
    category: "fejlodesi_trend",
    text: "A deeszkalációs modult elvégzők eszkalációs kockázati döntései 18%-kal ritkábban minősülnek gyengének.",
    tone: "positive",
  },
  {
    id: "i5",
    category: "szituacios_mintazat",
    text: "A záró komplex szituációt eddig a tanulók 41%-a kísérelte meg, átlagosan 79%-os teljesítménnyel.",
    tone: "info",
  },
];

export interface ScenarioResultRow {
  scenario: string;
  attempts: number;
  avgScore: number;
  avgTime: string;
  mostCommonMistake: string;
}

export const SCENARIO_RESULTS: ScenarioResultRow[] = [
  {
    scenario: "Feszültség egy zárkakörleten",
    attempts: 176,
    avgScore: 81,
    avgTime: "11 perc",
    mostCommonMistake: "Azonnali konfrontáció helyzetértékelés nélkül",
  },
  {
    scenario: "Reggeli ellenőrzés során eltérés észlelhető",
    attempts: 162,
    avgScore: 88,
    avgTime: "7 perc",
    mostCommonMistake: "Az eltérés dokumentálásának elmaradása",
  },
  {
    scenario: "Két fogvatartott között fokozódó konfliktus",
    attempts: 140,
    avgScore: 74,
    avgTime: "13 perc",
    mostCommonMistake: "Önálló beavatkozás támogatás bevonása előtt",
  },
  {
    scenario: "Újonnan befogadott személy fokozott feszültséget mutat",
    attempts: 121,
    avgScore: 79,
    avgTime: "9 perc",
    mostCommonMistake: "Túl gyors kérdezési tempó feszült állapotnál",
  },
  {
    scenario: "Művelet: Kritikus pont",
    attempts: 76,
    avgScore: 71,
    avgTime: "24 perc",
    mostCommonMistake: "Párhuzamos jelzések nem megfelelő priorizálása",
  },
];

export type GroupKey = "csoport_a" | "csoport_b" | "uj_belepok" | "halado_kepzes";

export interface GroupMeta {
  key: GroupKey;
  label: string;
  learnerCount: number;
}

export const GROUPS: GroupMeta[] = [
  { key: "csoport_a", label: "Állománycsoport A", learnerCount: 48 },
  { key: "csoport_b", label: "Állománycsoport B", learnerCount: 52 },
  { key: "uj_belepok", label: "Új belépők", learnerCount: 36 },
  { key: "halado_kepzes", label: "Haladó képzés", learnerCount: 48 },
];

// Heatmap: kompetencia x csoport, 0-100
export const COMPETENCY_HEATMAP: Record<CompetencyKey, Record<GroupKey, number>> = {
  helyzetfelismeres: { csoport_a: 82, csoport_b: 76, uj_belepok: 58, halado_kepzes: 91 },
  kockazatertekeles: { csoport_a: 74, csoport_b: 71, uj_belepok: 52, halado_kepzes: 87 },
  konfliktuskezeles: { csoport_a: 69, csoport_b: 73, uj_belepok: 49, halado_kepzes: 84 },
  kommunikacio: { csoport_a: 80, csoport_b: 78, uj_belepok: 61, halado_kepzes: 89 },
  deeszkalacio: { csoport_a: 66, csoport_b: 70, uj_belepok: 47, halado_kepzes: 81 },
  informaciogyujtes: { csoport_a: 60, csoport_b: 58, uj_belepok: 41, halado_kepzes: 77 },
  egyuttmukodes: { csoport_a: 75, csoport_b: 79, uj_belepok: 55, halado_kepzes: 85 },
  dokumentacio: { csoport_a: 61, csoport_b: 57, uj_belepok: 39, halado_kepzes: 73 },
};

export type CompetencyRiskStatus = "jo" | "figyelmet_igenyel" | "fejlesztendo";

export interface CompetencyRiskRow {
  key: CompetencyKey;
  average: number;
  status: CompetencyRiskStatus;
}

const GROUP_KEYS: GroupKey[] = ["csoport_a", "csoport_b", "uj_belepok", "halado_kepzes"];

function statusFor(avg: number): CompetencyRiskStatus {
  if (avg >= 75) return "jo";
  if (avg >= 60) return "figyelmet_igenyel";
  return "fejlesztendo";
}

export const COMPETENCY_RISK: CompetencyRiskRow[] = (Object.keys(COMPETENCY_HEATMAP) as CompetencyKey[]).map(
  (key) => {
    const values = GROUP_KEYS.map((g) => COMPETENCY_HEATMAP[key][g]);
    const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return { key, average, status: statusFor(average) };
  }
);

export interface GroupComparisonRow {
  group: string;
  completion: number;
  avgCompetency: number;
  avgSessionTime: string;
}

export const GROUP_COMPARISON: GroupComparisonRow[] = [
  { group: "Állománycsoport A", completion: 74, avgCompetency: 72, avgSessionTime: "18 perc" },
  { group: "Állománycsoport B", completion: 69, avgCompetency: 74, avgSessionTime: "21 perc" },
  { group: "Új belépők", completion: 52, avgCompetency: 51, avgSessionTime: "26 perc" },
  { group: "Haladó képzés", completion: 91, avgCompetency: 84, avgSessionTime: "15 perc" },
];
