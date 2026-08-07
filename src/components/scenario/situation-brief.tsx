import { Info } from "lucide-react";
import type { Stage } from "@/lib/types";

export function SituationBrief({ stage, onContinue }: { stage: Stage; onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 border border-hairline bg-surface p-6 sm:p-8">
      <div className="space-y-5">
        <p className="type-eyebrow">Helyzet</p>
        <p className="text-[16px] leading-relaxed text-foreground/95">{stage.narrative}</p>
        {stage.helperText && (
          <div className="flex gap-2.5 border-l-2 border-primary/50 pl-4 text-[13px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p>{stage.helperText}</p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Kezdés
      </button>
    </div>
  );
}
