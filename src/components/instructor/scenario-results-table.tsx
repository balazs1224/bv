import { SCENARIO_RESULTS } from "@/lib/data/instructor";

export function ScenarioResultsTable() {
  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-4">Szituációnkénti eredmények</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-[11px] uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2.5 pr-3 font-medium">Szituáció</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Próbálkozás</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Átlagpontszám</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Átlagidő</th>
              <th scope="col" className="py-2.5 pl-3 font-medium">Leggyakoribb hibás döntés</th>
            </tr>
          </thead>
          <tbody>
            {SCENARIO_RESULTS.map((row) => (
              <tr key={row.scenario} className="border-b border-hairline last:border-0">
                <td className="py-3.5 pr-3 text-[13.5px] font-medium text-foreground">{row.scenario}</td>
                <td className="px-3 py-3.5 font-mono text-[13px] tabular-nums text-foreground/80">{row.attempts}</td>
                <td className="px-3 py-3.5 font-mono text-[13px] tabular-nums text-foreground/80">{row.avgScore}%</td>
                <td className="px-3 py-3.5 font-mono text-[13px] tabular-nums text-foreground/80">{row.avgTime}</td>
                <td className="py-3.5 pl-3 text-[13px] text-foreground/70">{row.mostCommonMistake}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
