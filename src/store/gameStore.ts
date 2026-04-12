import { create } from 'zustand'
import type { GameState, Stats, SexualOrientation } from '../types/game.types'
import { defaultStats, clampStat } from '../types/game.types'

export type StatFlash = 'pos' | 'neg'
import type { Archetype, AncestorSlot } from '../types/archetype.types'
import type { GameEventTemplate } from '../types/game.types'
import type { LifestyleType } from '../systems/lifestyleSystem'
import { getLifestyleAllocation } from '../systems/lifestyleSystem'
import { initialEpitaph } from '../systems/epitaphSystem'
import { prepareQuarter, commitEventChoice } from '../systems/engineCore'
import { getCountryBirthYear } from '../data/countries'
import {
  MUTATION_RANGE,
  ORIENTATION_HETEROSEXUAL_CHANCE,
  ORIENTATION_HOMOSEXUAL_CHANCE,
} from '../constants/game.constants'

// ─── Screen routing ───────────────────────────────────────────────────────────
export type Screen = 'start' | 'ancestors' | 'birth' | 'game' | 'death'
export type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado'

// ─── Ancestor selection: 4 slots ─────────────────────────────────────────────
type AncestorSlots = [
  Archetype | null,
  Archetype | null,
  Archetype | null,
  Archetype | null,
]

// ─── Compute inherited stats from 4 ancestors + mutation ─────────────────────
function computeInheritedStats(ancestors: AncestorSlots): Stats {
  const filled = ancestors.filter((a): a is Archetype => a !== null)
  if (filled.length === 0) return defaultStats()

  const keys = Object.keys(filled[0].stats) as (keyof Stats)[]
  const averaged = {} as Stats

  for (const key of keys) {
    const avg = filled.reduce((sum, a) => sum + a.stats[key], 0) / filled.length
    const mutation = 1 + (Math.random() * 2 - 1) * MUTATION_RANGE
    averaged[key] = clampStat(avg * mutation)
  }
  return averaged
}

// ─── Compute hidden genes (max ancestor variance) ────────────────────────────
function computeHiddenGenes(ancestors: AncestorSlots, inherited: Stats): Partial<Stats> {
  const filled = ancestors.filter((a): a is Archetype => a !== null)
  if (filled.length === 0) return {}

  const hidden: Partial<Stats> = {}
  const keys = Object.keys(inherited) as (keyof Stats)[]

  for (const key of keys) {
    const maxAncestorVal = Math.max(...filled.map(a => a.stats[key]))
    // Hidden gene = potential that wasn't fully expressed
    const hiddenPotential = clampStat(maxAncestorVal * (1 + MUTATION_RANGE))
    if (hiddenPotential > inherited[key] + 0.5) {
      hidden[key] = hiddenPotential
    }
  }
  return hidden
}

// ─── Roll sexual orientation ──────────────────────────────────────────────────
function rollSexualOrientation(): SexualOrientation {
  const roll = Math.random()
  if (roll < ORIENTATION_HETEROSEXUAL_CHANCE) return 'heterosexual'
  if (roll < ORIENTATION_HETEROSEXUAL_CHANCE + ORIENTATION_HOMOSEXUAL_CHANCE) return 'homosexual'
  return 'bisexual'
}

// ─── Store interface ──────────────────────────────────────────────────────────
interface GameStore {
  // Navigation
  screen:     Screen
  setScreen:  (screen: Screen) => void

  // Pre-game setup
  difficulty:    Difficulty
  setDifficulty: (difficulty: Difficulty) => void

  // Ancestor selection
  selectedAncestors: AncestorSlots
  selectedCountry:   string
  inheritedStats:    Stats | null
  hiddenGenes:       Partial<Stats>
  selectAncestor:    (ancestor: Archetype, slot: AncestorSlot) => void
  removeAncestor:    (slot: AncestorSlot) => void
  setCountry:        (country: string) => void
  confirmAncestors:  () => void

  // Game
  gameState:    GameState | null
  lifestyle:    LifestyleType | null
  pendingEvent: GameEventTemplate | null
  // State captured before event was found — player resolves event from here
  preEventState:    GameState | null
  activeTab:        'initiative' | 'feed'
  lastStatChanges:  Partial<Record<keyof Stats, StatFlash>>

  startNewGame:   (name: string, gender: 'hombre' | 'mujer') => void
  setLifestyle:   (lifestyle: LifestyleType) => void
  advanceQuarter: () => void
  resolveEvent:   (optionId: string) => void
  setActiveTab:   (tab: 'initiative' | 'feed') => void
}

// ─── Store implementation ─────────────────────────────────────────────────────
export const useGameStore = create<GameStore>((set, get) => ({
  // Navigation
  screen:    'start',
  setScreen: (screen) => set({ screen }),

  // Pre-game setup
  difficulty:    'fateborn',
  setDifficulty: (difficulty) => set({ difficulty }),

  // Ancestor selection
  selectedAncestors: [null, null, null, null],
  selectedCountry:   'España',
  inheritedStats:    null,
  hiddenGenes:       {},
  selectAncestor: (ancestor, slot) => {
    const slots = [...get().selectedAncestors] as AncestorSlots
    slots[slot] = ancestor
    set({ selectedAncestors: slots })
  },
  removeAncestor: (slot) => {
    const slots = [...get().selectedAncestors] as AncestorSlots
    slots[slot] = null
    set({ selectedAncestors: slots })
  },
  setCountry: (country) => set({ selectedCountry: country }),
  confirmAncestors: () => {
    const { selectedAncestors } = get()
    const inherited = computeInheritedStats(selectedAncestors)
    const hidden    = computeHiddenGenes(selectedAncestors, inherited)
    set({ inheritedStats: inherited, hiddenGenes: hidden })
    get().setScreen('birth')
  },

  // Game
  gameState:        null,
  lifestyle:        null,
  pendingEvent:     null,
  preEventState:    null,
  activeTab:        'feed',
  lastStatChanges:  {},

  startNewGame: (name, gender) => {
    const { inheritedStats, selectedCountry } = get()
    if (!inheritedStats) return

    const birthYear          = getCountryBirthYear(selectedCountry)
    const sexualOrientation  = rollSexualOrientation()

    const initialState: GameState = {
      character:           { name, gender, birthYear, country: selectedCountry },
      ageYears:            6,
      totalQuarters:       6 * 4,
      stats:               inheritedStats,
      flags:               [],
      friends:             [],
      pendingConsequences: [],
      memories:            [],
      epitaph:             initialEpitaph(),
      firedEvents:         [],
      feed:                [],
      economy:             { liquidez: 0, ingresosMensual: 0, gastosMensual: 0 },
      career:              null,
      vitalLoad:           10,
      legacyScore:         0,
      sexualOrientation,
      orientationRevealed: false,
    }

    set({ gameState: initialState, screen: 'game' })
  },

  setLifestyle: (lifestyle) => set({ lifestyle }),

  advanceQuarter: () => {
    const { gameState, lifestyle, pendingEvent } = get()
    // Don't advance if there's an unresolved event
    if (!gameState || pendingEvent) return
    if (!lifestyle) return

    const allocation = getLifestyleAllocation(lifestyle)
    const prep       = prepareQuarter(gameState, allocation)

    if (prep.pendingEvent) {
      set({
        gameState:     prep.intermediateState,
        pendingEvent:  prep.pendingEvent,
        preEventState: prep.intermediateState,
      })
    } else {
      set({ gameState: prep.intermediateState })
    }
  },

  resolveEvent: (optionId) => {
    const { preEventState, pendingEvent } = get()
    if (!preEventState || !pendingEvent) return

    const newState = commitEventChoice(preEventState, pendingEvent, optionId)

    // Compute which stats changed and in which direction
    const oldStats = preEventState.stats
    const newStats = newState.stats
    const changes: Partial<Record<keyof Stats, StatFlash>> = {}
    for (const key of Object.keys(oldStats) as (keyof Stats)[]) {
      const delta = newStats[key] - oldStats[key]
      if (Math.abs(delta) >= 0.05) {
        changes[key] = delta > 0 ? 'pos' : 'neg'
      }
    }

    set({ gameState: newState, pendingEvent: null, preEventState: null, lastStatChanges: changes })

    // Clear flash after animation completes (1s animation + small buffer)
    setTimeout(() => set({ lastStatChanges: {} }), 1400)
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
