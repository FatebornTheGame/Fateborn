import { create } from 'zustand';
import type {
  AppScreen, Character, CharacterStats,
  FeedEntry, FeedOption, TimelineEvent,
  Economy, Career, GameFlags, LifeStage, Difficulty,
  Friend, PendingConsequence, GameState, StatDelta, NarrativeEntry,
} from '../types/game.types';
import { COUNTRIES } from '../data/countries';
import { annualDeathProbability, advanceQuarter } from '../systems/timeSystem';
import type { Quarter } from '../systems/timeSystem';
import { getEventsForQuarter } from '../systems/eventSystem';
import { processAllocation, checkInactionConsequences } from '../systems/allocationSystem';
import { updateFriendships } from '../systems/friendSystem';

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────
export type AncestorSlots = [string | null, string | null, string | null, string | null];
export type { Difficulty };

// ─── Helper: etapa vital por edad ─────────────────────────────────────────────
export function getLifeStage(age: number): LifeStage {
  if (age < 13)  return 'infancia';
  if (age < 19)  return 'adolescencia';
  if (age < 31)  return 'juventud';
  if (age < 51)  return 'adultez';
  if (age < 71)  return 'madurez';
  return 'vejez';
}

// ─── Helper: generar ID de feed ───────────────────────────────────────────────
function feedId() { return `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

// ─── Economía inicial por tier ───────────────────────────────────────────────
const ECO_BY_TIER: Record<number, Economy> = {
  1: { liquidez: 2000, ingresosMensuales: 0, gastosMensuales: 800, patrimonioBruto: 2000, deudaTotal: 0 },
  2: { liquidez: 800,  ingresosMensuales: 0, gastosMensuales: 400, patrimonioBruto: 800,  deudaTotal: 0 },
  3: { liquidez: 200,  ingresosMensuales: 0, gastosMensuales: 150, patrimonioBruto: 200,  deudaTotal: 0 },
  4: { liquidez: 50,   ingresosMensuales: 0, gastosMensuales: 50,  patrimonioBruto: 50,   deudaTotal: 0 },
};

const DEFAULT_ECO: Economy = { liquidez: 0, ingresosMensuales: 0, gastosMensuales: 0, patrimonioBruto: 0, deudaTotal: 0 };
const DEFAULT_FLAGS: GameFlags = {
  emancipado: false, tienePareja: false, parejaEstable: false,
  tieneHijos: 0, tieneMascota: false, adiccion: null, reputacion: 10, tieneAmigos: false,
  enfermedadTerminal: false,
};

const STAT_LABEL: Record<string, string> = {
  logica: 'la lógica', creatividad: 'la creatividad', disciplina: 'la disciplina',
  carisma: 'el carisma', emocional: 'la inteligencia emocional', ambicion: 'la ambición',
  fisico: 'la vitalidad física', riesgo: 'la audacia', estabilidad: 'la estabilidad',
};

// ─── StoreState (Zustand — incluye acciones además del estado puro) ──────────
interface StoreState {
  // ── Navegación ──
  screen: AppScreen;
  difficulty: Difficulty;
  isMuted: boolean;

  // ── Selección pre-juego ──
  ancestors: AncestorSlots;
  selectedCountry: string | null;
  character: Character | null;

  // ── Estado de partida ──
  gameInitialized: boolean;
  totalWeeks: number;
  ageYears: number;
  currentYear: number;
  vitalLoad: number;
  legacyScore: number;
  feed: FeedEntry[];
  timeline: TimelineEvent[];
  economy: Economy;
  career: Career | null;
  gameFlags: GameFlags;
  friends: Friend[];
  pendingConsequences: PendingConsequence[];

  // ── Acciones pre-juego ──
  setScreen: (s: AppScreen) => void;
  setDifficulty: (d: Difficulty) => void;
  toggleMute: () => void;
  setAncestor: (slot: 0|1|2|3, id: string | null) => void;
  setCountry: (c: string) => void;
  confirmAncestors: () => void;
  startNewGame: (name: string, gender: 'hombre'|'mujer', stats: CharacterStats) => void;
  resetGame: () => void;

  // ── Acciones en partida ──
  initGame: () => void;
  advanceWeeks: (n: number) => void;
  processQuarter: (allocation: Quarter['allocation']) => void;
  addFeedEntry: (entry: Omit<FeedEntry, 'id'>) => void;
  answerFeedEntry: (id: string, optionId: string) => void;
  addTimelineEvent: (ev: Omit<TimelineEvent, 'id'>) => void;
  updateEconomy: (delta: Partial<Economy>) => void;
  updateGameFlag: <K extends keyof GameFlags>(key: K, value: GameFlags[K]) => void;
  setCareer: (career: Career | null) => void;
  addVitalLoad: (delta: number) => void;
  addLegacy: (delta: number) => void;
}

const DEFAULT_ANCESTORS: AncestorSlots = [null, null, null, null];

export const useGameStore = create<StoreState>((set) => ({
  // ── Estado inicial ─────────────────────────────────────────────────────────
  screen: 'start',
  difficulty: 'fateborn',
  isMuted: false,
  ancestors: DEFAULT_ANCESTORS,
  selectedCountry: null,
  character: null,
  gameInitialized: false,
  totalWeeks: 0,
  ageYears: 0,
  currentYear: 1990,
  vitalLoad: 10,
  legacyScore: 0,
  feed: [],
  timeline: [],
  economy: DEFAULT_ECO,
  career: null,
  gameFlags: DEFAULT_FLAGS,
  friends: [],
  pendingConsequences: [],

  // ── Navegación ────────────────────────────────────────────────────────────
  setScreen: (screen) => set({ screen }),
  setDifficulty: (difficulty) => set({ difficulty }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  // ── Pre-juego ─────────────────────────────────────────────────────────────
  setAncestor: (slot, id) =>
    set((s) => { const a = [...s.ancestors] as AncestorSlots; a[slot] = id; return { ancestors: a }; }),

  setCountry: (c) => set({ selectedCountry: c }),
  confirmAncestors: () => set((s) => ({ selectedCountry: s.selectedCountry })),

  startNewGame: (name, gender, stats) =>
    set((s) => ({
      character: {
        name, gender,
        birthYear: 1990,
        country: s.selectedCountry ?? 'España',
        ancestorIds: s.ancestors as [string, string, string, string],
        stats, flags: {},
      },
      screen: 'game',
      gameInitialized: false, // reset so initGame fires fresh
    })),

  resetGame: () => set({
    screen: 'start', difficulty: 'fateborn', ancestors: DEFAULT_ANCESTORS,
    selectedCountry: null, character: null, gameInitialized: false,
    totalWeeks: 0, ageYears: 0, currentYear: 1990, vitalLoad: 10, legacyScore: 0,
    feed: [], timeline: [], economy: DEFAULT_ECO, career: null, gameFlags: DEFAULT_FLAGS,
    friends: [], pendingConsequences: [],
  }),

  // ── initGame ──────────────────────────────────────────────────────────────
  initGame: () => set((s) => {
    if (s.gameInitialized || !s.character) return {};
    const char = s.character;
    const tier  = COUNTRIES.find(c => c.nombre === char.country)?.tier ?? 2;
    const eco   = ECO_BY_TIER[tier];

    // Stat dominante
    const [dominantKey] = (Object.entries(char.stats) as [string, number][])
      .sort((a, b) => b[1] - a[1])[0];

    const entries: FeedEntry[] = [
      {
        id: 'init-welcome', week: 0, year: char.birthYear, answered: true, importance: 'critica',
        text: `Bienvenido al mundo, ${char.name}.\n\nNaces en ${char.country} en el año ${char.birthYear}. Tu herencia genética te ha dado ${STAT_LABEL[dominantKey] ?? dominantKey} como mayor fortaleza.`,
      },
      {
        id: 'init-eco', week: 0, year: char.birthYear, answered: true, importance: 'normal',
        text: `Tu familia cuenta con ${eco.liquidez.toLocaleString('es')}€ en ahorros. Los gastos mensuales ascienden a ${eco.gastosMensuales.toLocaleString('es')}€.`,
      },
      {
        id: 'init-opp', week: 1, year: char.birthYear, answered: false, importance: 'alta',
        text: `El mundo tiene mucho que ofrecerte. Con el tiempo, tus decisiones definirán quién eres.`,
        options: [
          { id: 'accept', label: 'Aceptar con calma', color: 'gold' },
          { id: 'forge',  label: 'Forjar mi propio camino', color: 'garnet' },
        ],
      },
    ];
    return {
      gameInitialized: true, totalWeeks: 0, ageYears: 0,
      currentYear: char.birthYear, vitalLoad: 10, legacyScore: 0,
      economy: eco, career: null, gameFlags: DEFAULT_FLAGS,
      feed: entries,
      timeline: [{ id: 'birth', yearOffset: 0, label: 'Nacimiento', type: 'hito' }],
    };
  }),

  // ── advanceWeeks ──────────────────────────────────────────────────────────
  advanceWeeks: (n) => set((s) => {
    if (!s.character) return {};
    const char     = s.character;
    const newTotal = s.totalWeeks + n;
    const newAge   = Math.floor(newTotal / 52);
    const prevAge  = s.ageYears;
    const newYear  = char.birthYear + newAge;

    // ── Comprobación de muerte año a año ──────────────────────────────────
    let diedAtAge: number | null = null;
    for (let checkAge = prevAge + 1; checkAge <= newAge; checkAge++) {
      if (checkAge >= 95) { diedAtAge = checkAge; break; }
      const prob = annualDeathProbability(checkAge, s.vitalLoad, s.gameFlags, s.difficulty);
      if (Math.random() < prob) { diedAtAge = checkAge; break; }
    }

    if (diedAtAge !== null) {
      const deathYear  = char.birthYear + diedAtAge;
      const weeksToD   = (diedAtAge - prevAge) * 52;
      const weeklyNet  = (s.economy.ingresosMensuales - s.economy.gastosMensuales) / 4.33;
      const newLiq     = Math.max(0, s.economy.liquidez + weeklyNet * weeksToD);
      const deathEntry: FeedEntry = {
        id: `death-${Date.now()}`, week: 0, year: deathYear,
        text: `${char.name} ha llegado al final de su camino.`,
        importance: 'critica', answered: true,
      };
      // Navegar a DeathScreen tras 2 segundos
      setTimeout(() => useGameStore.getState().setScreen('death'), 2000);
      return {
        totalWeeks: s.totalWeeks + weeksToD,
        ageYears: diedAtAge,
        currentYear: deathYear,
        economy: { ...s.economy, liquidez: Math.round(newLiq) },
        feed: [deathEntry, ...s.feed],
        legacyScore: Math.min(100, s.legacyScore + (diedAtAge - prevAge) * 0.5),
      };
    }

    // ── Avance normal ─────────────────────────────────────────────────────
    const weeklyNet   = (s.economy.ingresosMensuales - s.economy.gastosMensuales) / 4.33;
    const newLiquidez = Math.max(0, s.economy.liquidez + weeklyNet * n);

    const STAGE_NAMES: Record<string, string> = {
      infancia:'la Infancia', adolescencia:'la Adolescencia', juventud:'la Juventud',
      adultez:'la Adultez', madurez:'la Madurez', vejez:'la Vejez',
    };
    const mk = (text: string, imp: FeedEntry['importance'], opts?: FeedOption[]): FeedEntry => ({
      id: feedId(), week: newTotal % 52, year: newYear,
      text, importance: imp, answered: !opts, options: opts,
    });

    const newEntries: FeedEntry[] = [];
    if (prevAge < 16 && newAge >= 16)
      newEntries.push(mk('Con 16 años, el mercado laboral comienza a abrirse para ti.', 'alta'));
    if (prevAge < 18 && newAge >= 18)
      newEntries.push(mk('Eres mayor de edad.\n\nEl mundo se abre ante ti. Por primera vez, puedes tomar decisiones completamente tuyas.', 'critica'));
    if (prevAge < 65 && newAge >= 65)
      newEntries.push(mk('Has alcanzado la edad de jubilación. Décadas de trabajo han dejado su huella.', 'alta'));
    if (prevAge < 70 && newAge >= 70)
      newEntries.push(mk('Comienzas la etapa de la vejez. El cuerpo se resiente, pero la sabiduría acumulada es tu mayor tesoro.', 'alta'));
    if (prevAge < 80 && newAge >= 80)
      newEntries.push(mk('Has llegado al final de una vida larga. Tu legado te sobrevivirá.', 'critica'));

    const prevStage = getLifeStage(prevAge);
    const newStage  = getLifeStage(newAge);
    if (prevStage !== newStage)
      newEntries.push(mk(`Entras en ${STAGE_NAMES[newStage]}.`, 'alta'));

    return {
      totalWeeks: newTotal,
      ageYears: newAge,
      currentYear: newYear,
      economy: { ...s.economy, liquidez: Math.round(newLiquidez) },
      feed: newEntries.length ? [...newEntries, ...s.feed] : s.feed,
      legacyScore: Math.min(100, s.legacyScore + (newAge > prevAge ? 0.5 : 0)),
    };
  }),

  // ── Feed ──────────────────────────────────────────────────────────────────
  addFeedEntry: (entry) =>
    set((s) => ({ feed: [{ id: feedId(), ...entry }, ...s.feed] })),

  answerFeedEntry: (id, optionId) =>
    set((s) => ({
      feed: s.feed.map(e => e.id === id ? { ...e, answered: true, selectedOptionId: optionId } : e),
    })),

  // ── Timeline ──────────────────────────────────────────────────────────────
  addTimelineEvent: (ev) =>
    set((s) => ({ timeline: [...s.timeline, { id: feedId(), ...ev }] })),

  // ── Economía ──────────────────────────────────────────────────────────────
  updateEconomy: (delta) =>
    set((s) => ({
      economy: {
        liquidez:           Math.max(0, s.economy.liquidez           + (delta.liquidez           ?? 0)),
        ingresosMensuales:  Math.max(0, s.economy.ingresosMensuales  + (delta.ingresosMensuales  ?? 0)),
        gastosMensuales:    Math.max(0, s.economy.gastosMensuales    + (delta.gastosMensuales    ?? 0)),
        patrimonioBruto:    Math.max(0, s.economy.patrimonioBruto    + (delta.patrimonioBruto    ?? 0)),
        deudaTotal:         Math.max(0, s.economy.deudaTotal         + (delta.deudaTotal         ?? 0)),
      },
    })),

  // ── Flags y misc ──────────────────────────────────────────────────────────
  updateGameFlag: (key, value) =>
    set((s) => ({ gameFlags: { ...s.gameFlags, [key]: value } })),

  setCareer: (career) => set({ career }),

  addVitalLoad: (delta) =>
    set((s) => ({ vitalLoad: Math.min(100, Math.max(0, s.vitalLoad + delta)) })),

  addLegacy: (delta) =>
    set((s) => ({ legacyScore: Math.min(100, Math.max(0, s.legacyScore + delta)) })),

  // ── processQuarter — motor principal de avance trimestral ────────────────
  processQuarter: (allocation) => set((s) => {
    if (!s.character) return {};

    // Construir GameState puro para los sistemas
    const core: GameState = {
      character: s.character,
      ageYears: s.ageYears,
      currentYear: s.currentYear,
      totalWeeks: s.totalWeeks,
      vitalLoad: s.vitalLoad,
      legacyScore: s.legacyScore,
      feed: s.feed,
      timeline: s.timeline,
      economy: s.economy,
      career: s.career,
      gameFlags: s.gameFlags,
      difficulty: s.difficulty,
      friends: s.friends,
      pendingConsequences: s.pendingConsequences,
    };

    // 1. Avanzar trimestre (tiempo + carga vital)
    const advanced = advanceQuarter(core, allocation);

    // 2. Obtener eventos para este trimestre
    const events = getEventsForQuarter(advanced);

    // 3. Calcular deltas de stats por asignación
    const statDeltas: StatDelta[] = processAllocation(core, allocation);

    // 4. Comprobar consecuencias por inacción
    const newConsequences = checkInactionConsequences(core, allocation);

    // 5. Actualizar amistades
    const updatedFriends = updateFriendships(core, allocation);

    // Aplicar deltas a stats del personaje
    const baseStats = { ...s.character.stats };
    for (const { stat, delta } of statDeltas) {
      baseStats[stat] = parseFloat(
        Math.min(10, Math.max(0, baseStats[stat] + delta)).toFixed(1)
      );
    }

    // Entradas narrativas de eventos (marcar como fired en flags)
    const newFlags = { ...s.character.flags };
    const newEntries: NarrativeEntry[] = events.map(ev => {
      newFlags[`ev_${ev.id}`] = true;
      return ev.generate(advanced);
    });

    // 6. Comprobar muerte (probabilidad trimestral = anual / 4)
    let dies = advanced.ageYears >= 95;
    if (!dies) {
      const prob = annualDeathProbability(
        advanced.ageYears, advanced.vitalLoad, s.gameFlags, s.difficulty,
      );
      dies = Math.random() < prob / 4;
    }

    if (dies) {
      const deathEntry: NarrativeEntry = {
        week: advanced.totalWeeks % 52,
        year: advanced.currentYear,
        text: `${s.character.name} ha llegado al final de su camino.`,
        importance: 'critica',
        answered: true,
      };
      newEntries.unshift(deathEntry);
      setTimeout(() => useGameStore.getState().setScreen('death'), 2000);
    }

    const feedEntries = newEntries.map(e => ({ id: feedId(), ...e }));

    // Consecuencias diferidas: decrementar contador, disparar las vencidas
    const firedConsequences = s.pendingConsequences
      .map(c => ({ ...c, quartersRemaining: c.quartersRemaining - 1 }))
      .filter(c => c.quartersRemaining <= 0);

    const firedEntries = firedConsequences.map(c => ({
      id: feedId(),
      week: advanced.totalWeeks % 52,
      year: advanced.currentYear,
      text: c.message,
      importance: (c.severity === 'grave' ? 'critica' : c.severity === 'moderado' ? 'alta' : 'normal') as FeedEntry['importance'],
      answered: true,
    }));

    const remainingConsequences = [
      ...s.pendingConsequences
        .map(c => ({ ...c, quartersRemaining: c.quartersRemaining - 1 }))
        .filter(c => c.quartersRemaining > 0),
      ...newConsequences,
    ];

    return {
      totalWeeks: advanced.totalWeeks,
      ageYears: advanced.ageYears,
      currentYear: advanced.currentYear,
      vitalLoad: advanced.vitalLoad,
      character: { ...s.character, stats: baseStats, flags: newFlags },
      feed: [...feedEntries, ...firedEntries, ...s.feed],
      friends: updatedFriends,
      pendingConsequences: remainingConsequences,
      legacyScore: Math.min(100, advanced.legacyScore + (advanced.ageYears > s.ageYears ? 0.5 : 0)),
    };
  }),
}));

// ─── Helper: computar stats del personaje desde los 4 arquetipos ─────────────
export function computeStats(ancestorStats: CharacterStats[]): CharacterStats {
  const keys = Object.keys(ancestorStats[0]) as (keyof CharacterStats)[];
  const result = {} as CharacterStats;
  for (const key of keys) {
    const avg = ancestorStats.reduce((sum, s) => sum + s[key], 0) / ancestorStats.length;
    const mutation = (Math.random() - 0.5) * 2;
    result[key] = Math.min(10, Math.max(0, parseFloat((avg + mutation).toFixed(1))));
  }
  return result;
}
