import type { GameState, Economy, GastosDetallados } from '../types/game.types'
import type { CountryTier } from '../data/countries'

// ─── Base monthly economics per country tier ──────────────────────────────────
// liquidezInicial represents family background wealth at game start.
// The tick does not run until age 18 or until a career is active.

interface TierParams {
  liquidezInicial: number
  ingresoBase:     number
  alimentacion:    number
  transporte:      number
  ocio:            number
  otros:           number
}

const TIER_BASE: Record<CountryTier, TierParams> = {
  // Rich (France, Germany, Japan): comfortable family surplus
  A: { liquidezInicial: 1500, ingresoBase: 280, alimentacion: 120, transporte: 30, ocio: 30, otros: 20 },
  // Developed (Spain, Portugal, Italy): slight monthly squeeze
  B: { liquidezInicial: 500,  ingresoBase: 82,  alimentacion: 60,  transporte: 12, ocio: 8,  otros: 6  },
  // Emerging (LatAm, China, South Africa): ongoing pressure
  C: { liquidezInicial: 150,  ingresoBase: 33,  alimentacion: 28,  transporte: 6,  ocio: 3,  otros: 3  },
  // Developing (Nigeria, India): tight survival budget
  D: { liquidezInicial: 50,   ingresoBase: 17,  alimentacion: 15,  transporte: 3,  ocio: 2,  otros: 2  },
}

// ─── Initialize economy for a new game ───────────────────────────────────────
export function initEconomy(tier: CountryTier): Economy {
  const t = TIER_BASE[tier]

  const gastos: GastosDetallados = {
    alimentacion: t.alimentacion,
    transporte:   t.transporte,
    telefono:     0,    // no phone at age 6
    vivienda:     0,    // lives with family
    ocio:         t.ocio,
    otros:        t.otros,
  }

  const gastosMensual = gastos.alimentacion + gastos.transporte + gastos.telefono
    + gastos.vivienda + gastos.ocio + gastos.otros

  return {
    liquidez:          t.liquidezInicial,
    ingresosMensual:   t.ingresoBase,
    gastosMensual,
    gastos,
    historialLiquidez: [t.liquidezInicial],
  }
}

// ─── Advance economy one quarter (3 months) ───────────────────────────────────
export function processQuarterlyEconomy(state: GameState): GameState {
  // Economy only ticks once the character has real income (career) or is an adult.
  // Before that the liquidez value represents family background — it stays frozen.
  if (state.ageYears < 18 && !state.career) return state

  const eco = state.economy

  // Career salary overrides base income when career is active
  const ingresosMensual = state.career
    ? state.career.salarioMensual
    : eco.ingresosMensual

  const netQuarter      = (ingresosMensual - eco.gastosMensual) * 3
  const newLiquidez     = Math.round(eco.liquidez + netQuarter)

  // Rolling window of 20 snapshots (5 years of quarterly data)
  const newHistory = [...eco.historialLiquidez, newLiquidez].slice(-20)

  return {
    ...state,
    economy: {
      ...eco,
      liquidez:          newLiquidez,
      ingresosMensual,
      historialLiquidez: newHistory,
    },
  }
}
