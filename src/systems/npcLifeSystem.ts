import type { GameState, Friend, NarrativeEntry } from '../types/game.types'

// ─── Sustituir {{name}} en template ──────────────────────────────────────────
function interpolate(template: string, name: string): string {
  return template.replace(/\{\{name\}\}/g, name)
}

// ─── Avanzar arcos paralelos de todos los NPCs ───────────────────────────────
export function advanceNPCLives(state: GameState): GameState {
  const age  = state.ageYears
  const feed = [...state.feed]
  const updatedFriends: Friend[] = []

  for (const friend of state.friends) {
    if (!friend.alive) {
      updatedFriends.push(friend)
      continue
    }

    let updated = { ...friend }

    // Walk through arc steps and fire those matching current age
    for (let i = updated.currentArcStep; i < updated.parallelArc.length; i++) {
      const step = updated.parallelArc[i]
      if (step.triggerAge > age) break

      // Fire this step
      updated = { ...updated, currentArcStep: i + 1 }

      // Handle death arc (age ~77)
      if (step.triggerAge >= 77) {
        const chance = friend.stats.fisico !== undefined
          ? Math.max(0.2, 1 - (friend.stats.fisico / 10) * 0.5)
          : 0.6
        if (Math.random() < chance) {
          updated = { ...updated, alive: false }
        }
      }

      // Push narrative to feed if player-visible
      if (step.narrativeToPlayer) {
        const text = interpolate(step.narrativeToPlayer, friend.name)
        const isHighImpact = step.triggerAge >= 60
        const entry: NarrativeEntry = {
          id:              `npc_${friend.id}_arc_${i}`,
          age,
          text,
          importance:      isHighImpact ? 'alta' : 'normal',
          type:            'npc',
          emotionalWeight: isHighImpact ? 9 : undefined,
        }
        feed.push(entry)
      }
    }

    updatedFriends.push(updated)
  }

  return { ...state, friends: updatedFriends, feed }
}

// ─── Obtener update narrativo de un NPC específico ───────────────────────────
export function getNPCStatusUpdate(npc: Friend, currentAge: number): string | null {
  for (let i = npc.currentArcStep; i < npc.parallelArc.length; i++) {
    const step = npc.parallelArc[i]
    if (step.triggerAge > currentAge) break
    if (step.narrativeToPlayer) {
      return interpolate(step.narrativeToPlayer, npc.name)
    }
  }
  return null
}
