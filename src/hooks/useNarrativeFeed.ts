import { useMemo } from 'react'
import type { NarrativeEntry } from '../types/game.types'
import { useGameStore } from '../store/gameStore'

export interface FeedGroup {
  age:     number
  year:    number
  entries: NarrativeEntry[]
}

/**
 * Transforms the flat feed array into age-grouped entries
 * and exposes the pending event context.
 */
export function useNarrativeFeed() {
  const gameState    = useGameStore(s => s.gameState)
  const pendingEvent = useGameStore(s => s.pendingEvent)
  const resolveEvent = useGameStore(s => s.resolveEvent)

  const grouped = useMemo<FeedGroup[]>(() => {
    if (!gameState) return []

    const birthYear = gameState.character.birthYear
    const groups    = new Map<number, NarrativeEntry[]>()

    for (const entry of gameState.feed) {
      const existing = groups.get(entry.age) ?? []
      groups.set(entry.age, [...existing, entry])
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([age, entries]) => ({ age, year: birthYear + age, entries }))
  }, [gameState])

  return {
    grouped,
    pendingEvent,
    resolveEvent,
    isEmpty: grouped.length === 0,
  }
}
