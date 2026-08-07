"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ObservationPanel({
  stage,
  onContinue,
}: {
  stage: Stage;
  onContinue: (result: { selectedCount: number; criticalFound: number; totalCritical: number }) => void;
}) {
  const observations = stage.observations ?? [];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmed, setConfirmed] = useState(false);

  const totalCritical = observations.filter((o) => o.critical).length;
  const criticalFound = observations.filter((o) => o.critical && selected.has(o.id)).length;

  const toggle = (id: string) => {
    if (confirmed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col gap-5 border border-hairline bg-surface p-6 sm:p-8">
      <div className="space-y-2">
        <p className="type-eyebrow">Megfigyelés</p>
        {stage.question && <p className="text-[16px] font-medium text-foreground">{stage.question}</p>}
        {stage.helperText && <p className="text-[13px] text-muted-foreground">{stage.helperText}</p>}
      </div>

      <fieldset className="border-y border-hairline">
        <legend className="sr-only">Megfigyelt információk – jelöld a kritikusakat</legend>
        <div className="divide-y divide-hairline">
          {observations.map((obs) => {
            const isSelected = selected.has(obs.id);
            return (
              <button
                key={obs.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                disabled={confirmed}
                onClick={() => toggle(obs.id)}
                className={cn(
                  "flex w-full items-start gap-3 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                  isSelected && "bg-primary/[0.06]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="flex-1 space-y-1">
                  <span className="block text-[14px] text-foreground/95">{obs.label}</span>
                  {confirmed && (
                    <span className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className={cn("font-medium", obs.critical ? "text-primary" : "text-muted-foreground")}>
                        {obs.critical ? "Kritikus:" : "Kontextus:"}
                      </span>
                      {obs.description}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {!confirmed ? (
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          disabled={selected.size === 0}
          className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Megerősítés
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-foreground/80">
            <strong className="font-semibold text-foreground">
              {criticalFound}/{totalCritical}
            </strong>{" "}
            kritikus információt azonosítottál.
          </p>
          <button
            type="button"
            onClick={() => onContinue({ selectedCount: selected.size, criticalFound, totalCritical })}
            className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Tovább
          </button>
        </div>
      )}
    </div>
  );
}
