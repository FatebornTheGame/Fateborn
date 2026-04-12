import type { GameState, Memory } from '../types/game.types'

// ─── Triggers de contexto por evento ─────────────────────────────────────────
const MEMORY_CONTEXTS: Record<string, string[]> = {
  first_friend:       ['amistad', 'infancia', 'colegio', 'primer_contacto'],
  hobby_discovery:    ['creatividad', 'infancia', 'tiempo_libre', 'identidad'],
  school_conflict:    ['conflicto', 'injusticia', 'valentía', 'miedo'],
  family_dynamic:     ['familia', 'tensión', 'infancia', 'comprensión'],
  talent_discovered:  ['talento', 'identidad', 'reconocimiento', 'orgullo'],
  first_love:         ['amor', 'adolescencia', 'vulnerabilidad', 'deseo'],
  academic_decision:  ['futuro', 'decisión', 'identidad', 'miedo'],
  pressure_moment:    ['esfuerzo', 'límite', 'disciplina', 'duda'],
  adulthood_threshold:['transición', 'libertad', 'responsabilidad', 'nostalgia'],
}

// ─── Comprobar qué memorias resurgen en el contexto actual ───────────────────
export function checkMemoryTriggers(state: GameState, currentEventId: string): Memory[] {
  const eventContexts = MEMORY_CONTEXTS[currentEventId] ?? []
  if (eventContexts.length === 0) return []

  const recalled: Memory[] = []

  for (const memory of state.memories) {
    if (memory.recalled) continue  // ya recordada recientemente

    const overlap = memory.triggerContext.filter(ctx => eventContexts.includes(ctx))
    if (overlap.length >= 2) {
      recalled.push({ ...memory, recalled: true })
    }
  }

  return recalled
}

// ─── Añadir una nueva memoria al estado ──────────────────────────────────────
export function addMemory(state: GameState, memory: Omit<Memory, 'recalled'>): GameState {
  const newMemory: Memory = { ...memory, recalled: false }
  return { ...state, memories: [...state.memories, newMemory] }
}

// ─── Marcar memorias como recordadas ─────────────────────────────────────────
export function markMemoriesRecalled(state: GameState, ids: string[]): GameState {
  return {
    ...state,
    memories: state.memories.map(m =>
      ids.includes(m.id) ? { ...m, recalled: true } : m,
    ),
  }
}

// ─── Reset de recalled (inicio de nuevo año) ─────────────────────────────────
export function resetRecalledMemories(state: GameState): GameState {
  return {
    ...state,
    memories: state.memories.map(m => ({ ...m, recalled: false })),
  }
}
