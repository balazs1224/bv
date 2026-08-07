"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Quote } from "lucide-react";
import type { CommunicationChoice, Stage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scoreCommunicationChoice } from "@/lib/scenario-engine";
import { cn } from "@/lib/utils";

const METRICS: { key: keyof CommunicationChoice["scores"]; label: string; invert?: boolean }[] = [
  { key: "hangnem", label: "Hangnem" },
  { key: "vilagossag", label: "Világosság" },
  { key: "kontroll", label: "Kontroll" },
  { key: "eszkalacio", label: "Alacsony eszkalációs kockázat", invert: true },
  { key: "informacioszerzes", label: "Információszerzés" },
];

export function CommunicationTask({
  stage,
  onChoose,
  onContinue,
}: {
  stage: Stage;
  onChoose: (choice: CommunicationChoice) => void;
  onContinue: () => void;
}) {
  const choices = stage.communicationChoices ?? [];
  const [chosenId, setChosenId] = useState<string | null>(null);
  const chosen = choices.find((c) => c.id === chosenId) ?? null;
  const result = chosen ? scoreCommunicationChoice(chosen) : null;

  const handleChoose = (choice: CommunicationChoice) => {
    if (chosenId) return;
    setChosenId(choice.id);
    onChoose(choice);
  };

  return (
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Deeszkalációs kommunikáció
          </p>
          {stage.narrative && <p className="text-sm leading-relaxed text-foreground/90">{stage.narrative}</p>}
          {stage.question && <p className="text-base font-medium text-foreground">{stage.question}</p>}
        </div>

        <div role="group" aria-label={stage.question} className="space-y-2.5">
          {choices.map((choice) => {
            const isChosen = chosenId === choice.id;
            const disabled = chosenId !== null;
            return (
              <button
                key={choice.id}
                type="button"
                aria-pressed={isChosen}
                disabled={disabled}
                onClick={() => handleChoose(choice)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                  isChosen
                    ? "border-primary/60 bg-primary/10"
                    : disabled
                      ? "border-border/60 bg-secondary/20 opacity-60"
                      : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
                )}
              >
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="space-y-1">
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {choice.label}
                  </span>
                  <span className="block text-sm italic leading-relaxed text-foreground/95">{choice.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {chosen && result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4 border-t border-border/70 pt-5"
          >
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {METRICS.map((metric) => {
                const raw = chosen.scores[metric.key];
                const display = metric.invert ? 100 - raw : raw;
                return (
                  <div key={metric.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/80">{metric.label}</span>
                      <span className="font-medium tabular-nums text-foreground">{display}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={cn("h-full rounded-full", display >= 65 ? "bg-success" : display >= 40 ? "bg-warning" : "bg-critical")}
                        initial={{ width: 0 }}
                        animate={{ width: `${display}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{chosen.feedback}</p>
            <Button onClick={onContinue} size="lg">
              Tovább
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
