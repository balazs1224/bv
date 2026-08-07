import type { Scenario } from "@/lib/types";
import { CorridorIllustration } from "@/components/shared/corridor-illustration";

export function SceneViewport({ scenario, currentTime }: { scenario: Scenario; currentTime: string }) {
  const observationCount = scenario.stages.find((s) => s.type === "observation")?.observations?.length ?? 0;

  return (
    <div className="relative min-h-[280px] overflow-hidden border border-hairline bg-surface lg:min-h-full">
      <CorridorIllustration className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />

      <div className="absolute left-4 top-4 space-y-0.5">
        <p className="font-mono text-[11px] tabular-nums text-white/70">{currentTime}:00</p>
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">{scenario.location}</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-x-6 gap-y-1.5">
        <ChipStat label="Érintett személyek" value="4" />
        {observationCount > 0 && <ChipStat label="Megfigyelési pont" value={String(observationCount)} />}
      </div>
    </div>
  );
}

function ChipStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-tight">
      <p className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="font-mono text-sm tabular-nums text-white/85">{value}</p>
    </div>
  );
}
