import type { Scenario, ScenarioImage, Stage } from "@/lib/types";

/**
 * Meghatározza az adott stage vizuális kontextusát.
 *
 * Alaplogika:
 * - result: nincs scene, teljes szélességű reflexió
 * - awareness-map: a dedikált awareness kép
 * - awareness utáni stage-ek: a helyszíni awareness kép marad
 * - awareness előtti stage-ek: hero
 *
 * A Stage.sceneVisual mezővel mindez explicit felülírható.
 */
export function resolveStageSceneImage(scenario: Scenario, stage: Stage): ScenarioImage | undefined {
  const mode = stage.sceneVisual ?? "inherit";

  if (mode === "none") return undefined;
  if (mode === "awareness") return scenario.visual?.awareness ?? scenario.visual?.hero;
  if (mode === "hero") return scenario.visual?.hero;

  if (stage.type === "result") return undefined;
  if (stage.type === "awareness-map") return scenario.visual?.awareness ?? scenario.visual?.hero;

  const currentIndex = scenario.stages.findIndex((candidate) => candidate.id === stage.id);
  const awarenessIndex = scenario.stages.findIndex((candidate) => candidate.type === "awareness-map");

  if (scenario.visual?.awareness && awarenessIndex >= 0 && currentIndex > awarenessIndex) {
    return scenario.visual.awareness;
  }

  return scenario.visual?.hero;
}
