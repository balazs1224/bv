"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { AwarenessMarker, Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<AwarenessMarker["category"], string> = {
  szemely: "Résztvevő",
  tavolsag: "Távolság",
  targy: "Tárgy",
  tanu: "Lehetséges tanú",
  kijarat: "Kijárat",
  kamera: "Kamerával lefedett terület",
};

const MIN_TO_CONTINUE = 3;

export function AwarenessMap({
  stage,
  onContinue,
}: {
  stage: Stage;
  onContinue: (result: { found: number; total: number }) => void;
}) {
  const markers = stage.awarenessMarkers ?? [];
  const [found, setFound] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setFound((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col gap-5 border border-hairline bg-surface p-6 sm:p-8">
      <div className="space-y-2">
        <p className="type-eyebrow">Helyszíni tudatosság</p>
        {stage.narrative && <p className="text-[13px] leading-relaxed text-muted-foreground">{stage.narrative}</p>}
        {stage.question && <p className="text-[16px] font-medium text-foreground">{stage.question}</p>}
        {stage.helperText && <p className="text-[13px] text-muted-foreground">{stage.helperText}</p>}
      </div>

      <div className="grid flex-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div
          className="relative min-h-[300px] w-full overflow-hidden border border-hairline bg-background"
          role="group"
          aria-label="Stilizált körlet alaprajz – jelöld a releváns pontokat"
        >
          <div className="absolute inset-x-[8%] top-1/2 h-[24%] -translate-y-1/2 bg-surface-raised" />
          {[12, 32, 68, 88].map((x, i) => (
            <div key={`top-${i}`} className="absolute h-[18%] w-[10%] border border-hairline bg-muted/50" style={{ left: `${x - 5}%`, top: "12%" }} />
          ))}
          {[12, 32, 68, 88].map((x, i) => (
            <div key={`bottom-${i}`} className="absolute h-[18%] w-[10%] border border-hairline bg-muted/50" style={{ left: `${x - 5}%`, bottom: "12%" }} />
          ))}

          {markers.map((marker, i) => {
            const isFound = found.has(marker.id);
            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => toggle(marker.id)}
                aria-pressed={isFound}
                aria-label={`${i + 1}. pont: ${CATEGORY_LABEL[marker.category]} – ${marker.label}${isFound ? " (azonosítva)" : ""}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                className={cn(
                  "absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center border font-mono text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isFound
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-warning bg-warning/15 text-warning hover:bg-warning/25"
                )}
              >
                {isFound ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="type-label mb-2">
            Azonosított elemek ({found.size}/{markers.length})
          </p>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {markers.map((marker, i) => {
              const isFound = found.has(marker.id);
              return (
                <li key={marker.id} className={cn("py-2.5 text-[13px]", !isFound && "text-muted-foreground")}>
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[10px]",
                        isFound ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    {isFound ? marker.label : `${CATEGORY_LABEL[marker.category]} — ismeretlen pont`}
                  </span>
                  {isFound && <span className="mt-1 block pl-6 text-foreground/70">{marker.note}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Jelölj ki legalább {MIN_TO_CONTINUE} pontot a folytatáshoz.</p>
        <button
          type="button"
          onClick={() => onContinue({ found: found.size, total: markers.length })}
          disabled={found.size < Math.min(MIN_TO_CONTINUE, markers.length)}
          className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Tovább
        </button>
      </div>
    </div>
  );
}
