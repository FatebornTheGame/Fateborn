import type { CharacterStats } from '../types';

// ─── Config ───────────────────────────────────────────────────────────────────

const SIZE = 260;
const CX   = SIZE / 2;
const CY   = SIZE / 2;
const R    = 88;          // max axis radius
const LR   = R + 22;      // label radius

const STATS: Array<{ key: keyof CharacterStats; label: string; color: string }> = [
  { key: 'logica',      label: 'Lógica',      color: '#7eb8f7' },
  { key: 'disciplina',  label: 'Disciplina',   color: '#7eb8f7' },
  { key: 'creatividad', label: 'Creatividad',  color: '#7eb8f7' },
  { key: 'ambicion',    label: 'Ambición',     color: '#c9a84c' },
  { key: 'carisma',     label: 'Carisma',      color: '#c9a84c' },
  { key: 'emocional',   label: 'Emocional',    color: '#c9a84c' },
  { key: 'estabilidad', label: 'Estabilidad',  color: '#6ee7a0' },
  { key: 'fisico',      label: 'Físico',       color: '#6ee7a0' },
  { key: 'riesgo',      label: 'Riesgo',       color: '#6ee7a0' },
];
const N = STATS.length;

function angle(i: number) { return (i * 2 * Math.PI / N) - Math.PI / 2; }
function pt(i: number, r: number): [number, number] {
  const a = angle(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
function polyPoints(stats: CharacterStats): string {
  return STATS.map((s, i) => {
    const r = (Math.max(0, Math.min(10, stats[s.key])) / 10) * R;
    const [x, y] = pt(i, r);
    return `${x},${y}`;
  }).join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatRadar({
  stats,
  flashMap = {},
  active,
  size = SIZE,
}: {
  stats: CharacterStats;
  flashMap?: Record<string, 'pos' | 'neg'>;
  active: boolean;
  size?: number;
}) {
  const scale = size / SIZE;
  const w     = SIZE * scale;
  const h     = SIZE * scale;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible' }}
    >
      {/* ── Background grid ── */}
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <polygon
          key={lvl}
          points={STATS.map((_, i) => { const [x, y] = pt(i, R * lvl); return `${x},${y}`; }).join(' ')}
          fill="none"
          stroke={lvl === 1 ? 'rgba(201,168,76,0.14)' : 'rgba(201,168,76,0.06)'}
          strokeWidth="1"
        />
      ))}

      {/* ── Axis lines ── */}
      {STATS.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(201,168,76,0.06)" strokeWidth="1" />;
      })}

      {/* ── Stat polygon + vertices (animated group) ── */}
      <g
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: active ? undefined : 'scale(0)',
          animation: active ? 'radar-reveal 1.4s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
        }}
      >
        {/* Filled area */}
        <polygon
          points={polyPoints(stats)}
          fill="rgba(201,168,76,0.22)"
          stroke="#c9a84c"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.4))' }}
        />

        {/* Vertex dots */}
        {STATS.map((s, i) => {
          const r      = (Math.max(0, Math.min(10, stats[s.key])) / 10) * R;
          const [x, y] = pt(i, r);
          const flash  = flashMap[s.key];
          const col    = flash === 'neg' ? '#8b1a2a' : s.color;
          return (
            <circle
              key={`${s.key}-${flash ?? ''}`}
              cx={x} cy={y} r={3.5}
              fill={col}
              style={{
                filter: `drop-shadow(0 0 ${flash ? 10 : 4}px ${col})`,
                animation: flash
                  ? `vertex-flash-${flash} 1s ease forwards`
                  : undefined,
              }}
            />
          );
        })}
      </g>

      {/* ── Axis labels (always visible) ── */}
      {STATS.map((s, i) => {
        const [lx, ly] = pt(i, LR);
        const ta = lx < CX - 6 ? 'end' : lx > CX + 6 ? 'start' : 'middle';
        const flash = flashMap[s.key];
        return (
          <text
            key={s.key}
            x={lx} y={ly}
            textAnchor={ta}
            dominantBaseline="middle"
            fill={flash ? (flash === 'pos' ? '#e8d08a' : '#c06070') : s.color}
            fontSize="8"
            fontFamily="'Cinzel', serif"
            letterSpacing="0.04em"
            fontWeight={flash ? '700' : '400'}
            style={{ opacity: flash ? 1 : 0.65 }}
          >
            {s.label.toUpperCase()}
          </text>
        );
      })}

      {/* ── Center dot ── */}
      <circle cx={CX} cy={CY} r={2.5} fill="rgba(201,168,76,0.35)" />
    </svg>
  );
}
