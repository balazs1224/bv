"use client";

import { useState } from "react";
import { Check, CircleAlert, Eye } from "lucide-react";
import type { Stage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Megfigyelés
          </p>
          {stage.narrative && <p className="text-sm leading-relaxed text-foreground/90">{stage.narrative}</p>}
          {stage.question && <p className="text-base font-medium text-foreground">{stage.question}</p>}
          {stage.helperText && <p className="text-sm text-muted-foreground">{stage.helperText}</p>}
        </div>

        <fieldset className="space-y-2.5">
          <legend className="sr-only">Megfigyelt információk – jelöld a kritikusakat</legend>
          {observations.map((obs) => {
            const isSelected = selected.has(obs.id);
            return (
              <div key={obs.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  disabled={confirmed}
                  onClick={() => toggle(obs.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                    isSelected ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/30 hover:bg-secondary/50"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 space-y-1">
                    <span className="block text-foreground/95">{obs.label}</span>
                    {confirmed && (
                      <span
                        className={cn(
                          "flex items-start gap-1.5 pt-1 text-xs",
                          obs.critical ? "text-foreground/70" : "text-muted-foreground"
                        )}
                      >
                        {obs.critical ? (
                          <span className="inline-flex items-center gap-1 font-medium text-primary">
                            <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                            Kritikus:
                          </span>
                        ) : (
                          <span className="font-medium text-muted-foreground">Kontextus:</span>
                        )}
                        {obs.description}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </fieldset>

        {!confirmed ? (
          <Button onClick={() => setConfirmed(true)} disabled={selected.size === 0} size="lg">
            Megerősítés
          </Button>
        ) : (
          <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/85">
              <strong className="font-semibold text-foreground">
                {criticalFound}/{totalCritical}
              </strong>{" "}
              kritikus információt azonosítottál.
            </p>
            <Button onClick={() => onContinue({ selectedCount: selected.size, criticalFound, totalCritical })} size="lg">
              Tovább
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
