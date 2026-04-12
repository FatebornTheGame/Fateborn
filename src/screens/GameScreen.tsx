import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useGameEngine }    from '../hooks/useGameEngine'
import { useNarrativeFeed } from '../hooks/useNarrativeFeed'
import { useLifestyle }     from '../hooks/useLifestyle'
import { StatusBar }        from '../components/StatusBar'
import { LifestylePanel }   from '../components/LifestylePanel'
import { NarrativeFeed }    from '../components/NarrativeFeed'
import { LifeTimeline }     from '../components/LifeTimeline'
import { TabBar }           from '../components/TabBar'
import { StatsPanel }       from '../components/StatsPanel'
import { COLOR_GOLD }       from '../constants/game.constants'

export function GameScreen() {
  const gameState       = useGameStore(s => s.gameState)
  const preEventState   = useGameStore(s => s.preEventState)
  const activeTab       = useGameStore(s => s.activeTab)
  const setActiveTab    = useGameStore(s => s.setActiveTab)
  const lastStatChanges = useGameStore(s => s.lastStatChanges)

  const [showStats, setShowStats] = useState(false)

  const { canAdvance, advanceQuarter, resolveEvent } = useGameEngine()
  const { grouped, pendingEvent }                    = useNarrativeFeed()
  const { current, allLifestyles, setLifestyle }     = useLifestyle()

  if (!gameState) return null

  // Timeline events: use feed entries that are events or consequences
  const timelineEvents = gameState.feed
    .filter(e => e.type === 'event' || e.type === 'consequence' || e.type === 'npc')
    .map(e => ({ age: e.age, id: e.id, type: e.type as 'event' | 'consequence' | 'npc' }))

  // The state shown to event options renderer (pre-event state if resolving)
  const eventDisplayState = preEventState ?? gameState

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0d0b08' }}>
      {/* Fixed top bar */}
      <StatusBar
        character={gameState.character}
        stats={gameState.stats}
        economy={gameState.economy}
        ageYears={gameState.ageYears}
        legacyScore={gameState.legacyScore}
        vitalLoad={gameState.vitalLoad}
      />

      {/* Body: below status bar, above timeline */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ marginTop: 56, marginBottom: 48 }}
      >
        {/* Desktop: two-column layout */}
        <div className="hidden md:flex w-full">
          {/* Left: lifestyle panel */}
          <div
            className="flex-shrink-0 overflow-y-auto"
            style={{ width: '40%', maxWidth: 320, borderRight: '1px solid #C9A84C22' }}
          >
            <LifestylePanel
              gameState={gameState}
              lifestyle={current}
              allLifestyles={allLifestyles}
              canAdvance={canAdvance}
              hasPending={!!pendingEvent}
              onSetLifestyle={setLifestyle}
              onAdvance={advanceQuarter}
            />
          </div>

          {/* Right: narrative feed */}
          <div className="flex-1 overflow-hidden">
            <NarrativeFeed
              groups={grouped}
              pendingEvent={pendingEvent}
              pendingState={eventDisplayState}
              onResolve={resolveEvent}
            />
          </div>
        </div>

        {/* Mobile: tab layout */}
        <div className="flex flex-col w-full md:hidden">
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
          <div className="flex-1 overflow-hidden">
            {activeTab === 'initiative' ? (
              <LifestylePanel
                gameState={gameState}
                lifestyle={current}
                allLifestyles={allLifestyles}
                canAdvance={canAdvance}
                hasPending={!!pendingEvent}
                onSetLifestyle={setLifestyle}
                onAdvance={advanceQuarter}
              />
            ) : (
              <NarrativeFeed
                groups={grouped}
                pendingEvent={pendingEvent}
                pendingState={eventDisplayState}
                onResolve={(id) => {
                  resolveEvent(id)
                  setActiveTab('feed')
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom timeline */}
      <LifeTimeline
        birthYear={gameState.character.birthYear}
        currentAge={gameState.ageYears}
        maxAge={90}
        events={timelineEvents}
      />

      {/* Σ stats button — bottom-left corner, above timeline */}
      {showStats && (
        <StatsPanel
          stats={gameState.stats}
          lastStatChanges={lastStatChanges}
          onClose={() => setShowStats(false)}
        />
      )}
      <div className="fixed bottom-14 left-2 z-50">
        <button
          onClick={() => setShowStats(v => !v)}
          className="font-cinzel text-sm flex items-center justify-center transition-all"
          style={{
            width:      36,
            height:     36,
            border:     `1px solid ${showStats ? COLOR_GOLD + 'aa' : COLOR_GOLD + '33'}`,
            color:      showStats ? COLOR_GOLD : COLOR_GOLD + '88',
            background: showStats ? `${COLOR_GOLD}11` : 'transparent',
          }}
        >
          Σ
        </button>
      </div>
    </div>
  )
}
