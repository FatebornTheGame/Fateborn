import type {
  GameState,
  GameEventTemplate,
  EventOption,
  TimeAllocation,
  Friend,
  NarrativeEntry,
  PendingConsequence,
} from '../types/game.types'
import { getPassiveNarrative } from '../data/passiveNarrative'
import {
  applyStatDeltas,
  resolveDeltas,
  addFlags,
  removeFlags,
  hasFlag,
} from '../types/game.types'
import { checkMemoryTriggers, addMemory, markMemoriesRecalled } from './memorySystem'
import { updateEpitaph } from './epitaphSystem'
import { advanceNPCLives } from './npcLifeSystem'
import { NAME_POOLS, BEST_FRIEND_PARALLEL_ARC } from '../data/npcs/npcProfiles'
import { CHILDHOOD_EVENTS } from '../data/events/childhoodEvents'
import { ADOLESCENCE_EVENTS } from '../data/events/adolescenceEvents'

// ─── All events pool ─────────────────────────────────────────────────────────
const ALL_EVENTS: GameEventTemplate[] = [
  ...CHILDHOOD_EVENTS,
  ...ADOLESCENCE_EVENTS,
]

// ─── TurnResult ──────────────────────────────────────────────────────────────
export interface TurnResult {
  newState:       GameState
  firedEvent:     GameEventTemplate | null
  chosenOption:   EventOption | null
  consequencesDelivered: string[]
  memoriesRecalled: string[]
}

// ─── Pick a random name from country pool ────────────────────────────────────
function pickName(country: string, gender: 'hombre' | 'mujer'): string {
  const pool = NAME_POOLS[country]
  const list = pool
    ? (gender === 'hombre' ? pool.male : pool.female)
    : ['Alex', 'Sam', 'Jordan', 'Robin', 'Casey']
  return list[Math.floor(Math.random() * list.length)]
}

// ─── Get eligible events for current age ─────────────────────────────────────
function getEligibleEvents(state: GameState): GameEventTemplate[] {
  const age = state.ageYears
  return ALL_EVENTS.filter(ev => {
    if (ev.triggerAge !== age) return false
    if (state.firedEvents.includes(ev.id)) return false

    // triggerFlags: OR logic — at least one must match
    if (ev.triggerFlags && ev.triggerFlags.length > 0) {
      const hasAny = ev.triggerFlags.some(f => hasFlag(state, f))
      if (!hasAny) return false
    }

    // triggerAntiFlags: none must match
    if (ev.triggerAntiFlags && ev.triggerAntiFlags.length > 0) {
      const hasAny = ev.triggerAntiFlags.some(f => hasFlag(state, f))
      if (hasAny) return false
    }

    // Probabilistic weight
    if (ev.weight < 1 && Math.random() > ev.weight) return false

    return true
  })
}

// ─── Process pending consequences ────────────────────────────────────────────
function processPendingConsequences(state: GameState): {
  state: GameState
  delivered: string[]
} {
  const age = state.ageYears
  const remaining: PendingConsequence[] = []
  const delivered: string[] = []
  let s = { ...state }

  for (const pc of state.pendingConsequences) {
    let triggered = false

    if (pc.triggerAge !== undefined && pc.triggerAge <= age) {
      triggered = true
    } else if (pc.triggerFlag !== undefined && hasFlag(state, pc.triggerFlag)) {
      triggered = true
    }

    if (triggered) {
      const narrative = pc.narrative(s)
      delivered.push(narrative)

      const entry: NarrativeEntry = {
        id:              `consequence_${pc.id}`,
        age,
        text:            narrative,
        importance:      'alta',
        type:            pc.entryType ?? 'consequence',
        emotionalWeight: 9,
      }
      s = { ...s, feed: [...s.feed, entry] }

      if (pc.statDeltas) {
        s = { ...s, stats: applyStatDeltas(s.stats, pc.statDeltas) }
      }
      if (pc.flags) {
        s = addFlags(s, pc.flags)
      }
      if (pc.unlockEvent) {
        s = addFlags(s, [`unlock_${pc.unlockEvent}`])
      }
    } else {
      remaining.push(pc)
    }
  }

  return { state: { ...s, pendingConsequences: remaining }, delivered }
}

// ─── Apply a chosen option to state ──────────────────────────────────────────
function applyOption(state: GameState, ev: GameEventTemplate, option: EventOption): GameState {
  const age = state.ageYears
  let s = { ...state }

  // Immediate narrative
  const narrative = option.immediate.narrative(s)
  const entry: NarrativeEntry = {
    id:         `event_${ev.id}_${option.id}`,
    age,
    text:       narrative,
    importance: ev.weight === 1 ? 'alta' : 'normal',
    type:       'event',
  }
  s = { ...s, feed: [...s.feed, entry] }

  // Stat deltas
  const deltas = resolveDeltas(option.immediate.statDeltas, s)
  s = { ...s, stats: applyStatDeltas(s.stats, deltas) }

  // Flags
  s = addFlags(s, option.immediate.flags)
  if (option.immediate.removeFlags) {
    s = removeFlags(s, option.immediate.removeFlags)
  }

  // Generate NPC
  if (option.immediate.generateNPC) {
    const tpl  = option.immediate.generateNPC
    const gender: 'hombre' | 'mujer' = Math.random() < 0.5 ? 'hombre' : 'mujer'
    const name = pickName(s.character.country, gender)
    const newFriend: Friend = {
      id:             `npc_${name.toLowerCase()}_${age}`,
      name,
      gender,
      role:           tpl.role,
      ageAtMeeting:   age,
      stats:          tpl.statProfile,
      arcProfile:     tpl.arcProfile,
      currentArcStep: 0,
      alive:          true,
      relationship:   50,
      parallelArc:    tpl.parallelArc.length > 0 ? tpl.parallelArc : BEST_FRIEND_PARALLEL_ARC,
      lastContactAge: age,
      sharedMemories: [],
    }
    s = { ...s, friends: [...s.friends, newFriend] }
  }

  // NPC reaction: immediate status update + deferred narrative line
  if (option.npcReaction) {
    const rx     = option.npcReaction
    const npcId  = rx.npcId(s)
    if (npcId) {
      s = {
        ...s,
        friends: s.friends.map(f => f.id === npcId ? { ...f, status: rx.newStatus } : f),
      }
      const rxPc: PendingConsequence = {
        id:          `${ev.id}_${option.id}_npc_rx`,
        sourceAge:   age,
        sourceEvent: ev.id,
        triggerAge:  age,   // fires on the very next quarter (triggerAge <= currentAge)
        narrative:   rx.narrativeLine,
        entryType:   'npc_reaction',
      }
      s = { ...s, pendingConsequences: [...s.pendingConsequences, rxPc] }
    }
  }

  // Schedule delayed consequences
  const newPending: PendingConsequence[] = option.delayed.map((dc, i) => {
    const resolvedTriggerAge = dc.triggerYearsAfter !== undefined
      ? age + dc.triggerYearsAfter
      : dc.triggerAge

    return {
      id:          `${ev.id}_${option.id}_dc${i}`,
      sourceAge:   age,
      sourceEvent: ev.id,
      triggerAge:  resolvedTriggerAge,
      triggerFlag: dc.triggerFlag,
      narrative:   dc.narrative,
      statDeltas:  dc.statDeltas,
      flags:       dc.flags,
      unlockEvent: dc.unlockEvent,
    }
  })
  s = { ...s, pendingConsequences: [...s.pendingConsequences, ...newPending] }

  // Memory
  if (option.memory) {
    s = addMemory(s, {
      id:             option.memory.id,
      age,
      text:           option.memory.text(s),
      triggerContext: [],
    })
  }

  // Epitaph
  if (option.epitaphSeed) {
    s = { ...s, epitaph: updateEpitaph(s, option.epitaphSeed) }
  }

  // Mark event as fired
  s = { ...s, firedEvents: [...s.firedEvents, ev.id] }

  return s
}

// ─── Allocation-based passive stat changes ────────────────────────────────────
function applyAllocationEffects(state: GameState, alloc: TimeAllocation): GameState {
  const total = alloc.trabajo + alloc.estudios + alloc.familia + alloc.social + alloc.salud + alloc.ocio
  if (total === 0) return state

  const deltas: Partial<import('../types/game.types').Stats> = {}

  // estudios → lógica, disciplina
  if (alloc.estudios > 3) {
    deltas.logica     = (alloc.estudios / total) * 0.1
    deltas.disciplina = (alloc.estudios / total) * 0.05
  }

  // social → carisma, emocional
  if (alloc.social > 2) {
    deltas.carisma   = (alloc.social / total) * 0.1
    deltas.emocional = (alloc.social / total) * 0.05
  }

  // salud → físico, estabilidad
  if (alloc.salud > 1) {
    deltas.fisico      = (alloc.salud / total) * 0.1
    deltas.estabilidad = (alloc.salud / total) * 0.05
  }

  // trabajo excesivo → stress → riesgo y -estabilidad
  if (alloc.trabajo > 6) {
    deltas.ambicion    = 0.05
    deltas.estabilidad = (deltas.estabilidad ?? 0) - 0.1
  }

  // ocio → creatividad
  if (alloc.ocio > 2) {
    deltas.creatividad = (alloc.ocio / total) * 0.05
  }

  return { ...state, stats: applyStatDeltas(state.stats, deltas) }
}

// ─── Central engine entry point ───────────────────────────────────────────────
export function processGameTurn(
  state:          GameState,
  allocation:     TimeAllocation,
  resolveEvent?:  (ev: GameEventTemplate, s: GameState) => EventOption,
): TurnResult {
  let s = { ...state }

  // 1. Advance age by one quarter
  const newTotalQuarters = s.totalQuarters + 1
  const newAgeYears      = Math.floor(newTotalQuarters / 4)
  s = { ...s, totalQuarters: newTotalQuarters, ageYears: newAgeYears }

  // 2. Apply allocation passive effects
  s = applyAllocationEffects(s, allocation)

  // 3. Process pending consequences
  const { state: afterConsequences, delivered } = processPendingConsequences(s)
  s = afterConsequences

  // 4. Advance NPC arcs
  s = advanceNPCLives(s)

  // 5. Check memory triggers before event
  let memoriesRecalled: string[] = []

  // 6. Find and fire eligible event
  const eligible = getEligibleEvents(s)
  let firedEvent: GameEventTemplate | null = null
  let chosenOption: EventOption | null     = null

  if (eligible.length > 0) {
    // Pick highest weight event (or first eligible)
    firedEvent = eligible.reduce((best, ev) => ev.weight > best.weight ? ev : best, eligible[0])

    // Check memory triggers for this event
    const recalled = checkMemoryTriggers(s, firedEvent.id)
    if (recalled.length > 0) {
      memoriesRecalled = recalled.map(m => m.id)
      s = markMemoriesRecalled(s, memoriesRecalled)

      // Add recall narrative entries
      for (const mem of recalled) {
        const entry: NarrativeEntry = {
          id:         `memory_recall_${mem.id}`,
          age:        s.ageYears,
          text:       `[Recuerdo] ${mem.text}`,
          importance: 'normal',
          type:       'memory',
        }
        s = { ...s, feed: [...s.feed, entry] }
      }
    }

    // Resolve option
    if (resolveEvent) {
      chosenOption = resolveEvent(firedEvent, s)
    } else {
      chosenOption = firedEvent.options[0]  // default: first option
    }

    s = applyOption(s, firedEvent, chosenOption)
  }

  return {
    newState:             s,
    firedEvent,
    chosenOption,
    consequencesDelivered: delivered,
    memoriesRecalled,
  }
}

// ─── UI-friendly split: prepare quarter (pre-event) ──────────────────────────
// Runs allocation effects, consequences, NPC arcs.
// Returns the intermediate state and the event (if any) waiting for player input.
export interface QuarterPrep {
  intermediateState:     GameState
  pendingEvent:          GameEventTemplate | null
  consequencesDelivered: string[]
}

export function prepareQuarter(state: GameState, allocation: TimeAllocation): QuarterPrep {
  let s = { ...state }

  const newTotalQuarters = s.totalQuarters + 1
  const newAgeYears      = Math.floor(newTotalQuarters / 4)
  s = { ...s, totalQuarters: newTotalQuarters, ageYears: newAgeYears }

  s = applyAllocationEffects(s, allocation)

  // Snapshot feed length before consequences/NPC arcs to detect high-weight entries this quarter
  const feedLengthBeforeEvents = s.feed.length

  const { state: afterConsequences, delivered } = processPendingConsequences(s)
  s = afterConsequences

  s = advanceNPCLives(s)

  const eligible    = getEligibleEvents(s)
  const pendingEvent = eligible.length > 0
    ? eligible.reduce((best, ev) => ev.weight > best.weight ? ev : best, eligible[0])
    : null

  // Skip passive narrative if the quarter already carries a high-weight entry (NPC death, major consequence)
  const quarterHasHeavyEntry = s.feed
    .slice(feedLengthBeforeEvents)
    .some(e => (e.emotionalWeight ?? 0) > 7)

  if (!pendingEvent && !quarterHasHeavyEntry) {
    const passiveText = getPassiveNarrative(s)
    if (passiveText) {
      const passiveEntry: NarrativeEntry = {
        id:         `passive_${s.totalQuarters}`,
        age:        s.ageYears,
        text:       passiveText,
        importance: 'normal',
        type:       'reflection',
      }
      s = { ...s, feed: [...s.feed, passiveEntry] }
    }
  }

  return { intermediateState: s, pendingEvent, consequencesDelivered: delivered }
}

// ─── UI-friendly split: commit player's event choice ─────────────────────────
export function commitEventChoice(
  state:    GameState,
  event:    GameEventTemplate,
  optionId: string,
): GameState {
  const option = event.options.find(o => o.id === optionId)
  if (!option) return state

  let s = state

  // Check memory triggers
  const recalled = checkMemoryTriggers(s, event.id)
  if (recalled.length > 0) {
    s = markMemoriesRecalled(s, recalled.map(m => m.id))
    for (const mem of recalled) {
      const entry: NarrativeEntry = {
        id:         `memory_recall_${mem.id}`,
        age:        s.ageYears,
        text:       `[Recuerdo] ${mem.text}`,
        importance: 'normal',
        type:       'memory',
      }
      s = { ...s, feed: [...s.feed, entry] }
    }
  }

  return applyOption(s, event, option)
}

// ─── Advance multiple quarters (skip) ────────────────────────────────────────
export function processMultipleQuarters(
  state:      GameState,
  allocation: TimeAllocation,
  count:      number,
): GameState {
  let s = state
  for (let i = 0; i < count; i++) {
    const result = processGameTurn(s, allocation)
    s = result.newState
  }
  return s
}
