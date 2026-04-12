import { COLOR_GOLD } from '../constants/game.constants'

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
    <div
      className="flex"
      style={{ borderBottom: `1px solid ${COLOR_GOLD}22` }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 py-2 font-cinzel text-xs uppercase tracking-widest transition-all"
            style={{
              color:         isActive ? COLOR_GOLD : COLOR_GOLD + '44',
              borderBottom:  isActive ? `2px solid ${COLOR_GOLD}` : '2px solid transparent',
              background:    'transparent',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
