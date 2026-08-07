// Recharts renders these as raw SVG presentation attributes (not inline style),
// which do not reliably resolve CSS custom properties (var(--token)) across browsers.
// Keep these literal values in sync with the design tokens in globals.css.
export const CHART_COLORS = {
  primary: "oklch(0.62 0.09 246)",
  border: "oklch(1 0 0 / 14%)",
  mutedForeground: "oklch(0.66 0.02 255)",
  popover: "oklch(0.21 0.019 262)",
  popoverForeground: "oklch(0.95 0.008 90)",
  success: "oklch(0.62 0.11 155)",
  warning: "oklch(0.78 0.13 78)",
  critical: "oklch(0.58 0.2 25)",
};
