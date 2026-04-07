// Psychology System — Fateborn
// Sugerencias activas en Modo Historia basadas en indicadores de salud mental.
// En modos Fateborn/Ironman/Legado: sin sugerencias, el jugador debe detectarlo solo.

import type { Character } from '../types';
import type { Time } from '../store/gameStore';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PsychSuggestionId =
  | 'emocional_bajo_persistente'
  | 'carga_vital_extrema'
  | 'trauma_pareja_estable';

export interface PsychOption {
  id:     string;
  label:  string;
  effect: string;
}

export interface PsychSuggestion {
  id:           PsychSuggestionId;
  mensaje:      string;
  opciones:     PsychOption[];
  soloHistoria: true; // siempre true — solo aparece en Modo Historia
}

// ─── Estado del sistema ───────────────────────────────────────────────────────

export interface PsychState {
  trimestresEmocionalBajo: number;
  trimestresEargaAlta:     number;
  sugerenciasVistas:       PsychSuggestionId[];
}

export const PSYCH_STATE_DEFAULT: PsychState = {
  trimestresEmocionalBajo: 0,
  trimestresEargaAlta:     0,
  sugerenciasVistas:       [],
};

// ─── Evaluadores individuales ─────────────────────────────────────────────────

/**
 * PROBLEMA 4 — condición 1:
 * Si emocional < 4 durante 2 trimestres consecutivos → sugerir terapeuta.
 */
export function evalEmocionalBajoPersistente(
  character:         Character,
  trimestresEnBajo:  number,
): PsychSuggestion | null {
  if (character.stats.emocional >= 4 || trimestresEnBajo < 2) return null;

  return {
    id:      'emocional_bajo_persistente',
    mensaje: 'Llevas meses sintiéndote así. Hablar con alguien podría ayudar.',
    opciones: [
      {
        id:     'buscar_terapeuta',
        label:  'Buscar terapeuta',
        effect: '+0.5 Emocional (gradual) · −180€/mes',
      },
    ],
    soloHistoria: true,
  };
}

/**
 * PROBLEMA 4 — condición 2:
 * Si cargaVital > 75 durante 3 trimestres → sugerir cambio de ritmo.
 */
export function evalCargaVitalExtrema(
  cargaVital:       number,
  trimestresEnAlto: number,
): PsychSuggestion | null {
  if (cargaVital <= 75 || trimestresEnAlto < 3) return null;

  return {
    id:      'carga_vital_extrema',
    mensaje: 'Tu cuerpo y tu mente están al límite. Algo tiene que cambiar.',
    opciones: [
      {
        id:     'buscar_terapeuta',
        label:  'Buscar terapeuta',
        effect: '+0.3 Emocional · −180€/mes',
      },
      {
        id:     'reducir_trabajo',
        label:  'Reducir carga de trabajo',
        effect: '−20% carga vital · −ingreso proporcional',
      },
      {
        id:     'vacaciones',
        label:  'Tomar vacaciones',
        effect: '−30% carga vital · −500€',
      },
    ],
    soloHistoria: true,
  };
}

/**
 * PROBLEMA 4 — condición 3:
 * Si trauma_sin_procesar + pareja_estable → aviso de impacto en relación.
 */
export function evalTraumaParejaEstable(
  character: Character,
): PsychSuggestion | null {
  const tieneTrauma = !!(character.flags?.['trauma_sin_procesar']);
  const tienePareja = !!(character.flags?.['pareja_estable']);

  if (!tieneTrauma || !tienePareja) return null;

  return {
    id:      'trauma_pareja_estable',
    mensaje: 'Hay cosas del pasado que siguen afectando tu presente. Tu pareja lo ha notado.',
    opciones: [
      {
        id:     'terapia_pareja',
        label:  'Terapia de pareja',
        effect: '+0.4 Emocional · +0.2 Estabilidad · −240€/mes',
      },
      {
        id:     'hablar_pareja',
        label:  'Hablar con tu pareja',
        effect: '+0.3 Emocional · +0.1 Estabilidad',
      },
    ],
    soloHistoria: true,
  };
}

// ─── Avance trimestral ────────────────────────────────────────────────────────

/**
 * Llama cada trimestre. Actualiza contadores y devuelve sugerencias activas.
 * Solo produce sugerencias si modoHistoria === true.
 */
export function advancePsychQuarter(
  prev:         PsychState,
  character:    Character,
  time:         Time,
  modoHistoria: boolean,
): { state: PsychState; suggestions: PsychSuggestion[] } {
  const nuevoTrimEstres = character.stats.emocional < 4
    ? prev.trimestresEmocionalBajo + 1
    : 0;

  const nuevoTrimCarga = time.cargaVital > 75
    ? prev.trimestresEargaAlta + 1
    : 0;

  const nextState: PsychState = {
    ...prev,
    trimestresEmocionalBajo: nuevoTrimEstres,
    trimestresEargaAlta:     nuevoTrimCarga,
  };

  if (!modoHistoria) {
    return { state: nextState, suggestions: [] };
  }

  const suggestions: PsychSuggestion[] = [];

  const s1 = evalEmocionalBajoPersistente(character, nuevoTrimEstres);
  if (s1 && !prev.sugerenciasVistas.includes(s1.id)) suggestions.push(s1);

  const s2 = evalCargaVitalExtrema(time.cargaVital, nuevoTrimCarga);
  if (s2 && !prev.sugerenciasVistas.includes(s2.id)) suggestions.push(s2);

  const s3 = evalTraumaParejaEstable(character);
  if (s3 && !prev.sugerenciasVistas.includes(s3.id)) suggestions.push(s3);

  return { state: nextState, suggestions };
}

/** Marca una sugerencia como vista para no repetirla */
export function markSuggestionSeen(
  state: PsychState,
  id:    PsychSuggestionId,
): PsychState {
  if (state.sugerenciasVistas.includes(id)) return state;
  return {
    ...state,
    sugerenciasVistas: [...state.sugerenciasVistas, id],
  };
}
