"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { COMPETENCIES, COMPETENCY_ORDER } from "@/lib/data/meta";
import type { CompetencyKey } from "@/lib/types";
import { CHART_COLORS } from "@/lib/chart-colors";

export function CompetencyRadar({ values }: { values: Record<CompetencyKey, number> }) {
  const data = COMPETENCY_ORDER.map((key) => ({
    key,
    label: COMPETENCIES[key].shortLabel,
    value: values[key],
  }));

  return (
    <div
      className="h-72 w-full"
      role="img"
      aria-label={`Kompetenciaprofil radar diagram: ${data.map((d) => `${d.label} ${d.value} százalék`).join(", ")}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="62%" margin={{ top: 8, bottom: 8, left: 24, right: 24 }}>
          <PolarGrid stroke={CHART_COLORS.border} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: CHART_COLORS.mutedForeground, fontSize: 11 }}
          />
          <Radar
            dataKey="value"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.primary}
            fillOpacity={0.28}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
