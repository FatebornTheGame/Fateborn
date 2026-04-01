// ─── Types ────────────────────────────────────────────────────────────────────

export type LifeStage =
  | 'childhood' | 'adolescence' | 'youth'
  | 'adulthood' | 'maturity'   | 'oldage';

export type DominantGroup = 'cognitivo' | 'social' | 'vital';

// ─── Config ───────────────────────────────────────────────────────────────────

const AURA_COLOR: Record<DominantGroup, string> = {
  cognitivo: '#7eb8f7',
  social:    '#c9a84c',
  vital:     '#6ee7a0',
};

const STAGE_SCALE: Record<LifeStage, number> = {
  childhood:   0.65,
  adolescence: 0.82,
  youth:       1.00,
  adulthood:   1.00,
  maturity:    0.94,
  oldage:      0.82,
};

// ─── Silhouette paths (in a 80×100 coordinate space, figure centered at x=40) ─

function MaleSilhouette() {
  return (
    <>
      {/* Head */}
      <circle cx="40" cy="16" r="12" fill="#14100a" />
      {/* Neck */}
      <rect x="36.5" y="28" width="7" height="8" fill="#14100a" />
      {/* Body — trapezoid (broader at shoulders) */}
      <polygon points="22,36 58,36 61,78 19,78" fill="#14100a" />
    </>
  );
}

function FemaleSilhouette() {
  return (
    <>
      {/* Head */}
      <circle cx="40" cy="16" r="12" fill="#14100a" />
      {/* Neck */}
      <rect x="36.5" y="28" width="7" height="8" fill="#14100a" />
      {/* Body — hourglass shape */}
      <path
        d="M24,36 L56,36 L54,52 Q57,62 56,70 L60,78 L20,78 L24,70 Q23,62 26,52 Z"
        fill="#14100a"
      />
    </>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getDominantGroup(stats: {
  logica: number; creatividad: number; disciplina: number;
  carisma: number; emocional: number; ambicion: number;
  fisico: number; riesgo: number; estabilidad: number;
}): DominantGroup {
  const cog  = stats.logica + stats.creatividad + stats.disciplina;
  const soc  = stats.carisma + stats.emocional + stats.ambicion;
  const vit  = stats.fisico + stats.riesgo + stats.estabilidad;
  if (cog >= soc && cog >= vit) return 'cognitivo';
  if (soc >= cog && soc >= vit) return 'social';
  return 'vital';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CharacterPortrait({
  stage,
  gender,
  dominantGroup,
  size = 80,
}: {
  stage: LifeStage;
  gender: 'hombre' | 'mujer';
  dominantGroup: DominantGroup;
  size?: number;
}) {
  const sc   = STAGE_SCALE[stage];
  const aura = AURA_COLOR[dominantGroup];
  const cx   = 40;
  const cy   = 50;           // pivot point for scaling

  // Slight forward lean for oldage
  const lean = stage === 'oldage' ? 'rotate(-5 40 78)' : '';

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 80 96"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`aura-glow-${dominantGroup}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer aura glow */}
      <ellipse
        cx="40" cy="55"
        rx={String(28 * sc)} ry={String(35 * sc)}
        fill={`${aura}14`}
        stroke={aura}
        strokeWidth="0.8"
        filter={`url(#aura-glow-${dominantGroup})`}
        className="portrait-aura"
        style={{ opacity: 0.7 }}
      />

      {/* Silhouette */}
      <g transform={`translate(${cx},${cy}) scale(${sc}) translate(${-cx},${-cy}) ${lean}`}>
        {gender === 'hombre' ? <MaleSilhouette /> : <FemaleSilhouette />}
      </g>

      {/* Inner ring */}
      <ellipse
        cx="40" cy="54"
        rx={String(16 * sc)} ry={String(20 * sc)}
        fill="none"
        stroke={aura}
        strokeWidth="0.5"
        style={{ opacity: 0.3 }}
      />
    </svg>
  );
}
