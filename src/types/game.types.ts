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
  value: number;
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

// ─── Etapas vitales ───────────────────────────────────────────────────────────
export type LifeStage = 'infancia' | 'adolescencia' | 'juventud' | 'adultez' | 'madurez' | 'vejez';

// ─── Feed narrativo ───────────────────────────────────────────────────────────
export interface FeedOption {
  id: string;
  label: string;
  color?: 'gold' | 'garnet' | 'muted';
}

export interface FeedEntry {
  id: string;
  week: number;
  year: number;
  text: string;
  importance: 'normal' | 'alta' | 'critica';
  answered: boolean;
  options?: FeedOption[];
  selectedOptionId?: string;
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
export interface TimelineEvent {
  id: string;
  yearOffset: number;
  label: string;
  type: 'logro' | 'perdida' | 'hito';
}

// ─── Economía ─────────────────────────────────────────────────────────────────
export interface Economy {
  liquidez: number;
  ingresosMensuales: number;
  gastosMensuales: number;
  patrimonioBruto: number;
  deudaTotal: number;
}

// ─── Carrera ─────────────────────────────────────────────────────────────────
export interface Career {
  profesion: string;
  nivel: number;       // 1–10
  experiencia: number; // años
  salarioMensual: number;
}

// ─── Flags de juego ───────────────────────────────────────────────────────────
export interface GameFlags {
  emancipado: boolean;
  tienePareja: boolean;
  parejaEstable: boolean;
  tieneHijos: number;
  tieneMascota: boolean;
  adiccion: string | null;
  reputacion: number; // 0–100
  tieneAmigos: boolean;
}
