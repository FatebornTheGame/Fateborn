// Arc Registry — Fateborn
// Unlock conditions for all narrative arcs.
// BB y SG tienen sus propios archivos en /arcs/; aquí se definen los demás.

import type { Character } from '../types';
import type { Career, Economy, Country } from '../store/gameStore';

// ─── Mike Ehrmantraut ─────────────────────────────────────────────────────────

const MIKE_PROFESSIONS = [
  'policía', 'policia', 'agente', 'detective', 'investigador privado',
  'guardia', 'seguridad', 'militar', 'escolta', 'vigilante',
];

const NIVEL_RANK: Record<string, number> = {
  junior: 1, mid: 2, senior: 3, director: 4, ejecutivo: 5, independiente: 3,
};

export interface MikeUnlockConditions {
  esPoliciaOAgente: boolean;
  nivelSuficiente:  boolean;
  tieneDetonante:   boolean;
  allMet:           boolean;
}

export function evaluateMikeUnlock(
  character: Character,
  career:    Career,
  economy:   Economy,
): MikeUnlockConditions {
  const profLower       = career.profesion.toLowerCase();
  const esPoliciaOAgente = MIKE_PROFESSIONS.some(p => profLower.includes(p));
  // Nivel 3+ (antes era 7+)
  const nivelSuficiente  = (NIVEL_RANK[career.nivel] ?? 0) >= 3;

  const flags = character.flags ?? {};
  const traicionCompaneros = !!(flags['traicion_companeros']);
  const ofertaCriminal     = !!(flags['oferta_economica_criminal']);
  const familiaAmenazada   = !!(flags['familia_amenazada']);
  // 5+ años estancado con stats altos
  const estancamientoLargo = career.experiencia >= 5 &&
                             career.reputacion < 40 &&
                             (character.stats.logica > 6 || character.stats.disciplina > 6);
  // Deuda extrema como detonante alternativo
  const deudaExtrema       = economy.deudaTotal > 30000;

  const tieneDetonante = traicionCompaneros || ofertaCriminal ||
                         familiaAmenazada   || estancamientoLargo || deudaExtrema;

  return {
    esPoliciaOAgente,
    nivelSuficiente,
    tieneDetonante,
    allMet: esPoliciaOAgente && nivelSuficiente && tieneDetonante,
  };
}

// ─── Nelson Mandela ───────────────────────────────────────────────────────────

export interface MandelaUnlockConditions {
  paisTierBajo:     boolean;
  carismaYAmbicion: boolean;
  injusticiaVivida: boolean;
  allMet:           boolean;
}

export function evaluateMandelaUnlock(
  character: Character,
  country:   Country,
): MandelaUnlockConditions {
  // Tier 3-4 equivale a países D, E, F (eliminado requisito de encarcelamiento previo)
  const paisTierBajo     = country.tier >= 3;
  const carismaYAmbicion = character.stats.carisma >= 7 && character.stats.ambicion >= 8;
  // Cualquier evento de injusticia en infancia o adolescencia
  const injusticiaVivida = !!(character.flags?.['injusticia_vivida']);

  return {
    paisTierBajo,
    carismaYAmbicion,
    injusticiaVivida,
    allMet: paisTierBajo && carismaYAmbicion && injusticiaVivida,
  };
}

// ─── Jordan Belfort ───────────────────────────────────────────────────────────

const BELFORT_PROFESSIONS = [
  'financiero', 'finanzas', 'bolsa', 'bróker', 'broker', 'inversor',
  'banco', 'bancario', 'analista', 'trader', 'economista', 'asesor financiero',
  'gestor de fondos', 'corredor',
];

export interface BelfortUnlockConditions {
  esProfesionFinanciera: boolean;
  nivelSuficiente:       boolean;
  ambicionMaxima:        boolean;
  descubrioVacioLegal:   boolean;
  allMet:                boolean;
}

export function evaluateBelfortUnlock(
  character: Character,
  career:    Career,
): BelfortUnlockConditions {
  const profLower = career.profesion.toLowerCase();
  const esProfesionFinanciera = BELFORT_PROFESSIONS.some(p => profLower.includes(p));
  // Nivel 2+ (eliminado requisito de Riesgo 9+)
  const nivelSuficiente       = (NIVEL_RANK[career.nivel] ?? 0) >= 2;
  const ambicionMaxima        = character.stats.ambicion >= 9;
  // Probabilidad 15% en eventos financieros — el flag lo setea el evento
  const descubrioVacioLegal   = !!(character.flags?.['vacio_legal_descubierto']);

  return {
    esProfesionFinanciera,
    nivelSuficiente,
    ambicionMaxima,
    descubrioVacioLegal,
    allMet: esProfesionFinanciera && nivelSuficiente && ambicionMaxima && descubrioVacioLegal,
  };
}

// ─── Reducción genérica de requisitos de nivel ────────────────────────────────

/**
 * Para todos los demás arcos: reducir nivel profesional requerido en 2 puntos.
 * Devuelve true si el nivel actual supera el umbral reducido.
 */
export function nivelSuficienteReducido(nivelCarrera: string, umbralOriginal: number): boolean {
  const rank = NIVEL_RANK[nivelCarrera] ?? 0;
  return rank >= Math.max(1, umbralOriginal - 2);
}

// ─── Catálogo de arcos ────────────────────────────────────────────────────────

export type ArcId =
  | 'breaking_bad'
  | 'saul_goodman'
  | 'mike_ehrmantraut'
  | 'nelson_mandela'
  | 'jordan_belfort'
  | 'f1_pilot'
  | 'criminal_boss';

export interface ArcMeta {
  id:          ArcId;
  nombre:      string;
  descripcion: string;
  trigger:     string;
}

export const ARC_CATALOG: ArcMeta[] = [
  {
    id:          'breaking_bad',
    nombre:      'Breaking Bad',
    descripcion: 'El científico que cruza todas las líneas.',
    trigger:     'Profesión científica/médica/profesor nivel 3+ con diagnóstico terminal o deuda >50.000€ y Ambición >6',
  },
  {
    id:          'saul_goodman',
    nombre:      'Saul Goodman',
    descripcion: 'El abogado que se convierte en leyenda oscura.',
    trigger:     'Abogado nivel 3+ con contactos criminales y Ambición >7',
  },
  {
    id:          'mike_ehrmantraut',
    nombre:      'Mike Ehrmantraut',
    descripcion: 'El veterano que trabaja para los que juró no defender.',
    trigger:     'Policía/agente nivel 3+ con traición, oferta criminal, amenaza familiar o 5+ años estancado',
  },
  {
    id:          'nelson_mandela',
    nombre:      'Nelson Mandela',
    descripcion: 'El preso que se convirtió en presidente.',
    trigger:     'País Tier D/E/F + Carisma 7+ + Ambición 8+ + injusticia vivida en infancia/adolescencia',
  },
  {
    id:          'jordan_belfort',
    nombre:      'Jordan Belfort',
    descripcion: 'El lobo de las finanzas.',
    trigger:     'Profesión financiera nivel 2+ + Ambición 9+ + vacío legal descubierto (prob. 15%)',
  },
  {
    id:          'f1_pilot',
    nombre:      'Piloto de F1',
    descripcion: 'El camino desde el karting hasta el Gran Premio.',
    trigger:     'Padre con liquidez >5.000€ + flag f1_vocacion (Físico 7+ y Riesgo 7+)',
  },
  {
    id:          'criminal_boss',
    nombre:      'Jefe Criminal',
    descripcion: 'De pequeños hurtos a controlar una organización.',
    trigger:     'Accesible desde los 14 en países Tier D/E/F, sin requisitos de stats',
  },
];
