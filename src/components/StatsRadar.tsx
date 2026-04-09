import type { CharacterStats } from '../types/game.types'

// ─── 6 ejes representativos (2 por grupo) ────────────────────────────────────
const AXES: { key: keyof CharacterStats; label: string; color: string }[] = [
  { key: 'logica',      label: 'Lógica',      color: '#4a9eff' }, // top
  { key: 'ambicion',    label: 'Ambición',     color: '#C9A84C' }, // top-right
  { key: 'fisico',      label: 'Físico',       color: '#4aff8a' }, // bottom-right
  { key: 'estabilidad', label: 'Estabilidad',  color: '#4aff8a' }, // bottom
  { key: 'carisma',     label: 'Carisma',      color: '#C9A84C' }, // bottom-left
  { key: 'creatividad', label: 'Creatividad',  color: '#4a9eff' }, // top-left
]

const SIZE   = 240
const CX     = SIZE / 2
const CY     = SIZE / 2
const R      = 88   // radio máximo (valor 10)
const RINGS  = [0.25, 0.5, 0.75, 1]
const LABEL_OFFSET = 16

function polar(angleDeg: number, radius: number): [number, number] {
  const rad = (Math.PI / 180) * angleDeg
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)]
}

// Ángulo del eje i: empieza arriba (-90°), 60° por eje
function axisAngle(i: number) { return -90 + 60 * i }

function hexPoints(radius: number): string {
  return AXES.map((_, i) => {
    const [x, y] = polar(axisAngle(i), radius)
    return `${x},${y}`
  }).join(' ')
}

function dataPoints(stats: CharacterStats): string {
  return AXES.map(({ key }, i) => {
    const val = Math.max(0, Math.min(10, stats[key] ?? 0))
    const [x, y] = polar(axisAngle(i), (val / 10) * R)
    return `${x},${y}`
  }).join(' ')
}

interface Props {
  stats: CharacterStats
  animDelay?: number  // ms antes de que empiece la animación
}

export default function StatsRadar({ stats, animDelay = 0 }: Props) {
  const delay = `${animDelay}ms`

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <style>{`
        @keyframes radarFadeIn {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dataFadeIn {
          from { opacity: 0; transform: scale(0.2); }
          to   { opacity: 1; transform: scale(1); }
        }
        .radar-shell {
          transform-origin: ${CX}px ${CY}px;
          animation: radarFadeIn 0.7s ease-out both;
        }
        .radar-data {
          transform-origin: ${CX}px ${CY}px;
          animation: dataFadeIn 0.9s ease-out both;
        }
      `}</style>

      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} overflow="visible">

        {/* ── Anillos de fondo ──────────────────────────────────────────────── */}
        <g className="radar-shell" style={{ animationDelay: delay }}>
          {RINGS.map((pct) => (
            <polygon
              key={pct}
              points={hexPoints(R * pct)}
              fill="none"
              stroke="#2a2420"
              strokeWidth={pct === 1 ? 1.5 : 0.8}
            />
          ))}

          {/* ── Ejes ──────────────────────────────────────────────────────── */}
          {AXES.map((ax, i) => {
            const [x, y] = polar(axisAngle(i), R)
            return (
              <line
                key={ax.key}
                x1={CX} y1={CY}
                x2={x}  y2={y}
                stroke="#2a2420"
                strokeWidth={0.8}
              />
            )
          })}

          {/* ── Hexágono exterior ─────────────────────────────────────────── */}
          <polygon
            points={hexPoints(R)}
            fill="none"
            stroke="#C9A84C44"
            strokeWidth={1.5}
          />
        </g>

        {/* ── Polígono de datos ─────────────────────────────────────────────── */}
        <g className="radar-data" style={{ animationDelay: `${animDelay + 200}ms` }}>
          <polygon
            points={dataPoints(stats)}
            fill="#C9A84C18"
            stroke="#C9A84C"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* Puntos en cada vértice */}
          {AXES.map(({ key }, i) => {
            const val = Math.max(0, Math.min(10, stats[key] ?? 0))
            const [x, y] = polar(axisAngle(i), (val / 10) * R)
            return (
              <circle key={key} cx={x} cy={y} r={3}
                fill="#C9A84C" stroke="#0d0b08" strokeWidth={1} />
            )
          })}
        </g>

        {/* ── Etiquetas (fuera del grupo animado para que no se escalen) ─────── */}
        {AXES.map((ax, i) => {
          const angle = axisAngle(i)
          const [x, y] = polar(angle, R + LABEL_OFFSET)
          const val = Math.max(0, Math.min(10, stats[ax.key] ?? 0))
          // Alinear texto según posición
          const anchor = x < CX - 4 ? 'end' : x > CX + 4 ? 'start' : 'middle'
          return (
            <g key={ax.key}>
              <text
                x={x} y={y - 2}
                textAnchor={anchor}
                dominantBaseline="auto"
                fontSize={8}
                fill={ax.color}
                fontFamily="Cinzel, serif"
                letterSpacing="0.05em"
              >
                {ax.label}
              </text>
              <text
                x={x} y={y + 9}
                textAnchor={anchor}
                dominantBaseline="auto"
                fontSize={9}
                fill="#d4c5a0"
                fontFamily="system-ui"
                fontWeight="600"
              >
                {val.toFixed(1)}
              </text>
            </g>
          )
        })}

        {/* ── Punto central ─────────────────────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={2} fill="#C9A84C88" />
      </svg>
    </div>
  )
}
