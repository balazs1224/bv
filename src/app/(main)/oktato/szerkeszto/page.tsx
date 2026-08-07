"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ALL_SCENARIOS } from "@/lib/data/scenarios";
import { COMPETENCIES } from "@/lib/data/meta";
import { QUALITY_META } from "@/lib/scenario-engine";
import { StatusDot } from "@/components/system/panel";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="type-label">{children}</p>;
}

export default function SzituacioszerkesztoPage() {
  const [scenarioId, setScenarioId] = useState(ALL_SCENARIOS[0].id);
  const scenario = ALL_SCENARIOS.find((s) => s.id === scenarioId) ?? ALL_SCENARIOS[0];

  const decisionStages = scenario.stages.filter((s) => s.type === "decision" || s.type === "communication");
  const observationStage = scenario.stages.find((s) => s.type === "observation");

  const learningGoal = `A tanuló fejleszti: ${scenario.competencies.map((c) => COMPETENCIES[c].label).join(", ")}.`;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-8 lg:py-12">
      <div>
        <p className="type-eyebrow mb-1">Oktatói előnézet</p>
        <h1 className="text-2xl font-semibold text-foreground">Szituációszerkesztő</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
          A platform minden szituációja ugyanabból a strukturált, újrahasznosítható tananyagmodellből épül fel –
          ez teszi lehetővé, hogy a rendszer ne csak tananyag, hanem digitális tananyagfejlesztési
          keretrendszer is legyen.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-hairline py-4">
        <label htmlFor="scenario-select" className="type-label shrink-0">
          Szituáció
        </label>
        <select
          id="scenario-select"
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          className="w-full max-w-md border border-hairline bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {ALL_SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} – {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-hairline bg-surface p-6 sm:p-8">
        <h2 className="mb-6 font-display text-xl text-foreground">{scenario.title}</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel>Tanulási cél</FieldLabel>
            <p className="text-[13.5px] leading-relaxed text-foreground/85">{learningGoal}</p>
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Környezet</FieldLabel>
            <p className="text-[13.5px] leading-relaxed text-foreground/85">
              {scenario.location} · {scenario.category}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2.5">
          <FieldLabel>Nehézség</FieldLabel>
          <span className="text-[13.5px] capitalize text-foreground/85">
            {scenario.difficulty === "kezdo" ? "Kezdő" : scenario.difficulty === "kozepes" ? "Közepes" : "Haladó"}
          </span>
        </div>

        <div className="mt-6 space-y-1.5">
          <FieldLabel>Kiindulási helyzet</FieldLabel>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">{scenario.context}</p>
        </div>

        {observationStage?.observations && (
          <div className="mt-6 space-y-2">
            <FieldLabel>Megfigyelhető információk</FieldLabel>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {observationStage.observations.map((o) => (
                <li key={o.id} className="flex items-start gap-2 text-[13px] text-foreground/80">
                  <StatusDot tone={o.critical ? "primary" : "neutral"} className="mt-1.5" />
                  {o.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <FieldLabel>Döntési pontok és válaszlehetőségek</FieldLabel>
        <div className="divide-y divide-hairline border-y border-hairline">
          {decisionStages.map((stage) => (
            <details key={stage.id} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-[14px] font-medium text-foreground marker:content-none">
                {stage.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="space-y-4 pb-4">
                {stage.type === "decision" &&
                  stage.options?.map((opt) => (
                    <div key={opt.id} className="space-y-1.5 border-l-2 border-hairline pl-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[13.5px] font-medium text-foreground">
                          {opt.label}) {opt.text}
                        </p>
                        <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground">
                          {QUALITY_META[opt.quality].label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">Szakmai visszajelzés: </span>
                        {opt.rationale}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">Következmény: </span>
                        {opt.takeaway}
                      </p>
                      <p className="text-xs text-primary">{COMPETENCIES[opt.primaryCompetency].label}</p>
                    </div>
                  ))}

                {stage.type === "communication" &&
                  stage.communicationChoices?.map((choice) => (
                    <div key={choice.id} className="space-y-1.5 border-l-2 border-hairline pl-4">
                      <p className="text-[13.5px] font-medium italic text-foreground">„{choice.text}”</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">Szakmai visszajelzés: </span>
                        {choice.feedback}
                      </p>
                    </div>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
