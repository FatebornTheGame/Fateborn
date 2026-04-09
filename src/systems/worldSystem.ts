import type { FeedEntry, Rival, Country } from '../store/gameStore';
import type { Character } from '../types';
import { generateRival } from './rivalSystem';

function baseEconomy(country: Country): { liquidez: number; ingresosMensuales: number; gastosMensuales: number } {
  const base = country.tier === 1 ? 1200 : country.tier === 2 ? 600 : country.tier === 3 ? 200 : 80;
  return {
    liquidez:          base * 2,
    ingresosMensuales: 0,
    gastosMensuales:   Math.round(base * 0.8),
  };
}

function dominantStat(character: Character): string {
  const s = character.stats;
  const entries = Object.entries(s) as [string, number][];
  return entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

function firstOpportunity(
  character: Character,
  country: Country,
  semana: number,
  año: number,
): Omit<FeedEntry, 'id' | 'answered'> {
  const dom = dominantStat(character);
  const tierLabel = ['', 'desarrollado', 'emergente', 'en desarrollo', 'frágil'][country.tier];

  const opMap: Record<string, { text: string; options: { id: string; label: string }[] }> = {
    logica: {
      text: `En ${country.nombre}, un país ${tierLabel}, tu mente lógica no ha pasado desapercibida. Un tutor local ha visto potencial en ti y te ofrece orientación gratuita en ciencias exactas.`,
      options: [{ id: 'aceptar', label: 'Aceptar la tutoría' }, { id: 'rechazar', label: 'Seguir solo' }],
    },
    creatividad: {
      text: `Tu sensibilidad creativa ha llamado la atención de un pequeño colectivo artístico en ${country.nombre}. Te invitan a colaborar en un proyecto.`,
      options: [{ id: 'unirse', label: 'Unirte al colectivo' }, { id: 'rechazar', label: 'Declinar' }],
    },
    carisma: {
      text: `En ${country.nombre} la gente te escucha naturalmente. Un evento local busca un portavoz joven. Podrías ser tú.`,
      options: [{ id: 'presentar', label: 'Presentarte como candidato' }, { id: 'rechazar', label: 'Pasar' }],
    },
    ambicion: {
      text: `Tu ambición es visible. Un emprendedor local te propone hacer recados y aprender el negocio desde dentro.`,
      options: [{ id: 'aceptar', label: 'Aceptar el trabajo' }, { id: 'rechazar', label: 'Buscar algo mejor' }],
    },
    fisico: {
      text: `Tu condición física destaca. Un club deportivo local te ofrece entrenamiento gratuito a cambio de participar en competencias.`,
      options: [{ id: 'entrenar', label: 'Unirte al club' }, { id: 'rechazar', label: 'Declinar' }],
    },
  };

  const match = opMap[dom] ?? {
    text: `En ${country.nombre} comienza tu historia. El mundo está lleno de oportunidades para quien sabe buscarlas.`,
    options: [],
  };

  return { ...match, semana, año, importance: 'alta' };
}

export interface WorldInitResult {
  feedEntries:  Omit<FeedEntry, 'id' | 'answered'>[];
  economyPatch: { liquidez: number; ingresosMensuales: number; gastosMensuales: number };
  rival:        Rival;
}

export function generateWorldInit(character: Character, country: Country): WorldInitResult {
  const semana = 1;
  const año = character.birthYear + 18; // empieza vida adulta

  const economyPatch = baseEconomy(country);
  const rival = generateRival(country, character.gender);

  const feedEntries: Omit<FeedEntry, 'id' | 'answered'>[] = [
    {
      semana,
      año,
      importance: 'normal',
      text: `Bienvenido, ${character.name}. Naciste en ${country.nombre} y has llegado a los 18 años. Tu legado familiar lleva el peso de cuatro generaciones. Lo que hagas con él es solo tuyo.`,
    },
    {
      semana,
      año,
      importance: 'normal',
      text: `Situación económica inicial: tienes ${economyPatch.liquidez.toLocaleString('es-ES')} € de ahorro familiar. Tus gastos mensuales estimados son ${economyPatch.gastosMensuales.toLocaleString('es-ES')} €. No tienes ingresos propios todavía.`,
    },
    firstOpportunity(character, country, semana, año),
    {
      semana,
      año,
      importance: 'critica',
      text: `Un rival ha emergido: ${rival.name}, ${rival.archetype}. ${rival.description} Amenaza: ${rival.threat}/100.`,
    },
  ];

  return { feedEntries, economyPatch, rival };
}
