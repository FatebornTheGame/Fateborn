import { useTranslation }              from 'react-i18next'
import { useGameStore }               from '../store/gameStore'
import { StatsRadarChart }            from '../components/StatsRadarChart'
import { MuteButton }                 from '../components/MuteButton'
import { AtmosphericBackground }      from '../styles/AtmosphericBackground'
import { colors, fonts }              from '../styles/tokens'

export function DeathScreen() {
  const { t }       = useTranslation()
  const gameState   = useGameStore(s => s.gameState)
  const setScreen   = useGameStore(s => s.setScreen)
  const startDynasty = useGameStore(s => s.startDynasty)

  if (!gameState) return null

  const { epitaph, character, stats, legacyScore, ageYears, friends, memories } = gameState
  const deathYear  = character.birthYear + ageYears
  const aliveNpcs  = friends.filter(f => f.alive).length

  return (
    <div
      className="animate-screen-enter flex flex-col items-center min-h-screen px-4 py-12 gap-8 overflow-y-auto"
      style={{ background: colors.bg.primary, position: 'relative' }}
    >
      <MuteButton />
      <AtmosphericBackground variant="death" />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 560 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${colors.gold}44, transparent)` }} />
        <span style={{
          fontFamily:    fonts.display,
          fontSize:      '0.75rem',
          letterSpacing: '0.35em',
          color:         colors.gold,
          textShadow:    `0 0 40px ${colors.gold}33`,
          fontWeight:    700,
        }}>
          {t('death.header')}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${colors.gold}44, transparent)` }} />
      </div>

      {/* Name + dates */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <p style={{ fontFamily: fonts.display, fontSize: '0.6rem', letterSpacing: '0.4em', color: colors.crimson, opacity: 0.6 }}>
          {character.birthYear} — {deathYear}
        </p>
        <h1 style={{ fontFamily: fonts.display, fontSize: '1.5rem', letterSpacing: '0.15em', color: colors.gold, fontWeight: 700 }}>
          {character.name}
        </h1>
        <p style={{ fontFamily: fonts.display, fontSize: '0.6rem', letterSpacing: '0.2em', color: colors.text.muted, opacity: 0.5, textTransform: 'uppercase' }}>
          {character.country}
        </p>
      </div>

      {/* Epitaph text */}
      {epitaph.currentText && (
        <div
          className="animate-fade-in"
          style={{
            position:   'relative',
            zIndex:     1,
            maxWidth:   600,
            width:      '100%',
            padding:    '24px 32px',
            border:     `1px solid ${colors.gold}33`,
            background: colors.bg.card,
          }}
        >
          <span style={{ position: 'absolute', top: 6, left: 8, fontFamily: fonts.display, fontSize: '0.6rem', color: colors.gold, opacity: 0.2 }}>✦</span>
          <span style={{ position: 'absolute', top: 6, right: 8, fontFamily: fonts.display, fontSize: '0.6rem', color: colors.gold, opacity: 0.2 }}>✦</span>
          <p style={{ fontFamily: fonts.body, fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.8, color: colors.text.narrative, textAlign: 'center' }}>
            {epitaph.currentText}
          </p>
        </div>
      )}

      {/* Stats radar */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <p style={{ fontFamily: fonts.display, fontSize: '0.55rem', letterSpacing: '0.2em', color: colors.text.muted, textTransform: 'uppercase' }}>
          {t('death.finalProfile')}
        </p>
        <StatsRadarChart stats={stats} size={260} />
      </div>

      {/* Legacy grid */}
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
          { tKey: 'death.stats.legado',   value: legacyScore          },
          { tKey: 'death.stats.anos',     value: ageYears             },
          { tKey: 'death.stats.memorias', value: memories.length      },
          { tKey: 'death.stats.amigos',   value: friends.length       },
          { tKey: 'death.stats.viven',    value: aliveNpcs            },
          { tKey: 'death.stats.hitos',    value: epitaph.seeds.length },
        ].map(stat => (
          <div
            key={stat.tKey}
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              padding:       '12px 8px',
              gap:           4,
              border:        `1px solid ${colors.border.default}`,
              background:    colors.bg.card,
            }}
          >
            <span style={{ fontFamily: fonts.display, fontSize: '1.25rem', fontWeight: 700, color: colors.gold }}>
              {stat.value}
            </span>
            <span style={{ fontFamily: fonts.display, fontSize: '0.45rem', letterSpacing: '0.1em', color: colors.text.muted, textTransform: 'uppercase' }}>
              {t(stat.tKey)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 400 }}>
        <button
          onClick={() => setScreen('start')}
          style={{
            width:         '100%',
            padding:       '16px 56px',
            fontFamily:    fonts.display,
            fontSize:      '0.85rem',
            letterSpacing: '0.3em',
            background:    'transparent',
            border:        `1px solid ${colors.gold}`,
            color:         colors.gold,
            cursor:        'pointer',
            transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = colors.gold
            btn.style.color      = colors.bg.primary
            btn.style.boxShadow  = `0 0 32px ${colors.gold}44`
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'transparent'
            btn.style.color      = colors.gold
            btn.style.boxShadow  = 'none'
          }}
        >
          {t('death.cta')}
        </button>

        <button
          onClick={() => startDynasty()}
          style={{
            width:         '100%',
            padding:       '12px 40px',
            fontFamily:    fonts.display,
            fontSize:      '0.7rem',
            letterSpacing: '0.25em',
            background:    'transparent',
            border:        `1px solid ${colors.crimson}44`,
            color:         `${colors.crimson}77`,
            cursor:        'pointer',
            transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            paddingBottom: '12px',
            marginBottom:  '2rem',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.borderColor = `${colors.crimson}88`
            b.style.color       = colors.crimson
            b.style.boxShadow   = `0 0 20px ${colors.crimson}22`
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.borderColor = `${colors.crimson}44`
            b.style.color       = `${colors.crimson}77`
            b.style.boxShadow   = 'none'
          }}
        >
          {t('death.dynasty')}
        </button>
      </div>
    </div>
  )
}
