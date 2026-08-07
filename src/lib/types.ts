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

export interface AwarenessMarker {
  id: string;
  x: number; // % a stilizált alaprajzon
  y: number;
  category: "szemely" | "tavolsag" | "targy" | "tanu" | "kijarat" | "kamera";
  label: string;
  correct: boolean;
  note: string;
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

export interface ScenarioSummary {
  id: string;
  code: string;
  title: string;
  location: string;
  time: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
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
