"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { GROUP_COMPARISON } from "@/lib/data/instructor";
import { CHART_COLORS } from "@/lib/chart-colors";

function shortenGroupLabel(label: string) {
  return label.replace("Állománycsoport", "Csoport");
}

export function GroupComparisonChart() {
  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-4">Csoportok összehasonlítása</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={GROUP_COMPARISON} margin={{ left: -18, right: 8, top: 4 }} barGap={4}>
            <CartesianGrid strokeDasharray="2 4" stroke={CHART_COLORS.hairline} vertical={false} />
            <XAxis
              dataKey="group"
              tickFormatter={shortenGroupLabel}
              interval={0}
              tick={{ fill: CHART_COLORS.mutedForeground, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.hairline }}
            />
            <YAxis
              tick={{ fill: CHART_COLORS.mutedForeground, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.hairline }}
              contentStyle={{
                backgroundColor: CHART_COLORS.popover,
                border: "1px solid oklch(1 0 0 / 12%)",
                borderRadius: 0,
                fontSize: 12,
                color: CHART_COLORS.popoverForeground,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.mutedForeground }} />
            <Bar
              dataKey="completion"
              name="Befejezési arány %"
              fill={CHART_COLORS.primary}
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Bar
              dataKey="avgCompetency"
              name="Átlagos kompetencia %"
              fill={CHART_COLORS.warning}
              maxBarSize={28}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
