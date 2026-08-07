import { COMPETENCIES } from "@/lib/data/meta";
import { COMPETENCY_RISK, type CompetencyRiskStatus } from "@/lib/data/instructor";
import { StatusDot } from "@/components/system/panel";

const STATUS_META: Record<
  CompetencyRiskStatus,
  { label: string; tone: "success" | "warning" | "critical"; textClass: string }
> = {
  jo: { label: "Jó", tone: "success", textClass: "text-success" },
  figyelmet_igenyel: { label: "Figyelmet igényel", tone: "warning", textClass: "text-warning" },
  fejlesztendo: { label: "Fejlesztendő", tone: "critical", textClass: "text-critical" },
};

export function CompetencyRiskList() {
  const sorted = [...COMPETENCY_RISK].sort((a, b) => a.average - b.average);

  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-4">Kompetenciakockázatok</p>
      <ul className="divide-y divide-hairline">
        {sorted.map((row) => {
          const meta = STATUS_META[row.status];
          return (
            <li key={row.key} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[13.5px] text-foreground/85">{COMPETENCIES[row.key].label}</span>
              <span className="flex items-center gap-4">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{row.average}%</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.textClass}`}>
                  <StatusDot tone={meta.tone} />
                  {meta.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
