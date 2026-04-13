import type { Character, Stats, Economy } from '../types/game.types'

interface Props {
  character:   Character
  stats:       Stats
  economy:     Economy
  ageYears:    number
  legacyScore: number
  vitalLoad:   number
}

const VITAL_STATS: { key: keyof Stats; label: string }[] = [
  { key: 'fisico',      label: 'FÍS' },
  { key: 'emocional',   label: 'EMO' },
  { key: 'estabilidad', label: 'EST' },
]

function barColor(value: number): string {
  if (value >= 6) return '#C9A84C'
  if (value >= 4) return '#8B6914'
  return '#8B1A2A'
}

function stageLabel(age: number): string {
  if (age < 13)  return 'Infancia'
  if (age < 19)  return 'Adolescencia'
  if (age < 31)  return 'Juventud'
  if (age < 51)  return 'Adultez'
  if (age < 71)  return 'Madurez'
  if (age < 81)  return 'Vejez'
  if (age < 91)  return 'Vejez tardía'
  return 'Centenario'
}

export function StatusBar({ character, stats, economy: _economy, ageYears, legacyScore: _legacyScore, vitalLoad: _vitalLoad }: Props) {
  return (
    <header style={{
      position:             'fixed',
      top:                  0,
      left:                 0,
      right:                0,
      zIndex:               50,
      height:               56,
      display:              'flex',
      alignItems:           'center',
      padding:              '0 20px',
      gap:                  20,
      background:           '#0d0b08ee',
      backdropFilter:       'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom:         '1px solid #2a2620',
    }}>

      {/* Character name */}
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.8rem',
        fontWeight:    700,
        color:         '#C9A84C',
        letterSpacing: '0.15em',
        whiteSpace:    'nowrap',
        overflow:      'hidden',
        textOverflow:  'ellipsis',
        maxWidth:      160,
      }}>
        {character.name}
      </span>

      {/* Separator */}
      <div style={{ width: 1, height: 20, background: '#2a2620', flexShrink: 0 }} />

      {/* Age */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', fontWeight: 700, color: '#C9A84C' }}>
          {ageYears}
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#6b6045', letterSpacing: '0.2em', marginLeft: 3 }}>
          AÑOS
        </span>
      </div>

      {/* Life stage */}
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#6b6045',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}>
        {stageLabel(ageYears)}
      </span>

      {/* Separator */}
      <div className="hidden sm:block" style={{ width: 1, height: 20, background: '#2a2620', flexShrink: 0 }} />

      {/* Vital stat bars — right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
        {VITAL_STATS.map(({ key, label }) => {
          const value = stats[key]
          const color = barColor(value)
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
              <span style={{
                fontFamily:    'Cinzel, serif',
                fontSize:      '0.45rem',
                color:         '#6b6045',
                letterSpacing: '0.05em',
              }}>
                {label}
              </span>
              <div style={{ width: 60, height: 3, background: '#2a2620', borderRadius: 2 }}>
                <div style={{
                  height:       '100%',
                  width:        `${(value / 10) * 100}%`,
                  background:   color,
                  borderRadius: 2,
                  transition:   'width 0.4s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}
