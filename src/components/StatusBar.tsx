import { useGameStore, getLifeStage } from '../store/gameStore'

const GOLD   = '#C9A84C'
const MUTED  = '#555'
const BG     = '#0d0b08'

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `€${(n / 1_000).toFixed(1)}K`
  return `€${Math.round(n)}`
}

// ─── Mini arco SVG de carga vital ────────────────────────────────────────────
function VitalArc({ load }: { load: number }) {
  const R  = 26
  const cx = 32, cy = 32
  const color = load <= 40 ? '#4aff8a' : load <= 70 ? '#ffb84a' : '#ff5a5a'
  const path  = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`
  const pct   = Math.max(0, Math.min(100, load))

  return (
    <svg width={64} height={36} viewBox="0 0 64 36" style={{ overflow: 'visible' }}>
      {/* Track */}
      <path d={path} fill="none" stroke="#2a2420" strokeWidth={6} strokeLinecap="round" />
      {/* Fill */}
      <path
        d={path} fill="none" stroke={color}
        strokeWidth={6} strokeLinecap="round"
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={100 - pct}
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s' }}
      />
      {/* Número */}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
        fontSize={10} fontWeight="700" fill={color} fontFamily="system-ui">
        {Math.round(load)}
      </text>
      <text x={cx} y={cy + 5} textAnchor="middle" dominantBaseline="middle"
        fontSize={6} fill={MUTED} fontFamily="Cinzel, serif" letterSpacing="0.1em">
        VITAL
      </text>
    </svg>
  )
}

export default function StatusBar() {
  const character   = useGameStore(s => s.character)
  const ageYears    = useGameStore(s => s.ageYears)
  const currentYear = useGameStore(s => s.currentYear)
  const vitalLoad   = useGameStore(s => s.vitalLoad)
  const economy     = useGameStore(s => s.economy)
  const career      = useGameStore(s => s.career)
  const legacyScore = useGameStore(s => s.legacyScore)
  const isMuted     = useGameStore(s => s.isMuted)
  const toggleMute  = useGameStore(s => s.toggleMute)

  if (!character) return null

  const stage = getLifeStage(ageYears)
  const STAGE_LABEL: Record<string, string> = {
    infancia: 'Infancia', adolescencia: 'Adolescencia', juventud: 'Juventud',
    adultez: 'Adultez', madurez: 'Madurez', vejez: 'Vejez',
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: `${BG}f0`,
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${GOLD}33`,
      display: 'flex', alignItems: 'center',
      padding: '0 1rem',
      height: 60,
      gap: '0.75rem',
    }}>

      {/* ── Izquierda: Nombre / Edad / País / Año ─────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Cinzel, serif', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
            color: GOLD, fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            {character.name}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#d4c5a0', whiteSpace: 'nowrap' }}>
            {ageYears} años
          </span>
          <span style={{ fontSize: '0.65rem', color: MUTED, whiteSpace: 'nowrap' }}>
            · {STAGE_LABEL[stage]}
          </span>
        </div>
        <div style={{ fontSize: '0.6rem', color: MUTED, letterSpacing: '0.08em', marginTop: 1 }}>
          {character.country} · {currentYear}
        </div>
      </div>

      {/* ── Centro: Carga Vital ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <VitalArc load={vitalLoad} />
      </div>

      {/* ── Derecha: Economía / Carrera / Legado ──────────────────────────── */}
      <div style={{
        textAlign: 'right', flexShrink: 0,
        maxWidth: 'clamp(80px, 26vw, 140px)',
        overflow: 'hidden',
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: GOLD, fontWeight: 700 }}>
          {fmtCurrency(economy.liquidez)}
        </div>
        {career && (
          <div style={{
            fontSize: '0.58rem', color: '#d4c5a0', marginTop: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {career.profesion} · Nv.{career.nivel}
          </div>
        )}
        <div style={{ fontSize: '0.58rem', color: MUTED, marginTop: 1 }}>
          Legado {Math.round(legacyScore)}/100
        </div>
      </div>

      {/* ── Mute ─────────────────────────────────────────────────────────── */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Activar música' : 'Silenciar música'}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: isMuted ? MUTED : GOLD, fontSize: '1rem', padding: '0.25rem',
          flexShrink: 0,
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
