import type { GameState, Friend, ParallelArcStep } from '../types/game.types'
import { NAME_POOLS } from '../data/npcs/npcProfiles'

// ─── Partner gender from sexual orientation ───────────────────────────────────
export function partnerGender(state: GameState): 'hombre' | 'mujer' {
  const { gender }          = state.character
  const { sexualOrientation } = state
  if (sexualOrientation === 'homosexual')  return gender
  if (sexualOrientation === 'heterosexual') return gender === 'hombre' ? 'mujer' : 'hombre'
  return Math.random() < 0.5 ? 'hombre' : 'mujer'
}

// ─── Pick name from country pool ─────────────────────────────────────────────
function pickName(country: string, gender: 'hombre' | 'mujer'): string {
  const pool = NAME_POOLS[country]
  const list = pool
    ? (gender === 'hombre' ? pool.male : pool.female)
    : ['Alex', 'Sam', 'Jordan', 'Robin', 'Morgan']
  return list[Math.floor(Math.random() * list.length)]
}

// ─── Relationship arc — relative steps from meeting age ──────────────────────
export function buildPartnerArc(meetingAge: number): ParallelArcStep[] {
  return [
    {
      triggerAge:         meetingAge + 4,
      event:              'La relación supera su primera prueba seria.',
      narrativeToPlayer:  '{{name}} y tú habéis atravesado algo que no fue sencillo. El hecho de que todavía estéis aquí no es casualidad.',
    },
    {
      triggerAge:         meetingAge + 9,
      event:              'Nueve años de historia compartida.',
      narrativeToPlayer:  'La relación con {{name}} tiene ahora capas que ya no se improvisan. Hay cosas que ni necesitáis decir.',
    },
    {
      triggerAge:         meetingAge + 16,
      event:              'Dieciséis años — la relación ya tiene su propio idioma.',
      narrativeToPlayer:  '{{name}} y tú os conocéis de una forma que resulta imposible de explicar a quien no lo ha vivido desde dentro.',
    },
    {
      triggerAge:         meetingAge + 25,
      event:              'Veinticinco años juntos.',
      narrativeToPlayer:  'Veinticinco años. La relación con {{name}} ya no necesita justificarse ante nadie — ni siquiera ante vosotros mismos.',
    },
    {
      triggerAge:         meetingAge + 35,
      event:              'Treinta y cinco años — lo que queda es lo más esencial.',
      narrativeToPlayer:  'Lo que {{name}} y tú habéis construido no tiene nombre exacto. Pero tiene peso propio.',
    },
  ]
}

// ─── Create a romantic partner Friend ────────────────────────────────────────
export function createPartner(state: GameState): Friend {
  const gender = partnerGender(state)
  const name   = pickName(state.character.country, gender)
  const age    = state.ageYears

  return {
    id:             `partner_${name.toLowerCase()}_${age}`,
    name,
    gender,
    role:           'romantic',
    ageAtMeeting:   age,
    stats:          { emocional: 6, carisma: 6, estabilidad: 5 },
    arcProfile:     'pareja_vital',
    currentArcStep: 0,
    alive:          true,
    relationship:   70,
    status:         'cercano',
    parallelArc:    buildPartnerArc(age),
    lastContactAge: age,
    sharedMemories: [],
  }
}

// ─── Helper — get existing romantic partner ───────────────────────────────────
export function getRomanticPartner(state: GameState): Friend | undefined {
  return state.friends.find(f => f.role === 'romantic' && f.alive)
}

export function partnerName(state: GameState): string {
  return getRomanticPartner(state)?.name ?? 'tu pareja'
}
