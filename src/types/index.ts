export interface Stat {
  name: string;
  value: number;
}

export interface Archetype {
  id: string;
  name: string;
  symbol: string;
  description: string;
  accentColor: string;
  stats: Stat[];
}

export type Gender = 'abuelo' | 'abuela';

export interface Selection {
  archetypeId: string;
  gender: Gender;
}

// Stats del personaje — 9 valores en escala 0-10
export interface CharacterStats {
  logica: number;
  creatividad: number;
  disciplina: number;
  carisma: number;
  emocional: number;
  ambicion: number;
  fisico: number;
  riesgo: number;
  estabilidad: number;
}

// Flags narrativos acumulados a lo largo de la vida
export type NarrativeFlags = Record<string, boolean | string | number>;

// Estado completo del personaje
export interface Character {
  name: string;
  gender: 'hombre' | 'mujer';
  ancestorIds: string[];
  stats: CharacterStats;
  flags: NarrativeFlags;
}
