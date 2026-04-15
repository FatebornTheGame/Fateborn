import { useEffect, useRef }            from 'react'
import { useTranslation }               from 'react-i18next'
import type { GameEventTemplate }       from '../types/game.types'
import type { FeedGroup }               from '../hooks/useNarrativeFeed'
import { colors, fonts, transitions }   from '../styles/tokens'

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
  const { t }      = useTranslation()
  const bottomRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groups.length, pendingEvent])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Panel title */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border.default}`, flexShrink: 0 }}>
        <span style={{
          fontFamily:    fonts.display,
          fontSize:      '0.55rem',
          letterSpacing: '0.25em',
          color:         colors.text.muted,
          textTransform: 'uppercase',
        }}>
          {t('game.feed.title')}
        </span>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>

        {/* Empty state — antes del primer trimestre */}
        {groups.length === 0 && !pendingEvent && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', opacity: 0.4 }}>
            <p style={{ fontFamily: fonts.body, fontStyle: 'italic', fontSize: '0.85rem', color: colors.text.muted, textAlign: 'center', lineHeight: 1.8, margin: 0 }}>
              {t('game.feed.empty')}
            </p>
          </div>
        )}

        {groups.map(group => (
          <section key={group.age} className="animate-fade-in">
            {/* Age label */}
            <div style={{ padding: '20px 0 8px', borderBottom: `1px solid ${colors.bg.tertiary}`, marginBottom: 12 }}>
              <span style={{ fontFamily: fonts.display, fontSize: '0.55rem', color: colors.text.muted, letterSpacing: '0.2em' }}>
                {group.age} {t('game.feed.anos')} · {group.year}
              </span>
            </div>

            {/* Entries */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.entries.map(entry => (
                <p
                  key={entry.id}
                  style={{
                    fontFamily:   fonts.body,
                    fontStyle:    entry.type === 'memory' ? 'italic' : 'normal',
                    fontSize:     '0.85rem',
                    lineHeight:   1.8,
                    color:        colors.text.narrative,
                    opacity:      IMPORTANCE_OPACITY[entry.importance] ?? 0.72,
                    borderLeft:   `2px solid ${colors.bg.tertiary}`,
                    paddingLeft:  12,
                    margin:       '0 0 6px 0',
                  }}
                >
                  {entry.text}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Pending event */}
        {pendingEvent && pendingState && (
          <section className="animate-fade-in" style={{
            background:   colors.bg.secondary,
            border:       `1px solid ${colors.gold}22`,
            borderLeft:   `3px solid ${colors.gold}`,
            borderRadius: 4,
            padding:      20,
            marginTop:    16,
            marginBottom: 16,
          }}>
            <div style={{
              fontFamily:    fonts.display,
              fontSize:      '0.6rem',
              letterSpacing: '0.2em',
              color:         colors.gold,
              marginBottom:  12,
              textTransform: 'uppercase',
            }}>
              {t('game.feed.decision')}
            </div>

            <p style={{
              fontFamily:   fonts.body,
              fontStyle:    'italic',
              fontSize:     '0.9rem',
              lineHeight:   1.8,
              color:        colors.text.narrative,
              marginBottom: 20,
            }}>
              {pendingEvent.context(pendingState)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingEvent.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => onResolve(option.id)}
                  style={{
                    textAlign:     'left',
                    padding:       '14px 18px',
                    fontFamily:    fonts.display,
                    fontSize:      '0.7rem',
                    letterSpacing: '0.1em',
                    lineHeight:    1.5,
                    background:    '#141210',
                    border:        '1px solid #2e2418',
                    borderRadius:  2,
                    color:         '#8a7060',
                    cursor:        'pointer',
                    transition:    `all ${transitions.fast}`,
                    minHeight:     44,
                  }}
                  onMouseEnter={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.borderColor = colors.gold
                    btn.style.color       = colors.gold
                    btn.style.background  = '#C9A84C08'
                    btn.style.transform   = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.borderColor = '#2e2418'
                    btn.style.color       = '#8a7060'
                    btn.style.background  = '#141210'
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
