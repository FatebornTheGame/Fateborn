import { useGameStore, getLifeStage } from '../store/gameStore'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const MUTED  = '#333'

// ─── Configuración visual ─────────────────────────────────────────────────────
const MAX_AGE   = 90   // años totales en la línea
const VB_W      = 900  // viewBox width
const VB_H      = 56
const LINE_Y    = 36
const TICK_Y1   = LINE_Y - 6
const TICK_Y2   = LINE_Y + 6

const STAGES: { label: string; start: number; end: number; color: string }[] = [
  { label: 'Infancia',       start: 0,  end: 12, color: '#5aa0ff' },
  { label: 'Adolescencia',   start: 12, end: 18, color: '#9b6bff' },
  { label: 'Juventud',       start: 18, end: 30, color: GOLD      },
  { label: 'Adultez',        start: 30, end: 50, color: '#ffb84a' },
  { label: 'Madurez',        start: 50, end: 70, color: '#ff7f50' },
  { label: 'Vejez',          start: 70, end: 90, color: GARNET    },
]

function toX(age: number) { return (age / MAX_AGE) * VB_W }

function Diamond({ x, y, size = 7 }: { x: number; y: number; size?: number }) {
  return (
    <polygon
      points={`${x},${y - size} ${x + size * 0.7},${y} ${x},${y + size} ${x - size * 0.7},${y}`}
      fill={GOLD}
      stroke="#0d0b08"
      strokeWidth={1.5}
    />
  )
}

export default function LifeTimeline() {
  const ageYears = useGameStore(s => s.ageYears)
  const timeline = useGameStore(s => s.timeline)
  const character = useGameStore(s => s.character)

  const currentStage = getLifeStage(ageYears)
  const curX = toX(Math.min(ageYears, MAX_AGE))

  // Colores de eventos
  const evColor = (type: string) =>
    type === 'logro' ? GOLD : type === 'perdida' ? GARNET : '#888'

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#0d0b08f0',
      backdropFilter: 'blur(6px)',
      borderTop: `1px solid ${GOLD}33`,
      height: 64,
      padding: '0 0.5rem',
    }}>
      <div style={{ overflowX: 'auto', height: '100%', overflowY: 'hidden' }}>
        <svg
          width="100%" height={VB_H}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          style={{ minWidth: 420, display: 'block' }}
        >
          {/* ── Segmentos de etapa ─────────────────────────────────────────── */}
          {STAGES.map(stage => {
            const x1 = toX(stage.start)
            const x2 = toX(stage.end)
            const active = currentStage === stage.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              || getLifeStage(ageYears) === stage.label.toLowerCase().replace('í','i').replace('ú','u').replace('é','e')
            return (
              <g key={stage.label}>
                {/* Barra de segmento */}
                <rect
                  x={x1} y={LINE_Y - 3} width={x2 - x1} height={6}
                  fill={stage.color}
                  opacity={ageYears >= stage.start ? (active ? 0.85 : 0.35) : 0.12}
                  rx={2}
                />
                {/* Label de etapa (solo si hay espacio) */}
                {(x2 - x1) > 60 && (
                  <text
                    x={(x1 + x2) / 2} y={LINE_Y - 10}
                    textAnchor="middle" fontSize={6.5}
                    fill={ageYears >= stage.start ? stage.color : MUTED}
                    fontFamily="Cinzel, serif"
                    opacity={ageYears >= stage.start ? 0.85 : 0.4}
                  >
                    {stage.label}
                  </text>
                )}
                {/* Tick divisorio */}
                {stage.start > 0 && (
                  <line x1={x1} y1={TICK_Y1} x2={x1} y2={TICK_Y2}
                    stroke={stage.color} strokeWidth={0.8} opacity={0.4} />
                )}
              </g>
            )
          })}

          {/* ── Línea base ─────────────────────────────────────────────────── */}
          <line x1={0} y1={LINE_Y} x2={VB_W} y2={LINE_Y}
            stroke="#2a2420" strokeWidth={1} />

          {/* ── Eventos en la timeline ─────────────────────────────────────── */}
          {timeline.map(ev => {
            const x = toX(Math.min(ev.yearOffset, MAX_AGE))
            const c = evColor(ev.type)
            return (
              <g key={ev.id}>
                <circle cx={x} cy={LINE_Y} r={4} fill={c} stroke="#0d0b08" strokeWidth={1} />
                <title>{ev.label} (año {ev.yearOffset + (character?.birthYear ?? 1990)})</title>
              </g>
            )
          })}

          {/* ── Posición actual: diamante dorado ───────────────────────────── */}
          <Diamond x={curX} y={LINE_Y} size={8} />

          {/* ── Año actual ─────────────────────────────────────────────────── */}
          <text
            x={Math.max(20, Math.min(curX, VB_W - 20))} y={VB_H - 4}
            textAnchor="middle" fontSize={7}
            fill={GOLD} fontFamily="Cinzel, serif"
          >
            {ageYears} años
          </text>

          {/* ── Etiquetas de inicio / fin ──────────────────────────────────── */}
          <text x={4} y={LINE_Y + 14} fontSize={6} fill={MUTED} fontFamily="system-ui">
            {character?.birthYear ?? 1990}
          </text>
          <text x={VB_W - 4} y={LINE_Y + 14} fontSize={6} fill={MUTED}
            fontFamily="system-ui" textAnchor="end">
            {(character?.birthYear ?? 1990) + MAX_AGE}
          </text>
        </svg>
      </div>
    </div>
  )
}
