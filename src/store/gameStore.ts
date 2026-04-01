import { create } from 'zustand';
import type { Character, CharacterStats } from '../types';
import type { ActiveDisease, DiseaseCategory } from '../systems/diseaseSystem';
import { BB_STATE_DEFAULT } from '../arcs/breakingBad';
import type { BBState, BBPhase } from '../arcs/breakingBad';

// ─── Economy ─────────────────────────────────────────────────────────────────

export interface InversionItem {
  id:     string;
  nombre: string;
  valor:  number;
  rendimientoAnual: number; // porcentaje
}

export interface Inmueble {
  id:       string;
  nombre:   string;
  valor:    number;
  ingresoMensual: number;
  hipoteca: number;
}

export interface Economy {
  liquidez:           number;
  ingresosMensuales:  number;
  gastosMensuales:    number;
  patrimonioBruto:    number;
  deudaTotal:         number;
  carteraInversion:   InversionItem[];
  inmuebles:          Inmueble[];
}

// ─── Career ──────────────────────────────────────────────────────────────────

export type NivelCarrera = 'junior' | 'mid' | 'senior' | 'director' | 'ejecutivo' | 'independiente';

export interface Career {
  profesion:            string;
  nivel:                NivelCarrera;
  experiencia:          number; // años
  ingresosProfesionales: number; // mensual
  reputacion:           number; // 0-100
}

// ─── Time ────────────────────────────────────────────────────────────────────

export interface AsignacionSemanal {
  trabajo:   number; // horas
  familia:   number;
  salud:     number;
  formacion: number;
  ocio:      number;
}

export interface Time {
  semanaActual:       number;
  añoActual:          number;
  cargaVital:         number; // 0-100
  asignacionSemanal:  AsignacionSemanal;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface SymptomNotif {
  id:       string;
  text:     string;
  disease:  string;
  category: DiseaseCategory;
}

export interface Health {
  diseases:     ActiveDisease[];
  bbState:      BBState;
  symptomQueue: SymptomNotif[];
}

// ─── Country ─────────────────────────────────────────────────────────────────

export type CountryTier = 1 | 2 | 3 | 4; // 1 = desarrollado, 4 = frágil

export interface CountryModificadores {
  costovida:    number; // multiplicador
  oportunidad:  number; // 0-2, bonus oportunidades laborales
  estabilidad:  number; // 0-2, bonus estabilidad social
  sanidad:      number; // 0-2, calidad sistema sanitario
  educacion:    number; // 0-2, calidad sistema educativo
}

export interface Country {
  nombre:       string;
  tier:         CountryTier;
  modificadores: CountryModificadores;
}

// ─── Full Game State ──────────────────────────────────────────────────────────

export interface GameState {
  // Character (existing)
  character:   Character | null;
  ancestorIds: string[];

  // RPG slices
  economy:  Economy;
  career:   Career;
  time:     Time;
  country:  Country;
  health:   Health;

  // Actions — character
  setCharacter:   (char: Character | null) => void;
  setAncestorIds: (ids: string[]) => void;
  updateStats:    (deltas: Partial<CharacterStats>) => void;
  addFlag:        (key: string, value: boolean | string | number) => void;

  // Actions — economy
  setLiquidez:   (amount: number) => void;
  updateEconomy: (patch: Partial<Economy>) => void;
  addInversion:  (item: InversionItem) => void;
  addInmueble:   (inmueble: Inmueble) => void;

  // Actions — career
  updateCareer:     (patch: Partial<Career>) => void;
  ganarExperiencia: (años: number) => void;
  cambiarProfesion: (profesion: string, nivel: NivelCarrera, ingreso: number) => void;

  // Actions — time
  avanzarSemana:    () => void;
  setAsignacion:    (asignacion: Partial<AsignacionSemanal>) => void;
  updateCargaVital: (carga: number) => void;

  // Actions — country
  setCountry: (country: Country) => void;

  // Actions — health / diseases
  addDisease:       (disease: ActiveDisease) => void;
  updateDisease:    (diseaseId: string, patch: Partial<ActiveDisease>) => void;
  removeDisease:    (diseaseId: string) => void;

  // Actions — breaking bad arc
  unlockBB:             () => void;
  activateBB:           () => void;
  setBBPhase:           (phase: BBPhase) => void;
  incrementLineaCruzada:(delta: number) => void;

  // Actions — symptom notifications
  pushSymptom:  (notif: SymptomNotif) => void;
  shiftSymptom: () => void;

  // Reset
  resetGame: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_ECONOMY: Economy = {
  liquidez:          0,
  ingresosMensuales: 0,
  gastosMensuales:   0,
  patrimonioBruto:   0,
  deudaTotal:        0,
  carteraInversion:  [],
  inmuebles:         [],
};

const DEFAULT_CAREER: Career = {
  profesion:             '',
  nivel:                 'junior',
  experiencia:           0,
  ingresosProfesionales: 0,
  reputacion:            10,
};

const DEFAULT_TIME: Time = {
  semanaActual:   1,
  añoActual:      0,
  cargaVital:     0,
  asignacionSemanal: {
    trabajo:   40,
    familia:   10,
    salud:     5,
    formacion: 5,
    ocio:      8,
  },
};

const DEFAULT_COUNTRY: Country = {
  nombre: 'España',
  tier:   1,
  modificadores: {
    costovida:   1.0,
    oportunidad: 1.0,
    estabilidad: 1.2,
    sanidad:     1.4,
    educacion:   1.1,
  },
};

// ─── Defaults ─── health ──────────────────────────────────────────────────────

const DEFAULT_HEALTH: Health = {
  diseases:     [],
  bbState:      { ...BB_STATE_DEFAULT },
  symptomQueue: [],
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>((set) => ({
  // ── Initial state ──
  character:   null,
  ancestorIds: [],
  economy:     { ...DEFAULT_ECONOMY },
  career:      { ...DEFAULT_CAREER },
  time:        { ...DEFAULT_TIME },
  country:     { ...DEFAULT_COUNTRY },
  health:      { ...DEFAULT_HEALTH, bbState: { ...BB_STATE_DEFAULT }, diseases: [], symptomQueue: [] },

  // ── Character actions ──
  setCharacter: (char) => set({ character: char }),
  setAncestorIds: (ids) => set({ ancestorIds: ids }),

  updateStats: (deltas) => set((state) => {
    if (!state.character) return state;
    const s = state.character.stats;
    const clamp = (v: number) => Math.min(10, Math.max(0, Math.round((v + Number.EPSILON) * 10) / 10));
    return {
      character: {
        ...state.character,
        stats: {
          logica:       clamp(s.logica       + (deltas.logica       ?? 0)),
          creatividad:  clamp(s.creatividad  + (deltas.creatividad  ?? 0)),
          disciplina:   clamp(s.disciplina   + (deltas.disciplina   ?? 0)),
          carisma:      clamp(s.carisma      + (deltas.carisma      ?? 0)),
          emocional:    clamp(s.emocional    + (deltas.emocional    ?? 0)),
          ambicion:     clamp(s.ambicion     + (deltas.ambicion     ?? 0)),
          fisico:       clamp(s.fisico       + (deltas.fisico       ?? 0)),
          riesgo:       clamp(s.riesgo       + (deltas.riesgo       ?? 0)),
          estabilidad:  clamp(s.estabilidad  + (deltas.estabilidad  ?? 0)),
        },
      },
    };
  }),

  addFlag: (key, value) => set((state) => {
    if (!state.character) return state;
    return {
      character: {
        ...state.character,
        flags: { ...state.character.flags, [key]: value },
      },
    };
  }),

  // ── Economy actions ──
  setLiquidez: (amount) => set((state) => ({
    economy: { ...state.economy, liquidez: amount },
  })),

  updateEconomy: (patch) => set((state) => ({
    economy: { ...state.economy, ...patch },
  })),

  addInversion: (item) => set((state) => ({
    economy: {
      ...state.economy,
      carteraInversion: [...state.economy.carteraInversion, item],
    },
  })),

  addInmueble: (inmueble) => set((state) => ({
    economy: {
      ...state.economy,
      inmuebles: [...state.economy.inmuebles, inmueble],
    },
  })),

  // ── Career actions ──
  updateCareer: (patch) => set((state) => ({
    career: { ...state.career, ...patch },
  })),

  ganarExperiencia: (años) => set((state) => ({
    career: {
      ...state.career,
      experiencia: state.career.experiencia + años,
    },
  })),

  cambiarProfesion: (profesion, nivel, ingreso) => set((state) => ({
    career: {
      ...state.career,
      profesion,
      nivel,
      ingresosProfesionales: ingreso,
    },
  })),

  // ── Time actions ──
  avanzarSemana: () => set((state) => {
    const next = state.time.semanaActual + 1;
    return {
      time: {
        ...state.time,
        semanaActual: next > 52 ? 1 : next,
        añoActual:    next > 52 ? state.time.añoActual + 1 : state.time.añoActual,
      },
    };
  }),

  setAsignacion: (asignacion) => set((state) => ({
    time: {
      ...state.time,
      asignacionSemanal: { ...state.time.asignacionSemanal, ...asignacion },
    },
  })),

  updateCargaVital: (carga) => set((state) => ({
    time: {
      ...state.time,
      cargaVital: Math.min(100, Math.max(0, carga)),
    },
  })),

  // ── Country actions ──
  setCountry: (country) => set({ country }),

  // ── Health / disease actions ──
  addDisease: (disease) => set((state) => ({
    health: {
      ...state.health,
      diseases: [...state.health.diseases, disease],
    },
  })),

  updateDisease: (diseaseId, patch) => set((state) => ({
    health: {
      ...state.health,
      diseases: state.health.diseases.map(d =>
        d.diseaseId === diseaseId ? { ...d, ...patch } : d
      ),
    },
  })),

  removeDisease: (diseaseId) => set((state) => ({
    health: {
      ...state.health,
      diseases: state.health.diseases.filter(d => d.diseaseId !== diseaseId),
    },
  })),

  // ── Breaking Bad arc ──
  unlockBB: () => set((state) => ({
    health: {
      ...state.health,
      bbState: { ...state.health.bbState, unlocked: true },
    },
  })),

  activateBB: () => set((state) => ({
    health: {
      ...state.health,
      bbState: { ...state.health.bbState, active: true },
    },
  })),

  setBBPhase: (phase) => set((state) => ({
    health: {
      ...state.health,
      bbState: { ...state.health.bbState, phase },
    },
  })),

  incrementLineaCruzada: (delta) => set((state) => ({
    health: {
      ...state.health,
      bbState: {
        ...state.health.bbState,
        lineaCruzada: Math.min(100, Math.max(0, state.health.bbState.lineaCruzada + delta)),
      },
    },
  })),

  // ── Symptom notifications ──
  pushSymptom: (notif) => set((state) => ({
    health: {
      ...state.health,
      symptomQueue: [...state.health.symptomQueue, notif],
    },
  })),

  shiftSymptom: () => set((state) => ({
    health: {
      ...state.health,
      symptomQueue: state.health.symptomQueue.slice(1),
    },
  })),

  // ── Reset ──
  resetGame: () => set({
    character:   null,
    ancestorIds: [],
    economy:     { ...DEFAULT_ECONOMY },
    career:      { ...DEFAULT_CAREER },
    time:        { ...DEFAULT_TIME },
    country:     { ...DEFAULT_COUNTRY },
    health:      { ...DEFAULT_HEALTH, bbState: { ...BB_STATE_DEFAULT }, diseases: [], symptomQueue: [] },
  }),
}));
