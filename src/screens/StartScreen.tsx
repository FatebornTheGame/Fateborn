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

export function StartScreen() {
  const setScreen     = useGameStore(s => s.setScreen)
  const setDifficulty = useGameStore(s => s.setDifficulty)
  const difficulty    = useGameStore(s => s.difficulty)

  const [lineIndex,      setLineIndex]      = useState<0 | 1>(0)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [showButton,     setShowButton]     = useState(false)

  // Stable completion callbacks — fire from inside the interval, never from a render
  const onLine1Complete = useCallback(() => {
    setShowDifficulty(true)
    setTimeout(() => setLineIndex(1), PAUSE_BETWEEN_MS)
  }, [])

  const onLine2Complete = useCallback(() => {
    setTimeout(() => setShowButton(true), BUTTON_DELAY_MS)
  }, [])

  // Two independent hooks, one per line — eliminates stale-isDone race condition
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

  // Fallback: reveal everything after FALLBACK_MS if animation stalls
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    fallbackRef.current = setTimeout(() => {
      setShowDifficulty(true)
      setShowButton(true)
    }, FALLBACK_MS)
    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current) }
  }, [])

  // Music + scroll-to-top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    playMusic(MUSIC_OPENING)
  }, [])

  const ctaVisible = showButton

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0d0b08',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '2rem 1.5rem',
      position:       'relative',
      overflow:       'hidden',
    }}>

      {/* ── Logo (title-only image) ─────────────────────────────────────────── */}
      <img
        src="/fateborn_title.png"
        alt="FATEBORN"
        style={{
          width:          '100%',
          maxWidth:       '520px',
          mixBlendMode:   'screen',
          opacity:        0.93,
          marginBottom:   '2.5rem',
          userSelect:     'none',
          pointerEvents:  'none',
        }}
      />

      {/* ── Tagline ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', minHeight: '5.5rem', marginBottom: '2.5rem' }}>
        {/* Line 1 */}
        <p style={{
          fontFamily: 'Cinzel, serif',
          color:       '#c9a84c',
          fontSize:    'clamp(0.85rem, 3vw, 1.1rem)',
          letterSpacing: '0.2em',
          margin:      '0 0 0.65rem',
          minHeight:   '1.6em',
        }}>
          {lineIndex === 0 ? line1 : LINE_1}
          {lineIndex === 0 && line1.length < LINE_1.length && (
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
          )}
        </p>

        {/* Line 2 — fades in after pause */}
        <p style={{
          fontFamily:    'Cinzel, serif',
          color:         '#d4c5a0',
          fontSize:      'clamp(0.8rem, 2.8vw, 1rem)',
          letterSpacing: '0.14em',
          margin:        0,
          minHeight:     '1.6em',
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
        maxWidth:      '420px',
        opacity:       ctaVisible ? 1 : 0,
        transition:    'opacity 0.8s ease',
        pointerEvents: ctaVisible ? 'auto' : 'none',
      }}>

        {/* Button */}
        <button
          onClick={() => setScreen('ancestors')}
          style={{
            background:    'transparent',
            border:        '2px solid #c9a84c',
            color:         '#c9a84c',
            fontFamily:    'Cinzel, serif',
            fontSize:      '1rem',
            letterSpacing: '0.28em',
            padding:       '0.9rem 3rem',
            minHeight:     '52px',
            cursor:        'pointer',
            width:         '100%',
            transition:    'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = '#c9a84c'
            btn.style.color      = '#0d0b08'
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'transparent'
            btn.style.color      = '#c9a84c'
          }}
        >
          NUEVA VIDA
        </button>

        {/* Difficulty selector */}
        {showDifficulty && (
          <div style={{ width: '100%' }}>
            <p style={{
              fontFamily:    'Cinzel, serif',
              color:         '#555',
              fontSize:      '0.65rem',
              letterSpacing: '0.22em',
              textAlign:     'center',
              margin:        '0 0 0.75rem',
            }}>
              DIFICULTAD
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {DIFFICULTIES.map(d => {
                const active = difficulty === d.id
                return (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    style={{
                      background:    active ? 'rgba(201,168,76,0.10)' : 'transparent',
                      border:        `1px solid ${active ? '#c9a84c' : '#2e2b26'}`,
                      color:         active ? '#c9a84c' : '#555',
                      padding:       '0.65rem 1rem',
                      minHeight:     '44px',
                      cursor:        'pointer',
                      textAlign:     'left',
                      display:       'flex',
                      flexDirection: 'column',
                      gap:           '0.15rem',
                      transition:    'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        const btn = e.currentTarget as HTMLButtonElement
                        btn.style.borderColor = '#444'
                        btn.style.color       = '#888'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        const btn = e.currentTarget as HTMLButtonElement
                        btn.style.borderColor = '#2e2b26'
                        btn.style.color       = '#555'
                      }
                    }}
                  >
                    <span style={{
                      fontFamily:    'Cinzel, serif',
                      fontSize:      '0.75rem',
                      letterSpacing: '0.15em',
                    }}>
                      {d.label}
                    </span>
                    <span style={{
                      fontSize:   '0.7rem',
                      color:      active ? '#a08840' : '#444',
                      fontFamily: 'system-ui, sans-serif',
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

      {/* ── Version stamp ────────────────────────────────────────────────────── */}
      <p style={{
        position:      'absolute',
        bottom:        '1rem',
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.6rem',
        letterSpacing: '0.2em',
        color:         '#8B1A2A',
        opacity:       0.3,
      }}>
        FATEBORN · v0.1
      </p>

      {/* ── Cursor blink keyframe ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
