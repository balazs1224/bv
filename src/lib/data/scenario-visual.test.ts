import { describe, expect, it } from "vitest";
import { ALL_SCENARIOS, getScenarioById } from "@/lib/data/scenarios";

describe("scenario visual mapping", () => {
  it("gives every scenario a hero image with valid dimensions", () => {
    expect(ALL_SCENARIOS.length).toBeGreaterThan(0);
    for (const scenario of ALL_SCENARIOS) {
      expect(scenario.visual?.hero, `${scenario.id} missing hero image`).toBeDefined();
      const hero = scenario.visual!.hero!;
      expect(hero.src).toMatch(/^\/scenarios\/.+\.webp$/);
      expect(hero.alt.length).toBeGreaterThan(10);
      expect(hero.width).toBeGreaterThan(0);
      expect(hero.height).toBeGreaterThan(0);
    }
  });

  it("only gives an awareness image to scenarios with an awareness-map stage", () => {
    for (const scenario of ALL_SCENARIOS) {
      const hasAwarenessStage = scenario.stages.some((s) => s.type === "awareness-map");
      const hasAwarenessImage = Boolean(scenario.visual?.awareness);
      expect(hasAwarenessImage, `${scenario.id} awareness image/stage mismatch`).toBe(hasAwarenessStage);
    }
  });

  it("gives ESET 07 and the closing scenario a calibrated awareness image", () => {
    const eset07 = getScenarioById("eset-07");
    const kritikusPont = getScenarioById("muvelet-kritikus-pont");
    expect(eset07?.visual?.awareness?.src).toBe("/scenarios/eset-07/awareness.webp");
    expect(kritikusPont?.visual?.awareness?.src).toBe("/scenarios/kritikus-pont/awareness.webp");
  });

  it("keeps awareness marker alt text generic enough to not spoil the task", () => {
    const eset07 = getScenarioById("eset-07");
    const alt = eset07?.visual?.awareness?.alt ?? "";
    for (const marker of eset07?.stages.find((s) => s.type === "awareness-map")?.awarenessMarkers ?? []) {
      expect(alt).not.toContain(marker.label);
    }
  });

  it("resolves an unknown scenario id to undefined", () => {
    expect(getScenarioById("nincs-ilyen")).toBeUndefined();
  });
});
