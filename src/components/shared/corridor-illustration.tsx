export function CorridorIllustration({ className, dim = false }: { className?: string; dim?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="corridorFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.22 0.008 262)" />
          <stop offset="100%" stopColor="oklch(0.1 0.006 262)" />
        </linearGradient>
        <radialGradient id="corridorGlow" cx="50%" cy="44%" r="38%">
          <stop offset="0%" stopColor="oklch(0.68 0.09 75 / 30%)" />
          <stop offset="100%" stopColor="oklch(0.68 0.09 75 / 0%)" />
        </radialGradient>
        <radialGradient id="corridorVignette" cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.55" />
        </radialGradient>
        <filter id="corridorGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.025 0" />
        </filter>
      </defs>

      <rect width="400" height="500" fill="url(#corridorFloor)" />

      <g stroke="oklch(1 0 0 / 6%)" strokeWidth="1">
        <line x1="0" y1="500" x2="150" y2="215" />
        <line x1="400" y1="500" x2="250" y2="215" />
        <line x1="0" y1="0" x2="150" y2="215" />
        <line x1="400" y1="0" x2="250" y2="215" />
      </g>

      {[70, 180, 290, 400].map((y, i) => (
        <g key={i} opacity={0.85 - i * 0.15}>
          <rect x={6 + i * 6} y={y - 58} width="44" height="86" fill="oklch(0.27 0.008 262)" stroke="oklch(1 0 0 / 7%)" />
          <rect x={400 - 50 - i * 6} y={y - 58} width="44" height="86" fill="oklch(0.27 0.008 262)" stroke="oklch(1 0 0 / 7%)" />
        </g>
      ))}

      <rect x="0" y="0" width="400" height="500" fill="url(#corridorGlow)" />
      <g stroke="oklch(0.64 0.045 238 / 22%)" strokeWidth="1.5">
        <line x1="55" y1="20" x2="158" y2="212" />
        <line x1="345" y1="20" x2="242" y2="212" />
      </g>

      <rect x="0" y="0" width="400" height="500" fill="url(#corridorVignette)" />
      <rect x="0" y="0" width="400" height="500" filter="url(#corridorGrain)" opacity="0.5" />
      {dim && <rect x="0" y="0" width="400" height="500" fill="black" opacity="0.28" />}
    </svg>
  );
}
