import { useTranslation }  from 'react-i18next'
import type { Stats }      from '../types/game.types'
import { fonts }           from '../styles/tokens'

interface Props {
  hiddenGenes: Partial<Stats>
}

export function HiddenGenesDisplay({ hiddenGenes }: Props) {
  const { t }  = useTranslation()
  const entries = Object.entries(hiddenGenes).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return null

  return (
    <div>
      <p style={{
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         '#C9A84C77',
        letterSpacing: '0.2em',
        margin:        0,
        textTransform: 'uppercase',
      }}>
        {t('birth.genesTitle')}
      </p>

      <p style={{
        fontFamily: fonts.display,
        fontSize:   '0.5rem',
        color:      '#5a4830',
        fontStyle:  'italic',
        margin:     '4px 0 12px',
      }}>
        {t('birth.genesSubtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 12px' }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
              fontFamily:    fonts.display,
              fontSize:      '0.62rem',
              color:         '#7a6040',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {t(`statLabels.${key}`, key)}
            </span>
            {/* fonts.body (Georgia) para que el punto decimal sea visible a tamaños pequeños */}
            <span style={{
              fontFamily: fonts.body,
              fontSize:   '0.75rem',
              color:      '#a08050',
              opacity:    0.6,
            }}>
              {(value as number).toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily:   fonts.display,
        fontSize:     '0.5rem',
        color:        '#5a4830',
        fontStyle:    'italic',
        marginTop:    8,
        marginBottom: 0,
      }}>
        Potencial genético latente
      </p>
    </div>
  )
}
