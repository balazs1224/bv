"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Maximize2, Minus, X, ScanEye } from "lucide-react";
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

/**
 * Scenario-független, semleges "csali" jelöltek az akadálymentes listához.
 * Ezek sosem számítanak bele a found/total számlálóba – kattintásuk ugyanazt a
 * "nincs itt kiemelt jel" visszajelzést adja, mint amikor a képen egy üres
 * területre kattintasz. Enélkül a lista N azonos, mindig helyes gombból állna,
 * és vak végigkattintással triviálisan teljesíthető lenne – ezzel viszont a
 * felismerés/döntés ugyanazt a bizonytalanságot igényli, mint a vizuális feladat.
 */
const DECOY_PROMPTS = [
  "Egy tárgy vagy berendezési elem, amely nem tűnik szokatlannak.",
  "Egy jelenlévő, akinek viselkedése illeszkedik a megszokott rutinba.",
  "A helyiség egy része, amely jelenleg nem releváns a helyzethez.",
];

type ListEntry =
  | { kind: "marker"; id: string; marker: AwarenessMarker }
  | { kind: "decoy"; id: string; prompt: string };

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildListEntries(markers: AwarenessMarker[]): ListEntry[] {
  const markerEntries: ListEntry[] = markers.map((marker) => ({ kind: "marker", id: marker.id, marker }));
  const decoyEntries: ListEntry[] = DECOY_PROMPTS.map((prompt, i) => ({
    kind: "decoy",
    id: `decoy-${i}`,
    prompt,
  }));
  return shuffled([...markerEntries, ...decoyEntries]);
}

function HotspotButton({
  marker,
  index,
  isFound,
  onToggle,
  debug,
}: {
  marker: AwarenessMarker;
  index: number;
  isFound: boolean;
  onToggle: (id: string) => void;
  debug: boolean;
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
        "absolute flex items-center justify-center font-mono text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
        isArea ? "" : "h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full",
        isFound
          ? cn("border-2 border-primary bg-primary/75 text-primary-foreground backdrop-blur-[1px]", isArea && "border-dashed")
          : cn(
              "bg-transparent",
              // Csak dev-only kalibrációs módban látható halvány kontúr – production/normál módban a
              // hotspot vizuálisan teljesen láthatatlan, csak a hitbox létezik.
              debug && (isArea ? "border border-dashed border-lime-400/60" : "border border-lime-400/60")
            )
      )}
    >
      {isFound ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : null}
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
          aria-label="Helyszíni fotó – tekintsd át, és jelöld meg a releváns pontokat"
          className="absolute inset-0"
          onClick={onMiss}
        >
          {markers.map((marker, i) => (
            <HotspotButton
              key={marker.id}
              marker={marker}
              index={i}
              isFound={found.has(marker.id)}
              onToggle={onToggle}
              debug={debug}
            />
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
  const [checkedDecoys, setCheckedDecoys] = useState<Set<string>>(new Set());
  const [listEntries] = useState<ListEntry[]>(() => buildListEntries(markers));
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

  const handleDecoyClick = (id: string) => {
    setCheckedDecoys((prev) => new Set(prev).add(id));
    handleMiss();
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
            {listEntries.map((entry) => {
              if (entry.kind === "marker") {
                const isFound = found.has(entry.marker.id);
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => toggle(entry.marker.id)}
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
                        {isFound ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {isFound ? entry.marker.label : "Lehetséges jel a helyszínen"}
                        </span>
                        {isFound && <span className="mt-1 block text-foreground/70">{entry.marker.note}</span>}
                      </span>
                    </button>
                  </li>
                );
              }

              const isChecked = checkedDecoys.has(entry.id);
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => handleDecoyClick(entry.id)}
                    disabled={isChecked}
                    aria-pressed={isChecked}
                    className={cn(
                      "flex w-full items-start gap-3 py-2.5 text-left text-[13px] text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
                    )}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[10px] text-muted-foreground">
                      {isChecked ? <Minus className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">
                        {isChecked ? "Nincs itt kiemelt jel" : "Lehetséges jel a helyszínen"}
                      </span>
                      {isChecked && (
                        <span className="mt-1 block text-foreground/60">Nézd át a többi lehetőséget is.</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {missMessage && (
            <p role="status" className="pt-1 text-[12.5px] text-foreground/80">
              {missMessage}
            </p>
          )}
          <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
            Billentyűzettel és képernyőolvasóval is teljesíthető, a kép vizuális áttekintése nélkül – nem
            minden lehetőség rejt releváns jelet, a mérlegelés ugyanazt a döntési logikát gyakorolja, mint a
            helyszín vizuális átvizsgálása.
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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Helyszíni tudatosság — nagyított nézet"
          className="fixed inset-0 z-50 flex flex-col bg-background/98 p-4 backdrop-blur sm:p-8"
        >
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
