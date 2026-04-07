// Archetype Stats — Fateborn
// Mapa de contribución de cada arquetipo a los 9 stats del personaje (escala 0–10).
// Usado en BirthScreen para calcular herencia y en AncestorSelection para el radar.

import type { CharacterStats } from '../types';

export const ARCHETYPE_CONTRIBUTIONS: Record<string, CharacterStats> = {
  atleta:      { logica: 4, creatividad: 3, disciplina: 8, carisma: 5, emocional: 4, ambicion: 6, fisico: 9, riesgo: 6, estabilidad: 5 },
  academico:   { logica: 9, creatividad: 6, disciplina: 8, carisma: 4, emocional: 5, ambicion: 6, fisico: 3, riesgo: 2, estabilidad: 7 },
  artista:     { logica: 5, creatividad: 9, disciplina: 4, carisma: 7, emocional: 8, ambicion: 5, fisico: 4, riesgo: 6, estabilidad: 4 },
  lider:       { logica: 7, creatividad: 6, disciplina: 7, carisma: 9, emocional: 6, ambicion: 9, fisico: 6, riesgo: 5, estabilidad: 6 },
  obrero:      { logica: 4, creatividad: 3, disciplina: 9, carisma: 4, emocional: 5, ambicion: 5, fisico: 8, riesgo: 4, estabilidad: 8 },
  emprendedor: { logica: 7, creatividad: 7, disciplina: 6, carisma: 8, emocional: 5, ambicion: 9, fisico: 5, riesgo: 8, estabilidad: 4 },
  cuidador:    { logica: 5, creatividad: 6, disciplina: 6, carisma: 7, emocional: 9, ambicion: 4, fisico: 5, riesgo: 3, estabilidad: 8 },
  explorador:  { logica: 6, creatividad: 8, disciplina: 5, carisma: 6, emocional: 6, ambicion: 7, fisico: 7, riesgo: 9, estabilidad: 3 },
  filosofo:    { logica: 9, creatividad: 8, disciplina: 6, carisma: 5, emocional: 7, ambicion: 5, fisico: 3, riesgo: 4, estabilidad: 7 },
  medico:      { logica: 8, creatividad: 5, disciplina: 9, carisma: 6, emocional: 8, ambicion: 6, fisico: 5, riesgo: 3, estabilidad: 7 },
  militar:     { logica: 6, creatividad: 4, disciplina: 9, carisma: 7, emocional: 4, ambicion: 7, fisico: 9, riesgo: 6, estabilidad: 7 },
  politico:    { logica: 7, creatividad: 6, disciplina: 7, carisma: 9, emocional: 5, ambicion: 9, fisico: 4, riesgo: 6, estabilidad: 5 },
  criminal:    { logica: 6, creatividad: 7, disciplina: 5, carisma: 6, emocional: 4, ambicion: 8, fisico: 7, riesgo: 9, estabilidad: 3 },
  marinero:    { logica: 5, creatividad: 6, disciplina: 7, carisma: 6, emocional: 6, ambicion: 5, fisico: 8, riesgo: 9, estabilidad: 4 },
  sacerdote:   { logica: 7, creatividad: 6, disciplina: 8, carisma: 8, emocional: 9, ambicion: 4, fisico: 4, riesgo: 3, estabilidad: 9 },
  mercader:    { logica: 7, creatividad: 7, disciplina: 6, carisma: 8, emocional: 5, ambicion: 9, fisico: 4, riesgo: 7, estabilidad: 5 },
  abogado:     { logica: 9, creatividad: 7, disciplina: 8, carisma: 8, emocional: 5, ambicion: 8, fisico: 3, riesgo: 5, estabilidad: 6 },
};

/** Calcula los stats heredados: promedio de 4 ancestros + mutación ±10% */
export function calculateInheritedStats(ancestorIds: string[]): CharacterStats {
  const keys = Object.keys(ARCHETYPE_CONTRIBUTIONS.atleta) as (keyof CharacterStats)[];
  const result = {} as CharacterStats;
  for (const key of keys) {
    const avg = ancestorIds.reduce((sum, id) => sum + (ARCHETYPE_CONTRIBUTIONS[id]?.[key] ?? 5), 0) / ancestorIds.length;
    const mutation = Math.random() * 0.2 - 0.1;
    result[key] = Math.min(10, Math.max(1, parseFloat((avg * (1 + mutation)).toFixed(1))));
  }
  return result;
}
