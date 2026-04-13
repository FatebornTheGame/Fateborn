import type { Archetype, AncestorSlot } from '../types/archetype.types'

interface Props {
  slots:        [Archetype | null, Archetype | null, Archetype | null, Archetype | null]
  onRemoveSlot: (slot: AncestorSlot) => void
}

const SLOT_CONFIG = [
  { label: 'Abuelo Paterno', color: '#C9A84C' },
  { label: 'Abuela Paterna', color: '#8B1A2A' },
  { label: 'Abuelo Materno', color: '#C9A84C' },
  { label: 'Abuela Materna', color: '#8B1A2A' },
] as const

const STAT_SHORT: Record<string, string> = {
  logica: 'LÓG', creatividad: 'CRE', disciplina: 'DIS',
  carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
  fisico: 'FÍS', riesgo: 'RIE', estabilidad: 'EST',
}

const STAT_KEYS = ['logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad'] as const

export function AncestorSlots({ slots, onRemoveSlot }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {SLOT_CONFIG.map((config, index) => {
        const slot      = index as AncestorSlot
        const archetype = slots[slot]
        const color     = config.color

        const topStats = archetype
          ? STAT_KEYS.map(k => ({ key: k, value: archetype.stats[k] }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 2)
          : []

        return (
          <div
            key={slot}
            style={{
              position:   'relative',
              display:    'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding:    '10px 8px 8px',
              textAlign:  'center',
              minHeight:  110,
              background: archetype ? `${color}08` : '#0f0d0a',
              border:     `1px solid ${archetype ? color + '88' : color + '22'}`,
              boxShadow:  archetype ? `0 0 16px ${color}22` : 'none',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              borderRadius: 2,
            }}
          >
            {/* Corner decorations */}
            <span style={{ position: 'absolute', top: 3, left: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1 }}>┌</span>
            <span style={{ position: 'absolute', top: 3, right: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1 }}>┐</span>
            <span style={{ position: 'absolute', bottom: 3, left: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1 }}>└</span>
            <span style={{ position: 'absolute', bottom: 3, right: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1 }}>┘</span>

            {/* Slot label */}
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              letterSpacing: '0.05em',
              color,
              opacity:       0.55,
              marginBottom:  4,
              display:       'block',
            }}>
              {config.label}
            </span>

            {archetype ? (
              <>
                {/* Archetype name */}
                <span style={{
                  fontFamily:  'Cinzel, serif',
                  fontSize:    '0.65rem',
                  fontWeight:  700,
                  color,
                  lineHeight:  1.2,
                  marginBottom: 4,
                  display:     'block',
                }}>
                  {archetype.name}
                </span>

                {/* Top 2 stat chips */}
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 4 }}>
                  {topStats.map(({ key, value }) => (
                    <span key={key} style={{
                      fontFamily:  'Cinzel, serif',
                      fontSize:    '0.45rem',
                      color,
                      opacity:     0.7,
                      padding:     '1px 4px',
                      border:      `1px solid ${color}44`,
                      borderRadius: 2,
                    }}>
                      {STAT_SHORT[key]} {value}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onRemoveSlot(slot)}
                  style={{
                    fontFamily:    'Cinzel, serif',
                    fontSize:      '0.45rem',
                    color,
                    opacity:       0.35,
                    background:    'none',
                    border:        'none',
                    cursor:        'pointer',
                    letterSpacing: '0.05em',
                    marginTop:     'auto',
                    transition:    'opacity 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.75' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.35' }}
                >
                  Clic para eliminar
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem', color, opacity: 0.18, marginBottom: 4, display: 'block' }}>◈</span>
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize:   '0.5rem',
                  color:      '#4a4035',
                  letterSpacing: '0.05em',
                }}>
                  vacío
                </span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
