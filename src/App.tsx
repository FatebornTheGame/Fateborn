import { useGameStore } from './store/gameStore'
import StartScreen from './screens/StartScreen'
import AncestorSelection from './screens/AncestorSelection'
import BirthScreen from './screens/BirthScreen'
import GameScreen from './screens/GameScreen'
import DeathScreen from './screens/DeathScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)
  if (screen === 'start') return <StartScreen />
  if (screen === 'ancestors') return <AncestorSelection />
  if (screen === 'birth') return <BirthScreen />
  if (screen === 'game') return <GameScreen />
  if (screen === 'death') return <DeathScreen />
  return <StartScreen />
}
