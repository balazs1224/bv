"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Maximize2, X, ScanEye } from "lucide-react";
import type { AwarenessMarker, Scenario, ScenarioImage, Stage } from "@/lib/types";
import { ScenarioImageFrame } from "@/components/shared/scenario-image";
import { HotspotCalibrationOverlay } from "@/components/scenario/hotspot-calibration-overlay";
import { useDebugHotspots } from "@/lib/use-debug-hotspots";
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

function HotspotButton({
  marker,
  index,
  isFound,
  onToggle,
}: {
  marker: AwarenessMarker;
  index: number;
  isFound: boolean;
  onToggle: (id: string) => void;
}) {
  const isArea = marker.type === "area";
  const style = isArea
    ? { left: `${marker.x}%`, top: `${marker.y}%`, width: `${marker.width}%`, height: `${marker.height}%` }
    : { left: `${marker.x}%`, top: `${marker.y}%` };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(marker.id);
      }}
      aria-pressed={isFound}
      aria-label={
        isFound
          ? `${index + 1}. jelölt pont – ${CATEGORY_LABEL[marker.category]}: ${marker.label} (azonosítva)`
          : `${index + 1}. jelölhető pont a helyszínen`
      }
      style={style}
      className={cn(
        "absolute flex items-center justify-center font-mono text-[11px] font-semibold backdrop-blur-[1px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        isArea ? "border-2 border-dashed" : "h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
        isFound
          ? "border-primary bg-primary/75 text-primary-foreground"
          : "border-warning bg-warning/10 text-warning hover:bg-warning/25"
      )}
    >
      {isFound ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : !isArea ? index + 1 : ""}
    </button>
  );
}

function AwarenessScene({
  awareness,
  markers,
  found,
  onToggle,
  missMessage,
  onMiss,
}: {
  awareness: ScenarioImage | undefined;
  markers: AwarenessMarker[];
  found: Set<string>;
  onToggle: (id: string) => void;
  missMessage: string | null;
  onMiss: () => void;
}) {
  const debug = useDebugHotspots();

  return (
    <div className="relative">
      <ScenarioImageFrame
        image={awareness}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="min-h-[280px] cursor-default border border-hairline bg-background"
        fallbackLabel="A helyszíni kép fejlesztés alatt – lásd IMAGE-INTEGRATION.md"
      >
        <div
          role="group"
          aria-label="Stilizált helyszíni kép – jelöld a releváns pontokat"
          className="absolute inset-0"
          onClick={onMiss}
        >
          {markers.map((marker, i) => (
            <HotspotButton key={marker.id} marker={marker} index={i} isFound={found.has(marker.id)} onToggle={onToggle} />
          ))}
        </div>
        {debug && <HotspotCalibrationOverlay markers={markers} />}
      </ScenarioImageFrame>

      {missMessage && (
        <div
          role="status"
          className="absolute bottom-3 left-3 right-3 border border-hairline bg-background/95 px-3.5 py-2.5 text-[12.5px] text-foreground/85 backdrop-blur"
        >
          {missMessage}
        </div>
      )}
    </div>
  );
}

export function AwarenessMap({
  scenario,
  stage,
  onContinue,
}: {
  scenario: Scenario;
  stage: Stage;
  onContinue: (result: { found: number; total: number }) => void;
}) {
  const markers = stage.awarenessMarkers ?? [];
  const awarenessImage = scenario.visual?.awareness;
  const [found, setFound] = useState<Set<string>>(new Set());
  const [missMessage, setMissMessage] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const missTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => {
    setFound((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMissMessage(null);
    if (missTimeout.current) clearTimeout(missTimeout.current);
  };

  const handleMiss = () => {
    setMissMessage("Ezen a területen nincs kiemelt jel. Nézd át a helyszínt tovább.");
    if (missTimeout.current) clearTimeout(missTimeout.current);
    missTimeout.current = setTimeout(() => setMissMessage(null), 2600);
  };

  useEffect(() => {
    return () => {
      if (missTimeout.current) clearTimeout(missTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  return (
    <div className="flex h-full flex-col gap-5 border border-hairline bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="type-eyebrow">Helyszíni tudatosság</p>
          {stage.narrative && <p className="text-[13px] leading-relaxed text-muted-foreground">{stage.narrative}</p>}
          {stage.question && <p className="text-[16px] font-medium text-foreground">{stage.question}</p>}
          {stage.helperText && <p className="text-[13px] text-muted-foreground">{stage.helperText}</p>}
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 border border-hairline px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:border-primary/40"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Helyszín megnyitása
        </button>
      </div>

      <div className="grid flex-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <AwarenessScene
          awareness={awarenessImage}
          markers={markers}
          found={found}
          onToggle={toggle}
          missMessage={missMessage}
          onMiss={handleMiss}
        />

        <div className="space-y-1">
          <p className="type-label mb-2">
            Azonosított elemek ({found.size}/{markers.length})
          </p>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {markers.map((marker, i) => {
              const isFound = found.has(marker.id);
              return (
                <li key={marker.id}>
                  <button
                    type="button"
                    onClick={() => toggle(marker.id)}
                    aria-pressed={isFound}
                    className={cn(
                      "flex w-full items-start gap-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !isFound && "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[10px]",
                        isFound ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {isFound ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{isFound ? marker.label : "Jelölhető pont a helyszínen"}</span>
                      {isFound && <span className="mt-1 block text-foreground/70">{marker.note}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
            A lista a képen található pontokkal azonos – billentyűzettel és képernyőolvasóval is teljesíthető,
            a kép vizuális áttekintése nélkül is.
          </p>
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

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/98 p-4 backdrop-blur sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 type-eyebrow">
              <ScanEye className="h-4 w-4" aria-hidden="true" />
              Helyszíni tudatosság — nagyított nézet
            </p>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground/80 hover:border-primary/40"
              aria-label="Nagyított nézet bezárása"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Bezárás
            </button>
          </div>
          <div className="mx-auto w-full max-w-4xl flex-1 overflow-auto">
            <AwarenessScene
              awareness={awarenessImage}
              markers={markers}
              found={found}
              onToggle={toggle}
              missMessage={missMessage}
              onMiss={handleMiss}
            />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Azonosított elemek: {found.size}/{markers.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
