import type { GameFlags, Difficulty, LifeStage, GameState } from '../types/game.types'

// ─── Quarter: unidad de tiempo de juego (13 semanas) ─────────────────────────
export interface Quarter {
  year: number
  quarter: 1 | 2 | 3 | 4
  weeksPassed: number
  allocation: {
    trabajo: number
    estudios: number
    familia: number
    social: number
    salud: number
    ocio: number
  }
}

// ─── Helpers de tiempo ────────────────────────────────────────────────────────
export function getLifeStage(age: number): LifeStage {
  if (age < 13) return 'infancia'
  if (age < 19) return 'adolescencia'
  if (age < 31) return 'juventud'
  if (age < 51) return 'adultez'
  if (age < 71) return 'madurez'
  return 'vejez'
}

export function calculateAge(
  birthYear: number,
  currentYear: number,
  currentWeek: number,
): number {
  const totalWeeks = (currentYear - birthYear) * 52 + currentWeek
  return Math.floor(totalWeeks / 52)
}

// ─── Probabilidad de muerte ───────────────────────────────────────────────────
export function getDeathProbability(age: number, cargaVital: number): number {
  let base: number
  if (age <= 60)      base = 0.001   // 0.1% anual
  else if (age <= 70) base = 0.008   // 0.8%
  else if (age <= 80) base = 0.025   // 2.5%
  else if (age <= 90) base = 0.06    // 6%
  else                base = 0.15    // 15%

  const mult = cargaVital > 80 ? 2 : 1
  return Math.min(1, base * mult)
}

export function shouldDie(
  age: number,
  cargaVital: number,
  difficulty: Difficulty,
): boolean {
  if (age >= 95) return true
  let prob = getDeathProbability(age, cargaVital)
  if (difficulty === 'ironman') prob *= 1.5
  return Math.random() < prob
}

// ─── annualDeathProbability (legacy — usado en advanceWeeks) ─────────────────
export function annualDeathProbability(
  age: number,
  vitalLoad: number,
  flags: GameFlags,
  difficulty: Difficulty,
): number {
  let base = getDeathProbability(age, vitalLoad)
  let mult = 1
  if (flags.enfermedadTerminal) mult *= 5
  if (difficulty === 'ironman')  mult *= 1.5
  return Math.min(1, base * mult)
}

// ─── advanceQuarter — avance inmutable del estado ────────────────────────────
export function advanceQuarter(
  state: GameState,
  allocation: Quarter['allocation'],
): GameState {
  const total = Object.values(allocation).reduce((a, b) => a + b, 0)
  if (total !== 13) {
    throw new Error(`La asignación debe sumar 13 semanas. Suma actual: ${total}`)
  }

  const WEEKS = 13
  const newTotalWeeks = state.totalWeeks + WEEKS
  const newAge = state.character
    ? Math.floor(newTotalWeeks / 52)
    : state.ageYears
  const newYear = state.character
    ? state.character.birthYear + newAge
    : state.currentYear

  // Carga vital:
  //   trabajo/estudios → estrés (+)
  //   salud/ocio/familia/social → recuperación (-)
  const vitalDelta =
    allocation.trabajo   * 0.35 +
    allocation.estudios  * 0.20 -
    allocation.salud     * 1.20 -
    allocation.ocio      * 0.50 -
    allocation.familia   * 0.25 -
    allocation.social    * 0.15

  const newVitalLoad = parseFloat(
    Math.min(100, Math.max(0, state.vitalLoad + vitalDelta)).toFixed(1)
  )

  return {
    ...state,
    totalWeeks: newTotalWeeks,
    ageYears: newAge,
    currentYear: newYear,
    vitalLoad: newVitalLoad,
  }
}
