"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { GROUP_COMPARISON } from "@/lib/data/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/chart-colors";

function shortenGroupLabel(label: string) {
  return label.replace("Állománycsoport", "Csoport");
}

export function GroupComparisonChart() {
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Csoportok összehasonlítása
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GROUP_COMPARISON} margin={{ left: -18, right: 8, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} vertical={false} />
              <XAxis
                dataKey="group"
                tickFormatter={shortenGroupLabel}
                interval={0}
                tick={{ fill: CHART_COLORS.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.border }}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                cursor={{ fill: CHART_COLORS.border }}
                contentStyle={{
                  backgroundColor: CHART_COLORS.popover,
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: CHART_COLORS.popoverForeground,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.mutedForeground }} />
              <Bar
                dataKey="completion"
                name="Befejezési arány %"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                isAnimationActive={false}
              />
              <Bar
                dataKey="avgCompetency"
                name="Átlagos kompetencia %"
                fill={CHART_COLORS.warning}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
