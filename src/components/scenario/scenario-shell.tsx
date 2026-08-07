import type { ReactNode } from "react";
import type { RiskDimensionKey, RiskLevel, Scenario, TimelineEvent } from "@/lib/types";
import { ScenarioHeader } from "@/components/scenario/scenario-header";
import { SceneViewport } from "@/components/scenario/scene-viewport";
import { RiskProfile } from "@/components/scenario/risk-profile";
import { IncidentTimeline } from "@/components/scenario/incident-timeline";

export function ScenarioShell({
  scenario,
  currentTime,
  isComplete,
  xp,
  stageIndex,
  stageCount,
  risk,
  riskChangedFrom,
  timelineEvents,
  timelineRevealCount,
  mergeScene = false,
  children,
}: {
  scenario: Scenario;
  currentTime: string;
  isComplete: boolean;
  xp: number;
  stageIndex: number;
  stageCount: number;
  risk: Record<RiskDimensionKey, RiskLevel>;
  riskChangedFrom?: Partial<Record<RiskDimensionKey, RiskLevel>>;
  timelineEvents: TimelineEvent[];
  timelineRevealCount: number;
  mergeScene?: boolean;
  children: ReactNode;
}) {
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
        {mergeScene ? (
          <div className="min-h-[420px] flex-1">{children}</div>
        ) : (
          <div className="grid flex-1 gap-4 lg:grid-cols-2 lg:items-stretch">
            <SceneViewport scenario={scenario} currentTime={currentTime} />
            <div className="min-w-0">{children}</div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <RiskProfile risk={risk} changedFrom={riskChangedFrom} />
          <IncidentTimeline events={timelineEvents} revealedCount={timelineRevealCount} />
        </div>
      </div>
    </div>
  );
}
