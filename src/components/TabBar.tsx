interface Props {
  activeTab: 'initiative' | 'feed'
  onChange:  (tab: 'initiative' | 'feed') => void
}

const TABS = [
  { id: 'initiative' as const, label: 'INICIATIVA' },
  { id: 'feed'       as const, label: 'HISTORIA'   },
]

export function TabBar({ activeTab, onChange }: Props) {
  return (
    <div style={{
      display:     'flex',
      background:  '#0d0b08',
      borderBottom: '1px solid #2a2620',
      flexShrink:  0,
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex:          1,
              padding:       '14px 0',
              minHeight:     44,
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         isActive ? '#C9A84C' : '#4a4035',
              background:    'transparent',
              border:        'none',
              borderBottom:  isActive ? '2px solid #C9A84C' : '2px solid transparent',
              cursor:        'pointer',
              transition:    'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
