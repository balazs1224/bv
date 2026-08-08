import type { ReactNode } from "react";
import type { RiskDimensionKey, RiskLevel, Scenario, Stage, TimelineEvent } from "@/lib/types";
import { ScenarioHeader } from "@/components/scenario/scenario-header";
import { SceneViewport } from "@/components/scenario/scene-viewport";
import { RiskProfile } from "@/components/scenario/risk-profile";
import { IncidentTimeline } from "@/components/scenario/incident-timeline";

function shouldRenderScene(stage: Stage) {
  if (stage.sceneVisual === "none") return false;
  if (stage.type === "result") return false;
  if (stage.type === "brief" || stage.type === "awareness-map") return false;
  return true;
}

export function ScenarioShell({
  scenario,
  stage,
  currentTime,
  isComplete,
  xp,
  stageIndex,
  stageCount,
  risk,
  riskChangedFrom,
  timelineEvents,
  timelineRevealCount,
  children,
}: {
  scenario: Scenario;
  stage: Stage;
  currentTime: string;
  isComplete: boolean;
  xp: number;
  stageIndex: number;
  stageCount: number;
  risk: Record<RiskDimensionKey, RiskLevel>;
  riskChangedFrom?: Partial<Record<RiskDimensionKey, RiskLevel>>;
  timelineEvents: TimelineEvent[];
  timelineRevealCount: number;
  children: ReactNode;
}) {
  const renderScene = shouldRenderScene(stage);
  const fullWidthStage = stage.type === "brief" || stage.type === "awareness-map" || stage.type === "result";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScenarioHeader
        scenario={scenario}
        currentTime={currentTime}
        isComplete={isComplete}
        xp={xp}
        stageIndex={stageIndex}
        stageCount={stageCount}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {fullWidthStage ? (
          <div className="min-h-[420px] flex-1">{children}</div>
        ) : renderScene ? (
          <div className="grid flex-1 gap-4 lg:grid-cols-2 lg:items-stretch">
            <SceneViewport scenario={scenario} stage={stage} currentTime={currentTime} />
            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          <div className="min-h-[420px] flex-1">{children}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <RiskProfile risk={risk} changedFrom={riskChangedFrom} />
          <IncidentTimeline events={timelineEvents} revealedCount={timelineRevealCount} />
        </div>
      </div>
    </div>
  );
}
