import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation }                           from 'react-i18next'
import { useTypingAnimation }                       from '../hooks/useTypingAnimation'
import { useGameStore }                             from '../store/gameStore'
import type { Difficulty }                          from '../store/gameStore'
import { playMusic }                                from '../utils/audio'
import { MUSIC_OPENING }                            from '../constants/game.constants'
import { MuteButton }                               from '../components/MuteButton'
import { AtmosphericBackground }                    from '../styles/AtmosphericBackground'
import { setLanguage, SUPPORTED_LANGUAGES }         from '../i18n/index'
import { colors, fonts, transitions }               from '../styles/tokens'

const CHAR_SPEED_MS    = 55
const PAUSE_BETWEEN_MS = 1500
const BUTTON_DELAY_MS  = 600
const FALLBACK_MS      = 9000

const DIFFICULTY_IDS: Difficulty[] = ['historia', 'fateborn', 'ironman', 'legado']

export function StartScreen() {
  const { t, i18n }   = useTranslation()
  const setScreen      = useGameStore(s => s.setScreen)
  const setDifficulty  = useGameStore(s => s.setDifficulty)
  const difficulty     = useGameStore(s => s.difficulty)

  const [lineIndex,      setLineIndex]      = useState<0 | 1>(0)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [showButton,     setShowButton]     = useState(false)
  const [showLang,       setShowLang]       = useState(false)
  const [hoveredDiff,    setHoveredDiff]    = useState<Difficulty | null>(null)

  const line1Text = t('start.line1')
  const line2Text = t('start.line2')

  const onLine1Complete = useCallback(() => {
    setShowDifficulty(true)
    setTimeout(() => setLineIndex(1), PAUSE_BETWEEN_MS)
  }, [])

  const onLine2Complete = useCallback(() => {
    setTimeout(() => setShowButton(true), BUTTON_DELAY_MS)
  }, [])

  const { displayed: line1 } = useTypingAnimation(
    lineIndex === 0 ? line1Text : '',
    CHAR_SPEED_MS,
    lineIndex === 0 ? onLine1Complete : undefined,
  )
  const { displayed: line2 } = useTypingAnimation(
    lineIndex === 1 ? line2Text : '',
    CHAR_SPEED_MS,
    lineIndex === 1 ? onLine2Complete : undefined,
  )

  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    fallbackRef.current = setTimeout(() => {
      setShowDifficulty(true)
      setShowButton(true)
    }, FALLBACK_MS)
    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current) }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    playMusic(MUSIC_OPENING)
  }, [])

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '2rem 1.5rem',
      position:       'relative',
      overflowY:      'auto',
      zIndex:         1,
    }}>
      <AtmosphericBackground />
      <MuteButton />

      {/* Language selector button */}
      <button
        onClick={() => setShowLang(v => !v)}
        style={{
          position:      'fixed',
          top:           16,
          right:         20,
          zIndex:        100,
          fontFamily:    fonts.display,
          fontSize:      '0.55rem',
          letterSpacing: '0.15em',
          color:         colors.text.muted,
          background:    'none',
          border:        `1px solid ${colors.border.default}`,
          padding:       '6px 12px',
          cursor:        'pointer',
          transition:    `color ${transitions.fast}`,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.gold }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.text.muted }}
      >
        {i18n.language.toUpperCase()}
      </button>

      {showLang && (
        <div style={{
          position:  'fixed',
          top:       52,
          right:     20,
          zIndex:    100,
          background: colors.bg.secondary,
          border:    `1px solid ${colors.border.default}`,
          minWidth:  140,
        }}>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setShowLang(false) }}
              style={{
                display:       'block',
                width:         '100%',
                textAlign:     'left',
                padding:       '8px 14px',
                fontFamily:    fonts.display,
                fontSize:      '0.6rem',
                letterSpacing: '0.1em',
                color:         i18n.language === lang.code ? colors.gold : colors.text.muted,
                background:    i18n.language === lang.code ? `${colors.gold}0a` : 'transparent',
                border:        'none',
                cursor:        'pointer',
                transition:    `background ${transitions.fast}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = colors.bg.tertiary }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = i18n.language === lang.code ? `${colors.gold}0a` : 'transparent'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Content wrapper */}
      <div className="animate-screen-enter" style={{
        position:      'relative',
        zIndex:        1,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        width:         '100%',
        maxWidth:      '520px',
      }}>

        {/* Logo */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width:         '100%',
            maxWidth:      '480px',
            mixBlendMode:  'screen',
            opacity:       0.93,
            marginBottom:  '2.5rem',
            userSelect:    'none',
            pointerEvents: 'none',
            filter:        `drop-shadow(0 0 40px ${colors.gold}33)`,
          }}
        />

        {/* Tagline */}
        <div style={{ textAlign: 'center', minHeight: '5rem', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily:    fonts.display,
            color:         colors.text.secondary,
            fontSize:      '0.75rem',
            letterSpacing: '0.4em',
            margin:        '0 0 0.65rem',
            minHeight:     '1.5em',
          }}>
            {lineIndex === 0 ? line1 : line1Text}
            {lineIndex === 0 && line1.length < line1Text.length && (
              <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </p>

          <p style={{
            fontFamily:    fonts.display,
            color:         colors.text.secondary,
            fontSize:      '0.75rem',
            letterSpacing: '0.4em',
            margin:        0,
            minHeight:     '1.5em',
            opacity:       lineIndex === 1 ? 1 : 0,
            transition:    'opacity 0.4s ease',
          }}>
            {line2}
            {lineIndex === 1 && line2.length > 0 && line2.length < line2Text.length && (
              <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </p>
        </div>

        {/* CTA + Difficulty */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '2rem',
          width:         '100%',
          opacity:       showButton ? 1 : 0,
          transition:    'opacity 0.8s ease',
        }}>

          <button
            onClick={() => setScreen('ancestors')}
            style={{
              background:    'transparent',
              border:        `1px solid ${colors.gold}`,
              color:         colors.gold,
              fontFamily:    fonts.display,
              fontSize:      '0.85rem',
              letterSpacing: '0.3em',
              padding:       '16px 56px',
              minHeight:     '52px',
              cursor:        'pointer',
              width:         '100%',
              transition:    `background ${transitions.normal}, color ${transitions.normal}, box-shadow ${transitions.normal}`,
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
            {t('start.cta')}
          </button>

          {/* Difficulty selector */}
          {showDifficulty && (
            <div style={{ width: '100%' }}>
              <p style={{
                fontFamily:    fonts.display,
                color:         colors.text.muted,
                fontSize:      '0.6rem',
                letterSpacing: '0.22em',
                textAlign:     'center',
                margin:        '0 0 0.75rem',
              }}>
                {t('start.difficulty')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {DIFFICULTY_IDS.map(id => {
                  const active    = difficulty === id
                  const isHovered = hoveredDiff === id
                  return (
                    <button
                      key={id}
                      onClick={() => setDifficulty(id)}
                      onMouseEnter={() => setHoveredDiff(id)}
                      onMouseLeave={() => setHoveredDiff(null)}
                      style={{
                        background:    active ? colors.bg.tertiary : colors.bg.card,
                        border:        active ? `2px solid ${colors.gold}` : `1px solid ${colors.border.default}`,
                        boxShadow:     active ? `0 0 16px ${colors.gold}22` : 'none',
                        padding:       '0.65rem 0.75rem',
                        minHeight:     '60px',
                        cursor:        'pointer',
                        textAlign:     'left',
                        display:       'flex',
                        flexDirection: 'column',
                        gap:           '0.25rem',
                        transition:    `all ${transitions.normal}`,
                      }}
                    >
                      <span style={{
                        fontFamily:    fonts.display,
                        fontSize:      '0.7rem',
                        letterSpacing: '0.15em',
                        color:         active ? colors.gold : colors.text.muted,
                      }}>
                        {t(`start.difficulties.${id}.label`)}
                      </span>
                      {/* Descripción: solo visible en hover, opacity 0→1 en 0.2s */}
                      <span style={{
                        fontSize:   '0.6rem',
                        color:      active ? colors.text.muted : colors.border.warm,
                        fontFamily: fonts.body,
                        fontStyle:  'italic',
                        lineHeight: 1.3,
                        opacity:    isHovered || active ? 1 : 0,
                        transition: `opacity 0.2s ease`,
                      }}>
                        {t(`start.difficulties.${id}.desc`)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Music credit */}
      <p style={{
        position:      'fixed',
        bottom:        '0.75rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        fontFamily:    fonts.display,
        fontSize:      '0.5rem',
        letterSpacing: '0.15em',
        color:         colors.border.default,
        whiteSpace:    'nowrap',
        zIndex:        1,
        pointerEvents: 'none',
      }}>
        {t('start.musicCredit')}
      </p>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
