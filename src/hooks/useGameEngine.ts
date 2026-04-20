import { useGameStore } from '../store/gameStore'

export function useGameEngine() {
  const pendingEvent  = useGameStore(s => s.pendingEvent)
  const gameState     = useGameStore(s => s.gameState)
  const lifestyle     = useGameStore(s => s.lifestyle)
  const isLiving      = useGameStore(s => s.isLiving)
  const startLiving   = useGameStore(s => s.startLiving)
  const stopLiving    = useGameStore(s => s.stopLiving)
  const resolveEvent  = useGameStore(s => s.resolveEvent)

  const canStartLiving = !pendingEvent && !!lifestyle && !!gameState && !isLiving

  return {
    gameState,
    pendingEvent,
    lifestyle,
    isLiving,
    canStartLiving,
    startLiving,
    stopLiving,
    resolveEvent,
  }
}
