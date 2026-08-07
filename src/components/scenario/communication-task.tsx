"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CommunicationChoice, Stage } from "@/lib/types";
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
    <div className="flex h-full flex-col border border-hairline bg-surface p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {!chosen ? (
          <motion.div
            key="choices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col gap-5"
          >
            <div className="space-y-2">
              <p className="type-eyebrow">Deeszkalációs kommunikáció</p>
              {stage.narrative && <p className="text-[13px] leading-relaxed text-muted-foreground">{stage.narrative}</p>}
              {stage.question && <p className="text-[16px] font-medium text-foreground">{stage.question}</p>}
            </div>

            <div role="group" aria-label={stage.question} className="divide-y divide-hairline border-y border-hairline">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoose(choice)}
                  className="group flex w-full flex-col gap-1 border-l-2 border-transparent py-4 pl-3 pr-2 text-left transition-colors hover:border-primary/50 hover:bg-surface-raised/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="type-label">{choice.label}</span>
                  <span className="text-[14.5px] italic leading-relaxed text-foreground/95">„{choice.text}”</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          result && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex h-full flex-col justify-between gap-6"
            >
              <div className="space-y-6">
                <div className="border-b border-hairline pb-4">
                  <p className="type-eyebrow mb-1">Kommunikáció értékelve</p>
                  <p className="text-[15px] font-medium text-foreground">„{chosen.text}”</p>
                </div>

                <div className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                  {METRICS.map((metric) => {
                    const raw = chosen.scores[metric.key];
                    const display = metric.invert ? 100 - raw : raw;
                    return (
                      <div key={metric.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground/75">{metric.label}</span>
                          <span className="font-mono tabular-nums text-foreground">{display}%</span>
                        </div>
                        <div className="h-[3px] w-full bg-muted">
                          <motion.div
                            className={cn(
                              "h-full",
                              display >= 65 ? "bg-success" : display >= 40 ? "bg-warning" : "bg-critical"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${display}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[14px] leading-relaxed text-foreground/90">{chosen.feedback}</p>
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Tovább
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
