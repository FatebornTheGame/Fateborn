import type { GameState, StatDelta, PendingConsequence } from '../types/game.types'
import type { Quarter } from './timeSystem'

type Allocation = Quarter['allocation']

// ─── Consecuencias de asignación sobre stats ─────────────────────────────────
// Cada semana invertida genera pequeños cambios acumulativos en stats.
export function processAllocation(
  state: GameState,
  allocation: Allocation,
): StatDelta[] {
  const deltas: StatDelta[] = []
  const char = state.character
  if (!char) return deltas

  // TRABAJO: experiencia profesional → +ambicion, +disciplina pequeño
  if (allocation.trabajo > 0) {
    deltas.push({ stat: 'ambicion',   delta: allocation.trabajo * 0.015 })
    deltas.push({ stat: 'disciplina', delta: allocation.trabajo * 0.008 })
  }

  // ESTUDIOS: conocimiento → +logica, +disciplina
  if (allocation.estudios > 0) {
    deltas.push({ stat: 'logica',     delta: allocation.estudios * 0.025 })
    deltas.push({ stat: 'disciplina', delta: allocation.estudios * 0.015 })
  }

  // SOCIAL: relaciones → +carisma, +emocional
  if (allocation.social > 0) {
    deltas.push({ stat: 'carisma',   delta: allocation.social * 0.020 })
    deltas.push({ stat: 'emocional', delta: allocation.social * 0.018 })
  }

  // SALUD: bienestar → +fisico, -riesgo (más cuidado = menos imprudencia)
  if (allocation.salud > 0) {
    deltas.push({ stat: 'fisico',  delta:  allocation.salud * 0.030 })
    deltas.push({ stat: 'riesgo',  delta: -allocation.salud * 0.005 })
  }

  // FAMILIA: vínculos → +emocional, +estabilidad
  if (allocation.familia > 0) {
    deltas.push({ stat: 'emocional',   delta: allocation.familia * 0.015 })
    deltas.push({ stat: 'estabilidad', delta: allocation.familia * 0.020 })
  }

  // OCIO: creatividad y descanso → +creatividad, +riesgo leve
  if (allocation.ocio > 0) {
    deltas.push({ stat: 'creatividad', delta: allocation.ocio * 0.018 })
    deltas.push({ stat: 'riesgo',      delta: allocation.ocio * 0.008 })
  }

  // Consolidar deltas del mismo stat (sumar duplicados)
  const merged = new Map<keyof typeof char.stats, number>()
  for (const d of deltas) {
    merged.set(d.stat, (merged.get(d.stat) ?? 0) + d.delta)
  }
  return Array.from(merged.entries()).map(([stat, delta]) => ({ stat, delta }))
}

// ─── Consecuencias diferidas por inacción ────────────────────────────────────
// Trackea inacción acumulada en flags y devuelve consecuencias si se supera umbral.
export function checkInactionConsequences(
  state: GameState,
  allocation: Allocation,
): PendingConsequence[] {
  const consequences: PendingConsequence[] = []
  const flags = state.character?.flags ?? {}

  // ── Sin familia: distanciamiento familiar ────────────────────────────────
  if (allocation.familia === 0) {
    const streak = ((flags['inaccion_familia'] as number) ?? 0) + 1
    // Mutar estado de flags vía retorno de consecuencias (el store lo aplica)
    if (streak >= 3) {
      consequences.push({
        id: `fam_dist_${Date.now()}`,
        quartersRemaining: 2,
        type: 'family_distance',
        severity: 'moderado',
        message: `El distanciamiento con tu familia empieza a pesar. Llevas meses sin dedicarles tiempo real.`,
      })
    }
  }

  // ── Sin ocio: burnout gradual ─────────────────────────────────────────────
  if (allocation.ocio === 0 && allocation.trabajo > 6) {
    const streak = ((flags['inaccion_ocio'] as number) ?? 0) + 1
    if (streak >= 2) {
      consequences.push({
        id: `burnout_${Date.now()}`,
        quartersRemaining: 1,
        type: 'burnout',
        severity: 'leve',
        message: `El cuerpo y la mente empiezan a resentirse. Demasiado trabajo sin descanso tiene un precio.`,
      })
    }
  }

  // ── Sin social: aislamiento ───────────────────────────────────────────────
  if (allocation.social === 0 && state.ageYears >= 16) {
    const streak = ((flags['inaccion_social'] as number) ?? 0) + 1
    if (streak >= 4) {
      consequences.push({
        id: `aislamiento_${Date.now()}`,
        quartersRemaining: 3,
        type: 'isolation',
        severity: 'moderado',
        message: `El aislamiento social se acumula. Las amistades se enfrian cuando no se cuidan.`,
      })
    }
  }

  return consequences
}
