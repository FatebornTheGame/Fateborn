import { useState, useEffect, useRef, useCallback } from 'react'
import { useTypingAnimation } from '../hooks/useTypingAnimation'
import { useGameStore } from '../store/gameStore'
import type { Difficulty } from '../store/gameStore'
import { playMusic } from '../utils/audio'
import { MUSIC_OPENING, COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

const LINE_1 = 'DE SU SANGRE NACES.'
const LINE_2 = 'DE TUS DECISIONES TE FORJAS.'
const CHAR_SPEED_MS   = 55
const PAUSE_BETWEEN   = 1500   // ms between line 1 done and line 2 start
const BUTTON_DELAY    = 600    // ms after line 2 done before button appears
const FALLBACK_SHOW_MS = 9000  // show button unconditionally after this

const DIFFICULTIES: { id: Difficulty; title: string; description: string }[] = [
  {
    id:          'historia',
    title:       'Historia',
    description: 'Las consecuencias son suaves. La narrativa, lo primero.',
  },
  {
    id:          'fateborn',
    title:       'Fateborn',
    description: 'La experiencia diseñada. Consecuencias reales.',
  },
  {
    id:          'ironman',
    title:       'Ironman',
    description: 'Sin red de seguridad. Un error puede costarlo todo.',
  },
  {
    id:          'legado',
    title:       'Legado',
    description: 'El modo más difícil. Para quienes buscan el desafío máximo.',
  },
]

export function StartScreen() {
  const setScreen     = useGameStore(s => s.setScreen)
  const difficulty    = useGameStore(s => s.difficulty)
  const setDifficulty = useGameStore(s => s.setDifficulty)

  const [lineIndex,         setLineIndex]         = useState<0 | 1>(0)
  const [showDifficulty,    setShowDifficulty]     = useState(false)
  const [showButton,        setShowButton]         = useState(false)

  // Stable callbacks for each line's completion — created once via useCallback
  const onLine1Complete = useCallback(() => {
    setShowDifficulty(true)
    setTimeout(() => setLineIndex(1), PAUSE_BETWEEN)
  }, [])

  const onLine2Complete = useCallback(() => {
    setTimeout(() => setShowButton(true), BUTTON_DELAY)
  }, [])

  const activeCompletion = lineIndex === 0 ? onLine1Complete : onLine2Complete
  const activeText       = lineIndex === 0 ? LINE_1 : LINE_2

  const { displayed: line1Displayed } = useTypingAnimation(
    lineIndex === 0 ? LINE_1 : '',
    CHAR_SPEED_MS,
    lineIndex === 0 ? onLine1Complete : undefined,
  )
  const { displayed: line2Displayed } = useTypingAnimation(
    lineIndex === 1 ? LINE_2 : '',
    CHAR_SPEED_MS,
    lineIndex === 1 ? onLine2Complete : undefined,
  )

  // Suppress the "unused variable" lint — activeText/activeCompletion used
  void activeText
  void activeCompletion

  // Fallback: reveal button unconditionally after FALLBACK_SHOW_MS
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    fallbackRef.current = setTimeout(() => {
      setShowDifficulty(true)
      setShowButton(true)
    }, FALLBACK_SHOW_MS)
    return () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current)
    }
  }, [])

  // Music and scroll-to-top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    playMusic(MUSIC_OPENING)
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
      style={{ background: '#0d0b08' }}
    >
      {/* Title logo (text only) */}
      <img
        src="/fateborn_title.png"
        alt="FATEBORN"
        className="animate-fade-in-slow"
        style={{
          maxWidth:     700,
          width:        '90%',
          mixBlendMode: 'screen',
          userSelect:   'none',
        }}
      />

      {/* Tagline */}
      <div
        className="flex flex-col items-center gap-3"
        style={{ maxWidth: 520, minHeight: 64 }}
      >
        {/* Line 1 — persists once started */}
        <p
          className="font-cinzel text-center tracking-[0.25em]"
          style={{ color: COLOR_GOLD, opacity: 0.7, fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}
        >
          {lineIndex === 0 ? line1Displayed : LINE_1}
        </p>

        {/* Line 2 — appears after pause */}
        {lineIndex === 1 && (
          <p
            className="font-cinzel text-center tracking-[0.2em] animate-fade-in"
            style={{ color: COLOR_GOLD, opacity: 0.88, fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}
          >
            {line2Displayed}
          </p>
        )}
      </div>

      {/* Difficulty selector — shown after line 1 completes */}
      {showDifficulty && (
        <div
          className="grid grid-cols-2 gap-2 w-full animate-fade-in"
          style={{ maxWidth: 480 }}
        >
          {DIFFICULTIES.map(d => {
            const isActive = difficulty === d.id
            return (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className="text-left p-3 transition-all"
                style={{
                  border:     `1px solid ${isActive ? COLOR_GOLD : COLOR_GOLD + '33'}`,
                  background: isActive ? `${COLOR_GOLD}14` : 'transparent',
                  color:      COLOR_GOLD,
                  outline:    'none',
                }}
              >
                <span className="font-cinzel text-xs uppercase tracking-widest block mb-1">
                  {d.title}
                </span>
                <span
                  className="text-[10px] block leading-snug"
                  style={{ opacity: isActive ? 0.7 : 0.4 }}
                >
                  {d.description}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* CTA button — shown after line 2 completes (or fallback) */}
      {showButton && (
        <button
          onClick={() => setScreen('ancestors')}
          className="font-cinzel uppercase tracking-[0.3em] px-10 py-4 transition-all animate-fade-in"
          style={{
            minHeight:  44,
            border:     `1px solid ${COLOR_GOLD}`,
            color:      COLOR_GOLD,
            background: 'transparent',
            fontSize:   'clamp(0.8rem, 2vw, 1rem)',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}1a`
            ;(e.currentTarget as HTMLButtonElement).style.color      = '#fff7d6'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color      = COLOR_GOLD
          }}
        >
          Nueva vida
        </button>
      )}

      {/* Footer */}
      <p
        className="absolute bottom-4 text-[10px] tracking-widest opacity-20 font-cinzel"
        style={{ color: COLOR_GARNET }}
      >
        FATEBORN · v0.1
      </p>
    </div>
  )
}
