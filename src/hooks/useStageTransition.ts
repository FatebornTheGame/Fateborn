import { useState, useEffect, useRef } from 'react'
import { useGameStore }                 from '../store/gameStore'

export type StageName = 'infancia' | 'adolescencia' | 'juventud' | 'adultez' | 'madurez' | 'vejez'

function getStage(age: number): StageName {
  if (age < 13) return 'infancia'
  if (age < 19) return 'adolescencia'
  if (age < 31) return 'juventud'
  if (age < 51) return 'adultez'
  if (age < 71) return 'madurez'
  return 'vejez'
}

interface StageTransitionState {
  pendingStage: StageName | null
  dismiss:      () => void
}

export function useStageTransition(): StageTransitionState {
  const age = useGameStore(s => s.gameState?.ageYears ?? 0)

  const [pendingStage, setPendingStage] = useState<StageName | null>(null)
  const prevStageRef  = useRef<StageName | null>(null)
  const prevAgeRef    = useRef<number>(0)

  useEffect(() => {
    if (age === 0) return
    const stage = getStage(age)

    // Age went backwards = new game started — reset silently, no transition
    if (age < prevAgeRef.current) {
      prevStageRef.current = stage
      prevAgeRef.current   = age
      return
    }

    // Stage crossed a boundary — trigger cinematic
    if (prevStageRef.current !== null && prevStageRef.current !== stage) {
      setPendingStage(stage)
    }

    prevStageRef.current = stage
    prevAgeRef.current   = age
  }, [age])

  return {
    pendingStage,
    dismiss: () => setPendingStage(null),
  }
}
