"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { MICRO_EXERCISES } from "@/lib/data/microlearning";
import { COMPETENCIES } from "@/lib/data/meta";
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
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-8 sm:px-8 lg:py-12">
      <div>
        <p className="type-eyebrow mb-1">Mikrotanulás</p>
        <h1 className="text-2xl font-semibold text-foreground">5 perces gyakorlás</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Rövid, célzott mikrotanulási kérdések – ideális egy szolgálat előtti gyors ismétléshez.
        </p>
      </div>

      {!finished && exercise ? (
        <div key={`${runKey}-${index}`} className="space-y-5">
          <ScenarioProgress total={total} current={index} />

          <div className="border border-hairline bg-surface p-6 sm:p-8">
            <div className="space-y-2">
              <p className="type-label text-primary">{COMPETENCIES[exercise.competency].label}</p>
              <p className="text-[16px] font-medium leading-relaxed text-foreground">{exercise.question}</p>
            </div>

            <div role="group" aria-label={exercise.question} className="mt-5 divide-y divide-hairline border-y border-hairline">
              {exercise.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const revealed = selectedId !== null;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={revealed}
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      "flex w-full items-center gap-3 py-3.5 text-left text-[14px] transition-colors disabled:cursor-default",
                      revealed && opt.correct && "text-success",
                      revealed && isSelected && !opt.correct && "text-critical",
                      !revealed && "text-foreground/90 hover:text-primary",
                      revealed && !isSelected && !opt.correct && "text-muted-foreground"
                    )}
                  >
                    {revealed && opt.correct && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    {revealed && isSelected && !opt.correct && <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    {(!revealed || (!opt.correct && !isSelected)) && <span className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className={cn("mt-5 space-y-1.5 border-l-2 pl-4", selectedOption.correct ? "border-success/50" : "border-warning/50")}>
                <p className="type-label">Magyarázat</p>
                <p className="text-[13.5px] leading-relaxed text-foreground/85">{exercise.explanation}</p>
              </div>
            )}

            {selectedId && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {index + 1 < total ? "Következő kérdés" : "Összegzés"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-hairline bg-surface px-6 py-12 text-center sm:px-10">
          <Trophy className="mx-auto h-8 w-8 text-success" aria-hidden="true" />
          <p className="type-eyebrow mt-4">Gyakorlás teljesítve</p>
          <p className="font-display mt-1 text-4xl text-foreground">
            {correctCount} / {total}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">helyes válasz</p>
          <p className="mt-3 font-mono text-sm tabular-nums text-primary">+{correctCount * XP_PER_CORRECT} XP</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Vezérlőpultra
            </Link>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 border border-hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground/85 transition-colors hover:border-primary/40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Újra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
