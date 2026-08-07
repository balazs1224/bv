"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, MoveHorizontal, PackageSearch, Eye, DoorOpen, Video, ScanEye, Check } from "lucide-react";
import type { AwarenessMarker, Stage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<AwarenessMarker["category"], { label: string; icon: typeof User }> = {
  szemely: { label: "Résztvevő", icon: User },
  tavolsag: { label: "Távolság", icon: MoveHorizontal },
  targy: { label: "Tárgy", icon: PackageSearch },
  tanu: { label: "Lehetséges tanú", icon: Eye },
  kijarat: { label: "Kijárat", icon: DoorOpen },
  kamera: { label: "Kamerával lefedett terület", icon: Video },
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
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <ScanEye className="h-3.5 w-3.5" aria-hidden="true" />
            Helyszíni tudatosság
          </p>
          {stage.narrative && <p className="text-sm leading-relaxed text-foreground/90">{stage.narrative}</p>}
          {stage.question && <p className="text-base font-medium text-foreground">{stage.question}</p>}
          {stage.helperText && <p className="text-sm text-muted-foreground">{stage.helperText}</p>}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface"
            role="group"
            aria-label="Stilizált körlet alaprajz – jelöld a releváns pontokat"
          >
            {/* Stilizált, semleges alaprajz */}
            <div className="absolute inset-x-[8%] top-1/2 h-[26%] -translate-y-1/2 rounded-sm bg-surface-raised" />
            {[12, 32, 68, 88].map((x, i) => (
              <div key={`top-${i}`} className="absolute h-[18%] w-[10%] rounded-sm border border-border/60 bg-muted/40" style={{ left: `${x - 5}%`, top: "10%" }} />
            ))}
            {[12, 32, 68, 88].map((x, i) => (
              <div key={`bottom-${i}`} className="absolute h-[18%] w-[10%] rounded-sm border border-border/60 bg-muted/40" style={{ left: `${x - 5}%`, bottom: "10%" }} />
            ))}

            {markers.map((marker, i) => {
              const isFound = found.has(marker.id);
              const Icon = CATEGORY_META[marker.category].icon;
              return (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => toggle(marker.id)}
                  aria-pressed={isFound}
                  aria-label={`${i + 1}. pont: ${CATEGORY_META[marker.category].label} – ${marker.label}${isFound ? " (azonosítva)" : ""}`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  className={cn(
                    "group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isFound
                      ? "border-primary bg-primary text-primary-foreground scale-100"
                      : "border-warning/70 bg-warning/15 text-warning hover:scale-110"
                  )}
                >
                  {isFound ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Azonosított elemek ({found.size}/{markers.length})
            </p>
            <ul className="space-y-2">
              {markers.map((marker) => {
                const isFound = found.has(marker.id);
                const Icon = CATEGORY_META[marker.category].icon;
                return (
                  <motion.li
                    key={marker.id}
                    initial={false}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs transition-colors",
                      isFound ? "border-primary/30 bg-primary/8" : "border-dashed border-border text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {isFound ? marker.label : `${CATEGORY_META[marker.category].label} – ismeretlen pont`}
                    </span>
                    {isFound && <span className="mt-1 block text-foreground/75">{marker.note}</span>}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Jelölj ki legalább {MIN_TO_CONTINUE} pontot a folytatáshoz.
          </p>
          <Button
            onClick={() => onContinue({ found: found.size, total: markers.length })}
            disabled={found.size < Math.min(MIN_TO_CONTINUE, markers.length)}
            size="lg"
          >
            Tovább
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
