// ─── Stats ────────────────────────────────────────────────────────────────────
export interface Stats {
  logica:      number   // 0-10
  creatividad: number
  disciplina:  number
  carisma:     number
  emocional:   number
  ambicion:    number
  fisico:      number
  riesgo:      number
  estabilidad: number
}

export function defaultStats(): Stats {
  return {
    logica: 5, creatividad: 5, disciplina: 5,
    carisma: 5, emocional: 5,  ambicion: 5,
    fisico: 5,  riesgo: 5,     estabilidad: 5,
  }
}

export function applyStatDeltas(stats: Stats, deltas: Partial<Stats>): Stats {
  const result = { ...stats }
  for (const [key, delta] of Object.entries(deltas)) {
    const k = key as keyof Stats
    result[k] = parseFloat(Math.min(10, Math.max(0, result[k] + (delta ?? 0))).toFixed(2))
  }
  return result
}

export function clampStat(v: number): number {
  return parseFloat(Math.min(10, Math.max(0, v)).toFixed(2))
}

// ─── Character ────────────────────────────────────────────────────────────────
export interface Character {
  name:      string
  gender:    'hombre' | 'mujer'
  birthYear: number
  country:   string
}

// ─── NPC parallel arc ─────────────────────────────────────────────────────────
export interface ParallelArcStep {
  triggerAge:         number
  event:              string         // lo que le pasa al NPC
  narrativeToPlayer?: string         // template con {{name}}, ausente = el jugador no se entera
}

// ─── Friend (NPC vivo) ────────────────────────────────────────────────────────
export interface Friend {
  id:             string
  name:           string
  gender:         'hombre' | 'mujer'
  role:           'friend' | 'rival' | 'mentor' | 'romantic'
  ageAtMeeting:   number
  stats:          Partial<Stats>
  arcProfile:     string
  currentArcStep: number
  alive:          boolean
  relationship:   number             // 0-100
  status?:        'cercano' | 'distante' | 'leal'
  parallelArc:    ParallelArcStep[]
  lastContactAge: number
  sharedMemories: string[]
}

// ─── Consequences ─────────────────────────────────────────────────────────────
export interface DelayedConsequence {
  triggerAge?:       number
  triggerFlag?:      string
  triggerYearsAfter?: number
  narrative:         (state: GameState) => string
  statDeltas?:       StatDeltaResolver
  flags?:            string[]
  unlockEvent?:      string
}

export interface PendingConsequence {
  id:           string
  sourceAge:    number
  sourceEvent:  string
  triggerAge?:  number
  triggerFlag?: string
  narrative:    (state: GameState) => string
  statDeltas?:  StatDeltaResolver
  flags?:       string[]
  unlockEvent?: string
  entryType?:   'event' | 'consequence' | 'npc' | 'memory' | 'reflection' | 'npc_reaction' | 'achievement'
}

// ─── NPC Template ─────────────────────────────────────────────────────────────
export interface NPCTemplate {
  role:        'friend' | 'rival' | 'mentor' | 'romantic'
  namePool:    string[]
  statProfile: Partial<Stats>
  arcProfile:  string
  parallelArc: ParallelArcStep[]
}

// ─── Event Option ─────────────────────────────────────────────────────────────
export type StatDeltaResolver = Partial<Stats> | ((state: GameState) => Partial<Stats>)

export function resolveDeltas(d: StatDeltaResolver, state: GameState): Partial<Stats> {
  return typeof d === 'function' ? d(state) : d
}

export interface NpcReaction {
  npcId:         (state: GameState) => string | null
  newStatus:     'cercano' | 'distante' | 'leal'
  narrativeLine: (state: GameState) => string
}

export interface EventOption {
  id:       string
  text:     (state: GameState) => string
  immediate: {
    narrative:    (state: GameState) => string
    statDeltas:   StatDeltaResolver
    flags:                  string[]
    flagsResolver?:         (state: GameState) => string[]
    removeFlags?:           string[]
    generateNPC?:           NPCTemplate
    career?:                Career
    economyDelta?:          number
    economyDeltaResolver?:  (state: GameState) => number
  }
  delayed:      DelayedConsequence[]
  npcReaction?:  NpcReaction
  memory?:      { id: string; text: (state: GameState) => string }
  epitaphSeed?: string
}

// ─── Game Event Template ──────────────────────────────────────────────────────
export interface GameEventTemplate {
  id:                string
  triggerAge:        number | [number, number]
  triggerFlags?:     string[]
  triggerAntiFlags?: string[]
  weight:            number
  context:           (state: GameState) => string
  options:           [EventOption, EventOption, EventOption]
}

// ─── Achievement ──────────────────────────────────────────────────────────────
export interface Achievement {
  id:          string
  title:       string
  description: string
  age:         number
  year:        number
  category:    'economico' | 'social' | 'personal' | 'profesional' | 'vital'
}

// ─── Epitaph ──────────────────────────────────────────────────────────────────
export interface EpitaphMoment {
  age:    number
  text:   string
  weight: number
}

export interface EpitaphState {
  seeds:       string[]
  currentText: string
  moments:     EpitaphMoment[]
}

// ─── Memory ───────────────────────────────────────────────────────────────────
export interface Memory {
  id:             string
  age:            number
  text:           string
  triggerContext: string[]
  recalled:       boolean
}

// ─── Narrative entry ──────────────────────────────────────────────────────────
export interface NarrativeEntry {
  id:                string
  age:               number
  text:              string
  importance:        'normal' | 'alta' | 'critica'
  type:              'event' | 'consequence' | 'npc' | 'memory' | 'reflection' | 'npc_reaction' | 'achievement'
  emotionalWeight?:  number  // 0–10; entries > 7 suppress passive narrative that quarter
  achievementTitle?: string
  category?:         Achievement['category']
}

// ─── Economy / Career ─────────────────────────────────────────────────────────
export interface GastosDetallados {
  alimentacion: number
  transporte:   number
  telefono:     number
  vivienda:     number
  ocio:         number
  otros:        number
}

export interface Economy {
  liquidez:          number
  ingresosMensual:   number
  gastosMensual:     number
  gastos:            GastosDetallados
  historialLiquidez: number[]   // last 20 quarterly snapshots
}

export interface Career {
  profesion:      string
  nivel:          number
  salarioMensual: number
}

// ─── Time allocation ──────────────────────────────────────────────────────────
export interface TimeAllocation {
  trabajo:  number   // semanas (total = 13)
  estudios: number
  social:   number
  salud:    number
  familia:  number
  ocio:     number
}

// ─── Sexual orientation ───────────────────────────────────────────────────────
export type SexualOrientation = 'heterosexual' | 'homosexual' | 'bisexual'

// ─── Game State ───────────────────────────────────────────────────────────────
export interface GameState {
  character:           Character
  ageYears:            number
  totalQuarters:       number
  stats:               Stats
  flags:               string[]
  friends:             Friend[]
  pendingConsequences: PendingConsequence[]
  memories:            Memory[]
  epitaph:             EpitaphState
  firedEvents:         string[]
  feed:                NarrativeEntry[]
  economy:             Economy
  career:              Career | null
  vitalLoad:           number              // 0-100
  legacyScore:         number
  sexualOrientation:   SexualOrientation
  orientationRevealed: boolean
  achievements:        Achievement[]
}

// ─── Flag helpers ─────────────────────────────────────────────────────────────
export function hasFlag(state: GameState, flag: string): boolean {
  return state.flags.includes(flag)
}

export function addFlags(state: GameState, flags: string[]): GameState {
  const newFlags = [...state.flags]
  for (const f of flags) {
    if (!newFlags.includes(f)) newFlags.push(f)
  }
  return { ...state, flags: newFlags }
}

export function removeFlags(state: GameState, flags: string[]): GameState {
  return { ...state, flags: state.flags.filter(f => !flags.includes(f)) }
}

export function getFirstFriend(state: GameState): Friend | undefined {
  return state.friends.find(f => f.role === 'friend')
}
