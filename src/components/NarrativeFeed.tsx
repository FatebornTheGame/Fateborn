import { useEffect, useRef } from 'react'
import type { GameEventTemplate } from '../types/game.types'
import type { FeedGroup } from '../hooks/useNarrativeFeed'

interface Props {
  groups:       FeedGroup[]
  pendingEvent: GameEventTemplate | null
  onResolve:    (optionId: string) => void
  pendingState: import('../types/game.types').GameState | null
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Panel title */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2620', flexShrink: 0 }}>
        <span style={{
          fontFamily:    'Cinzel, serif',
          fontSize:      '0.55rem',
          letterSpacing: '0.25em',
          color:         '#6b6045',
          textTransform: 'uppercase',
        }}>
          Historia
        </span>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
        {groups.map(group => (
          <section key={group.age} className="animate-fade-in">
            {/* Age label */}
            <div style={{
              padding:       '20px 0 8px',
              borderBottom:  '1px solid #1c1915',
              marginBottom:  12,
            }}>
              <span style={{
                fontFamily:    'Cinzel, serif',
                fontSize:      '0.55rem',
                color:         '#3a3228',
                letterSpacing: '0.2em',
              }}>
                {group.age} años · {group.year}
              </span>
            </div>

            {/* Entries */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.entries.map(entry => (
                <p
                  key={entry.id}
                  style={{
                    fontFamily:  'Georgia, serif',
                    fontStyle:   entry.type === 'memory' ? 'italic' : 'normal',
                    fontSize:    '0.85rem',
                    lineHeight:  1.8,
                    color:       '#8a7060',
                    opacity:     IMPORTANCE_OPACITY[entry.importance] ?? 0.72,
                    borderLeft:  '2px solid #1c1915',
                    paddingLeft: 12,
                    marginBottom: 6,
                    margin:      '0 0 6px 0',
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
            border:       '1px solid #C9A84C22',
            borderLeft:   '3px solid #C9A84C',
            borderRadius: 4,
            padding:      20,
            marginTop:    16,
            marginBottom: 16,
          }}>
            {/* Event title */}
            <div style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.65rem',
              letterSpacing: '0.2em',
              color:         '#6b6045',
              marginBottom:  12,
              textTransform: 'uppercase',
            }}>
              Decisión
            </div>

            {/* Context */}
            <p style={{
              fontFamily:   'Georgia, serif',
              fontStyle:    'italic',
              fontSize:     '0.9rem',
              lineHeight:   1.8,
              color:        '#b09060',
              marginBottom: 20,
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
                    padding:       '12px 16px',
                    fontFamily:    'Cinzel, serif',
                    fontSize:      '0.65rem',
                    letterSpacing: '0.1em',
                    lineHeight:    1.5,
                    background:    '#0f0d0a',
                    border:        '1px solid #2a2620',
                    borderRadius:  2,
                    color:         '#6b6045',
                    cursor:        'pointer',
                    transition:    'all 0.2s',
                    minHeight:     44,
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
                    btn.style.color       = '#6b6045'
                    btn.style.transform   = 'translateX(0)'
                  }}
                >
                  {option.text(pendingState)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div ref={bottomRef} style={{ height: 16 }} />
      </div>
    </div>
  )
}
