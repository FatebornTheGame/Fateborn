import type { Lifestyle, LifestyleType } from '../systems/lifestyleSystem'
import type { GameState } from '../types/game.types'

interface Props {
  gameState:      GameState
  lifestyle:      Lifestyle | null
  allLifestyles:  Lifestyle[]
  canAdvance:     boolean
  hasPending:     boolean
  onSetLifestyle: (type: LifestyleType) => void
  onAdvance:      () => void
}

function stageLabel(age: number): string {
  if (age < 13)  return 'Infancia'
  if (age < 19)  return 'Adolescencia'
  if (age < 31)  return 'Juventud'
  if (age < 51)  return 'Adultez'
  if (age < 71)  return 'Madurez'
  if (age < 81)  return 'Vejez'
  return 'Vejez tardía'
}

const ALLOC_KEYS = ['trabajo', 'estudios', 'familia', 'social', 'salud', 'ocio'] as const
type AllocKey = typeof ALLOC_KEYS[number]

const ALLOC_LABELS: Record<AllocKey, string> = {
  trabajo:  'Trabajo',
  estudios: 'Estudios',
  familia:  'Familia',
  social:   'Social',
  salud:    'Salud',
  ocio:     'Ocio',
}

function AllocationBar({ label, value, max = 6 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(1, value / max) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.45rem',
        color:         '#4a4035',
        width:         48,
        flexShrink:    0,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 2, background: '#1c1915', borderRadius: 1 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#C9A84C66', borderRadius: 1 }} />
      </div>
    </div>
  )
}

export function LifestylePanel({
  gameState,
  lifestyle,
  allLifestyles,
  canAdvance,
  hasPending,
  onSetLifestyle,
  onAdvance,
}: Props) {
  const isDisabled = !canAdvance || !lifestyle

  // Top 3 allocation values for active lifestyle
  const topAllocs = lifestyle
    ? ALLOC_KEYS
        .map(k => ({ key: k, value: lifestyle.allocation[k] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
    : []

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Cinzel, serif' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2620', flexShrink: 0 }}>
        <span style={{
          fontSize:      '0.55rem',
          letterSpacing: '0.25em',
          color:         '#6b6045',
          textTransform: 'uppercase',
        }}>
          Iniciativa
        </span>
      </div>

      {/* Current stage */}
      <div style={{ padding: '8px 20px', borderBottom: '1px solid #1c1915', flexShrink: 0 }}>
        <span style={{
          fontSize:      '0.6rem',
          color:         '#4a4035',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          {stageLabel(gameState.ageYears)} · {gameState.totalQuarters} trim.
        </span>
      </div>

      {/* Lifestyle list — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {allLifestyles.map(ls => {
          const active = lifestyle?.type === ls.type
          return (
            <button
              key={ls.type}
              onClick={() => onSetLifestyle(ls.type)}
              style={{
                width:         '100%',
                textAlign:     'left',
                padding:       '14px 20px',
                background:    active ? '#C9A84C08' : 'transparent',
                borderTop:     'none',
                borderRight:   'none',
                borderBottom:  'none',
                borderLeft:    active ? '3px solid #C9A84C' : '3px solid transparent',
                cursor:        'pointer',
                transition:    'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background   = '#1c1915'
                  btn.style.borderLeft   = '3px solid #2a2620'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background   = 'transparent'
                  btn.style.borderLeft   = '3px solid transparent'
                }
              }}
            >
              <span style={{
                display:       'block',
                fontFamily:    'Cinzel, serif',
                fontSize:      '0.7rem',
                color:         active ? '#C9A84C' : '#6b5030',
                fontWeight:    active ? 600 : 400,
                letterSpacing: '0.1em',
              }}>
                {ls.label}
              </span>
              <span style={{
                display:    'block',
                fontFamily: 'Georgia, serif',
                fontStyle:  'italic',
                fontSize:   '0.55rem',
                color:      active ? '#6b6045' : '#2a2620',
                marginTop:  4,
              }}>
                {ls.description}
              </span>
            </button>
          )
        })}

        {/* Top 3 allocation bars for active lifestyle */}
        {lifestyle && topAllocs.length > 0 && (
          <div style={{
            padding:       '12px 20px',
            borderTop:     '1px solid #1c1915',
            borderBottom:  '1px solid #1c1915',
            display:       'flex',
            flexDirection: 'column',
            gap:           8,
          }}>
            {topAllocs.map(({ key, value }) => (
              <AllocationBar key={key} label={ALLOC_LABELS[key]} value={value} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom: hint + advance button */}
      <div style={{ flexShrink: 0 }}>
        {hasPending && (
          <div style={{ padding: '8px 20px', textAlign: 'center' }}>
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.55rem',
              letterSpacing: '0.15em',
              color:         '#8B1A2A',
              opacity:       0.8,
              textTransform: 'uppercase',
            }}>
              Toma una decisión
            </span>
          </div>
        )}
        {!hasPending && !lifestyle && (
          <div style={{ padding: '8px 20px', textAlign: 'center' }}>
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              letterSpacing: '0.1em',
              color:         '#4a4035',
              textTransform: 'uppercase',
            }}>
              Elige un estilo de vida
            </span>
          </div>
        )}
        <button
          onClick={isDisabled ? undefined : onAdvance}
          disabled={isDisabled}
          style={{
            width:         '100%',
            padding:       16,
            fontFamily:    'Cinzel, serif',
            fontSize:      '0.7rem',
            letterSpacing: '0.25em',
            fontWeight:    700,
            textTransform: 'uppercase',
            border:        'none',
            cursor:        isDisabled ? 'not-allowed' : 'pointer',
            background:    isDisabled ? '#3a3228' : '#C9A84C',
            color:         isDisabled ? '#6b6045' : '#0d0b08',
            opacity:       isDisabled ? 0.3 : 1,
            transition:    'background 0.2s',
          }}
          onMouseEnter={e => {
            if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = '#d4b05a'
          }}
          onMouseLeave={e => {
            if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C'
          }}
        >
          Avanzar Trimestre
        </button>
      </div>
    </div>
  )
}
