export function CorridorIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="corridorFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.24 0.02 262)" />
          <stop offset="100%" stopColor="oklch(0.12 0.015 262)" />
        </linearGradient>
        <linearGradient id="corridorGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.13 78 / 55%)" />
          <stop offset="100%" stopColor="oklch(0.78 0.13 78 / 0%)" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#corridorFloor)" />
      {/* Perspektivikus folyosó vonalak */}
      <g stroke="oklch(1 0 0 / 8%)" strokeWidth="1.5">
        <line x1="0" y1="500" x2="150" y2="220" />
        <line x1="400" y1="500" x2="250" y2="220" />
        <line x1="0" y1="0" x2="150" y2="220" />
        <line x1="400" y1="0" x2="250" y2="220" />
      </g>
      <rect x="150" y="220" width="100" height="0.5" fill="oklch(1 0 0 / 8%)" />
      {/* Ajtók bal/jobb oldalon, geometrikus, semleges */}
      {[70, 180, 290, 400].map((y, i) => (
        <g key={i} opacity={0.9 - i * 0.14}>
          <rect x={8 + i * 6} y={y - 60} width="46" height="90" rx="2" fill="oklch(0.3 0.02 262)" stroke="oklch(1 0 0 / 10%)" />
          <rect x={400 - 54 - i * 6} y={y - 60} width="46" height="90" rx="2" fill="oklch(0.3 0.02 262)" stroke="oklch(1 0 0 / 10%)" />
        </g>
      ))}
      {/* Fény a mélyben – borostyán árnyalat, visszafogottan */}
      <ellipse cx="200" cy="225" rx="70" ry="24" fill="url(#corridorGlow)" opacity="0.5" />
      {/* Mennyezeti fénycsíkok */}
      <g stroke="oklch(0.62 0.09 246 / 25%)" strokeWidth="2">
        <line x1="60" y1="30" x2="160" y2="215" />
        <line x1="340" y1="30" x2="240" y2="215" />
      </g>
    </svg>
  );
}
