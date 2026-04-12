/**
 * TEST MOTOR FATEBORN — sin UI
 * Simula 20 años de vida (80 trimestres) y verifica el motor.
 * Ejecutar: npx tsx src/systems/test.ts
 */
import { advanceQuarter, getLifeStage, getDeathProbability } from './timeSystem'
import { getEventsForQuarter } from './eventSystem'
import { processAllocation } from './allocationSystem'
import { updateFriendships } from './friendSystem'
import type { GameState } from '../types/game.types'

// ─── Estado inicial de prueba ────────────────────────────────────────────────
const BIRTH_YEAR = 1990

const initialState: GameState = {
  character: {
    name: 'Alicia',
    gender: 'mujer',
    birthYear: BIRTH_YEAR,
    country: 'España',
    ancestorIds: ['academico', 'cuidador', 'artista', 'lider'],
    stats: {
      logica: 6.5, creatividad: 7.0, disciplina: 5.5,
      carisma: 6.0, emocional: 7.5, ambicion: 6.0,
      fisico: 5.0, riesgo: 4.5, estabilidad: 6.5,
    },
    flags: {},
  },
  ageYears: 0,
  currentYear: BIRTH_YEAR,
  totalWeeks: 0,
  vitalLoad: 10,
  legacyScore: 0,
  feed: [],
  timeline: [],
  economy: { liquidez: 1000, ingresosMensuales: 0, gastosMensuales: 200, patrimonioBruto: 1000, deudaTotal: 0 },
  career: null,
  gameFlags: {
    emancipado: false, tienePareja: false, parejaEstable: false,
    tieneHijos: 0, tieneMascota: false, adiccion: null, reputacion: 10,
    tieneAmigos: false, enfermedadTerminal: false,
  },
  difficulty: 'fateborn',
  friends: [],
  pendingConsequences: [],
}

// ─── Asignaciones de tiempo por etapa ────────────────────────────────────────
type Alloc = { trabajo: number; estudios: number; familia: number; social: number; salud: number; ocio: number }

function getAllocationForAge(age: number): Alloc {
  if (age < 13) {
    return { trabajo: 0, estudios: 6, familia: 3, social: 2, salud: 1, ocio: 1 }
  } else if (age < 18) {
    return { trabajo: 2, estudios: 5, familia: 2, social: 2, salud: 1, ocio: 1 }
  } else if (age < 25) {
    return { trabajo: 4, estudios: 3, familia: 1, social: 2, salud: 1, ocio: 2 }
  } else {
    return { trabajo: 6, estudios: 1, familia: 2, social: 2, salud: 1, ocio: 1 }
  }
}

// ─── Simulación principal ─────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════')
console.log('  TEST MOTOR FATEBORN — 20 años de vida')
console.log('═══════════════════════════════════════════\n')

let state: GameState = { ...initialState }
let totalEvents = 0
let totalFriends = 0

const QUARTERS = 20 * 4  // 80 trimestres = 20 años

for (let q = 0; q < QUARTERS; q++) {
  const prevAge = state.ageYears
  const allocation = getAllocationForAge(state.ageYears)

  // 1. Avanzar trimestre
  const advanced = advanceQuarter(state, allocation)

  // 2. Obtener eventos
  const events = getEventsForQuarter(advanced)

  // 3. Procesar stats
  const statDeltas = processAllocation(state, allocation)

  // 4. Actualizar amistades
  const updatedFriends = updateFriendships(state, allocation)

  // Aplicar stat deltas
  const newStats = { ...advanced.character!.stats }
  for (const { stat, delta } of statDeltas) {
    newStats[stat] = parseFloat(Math.min(10, Math.max(0, newStats[stat] + delta)).toFixed(1))
  }

  // Marcar eventos como fired
  const newFlags = { ...advanced.character!.flags }
  for (const ev of events) {
    newFlags[`ev_${ev.id}`] = true
    totalEvents++
  }

  // Actualizar estado
  state = {
    ...advanced,
    character: { ...advanced.character!, stats: newStats, flags: newFlags },
    friends: updatedFriends,
  }

  const ageChanged = state.ageYears !== prevAge
  totalFriends = updatedFriends.filter(f => f.activo).length

  // ── Log de hitos ─────────────────────────────────────────────────────────
  if (ageChanged) {
    const stage = getLifeStage(state.ageYears)
    const deathProb = (getDeathProbability(state.ageYears, state.vitalLoad) * 100).toFixed(3)
    console.log(
      `► Edad ${String(state.ageYears).padStart(2)} | ${state.currentYear} | ` +
      `Etapa: ${stage.padEnd(13)} | Vital: ${String(state.vitalLoad.toFixed(1)).padStart(5)} | ` +
      `Mort: ${deathProb}% | Amigos activos: ${totalFriends}`
    )
  }

  // Log de eventos
  for (const ev of events) {
    const entry = ev.generate(state)
    const preview = entry.text.slice(0, 70).replace(/\n/g, ' ')
    console.log(
      `  [${ev.type === 'fixed' ? 'FIJO' : 'PROB'}] ` +
      `id:${ev.id.padEnd(22)} → ${preview}…`
    )
  }
}

// ─── Resumen final ────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════')
console.log('  RESUMEN')
console.log('═══════════════════════════════════════════')
console.log(`  Edad final:       ${state.ageYears} años`)
console.log(`  Carga vital:      ${state.vitalLoad}`)
console.log(`  Total eventos:    ${totalEvents}`)
console.log(`  Amigos activos:   ${state.friends.filter(f => f.activo).length}`)
console.log(`  Total amigos:     ${state.friends.length}`)
console.log('\n  Stats finales:')
const stats = state.character!.stats
const statNames: Record<string, string> = {
  logica: 'Lógica', creatividad: 'Creatividad', disciplina: 'Disciplina',
  carisma: 'Carisma', emocional: 'Emocional', ambicion: 'Ambición',
  fisico: 'Físico', riesgo: 'Riesgo', estabilidad: 'Estabilidad',
}
for (const [key, label] of Object.entries(statNames)) {
  const val = stats[key as keyof typeof stats]
  const bar = '█'.repeat(Math.round(val))
  console.log(`    ${label.padEnd(12)}: ${String(val.toFixed(1)).padStart(4)} ${bar}`)
}

console.log('\n  Verificación de eventos fijos por edad:')
const flags = state.character!.flags
const fixedEvents = [
  { id: 'first_friend',          expectedAge: 6  },
  { id: 'hobby_discovery',       expectedAge: 8  },
  { id: 'school_conflict',       expectedAge: 10 },
  { id: 'family_dynamic',        expectedAge: 11 },
  { id: 'talent_discovered',     expectedAge: 12 },
  { id: 'first_love',            expectedAge: 13 },
  { id: 'academic_path',         expectedAge: 14 },
  { id: 'first_job_idea',        expectedAge: 16 },
  { id: 'end_of_high_school',    expectedAge: 17 },
  { id: 'adulthood_threshold',   expectedAge: 18 },
]
let allOk = true
for (const { id, expectedAge } of fixedEvents) {
  const fired = flags[`ev_${id}`] === true
  const status = fired ? '✓' : '✗'
  if (!fired) allOk = false
  console.log(`    ${status} ev_${id.padEnd(24)} (debía dispararse a los ${expectedAge} años)`)
}
console.log(`\n  ${allOk ? '✓ TODOS los eventos fijos dispararon correctamente' : '✗ Faltan eventos fijos — revisar getEventsForQuarter'}`)
console.log('\n═══════════════════════════════════════════\n')
