// ─── Stats del personaje — 9 valores en escala 0-10 ─────────────────────────
export interface CharacterStats {
  // COGNITIVO
  logica: number;
  creatividad: number;
  disciplina: number;
  // SOCIAL
  carisma: number;
  emocional: number;
  ambicion: number;
  // VITAL
  fisico: number;
  riesgo: number;
  estabilidad: number;
}

// ─── Ancestro / Arquetipo ─────────────────────────────────────────────────────
export interface ArchetypeStat {
  stat: keyof CharacterStats;
  value: number; // 0-10
}

export interface Archetype {
  id: string;
  name: string;
  symbol: string;
  description: string;
  accentColor: string;
  stats: ArchetypeStat[];
}

// ─── País ─────────────────────────────────────────────────────────────────────
export interface CountryModifiers {
  costovida: number;
  oportunidad: number;
  estabilidad: number;
  sanidad: number;
  educacion: number;
}

export interface Country {
  nombre: string;
  tier: 1 | 2 | 3 | 4;
  modificadores: CountryModifiers;
}

// ─── Personaje ────────────────────────────────────────────────────────────────
export type NarrativeFlags = Record<string, boolean | string | number>;

export interface Character {
  name: string;
  gender: 'hombre' | 'mujer';
  birthYear: number;
  country: string;
  ancestorIds: [string, string, string, string];
  stats: CharacterStats;
  flags: NarrativeFlags;
}

// ─── Pantallas ────────────────────────────────────────────────────────────────
export type AppScreen = 'start' | 'ancestors' | 'birth' | 'game' | 'death';
