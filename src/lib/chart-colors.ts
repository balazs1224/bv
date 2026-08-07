// Recharts renders these as raw SVG presentation attributes (not inline style),
// which do not reliably resolve CSS custom properties (var(--token)) across browsers.
// Keep these literal values in sync with the design tokens in globals.css.
export const CHART_COLORS = {
  primary: "oklch(0.64 0.045 238)",
  border: "oklch(1 0 0 / 12%)",
  hairline: "oklch(1 0 0 / 9%)",
  mutedForeground: "oklch(0.6 0.012 255)",
  popover: "oklch(0.195 0.008 262)",
  popoverForeground: "oklch(0.93 0.004 90)",
  success: "oklch(0.56 0.065 155)",
  warning: "oklch(0.68 0.09 75)",
  critical: "oklch(0.53 0.135 25)",
};
