import type { GameState, TimeAllocation, GameEventTemplate, EventOption } from '../types/game.types'
import { defaultStats, hasFlag } from '../types/game.types'
import { initialEpitaph } from '../systems/epitaphSystem'
import { processGameTurn } from '../systems/engineCore'
import { initEconomy } from '../systems/economySystem'

// ─── Create initial state ─────────────────────────────────────────────────────
function createTestState(): GameState {
  return {
    character: {
      name:      'Marco',
      gender:    'hombre',
      birthYear: 1985,
      country:   'España',
    },
    ageYears:            6,
    totalQuarters:       6 * 4,
    stats:               {
      ...defaultStats(),
      logica:      5.5,
      creatividad: 6.0,
      disciplina:  4.8,
      carisma:     5.2,
      emocional:   5.7,
      ambicion:    5.0,
      fisico:      5.3,
      riesgo:      5.1,
      estabilidad: 4.9,
    },
    flags:               [],
    friends:             [],
    pendingConsequences: [],
    memories:            [],
    epitaph:             initialEpitaph(),
    firedEvents:         [],
    feed:                [],
    economy:             initEconomy('B'),  // España = tier B
    career:              null,
    vitalLoad:           10,
    legacyScore:         0,
    sexualOrientation:   'heterosexual',
    orientationRevealed: false,
  }
}

// ─── Age-appropriate allocations ─────────────────────────────────────────────
function getAllocation(age: number): TimeAllocation {
  if (age < 13) {
    return { trabajo: 0, estudios: 5, familia: 3, social: 3, salud: 1, ocio: 1 }
  }
  if (age < 18) {
    return { trabajo: 0, estudios: 6, familia: 2, social: 2, salud: 1, ocio: 2 }
  }
  return { trabajo: 4, estudios: 3, familia: 2, social: 2, salud: 1, ocio: 1 }
}

// ─── Smart event resolver ─────────────────────────────────────────────────────
function smartResolve(ev: GameEventTemplate, state: GameState): EventOption {
  const opts = ev.options

  // school_conflict: pick defender if flag, aggressor if riesgo high
  if (ev.id === 'school_conflict') {
    if (hasFlag(state, 'introvertido'))  return opts[2]
    if (state.stats.riesgo > 6)         return opts[0]
    return opts[1]
  }

  // first_love: be social if extrovert
  if (ev.id === 'first_love') {
    if (hasFlag(state, 'extrovertido')) return opts[0]
    return opts[1]
  }

  // academic_decision: follow top cognitive stat
  if (ev.id === 'academic_decision') {
    return state.stats.logica >= state.stats.creatividad ? opts[0] : opts[1]
  }

  // pressure_moment: try balance
  if (ev.id === 'pressure_moment') {
    return opts[1]
  }

  // adulthood_threshold: ambicioso if ambicion > 6
  if (ev.id === 'adulthood_threshold') {
    return state.stats.ambicion > 6 ? opts[0] : opts[1]
  }

  // Default: first option
  return opts[0]
}

// ─── Print helpers ────────────────────────────────────────────────────────────
function statsLine(state: GameState): string {
  const s = state.stats
  return [
    `Lóg:${s.logica.toFixed(1)}`,
    `Cre:${s.creatividad.toFixed(1)}`,
    `Dis:${s.disciplina.toFixed(1)}`,
    `Car:${s.carisma.toFixed(1)}`,
    `Emo:${s.emocional.toFixed(1)}`,
    `Amb:${s.ambicion.toFixed(1)}`,
    `Fís:${s.fisico.toFixed(1)}`,
    `Rie:${s.riesgo.toFixed(1)}`,
    `Est:${s.estabilidad.toFixed(1)}`,
  ].join(' | ')
}

function sep(char = '─', len = 70): string { return char.repeat(len) }

// ─── Main simulation ──────────────────────────────────────────────────────────
function main(): void {
  console.log(sep('═'))
  console.log('  FATEBORN — SIMULACIÓN DE MOTOR (25 años, 1985-2010)')
  console.log(sep('═'))

  let state = createTestState()
  let lastPrintedAge = state.ageYears
  let totalTurns     = 0

  // Simulate from age 6 to age 52 (46 years = 184 quarters)
  const TARGET_AGE = 52
  const MAX_QUARTERS = (TARGET_AGE - 6) * 4

  for (let q = 0; q < MAX_QUARTERS; q++) {
    const allocation = getAllocation(state.ageYears)
    const result     = processGameTurn(state, allocation, smartResolve)
    state            = result.newState
    totalTurns++

    // Print on event or age milestone
    const newAge = state.ageYears
    const yearChanged = newAge !== lastPrintedAge

    if (yearChanged && newAge % 2 === 0) {
      console.log(`\n${sep()}`)
      console.log(`  EDAD ${newAge} | ${state.character.name} (${state.character.birthYear + newAge})`)
      console.log(sep())
      console.log(`  Stats: ${statsLine(state)}`)
      if (state.friends.length > 0) {
        const alive  = state.friends.filter(f => f.alive).map(f => f.name).join(', ')
        const dead   = state.friends.filter(f => !f.alive).map(f => f.name).join(', ')
        if (alive) console.log(`  NPCs vivos:   ${alive}`)
        if (dead)  console.log(`  NPCs muertos: ${dead}`)
      }
      if (state.epitaph.seeds.length > 0) {
        console.log(`  Epitafio: "${state.epitaph.currentText}"`)
      }
    }

    if (result.firedEvent) {
      const ev   = result.firedEvent
      const opt  = result.chosenOption
      console.log(`\n  [EDAD ${newAge}] EVENTO: ${ev.id}`)
      console.log(`    Opción elegida: ${opt?.id ?? '?'}`)

      // Show event narrative from feed (last entry before this point)
      const lastEntry = [...state.feed].reverse().find(e => e.type === 'event')
      if (lastEntry) {
        console.log(`    Narrativa: ${lastEntry.text}`)
      }
    }

    if (result.consequencesDelivered.length > 0) {
      for (const c of result.consequencesDelivered) {
        console.log(`\n  [CONSECUENCIA edad ${newAge}] ${c}`)
      }
    }

    if (result.memoriesRecalled.length > 0) {
      console.log(`  [MEMORIA RESURGE] ${result.memoriesRecalled.join(', ')}`)
    }

    lastPrintedAge = newAge
  }

  // Final summary
  console.log(`\n${sep('═')}`)
  console.log('  RESUMEN FINAL')
  console.log(sep('═'))
  console.log(`  Edad final:       ${state.ageYears}`)
  console.log(`  Trimestres:       ${totalTurns}`)
  console.log(`  Eventos disparados: ${state.firedEvents.join(', ') || 'ninguno'}`)
  console.log(`  Flags activos:    ${state.flags.slice(0, 10).join(', ')}${state.flags.length > 10 ? '...' : ''}`)
  console.log(`  Memorias:         ${state.memories.length}`)
  console.log(`  Amigos NPCs:      ${state.friends.length} (${state.friends.filter(f => f.alive).length} vivos)`)
  console.log(`  Consecuencias pendientes: ${state.pendingConsequences.length}`)
  console.log(`\n  Stats finales:`)
  console.log(`  ${statsLine(state)}`)

  console.log(`\n  Economía:`)
  console.log(`  Liquidez: ${state.economy.liquidez}€`)
  console.log(`  Ingresos: ${state.economy.ingresosMensual}€/mes | Gastos: ${state.economy.gastosMensual}€/mes`)
  console.log(`  Gastos: ali=${state.economy.gastos.alimentacion} tra=${state.economy.gastos.transporte} tel=${state.economy.gastos.telefono} viv=${state.economy.gastos.vivienda}`)
  console.log(`  Historial (${state.economy.historialLiquidez.length} trim.): ${state.economy.historialLiquidez.slice(0, 8).join(' → ')}${state.economy.historialLiquidez.length > 8 ? ' ...' : ''}`)

  if (state.epitaph.seeds.length > 0) {
    console.log(`\n  Epitafio actual:`)
    console.log(`  "${state.epitaph.currentText}"`)
  } else {
    console.log(`\n  [Sin epitafio todavía]`)
  }

  console.log(sep('═'))
  console.log('  FIN DE SIMULACIÓN')
  console.log(sep('═'))
}

main()
