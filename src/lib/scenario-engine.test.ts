import { describe, expect, it } from "vitest";
import {
  applyRiskChanges,
  formatSigned,
  getRemainingRisk,
  scoreCommunicationChoice,
  scoreToQuality,
  summarizeRun,
  type DecisionLogEntry,
} from "@/lib/scenario-engine";
import type { CommunicationChoice, RiskDimensionKey, RiskLevel, Scenario } from "@/lib/types";

const BASE_RISK: Record<RiskDimensionKey, RiskLevel> = {
  szemelyi: "kozepes",
  kornyezeti: "magas",
  eszkalacios: "kozepes",
  informaciohiany: "alacsony",
  eroforrasigeny: "alacsony",
};

describe("applyRiskChanges", () => {
  it("merges partial risk changes onto the current state", () => {
    const next = applyRiskChanges(BASE_RISK, { szemelyi: "alacsony" });
    expect(next.szemelyi).toBe("alacsony");
    expect(next.kornyezeti).toBe("magas");
  });

  it("returns the same state when there are no changes", () => {
    expect(applyRiskChanges(BASE_RISK, undefined)).toBe(BASE_RISK);
  });
});

describe("getRemainingRisk", () => {
  it("lists only the dimensions still at kozepes or magas", () => {
    const remaining = getRemainingRisk(BASE_RISK);
    expect(remaining).toEqual(["szemelyi", "kornyezeti", "eszkalacios"]);
  });

  it("returns an empty list when every dimension is alacsony", () => {
    const allLow: Record<RiskDimensionKey, RiskLevel> = {
      szemelyi: "alacsony",
      kornyezeti: "alacsony",
      eszkalacios: "alacsony",
      informaciohiany: "alacsony",
      eroforrasigeny: "alacsony",
    };
    expect(getRemainingRisk(allLow)).toEqual([]);
  });
});

describe("scoreToQuality", () => {
  it("buckets scores into the four quality tiers", () => {
    expect(scoreToQuality(85)).toBe("kivalo");
    expect(scoreToQuality(65)).toBe("megfelelo");
    expect(scoreToQuality(45)).toBe("gyenge");
    expect(scoreToQuality(10)).toBe("nem_megfelelo");
  });
});

describe("formatSigned", () => {
  it("prefixes non-negative numbers with a plus sign", () => {
    expect(formatSigned(5)).toBe("+5");
    expect(formatSigned(0)).toBe("+0");
    expect(formatSigned(-3)).toBe("-3");
  });
});

describe("summarizeRun", () => {
  const scenario = { id: "s1" } as Scenario;

  it("aggregates xp, good-decision count and competency deltas across the log", () => {
    const log: DecisionLogEntry[] = [
      { stageId: "a", quality: "kivalo", xp: 100, competencyImpact: { helyzetfelismeres: 8 } },
      { stageId: "b", quality: "gyenge", xp: 10, competencyImpact: { helyzetfelismeres: -2, kommunikacio: 3 } },
      { stageId: "c", quality: "megfelelo", xp: 40, competencyImpact: {} },
    ];
    const summary = summarizeRun(scenario, log);
    expect(summary.xpTotal).toBe(150);
    expect(summary.goodCount).toBe(2);
    expect(summary.totalCount).toBe(3);
    expect(summary.scorePercent).toBe(67);
    expect(summary.competencyDeltas).toEqual({ helyzetfelismeres: 6, kommunikacio: 3 });
  });

  it("does not divide by zero when the log is empty", () => {
    const summary = summarizeRun(scenario, []);
    expect(summary.scorePercent).toBe(0);
    expect(summary.totalCount).toBe(0);
  });
});

describe("scoreCommunicationChoice", () => {
  it("rewards a calm, low-escalation, high-clarity choice", () => {
    const calm: CommunicationChoice = {
      id: "c1",
      label: "Nyugodt",
      text: "Kérdés",
      tone: "professzionalis",
      scores: { hangnem: 90, vilagossag: 85, kontroll: 88, eszkalacio: 12, informacioszerzes: 90 },
      feedback: "",
    };
    const result = scoreCommunicationChoice(calm);
    expect(result.quality).toBe("kivalo");
    expect(result.competencyImpact.deeszkalacio).toBeGreaterThan(0);
  });

  it("penalizes a confrontational, high-escalation choice", () => {
    const confrontational: CommunicationChoice = {
      id: "c2",
      label: "Vádló",
      text: "Felszólítás",
      tone: "konfrontativ",
      scores: { hangnem: 25, vilagossag: 55, kontroll: 40, eszkalacio: 75, informacioszerzes: 25 },
      feedback: "",
    };
    const result = scoreCommunicationChoice(confrontational);
    expect(result.quality === "gyenge" || result.quality === "nem_megfelelo").toBe(true);
    expect(result.competencyImpact.deeszkalacio).toBeLessThan(0);
  });
});
