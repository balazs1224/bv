"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { useDemoMode } from "@/lib/demo-mode-context";

function applyDemoPreset(
  scenario: Scenario,
  targetStageIndex: number
): {
  log: DecisionLogEntry[];
  risk: Record<RiskDimensionKey, RiskLevel>;
} {
  let risk = { ...scenario.initialRisk };
  const log: DecisionLogEntry[] = [];

  for (let i = 0; i < targetStageIndex; i += 1) {
    const stage = scenario.stages[i];

    if (stage.type === "decision" && stage.options?.length) {
      const option = stage.options.find((item) => item.quality === "kivalo") ?? stage.options[0];
      log.push({
        stageId: stage.id,
        quality: option.quality,
        xp: option.xp,
        competencyImpact: option.competencyImpact,
      });
      if (option.riskChanges) risk = applyRiskChanges(risk, option.riskChanges);
    }

    if (stage.type === "communication" && stage.communicationChoices?.length) {
      const scored = stage.communicationChoices
        .map((choice) => ({ choice, result: scoreCommunicationChoice(choice) }))
        .sort((a, b) => b.result.xp - a.result.xp)[0];

      if (scored) {
        log.push({
          stageId: stage.id,
          quality: scored.result.quality,
          xp: scored.result.xp,
          competencyImpact: scored.result.competencyImpact,
        });
      }
    }
  }

  return { log, risk };
}

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const stages = scenario.stages;
  const demo = useDemoMode();
  const requestedDemoStageId =
    demo.active && demo.step.scenarioId === scenario.id ? demo.step.stageId : undefined;
  const requestedDemoStageIndex = requestedDemoStageId
    ? stages.findIndex((candidate) => candidate.id === requestedDemoStageId)
    : -1;
  const requestedDemoKey = requestedDemoStageId ? `${scenario.id}:${requestedDemoStageId}` : null;

  const initialStageIndex = requestedDemoStageIndex >= 0 ? requestedDemoStageIndex : 0;
  const initialPreset = applyDemoPreset(scenario, initialStageIndex);

  const [stageIndex, setStageIndex] = useState(initialStageIndex);
  const [log, setLog] = useState<DecisionLogEntry[]>(initialPreset.log);
  const [risk, setRisk] = useState<Record<RiskDimensionKey, RiskLevel>>(initialPreset.risk);
  const [riskChangedFrom, setRiskChangedFrom] = useState<Partial<Record<RiskDimensionKey, RiskLevel>>>();
  const [decisionKey, setDecisionKey] = useState(0);
  const lastAppliedDemoTarget = useRef<string | null>(requestedDemoKey);

  // A demo-lépés váltása közvetlenül megnyithat egy scenario stage-et. Fontos,
  // hogy csak a DEMO TARGET változásakor szinkronizáljunk: ha a tanuló a stage-en
  // belül a saját "Tovább" gombjával halad, ne rántsuk vissza folyamatosan a
  // demo belépési pontra.
  useEffect(() => {
    if (!demo.active || demo.step.scenarioId !== scenario.id || !demo.step.stageId) return;
    const targetKey = `${scenario.id}:${demo.step.stageId}`;
    if (lastAppliedDemoTarget.current === targetKey) return;

    const target = stages.findIndex((candidate) => candidate.id === demo.step.stageId);
    if (target < 0) return;

    const preset = applyDemoPreset(scenario, target);
    setStageIndex(target);
    setLog(preset.log);
    setRisk(preset.risk);
    setRiskChangedFrom(undefined);
    setDecisionKey((key) => key + 1);
    lastAppliedDemoTarget.current = targetKey;
  }, [demo.active, demo.step.scenarioId, demo.step.stageId, scenario, stages]);

  useEffect(() => {
    if (!demo.active) lastAppliedDemoTarget.current = null;
  }, [demo.active]);

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
      stage={stage}
      currentTime={currentTime}
      isComplete={isComplete}
      xp={xpSoFar}
      stageIndex={stageIndex}
      stageCount={stages.length}
      risk={risk}
      riskChangedFrom={riskChangedFrom}
      timelineEvents={scenario.timeline}
      timelineRevealCount={timelineRevealCount}
    >
      {stage.type === "brief" && <SituationBrief scenario={scenario} stage={stage} onContinue={goNext} />}

      {stage.type === "observation" && (
        <ObservationPanel key={decisionKey} stage={stage} onContinue={goNext} />
      )}

      {stage.type === "decision" && (
        <DecisionCard key={decisionKey} stage={stage} risk={risk} onChoose={handleDecisionChoose} onContinue={goNext} />
      )}

      {stage.type === "awareness-map" && (
        <AwarenessMap key={decisionKey} scenario={scenario} stage={stage} onContinue={goNext} />
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
          finalRisk={risk}
        />
      )}
    </ScenarioShell>
  );
}
