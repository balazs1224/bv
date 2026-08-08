"use client";

import { useState, type MouseEvent } from "react";
import { Copy, Check, Crosshair } from "lucide-react";
import type { AwarenessMarker } from "@/lib/types";

/**
 * Fejlesztői kalibrációs réteg a helyszíni tudatosság hotspotjaihoz.
 * Csak ?debugHotspots=1 mellett, csak development buildben renderelődik
 * (lásd useDebugHotspots) — production felületen soha nem jelenik meg.
 */
export function HotspotCalibrationOverlay({ markers }: { markers: AwarenessMarker[] }) {
  const [last, setLast] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setLast({ x, y });
    setCopied(false);
  };

  const copy = (e: MouseEvent) => {
    e.stopPropagation();
    if (!last) return;
    navigator.clipboard?.writeText(`x: ${last.x}, y: ${last.y},`);
    setCopied(true);
  };

  return (
    <div
      className="absolute inset-0 z-30 cursor-crosshair"
      onClick={handleClick}
      title="Debug hotspot kalibráció: kattints a % koordináták lekéréséhez"
    >
      <div className="absolute left-2 top-2 z-30 flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 font-mono text-[10px] text-lime-300">
        <Crosshair className="h-3 w-3" aria-hidden="true" />
        DEBUG HOTSPOTS
      </div>

      {markers.map((m) => (
        <div
          key={m.id}
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-red-500"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          title={`${m.id} (${m.category}): x=${m.x}, y=${m.y}${m.width ? `, w=${m.width}, h=${m.height}` : ""}`}
        />
      ))}

      {last && (
        <>
          <div
            className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime-400"
            style={{ left: `${last.x}%`, top: `${last.y}%` }}
          />
          <div className="absolute bottom-2 left-2 z-30 flex items-center gap-2 bg-black/85 px-3 py-2 font-mono text-xs text-lime-300">
            x: {last.x}, y: {last.y}
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1 bg-lime-400/20 px-2 py-1 text-lime-200 hover:bg-lime-400/30"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Másolva" : "Másolás"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
