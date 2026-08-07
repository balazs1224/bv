import type { ReactNode } from "react";
import type { RiskDimensionKey, RiskLevel, Scenario, TimelineEvent } from "@/lib/types";
import { ScenarioHeader } from "@/components/scenario/scenario-header";
import { ScenarioProgress } from "@/components/scenario/scenario-progress";
import { RiskMatrix } from "@/components/scenario/risk-matrix";
import { Timeline } from "@/components/scenario/timeline";
import { CorridorIllustration } from "@/components/shared/corridor-illustration";

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
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScenarioHeader scenario={scenario} currentTime={currentTime} isComplete={isComplete} xp={xp} />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <ScenarioProgress total={stageCount} current={stageIndex} className="mb-6" />
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="relative hidden h-32 overflow-hidden rounded-xl border border-border lg:block">
              <CorridorIllustration className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 text-[11px] font-medium uppercase tracking-wide text-white/80">
                {scenario.location}
              </div>
            </div>
            <RiskMatrix risk={risk} changedFrom={riskChangedFrom} />
            <Timeline events={timelineEvents} revealedCount={timelineRevealCount} />
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
