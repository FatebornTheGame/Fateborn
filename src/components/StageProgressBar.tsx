import { useTranslation } from 'react-i18next'
import { colors, fonts }  from '../styles/tokens'

interface Stage {
  key:   string
  min:   number
  max:   number | null  // null = vejez (open-ended)
}

const STAGES: Stage[] = [
  { key: 'infancia',     min: 0,  max: 12 },
  { key: 'adolescencia', min: 13, max: 18 },
  { key: 'juventud',     min: 19, max: 30 },
  { key: 'adultez',      min: 31, max: 50 },
  { key: 'madurez',      min: 51, max: 70 },
  { key: 'vejez',        min: 71, max: null },
]

function currentStage(age: number): Stage {
  return STAGES.find(s => s.max === null || age <= s.max) ?? STAGES[STAGES.length - 1]
}

function stagePct(age: number, stage: Stage): number {
  if (stage.max === null) return 1
  const range = stage.max - stage.min
  return Math.min(1, Math.max(0, (age - stage.min) / range))
}

interface Props {
  age: number
}

export function StageProgressBar({ age }: Props) {
  const { t }   = useTranslation()
  const stage   = currentStage(age)
  const pct     = stagePct(age, stage)
  const isVejez = stage.max === null

  return (
    <div style={{
      position:       'fixed',
      top:            56,
      left:           0,
      right:          0,
      zIndex:         90,
      display:        'flex',
      alignItems:     'center',
      gap:            12,
      padding:        '4px 16px',
      background:     colors.bg.primary,
      borderBottom:   `1px solid ${colors.bg.tertiary}`,
    }}>
      {/* Stage label */}
      <span style={{
        fontFamily:    fonts.display,
        fontSize:      '0.5rem',
        letterSpacing: '0.2em',
        color:         colors.gold,
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
        minWidth:      80,
      }}>
        {t(`game.stages.${stage.key}`)}
      </span>

      {/* Progress bar */}
      <div style={{
        flex:         1,
        height:       6,
        background:   colors.bg.tertiary,
        borderRadius: 3,
        overflow:     'hidden',
      }}>
        <div style={{
          height:     '100%',
          width:      `${pct * 100}%`,
          background: 'linear-gradient(to right, #C9A84C, #8B1A2A)',
          borderRadius: 3,
          transition: 'width 0.6s ease',
        }} />
      </div>

      {/* Age counter — hidden for vejez */}
      {!isVejez && (
        <span style={{
          fontFamily:    fonts.display,
          fontSize:      '0.5rem',
          letterSpacing: '0.1em',
          color:         colors.text.muted,
          whiteSpace:    'nowrap',
          minWidth:      48,
          textAlign:     'right',
        }}>
          {age} / {stage.max}
        </span>
      )}
    </div>
  )
}
