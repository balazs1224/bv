"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import type { DecisionOption, Stage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackPanel } from "@/components/scenario/feedback-panel";
import { cn } from "@/lib/utils";

export function DecisionCard({
  stage,
  onChoose,
  onContinue,
}: {
  stage: Stage;
  onChoose: (option: DecisionOption) => void;
  onContinue: () => void;
}) {
  const options = stage.options ?? [];
  const [chosenId, setChosenId] = useState<string | null>(null);
  const chosen = options.find((o) => o.id === chosenId) ?? null;

  const handleChoose = (opt: DecisionOption) => {
    if (chosenId) return;
    setChosenId(opt.id);
    onChoose(opt);
  };

  return (
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Döntési pont
          </p>
          {stage.narrative && <p className="text-sm leading-relaxed text-foreground/90">{stage.narrative}</p>}
          {stage.question && <p className="text-base font-medium text-foreground">{stage.question}</p>}
        </div>

        <div role="group" aria-label={stage.question} className="grid gap-3 sm:grid-cols-2">
          {options.map((opt) => {
            const isChosen = chosenId === opt.id;
            const disabled = chosenId !== null;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isChosen}
                disabled={disabled}
                onClick={() => handleChoose(opt)}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                  isChosen
                    ? "border-primary/60 bg-primary/10"
                    : disabled
                      ? "border-border/60 bg-secondary/20 opacity-60"
                      : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isChosen ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {opt.label}
                </span>
                <span className="text-foreground/95">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <FeedbackPanel
            quality={chosen.quality}
            xp={chosen.xp}
            rationale={chosen.rationale}
            risksReduced={chosen.risksReduced}
            primaryCompetency={chosen.primaryCompetency}
            competencyDelta={chosen.competencyImpact[chosen.primaryCompetency] ?? 0}
            takeaway={chosen.takeaway}
            onContinue={onContinue}
          />
        )}
      </CardContent>
    </Card>
  );
}
