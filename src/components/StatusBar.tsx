import type { Character, Stats, Economy } from '../types/game.types'

interface Props {
  character:   Character
  stats:       Stats
  economy:     Economy
  ageYears:    number
  legacyScore: number
  vitalLoad:   number
}

// Three key stats shown as mini bars
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

// Life stage label from age
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

export function StatusBar({ character, stats, economy, ageYears, legacyScore, vitalLoad: _vitalLoad }: Props) {
  const currentYear = character.birthYear + ageYears

  return (
    <header style={{
      position:       'fixed',
      top:            0,
      left:           0,
      right:          0,
      zIndex:         50,
      height:         56,
      display:        'flex',
      alignItems:     'center',
      gap:            12,
      padding:        '0 16px',
      background:     '#0d0b08cc',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom:   '1px solid #2a2620',
    }}>

      {/* Name + stage */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0, flexShrink: 1 }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', color: '#C9A84C', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {character.name}
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', color: '#6b6045', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          {stageLabel(ageYears)}
        </span>
      </div>

      {/* Age badge */}
      <div style={{
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        lineHeight:    1,
        padding:       '4px 10px',
        border:        '1px solid #3a3228',
      }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', fontWeight: 700, color: '#C9A84C' }}>
          {ageYears}
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#6b6045', letterSpacing: '0.1em' }}>
          {currentYear}
        </span>
      </div>

      {/* Vital stat bars */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {VITAL_STATS.map(({ key, label }) => {
          const value = stats[key]
          const color = barColor(value)
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 28, height: 3, background: '#2a2620', borderRadius: 2 }}>
                <div style={{
                  height:       '100%',
                  width:        `${(value / 10) * 100}%`,
                  background:   color,
                  borderRadius: 2,
                  transition:   'width 0.4s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.4rem', color: '#6b6045', letterSpacing: '0.05em' }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Economy — hidden on very small screens */}
      <div className="hidden sm:flex" style={{ flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#6b6045', letterSpacing: '0.05em' }}>patrimonio</span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', color: '#C9A84C' }}>
          {economy.liquidez >= 1000
            ? `${(economy.liquidez / 1000).toFixed(0)}k`
            : economy.liquidez.toFixed(0)}
        </span>
      </div>

      {/* Legacy score */}
      <div style={{
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        lineHeight:    1,
        padding:       '4px 10px',
        border:        '1px solid #3a3228',
      }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', fontWeight: 700, color: '#C9A84C' }}>
          {legacyScore}
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#6b6045', letterSpacing: '0.05em' }}>legado</span>
      </div>
    </header>
  )
}
