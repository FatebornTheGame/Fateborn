import type { GameState, Friend } from '../types/game.types'
import type { Quarter } from './timeSystem'

type Allocation = Quarter['allocation']

// ─── Bancos de nombres ────────────────────────────────────────────────────────
const NOMBRES_M = ['Alejandro','Carlos','David','Javier','Luis','Marcos','Pablo',
                   'Sergio','Andrés','Diego','Fernando','Iván','Jorge','Raúl']
const NOMBRES_F = ['Ana','Carmen','Elena','Laura','María','Marta','Nuria','Sara',
                   'Sofía','Beatriz','Cristina','Isabel','Lucía','Patricia']

function rnd(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)] }
function uid()              { return `fr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }
function clamp(n: number, min = 0, max = 10) { return Math.min(max, Math.max(min, n)) }

// ─── Generación de amigos ─────────────────────────────────────────────────────
export function generateChildhoodFriend(state: GameState): Friend {
  const char = state.character
  const gender = Math.random() < 0.5 ? 'm' : 'f'
  const nombre = gender === 'm' ? rnd(NOMBRES_M) : rnd(NOMBRES_F)

  // Afinidad base correlacionada con los stats del personaje
  const emocional   = char?.stats.emocional ?? 5
  const carisma     = char?.stats.carisma   ?? 5
  const afBase      = clamp((emocional + carisma) / 2 + (Math.random() * 2 - 1))

  return {
    id:              uid(),
    nombre,
    edad:            state.ageYears + Math.floor(Math.random() * 3 - 1), // ±1 año
    origen:          'infancia',
    afinidad:        parseFloat(afBase.toFixed(1)),
    confianza:       parseFloat(clamp(afBase * 0.6 + Math.random()).toFixed(1)),
    ultimoContacto:  state.totalWeeks,
    activo:          true,
  }
}

export function generateSchoolFriend(state: GameState): Friend {
  const nombre = Math.random() < 0.5 ? rnd(NOMBRES_M) : rnd(NOMBRES_F)
  const logica = state.character?.stats.logica ?? 5
  return {
    id:             uid(),
    nombre,
    edad:           state.ageYears + Math.floor(Math.random() * 4 - 2),
    origen:         'instituto',
    afinidad:       parseFloat(clamp(logica * 0.4 + Math.random() * 3 + 2).toFixed(1)),
    confianza:      parseFloat(clamp(Math.random() * 4 + 1).toFixed(1)),
    ultimoContacto: state.totalWeeks,
    activo:         true,
  }
}

// ─── Actualización trimestral de amistades ───────────────────────────────────
export function updateFriendships(
  state: GameState,
  allocation: Allocation,
): Friend[] {
  const weeksSinceContact = (f: Friend) => state.totalWeeks - f.ultimoContacto

  let friends = state.friends.map(f => {
    if (!f.activo) return f

    let { afinidad, confianza } = f

    if (allocation.social > 0) {
      // Invertir en social → fortalece amistades activas
      const boost = allocation.social * 0.04
      afinidad  = clamp(afinidad  + boost + Math.random() * 0.05)
      confianza = clamp(confianza + boost * 0.6)
    } else {
      // Sin inversión social → deterioro gradual según tiempo
      const weeks = weeksSinceContact(f)
      const decay = weeks > 26 ? 0.12 : weeks > 13 ? 0.06 : 0.02
      afinidad = clamp(afinidad - decay)
    }

    const activo = afinidad >= 2
    return {
      ...f,
      afinidad:  parseFloat(afinidad.toFixed(1)),
      confianza: parseFloat(confianza.toFixed(1)),
      ultimoContacto: allocation.social > 0 ? state.totalWeeks : f.ultimoContacto,
      activo,
    }
  })

  // Generar nuevo amigo de infancia si corresponde y hay pocos amigos activos
  const activeCount = friends.filter(f => f.activo).length
  if (
    state.ageYears >= 6 &&
    state.ageYears <= 12 &&
    activeCount < 3 &&
    Math.random() < 0.25
  ) {
    friends = [...friends, generateChildhoodFriend(state)]
  }

  // Generar amigo de instituto en adolescencia
  if (
    state.ageYears >= 13 &&
    state.ageYears <= 17 &&
    activeCount < 5 &&
    Math.random() < 0.20
  ) {
    friends = [...friends, generateSchoolFriend(state)]
  }

  return friends
}
