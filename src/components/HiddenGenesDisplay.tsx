import type { Stats } from '../types/game.types'

interface Props {
  hiddenGenes: Partial<Stats>
}

const STAT_LABELS: Record<string, string> = {
  logica:       'Lógica',
  creatividad:  'Creatividad',
  disciplina:   'Disciplina',
  carisma:      'Carisma',
  emocional:    'Emocional',
  ambicion:     'Ambición',
  fisico:       'Físico',
  riesgo:       'Riesgo',
  estabilidad:  'Estabilidad',
}

export function HiddenGenesDisplay({ hiddenGenes }: Props) {
  const entries = Object.entries(hiddenGenes).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return null

  return (
    <div>
      {/* Header */}
      <p style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.55rem',
        color:         '#C9A84C66',
        letterSpacing: '0.2em',
        margin:        0,
        textTransform: 'uppercase',
      }}>
        ✦ Genes Latentes
      </p>

      {/* Subtitle */}
      <p style={{
        fontFamily:   'Cinzel, serif',
        fontSize:     '0.5rem',
        color:        '#3a3228',
        fontStyle:    'italic',
        margin:       '4px 0 12px',
      }}>
        Se revelarán con el tiempo
      </p>

      {/* 3-column grid of stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 12px' }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              color:         '#4a3a20',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {STAT_LABELS[key] ?? key}
            </span>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize:   '0.7rem',
              color:      '#6b5030',
              opacity:    0.35,
            }}>
              {(value as number).toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{
        fontFamily: 'Cinzel, serif',
        fontSize:   '0.5rem',
        color:      '#2a2620',
        fontStyle:  'italic',
        marginTop:  8,
        marginBottom: 0,
      }}>
        Potencial genético latente
      </p>
    </div>
  )
}
