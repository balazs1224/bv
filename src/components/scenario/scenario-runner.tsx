"use client";

import { useMemo, useState } from "react";
import type {
  CommunicationChoice,
  DecisionOption,
  RiskDimensionKey,
  RiskLevel,
  Scenario,
} from "@/lib/types";
import {
  applyRiskChanges,
  scoreCommunicationChoice,
  summarizeRun,
  type DecisionLogEntry,
} from "@/lib/scenario-engine";
import { ScenarioShell } from "@/components/scenario/scenario-shell";
import { SituationBrief } from "@/components/scenario/situation-brief";
import { ObservationPanel } from "@/components/scenario/observation-panel";
import { DecisionCard } from "@/components/scenario/decision-card";
import { CommunicationTask } from "@/components/scenario/communication-task";
import { AwarenessMap } from "@/components/scenario/awareness-map";
import { ResultScreen } from "@/components/scenario/result-screen";

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const stages = scenario.stages;
  const [stageIndex, setStageIndex] = useState(0);
  const [log, setLog] = useState<DecisionLogEntry[]>([]);
  const [risk, setRisk] = useState<Record<RiskDimensionKey, RiskLevel>>(scenario.initialRisk);
  const [riskChangedFrom, setRiskChangedFrom] = useState<Partial<Record<RiskDimensionKey, RiskLevel>>>();
  const [decisionKey, setDecisionKey] = useState(0);

  const stage = stages[stageIndex];
  const isComplete = stage.type === "result";

  const goNext = () => {
    setRiskChangedFrom(undefined);
    setStageIndex((i) => Math.min(i + 1, stages.length - 1));
    setDecisionKey((k) => k + 1);
  };

  const handleDecisionChoose = (option: DecisionOption) => {
    setLog((prev) => [
      ...prev,
      { stageId: stage.id, quality: option.quality, xp: option.xp, competencyImpact: option.competencyImpact },
    ]);
    if (option.riskChanges) {
      setRiskChangedFrom(risk);
      setRisk((prev) => applyRiskChanges(prev, option.riskChanges));
    }
  };

  const handleCommunicationChoose = (choice: CommunicationChoice) => {
    const result = scoreCommunicationChoice(choice);
    setLog((prev) => [
      ...prev,
      { stageId: stage.id, quality: result.quality, xp: result.xp, competencyImpact: result.competencyImpact },
    ]);
  };

  const currentTime = stage.time ?? scenario.time;
  const xpSoFar = useMemo(() => log.reduce((sum, e) => sum + e.xp, 0), [log]);
  const timelineRevealCount = Math.min(stageIndex + 1, scenario.timeline.length);
  const summary = useMemo(() => summarizeRun(scenario, log), [scenario, log]);

  return (
    <ScenarioShell
      scenario={scenario}
      currentTime={currentTime}
      isComplete={isComplete}
      xp={xpSoFar}
      stageIndex={stageIndex}
      stageCount={stages.length}
      risk={risk}
      riskChangedFrom={riskChangedFrom}
      timelineEvents={scenario.timeline}
      timelineRevealCount={timelineRevealCount}
      mergeScene={stage.type === "awareness-map"}
    >
      {stage.type === "brief" && <SituationBrief stage={stage} onContinue={goNext} />}

      {stage.type === "observation" && (
        <ObservationPanel key={decisionKey} stage={stage} onContinue={goNext} />
      )}

      {stage.type === "decision" && (
        <DecisionCard key={decisionKey} stage={stage} onChoose={handleDecisionChoose} onContinue={goNext} />
      )}

      {stage.type === "awareness-map" && (
        <AwarenessMap key={decisionKey} stage={stage} onContinue={goNext} />
      )}

      {stage.type === "communication" && (
        <CommunicationTask key={decisionKey} stage={stage} onChoose={handleCommunicationChoose} onContinue={goNext} />
      )}

      {stage.type === "result" && (
        <ResultScreen
          scenario={scenario}
          scorePercent={summary.scorePercent}
          goodCount={summary.goodCount}
          totalCount={summary.totalCount}
          xpTotal={summary.xpTotal}
          competencyDeltas={summary.competencyDeltas}
        />
      )}
    </ScenarioShell>
  );
}
