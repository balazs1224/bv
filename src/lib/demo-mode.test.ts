import { describe, expect, it } from "vitest";
import { DEMO_STEPS } from "@/lib/demo-mode-context";
import { getScenarioById } from "@/lib/data/scenarios";

describe("guided demo metadata", () => {
  it("contains six intentional presentation chapters", () => {
    expect(DEMO_STEPS).toHaveLength(6);
  });

  it("every scenario/stage target points to a real scenario stage", () => {
    for (const step of DEMO_STEPS) {
      if (!step.scenarioId) continue;
      const scenario = getScenarioById(step.scenarioId);
      expect(scenario, `Missing demo scenario: ${step.scenarioId}`).toBeDefined();
      if (step.stageId) {
        expect(
          scenario?.stages.some((stage) => stage.id === step.stageId),
          `Missing demo stage: ${step.scenarioId}/${step.stageId}`
        ).toBe(true);
      }
    }
  });

  it("separates ESET 07 awareness and result into two guided demo steps", () => {
    const eset07 = DEMO_STEPS.filter((step) => step.scenarioId === "eset-07");
    expect(eset07.map((step) => step.stageId)).toEqual(["awareness", "result"]);
  });

  it("opens Kritikus pont at its control-room brief", () => {
    const critical = DEMO_STEPS.find((step) => step.scenarioId === "muvelet-kritikus-pont");
    expect(critical?.stageId).toBe("brief");
  });
});
