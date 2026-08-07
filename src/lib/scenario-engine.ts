import type {
  CommunicationChoice,
  CompetencyKey,
  DecisionQuality,
  RiskDimensionKey,
  RiskLevel,
  Scenario,
} from "@/lib/types";

export const QUALITY_META: Record<
  DecisionQuality,
  { label: string; tone: "success" | "primary" | "warning" | "critical" }
> = {
  kivalo: { label: "Megfontolt, szakszerű döntés", tone: "success" },
  megfelelo: { label: "Megfelelő döntés", tone: "primary" },
  gyenge: { label: "Fejlesztendő döntés", tone: "warning" },
  nem_megfelelo: { label: "Nem megfelelő döntés", tone: "critical" },
};

export function applyRiskChanges(
  current: Record<RiskDimensionKey, RiskLevel>,
  changes?: Partial<Record<RiskDimensionKey, RiskLevel>>
): Record<RiskDimensionKey, RiskLevel> {
  if (!changes) return current;
  return { ...current, ...changes };
}

export interface DecisionLogEntry {
  stageId: string;
  quality: DecisionQuality;
  xp: number;
  competencyImpact: Partial<Record<CompetencyKey, number>>;
}

export function summarizeRun(scenario: Scenario, log: DecisionLogEntry[]) {
  const xpTotal = log.reduce((sum, e) => sum + e.xp, 0);
  const goodCount = log.filter((e) => e.quality === "kivalo" || e.quality === "megfelelo").length;
  const totalCount = log.length;
  const scorePercent = totalCount === 0 ? 0 : Math.round((goodCount / totalCount) * 100);

  const competencyDeltas: Partial<Record<CompetencyKey, number>> = {};
  for (const entry of log) {
    for (const [key, delta] of Object.entries(entry.competencyImpact) as [CompetencyKey, number][]) {
      competencyDeltas[key] = (competencyDeltas[key] ?? 0) + delta;
    }
  }

  return { xpTotal, goodCount, totalCount, scorePercent, competencyDeltas };
}

export function formatSigned(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function scoreToQuality(score: number): DecisionQuality {
  if (score >= 80) return "kivalo";
  if (score >= 60) return "megfelelo";
  if (score >= 40) return "gyenge";
  return "nem_megfelelo";
}

export interface CommunicationScoreResult {
  overallScore: number;
  quality: DecisionQuality;
  xp: number;
  competencyImpact: Partial<Record<CompetencyKey, number>>;
}

export function scoreCommunicationChoice(choice: CommunicationChoice): CommunicationScoreResult {
  const { hangnem, vilagossag, kontroll, eszkalacio, informacioszerzes } = choice.scores;
  const deescalationScore = 100 - eszkalacio;
  const overallScore = Math.round(
    (hangnem + vilagossag + kontroll + deescalationScore + informacioszerzes) / 5
  );
  const quality = scoreToQuality(overallScore);
  const xp = Math.max(15, Math.round(overallScore * 1.25));
  const kommunikaciDelta = Math.round(((hangnem + vilagossag + kontroll) / 3 - 50) / 6);
  const deeszkalacioDelta = Math.round((deescalationScore - 50) / 6);
  return {
    overallScore,
    quality,
    xp,
    competencyImpact: {
      kommunikacio: kommunikaciDelta,
      deeszkalacio: deeszkalacioDelta,
    },
  };
}
