import type { GameState, Economy, GastosDetallados, EconomyLevel } from '../types/game.types'
import { hasFlag } from '../types/game.types'
import type { CountryTier } from '../data/countries'

// ─── Base monthly costs per country tier ─────────────────────────────────────
// Used when the character becomes economically active (career or emancipated).
// NOT used at init — economy starts fully zeroed.
interface TierParams {
  alimentacion: number
  transporte:   number
  ocio:         number
  otros:        number
}

const TIER_BASE: Record<CountryTier, TierParams> = {
  A: { alimentacion: 120, transporte: 30, ocio: 30, otros: 20 },
  B: { alimentacion: 60,  transporte: 12, ocio: 8,  otros: 6  },
  C: { alimentacion: 28,  transporte: 6,  ocio: 3,  otros: 3  },
  D: { alimentacion: 15,  transporte: 3,  ocio: 2,  otros: 2  },
}

// ─── Flags that indicate economic activity ────────────────────────────────────
const ECONOMIC_FLAGS = [
  'trabajo_temprano',
  'primer_trabajo_a_16',
  'emancipado',
  'buscando_trabajo_sector',
  'trabajo_supervivencia',
]

// ─── Economy level from current liquidez ─────────────────────────────────────
export function getEconomyLevel(state: GameState): EconomyLevel {
  const { liquidez } = state.economy
  if (liquidez < 0)      return 'precario'
  if (liquidez < 500)    return 'bajo'
  if (liquidez < 5000)   return 'medio'
  if (liquidez < 20000)  return 'alto'
  return 'rico'
}

// ─── Initialize economy for a new game — everything starts at zero ────────────
export function initEconomy(tier: CountryTier): Economy {
  const t = TIER_BASE[tier]

  // Tier-based gastos are stored so processQuarterlyEconomy can use them once
  // economic activity begins (career assigned or economic flag set).
  const gastos: GastosDetallados = {
    alimentacion: t.alimentacion,
    transporte:   t.transporte,
    telefono:     0,
    vivienda:     0,
    ocio:         t.ocio,
    otros:        t.otros,
  }

  return {
    liquidez:          0,
    ingresosMensual:   0,
    gastosMensual:     0,
    gastos,
    historialLiquidez: [0],
  }
}

// ─── Compute current monthly expenses ────────────────────────────────────────
// Returns all zeros when the character has no career and no economic activity.
function calcularGastosMensuales(state: GameState): GastosDetallados {
  const isEconomicallyActive = state.career !== null
    || ECONOMIC_FLAGS.some(f => hasFlag(state, f))

  if (!isEconomicallyActive) {
    return { alimentacion: 0, transporte: 0, telefono: 0, vivienda: 0, ocio: 0, otros: 0 }
  }

  return state.economy.gastos
}

// ─── Advance economy one quarter (3 months) ───────────────────────────────────
export function processQuarterlyEconomy(state: GameState): GameState {
  // Economy only ticks once the character has real income (career) or is an adult.
  if (state.ageYears < 18 && !state.career) return state

  const eco = state.economy

  const ingresosActuales = state.career
    ? state.career.salarioMensual
    : eco.ingresosMensual

  // Recompute expenses every tick — reflects current life situation
  const gastosActuales    = calcularGastosMensuales(state)
  const gastosMensual     = gastosActuales.alimentacion + gastosActuales.transporte
    + gastosActuales.telefono + gastosActuales.vivienda
    + gastosActuales.ocio     + gastosActuales.otros

  const netQuarter    = (ingresosActuales - gastosMensual) * 3
  const newLiquidez   = Math.round(eco.liquidez + netQuarter)

  const newHistory = [...eco.historialLiquidez, newLiquidez].slice(-20)

  return {
    ...state,
    economy: {
      ...eco,
      liquidez:          newLiquidez,
      ingresosMensual:   ingresosActuales,
      gastosMensual,
      gastos:            gastosActuales,
      historialLiquidez: newHistory,
    },
  }
}
