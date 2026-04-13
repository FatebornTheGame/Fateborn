import { useState, useEffect } from 'react'
import type { Stats } from '../types/game.types'

interface Props {
  stats: Stats
  size:  number
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
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2
    const ratio = stats[key] / 10
    const x     = cx + r * ratio * Math.cos(angle)
    const y     = cy + r * ratio * Math.sin(angle)
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

// Normalised path length — using pathLength="1000" on the polygon
// allows strokeDasharray/offset to be in 0-1000 space.
const PATH_LEN = 1000

export function StatsRadarChart({ stats, size, compareStats }: Props) {
  const cx    = size / 2
  const cy    = size / 2
  const r     = (size / 2) * 0.72
  const count = STAT_LABELS.length

  // Animate stroke draw-on at mount: dashoffset goes from full → 0
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={gridPoints(cx, cy, r, level)}
          fill="none"
          stroke="#2a2620"
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
            stroke="#2a2620"
            strokeWidth={1}
          />
        )
      })}

      {/* Compare stats (background layer) */}
      {compareStats && (
        <polygon
          points={statsToPoints(compareStats, cx, cy, r)}
          fill="#8B1A2A"
          fillOpacity={0.12}
          stroke="#8B1A2A"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
      )}

      {/* Main stats polygon — animated draw-on */}
      <polygon
        points={statsToPoints(stats, cx, cy, r)}
        fill="#C9A84C"
        fillOpacity={0.1}
        stroke="#C9A84C"
        strokeOpacity={0.88}
        strokeWidth={1.5}
        pathLength={PATH_LEN}
        strokeDasharray={PATH_LEN}
        strokeDashoffset={drawn ? 0 : PATH_LEN}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />

      {/* Stat labels + values */}
      {STAT_LABELS.map(([key, label], i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2
        const lr    = r * 1.2
        const x     = cx + lr * Math.cos(angle)
        const y     = cy + lr * Math.sin(angle)
        const value = stats[key]

        return (
          <g key={label}>
            <text
              x={x.toFixed(2)}
              y={(y - 5).toFixed(2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#6b6045"
              fontSize={size * 0.05}
              fontFamily="Cinzel, serif"
              letterSpacing="1"
            >
              {label}
            </text>
            <text
              x={x.toFixed(2)}
              y={(y + 7).toFixed(2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#C9A84C"
              fillOpacity={0.9}
              fontSize={size * 0.06}
              fontFamily="Cinzel, serif"
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
