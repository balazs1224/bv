import { SCENARIO_RESULTS } from "@/lib/data/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScenarioResultsTable() {
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Szituációnkénti eredmények
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-medium">Szituáció</th>
                <th scope="col" className="px-3 py-2 font-medium">Próbálkozás</th>
                <th scope="col" className="px-3 py-2 font-medium">Átlagpontszám</th>
                <th scope="col" className="px-3 py-2 font-medium">Átlagidő</th>
                <th scope="col" className="py-2 pl-3 font-medium">Leggyakoribb hibás döntés</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_RESULTS.map((row) => (
                <tr key={row.scenario} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-medium text-foreground">{row.scenario}</td>
                  <td className="px-3 py-3 tabular-nums text-foreground/85">{row.attempts}</td>
                  <td className="px-3 py-3 tabular-nums text-foreground/85">{row.avgScore}%</td>
                  <td className="px-3 py-3 tabular-nums text-foreground/85">{row.avgTime}</td>
                  <td className="py-3 pl-3 text-foreground/75">{row.mostCommonMistake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
