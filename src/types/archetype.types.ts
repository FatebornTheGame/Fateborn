import type { Stats } from './game.types'

export interface Archetype {
  id:          string
  name:        string
  description: string
  lore:        string    // single evocative line shown on card
  stats:       Stats
}

export type AncestorSlot = 0 | 1 | 2 | 3

// Slots 0,2 = grandfathers (paternal, maternal)
// Slots 1,3 = grandmothers (paternal, maternal)
export function isGrandfatherSlot(slot: AncestorSlot): boolean {
  return slot === 0 || slot === 2
}

export function isGrandmotherSlot(slot: AncestorSlot): boolean {
  return slot === 1 || slot === 3
}
