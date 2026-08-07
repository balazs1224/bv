import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TRAINING_MODULES } from "@/lib/data/modules";
import { MUVELET_KRITIKUS_PONT } from "@/lib/data/scenarios";
import { ModuleRow } from "@/components/modules/module-row";

export default function KepzesekPage() {
  const regular = TRAINING_MODULES.filter((m) => m.status !== "zarolt");
  const finalModule = TRAINING_MODULES.find((m) => m.status === "zarolt");
  const scenario = MUVELET_KRITIKUS_PONT;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div>
        <p className="type-eyebrow mb-1">Gyakorlótár</p>
        <h1 className="text-2xl font-semibold text-foreground">Képzések</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-muted-foreground">
          A szituációalapú képzési sor kilenc modulból épül fel, a helyzetfelismeréstől a záró komplex
          gyakorlatig.
        </p>
      </div>

      <ul className="divide-y divide-hairline border-y border-hairline">
        {regular.map((m) => (
          <li key={m.id}>
            <ModuleRow module={m} />
          </li>
        ))}
      </ul>

      {finalModule && (
        <div className="border border-hairline bg-surface p-6 sm:p-10">
          <p className="type-eyebrow mb-3 text-critical">
            {finalModule.index} · Záró szituáció · {scenario.difficulty === "halado" ? "Haladó" : ""}
          </p>
          <h2 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">{scenario.title}</h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {scenario.description}
          </p>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="type-label">Idő</dt>
              <dd className="font-mono text-foreground/85">{scenario.estimatedTime}</dd>
            </div>
            <div>
              <dt className="type-label">Döntési pont</dt>
              <dd className="font-mono text-foreground/85">{scenario.decisionPoints}</dd>
            </div>
            <div>
              <dt className="type-label">Kompetencia</dt>
              <dd className="font-mono text-foreground/85">{scenario.competencies.length}</dd>
            </div>
          </dl>

          <Link
            href={`/szituacio/${scenario.id}`}
            className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Záró szituáció indítása
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
