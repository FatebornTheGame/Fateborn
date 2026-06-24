import { useState, useEffect, useRef } from 'react'
import { useGameStore }                from '../store/gameStore'
import { generateNewspaper }           from '../systems/newsletterSystem'
import type { Newspaper }              from '../systems/newsletterSystem'

interface NewsletterState {
  pending: Newspaper | null
  dismiss: () => void
}

export function useNewsletter(): NewsletterState {
  const gameState = useGameStore(s => s.gameState)
  const age       = gameState?.ageYears ?? 0

  const [pending, setPending]   = useState<Newspaper | null>(null)
  const prevAgeRef              = useRef<number>(0)

  useEffect(() => {
    if (!gameState || age === 0) return

    // Age went backwards = new game — reset silently
    if (age < prevAgeRef.current) {
      prevAgeRef.current = age
      setPending(null)
      return
    }

    // Show newspaper once per year, starting from adolescence
    if (age !== prevAgeRef.current && age >= 13) {
      setPending(generateNewspaper(gameState))
    }

    prevAgeRef.current = age
  }, [age, gameState])

  return {
    pending,
    dismiss: () => setPending(null),
  }
}
