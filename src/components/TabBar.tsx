import { useTranslation } from 'react-i18next'
import { colors, fonts, transitions } from '../styles/tokens'

interface Props {
  activeTab: 'initiative' | 'feed'
  onChange:  (tab: 'initiative' | 'feed') => void
}

const TAB_IDS: ('initiative' | 'feed')[] = ['initiative', 'feed']

export function TabBar({ activeTab, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div style={{
      display:      'flex',
      background:   colors.bg.primary,
      borderBottom: `1px solid ${colors.border.default}`,
      flexShrink:   0,
    }}>
      {TAB_IDS.map(id => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex:          1,
              padding:       '14px 0',
              minHeight:     44,
              fontFamily:    fonts.display,
              fontSize:      '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         isActive ? colors.gold : colors.text.faint,
              background:    'transparent',
              border:        'none',
              borderBottom:  isActive ? `2px solid ${colors.gold}` : '2px solid transparent',
              cursor:        'pointer',
              transition:    `all ${transitions.fast} cubic-bezier(0.4,0,0.2,1)`,
            }}
          >
            {t(`game.tabs.${id}`)}
          </button>
        )
      })}
    </div>
  )
}
