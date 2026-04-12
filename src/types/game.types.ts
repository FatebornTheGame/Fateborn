// ─── Dificultad ──────────────────────────────────────────────────────────────
export type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado';

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

// ─── Sistemas — deltas y consecuencias ───────────────────────────────────────
export interface StatDelta {
  stat: keyof CharacterStats;
  delta: number;
}

export interface PendingConsequence {
  id: string;
  quartersRemaining: number;
  type: string;
  severity: 'leve' | 'moderado' | 'grave';
  message: string;
}

// ─── Sistema de amistades ─────────────────────────────────────────────────────
export interface Friend {
  id: string;
  nombre: string;
  edad: number;
  origen: 'infancia' | 'instituto' | 'trabajo' | 'ocio';
  afinidad: number;     // 0-10
  confianza: number;    // 0-10
  ultimoContacto: number; // semana del juego
  activo: boolean;
}

// ─── Estado puro del juego (usado por los sistemas sin UI) ────────────────────
export interface GameState {
  character: Character | null;
  ageYears: number;
  currentYear: number;
  totalWeeks: number;
  vitalLoad: number;
  legacyScore: number;
  feed: FeedEntry[];
  timeline: TimelineEvent[];
  economy: Economy;
  career: Career | null;
  gameFlags: GameFlags;
  difficulty: Difficulty;
  friends: Friend[];
  pendingConsequences: PendingConsequence[];
}

// NarrativeEntry: entrada para el feed (sin id, lo genera el store)
export type NarrativeEntry = Omit<FeedEntry, 'id'>;

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
  enfermedadTerminal: boolean;
}
