import { useTranslation }   from 'react-i18next'
import { colors, fonts }    from '../styles/tokens'

interface TimelineEvent {
  age:  number
  id:   string
  type: 'event' | 'consequence' | 'npc'
}

interface Props {
  currentAge: number
  maxAge:     number
  events:     TimelineEvent[]
}

const AGE_MILESTONES = [13, 19, 31, 51, 71]

function stageKey(age: number): string {
  if (age < 13) return 'game.timeline.stages.infancia'
  if (age < 31) return 'game.timeline.stages.juventud'
  if (age < 51) return 'game.timeline.stages.adulto'
  if (age < 71) return 'game.timeline.stages.madurez'
  return 'game.timeline.stages.ancianidad'
}

export function LifeTimeline({ currentAge, maxAge, events }: Props) {
  const { t }        = useTranslation()
  const currentPct   = Math.min(1, currentAge / maxAge)

  function ageToPct(age: number): number {
    return Math.min(1, age / maxAge)
  }

  return (
    <footer style={{
      position:             'fixed',
      bottom:               0,
      left:                 0,
      right:                0,
      zIndex:               50,
      height:               48,
      background:           `${colors.bg.primary}ee`,
      backdropFilter:       'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderTop:            `1px solid ${colors.border.default}`,
      display:              'flex',
      alignItems:           'center',
      padding:              '0 20px',
      gap:                  12,
    }}>
      <svg style={{ flex: 1, height: 16, overflow: 'visible' }} preserveAspectRatio="none">
        {/* Base track */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={colors.bg.tertiary} strokeWidth={2} />
        {/* Progress segment */}
        <line
          x1="0" y1="50%"
          x2={`${(currentPct * 100).toFixed(1)}%`} y2="50%"
          stroke={colors.border.warm} strokeWidth={2}
        />

        {/* Milestone ticks */}
        {AGE_MILESTONES.map(age => {
          const pct     = ageToPct(age)
          const reached = currentAge >= age
          return (
            <circle
              key={age}
              cx={`${(pct * 100).toFixed(1)}%`}
              cy="50%"
              r={2}
              fill={reached ? `${colors.gold}44` : 'transparent'}
              stroke={reached ? `${colors.gold}44` : colors.border.default}
              strokeWidth={1}
            />
          )
        })}

        {/* Event dots */}
        {events.slice(-20).map(ev => {
          const pct   = ageToPct(ev.age)
          const color = ev.type === 'npc' ? colors.crimson : colors.gold
          return (
            <circle
              key={ev.id}
              cx={`${(pct * 100).toFixed(1)}%`}
              cy="50%"
              r={2}
              fill={color}
              opacity={0.5}
            />
          )
        })}

        {/* Current position needle */}
        <circle
          cx={`${(currentPct * 100).toFixed(1)}%`}
          cy="50%"
          r={4}
          fill={colors.gold}
          style={{ filter: `drop-shadow(0 0 4px ${colors.gold}88)` }}
        />
      </svg>

      <span style={{
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         colors.text.muted,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}>
        {t(stageKey(currentAge))}
      </span>
    </footer>
  )
}
