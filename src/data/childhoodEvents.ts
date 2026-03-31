import type { Character, CharacterStats } from '../types';

export interface EventOption {
  id: string;
  text: string;
  consequence: string;
  statDeltas: Partial<CharacterStats>;
  flag?: { key: string; value: boolean | string | number };
}

export interface LifeEvent {
  id: string;
  age: number;
  title: string;
  getNarrative: (character: Character) => string;
  getOptions: (character: Character) => EventOption[];
}

// Devuelve los 2 stats más altos del personaje
function topStats(stats: CharacterStats): (keyof CharacterStats)[] {
  return (Object.entries(stats) as [keyof CharacterStats, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);
}

const TALENT_OPTIONS: Record<keyof CharacterStats, EventOption> = {
  logica:      { id: 'talento_logica',      text: 'Resolver puzzles y acertijos con una facilidad asombrosa.',      consequence: 'Tu mente encuentra patrones donde otros solo ven caos.',      statDeltas: { logica: 1, disciplina: 0.5 },      flag: { key: 'talento_infancia', value: 'logica' } },
  creatividad: { id: 'talento_creatividad', text: 'Inventar historias y dibujar mundos que nadie más imagina.',      consequence: 'Tu imaginación empieza a ser un refugio y una herramienta.',  statDeltas: { creatividad: 1, emocional: 0.5 },  flag: { key: 'talento_infancia', value: 'creatividad' } },
  disciplina:  { id: 'talento_disciplina',  text: 'Mantener rutinas y terminar lo que empiezas, siempre.',         consequence: 'Aprendes que la constancia vale más que el talento puro.',    statDeltas: { disciplina: 1, estabilidad: 0.5 }, flag: { key: 'talento_infancia', value: 'disciplina' } },
  carisma:     { id: 'talento_carisma',     text: 'Hacer reír a todos y que te sigan adonde vayas.',               consequence: 'La gente gravita hacia ti sin que sepas muy bien por qué.',  statDeltas: { carisma: 1, ambicion: 0.5 },       flag: { key: 'talento_infancia', value: 'carisma' } },
  emocional:   { id: 'talento_emocional',   text: 'Sentir lo que sienten los demás antes de que lo digan.',        consequence: 'Tu sensibilidad es un don que todavía no sabes manejar.',    statDeltas: { emocional: 1, carisma: 0.5 },      flag: { key: 'talento_infancia', value: 'emocional' } },
  ambicion:    { id: 'talento_ambicion',    text: 'Querer siempre más, nunca conformarte con lo que tienes.',      consequence: 'Esa insatisfacción será tu motor durante años.',             statDeltas: { ambicion: 1, riesgo: 0.5 },        flag: { key: 'talento_infancia', value: 'ambicion' } },
  fisico:      { id: 'talento_fisico',      text: 'Correr más rápido, saltar más alto, cansar menos que nadie.',   consequence: 'Tu cuerpo responde como si hubiera nacido para moverse.',   statDeltas: { fisico: 1, riesgo: 0.5 },          flag: { key: 'talento_infancia', value: 'fisico' } },
  riesgo:      { id: 'talento_riesgo',      text: 'Lanzarte sin dudar cuando otros se detienen a pensar.',         consequence: 'La adrenalina se convierte en tu forma favorita de sentir.', statDeltas: { riesgo: 1, fisico: 0.5 },          flag: { key: 'talento_infancia', value: 'riesgo' } },
  estabilidad: { id: 'talento_estabilidad', text: 'Mantener la calma cuando todo a tu alrededor se desmorona.',    consequence: 'Esa serenidad es rara a tu edad, y los adultos lo notan.',   statDeltas: { estabilidad: 1, emocional: 0.5 },  flag: { key: 'talento_infancia', value: 'estabilidad' } },
};

export const CHILDHOOD_EVENTS: LifeEvent[] = [
  {
    id: 'regalo_padre',
    age: 6,
    title: 'El regalo',
    getNarrative: () =>
      'Tu padre llega a casa con algo envuelto en papel de periódico. Lo deja sobre la mesa y te mira esperando. Puedes elegir, dice. Solo uno.',
    getOptions: () => [
      {
        id: 'libro',
        text: 'Un libro de ciencias con ilustraciones de planetas y fórmulas.',
        consequence: 'Pasas semanas leyéndolo. Algo dentro de ti empieza a ordenarse.',
        statDeltas: { logica: 1, creatividad: 0.5 },
        flag: { key: 'regalo_infancia', value: 'libro' },
      },
      {
        id: 'balon',
        text: 'Un balón de fútbol con el escudo de tu equipo favorito.',
        consequence: 'Sales a la calle cada tarde. El cuerpo aprende a obedecer.',
        statDeltas: { fisico: 1, riesgo: 0.5 },
        flag: { key: 'regalo_infancia', value: 'balon' },
      },
      {
        id: 'construccion',
        text: 'Un juego de construcción con mil piezas de colores.',
        consequence: 'Construyes cosas que nadie te enseñó. Tu mente empieza a ver sistemas.',
        statDeltas: { creatividad: 1, disciplina: 0.5 },
        flag: { key: 'regalo_infancia', value: 'construccion' },
      },
    ],
  },
  {
    id: 'bully_colegio',
    age: 9,
    title: 'El conflicto',
    getNarrative: (character) =>
      `Hay un compañero que hace tu vida imposible. Cada día encuentra una forma nueva de recordarte que eres diferente. Llevas semanas aguantando, ${character.name}. Hoy decides hacer algo.`,
    getOptions: () => [
      {
        id: 'ignorar',
        text: 'Ignorarlo. Aguantar en silencio y esperar a que se aburra.',
        consequence: 'Aprendes a construir muros. No todos son sanos, pero todos protegen.',
        statDeltas: { estabilidad: 1, emocional: -0.5 },
        flag: { key: 'conflicto_infancia', value: 'ignorar' },
      },
      {
        id: 'enfrentar',
        text: 'Enfrentarlo. Plantarte delante de él y decirle que se acabó.',
        consequence: 'Hay consecuencias. Pero algo en ti cambia para siempre ese día.',
        statDeltas: { riesgo: 1, carisma: 0.5 },
        flag: { key: 'conflicto_infancia', value: 'enfrentar' },
      },
      {
        id: 'adulto',
        text: 'Contárselo a un adulto. Buscar ayuda sin vergüenza.',
        consequence: 'Te costó decirlo, pero lo dijiste. Aprendes que pedir ayuda no es rendirse.',
        statDeltas: { emocional: 1, estabilidad: 0.5 },
        flag: { key: 'conflicto_infancia', value: 'adulto' },
      },
    ],
  },
  {
    id: 'primer_talento',
    age: 11,
    title: 'El talento',
    getNarrative: (character) =>
      `Hay algo que haces diferente, ${character.name}. No lo elegiste — simplemente apareció. Tus profesores lo notan, tus amigos también. Tú empiezas a darte cuenta de lo que eres.`,
    getOptions: (character) => {
      const top = topStats(character.stats);
      const pool = Object.keys(TALENT_OPTIONS) as (keyof CharacterStats)[];
      const rest = pool.filter((k) => !top.includes(k));
      const third = rest[Math.floor(Math.random() * rest.length)];
      return [top[0], top[1], third].map((k) => TALENT_OPTIONS[k]);
    },
  },
];
