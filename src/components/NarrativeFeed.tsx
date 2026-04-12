import { useEffect, useRef } from 'react'
import type { GameEventTemplate } from '../types/game.types'
import type { FeedGroup } from '../hooks/useNarrativeFeed'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  groups:        FeedGroup[]
  pendingEvent:  GameEventTemplate | null
  onResolve:     (optionId: string) => void
  pendingState:  import('../types/game.types').GameState | null
}

const TYPE_COLOR: Record<string, string> = {
  event:       COLOR_GOLD,
  consequence: COLOR_GARNET,
  npc:         '#7aa',
  memory:      '#a8a',
  reflection:  '#888',
}

const IMPORTANCE_OPACITY: Record<string, number> = {
  normal:  0.72,
  alta:    0.9,
  critica: 1,
}

export function NarrativeFeed({ groups, pendingEvent, onResolve, pendingState }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groups.length, pendingEvent])

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-6 px-4 py-4">
      {groups.map(group => (
        <section key={group.age} className="animate-fade-in">
          {/* Age/year header */}
          <div
            className="flex items-center gap-2 mb-2"
            style={{ borderBottom: `1px solid ${COLOR_GOLD}22`, paddingBottom: 4 }}
          >
            <span className="font-cinzel text-sm" style={{ color: COLOR_GOLD, opacity: 0.6 }}>
              {group.age} años · {group.year}
            </span>
          </div>

          {/* Entries */}
          <div className="flex flex-col gap-2">
            {group.entries.map(entry => (
              <p
                key={entry.id}
                className="text-sm leading-relaxed"
                style={{
                  color:   TYPE_COLOR[entry.type] ?? COLOR_GOLD,
                  opacity: IMPORTANCE_OPACITY[entry.importance] ?? 0.72,
                  fontStyle: entry.type === 'memory' ? 'italic' : undefined,
                }}
              >
                {entry.text}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* Pending event: show options inline */}
      {pendingEvent && pendingState && (
        <section className="animate-fade-in">
          <div
            className="flex items-center gap-2 mb-3"
            style={{ borderBottom: `1px solid ${COLOR_GOLD}44`, paddingBottom: 4 }}
          >
            <span className="font-cinzel text-sm" style={{ color: COLOR_GOLD }}>
              DECISIÓN
            </span>
          </div>

          {/* Context */}
          <p className="text-sm leading-relaxed mb-4 opacity-80">
            {pendingEvent.context(pendingState)}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {pendingEvent.options.map(option => (
              <button
                key={option.id}
                onClick={() => onResolve(option.id)}
                className="text-left px-4 py-3 text-sm leading-snug transition-all hover:opacity-100"
                style={{
                  border:        `1px solid ${COLOR_GOLD}44`,
                  color:         COLOR_GOLD,
                  opacity:       0.75,
                  background:    'transparent',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}11`
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${COLOR_GOLD}99`
                  ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${COLOR_GOLD}44`
                  ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.75'
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
  )
}
