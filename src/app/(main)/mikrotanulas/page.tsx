"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Zap, Trophy, RotateCcw } from "lucide-react";
import { MICRO_EXERCISES } from "@/lib/data/microlearning";
import { COMPETENCIES } from "@/lib/data/meta";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScenarioProgress } from "@/components/scenario/scenario-progress";
import { cn } from "@/lib/utils";

const XP_PER_CORRECT = 15;

export default function MikrotanulasPage() {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const total = MICRO_EXERCISES.length;
  const finished = index >= total;
  const exercise = !finished ? MICRO_EXERCISES[index] : null;
  const selectedOption = exercise?.options.find((o) => o.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    const opt = exercise?.options.find((o) => o.id === id);
    if (opt?.correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    setSelectedId(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setSelectedId(null);
    setCorrectCount(0);
    setRunKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">5 perces gyakorlás</h1>
        <p className="text-sm text-muted-foreground">
          Rövid, célzott mikrotanulási kérdések – ideális egy szolgálat előtti gyors ismétléshez.
        </p>
      </div>

      {!finished && exercise ? (
        <div key={`${runKey}-${index}`} className="space-y-4">
          <ScenarioProgress total={total} current={index} />

          <Card className="border-border/80 bg-card">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {COMPETENCIES[exercise.competency].label}
                </span>
                <p className="text-base font-medium leading-relaxed text-foreground">{exercise.question}</p>
              </div>

              <div role="radiogroup" aria-label={exercise.question} className="space-y-2.5">
                {exercise.options.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  const revealed = selectedId !== null;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={revealed}
                      onClick={() => handleSelect(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                        revealed && opt.correct && "border-success/50 bg-success/10",
                        revealed && isSelected && !opt.correct && "border-critical/50 bg-critical/10",
                        !revealed && "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50",
                        revealed && !isSelected && !opt.correct && "border-border/50 opacity-60"
                      )}
                    >
                      {revealed && opt.correct && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />}
                      {revealed && isSelected && !opt.correct && <XCircle className="h-4 w-4 shrink-0 text-critical" aria-hidden="true" />}
                      <span className="text-foreground/95">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {selectedOption && (
                <div
                  className={cn(
                    "space-y-1.5 rounded-lg border p-3.5 text-sm leading-relaxed",
                    selectedOption.correct
                      ? "border-success/30 bg-success/8 text-foreground/90"
                      : "border-warning/30 bg-warning/8 text-foreground/90"
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Magyarázat</p>
                  <p>{exercise.explanation}</p>
                </div>
              )}

              {selectedId && (
                <Button onClick={handleNext} size="lg">
                  {index + 1 < total ? "Következő kérdés" : "Összegzés"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-primary/25 bg-gradient-to-br from-accent/70 to-card">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/15 text-success">
              <Trophy className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-success">Gyakorlás teljesítve</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {correctCount} / {total}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">helyes válasz</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <Zap className="h-4 w-4" aria-hidden="true" />
              +{correctCount * XP_PER_CORRECT} XP
            </span>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button render={<Link href="/" />} nativeButton={false} size="lg">
                Vissza a vezérlőpultra
              </Button>
              <Button onClick={restart} variant="outline" size="lg" className="gap-1.5">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Újra
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
