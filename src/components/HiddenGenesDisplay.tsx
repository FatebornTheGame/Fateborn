import { useTranslation }  from 'react-i18next'
import type { Stats }      from '../types/game.types'
import { colors, fonts }   from '../styles/tokens'

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
        color:         `${colors.gold}66`,
        letterSpacing: '0.2em',
        margin:        0,
        textTransform: 'uppercase',
      }}>
        {t('birth.genesTitle')}
      </p>

      <p style={{
        fontFamily: fonts.display,
        fontSize:   '0.5rem',
        color:      colors.border.warm,
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
              fontSize:      '0.5rem',
              color:         colors.text.faint,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {t(`statLabels.${key}`, key)}
            </span>
            <span style={{
              fontFamily: fonts.display,
              fontSize:   '0.7rem',
              color:      colors.text.secondary,
              opacity:    0.35,
            }}>
              {(value as number).toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily:   fonts.display,
        fontSize:     '0.5rem',
        color:        colors.border.default,
        fontStyle:    'italic',
        marginTop:    8,
        marginBottom: 0,
      }}>
        Potencial genético latente
      </p>
    </div>
  )
}
