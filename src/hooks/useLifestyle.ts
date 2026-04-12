import { useGameStore } from '../store/gameStore'
import { getAllLifestyles, getLifestyle } from '../systems/lifestyleSystem'

/**
 * Provides lifestyle state and the list of available lifestyles.
 */
export function useLifestyle() {
  const lifestyle    = useGameStore(s => s.lifestyle)
  const setLifestyle = useGameStore(s => s.setLifestyle)
  const allLifestyles = getAllLifestyles()

  const current = lifestyle ? getLifestyle(lifestyle) : null

  return {
    current,
    lifestyle,
    allLifestyles,
    setLifestyle,
    hasLifestyle: !!lifestyle,
  }
}
