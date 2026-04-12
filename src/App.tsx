import { useGameStore } from './store/gameStore'
import { ErrorBoundary }      from './components/ErrorBoundary'
import { StartScreen }        from './screens/StartScreen'
import { AncestorSelection }  from './screens/AncestorSelection'
import { BirthScreen }        from './screens/BirthScreen'
import { GameScreen }         from './screens/GameScreen'
import { DeathScreen }        from './screens/DeathScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)

  return (
    <ErrorBoundary screenName="App">
      {screen === 'start' && (
        <ErrorBoundary screenName="StartScreen">
          <StartScreen />
        </ErrorBoundary>
      )}
      {screen === 'ancestors' && (
        <ErrorBoundary screenName="AncestorSelection">
          <AncestorSelection />
        </ErrorBoundary>
      )}
      {screen === 'birth' && (
        <ErrorBoundary screenName="BirthScreen">
          <BirthScreen />
        </ErrorBoundary>
      )}
      {screen === 'game' && (
        <ErrorBoundary screenName="GameScreen">
          <GameScreen />
        </ErrorBoundary>
      )}
      {screen === 'death' && (
        <ErrorBoundary screenName="DeathScreen">
          <DeathScreen />
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  )
}
