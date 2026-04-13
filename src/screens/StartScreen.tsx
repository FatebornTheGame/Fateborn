import { useState, useEffect, useRef, useCallback } from 'react'
import { useTypingAnimation } from '../hooks/useTypingAnimation'
import { useGameStore } from '../store/gameStore'
import type { Difficulty } from '../store/gameStore'
import { playMusic } from '../utils/audio'
import { MUSIC_OPENING } from '../constants/game.constants'

// ─── Copy ─────────────────────────────────────────────────────────────────────
const LINE_1 = 'DE SU SANGRE NACES.'
const LINE_2 = 'DE TUS DECISIONES TE FORJAS.'

// ─── Timing ───────────────────────────────────────────────────────────────────
const CHAR_SPEED_MS    = 55
const PAUSE_BETWEEN_MS = 1500
const BUTTON_DELAY_MS  = 600
const FALLBACK_MS      = 9000   // show everything if animation stalls

// ─── Difficulty options ───────────────────────────────────────────────────────
const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'historia', label: 'Historia',  desc: 'Sin muerte permanente. Explora la narrativa sin restricciones.' },
  { id: 'fateborn', label: 'Fateborn',  desc: 'Experiencia completa. Cada decisión tiene peso real.' },
  { id: 'ironman',  label: 'Ironman',   desc: 'Una sola vida. Sin guardado. Sin segunda oportunidad.' },
  { id: 'legado',   label: 'Legado',    desc: 'Modo Dinastía. Tu linaje persiste más allá de la muerte.' },
]

// ─── Atmospheric layers (position:fixed, zIndex 0, pointerEvents none) ────────
function AtmosphericBg() {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1408 0%, #0d0b08 60%, #080604 100%)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #000000cc 100%)',
      }} />
    </>
  )
}

export function StartScreen() {
  const setScreen     = useGameStore(s => s.setScreen)
  const setDifficulty = useGameStore(s => s.setDifficulty)
  const difficulty    = useGameStore(s => s.difficulty)

  const [lineIndex,      setLineIndex]      = useState<0 | 1>(0)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [showButton,     setShowButton]     = useState(false)

  const onLine1Complete = useCallback(() => {
    setShowDifficulty(true)
    setTimeout(() => setLineIndex(1), PAUSE_BETWEEN_MS)
  }, [])

  const onLine2Complete = useCallback(() => {
    setTimeout(() => setShowButton(true), BUTTON_DELAY_MS)
  }, [])

  const { displayed: line1 } = useTypingAnimation(
    lineIndex === 0 ? LINE_1 : '',
    CHAR_SPEED_MS,
    lineIndex === 0 ? onLine1Complete : undefined,
  )
  const { displayed: line2 } = useTypingAnimation(
    lineIndex === 1 ? LINE_2 : '',
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
      <AtmosphericBg />

      {/* ── Content wrapper ─────────────────────────────────────────────────── */}
      <div className="animate-screen-enter" style={{
        position:       'relative',
        zIndex:         1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        width:          '100%',
        maxWidth:       '520px',
      }}>

        {/* ── Logo ──────────────────────────────────────────────────────────── */}
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
            filter:        'drop-shadow(0 0 40px #C9A84C33)',
          }}
        />

        {/* ── Tagline ───────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', minHeight: '5rem', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily:    'Cinzel, serif',
            color:         '#8a7a5a',
            fontSize:      '0.75rem',
            letterSpacing: '0.4em',
            margin:        '0 0 0.65rem',
            minHeight:     '1.5em',
          }}>
            {lineIndex === 0 ? line1 : LINE_1}
            {lineIndex === 0 && line1.length < LINE_1.length && (
              <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </p>

          <p style={{
            fontFamily:    'Cinzel, serif',
            color:         '#8a7a5a',
            fontSize:      '0.75rem',
            letterSpacing: '0.4em',
            margin:        0,
            minHeight:     '1.5em',
            opacity:       lineIndex === 1 ? 1 : 0,
            transition:    'opacity 0.4s ease',
          }}>
            {line2}
            {lineIndex === 1 && line2.length > 0 && line2.length < LINE_2.length && (
              <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
            )}
          </p>
        </div>

        {/* ── CTA + Difficulty ────────────────────────────────────────────────── */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '2rem',
          width:         '100%',
          opacity:       showButton ? 1 : 0,
          transition:    'opacity 0.8s ease',
        }}>

          {/* Button */}
          <button
            onClick={() => setScreen('ancestors')}
            style={{
              background:    'transparent',
              border:        '1px solid #C9A84C',
              color:         '#C9A84C',
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.85rem',
              letterSpacing: '0.3em',
              padding:       '16px 56px',
              minHeight:     '52px',
              cursor:        'pointer',
              width:         '100%',
              transition:    'background 0.25s cubic-bezier(0.4,0,0.2,1), color 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)',
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

          {/* Difficulty selector — shown after line 1 completes */}
          {showDifficulty && (
            <div style={{ width: '100%' }}>
              <p style={{
                fontFamily:    'Cinzel, serif',
                color:         '#6b6045',
                fontSize:      '0.6rem',
                letterSpacing: '0.22em',
                textAlign:     'center',
                margin:        '0 0 0.75rem',
              }}>
                DIFICULTAD
              </p>
              {/* 2×2 grid on mobile, row on wider screens */}
              <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap:                 '0.5rem',
              }}>
                {DIFFICULTIES.map(d => {
                  const active = difficulty === d.id
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      style={{
                        background:  active ? '#1e1a12' : '#0f0d0a',
                        border:      active ? '2px solid #C9A84C' : '1px solid #2a2620',
                        boxShadow:   active ? '0 0 16px #C9A84C22' : 'none',
                        padding:     '0.65rem 0.75rem',
                        minHeight:   '60px',
                        cursor:      'pointer',
                        textAlign:   'left',
                        display:     'flex',
                        flexDirection: 'column',
                        gap:         '0.25rem',
                        transition:  'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      <span style={{
                        fontFamily:    'Cinzel, serif',
                        fontSize:      '0.7rem',
                        letterSpacing: '0.15em',
                        color:         active ? '#C9A84C' : '#6b6045',
                      }}>
                        {d.label}
                      </span>
                      <span style={{
                        fontSize:   '0.6rem',
                        color:      active ? '#6b6045' : '#3a3228',
                        fontFamily: 'Georgia, serif',
                        fontStyle:  'italic',
                        lineHeight: 1.3,
                      }}>
                        {d.desc}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </div>{/* /content wrapper */}

      {/* ── Music credit ────────────────────────────────────────────────────── */}
      <p style={{
        position:      'fixed',
        bottom:        '0.75rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.5rem',
        letterSpacing: '0.15em',
        color:         '#2a2620',
        whiteSpace:    'nowrap',
        zIndex:        1,
        pointerEvents: 'none',
      }}>
        Música: Serat — Piano Textures (CC BY)
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
