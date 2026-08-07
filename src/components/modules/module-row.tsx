import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import type { TrainingModule } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { StatusDot } from "@/components/system/panel";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABEL: Record<TrainingModule["difficulty"], string> = {
  kezdo: "Kezdő",
  kozepes: "Közepes",
  halado: "Haladó",
};

const STATUS_TEXT: Record<TrainingModule["status"], string> = {
  nincs_elkezdve: "Nincs elkezdve",
  folyamatban: "Folyamatban",
  teljesitve: "Teljesítve",
  zarolt: "Zárolva",
};

const STATUS_TONE: Record<TrainingModule["status"], "success" | "warning" | "neutral"> = {
  nincs_elkezdve: "neutral",
  folyamatban: "warning",
  teljesitve: "success",
  zarolt: "neutral",
};

export function ModuleRow({ module: m }: { module: TrainingModule }) {
  const locked = m.status === "zarolt";
  const content = (
    <div
      className={cn(
        "group grid grid-cols-[44px_1fr] items-start gap-4 py-6 transition-colors sm:grid-cols-[64px_1fr_auto] sm:items-center sm:gap-6",
        !locked && "hover:bg-surface-raised/50"
      )}
    >
      <span className="font-display text-2xl leading-none text-muted-foreground sm:text-3xl">{m.index}</span>

      <div className="min-w-0 space-y-1.5">
        <h3
          className={cn(
            "text-[15px] font-medium uppercase tracking-wide sm:text-base",
            locked ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {m.title}
        </h3>
        <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">{m.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-muted-foreground">
          <span>{m.estimatedTime}</span>
          <span>{DIFFICULTY_LABEL[m.difficulty]}</span>
          <span>{COMPETENCIES[m.competency].shortLabel}</span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot tone={STATUS_TONE[m.status]} />
            {m.status === "teljesitve" ? `${m.progress}% teljesítve` : STATUS_TEXT[m.status]}
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 sm:block">
        {locked ? (
          <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ArrowRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );

  if (locked) {
    return <div aria-disabled="true">{content}</div>;
  }

  return <Link href="/szituacio/eset-07">{content}</Link>;
}
