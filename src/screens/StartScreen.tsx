import { useState, useEffect } from 'react'
import { useTypingAnimation } from '../hooks/useTypingAnimation'
import { useGameStore } from '../store/gameStore'
import type { Difficulty } from '../store/gameStore'
import { playMusic } from '../utils/audio'
import { MUSIC_OPENING, COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

const TAGLINE_LINES = [
  'DE SU SANGRE NACES.',
  'DE TUS DECISIONES TE FORJAS.',
]

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

  const [lineIndex, setLineIndex]     = useState(0)
  const [showButton, setShowButton]   = useState(false)
  const [phase, setPhase]             = useState<'line1' | 'pause' | 'line2' | 'done'>('line1')

  const currentText = lineIndex < TAGLINE_LINES.length ? TAGLINE_LINES[lineIndex] : ''
  const { displayed, isDone } = useTypingAnimation(currentText, 55)

  // Tagline sequence: line1 → 1.5s pause → line2 → show button
  useEffect(() => {
    if (phase === 'line1' && isDone) {
      setPhase('pause')
      const t = setTimeout(() => {
        setLineIndex(1)
        setPhase('line2')
      }, 1500)
      return () => clearTimeout(t)
    }
    if (phase === 'line2' && isDone) {
      setPhase('done')
      const t = setTimeout(() => setShowButton(true), 600)
      return () => clearTimeout(t)
    }
  }, [isDone, phase])

  // Music on mount
  useEffect(() => {
    playMusic(MUSIC_OPENING)
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
      style={{ background: '#0d0b08' }}
    >
      {/* Banner */}
      <img
        src="/fateborn_banner_nobg.png"
        alt="FATEBORN"
        className="animate-fade-in-slow"
        style={{
          maxWidth:     600,
          width:        '90%',
          mixBlendMode: 'screen',
          userSelect:   'none',
        }}
      />

      {/* Tagline */}
      <div
        className="flex flex-col items-center gap-3 min-h-[72px]"
        style={{ maxWidth: 480 }}
      >
        {/* Line 1: always shown once animation starts */}
        <p
          className="font-cinzel text-center tracking-[0.25em]"
          style={{ color: COLOR_GOLD, opacity: 0.7, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
        >
          {lineIndex === 0 ? displayed : TAGLINE_LINES[0]}
        </p>

        {/* Line 2: shown only after pause */}
        {lineIndex === 1 && (
          <p
            className="font-cinzel text-center tracking-[0.2em]"
            style={{ color: COLOR_GOLD, opacity: 0.85, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
          >
            {displayed}
          </p>
        )}
      </div>

      {/* Difficulty selector */}
      {phase !== 'line1' && (
        <div className="grid grid-cols-2 gap-2 w-full animate-fade-in" style={{ maxWidth: 480 }}>
          {DIFFICULTIES.map(d => {
            const isActive = difficulty === d.id
            return (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className="text-left p-3 transition-all"
                style={{
                  border:     `1px solid ${isActive ? COLOR_GOLD + 'cc' : COLOR_GOLD + '22'}`,
                  background: isActive ? `${COLOR_GOLD}0d` : 'transparent',
                  color:      COLOR_GOLD,
                }}
              >
                <span className="font-cinzel text-xs uppercase tracking-widest block mb-1">
                  {d.title}
                </span>
                <span className="text-[10px] opacity-50 block leading-snug">
                  {d.description}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* CTA button */}
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
