"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Clock, Play } from "lucide-react";
import { BrandLockup } from "@/components/layout/logo";
import { DEMO_STEPS, useDemoMode } from "@/lib/demo-mode-context";

export default function DemoPage() {
  const { start } = useDemoMode();
  const router = useRouter();

  const handleStart = () => {
    start();
    router.push(DEMO_STEPS[0].href);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <BrandLockup />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Kilépés
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-10 px-5 py-12 sm:px-8">
        <div className="space-y-3">
          <p className="type-eyebrow inline-flex items-center gap-1.5 text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Kb. 5 perces vezetett bemutató
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Pályázati demo</h1>
          <p className="max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            A Bemutató mód a valódi felületen vezeti végig a bíráló bizottságot – nincs videó, nincs
            mockup, minden képernyő élesben kattintható. A lenti hat lépés adja a dramaturgiát; indítás
            után egy vezérlősáv mutatja, hol tartotok, és bármikor kiléphettek.
          </p>
        </div>

        <ol className="divide-y divide-hairline border-y border-hairline">
          {DEMO_STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:gap-6">
              <span className="font-display w-10 shrink-0 text-2xl leading-none text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="flex flex-wrap items-baseline gap-x-2 text-[14.5px] font-medium text-foreground">
                  {step.title}
                  <span className="font-mono text-[11px] font-normal text-muted-foreground">{step.duration}</span>
                </h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{step.focus}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-start gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2.5 bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Bemutató indítása
          </button>
          <p className="max-w-sm text-[11px] leading-relaxed text-muted-foreground">
            Demonstrációs frontend – strukturált mock adatokkal működik, valós backenddel és LMS-sel
            később integrálható architektúrára építve.
          </p>
        </div>
      </div>
    </div>
  );
}
