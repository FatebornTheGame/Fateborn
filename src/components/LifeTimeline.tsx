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
const MILESTONE_LABELS: Record<number, string> = {
  13: 'ADO',
  19: 'JUV',
  31: 'ADU',
  51: 'MAD',
  71: 'VEJ',
}

export function LifeTimeline({ birthYear, currentAge, maxAge, events }: Props) {
  const totalYears = maxAge - 0
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
      zIndex:               40,
      height:               48,
      padding:              '0 16px',
      background:           '#0d0b08cc',
      backdropFilter:       'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderTop:            '1px solid #2a2620',
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        {/* Track lines (SVG) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
          {/* Base line */}
          <line x1="0" y1="50%" x2="100%" y2="50%"
            stroke="#C9A84C" strokeOpacity={0.1} strokeWidth={1} />
          {/* Progress line */}
          <line x1="0" y1="50%" x2={`${(currentPct * 100).toFixed(1)}%`} y2="50%"
            stroke="#C9A84C" strokeOpacity={0.5} strokeWidth={1.5} />
        </svg>

        {/* Milestone markers */}
        {AGE_MILESTONES.map(age => {
          const pct     = ageToPct(age)
          const reached = currentAge >= age
          return (
            <div
              key={age}
              style={{
                position:  'absolute',
                left:      `${(pct * 100).toFixed(1)}%`,
                transform: 'translateX(-50%)',
                display:   'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   reached ? '#C9A84C' : 'transparent',
                border:       `1px solid ${reached ? '#C9A84C' : '#C9A84C44'}`,
              }} />
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize:   '0.5rem',
                marginTop:  2,
                color:      reached ? '#C9A84C' : '#C9A84C44',
              }}>
                {MILESTONE_LABELS[age]}
              </span>
            </div>
          )
        })}

        {/* Event dots */}
        {events.slice(-20).map(ev => {
          const pct   = ageToPct(ev.age)
          const color = ev.type === 'npc' ? '#8B1A2A' : '#C9A84C'
          return (
            <div
              key={ev.id}
              style={{
                position:     'absolute',
                left:         `${(pct * 100).toFixed(1)}%`,
                top:          '50%',
                width:        4,
                height:       4,
                borderRadius: '50%',
                background:   color,
                opacity:      0.6,
                transform:    'translateX(-50%) translateY(-50%)',
              }}
            />
          )
        })}

        {/* Current position needle — with glow */}
        <div style={{
          position:   'absolute',
          left:       `${(currentPct * 100).toFixed(1)}%`,
          top:        '10%',
          height:     '80%',
          width:      2,
          background: '#C9A84C',
          opacity:    0.9,
          filter:     'drop-shadow(0 0 4px #C9A84C)',
        }} />

        {/* Birth year */}
        <span style={{
          position:   'absolute',
          left:       0,
          top:        '62%',
          fontFamily: 'Cinzel, serif',
          fontSize:   '0.45rem',
          color:      '#6b6045',
          opacity:    0.5,
        }}>
          {birthYear}
        </span>

        {/* Current year — above needle */}
        <span style={{
          position:  'absolute',
          left:      `${(currentPct * 100).toFixed(1)}%`,
          top:       '8%',
          fontFamily: 'Cinzel, serif',
          fontSize:  '0.45rem',
          color:     '#6b6045',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}>
          {birthYear + currentAge}
        </span>

        {/* Current stage — right side */}
        <span style={{
          position:   'absolute',
          right:      0,
          top:        '62%',
          fontFamily: 'Cinzel, serif',
          fontSize:   '0.45rem',
          color:      '#6b6045',
          opacity:    0.5,
        }}>
          {currentAge < 13 ? 'Infancia' : currentAge < 19 ? 'Adolescencia' : currentAge < 31 ? 'Juventud' : currentAge < 51 ? 'Adultez' : currentAge < 71 ? 'Madurez' : 'Vejez'}
        </span>
      </div>
    </footer>
  )
}
