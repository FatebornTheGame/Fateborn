import { useState, useEffect }  from 'react'
import { useTranslation }       from 'react-i18next'
import type { Stats }           from '../types/game.types'
import { colors, fonts }        from '../styles/tokens'

interface Props {
  stats:          Stats
  size:           number
  compareStats?:  Stats
}

const STAT_KEYS: (keyof Stats)[] = [
  'logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad',
]

function statsToPoints(stats: Stats, cx: number, cy: number, r: number): string {
  const count = STAT_KEYS.length
  return STAT_KEYS.map((key, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2
    const ratio = stats[key] / 10
    const x     = cx + r * ratio * Math.cos(angle)
    const y     = cy + r * ratio * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

function gridPoints(cx: number, cy: number, r: number, level: number): string {
  const count = STAT_KEYS.length
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2
    const x     = cx + r * level * Math.cos(angle)
    const y     = cy + r * level * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

const PATH_LEN = 1000

export function StatsRadarChart({ stats, size, compareStats }: Props) {
  const { t }   = useTranslation()
  const cx      = size / 2
  const cy      = size / 2
  const r       = (size / 2) * 0.72
  const count   = STAT_KEYS.length

  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Padding exterior para que los labels no queden cortados en los bordes del SVG
  const pad = 44

  return (
    <svg width={size} height={size} viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}>
      {/* Grid rings */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={gridPoints(cx, cy, r, level)}
          fill="none"
          stroke={colors.border.default}
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {STAT_KEYS.map((key, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2
        const x     = cx + r * Math.cos(angle)
        const y     = cy + r * Math.sin(angle)
        return (
          <line
            key={key}
            x1={cx} y1={cy}
            x2={x.toFixed(2)} y2={y.toFixed(2)}
            stroke={colors.border.default}
            strokeWidth={1}
          />
        )
      })}

      {/* Compare stats */}
      {compareStats && (
        <polygon
          points={statsToPoints(compareStats, cx, cy, r)}
          fill={colors.crimson}
          fillOpacity={0.12}
          stroke={colors.crimson}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
      )}

      {/* Main stats polygon */}
      <polygon
        points={statsToPoints(stats, cx, cy, r)}
        fill={colors.gold}
        fillOpacity={0.03}
        stroke={colors.gold}
        strokeOpacity={0.6}
        strokeWidth={1.5}
        pathLength={PATH_LEN}
        strokeDasharray={PATH_LEN}
        strokeDashoffset={drawn ? 0 : PATH_LEN}
        style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 8px ${colors.gold}33)` }}
      />

      {/* Labels + values — dos líneas separadas con dy="14" para evitar solapamiento */}
      {STAT_KEYS.map((key, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2
        const lr    = r * 1.22
        const x     = cx + lr * Math.cos(angle)
        const y     = cy + lr * Math.sin(angle)
        const value = stats[key]

        return (
          <text key={key} textAnchor="middle">
            {/* Línea 1: abreviatura — Cinzel para labels */}
            <tspan
              x={x.toFixed(2)}
              y={(y - 4).toFixed(2)}
              fill="#6b6045"
              fontSize={10}
              fontFamily={fonts.display}
              letterSpacing="1"
            >
              {t(`statAbbr.${key}`)}
            </tspan>
            {/* Línea 2: valor numérico — Georgia para que el decimal sea legible */}
            <tspan
              x={x.toFixed(2)}
              dy="14"
              fill="#C9A84C"
              fontSize={11}
              fontFamily={fonts.body}
              fontWeight="bold"
            >
              {value.toFixed(1)}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}
