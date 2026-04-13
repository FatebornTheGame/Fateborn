interface TimelineEvent {
  age:  number
  id:   string
  type: 'event' | 'consequence' | 'npc'
}

interface Props {
  birthYear:  number
  currentAge: number
  maxAge:     number
  events:     TimelineEvent[]
}

const AGE_MILESTONES = [13, 19, 31, 51, 71]

function stageLabel(age: number): string {
  if (age < 13)  return 'Infancia'
  if (age < 19)  return 'Adolescencia'
  if (age < 31)  return 'Juventud'
  if (age < 51)  return 'Adultez'
  if (age < 71)  return 'Madurez'
  if (age < 81)  return 'Vejez'
  return 'Vejez tardía'
}

export function LifeTimeline({ birthYear: _birthYear, currentAge, maxAge, events }: Props) {
  const totalYears = maxAge
  const currentPct = Math.min(1, currentAge / totalYears)

  function ageToPct(age: number): number {
    return Math.min(1, age / totalYears)
  }

  return (
    <footer style={{
      position:             'fixed',
      bottom:               0,
      left:                 0,
      right:                0,
      zIndex:               50,
      height:               48,
      background:           '#0d0b08ee',
      backdropFilter:       'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderTop:            '1px solid #2a2620',
      display:              'flex',
      alignItems:           'center',
      padding:              '0 20px',
      gap:                  12,
    }}>
      {/* Timeline SVG — flex:1, tall enough to contain the r:4 needle circle */}
      <svg
        style={{ flex: 1, height: 16, overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        {/* Base track */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1c1915" strokeWidth={2} />
        {/* Progress segment */}
        <line
          x1="0" y1="50%"
          x2={`${(currentPct * 100).toFixed(1)}%`} y2="50%"
          stroke="#3a3228" strokeWidth={2}
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
              fill={reached ? '#C9A84C44' : 'transparent'}
              stroke={reached ? '#C9A84C44' : '#2a2620'}
              strokeWidth={1}
            />
          )
        })}

        {/* Event dots */}
        {events.slice(-20).map(ev => {
          const pct   = ageToPct(ev.age)
          const color = ev.type === 'npc' ? '#8B1A2A' : '#C9A84C'
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

        {/* Current position needle circle */}
        <circle
          cx={`${(currentPct * 100).toFixed(1)}%`}
          cy="50%"
          r={4}
          fill="#C9A84C"
          style={{ filter: 'drop-shadow(0 0 4px #C9A84C88)' }}
        />
      </svg>

      {/* Current stage label */}
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#6b6045',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}>
        {stageLabel(currentAge)}
      </span>
    </footer>
  )
}
