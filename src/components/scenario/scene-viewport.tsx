import type { Scenario, Stage } from "@/lib/types";
import { CorridorIllustration } from "@/components/shared/corridor-illustration";
import { ScenarioImageFrame } from "@/components/shared/scenario-image";
import { resolveStageSceneImage } from "@/lib/scene-visual";

export function SceneViewport({
  scenario,
  stage,
  currentTime,
}: {
  scenario: Scenario;
  stage: Stage;
  currentTime: string;
}) {
  const image = resolveStageSceneImage(scenario, stage);

  return (
    <div className="relative min-h-[280px] overflow-hidden border border-hairline bg-surface lg:min-h-full">
      {image ? (
        <ScenarioImageFrame
          image={image}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full"
          fallbackLabel="A helyszíni vizuál jelenleg nem érhető el."
        />
      ) : (
        <CorridorIllustration className="absolute inset-0 h-full w-full" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />

      <div className="pointer-events-none absolute left-4 top-4 space-y-0.5">
        <p className="font-mono text-[11px] tabular-nums text-white/75">{currentTime}:00</p>
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/50">{scenario.location}</p>
      </div>
    </div>
  );
}
