import { useGameStore } from '../store/gameStore'

/**
 * Exposes the game engine actions in a hook-friendly interface.
 * Components should use this rather than calling the store directly.
 */
export function useGameEngine() {
  const pendingEvent   = useGameStore(s => s.pendingEvent)
  const gameState      = useGameStore(s => s.gameState)
  const lifestyle      = useGameStore(s => s.lifestyle)
  const advanceQuarter = useGameStore(s => s.advanceQuarter)
  const resolveEvent   = useGameStore(s => s.resolveEvent)

  const canAdvance = !pendingEvent && !!lifestyle && !!gameState

  return {
    gameState,
    pendingEvent,
    lifestyle,
    canAdvance,
    advanceQuarter,
    resolveEvent,
  }
}
