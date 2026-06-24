import type { GameState, EpitaphState, EpitaphMoment } from '../types/game.types'

// ─── Seeds predefinidas para combinar ────────────────────────────────────────

const OPENING_PHRASES = [
  'Aquí descansa',
  'En memoria de',
  'Vivió',
  'De aquí pasó',
]

function pickByAge(arr: string[], age: number): string {
  return arr[age % arr.length]
}

// Gender-aware transition word — avoids mis-gendering the epitaph subject
function getTransition(gender: string, index: number): string {
  const pool = gender === 'hombre'
    ? ['El que', 'Quien', 'Alguien que']
    : gender === 'mujer'
    ? ['La que', 'Quien', 'Alguien que']
    : ['Quien', 'Alguien que']
  return pool[index % pool.length]
}

// ─── Generar texto del epitafio desde seeds ────────────────────────────────────
export function generateEpitaphText(seeds: string[], state: GameState): string {
  const { name } = state.character
  const age = state.ageYears

  if (seeds.length === 0) {
    return `${name}. ${state.character.birthYear}. La historia aún se escribe.`
  }

  const opening    = pickByAge(OPENING_PHRASES, age)
  const transition = getTransition(state.character.gender, seeds.length)

  if (seeds.length === 1) {
    return `${opening} ${name}. ${transition} ${seeds[0]}.`
  }

  if (seeds.length === 2) {
    return `${opening} ${name}. ${transition} ${seeds[0]} y ${seeds[1]}.`
  }

  // 3+: narrative combination
  const first = seeds[0]
  const last  = seeds[seeds.length - 1]
  const middle = seeds.slice(1, -1)

  let text = `${opening} ${name}.\n`
  text += `${transition} ${first}`
  if (middle.length > 0) {
    text += `, ${middle.join(', ')}`
  }
  text += ` y al final ${last}.`

  // Addendum based on dominant stat
  const s = state.stats
  const dominantEntries: [string, number][] = [
    ['la lógica',               s.logica],
    ['la creatividad',          s.creatividad],
    ['la disciplina',           s.disciplina],
    ['el carisma',              s.carisma],
    ['la inteligencia emocional', s.emocional],
    ['la ambición',             s.ambicion],
    ['la vitalidad',            s.fisico],
    ['el coraje',               s.riesgo],
    ['la estabilidad',          s.estabilidad],
  ]
  const dominants = dominantEntries.sort((a, b) => b[1] - a[1])

  const dominant = dominants[0]
  if (dominant[1] > 7) {
    text += `\nLo que nunca le faltó fue ${dominant[0]}.`
  }

  return text
}

// ─── Actualizar el estado del epitafio ───────────────────────────────────────
export function updateEpitaph(state: GameState, newSeed: string): EpitaphState {
  const seeds = [...state.epitaph.seeds, newSeed]
  const currentText = generateEpitaphText(seeds, { ...state, epitaph: { ...state.epitaph, seeds } })

  const moment: EpitaphMoment = {
    age:    state.ageYears,
    text:   newSeed,
    weight: 1,
  }

  return {
    seeds,
    currentText,
    moments: [...state.epitaph.moments, moment],
  }
}

export function initialEpitaph(): EpitaphState {
  return { seeds: [], currentText: '', moments: [] }
}
