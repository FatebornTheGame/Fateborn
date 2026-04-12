import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface TimelineEvent {
  age:  number
  id:   string
  type: 'event' | 'consequence' | 'npc'
}

interface Props {
  birthYear:   number
  currentAge:  number
  maxAge:      number
  events:      TimelineEvent[]
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
  const totalYears  = maxAge - 0
  const currentPct  = Math.min(1, currentAge / totalYears)

  function ageToPct(age: number): number {
    return Math.min(1, age / totalYears)
  }

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2"
      style={{ height: 48, background: '#0d0b08ee', borderTop: `1px solid ${COLOR_GOLD}22` }}
    >
      <div className="relative w-full h-full flex items-center">
        {/* Track */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Base line */}
          <line x1="0" y1="50%" x2="100%" y2="50%"
            stroke={COLOR_GOLD} strokeOpacity={0.12} strokeWidth={1} />

          {/* Progress line */}
          <line x1="0" y1="50%" x2={`${(currentPct * 100).toFixed(1)}%`} y2="50%"
            stroke={COLOR_GOLD} strokeOpacity={0.6} strokeWidth={1.5} />
        </svg>

        {/* Milestone markers */}
        {AGE_MILESTONES.map(age => {
          const pct     = ageToPct(age)
          const reached = currentAge >= age
          return (
            <div
              key={age}
              className="absolute flex flex-col items-center"
              style={{ left: `${(pct * 100).toFixed(1)}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="w-[6px] h-[6px] rounded-full"
                style={{
                  background: reached ? COLOR_GOLD : 'transparent',
                  border:     `1px solid ${reached ? COLOR_GOLD : COLOR_GOLD + '44'}`,
                }}
              />
              <span
                className="text-[8px] mt-0.5 leading-none"
                style={{ color: reached ? COLOR_GOLD : COLOR_GOLD + '44', fontFamily: 'Cinzel, serif' }}
              >
                {MILESTONE_LABELS[age]}
              </span>
            </div>
          )
        })}

        {/* Event dots */}
        {events.slice(-20).map(ev => {
          const pct   = ageToPct(ev.age)
          const color = ev.type === 'npc' ? COLOR_GARNET : COLOR_GOLD
          return (
            <div
              key={ev.id}
              className="absolute w-[4px] h-[4px] rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left:       `${(pct * 100).toFixed(1)}%`,
                top:        '50%',
                background: color,
                opacity:    0.7,
              }}
            />
          )
        })}

        {/* Current position needle */}
        <div
          className="absolute w-[2px]"
          style={{
            left:       `${(currentPct * 100).toFixed(1)}%`,
            top:        '10%',
            height:     '80%',
            background: COLOR_GOLD,
            opacity:    0.9,
          }}
        />

        {/* Birth year / current year labels */}
        <span className="absolute left-0 text-[9px] opacity-30" style={{ top: '60%' }}>
          {birthYear}
        </span>
        <span
          className="absolute text-[9px] opacity-50 font-cinzel"
          style={{ left: `${(currentPct * 100).toFixed(1)}%`, top: '10%', transform: 'translateX(-50%)' }}
        >
          {birthYear + currentAge}
        </span>
      </div>
    </footer>
  )
}
