import type { GameState, Career } from '../types/game.types'
import { getCountryTier }        from '../data/countries'
import type { CountryTier }      from '../data/countries'

// ─── Salary table — monthly net, by tier and nivel ───────────────────────────
// Tier A = rich economies (France, Germany, Japan)
// Tier B = developed (Spain, Portugal, Italy)
// Tier C = emerging (Mexico, Brazil, Colombia, South Africa, China)
// Tier D = developing (Nigeria, India)
// Index 0 unused; indices 1-5 match nivel 1-5.
const SALARY_TABLE: Record<CountryTier, readonly number[]> = {
  A: [0, 1800, 2700, 4000, 5800, 8500],
  B: [0, 1200, 1800, 2600, 3800, 5500],
  C: [0,  600,  950, 1500, 2200, 3200],
  D: [0,  200,  350,  600,  950, 1400],
}

// ─── Career nivel labels ──────────────────────────────────────────────────────
const NIVEL_LABELS = ['', 'Inicio', 'Consolidado', 'Referente', 'Líder', 'Cima'] as const

export function getCareerSalary(country: string, nivel: number): number {
  const tier  = getCountryTier(country)
  const table = SALARY_TABLE[tier]
  return table[Math.min(5, Math.max(1, nivel))]
}

export function getCareerLabel(nivel: number): string {
  return NIVEL_LABELS[Math.min(5, Math.max(1, nivel))]
}

// Returns a new Career at nivel+1 with the table salary for the character's country.
export function promoteCareer(state: GameState): Career {
  const career   = state.career!
  const newNivel = Math.min(5, career.nivel + 1)
  return {
    ...career,
    nivel:          newNivel,
    salarioMensual: getCareerSalary(state.character.country, newNivel),
  }
}
