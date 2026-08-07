import { COMPETENCIES } from "@/lib/data/meta";
import { COMPETENCY_HEATMAP, GROUPS } from "@/lib/data/instructor";
import type { CompetencyKey } from "@/lib/types";

const HEATMAP_ROWS: CompetencyKey[] = [
  "helyzetfelismeres",
  "kockazatertekeles",
  "kommunikacio",
  "deeszkalacio",
  "informaciogyujtes",
  "dokumentacio",
];

function cellStyle(value: number) {
  const alpha = 0.08 + (value / 100) * 0.55;
  return { backgroundColor: `oklch(0.64 0.045 238 / ${alpha.toFixed(2)})` };
}

export function CompetencyHeatmap() {
  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-5">Kompetencia heatmap — állománycsoportok szerint</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <caption className="sr-only">Kompetenciaszintek százalékban, állománycsoportonként bontva</caption>
          <thead>
            <tr>
              <th scope="col" className="pb-3 pr-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Kompetencia
              </th>
              {GROUPS.map((g) => (
                <th
                  key={g.key}
                  scope="col"
                  className="pb-3 px-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {g.label.replace("Állománycsoport", "Csoport")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_ROWS.map((key) => (
              <tr key={key} className="border-t border-hairline">
                <th scope="row" className="py-3 pr-3 text-left text-[13px] font-normal text-foreground/85">
                  {COMPETENCIES[key].label}
                </th>
                {GROUPS.map((g) => {
                  const value = COMPETENCY_HEATMAP[key][g.key];
                  return (
                    <td key={g.key} className="p-1 text-center">
                      <div
                        style={cellStyle(value)}
                        className="flex h-10 w-full items-center justify-center font-mono text-[12.5px] tabular-nums text-foreground transition-transform hover:scale-[1.04]"
                      >
                        {value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>Alacsonyabb</span>
        <div className="flex h-2 flex-1 max-w-36">
          {[0.1, 0.2, 0.32, 0.44, 0.56, 0.63].map((a, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: `oklch(0.64 0.045 238 / ${a})` }} />
          ))}
        </div>
        <span>Magasabb</span>
      </div>
    </div>
  );
}
