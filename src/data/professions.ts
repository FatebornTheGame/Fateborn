// Professions — Fateborn
// Define carreras, requisitos y condiciones de acceso especiales.

import type { CountryTier } from '../store/gameStore';

// ─── Niveles de profesión ─────────────────────────────────────────────────────

export type ProfessionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ProfessionEntry {
  id:           string;
  nivel:        ProfessionLevel;
  nombre:       string;
  descripcion:  string;
  ingresoBase:  number; // mensual en €
  edadMinima?:  number;
  /** País máximo requerido: solo disponible en países con tier >= este valor */
  tierMin?:     CountryTier;
  /** Sin requisito de stats mínimos */
  sinReqStats?: boolean;
  flagsReq?:    string[];
}

// ─── CRIMINAL ─────────────────────────────────────────────────────────────────
// PROBLEMA 5: eliminar requisito de stats mínimos.
// En países Tier E/F (tier >= 3): disponible desde los 14 años.
// Nivel 0 añadido: "Pequeños hurtos / economía informal".

export const CRIMINAL_LEVELS: ProfessionEntry[] = [
  {
    id:          'criminal_0',
    nivel:       0,
    nombre:      'Pequeños hurtos / Economía informal',
    descripcion: 'El primer paso. Sin organización, sin contactos. Solo sobrevivir como se puede. Puede evolucionar... o no.',
    ingresoBase: 150,
    sinReqStats: true,
    edadMinima:  14,
    tierMin:     3, // solo en países Tier D/E/F (CountryTier 3-4)
  },
  {
    id:          'criminal_1',
    nivel:       1,
    nombre:      'Delincuente menor',
    descripcion: 'Robos, estafas pequeñas, menudeo. La calle como escuela.',
    ingresoBase: 400,
    sinReqStats: true,
    edadMinima:  16,
  },
  {
    id:          'criminal_2',
    nivel:       2,
    nombre:      'Miembro de organización',
    descripcion: 'Parte de algo más grande. Órdenes, jerarquía, protección mutua.',
    ingresoBase: 1100,
    sinReqStats: true,
    edadMinima:  18,
  },
  {
    id:          'criminal_3',
    nivel:       3,
    nombre:      'Operativo de confianza',
    descripcion: 'Te han visto trabajar. Empiezan a darte responsabilidad real.',
    ingresoBase: 2500,
    sinReqStats: true,
    edadMinima:  20,
  },
  {
    id:          'criminal_4',
    nivel:       4,
    nombre:      'Teniente',
    descripcion: 'Manejas una parte de la operación. Tienes hombres a tu cargo.',
    ingresoBase: 5000,
    sinReqStats: true,
    edadMinima:  22,
  },
  {
    id:          'criminal_5',
    nivel:       5,
    nombre:      'Jefe de área',
    descripcion: 'Una ciudad, un producto, una frontera. Es tuya.',
    ingresoBase: 10000,
    sinReqStats: true,
    edadMinima:  25,
  },
];

/** PROBLEMA 5: el crimen es accesible para todos en países pobres */
export function edadMinimaCriminal(tierPais: CountryTier): number {
  if (tierPais >= 3) return 14; // Tier D/E/F
  if (tierPais === 2) return 16; // Tier C
  return 18;                     // Tier A/B
}

export function criminalAccesibleSinStats(_tierPais: CountryTier): boolean {
  return true; // siempre, para todos los tiers
}

// ─── PILOTO F1 ────────────────────────────────────────────────────────────────
// PROBLEMA 5: el padre puede financiar karting si tiene liquidez > 5.000€.
// Evento de infancia: flag f1_vocacion si Físico 7+ y Riesgo 7+.

export const F1_LEVELS: ProfessionEntry[] = [
  {
    id:          'f1_karting',
    nivel:       1,
    nombre:      'Karting amateur',
    descripcion: 'El primer paso hacia el asfalto. El padre lo financia (>5.000€), el hijo lo sueña.',
    ingresoBase: 0,
    edadMinima:  8,
    // La condición de liquidez del padre se evalúa en el evento de infancia
  },
  {
    id:          'f1_karting_pro',
    nivel:       2,
    nombre:      'Karting profesional',
    descripcion: 'Circuitos regionales. Los cronómetros no mienten.',
    ingresoBase: 0,
    edadMinima:  10,
  },
  {
    id:          'f1_formula4',
    nivel:       3,
    nombre:      'Fórmula 4',
    descripcion: 'El primer monoplaza de verdad. Aquí empieza la carrera real.',
    ingresoBase: 500,
    edadMinima:  15,
  },
  {
    id:          'f1_formula3',
    nivel:       4,
    nombre:      'Fórmula 3',
    descripcion: 'Los scouts de F1 empiezan a mirarte.',
    ingresoBase: 2000,
    edadMinima:  17,
  },
  {
    id:          'f1_formula2',
    nivel:       5,
    nombre:      'Fórmula 2',
    descripcion: 'Un paso de F1. El mundo entero lo sabe.',
    ingresoBase: 8000,
    edadMinima:  19,
  },
  {
    id:          'f1_rookie',
    nivel:       6,
    nombre:      'Piloto F1 rookie',
    descripcion: 'Has llegado. Ahora hay que quedarse.',
    ingresoBase: 50000,
    edadMinima:  20,
  },
  {
    id:          'f1_titular',
    nivel:       7,
    nombre:      'Piloto F1 titular',
    descripcion: 'Tu nombre en la parrilla de salida del Gran Premio.',
    ingresoBase: 200000,
    edadMinima:  22,
  },
  {
    id:          'f1_estrella',
    nivel:       8,
    nombre:      'Estrella de F1',
    descripcion: 'Victoria tras victoria. Tu nombre ya es historia.',
    ingresoBase: 500000,
    edadMinima:  25,
  },
];

// ─── Evento de infancia F1 ────────────────────────────────────────────────────

export interface F1InfanciaEventCondition {
  fisicoMin:      number;
  riesgoMin:      number;
  liquidezPadre:  number; // el padre necesita esta liquidez para financiar el karting
}

export const F1_INFANCIA_CONDICION: F1InfanciaEventCondition = {
  fisicoMin:     7,
  riesgoMin:     7,
  liquidezPadre: 5000, // antes requería patrimonio alto, ahora solo 5.000€ de liquidez
};

export const F1_INFANCIA_NARRATIVA = {
  titulo:     'La carrera',
  narrativa:  'Tu padre te lleva a ver una carrera. El rugido de los motores, el olor a goma quemada, la velocidad que hace que el tiempo parezca detenerse. Algo se despierta en ti que no sabías que dormía.',
  flagResultado: 'f1_vocacion' as const,
  /** Con f1_vocacion, los requisitos de karting se reducen a la mitad */
  reduccionRequisitos: true,
};

/**
 * Determina si el personaje puede acceder al karting.
 * Con f1_vocacion, la condición se cumple con liquidez > 5.000€ (antes era patrimonio alto).
 */
export function puedeAccederKarting(
  liquidezFamilia: number,
  tieneVocacion:   boolean,
): { puede: boolean; costoInicial: number } {
  const costo = tieneVocacion ? 5000 : 10000; // vocación reduce el coste de acceso
  return {
    puede:        liquidezFamilia >= costo,
    costoInicial: costo,
  };
}

// ─── Abogado (10 niveles, de CLAUDE.md) ──────────────────────────────────────

export const ABOGADO_LEVELS: ProfessionEntry[] = [
  { id: 'abogado_1', nivel: 1, nombre: 'Estudiante de derecho',      descripcion: 'Los libros, las leyes, las primeras dudas sobre si esto era lo que querías.', ingresoBase: 0     },
  { id: 'abogado_2', nivel: 2, nombre: 'Abogado junior',             descripcion: 'Tu primer despacho. Tu primer cliente nervioso. Tu primera noche sin dormir.', ingresoBase: 1400  },
  { id: 'abogado_3', nivel: 3, nombre: 'Abogado',                    descripcion: 'Ya sabes lo que haces. La mayoría del tiempo.', ingresoBase: 2200                            },
  { id: 'abogado_4', nivel: 4, nombre: 'Socio junior',               descripcion: 'La firma te quiere. O necesita lo que sabes hacer.', ingresoBase: 3800                        },
  { id: 'abogado_5', nivel: 5, nombre: 'Socio senior',               descripcion: 'Tu nombre aparece en el membrete. Eso es real.', ingresoBase: 6500                            },
  { id: 'abogado_6', nivel: 6, nombre: 'Abogado de élite',           descripcion: 'Los clientes que vienen a ti no necesitan buscar.', ingresoBase: 10000                        },
  { id: 'abogado_7', nivel: 7, nombre: 'Bufete propio',              descripcion: 'Tu nombre. Tus reglas. Tu riesgo.', ingresoBase: 15000                                        },
  { id: 'abogado_8', nivel: 8, nombre: 'Referente nacional',         descripcion: 'Te citan en sentencias. Apareces en congresos. Los jueces te conocen.', ingresoBase: 25000   },
  { id: 'abogado_9', nivel: 9, nombre: 'Referente internacional',    descripcion: 'Casos en tres países simultáneamente. Viajes, idiomas, reputación global.', ingresoBase: 50000 },
  { id: 'abogado_10', nivel: 10, nombre: 'Leyenda del derecho',      descripcion: 'Tu nombre ya es jurisprudencia.', ingresoBase: 100000                                         },
];
