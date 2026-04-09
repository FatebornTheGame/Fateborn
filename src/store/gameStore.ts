import { create } from 'zustand';
import type { AppScreen, Character, CharacterStats } from '../types/game.types';

// Los 4 slots de ancestros: [abueloPaterno, abuelaPaterna, abueloMaterno, abuelaMaterna]
export type AncestorSlots = [string | null, string | null, string | null, string | null];

export type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado';

interface GameState {
  screen: AppScreen;
  difficulty: Difficulty;
  ancestors: AncestorSlots;
  selectedCountry: string | null;
  character: Character | null;

  // Acciones
  setScreen: (screen: AppScreen) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAncestor: (slot: 0 | 1 | 2 | 3, archetypeId: string | null) => void;
  setCountry: (country: string) => void;
  confirmAncestors: () => void;
  startNewGame: (name: string, gender: 'hombre' | 'mujer', stats: CharacterStats) => void;
  setCharacter: (character: Character) => void;
  resetGame: () => void;
}

const DEFAULT_ANCESTORS: AncestorSlots = [null, null, null, null];

export const useGameStore = create<GameState>((set) => ({
  screen: 'start',
  difficulty: 'fateborn',
  ancestors: DEFAULT_ANCESTORS,
  selectedCountry: null,
  character: null,

  setScreen: (screen) => set({ screen }),
  setDifficulty: (difficulty) => set({ difficulty }),

  setAncestor: (slot, archetypeId) =>
    set((state) => {
      const next = [...state.ancestors] as AncestorSlots;
      next[slot] = archetypeId;
      return { ancestors: next };
    }),

  setCountry: (country) => set({ selectedCountry: country }),

  confirmAncestors: () => set((state) => ({ selectedCountry: state.selectedCountry })),

  startNewGame: (name, gender, stats) =>
    set((state) => ({
      character: {
        name,
        gender,
        birthYear: 1990,
        country: state.selectedCountry ?? 'España',
        ancestorIds: state.ancestors as [string, string, string, string],
        stats,
        flags: {},
      },
      screen: 'game',
    })),

  setCharacter: (character) => set({ character }),

  resetGame: () =>
    set({
      screen: 'start',
      difficulty: 'fateborn',
      ancestors: DEFAULT_ANCESTORS,
      selectedCountry: null,
      character: null,
    }),
}));

// Helper: calcula los stats del personaje a partir de los 4 ancestros
export function computeStats(
  ancestorStats: CharacterStats[],
): CharacterStats {
  const keys = Object.keys(ancestorStats[0]) as (keyof CharacterStats)[];
  const result = {} as CharacterStats;
  for (const key of keys) {
    const avg = ancestorStats.reduce((sum, s) => sum + s[key], 0) / ancestorStats.length;
    const mutation = (Math.random() - 0.5) * 2; // ±1 punto (~±10% de 10)
    result[key] = Math.min(10, Math.max(0, parseFloat((avg + mutation).toFixed(1))));
  }
  return result;
}
