import { useEffect, useRef } from 'react'
import type { GameEventTemplate } from '../types/game.types'
import type { FeedGroup } from '../hooks/useNarrativeFeed'

interface Props {
  groups:       FeedGroup[]
  pendingEvent: GameEventTemplate | null
  onResolve:    (optionId: string) => void
  pendingState: import('../types/game.types').GameState | null
}

const TYPE_COLOR: Record<string, string> = {
  event:       '#C9A84C',
  consequence: '#8B1A2A',
  npc:         '#7aa8aa',
  memory:      '#a888aa',
  reflection:  '#6b6045',
}

const IMPORTANCE_OPACITY: Record<string, number> = {
  normal:  0.72,
  alta:    0.9,
  critica: 1,
}

export function NarrativeFeed({ groups, pendingEvent, onResolve, pendingState }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groups.length, pendingEvent])

  return (
    <div style={{
      height:    '100%',
      overflowY: 'auto',
      display:   'flex',
      flexDirection: 'column',
    }}>
      {/* Panel title */}
      <div style={{
        padding:      '14px 20px',
        borderBottom: '1px solid #2a2620',
        flexShrink:   0,
      }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#6b6045', textTransform: 'uppercase' }}>
          Historia
        </span>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {groups.map(group => (
          <section key={group.age} className="animate-fade-in">
            {/* Age/year header */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           8,
              marginBottom:  8,
              paddingBottom: 4,
              borderBottom:  '1px solid #1c1915',
            }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#6b6045', letterSpacing: '0.1em' }}>
                {group.age} años · {group.year}
              </span>
            </div>

            {/* Entries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.entries.map(entry => (
                <p
                  key={entry.id}
                  style={{
                    fontFamily:  entry.type === 'memory' ? 'Georgia, serif' : 'Georgia, serif',
                    fontStyle:   entry.type === 'memory' ? 'italic' : 'normal',
                    fontSize:    '0.8rem',
                    lineHeight:  1.7,
                    color:       TYPE_COLOR[entry.type] ?? '#C9A84C',
                    opacity:     IMPORTANCE_OPACITY[entry.importance] ?? 0.72,
                  }}
                >
                  {entry.text}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Pending event — inline decision card */}
        {pendingEvent && pendingState && (
          <section className="animate-fade-in" style={{
            background:   '#141210',
            border:       '1px solid #C9A84C44',
            borderLeft:   '2px solid #C9A84C',
            padding:      '16px 20px',
          }}>
            {/* Decision header */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           8,
              marginBottom:  12,
              paddingBottom: 8,
              borderBottom:  '1px solid #2a2620',
            }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#C9A84C' }}>
                DECISIÓN
              </span>
            </div>

            {/* Context */}
            <p style={{
              fontFamily:  'Georgia, serif',
              fontStyle:   'italic',
              fontSize:    '0.8rem',
              lineHeight:  1.7,
              color:       '#b09060',
              marginBottom: 16,
            }}>
              {pendingEvent.context(pendingState)}
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingEvent.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => onResolve(option.id)}
                  style={{
                    textAlign:     'left',
                    padding:       '10px 14px',
                    fontFamily:    'Cinzel, serif',
                    fontSize:      '0.65rem',
                    letterSpacing: '0.05em',
                    lineHeight:    1.5,
                    background:    '#0f0d0a',
                    border:        '1px solid #2a2620',
                    color:         '#8a7a5a',
                    cursor:        'pointer',
                    transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.borderColor = '#C9A84C'
                    btn.style.color       = '#C9A84C'
                    btn.style.transform   = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.borderColor = '#2a2620'
                    btn.style.color       = '#8a7a5a'
                    btn.style.transform   = 'translateX(0)'
                  }}
                >
                  {option.text(pendingState)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
