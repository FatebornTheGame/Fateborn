import { useState, useEffect }         from 'react'
import { useTranslation }              from 'react-i18next'
import { useGameStore }               from '../store/gameStore'
import { StatsRadarChart }            from '../components/StatsRadarChart'
import { HiddenGenesDisplay }         from '../components/HiddenGenesDisplay'
import { AncestralNarrative }         from '../components/AncestralNarrative'
import { MuteButton }                 from '../components/MuteButton'
import { AtmosphericBackground }      from '../styles/AtmosphericBackground'
import { colors, fonts, transitions } from '../styles/tokens'

export function BirthScreen() {
  const { t }             = useTranslation()
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

  const decorLine = (
    <div style={{
      maxWidth:   400,
      margin:     '0 auto',
      height:     1,
      width:      '100%',
      background: `linear-gradient(90deg, transparent, ${colors.gold}66, transparent)`,
    }} />
  )

  const narrativeSection = (
    <div style={{ borderLeft: `2px solid ${colors.gold}33`, paddingLeft: 20, marginBottom: 32 }}>
      <AncestralNarrative ancestors={selectedAncestors} country={selectedCountry} />
    </div>
  )

  const chartSection = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         colors.text.muted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom:  16,
        display:       'block',
        textAlign:     'center',
      }}>
        {t('birth.statsLabel')}
      </span>
      <StatsRadarChart stats={inheritedStats} size={isDesktop ? 360 : 300} />
    </div>
  )

  const genesSection = (
    <>
      <div style={{ height: 1, background: colors.border.default, margin: '24px 0' }} />
      <HiddenGenesDisplay hiddenGenes={hiddenGenes} />
    </>
  )

  const formSection = (
    <div>
      <label style={{
        display:       'block',
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         colors.text.muted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom:  8,
      }}>
        {t('birth.nameLabel')}
      </label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t('birth.namePlaceholder')}
        maxLength={32}
        style={{
          width:         '100%',
          background:    colors.bg.secondary,
          border:        `1px solid ${colors.border.warm}`,
          borderRadius:  2,
          padding:       '14px 16px',
          fontFamily:    fonts.body,
          fontSize:      '0.9rem',
          color:         colors.gold,
          letterSpacing: '0.05em',
          outline:       'none',
          boxSizing:     'border-box',
          transition:    `border-color ${transitions.fast}, box-shadow ${transitions.fast}`,
        }}
        onFocus={e => {
          const el = e.currentTarget as HTMLInputElement
          el.style.borderColor = `${colors.gold}66`
          el.style.boxShadow   = `0 0 12px ${colors.gold}11`
        }}
        onBlur={e => {
          const el = e.currentTarget as HTMLInputElement
          el.style.borderColor = colors.border.warm
          el.style.boxShadow   = 'none'
        }}
      />

      <label style={{
        display:       'block',
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         colors.text.muted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginTop:     20,
        marginBottom:  8,
      }}>
        {t('birth.genderLabel')}
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        {(['hombre', 'mujer'] as const).map(g => {
          const isActive    = gender === g
          const accentColor = g === 'hombre' ? colors.gold : colors.crimson
          const inactiveColor = g === 'mujer' ? '#6b5535' : colors.border.warm
          const symbol      = g === 'hombre' ? '♂' : '♀'
          const gLabel      = g === 'hombre' ? t('birth.male') : t('birth.female')
          return (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                flex:           1,
                padding:        14,
                border:         `1px solid ${isActive ? accentColor : colors.border.default}`,
                borderRadius:   2,
                background:     isActive ? `${accentColor}0a` : colors.bg.secondary,
                cursor:         'pointer',
                transition:     `all ${transitions.fast}`,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            4,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.border     = `1px solid ${colors.bg.tertiary}`
                  btn.style.background = colors.bg.tertiary
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.border     = `1px solid ${colors.border.default}`
                  btn.style.background = colors.bg.secondary
                }
              }}
            >
              <span style={{ fontSize: '1.4rem', color: isActive ? accentColor : inactiveColor, lineHeight: 1 }}>
                {symbol}
              </span>
              <span style={{ fontFamily: fonts.display, fontSize: '0.6rem', letterSpacing: '0.15em', color: isActive ? accentColor : inactiveColor }}>
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
        background:    canConfirm ? colors.gold : '#1c1915',
        color:         canConfirm ? colors.bg.primary : '#6b6045',
        fontFamily:    fonts.display,
        fontSize:      '0.85rem',
        fontWeight:    700,
        letterSpacing: '0.3em',
        border:        canConfirm ? 'none' : '1px solid #3a3228',
        borderRadius:  2,
        cursor:        canConfirm ? 'pointer' : 'not-allowed',
        boxShadow:     canConfirm ? `0 0 40px ${colors.gold}33, 0 4px 20px #00000066` : 'none',
        opacity:       1,
        transition:    `all ${transitions.normal}`,
        marginTop:     32,
      }}
      onMouseEnter={e => {
        if (canConfirm) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = '#d4b05a'
          btn.style.boxShadow  = `0 0 60px ${colors.gold}44, 0 4px 20px #00000066`
        }
      }}
      onMouseLeave={e => {
        if (canConfirm) {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = colors.gold
          btn.style.boxShadow  = `0 0 40px ${colors.gold}33, 0 4px 20px #00000066`
        }
      }}
    >
      {t('birth.cta')}
    </button>
  )

  return (
    <div
      className="animate-screen-enter"
      style={{ minHeight: '100vh', background: colors.bg.primary, position: 'relative', overflowY: 'auto' }}
    >
      <AtmosphericBackground />
      <MuteButton />

      {/* Back button */}
      <button
        onClick={() => setScreen('ancestors')}
        style={{
          position:      'absolute',
          top:           20,
          left:          24,
          zIndex:        2,
          fontFamily:    fonts.display,
          fontSize:      '0.65rem',
          color:         colors.text.muted,
          background:    'none',
          border:        'none',
          cursor:        'pointer',
          letterSpacing: '0.1em',
          transition:    `color ${transitions.fast}`,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.gold }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.text.muted }}
      >
        {t('birth.back')}
      </button>

      {/* Header */}
      <div style={{
        position:      'relative',
        zIndex:        1,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        padding:       '56px 24px 32px',
        gap:           8,
      }}>
        {decorLine}
        <h1 style={{
          fontFamily:    fonts.display,
          fontSize:      '2rem',
          fontWeight:    700,
          letterSpacing: '0.35em',
          color:         colors.gold,
          textShadow:    `0 0 40px ${colors.gold}33`,
          margin:        0,
        }}>
          {t('birth.title')}
        </h1>
        <p style={{ fontFamily: fonts.display, fontSize: '0.7rem', color: colors.text.muted, letterSpacing: '0.2em', margin: 0 }}>
          {t('birth.subtitle')}
        </p>
        <p style={{ fontFamily: fonts.body, fontStyle: 'italic', fontSize: '0.8rem', color: '#6b5535', lineHeight: 1.7, margin: '4px 0 0', textAlign: 'center', maxWidth: 420 }}>
          {t('birth.context')}
        </p>
        {decorLine}
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex:   1,
        maxWidth: 1100,
        margin:   '0 auto',
        padding:  isDesktop ? '0 48px 60px' : '0 20px 60px',
      }}>
        {isDesktop ? (
          <div style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', gap: 48 }}>
            <div>
              {chartSection}
              {genesSection}
            </div>
            <div>
              {narrativeSection}
              <div style={{ height: 1, background: colors.border.default, marginBottom: 28 }} />
              {formSection}
              {ctaButton}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {narrativeSection}
            {chartSection}
            {genesSection}
            <div style={{ height: 1, background: colors.border.default, margin: '28px 0' }} />
            {formSection}
            {ctaButton}
          </div>
        )}
      </div>
    </div>
  )
}
