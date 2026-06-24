import { useState, useEffect }          from 'react'
import type { StageName }               from '../hooks/useStageTransition'
import { useStageTransition }           from '../hooks/useStageTransition'
import { useTypingAnimation }           from '../hooks/useTypingAnimation'
import { colors, fonts }                from '../styles/tokens'

const STAGE_DATA: Record<StageName, { title: string; phrase: string }> = {
  infancia:     {
    title:  'INFANCIA',
    phrase: 'Los primeros años son los únicos en que el tiempo parece infinito.',
  },
  adolescencia: {
    title:  'ADOLESCENCIA',
    phrase: 'La identidad se construye a trozos, en los peores momentos posibles.',
  },
  juventud: {
    title:  'JUVENTUD',
    phrase: 'La vida empieza a tener peso real. Las decisiones, también.',
  },
  adultez: {
    title:  'ADULTEZ',
    phrase: 'Lo que decides ahora define lo que serás dentro de veinte años.',
  },
  madurez: {
    title:  'MADUREZ',
    phrase: 'El pasado tiene nombre. El futuro también, pero es más corto.',
  },
  vejez: {
    title:  'VEJEZ',
    phrase: 'Queda lo esencial. Todo lo demás ya pasó.',
  },
}

export function StageTransition() {
  const { pendingStage, dismiss } = useStageTransition()

  if (!pendingStage) return null

  // key re-mounts the overlay fresh on each new stage
  return <TransitionOverlay key={pendingStage} stage={pendingStage} onDismiss={dismiss} />
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
interface OverlayProps {
  stage:     StageName
  onDismiss: () => void
}

function TransitionOverlay({ stage, onDismiss }: OverlayProps) {
  const data = STAGE_DATA[stage]

  const [titleDone, setTitleDone] = useState(false)

  const { displayed: titleText } = useTypingAnimation(data.title, 80, () => setTitleDone(true))
  const { displayed: phraseText, isDone: phraseDone } = useTypingAnimation(
    titleDone ? data.phrase : '',
    28,
  )

  // Auto-dismiss after 5 s; skip on any keydown or click on overlay
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    const handleKey = () => onDismiss()
    window.addEventListener('keydown', handleKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [onDismiss])

  return (
    <div
      onClick={onDismiss}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         300,
        background:     '#000000f0',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        userSelect:     'none',
      }}
    >
      {/* Decorative line above */}
      <div style={{
        width:        60,
        height:       1,
        background:   `${colors.gold}44`,
        marginBottom: 32,
      }} />

      {/* Stage title — large Cinzel, typed letter by letter */}
      <div style={{
        fontFamily:    fonts.display,
        fontSize:      'clamp(2rem, 9vw, 4.5rem)',
        letterSpacing: '0.45em',
        color:         colors.gold,
        minHeight:     '1.2em',
        textAlign:     'center',
        paddingRight:  '0.45em', // compensate letterSpacing trailing space
      }}>
        {titleText}
      </div>

      {/* Phrase — appears after title finishes */}
      <div style={{
        marginTop:   28,
        fontFamily:  fonts.body,
        fontSize:    'clamp(0.75rem, 2vw, 0.95rem)',
        letterSpacing: '0.04em',
        color:       colors.text.narrative,
        maxWidth:    480,
        textAlign:   'center',
        lineHeight:  1.9,
        minHeight:   '3em',
        padding:     '0 24px',
        opacity:     titleDone ? 1 : 0,
        transition:  'opacity 0.4s ease',
      }}>
        {phraseText}
      </div>

      {/* Decorative line below */}
      <div style={{
        width:       60,
        height:      1,
        background:  `${colors.gold}44`,
        marginTop:   32,
      }} />

      {/* Skip hint — shown after phrase finishes */}
      {phraseDone && (
        <div style={{
          marginTop:     20,
          fontFamily:    fonts.display,
          fontSize:      '0.45rem',
          letterSpacing: '0.3em',
          color:         colors.text.muted,
          textTransform: 'uppercase',
          animation:     'fadeIn 0.6s ease',
        }}>
          Clic para continuar
        </div>
      )}
    </div>
  )
}
