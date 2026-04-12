import type { Stats } from '../types/game.types'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  stats: Stats
  size:  number
  /**
   * Optional second stats layer (e.g., ancestor stats) drawn behind the main layer.
   * Used in BirthScreen to show inherited vs raw.
   */
  compareStats?: Stats
}

const STAT_LABELS: [keyof Stats, string][] = [
  ['logica',      'LÓG'],
  ['creatividad', 'CRE'],
  ['disciplina',  'DIS'],
  ['carisma',     'CAR'],
  ['emocional',   'EMO'],
  ['ambicion',    'AMB'],
  ['fisico',      'FÍS'],
  ['riesgo',      'RIE'],
  ['estabilidad', 'EST'],
]

function statsToPoints(stats: Stats, cx: number, cy: number, r: number): string {
  const count = STAT_LABELS.length
  return STAT_LABELS.map(([key], i) => {
    const angle  = (i / count) * 2 * Math.PI - Math.PI / 2
    const ratio  = stats[key] / 10
    const x      = cx + r * ratio * Math.cos(angle)
    const y      = cy + r * ratio * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

function gridPoints(cx: number, cy: number, r: number, level: number): string {
  const count = STAT_LABELS.length
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2
    const x     = cx + r * level * Math.cos(angle)
    const y     = cy + r * level * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

export function StatsRadarChart({ stats, size, compareStats }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r  = (size / 2) * 0.72
  const count = STAT_LABELS.length

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={gridPoints(cx, cy, r, level)}
          fill="none"
          stroke={COLOR_GOLD}
          strokeOpacity={0.12}
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {STAT_LABELS.map(([, label], i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2
        const x     = cx + r * Math.cos(angle)
        const y     = cy + r * Math.sin(angle)
        return (
          <line
            key={label}
            x1={cx} y1={cy}
            x2={x.toFixed(2)} y2={y.toFixed(2)}
            stroke={COLOR_GOLD}
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        )
      })}

      {/* Compare stats (background) */}
      {compareStats && (
        <polygon
          points={statsToPoints(compareStats, cx, cy, r)}
          fill={COLOR_GARNET}
          fillOpacity={0.15}
          stroke={COLOR_GARNET}
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      )}

      {/* Main stats */}
      <polygon
        points={statsToPoints(stats, cx, cy, r)}
        fill={COLOR_GOLD}
        fillOpacity={0.22}
        stroke={COLOR_GOLD}
        strokeOpacity={0.8}
        strokeWidth={1.5}
      />

      {/* Stat labels */}
      {STAT_LABELS.map(([key, label], i) => {
        const angle  = (i / count) * 2 * Math.PI - Math.PI / 2
        const lr     = r * 1.18
        const x      = cx + lr * Math.cos(angle)
        const y      = cy + lr * Math.sin(angle)
        const value  = stats[key]

        return (
          <g key={label}>
            <text
              x={x.toFixed(2)}
              y={(y - 5).toFixed(2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={COLOR_GOLD}
              fillOpacity={0.5}
              fontSize={size * 0.055}
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              {label}
            </text>
            <text
              x={x.toFixed(2)}
              y={(y + 8).toFixed(2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={COLOR_GOLD}
              fontSize={size * 0.065}
              fontFamily="sans-serif"
              fontWeight="600"
            >
              {value.toFixed(1)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
