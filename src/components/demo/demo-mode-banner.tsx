"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { DEMO_STEPS, useDemoMode } from "@/lib/demo-mode-context";
import { cn } from "@/lib/utils";

export function DemoModeBanner() {
  const { active, stepIndex, step, isFirst, isLast, next, prev, exit, goToStep } = useDemoMode();
  const router = useRouter();

  if (!active) return null;

  const handleNext = () => {
    const target = next();
    if (target) router.push(target.href);
  };

  const handlePrev = () => {
    const target = prev();
    if (target) router.push(target.href);
  };

  const handleJump = (index: number) => {
    goToStep(index);
    router.push(DEMO_STEPS[index].href);
  };

  return (
    <div
      role="region"
      aria-label="Bemutató mód vezérlés"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/98 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
            Bemutató mód
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {stepIndex + 1}/{DEMO_STEPS.length}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 text-[13.5px] font-medium text-foreground">
            {step.title}
            <span className="font-mono text-[11px] font-normal text-muted-foreground">{step.duration}</span>
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground sm:line-clamp-1">
            {step.focus}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 sm:flex" aria-hidden="true">
          {DEMO_STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => handleJump(i)}
              title={s.title}
              className={cn("h-1.5 w-1.5 rounded-full transition-colors", i === stepIndex ? "bg-primary" : "bg-muted hover:bg-foreground/40")}
            />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 border border-hairline px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:border-primary/40 disabled:opacity-30 disabled:hover:border-hairline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Előző</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            className="inline-flex items-center gap-1.5 bg-primary px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30"
          >
            <span className="hidden sm:inline">Következő</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={exit}
            className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Kilépés a bemutatóból"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
