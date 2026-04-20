import { useState }                    from 'react'
import { useGameStore }               from '../store/gameStore'
import { useGameEngine }              from '../hooks/useGameEngine'
import { useNarrativeFeed }           from '../hooks/useNarrativeFeed'
import { useLifestyle }               from '../hooks/useLifestyle'
import { StatusBar }                  from '../components/StatusBar'
import { LifestylePanel }             from '../components/LifestylePanel'
import { NarrativeFeed }              from '../components/NarrativeFeed'
import { LifeTimeline }               from '../components/LifeTimeline'
import { TabBar }                     from '../components/TabBar'
import { StatsPanel }                 from '../components/StatsPanel'
import { MuteButton }                 from '../components/MuteButton'
import { AtmosphericBackground }      from '../styles/AtmosphericBackground'
import { StatFlash }                  from '../components/StatFlash'
import { StageProgressBar }           from '../components/StageProgressBar'
import { OnboardingOverlay }          from '../components/OnboardingOverlay'
import { colors }                     from '../styles/tokens'

const ONBOARDING_KEY = 'fateborn_onboarding_done'

export function GameScreen() {
  const gameState       = useGameStore(s => s.gameState)
  const preEventState   = useGameStore(s => s.preEventState)
  const activeTab       = useGameStore(s => s.activeTab)
  const setActiveTab    = useGameStore(s => s.setActiveTab)
  const lastStatChanges = useGameStore(s => s.lastStatChanges)

  const [showStats, setShowStats]           = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(() => localStorage.getItem(ONBOARDING_KEY) === '1')

  // Panel starts expanded on first visit; overlay handles the step 1/2 flow
  const isFirstVisit = !onboardingDone

  const { canStartLiving, isLiving, startLiving, resolveEvent } = useGameEngine()
  const { grouped, pendingEvent }                    = useNarrativeFeed()
  const { current, allLifestyles, setLifestyle }     = useLifestyle()

  if (!gameState) return null

  const timelineEvents = gameState.feed
    .filter(e => e.type === 'event' || e.type === 'consequence' || e.type === 'npc')
    .map(e => ({ age: e.age, id: e.id, type: e.type as 'event' | 'consequence' | 'npc' }))

  const eventDisplayState = preEventState ?? gameState

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: colors.bg.primary }}>
      <MuteButton />
      <AtmosphericBackground />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <StatusBar
          character={gameState.character}
          stats={gameState.stats}
          ageYears={gameState.ageYears}
          economy={gameState.economy}
        />
        <StatFlash />
        <StageProgressBar age={gameState.ageYears} />

        {/* Desktop layout (md+) */}
        <div
          className="hidden md:flex"
          style={{ paddingTop: 84, paddingBottom: 48, flex: 1, overflow: 'hidden' }}
        >
          <div style={{
            width:       300,
            minWidth:    300,
            overflowY:   'auto',
            borderRight: `1px solid ${colors.border.default}`,
            background:  `${colors.bg.primary}99`,
          }}>
            <LifestylePanel
              gameState={gameState}
              lifestyle={current}
              allLifestyles={allLifestyles}
              canStartLiving={canStartLiving}
              isLiving={isLiving}
              hasPending={!!pendingEvent}
              isFirstVisit={isFirstVisit}
              onSetLifestyle={setLifestyle}
              onStartLiving={startLiving}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
            <NarrativeFeed
              groups={grouped}
              pendingEvent={pendingEvent}
              pendingState={eventDisplayState}
              onResolve={resolveEvent}
            />
          </div>
        </div>

        {/* Mobile layout */}
        <div
          className="flex flex-col w-full md:hidden"
          style={{ flex: 1, overflow: 'hidden', paddingTop: 84 }}
        >
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
          <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 48 }}>
            {activeTab === 'initiative' ? (
              <LifestylePanel
                gameState={gameState}
                lifestyle={current}
                allLifestyles={allLifestyles}
                canStartLiving={canStartLiving}
                isLiving={isLiving}
                hasPending={!!pendingEvent}
                isFirstVisit={isFirstVisit}
                onSetLifestyle={setLifestyle}
                onStartLiving={startLiving}
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

        <LifeTimeline
          currentAge={gameState.ageYears}
          maxAge={90}
          events={timelineEvents}
        />
      </div>

      {/* Onboarding: two-step overlay, shown on first visit */}
      {!onboardingDone && (
        <OnboardingOverlay onDone={() => setOnboardingDone(true)} />
      )}

      {/* Overlays */}
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
            border:     `1px solid ${showStats ? colors.gold + 'aa' : colors.gold + '33'}`,
            color:      showStats ? colors.gold : colors.gold + '88',
            background: showStats ? `${colors.gold}11` : 'transparent',
          }}
        >
          Σ
        </button>
      </div>
    </div>
  )
}
