import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Difficulty } from '../store/gameStore'

// ─── Typewriter config ────────────────────────────────────────────────────────
const LINE1 = 'DE SU SANGRE NACES.'
const LINE2 = 'DE TUS DECISIONES TE FORJAS.'
const CHAR_MS = 55
const PAUSE_MS = 1500
const BUTTON_DELAY_MS = 8000

// ─── Difficulty options ───────────────────────────────────────────────────────
const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'historia', label: 'Historia',  desc: 'Sin muerte permanente. Explora la narrativa sin restricciones.' },
  { id: 'fateborn', label: 'Fateborn',  desc: 'Experiencia completa. Cada decisión tiene peso real.' },
  { id: 'ironman',  label: 'Ironman',   desc: 'Una sola vida. Sin guardado. Sin segunda oportunidad.' },
  { id: 'legado',   label: 'Legado',    desc: 'Modo Dinastía. Tu linaje persiste más allá de la muerte.' },
]

export default function StartScreen() {
  const setScreen     = useGameStore(s => s.setScreen)
  const setDifficulty = useGameStore(s => s.setDifficulty)
  const difficulty    = useGameStore(s => s.difficulty)

  const [line1, setLine1]         = useState('')
  const [line2, setLine2]         = useState('')
  const [showButton, setShowButton] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // ── Typewriter ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let i = 0
    const t1 = setInterval(() => {
      i++
      setLine1(LINE1.slice(0, i))
      if (i >= LINE1.length) {
        clearInterval(t1)
        setTimeout(() => {
          let j = 0
          const t2 = setInterval(() => {
            j++
            setLine2(LINE2.slice(0, j))
            if (j >= LINE2.length) clearInterval(t2)
          }, CHAR_MS)
        }, PAUSE_MS)
      }
    }, CHAR_MS)
    return () => clearInterval(t1)
  }, [])

  // ── Button reveal ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), BUTTON_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  // ── Music fade in ───────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    audio.play().catch(() => {})
    let vol = 0
    const fade = setInterval(() => {
      vol = Math.min(1, vol + 0.05)
      audio.volume = vol
      if (vol >= 1) clearInterval(fade)
    }, 100)
    return () => clearInterval(fade)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <audio ref={audioRef} src="/music/opening.mp3" loop />

      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <img
        src="/fateborn_banner_nobg.png"
        alt="Fateborn"
        style={{
          width: '100%',
          maxWidth: '480px',
          mixBlendMode: 'screen',
          opacity: 0.92,
          marginBottom: '2rem',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* ── Tagline ────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center',
        minHeight: '5rem',
        marginBottom: '3rem',
      }}>
        <p style={{
          fontFamily: 'Cinzel, serif',
          color: '#c9a84c',
          fontSize: 'clamp(0.85rem, 3vw, 1.1rem)',
          letterSpacing: '0.18em',
          margin: '0 0 0.6rem',
          minHeight: '1.6em',
        }}>
          {line1}
          {line1.length < LINE1.length && (
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
          )}
        </p>
        <p style={{
          fontFamily: 'Cinzel, serif',
          color: '#d4c5a0',
          fontSize: 'clamp(0.8rem, 2.8vw, 1rem)',
          letterSpacing: '0.14em',
          margin: 0,
          minHeight: '1.6em',
          opacity: line2.length > 0 ? 1 : 0,
        }}>
          {line2}
          {line2.length > 0 && line2.length < LINE2.length && (
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
          )}
        </p>
      </div>

      {/* ── CTA + Difficulty ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '400px',
        opacity: showButton ? 1 : 0,
        transition: 'opacity 1s ease',
        pointerEvents: showButton ? 'auto' : 'none',
      }}>
        {/* Botón principal */}
        <button
          onClick={() => setScreen('ancestors')}
          style={{
            background: 'transparent',
            border: '2px solid #c9a84c',
            color: '#c9a84c',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            letterSpacing: '0.25em',
            padding: '0.85rem 3rem',
            minHeight: '44px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#c9a84c'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#0d0b08'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#c9a84c'
          }}
        >
          NUEVA VIDA
        </button>

        {/* Selector de dificultad */}
        <div style={{ width: '100%' }}>
          <p style={{
            fontFamily: 'Cinzel, serif',
            color: '#888',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textAlign: 'center',
            margin: '0 0 0.75rem',
          }}>
            DIFICULTAD
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DIFFICULTIES.map(d => {
              const selected = difficulty === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    background: selected ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: `1px solid ${selected ? '#c9a84c' : '#333'}`,
                    color: selected ? '#c9a84c' : '#666',
                    padding: '0.6rem 1rem',
                    minHeight: '44px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                  }}>
                    {d.label}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: selected ? '#a08840' : '#555',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    {d.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Cursor blink keyframe ───────────────────────────────────────────── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
