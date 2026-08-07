"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DecisionOption, Stage } from "@/lib/types";
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

  useEffect(() => {
    if (chosenId) return;
    const handler = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) handleChoose(options[n - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenId, options]);

  return (
    <div className="flex h-full flex-col border border-hairline bg-surface p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {!chosen ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col gap-5"
          >
            <div className="space-y-2">
              <p className="type-eyebrow">Döntési pont</p>
              {stage.narrative && <p className="text-[13px] leading-relaxed text-muted-foreground">{stage.narrative}</p>}
              {stage.question && <p className="text-[16px] font-medium text-foreground">{stage.question}</p>}
            </div>

            <div role="group" aria-label={stage.question} className="divide-y divide-hairline border-y border-hairline">
              {options.map((opt, i) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChoose(opt)}
                  className={cn(
                    "group flex w-full items-start gap-4 border-l-2 border-transparent py-4 pl-3 pr-2 text-left transition-colors hover:border-primary/50 hover:bg-surface-raised/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <span className="w-6 shrink-0 font-display text-xl leading-none text-muted-foreground transition-colors group-hover:text-primary">
                    {opt.label}
                  </span>
                  <span className="flex-1 pt-0.5 text-[14.5px] leading-relaxed text-foreground/95">{opt.text}</span>
                  <kbd className="hidden shrink-0 pt-0.5 font-mono text-[10px] text-muted-foreground/60 sm:block">
                    {i + 1}
                  </kbd>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
