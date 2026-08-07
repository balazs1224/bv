import type { LucideIcon } from "lucide-react";
import { Metric } from "@/components/system/metric";

export function StatusStrip({
  items,
}: {
  items: { icon: LucideIcon; label: string; value: string; hint?: string }[];
}) {
  return (
    <div className="flex flex-col divide-y divide-hairline border border-hairline sm:flex-row sm:divide-x sm:divide-y-0">
      {items.map((item) => (
        <div key={item.label} className="flex-1 px-6 py-5">
          <Metric icon={item.icon} label={item.label} value={item.value} hint={item.hint} />
        </div>
      ))}
    </div>
  );
}
