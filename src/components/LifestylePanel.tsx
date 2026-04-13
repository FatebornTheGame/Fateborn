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

function AllocationBar({ label, value, max = 13 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', letterSpacing: '0.05em', color: '#6b6045', textTransform: 'uppercase', width: 52, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 2, background: '#2a2620', borderRadius: 1 }}>
        <div style={{
          height:     '100%',
          width:      `${pct}%`,
          background: '#C9A84C',
          opacity:    0.7,
          borderRadius: 1,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', color: '#6b6045', width: 14, textAlign: 'right' }}>
        {value}
      </span>
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
  return (
    <div style={{
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
      overflow:      'hidden',
    }}>
      {/* Panel title */}
      <div style={{
        padding:      '14px 20px',
        borderBottom: '1px solid #2a2620',
        flexShrink:   0,
      }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#6b6045', textTransform: 'uppercase' }}>
          Iniciativa
        </span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#4a4035' }}>
            {stageLabel(gameState.ageYears)}
          </span>
          <span style={{ color: '#2a2620', fontSize: '0.55rem' }}>·</span>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#3a3228' }}>
            {gameState.totalQuarters} trimestres
          </span>
        </div>
      </div>

      {/* Lifestyle list — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {allLifestyles.map(ls => {
          const active = lifestyle?.type === ls.type
          return (
            <button
              key={ls.type}
              onClick={() => onSetLifestyle(ls.type)}
              style={{
                textAlign:     'left',
                padding:       '10px 20px',
                background:    active ? '#C9A84C0f' : 'transparent',
                borderLeft:    active ? '2px solid #C9A84C' : '2px solid transparent',
                border:        active ? undefined : '2px solid transparent',
                color:         active ? '#C9A84C' : '#6b6045',
                cursor:        'pointer',
                transition:    'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                borderBottom:  '1px solid #1c1915',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#1c1915'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.08em', display: 'block', marginBottom: 2 }}>
                {ls.label}
              </span>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.55rem', color: active ? '#8a7a5a' : '#3a3228', display: 'block' }}>
                {ls.description}
              </span>
            </button>
          )
        })}

        {/* Allocation breakdown for active lifestyle */}
        {lifestyle && (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #2a2620' }}>
            <AllocationBar label="Trabajo"  value={lifestyle.allocation.trabajo}  />
            <AllocationBar label="Estudios" value={lifestyle.allocation.estudios} />
            <AllocationBar label="Familia"  value={lifestyle.allocation.familia}  />
            <AllocationBar label="Social"   value={lifestyle.allocation.social}   />
            <AllocationBar label="Salud"    value={lifestyle.allocation.salud}    />
            <AllocationBar label="Ocio"     value={lifestyle.allocation.ocio}     />
          </div>
        )}
      </div>

      {/* Advance button — fixed at panel bottom */}
      <div style={{ flexShrink: 0, borderTop: '1px solid #2a2620' }}>
        {hasPending ? (
          <div style={{ padding: '14px 20px', textAlign: 'center' }}>
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.6rem',
              letterSpacing: '0.15em',
              color:         '#8B1A2A',
              opacity:       0.7,
              textTransform: 'uppercase',
            }}>
              Toma una decisión
            </span>
          </div>
        ) : (
          <button
            onClick={canAdvance ? onAdvance : undefined}
            disabled={!canAdvance}
            style={{
              width:         '100%',
              padding:       '14px 20px',
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background:    canAdvance ? '#C9A84C' : 'transparent',
              color:         canAdvance ? '#0d0b08' : '#3a3228',
              border:        'none',
              cursor:        canAdvance ? 'pointer' : 'not-allowed',
              transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              opacity:       canAdvance ? 1 : 0.5,
            }}
            onMouseEnter={e => {
              if (canAdvance) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px #C9A84C44'
            }}
            onMouseLeave={e => {
              if (canAdvance) (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
            }}
          >
            Avanzar Trimestre
          </button>
        )}
      </div>
    </div>
  )
}
