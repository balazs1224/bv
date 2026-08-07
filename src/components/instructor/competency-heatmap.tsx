import { COMPETENCIES } from "@/lib/data/meta";
import { COMPETENCY_HEATMAP, GROUPS } from "@/lib/data/instructor";
import type { CompetencyKey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HEATMAP_ROWS: CompetencyKey[] = [
  "helyzetfelismeres",
  "kockazatertekeles",
  "kommunikacio",
  "deeszkalacio",
  "informaciogyujtes",
  "dokumentacio",
];

function cellStyle(value: number) {
  const alpha = 0.12 + (value / 100) * 0.7;
  return { backgroundColor: `oklch(0.62 0.09 246 / ${alpha.toFixed(2)})` };
}

export function CompetencyHeatmap() {
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Kompetencia heatmap – állománycsoportok szerint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-1.5 text-sm">
            <caption className="sr-only">
              Kompetenciaszintek százalékban, állománycsoportonként bontva
            </caption>
            <thead>
              <tr>
                <th scope="col" className="p-2 text-left text-xs font-medium text-muted-foreground">
                  Kompetencia
                </th>
                {GROUPS.map((g) => (
                  <th key={g.key} scope="col" className="p-2 text-center text-xs font-medium text-muted-foreground">
                    {g.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_ROWS.map((key) => (
                <tr key={key}>
                  <th scope="row" className="p-2 text-left text-xs font-medium text-foreground/90">
                    {COMPETENCIES[key].label}
                  </th>
                  {GROUPS.map((g) => {
                    const value = COMPETENCY_HEATMAP[key][g.key];
                    return (
                      <td key={g.key} className="rounded-md p-0 text-center">
                        <div
                          style={cellStyle(value)}
                          className="flex h-11 w-full items-center justify-center rounded-md text-sm font-semibold tabular-nums text-foreground"
                        >
                          {value}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Alacsonyabb</span>
          <div className="flex h-2.5 flex-1 max-w-40 overflow-hidden rounded-full">
            {[0.12, 0.3, 0.48, 0.65, 0.82].map((a, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: `oklch(0.62 0.09 246 / ${a})` }} />
            ))}
          </div>
          <span>Magasabb</span>
        </div>
      </CardContent>
    </Card>
  );
}
