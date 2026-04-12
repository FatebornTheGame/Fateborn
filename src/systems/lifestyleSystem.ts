import type { GameState, TimeAllocation } from '../types/game.types'
import { applyStatDeltas } from '../types/game.types'

// ─── Types ────────────────────────────────────────────────────────────────────
export type LifestyleType =
  | 'ambitious'
  | 'balanced'
  | 'social'
  | 'athletic'
  | 'hedonist'
  | 'family'
  | 'spiritual'

export interface LifestyleConsequence {
  triggerAfterQuarters: number
  description:          string
}

export interface Lifestyle {
  type:         LifestyleType
  label:        string
  description:  string
  allocation:   TimeAllocation
  consequences: LifestyleConsequence[]
}

// ─── Lifestyle definitions ────────────────────────────────────────────────────
const LIFESTYLES: Record<LifestyleType, Lifestyle> = {
  ambitious: {
    type:        'ambitious',
    label:       'Ambicioso',
    description: 'El trabajo y los estudios lo son todo. El descanso es lo que queda después.',
    allocation:  { trabajo: 5, estudios: 4, familia: 1, social: 1, salud: 1, ocio: 1 },
    consequences: [
      { triggerAfterQuarters: 12, description: 'El esfuerzo sostenido empieza a generar resultados visibles.' },
      { triggerAfterQuarters: 24, description: 'Años de ambición acumulada. El cuerpo empieza a cobrar facturas.' },
    ],
  },
  balanced: {
    type:        'balanced',
    label:       'Equilibrado',
    description: 'Ninguna área dominante. Un ritmo sostenible a largo plazo.',
    allocation:  { trabajo: 2, estudios: 3, familia: 2, social: 2, salud: 2, ocio: 2 },
    consequences: [
      { triggerAfterQuarters: 16, description: 'El equilibrio genera estabilidad emocional profunda.' },
    ],
  },
  social: {
    type:        'social',
    label:       'Social',
    description: 'Las relaciones son la inversión más rentable. Las personas abren puertas.',
    allocation:  { trabajo: 2, estudios: 2, familia: 2, social: 5, salud: 1, ocio: 1 },
    consequences: [
      { triggerAfterQuarters: 8, description: 'La red de contactos empieza a materializarse.' },
    ],
  },
  athletic: {
    type:        'athletic',
    label:       'Atlético',
    description: 'El cuerpo primero. El rendimiento físico como base de todo lo demás.',
    allocation:  { trabajo: 2, estudios: 2, familia: 1, social: 1, salud: 6, ocio: 1 },
    consequences: [
      { triggerAfterQuarters: 8, description: 'El cuerpo responde como nunca. La mente también.' },
    ],
  },
  hedonist: {
    type:        'hedonist',
    label:       'Hedonista',
    description: 'Vivir bien, ahora. El futuro se encargará de sí mismo.',
    allocation:  { trabajo: 1, estudios: 1, familia: 1, social: 3, salud: 1, ocio: 6 },
    consequences: [
      { triggerAfterQuarters: 12, description: 'El placer sostenido tiene un coste que aún no está en la factura.' },
    ],
  },
  family: {
    type:        'family',
    label:       'Familiar',
    description: 'Los suyos son su proyecto de vida. Todo lo demás es secundario.',
    allocation:  { trabajo: 2, estudios: 1, familia: 6, social: 2, salud: 1, ocio: 1 },
    consequences: [
      { triggerAfterQuarters: 12, description: 'Los vínculos familiares son indestructibles. Eso vale más de lo que parece.' },
    ],
  },
  spiritual: {
    type:        'spiritual',
    label:       'Contemplativo',
    description: 'La introspección como práctica. El sentido por encima de la velocidad.',
    allocation:  { trabajo: 1, estudios: 3, familia: 1, social: 1, salud: 3, ocio: 4 },
    consequences: [
      { triggerAfterQuarters: 16, description: 'La claridad interior se convierte en una ventaja invisible.' },
    ],
  },
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function getLifestyle(type: LifestyleType): Lifestyle {
  return LIFESTYLES[type]
}

export function getLifestyleAllocation(type: LifestyleType): TimeAllocation {
  return LIFESTYLES[type].allocation
}

export function getAllLifestyles(): Lifestyle[] {
  return Object.values(LIFESTYLES)
}

// Passive per-quarter stat drift from lifestyle
export function applyLifestyleToQuarter(state: GameState, lifestyle: LifestyleType): GameState {
  const alloc = LIFESTYLES[lifestyle].allocation
  const total = Object.values(alloc).reduce((a, b) => a + b, 0)
  if (total === 0) return state

  const deltas: Partial<import('../types/game.types').Stats> = {}

  if (alloc.estudios >= 3) {
    deltas.logica     = (alloc.estudios / total) * 0.08
    deltas.disciplina = (alloc.estudios / total) * 0.04
  }
  if (alloc.social >= 3) {
    deltas.carisma   = (alloc.social / total) * 0.08
    deltas.emocional = (alloc.social / total) * 0.04
  }
  if (alloc.salud >= 3) {
    deltas.fisico      = (alloc.salud / total) * 0.08
    deltas.estabilidad = (alloc.salud / total) * 0.04
  }
  if (alloc.trabajo >= 4) {
    deltas.ambicion    = 0.04
    deltas.estabilidad = (deltas.estabilidad ?? 0) - 0.06
  }
  if (alloc.ocio >= 4) {
    deltas.creatividad = (alloc.ocio / total) * 0.06
    deltas.estabilidad = (deltas.estabilidad ?? 0) + 0.02
  }
  if (alloc.familia >= 4) {
    deltas.emocional   = (deltas.emocional ?? 0) + 0.06
    deltas.estabilidad = (deltas.estabilidad ?? 0) + 0.04
  }

  return { ...state, stats: applyStatDeltas(state.stats, deltas) }
}
