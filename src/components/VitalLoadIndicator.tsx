import type { CharacterStats } from '../types';

// ─── Config ───────────────────────────────────────────────────────────────────

const RADIUS  = 14;
const STROKE  = 3;
const CIRC    = 2 * Math.PI * RADIUS;   // ≈ 87.96
const SIZE    = (RADIUS + STROKE + 4) * 2;

function computeCarga(stats: CharacterStats): number {
  const avg = (stats.fisico + stats.estabilidad + stats.emocional) / 3;
  return Math.round(((10 - avg) / 10) * 100);
}

function arcColor(carga: number): string {
  if (carga <= 40) return '#5fba7d';   // verde — carga baja
  if (carga <= 70) return '#d4a84c';   // amarillo — carga media
  return '#c44040';                    // rojo — carga alta
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VitalLoadIndicator({
  stats,
  visible,
}: {
  stats: CharacterStats;
  visible: boolean;
}) {
  if (!visible) return null;

  const carga   = computeCarga(stats);
  const color   = arcColor(carga);
  const isRed   = carga > 70;
  // Arc fill: percentage of circumference to show
  const filled  = (carga / 100) * CIRC;

  return (
    <div
      className={isRed ? 'vital-pulse-active' : undefined}
      title={`Carga vital: ${carga}%`}
      style={{
        position:  'fixed',
        top:       '64px',
        right:     '20px',
        zIndex:    10001,
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:       '2px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Circular arc */}
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Track ring */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth={STROKE}
        />
        {/* Arc fill — rotated to start at 12 o'clock */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRC - filled}`}
          strokeDashoffset={CIRC / 4}   // rotate start to top
          style={{
            filter:     `drop-shadow(0 0 4px ${color})`,
            transition: 'stroke-dasharray 0.8s ease, stroke 0.5s ease',
          }}
        />
        {/* Heart icon in center */}
        <text
          x={SIZE / 2} y={SIZE / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill={color}
          style={{ opacity: 0.9 }}
        >
          ♥
        </text>
      </svg>

      {/* Numeric label */}
      <span style={{
        fontFamily:    '"Cinzel", serif',
        fontSize:      '7px',
        letterSpacing: '0.04em',
        color:         color,
        opacity:       0.75,
      }}>
        {carga}%
      </span>
    </div>
  );
}
