import { useGameStore } from '../store/gameStore'
import { StatsRadarChart } from '../components/StatsRadarChart'

export function DeathScreen() {
  const gameState = useGameStore(s => s.gameState)
  const setScreen = useGameStore(s => s.setScreen)

  if (!gameState) return null

  const { epitaph, character, stats, legacyScore, ageYears, friends, memories } = gameState
  const deathYear = character.birthYear + ageYears
  const aliveNpcs = friends.filter(f => f.alive).length

  return (
    <div
      className="animate-screen-enter flex flex-col items-center min-h-screen px-4 py-12 gap-8 overflow-y-auto"
      style={{ background: '#0d0b08', position: 'relative' }}
    >
      {/* Atmospheric bg — extra dark capa para muerte */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #100a08 0%, #0d0b08 60%, #050404 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #00000066 100%)' }} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 560 }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
        <span style={{
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.75rem',
          letterSpacing: '0.35em',
          color:         '#C9A84C',
          textShadow:    '0 0 40px #C9A84C33',
          fontWeight:    700,
        }}>
          ✦ EPITAFIO ✦
        </span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
      </div>

      {/* ── Name + dates ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.4em', color: '#8B1A2A', opacity: 0.6 }}>
          {character.birthYear} — {deathYear}
        </p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', letterSpacing: '0.15em', color: '#C9A84C', fontWeight: 700 }}>
          {character.name}
        </h1>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#6b6045', opacity: 0.5, textTransform: 'uppercase' }}>
          {character.country}
        </p>
      </div>

      {/* ── Epitaph text ────────────────────────────────────────────────────── */}
      {epitaph.currentText && (
        <div
          className="animate-fade-in"
          style={{
            position:   'relative',
            zIndex:     1,
            maxWidth:   600,
            width:      '100%',
            padding:    '24px 32px',
            border:     '1px solid #C9A84C33',
            background: '#0f0d0a',
          }}
        >
          {/* Corner decorations */}
          <span style={{ position: 'absolute', top: 6, left: 8, fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#C9A84C', opacity: 0.2 }}>✦</span>
          <span style={{ position: 'absolute', top: 6, right: 8, fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#C9A84C', opacity: 0.2 }}>✦</span>
          <p style={{
            fontFamily:  'Georgia, serif',
            fontStyle:   'italic',
            fontSize:    '1rem',
            lineHeight:  1.8,
            color:       '#b09060',
            textAlign:   'center',
          }}>
            {epitaph.currentText}
          </p>
        </div>
      )}

      {/* ── Stats radar ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#6b6045', textTransform: 'uppercase' }}>
          Perfil final
        </p>
        <StatsRadarChart stats={stats} size={260} />
      </div>

      {/* ── Legacy grid ─────────────────────────────────────────────────────── */}
      <div style={{
        position:            'relative',
        zIndex:              1,
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 12,
        width:               '100%',
        maxWidth:            400,
      }}>
        {[
          { label: 'Legado',   value: legacyScore },
          { label: 'Años',     value: ageYears    },
          { label: 'Memorias', value: memories.length },
          { label: 'Amigos',   value: friends.length  },
          { label: 'Viven',    value: aliveNpcs       },
          { label: 'Hitos',    value: epitaph.seeds.length },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              padding:       '12px 8px',
              gap:           4,
              border:        '1px solid #2a2620',
              background:    '#0f0d0a',
            }}
          >
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.25rem', fontWeight: 700, color: '#C9A84C' }}>
              {stat.value}
            </span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', letterSpacing: '0.1em', color: '#6b6045', textTransform: 'uppercase' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 400 }}>
        <button
          onClick={() => setScreen('start')}
          style={{
            width:         '100%',
            padding:       '16px 56px',
            fontFamily:    'Cinzel, serif',
            fontSize:      '0.85rem',
            letterSpacing: '0.3em',
            background:    'transparent',
            border:        '1px solid #C9A84C',
            color:         '#C9A84C',
            cursor:        'pointer',
            transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = '#C9A84C'
            btn.style.color      = '#0d0b08'
            btn.style.boxShadow  = '0 0 32px #C9A84C44'
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'transparent'
            btn.style.color      = '#C9A84C'
            btn.style.boxShadow  = 'none'
          }}
        >
          NUEVA VIDA
        </button>

        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#8B1A2A', opacity: 0.2, textTransform: 'uppercase', paddingBottom: '2rem' }}>
          Modo Dinastía — próximamente
        </p>
      </div>
    </div>
  )
}
