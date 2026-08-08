import { describe, expect, it } from "vitest";
import { recommendFromDeltas, recommendFromLevels } from "@/lib/adaptive-recommendation";
import type { CompetencyKey } from "@/lib/types";

const FULL_LEVELS: Record<CompetencyKey, number> = {
  helyzetfelismeres: 84,
  kockazatertekeles: 76,
  konfliktuskezeles: 71,
  kommunikacio: 81,
  deeszkalacio: 69,
  informaciogyujtes: 58,
  egyuttmukodes: 74,
  dokumentacio: 63,
};

describe("recommendFromLevels", () => {
  it("recommends the weakest below-threshold competency", () => {
    const result = recommendFromLevels(FULL_LEVELS);
    expect(result.competency).toBe("informaciogyujtes");
    expect(result.moduleTitle).toBe("Információgyűjtés és jelentés");
    expect(result.reason).toContain("58%");
  });

  it("still returns a recommendation when every competency is above the threshold", () => {
    const strong: Record<CompetencyKey, number> = {
      helyzetfelismeres: 90,
      kockazatertekeles: 88,
      konfliktuskezeles: 85,
      kommunikacio: 92,
      deeszkalacio: 80,
      informaciogyujtes: 75,
      egyuttmukodes: 82,
      dokumentacio: 70,
    };
    const result = recommendFromLevels(strong);
    expect(result.competency).toBe("dokumentacio");
    expect(result.reason).toContain("kiegyenlítettek");
  });
});

describe("recommendFromDeltas", () => {
  it("recommends the competency with the weakest delta in this run", () => {
    const result = recommendFromDeltas(
      { helyzetfelismeres: 8, kockazatertekeles: -3, egyuttmukodes: 5 },
      "Fallback modul"
    );
    expect(result.competency).toBe("kockazatertekeles");
    expect(result.moduleTitle).toBe("Dinamikus kockázatértékelés");
    expect(result.reason).toContain("gyengébbre");
  });

  it("falls back to the scenario's static next module when there is no decision data", () => {
    const result = recommendFromDeltas({}, "Fallback modul");
    expect(result.moduleTitle).toBe("Fallback modul");
  });

  it("never phrases the reasoning as an AI recommendation", () => {
    const result = recommendFromDeltas({ kommunikacio: 2 }, "Fallback modul");
    expect(result.reason.toLowerCase()).not.toContain("ai szerint");
  });
});
