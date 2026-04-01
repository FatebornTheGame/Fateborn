import type { CharacterStats } from '../types';

// ─── Base types ───────────────────────────────────────────────────────────────

export type DiseaseCategory = 'acute' | 'chronic' | 'terminal';

export interface TreatmentOption {
  id:          string;
  label:       string;
  costMensual: number;
  /** Monthly stat impact while under treatment (positive = recovery) */
  statDeltas:  Partial<CharacterStats>;
  /** Multiplier on progression speed per month. 0 = cured, <1 = slowing, >1 = worsening */
  progression: number;
  /** If true, this option removes the disease entirely after progressionMonths */
  curative:    boolean;
}

export interface Disease {
  id:       string;
  name:     string;
  category: DiseaseCategory;
  /** Short text shown in the non-intrusive symptom notification */
  symptomNotice: string;
  /** Added to carga_vital while active (0-100 scale) */
  impactoCargaVital: number;
  /** Monthly monetary cost if untreated */
  costeMensualBase: number;
  /** Monthly passive stat degradation while untreated */
  statDeltas: Partial<CharacterStats>;
  treatments: TreatmentOption[];
  /**
   * Returns probability (0–1) of contracting this disease in a given year.
   * Called once per life stage transition.
   */
  probabilityFn: (age: number, stats: CharacterStats) => number;
  /** Narrative text shown when first diagnosed */
  diagnosisText: string;
  /** Extra narrative hook for terminal diseases */
  terminalText?: string;
}

// ─── Active disease instance ──────────────────────────────────────────────────

export interface ActiveDisease {
  diseaseId:   string;
  activeSince: number;       // in-game year
  treatmentId: string | null;
  progresion:  number;       // 0-100, 100 = crisis/death
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clampProb(p: number) { return Math.min(1, Math.max(0, p)); }

function lowFisicoBonus(stats: CharacterStats, threshold = 4) {
  return stats.fisico < threshold ? 0.08 * (threshold - stats.fisico) : 0;
}

function highEstabilidadBonus(stats: CharacterStats) {
  return stats.estabilidad > 6 ? -0.04 * (stats.estabilidad - 6) : 0;
}

// ─── Disease catalogue ────────────────────────────────────────────────────────

export const DISEASES: Record<string, Disease> = {

  // ══════════════════════════════════════════════════════════════════
  // AGUDAS
  // ══════════════════════════════════════════════════════════════════

  gripe: {
    id:       'gripe',
    name:     'Gripe severa',
    category: 'acute',
    symptomNotice:     'Llevas varios días con fiebre y fatiga intensa.',
    diagnosisText:     'El médico confirma una gripe de alta intensidad. Necesitas descanso.',
    impactoCargaVital: 12,
    costeMensualBase:  30,
    statDeltas: { fisico: -0.3, disciplina: -0.2 },
    probabilityFn: (age, stats) => clampProb(
      0.12 + lowFisicoBonus(stats) + (age > 60 ? 0.08 : 0)
    ),
    treatments: [
      {
        id:          'reposo',
        label:       'Reposo en casa',
        costMensual: 0,
        statDeltas:  { fisico: 0.1 },
        progression: 0.6,
        curative:    true,
      },
      {
        id:          'antiviral',
        label:       'Tratamiento antiviral',
        costMensual: 80,
        statDeltas:  { fisico: 0.3 },
        progression: 0.2,
        curative:    true,
      },
    ],
  },

  accidente: {
    id:       'accidente',
    name:     'Accidente con lesión',
    category: 'acute',
    symptomNotice:     'Un dolor agudo en el cuerpo no desaparece desde el incidente.',
    diagnosisText:     'Las radiografías revelan daño estructural. La rehabilitación será larga.',
    impactoCargaVital: 22,
    costeMensualBase:  200,
    statDeltas: { fisico: -0.6, estabilidad: -0.3 },
    probabilityFn: (age, stats) => clampProb(
      0.04 + (stats.riesgo > 6 ? 0.06 * (stats.riesgo - 6) : 0) +
      (age > 55 ? 0.05 : 0)
    ),
    treatments: [
      {
        id:          'rehabilitacion',
        label:       'Rehabilitación física',
        costMensual: 250,
        statDeltas:  { fisico: 0.4, estabilidad: 0.1 },
        progression: 0.3,
        curative:    true,
      },
      {
        id:          'cirugia',
        label:       'Cirugía reconstructiva',
        costMensual: 800,
        statDeltas:  { fisico: 0.7 },
        progression: 0.1,
        curative:    true,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // CRÓNICAS
  // ══════════════════════════════════════════════════════════════════

  diabetes: {
    id:       'diabetes',
    name:     'Diabetes tipo 2',
    category: 'chronic',
    symptomNotice:     'Notas fatiga persistente y sed excesiva en las últimas semanas.',
    diagnosisText:     'La analítica muestra niveles elevados de glucosa en sangre. Diagnóstico: diabetes tipo 2.',
    impactoCargaVital: 18,
    costeMensualBase:  90,
    statDeltas: { fisico: -0.15, estabilidad: -0.1 },
    probabilityFn: (age, stats) => clampProb(
      (age < 35 ? 0.01 : age < 50 ? 0.04 : age < 65 ? 0.08 : 0.12) +
      lowFisicoBonus(stats, 5) +
      (stats.disciplina < 4 ? 0.04 : 0)
    ),
    treatments: [
      {
        id:          'dieta_ejercicio',
        label:       'Dieta y ejercicio controlado',
        costMensual: 60,
        statDeltas:  { fisico: 0.2, disciplina: 0.1 },
        progression: 0.5,
        curative:    false,
      },
      {
        id:          'medicacion_oral',
        label:       'Medicación oral',
        costMensual: 120,
        statDeltas:  { fisico: 0.1 },
        progression: 0.3,
        curative:    false,
      },
      {
        id:          'insulina',
        label:       'Terapia con insulina',
        costMensual: 220,
        statDeltas:  { fisico: 0.2, estabilidad: 0.1 },
        progression: 0.15,
        curative:    false,
      },
    ],
  },

  depresion: {
    id:       'depresion',
    name:     'Depresión mayor',
    category: 'chronic',
    symptomNotice:     'Un peso que no es cansancio. El mundo se ha vuelto más gris.',
    diagnosisText:     'El psiquiatra pone nombre a lo que llevas meses sintiendo: depresión mayor.',
    impactoCargaVital: 25,
    costeMensualBase:  0,
    statDeltas: { emocional: -0.3, disciplina: -0.25, ambicion: -0.2, fisico: -0.1 },
    probabilityFn: (_age, stats) => clampProb(
      0.05 +
      (stats.estabilidad < 4 ? 0.08 * (4 - stats.estabilidad) : 0) +
      (stats.emocional < 3 ? 0.06 : 0) +
      highEstabilidadBonus(stats)
    ),
    treatments: [
      {
        id:          'terapia_cognitiva',
        label:       'Terapia cognitivo-conductual',
        costMensual: 180,
        statDeltas:  { emocional: 0.3, estabilidad: 0.2 },
        progression: 0.4,
        curative:    false,
      },
      {
        id:          'antidepresivos',
        label:       'Antidepresivos',
        costMensual: 50,
        statDeltas:  { emocional: 0.2, disciplina: 0.1 },
        progression: 0.35,
        curative:    false,
      },
      {
        id:          'combinado',
        label:       'Terapia + medicación',
        costMensual: 220,
        statDeltas:  { emocional: 0.5, estabilidad: 0.3, disciplina: 0.2 },
        progression: 0.2,
        curative:    false,
      },
    ],
  },

  hipertension: {
    id:       'hipertension',
    name:     'Hipertensión arterial',
    category: 'chronic',
    symptomNotice:     'Dolores de cabeza frecuentes. El médico de cabecera te mira fijamente el tensiómetro.',
    diagnosisText:     'Tu tensión arterial está crónicamente elevada. Hay que controlarlo de por vida.',
    impactoCargaVital: 14,
    costeMensualBase:  40,
    statDeltas: { fisico: -0.1, estabilidad: -0.05 },
    probabilityFn: (age, stats) => clampProb(
      (age < 40 ? 0.02 : age < 55 ? 0.06 : age < 70 ? 0.11 : 0.18) +
      lowFisicoBonus(stats, 4) +
      (stats.estabilidad < 3 ? 0.04 : 0)
    ),
    treatments: [
      {
        id:          'cambios_estilo',
        label:       'Cambios de hábitos',
        costMensual: 30,
        statDeltas:  { fisico: 0.15, estabilidad: 0.1 },
        progression: 0.45,
        curative:    false,
      },
      {
        id:          'antihipertensivos',
        label:       'Medicación antihipertensiva',
        costMensual: 60,
        statDeltas:  { fisico: 0.1 },
        progression: 0.2,
        curative:    false,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // TERMINALES
  // ══════════════════════════════════════════════════════════════════

  cancer_pulmon: {
    id:       'cancer_pulmon',
    name:     'Cáncer de pulmón',
    category: 'terminal',
    symptomNotice:     'Una tos que no cede. Sangre en el pañuelo que intentas ignorar.',
    diagnosisText:     'El oncólogo habla en términos clínicos. Tú solo escuchas las palabras "estadio avanzado".',
    terminalText:      'El diagnóstico cambia todo. El tiempo deja de ser abstracto. Cada decisión tiene un peso diferente ahora.',
    impactoCargaVital: 45,
    costeMensualBase:  0,
    statDeltas: { fisico: -0.5, emocional: -0.3, disciplina: -0.2 },
    probabilityFn: (age, stats) => clampProb(
      (age < 45 ? 0.002 : age < 60 ? 0.008 : age < 70 ? 0.018 : 0.03) +
      lowFisicoBonus(stats, 3)
    ),
    treatments: [
      {
        id:          'quimioterapia',
        label:       'Quimioterapia',
        costMensual: 1800,
        statDeltas:  { fisico: -0.2, emocional: -0.1 },
        progression: 0.4,
        curative:    false,
      },
      {
        id:          'inmunoterapia',
        label:       'Inmunoterapia',
        costMensual: 3200,
        statDeltas:  { fisico: 0.1, emocional: 0.05 },
        progression: 0.25,
        curative:    false,
      },
      {
        id:          'paliativo',
        label:       'Cuidados paliativos',
        costMensual: 400,
        statDeltas:  { emocional: 0.3, estabilidad: 0.4 },
        progression: 0.7,
        curative:    false,
      },
    ],
  },

  ela: {
    id:       'ela',
    name:     'ELA — Esclerosis Lateral Amiotrófica',
    category: 'terminal',
    symptomNotice:     'Un entumecimiento que no desaparece. Los dedos ya no responden igual.',
    diagnosisText:     'El neurólogo pronuncia tres letras que lo cambian todo: E-L-A. Una enfermedad que no tiene marcha atrás.',
    terminalText:      'No hay cura. Solo hay tiempo, y lo que eliges hacer con él.',
    impactoCargaVital: 55,
    costeMensualBase:  600,
    statDeltas: { fisico: -0.7, riesgo: -0.1, disciplina: -0.3 },
    probabilityFn: (age, stats) => clampProb(
      (age < 40 ? 0.0003 : age < 55 ? 0.001 : age < 70 ? 0.003 : 0.005) +
      (stats.fisico < 4 ? 0.001 : 0)
    ),
    treatments: [
      {
        id:          'riluzol',
        label:       'Riluzol (ralentiza progresión)',
        costMensual: 700,
        statDeltas:  { disciplina: 0.1 },
        progression: 0.65,
        curative:    false,
      },
      {
        id:          'cuidados_especializados',
        label:       'Cuidados especializados + fisioterapia',
        costMensual: 1400,
        statDeltas:  { emocional: 0.2, estabilidad: 0.3 },
        progression: 0.55,
        curative:    false,
      },
      {
        id:          'paliativo_ela',
        label:       'Cuidados paliativos en casa',
        costMensual: 500,
        statDeltas:  { emocional: 0.4, estabilidad: 0.5 },
        progression: 0.75,
        curative:    false,
      },
    ],
  },
};

// ─── Utility: roll for new diseases at stage transition ───────────────────────

export function rollDiseases(
  age: number,
  stats: CharacterStats,
  existingDiseaseIds: string[],
  rng = Math.random,
): string[] {
  const contracted: string[] = [];
  for (const disease of Object.values(DISEASES)) {
    if (existingDiseaseIds.includes(disease.id)) continue;
    if (rng() < disease.probabilityFn(age, stats)) {
      contracted.push(disease.id);
    }
  }
  return contracted;
}

/** Returns the Disease object by id, throws if not found */
export function getDisease(id: string): Disease {
  const d = DISEASES[id];
  if (!d) throw new Error(`Disease not found: ${id}`);
  return d;
}
