import { useState, useEffect } from 'react'
import { useGameStore }        from '../store/gameStore'
import { StatsRadarChart }     from '../components/StatsRadarChart'
import { HiddenGenesDisplay }  from '../components/HiddenGenesDisplay'
import { AncestralNarrative }  from '../components/AncestralNarrative'

export function BirthScreen() {
  const inheritedStats    = useGameStore(s => s.inheritedStats)
  const hiddenGenes       = useGameStore(s => s.hiddenGenes)
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const startNewGame      = useGameStore(s => s.startNewGame)
  const setScreen         = useGameStore(s => s.setScreen)

  const [name,      setName]      = useState('')
  const [gender,    setGender]    = useState<'hombre' | 'mujer'>('hombre')
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!inheritedStats) return null

  const canConfirm = name.trim().length >= 2

  function handleStart() {
    if (!canConfirm) return
    startNewGame(name.trim(), gender)
  }

  // ── Decorative line shared in header ────────────────────────────────────────
  const decorLine = (
    <div style={{
      maxWidth:   400,
      margin:     '0 auto',
      height:     1,
      width:      '100%',
      background: 'linear-gradient(90deg, transparent, #C9A84C66, transparent)',
    }} />
  )

  // ── Reusable sections ────────────────────────────────────────────────────────

  const narrativeSection = (
    <div style={{ borderLeft: '2px solid #C9A84C33', paddingLeft: 20, marginBottom: 32 }}>
      <AncestralNarrative ancestors={selectedAncestors} country={selectedCountry} />
    </div>
  )

  const chartSection = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#6b6045',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom:  16,
        display:       'block',
        textAlign:     'center',
      }}>
        Stats Heredados
      </span>
      <StatsRadarChart stats={inheritedStats} size={isDesktop ? 320 : 260} />
    </div>
  )

  const genesSection = (
    <>
      <div style={{ height: 1, background: '#2a2620', margin: '24px 0' }} />
      <HiddenGenesDisplay hiddenGenes={hiddenGenes} />
    </>
  )

  const formSection = (
    <div>
      {/* Name */}
      <label style={{
        display:       'block',
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#6b6045',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom:  8,
      }}>
        Nombre
      </label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="El nombre de tu personaje"
        maxLength={32}
        style={{
          width:         '100%',
          background:    '#141210',
          border:        '1px solid #3a3228',
          borderRadius:  2,
          padding:       '14px 16px',
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.9rem',
          color:         '#C9A84C',
          letterSpacing: '0.1em',
          outline:       'none',
          boxSizing:     'border-box',
          transition:    'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
          const el = e.currentTarget as HTMLInputElement
          el.style.borderColor = '#C9A84C66'
          el.style.boxShadow   = '0 0 12px #C9A84C11'
        }}
        onBlur={e => {
          const el = e.currentTarget as HTMLInputElement
          el.style.borderColor = '#3a3228'
          el.style.boxShadow   = 'none'
        }}
      />

      {/* Gender */}
      <label style={{
        display:       'block',
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#6b6045',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginTop:     20,
        marginBottom:  8,
      }}>
        Género
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        {(['hombre', 'mujer'] as const).map(g => {
          const isActive    = gender === g
          const accentColor = g === 'hombre' ? '#C9A84C' : '#8B1A2A'
          const symbol      = g === 'hombre' ? '♂' : '♀'
          const gLabel      = g === 'hombre' ? 'HOMBRE' : 'MUJER'
          return (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                flex:           1,
                padding:        14,
                border:         `1px solid ${isActive ? accentColor : '#2a2620'}`,
                borderRadius:   2,
                background:     isActive ? `${accentColor}0a` : '#141210',
                cursor:         'pointer',
                transition:     'all 0.2s',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            4,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.border     = '1px solid #2e2418'
                  btn.style.background = '#1c1915'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.border     = '1px solid #2a2620'
                  btn.style.background = '#141210'
                }
              }}
            >
              <span style={{ fontSize: '1.4rem', color: isActive ? accentColor : '#3a3228', lineHeight: 1 }}>
                {symbol}
              </span>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: isActive ? accentColor : '#3a3228' }}>
                {gLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const ctaButton = (
    <button
      onClick={canConfirm ? handleStart : undefined}
      disabled={!canConfirm}
      style={{
        width:         '100%',
        padding:       18,
        background:    canConfirm ? '#C9A84C' : '#3a3228',
        color:         '#0d0b08',
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.85rem',
        fontWeight:    700,
        letterSpacing: '0.3em',
        border:        'none',
        borderRadius:  2,
        cursor:        canConfirm ? 'pointer' : 'not-allowed',
        boxShadow:     canConfirm ? '0 0 40px #C9A84C33, 0 4px 20px #00000066' : 'none',
        opacity:       canConfirm ? 1 : 0.3,
        transition:    'all 0.25s',
        marginTop:     32,
      }}
      onMouseEnter={e => {
        if (canConfirm) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = '#d4b05a'
          btn.style.boxShadow  = '0 0 60px #C9A84C44, 0 4px 20px #00000066'
        }
      }}
      onMouseLeave={e => {
        if (canConfirm) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = '#C9A84C'
          btn.style.boxShadow  = '0 0 40px #C9A84C33, 0 4px 20px #00000066'
        }
      }}
    >
      COMENZAR VIDA
    </button>
  )

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="animate-screen-enter"
      style={{ minHeight: '100vh', background: '#0d0b08', position: 'relative', overflowY: 'auto' }}
    >
      {/* ── Atmospheric background ─────────────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #221608 0%, #0d0b08 55%, #080604 100%)' }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #000000cc 100%)' }} />

      {/* ── Back button ────────────────────────────────────────────────────── */}
      <button
        onClick={() => setScreen('ancestors')}
        style={{
          position:      'absolute',
          top:           20,
          left:          24,
          zIndex:        2,
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.65rem',
          color:         '#6b6045',
          background:    'none',
          border:        'none',
          cursor:        'pointer',
          letterSpacing: '0.1em',
          transition:    'color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#C9A84C' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b6045' }}
      >
        ← linaje
      </button>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        position:       'relative',
        zIndex:         1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        '56px 24px 32px',
        gap:            8,
      }}>
        {decorLine}
        <h1 style={{
          fontFamily:    'Cinzel, serif',
          fontSize:      '2rem',
          fontWeight:    700,
          letterSpacing: '0.35em',
          color:         '#C9A84C',
          textShadow:    '0 0 40px #C9A84C33',
          margin:        0,
        }}>
          ✦ HERENCIA ✦
        </h1>
        <p style={{
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.7rem',
          color:         '#6b6045',
          letterSpacing: '0.2em',
          margin:        0,
        }}>
          Lo que llevas en la sangre
        </p>
        {decorLine}
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{
        position:   'relative',
        zIndex:     1,
        maxWidth:   1100,
        margin:     '0 auto',
        padding:    isDesktop ? '0 48px 60px' : '0 20px 60px',
      }}>
        {isDesktop ? (
          /* ── Desktop: two columns ────────────────────────────────────────── */
          <div style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', gap: 48 }}>

            {/* Left: chart + genes */}
            <div>
              {chartSection}
              {genesSection}
            </div>

            {/* Right: narrative + separator + form + button */}
            <div>
              {narrativeSection}
              <div style={{ height: 1, background: '#2a2620', marginBottom: 28 }} />
              {formSection}
              {ctaButton}
            </div>
          </div>
        ) : (
          /* ── Mobile: single column (narrative first) ──────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {narrativeSection}
            {chartSection}
            {genesSection}
            <div style={{ height: 1, background: '#2a2620', margin: '28px 0' }} />
            {formSection}
            {ctaButton}
          </div>
        )}
      </div>
    </div>
  )
}
