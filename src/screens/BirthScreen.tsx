import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { StatsRadarChart }    from '../components/StatsRadarChart'
import { HiddenGenesDisplay } from '../components/HiddenGenesDisplay'
import { AncestralNarrative } from '../components/AncestralNarrative'

// ─── Decorative header ─────────────────────────────────────────────────────────
function ScreenHeader({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 480, alignSelf: 'center' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C66, transparent)' }} />
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.75rem',
        letterSpacing: '0.35em',
        color:         '#C9A84C',
        textShadow:    '0 0 40px #C9A84C44',
        fontWeight:    700,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C66, transparent)' }} />
    </div>
  )
}

export function BirthScreen() {
  const inheritedStats    = useGameStore(s => s.inheritedStats)
  const hiddenGenes       = useGameStore(s => s.hiddenGenes)
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const startNewGame      = useGameStore(s => s.startNewGame)
  const setScreen         = useGameStore(s => s.setScreen)

  const [name,   setName]   = useState('')
  const [gender, setGender] = useState<'hombre' | 'mujer'>('hombre')

  if (!inheritedStats) return null

  const canConfirm = name.trim().length >= 2

  function handleStart() {
    if (!canConfirm) return
    startNewGame(name.trim(), gender)
  }

  return (
    <div
      className="animate-screen-enter flex flex-col items-center min-h-screen px-4 py-8 gap-6 overflow-y-auto"
      style={{ background: '#0d0b08', position: 'relative' }}
    >
      {/* Atmospheric bg */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1408 0%, #0d0b08 60%, #080604 100%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={() => setScreen('ancestors')}
          style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3a3228', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b6045' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#3a3228' }}
        >
          ← linaje
        </button>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <ScreenHeader label="✦ HERENCIA ✦" />
      </div>

      {/* ── Ancestral narrative ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#141210', borderLeft: '2px solid #C9A84C44', padding: '16px 20px' }}>
          <AncestralNarrative ancestors={selectedAncestors} country={selectedCountry} />
        </div>
      </div>

      {/* ── Stats radar ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#6b6045', textTransform: 'uppercase' }}>
          Stats heredados
        </p>
        <StatsRadarChart stats={inheritedStats} size={280} />
      </div>

      {/* ── Hidden genes ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <div style={{ background: '#141210', padding: '12px 16px', border: '1px solid #2a2620' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#6b6045', textTransform: 'uppercase', marginBottom: 8 }}>
            Genes latentes
          </p>
          <HiddenGenesDisplay hiddenGenes={hiddenGenes} />
        </div>
      </div>

      {/* ── Character creation form ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Name input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#6b6045', textTransform: 'uppercase' }}>
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="El nombre de tu personaje"
            maxLength={32}
            style={{
              padding:     '12px 16px',
              background:  '#141210',
              border:      '1px solid #3a3228',
              color:       '#C9A84C',
              fontFamily:  'Cinzel, serif',
              fontSize:    '0.85rem',
              outline:     'none',
              transition:  'border-color 0.2s',
            }}
            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#C9A84C' }}
            onBlur={e  => { (e.currentTarget as HTMLInputElement).style.borderColor = '#3a3228' }}
          />
        </div>

        {/* Gender selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#6b6045', textTransform: 'uppercase' }}>
            Género
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['hombre', 'mujer'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                style={{
                  flex:          1,
                  padding:       '10px 0',
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  background:    gender === g ? '#C9A84C' : 'transparent',
                  color:         gender === g ? '#0d0b08' : '#6b6045',
                  border:        `1px solid ${gender === g ? '#C9A84C' : '#2a2620'}`,
                  cursor:        'pointer',
                  transition:    'all 0.2s',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <button
        onClick={canConfirm ? handleStart : undefined}
        disabled={!canConfirm}
        style={{
          position:      'relative',
          zIndex:        1,
          width:         '100%',
          maxWidth:      480,
          padding:       '16px 56px',
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.85rem',
          letterSpacing: '0.3em',
          background:    canConfirm ? 'transparent' : 'transparent',
          border:        `1px solid ${canConfirm ? '#C9A84C' : '#2a2620'}`,
          color:         canConfirm ? '#C9A84C' : '#3a3228',
          cursor:        canConfirm ? 'pointer' : 'not-allowed',
          transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          opacity:       canConfirm ? 1 : 0.4,
        }}
        onMouseEnter={e => {
          if (canConfirm) {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = '#C9A84C'
            btn.style.color      = '#0d0b08'
            btn.style.boxShadow  = '0 0 32px #C9A84C44'
          }
        }}
        onMouseLeave={e => {
          if (canConfirm) {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'transparent'
            btn.style.color      = '#C9A84C'
            btn.style.boxShadow  = 'none'
          }
        }}
      >
        NACER
      </button>

      {/* Flavor */}
      <p style={{
        position:      'relative',
        zIndex:        1,
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.5rem',
        letterSpacing: '0.15em',
        color:         '#8B1A2A',
        opacity:       0.2,
        textAlign:     'center',
        textTransform: 'uppercase',
        paddingBottom: '1rem',
      }}>
        Lo que heredas no define lo que serás
      </p>
    </div>
  )
}
