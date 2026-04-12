import type { GameFlags, Difficulty } from '../types/game.types'

// ─── Probabilidad anual de muerte ─────────────────────────────────────────────
// Retorna probabilidad 0-1 para un año dado.
export function annualDeathProbability(
  age: number,
  vitalLoad: number,
  flags: GameFlags,
  difficulty: Difficulty,
): number {
  let base: number
  if (age <= 60)      base = 0.001  // 0.1%
  else if (age <= 70) base = 0.008  // 0.8%
  else if (age <= 80) base = 0.025  // 2.5%
  else if (age <= 90) base = 0.06   // 6%
  else                base = 0.15   // 15%

  let mult = 1
  if (vitalLoad > 80)           mult *= 2
  if (flags.enfermedadTerminal) mult *= 5
  if (difficulty === 'ironman') mult *= 1.5

  return Math.min(1, base * mult)
}
