"use client";

import { useState } from "react";
import { ClipboardList, MapPin, Target, ListChecks } from "lucide-react";
import { ALL_SCENARIOS } from "@/lib/data/scenarios";
import { COMPETENCIES } from "@/lib/data/meta";
import { QUALITY_META } from "@/lib/scenario-engine";
import type { CompetencyKey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

function fieldLabel(text: string) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{text}</p>;
}

export default function SzituacioszerkesztoPage() {
  const [scenarioId, setScenarioId] = useState(ALL_SCENARIOS[0].id);
  const scenario = ALL_SCENARIOS.find((s) => s.id === scenarioId) ?? ALL_SCENARIOS[0];

  const decisionStages = scenario.stages.filter((s) => s.type === "decision" || s.type === "communication");
  const observationStage = scenario.stages.find((s) => s.type === "observation");

  const learningGoal = `A tanuló fejleszti: ${scenario.competencies.map((c) => COMPETENCIES[c].label).join(", ")}.`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <div className="space-y-1.5">
        <h1 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
          Szituációszerkesztő
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Oktatói előnézet: a platform minden szituációja ugyanabból a strukturált, újrahasznosítható
          tananyagmodellből épül fel – ez teszi lehetővé, hogy a rendszer ne csak tananyag, hanem digitális
          tananyagfejlesztési keretrendszer is legyen.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="scenario-select" className="text-sm font-medium text-foreground">
          Szituáció kiválasztása
        </label>
        <Select value={scenarioId} onValueChange={(value) => value && setScenarioId(value)}>
          <SelectTrigger id="scenario-select" className="w-full max-w-sm">
            <SelectValue placeholder="Válassz szituációt" />
          </SelectTrigger>
          <SelectContent>
            {ALL_SCENARIOS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.code} – {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-base">{scenario.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              {fieldLabel("Tanulási cél")}
              <p className="inline-flex items-start gap-1.5 text-sm leading-relaxed text-foreground/90">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {learningGoal}
              </p>
            </div>
            <div className="space-y-1.5">
              {fieldLabel("Környezet")}
              <p className="inline-flex items-start gap-1.5 text-sm leading-relaxed text-foreground/90">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {scenario.location} · {scenario.category}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {fieldLabel("Nehézség")}
            <DifficultyBadge difficulty={scenario.difficulty} />
          </div>

          <div className="space-y-1.5">
            {fieldLabel("Kiindulási helyzet")}
            <p className="text-sm leading-relaxed text-foreground/90">{scenario.context}</p>
          </div>

          {observationStage?.observations && (
            <div className="space-y-1.5">
              {fieldLabel("Megfigyelhető információk")}
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {observationStage.observations.map((o) => (
                  <li key={o.id} className="flex items-start gap-1.5 text-sm text-foreground/85">
                    <ListChecks className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {o.label}
                    {o.critical && (
                      <Badge variant="outline" className="ml-1 shrink-0 border-primary/30 text-primary">
                        kritikus
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        {fieldLabel("Döntési pontok és válaszlehetőségek")}
        <Accordion className="rounded-xl border border-border bg-card px-4">
          {decisionStages.map((stage) => (
            <AccordionItem key={stage.id} value={stage.id}>
              <AccordionTrigger>{stage.question}</AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {stage.type === "decision" &&
                  stage.options?.map((opt) => (
                    <div key={opt.id} className="space-y-1.5 rounded-lg border border-border/70 bg-secondary/25 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {opt.label}) {opt.text}
                        </p>
                        <Badge variant="outline" className="shrink-0">
                          {QUALITY_META[opt.quality].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Szakmai visszajelzés: </span>
                        {opt.rationale}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Következmény: </span>
                        {opt.takeaway}
                      </p>
                      <Badge className="bg-primary/10 text-primary" variant="outline">
                        {COMPETENCIES[opt.primaryCompetency as CompetencyKey].label}
                      </Badge>
                    </div>
                  ))}

                {stage.type === "communication" &&
                  stage.communicationChoices?.map((choice) => (
                    <div key={choice.id} className="space-y-1.5 rounded-lg border border-border/70 bg-secondary/25 p-3.5">
                      <p className="text-sm font-medium italic text-foreground">„{choice.text}”</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Szakmai visszajelzés: </span>
                        {choice.feedback}
                      </p>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
