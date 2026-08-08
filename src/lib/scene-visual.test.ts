import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_SCENARIOS, ESET_07, MUVELET_KRITIKUS_PONT } from "@/lib/data/scenarios";
import { resolveStageSceneImage } from "@/lib/scene-visual";
import type { Scenario, Stage } from "@/lib/types";

function publicPath(src: string) {
  return join(process.cwd(), "public", src.replace(/^\//, ""));
}

describe("scenario visual assets", () => {
  it("every referenced hero/awareness image exists under public", () => {
    for (const scenario of ALL_SCENARIOS) {
      for (const image of [scenario.visual?.hero, scenario.visual?.awareness]) {
        if (!image) continue;
        expect(existsSync(publicPath(image.src)), `${scenario.id}: missing ${image.src}`).toBe(true);
      }
    }
  });
});

describe("resolveStageSceneImage", () => {
  it("uses hero before awareness and awareness after the field transition in ESET 07", () => {
    const observation = ESET_07.stages.find((stage) => stage.id === "observation")!;
    const awareness = ESET_07.stages.find((stage) => stage.id === "awareness")!;
    const communication = ESET_07.stages.find((stage) => stage.id === "communication")!;
    const result = ESET_07.stages.find((stage) => stage.id === "result")!;

    expect(resolveStageSceneImage(ESET_07, observation)?.src).toBe("/scenarios/eset-07/hero.webp");
    expect(resolveStageSceneImage(ESET_07, awareness)?.src).toBe("/scenarios/eset-07/awareness.webp");
    expect(resolveStageSceneImage(ESET_07, communication)?.src).toBe("/scenarios/eset-07/awareness.webp");
    expect(resolveStageSceneImage(ESET_07, result)).toBeUndefined();
  });

  it("keeps the control-room hero until Kritikus pont reaches the field awareness stage", () => {
    const observation = MUVELET_KRITIKUS_PONT.stages.find((stage) => stage.id === "observation")!;
    const decision1 = MUVELET_KRITIKUS_PONT.stages.find((stage) => stage.id === "decision-1")!;
    const awareness = MUVELET_KRITIKUS_PONT.stages.find((stage) => stage.id === "awareness")!;
    const communication = MUVELET_KRITIKUS_PONT.stages.find((stage) => stage.id === "communication")!;
    const decision2 = MUVELET_KRITIKUS_PONT.stages.find((stage) => stage.id === "decision-2")!;

    expect(resolveStageSceneImage(MUVELET_KRITIKUS_PONT, observation)?.src).toBe(
      "/scenarios/kritikus-pont/hero.webp"
    );
    expect(resolveStageSceneImage(MUVELET_KRITIKUS_PONT, decision1)?.src).toBe(
      "/scenarios/kritikus-pont/hero.webp"
    );
    expect(resolveStageSceneImage(MUVELET_KRITIKUS_PONT, awareness)?.src).toBe(
      "/scenarios/kritikus-pont/awareness.webp"
    );
    expect(resolveStageSceneImage(MUVELET_KRITIKUS_PONT, communication)?.src).toBe(
      "/scenarios/kritikus-pont/awareness.webp"
    );
    expect(resolveStageSceneImage(MUVELET_KRITIKUS_PONT, decision2)?.src).toBe(
      "/scenarios/kritikus-pont/awareness.webp"
    );
  });

  it("honours explicit sceneVisual overrides", () => {
    const scenario = {
      visual: {
        hero: { src: "/hero.webp", alt: "hero", width: 16, height: 9 },
        awareness: { src: "/awareness.webp", alt: "awareness", width: 16, height: 9 },
      },
      stages: [],
    } as unknown as Scenario;

    const heroStage = { id: "h", type: "decision", title: "h", sceneVisual: "hero" } as Stage;
    const awarenessStage = { id: "a", type: "decision", title: "a", sceneVisual: "awareness" } as Stage;
    const noneStage = { id: "n", type: "decision", title: "n", sceneVisual: "none" } as Stage;

    expect(resolveStageSceneImage(scenario, heroStage)?.src).toBe("/hero.webp");
    expect(resolveStageSceneImage(scenario, awarenessStage)?.src).toBe("/awareness.webp");
    expect(resolveStageSceneImage(scenario, noneStage)).toBeUndefined();
  });
});
