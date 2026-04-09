import { create } from 'zustand';
import type { AppScreen, Character, CharacterStats } from '../types/game.types';

// Los 4 slots de ancestros: [abueloPaterno, abuelaPaterna, abueloMaterno, abuelaMaterna]
export type AncestorSlots = [string | null, string | null, string | null, string | null];

interface GameState {
  screen: AppScreen;
  ancestors: AncestorSlots;
  character: Character | null;

  // Acciones
  setScreen: (screen: AppScreen) => void;
  setAncestor: (slot: 0 | 1 | 2 | 3, archetypeId: string | null) => void;
  setCharacter: (character: Character) => void;
  resetGame: () => void;
}

const DEFAULT_ANCESTORS: AncestorSlots = [null, null, null, null];

export const useGameStore = create<GameState>((set) => ({
  screen: 'start',
  ancestors: DEFAULT_ANCESTORS,
  character: null,

  setScreen: (screen) => set({ screen }),

  setAncestor: (slot, archetypeId) =>
    set((state) => {
      const next = [...state.ancestors] as AncestorSlots;
      next[slot] = archetypeId;
      return { ancestors: next };
    }),

  setCharacter: (character) => set({ character }),

  resetGame: () =>
    set({
      screen: 'start',
      ancestors: DEFAULT_ANCESTORS,
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
