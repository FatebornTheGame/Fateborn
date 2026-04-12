import { useGameStore, getLifeStage } from '../store/gameStore'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const MUTED  = '#3a3530'

const MAX_AGE = 95
const VB_W    = 900
const VB_H    = 60
const LINE_Y  = 38
const TICK_Y1 = LINE_Y - 7
const TICK_Y2 = LINE_Y + 7

const STAGES: { label: string; start: number; end: number; color: string }[] = [
  { label: 'Infancia',     start: 0,  end: 12, color: '#5aa0ff' },
  { label: 'Adolescencia', start: 12, end: 18, color: '#9b6bff' },
  { label: 'Juventud',     start: 18, end: 30, color: GOLD      },
  { label: 'Adultez',      start: 30, end: 50, color: '#ffb84a' },
  { label: 'Madurez',      start: 50, end: 70, color: '#ff7f50' },
  { label: 'Vejez',        start: 70, end: 95, color: GARNET    },
]

function toX(age: number) { return (age / MAX_AGE) * VB_W }

export default function LifeTimeline() {
  const ageYears  = useGameStore(s => s.ageYears)
  const timeline  = useGameStore(s => s.timeline)
  const character = useGameStore(s => s.character)

  const curStage = getLifeStage(ageYears)
  const curX     = toX(Math.min(ageYears, MAX_AGE))

  const evColor = (type: string) =>
    type === 'logro' ? GOLD : type === 'perdida' ? GARNET : '#888'

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#080604f2',
      backdropFilter: 'blur(6px)',
      borderTop: `1px solid ${GOLD}44`,
      height: 64,
      padding: '0 0.5rem',
    }}>
      <style>{`
        @keyframes diamondGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.25); }
        }
        @keyframes glowRing {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0;   transform: scale(2); }
        }
        .diamond-current {
          animation: diamondGlow 2s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .glow-ring {
          animation: glowRing 2s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>

      <div style={{ overflowX: 'auto', height: '100%', overflowY: 'hidden' }}>
        <svg
          width="100%" height={VB_H}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          style={{ minWidth: 420, display: 'block' }}
        >
          {/* ── Línea base ─────────────────────────────────────────────────── */}
          <line x1={0} y1={LINE_Y} x2={VB_W} y2={LINE_Y}
            stroke="#2a2418" strokeWidth={1.5} />

          {/* ── Segmentos de etapa ─────────────────────────────────────────── */}
          {STAGES.map(stage => {
            const x1 = toX(stage.start)
            const x2 = toX(stage.end)
            // Comparación robusta de stage
            const stageId = stage.label.toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const active = curStage === stageId ||
              getLifeStage(ageYears) === stageId.replace('adolescencia','adolescencia')

            return (
              <g key={stage.label}>
                <rect
                  x={x1} y={LINE_Y - 3} width={x2 - x1} height={6}
                  fill={stage.color}
                  opacity={ageYears >= stage.start ? (active ? 0.9 : 0.4) : 0.12}
                  rx={2}
                />
                {/* Label de etapa */}
                {(x2 - x1) > 50 && (
                  <text
                    x={(x1 + x2) / 2} y={LINE_Y - 11}
                    textAnchor="middle" fontSize={7}
                    fill={ageYears >= stage.start ? stage.color : MUTED}
                    fontFamily="Cinzel, serif"
                    opacity={ageYears >= stage.start ? (active ? 1 : 0.6) : 0.35}
                    fontWeight={active ? '700' : '400'}
                  >
                    {stage.label}
                  </text>
                )}
                {/* Tick divisorio */}
                {stage.start > 0 && (
                  <line x1={x1} y1={TICK_Y1} x2={x1} y2={TICK_Y2}
                    stroke={stage.color} strokeWidth={0.8} opacity={0.5} />
                )}
              </g>
            )
          })}

          {/* ── Eventos en timeline ────────────────────────────────────────── */}
          {timeline.map(ev => {
            const x = toX(Math.min(ev.yearOffset, MAX_AGE))
            const c = evColor(ev.type)
            return (
              <g key={ev.id}>
                <circle cx={x} cy={LINE_Y} r={4} fill={c} stroke="#080604" strokeWidth={1.5} />
                <title>{ev.label} (año {ev.yearOffset + (character?.birthYear ?? 1990)})</title>
              </g>
            )
          })}

          {/* ── Anillo de brillo (detrás del diamante) ─────────────────────── */}
          <circle
            className="glow-ring"
            cx={curX} cy={LINE_Y} r={11}
            fill="none" stroke={GOLD} strokeWidth={1.5}
          />

          {/* ── Diamante actual animado ────────────────────────────────────── */}
          <polygon
            className="diamond-current"
            points={`${curX},${LINE_Y - 9} ${curX + 6},${LINE_Y} ${curX},${LINE_Y + 9} ${curX - 6},${LINE_Y}`}
            fill={GOLD}
            stroke="#080604"
            strokeWidth={1.5}
          />

          {/* ── Año / edad actual ──────────────────────────────────────────── */}
          <text
            x={Math.max(22, Math.min(curX, VB_W - 22))} y={VB_H - 3}
            textAnchor="middle" fontSize={7.5}
            fill={GOLD} fontFamily="Cinzel, serif" fontWeight="700"
          >
            {ageYears} años
          </text>

          {/* ── Etiquetas inicio / fin ─────────────────────────────────────── */}
          <text x={4} y={LINE_Y + 15} fontSize={6.5} fill="#443c34" fontFamily="system-ui">
            {character?.birthYear ?? 1990}
          </text>
          <text x={VB_W - 4} y={LINE_Y + 15} fontSize={6.5} fill="#443c34"
            fontFamily="system-ui" textAnchor="end">
            {(character?.birthYear ?? 1990) + MAX_AGE}
          </text>
        </svg>
      </div>
    </div>
  )
}
