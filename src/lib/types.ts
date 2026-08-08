// Központi domain modell a Biztonsági Döntéstár szituációs motorjához.
// Backend/LMS integrációra tervezve: minden entitás sík, szerializálható adatstruktúra.

export type CompetencyKey =
  | "helyzetfelismeres"
  | "kockazatertekeles"
  | "konfliktuskezeles"
  | "kommunikacio"
  | "deeszkalacio"
  | "informaciogyujtes"
  | "egyuttmukodes"
  | "dokumentacio";

export interface CompetencyMeta {
  key: CompetencyKey;
  label: string;
  shortLabel: string;
  description: string;
}

export type RiskLevel = "alacsony" | "kozepes" | "magas";

export type RiskDimensionKey =
  | "szemelyi"
  | "kornyezeti"
  | "eszkalacios"
  | "informaciohiany"
  | "eroforrasigeny";

export interface RiskDimensionMeta {
  key: RiskDimensionKey;
  label: string;
  description: string;
}

export type Difficulty = "kezdo" | "kozepes" | "halado";

export type DecisionQuality = "kivalo" | "megfelelo" | "gyenge" | "nem_megfelelo";

export interface DecisionOption {
  id: string;
  label: string; // "A", "B", "C", "D"
  text: string;
  quality: DecisionQuality;
  xp: number;
  rationale: string; // "Miért?"
  risksReduced: string[]; // "Milyen kockázatot csökkentettél?"
  competencyImpact: Partial<Record<CompetencyKey, number>>;
  primaryCompetency: CompetencyKey;
  takeaway: string; // "Mit jegyezz meg ebből?"
  riskChanges?: Partial<Record<RiskDimensionKey, RiskLevel>>;
}

export interface ObservationItem {
  id: string;
  label: string;
  critical: boolean;
  description: string;
}

export type HotspotType = "point" | "area";

export interface AwarenessMarker {
  id: string;
  /** "point": x/y a jelölő középpontja. "area": x/y a bal felső sarok, width/height is kötelező. Mindegyik érték a kép tényleges megjelenített területéhez viszonyított %. */
  type?: HotspotType; // alapértelmezett: "point" (visszafelé kompatibilis a korábbi adatokkal)
  x: number;
  y: number;
  width?: number; // csak "area" típusnál, %
  height?: number; // csak "area" típusnál, %
  category: "szemely" | "tavolsag" | "targy" | "tanu" | "kijarat" | "kamera";
  label: string;
  correct: boolean;
  note: string;
  /** Ha true, a kalibrálás vizuálisan még nem lett véglegesítve — lásd docs/visual-system.md. */
  needsCalibration?: boolean;
}

export interface CommunicationChoice {
  id: string;
  label: string;
  text: string;
  tone: "professzionalis" | "konfrontativ" | "bizonytalan" | "tavolsagtarto";
  scores: {
    hangnem: number;
    vilagossag: number;
    kontroll: number;
    eszkalacio: number; // alacsonyabb = jobb
    informacioszerzes: number;
  };
  feedback: string;
}

export type StageType =
  | "brief"
  | "observation"
  | "decision"
  | "communication"
  | "awareness-map"
  | "result";

export interface Stage {
  id: string;
  type: StageType;
  title: string;
  time?: string;
  narrative?: string;
  observations?: ObservationItem[];
  question?: string;
  helperText?: string;
  options?: DecisionOption[];
  communicationChoices?: CommunicationChoice[];
  awarenessMarkers?: AwarenessMarker[];
  competencyFocus?: CompetencyKey[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
}

export interface ScenarioImage {
  src: string;
  alt: string;
  /** CSS object-position, ha a képet nem középre kell igazítani a konténerben. */
  objectPosition?: string;
  /** A forrásfájl tényleges felbontása — az aspect-ratio konténer ebből számol, hogy a hotspot % soha ne csússzon el. */
  width: number;
  height: number;
}

export interface ScenarioVisual {
  /** Kontextusteremtő scene/hero kép — az első (brief) stage-en és kártya-thumbnailként jelenik meg. */
  hero?: ScenarioImage;
  /** Ténylegesen vizsgálandó, hotspotokkal ellátott megfigyelési kép az awareness-map stage-hez. */
  awareness?: ScenarioImage;
}

export interface ScenarioSummary {
  id: string;
  code: string;
  title: string;
  location: string;
  time: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  /**
   * Fejlesztett kompetenciák. Konvenció: a [0] index az ELSŐDLEGES kompetencia,
   * a többi a MÁSODLAGOS kompetenciák listája (lásd SituationBrief / ResultScreen).
   */
  competencies: CompetencyKey[];
  decisionPoints: number;
  status: "uj" | "folyamatban" | "teljesitve" | "ajanlott";
  completion?: number;
}

export interface Scenario extends ScenarioSummary {
  category: string;
  context: string;
  initialRisk: Record<RiskDimensionKey, RiskLevel>;
  stages: Stage[];
  timeline: TimelineEvent[];
  strengths?: string;
  growthArea?: string;
  nextModule?: string;
  visual?: ScenarioVisual;
  /**
   * Opcionális, szituáció-specifikus munkafolyamat-lánc (pl. ESET 22:
   * TÉNY → FORRÁS → IDŐREND → INTÉZKEDÉS → DOKUMENTÁCIÓ), a SituationBrief-en jelenik meg.
   */
  processChain?: string[];
  /** Opcionális záró megjegyzés a komplex, több kompetenciát mozgósító gyakorlatokhoz (pl. Kritikus pont). */
  closingNote?: string;
}

export interface TrainingModule {
  id: string;
  index: string; // "01"
  title: string;
  description: string;
  progress: number;
  estimatedTime: string;
  difficulty: Difficulty;
  competency: CompetencyKey;
  status: "nincs_elkezdve" | "folyamatban" | "teljesitve" | "zarolt";
  /** Opcionális: hol/mikor hasznosul a modul a szolgálati gyakorlatban ("Hol használod?"). */
  appliesTo?: string;
}

export interface MicroExercise {
  id: string;
  question: string;
  competency: CompetencyKey;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

export interface LearnerProfile {
  name: string;
  rank: string;
  level: string;
  levelNumber: number;
  completionRate: number;
  trainingTimeLabel: string;
  streakDays: number;
  competencies: Record<CompetencyKey, number>;
  xp: number;
  xpToNextLevel: number;
}
