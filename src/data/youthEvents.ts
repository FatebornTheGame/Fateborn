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

function topStats(stats: CharacterStats): (keyof CharacterStats)[] {
  return (Object.entries(stats) as [keyof CharacterStats, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);
}

// ─── Opciones basadas en stats para La Oportunidad ────────────────────────────

const OPPORTUNITY_OPTIONS: Record<keyof CharacterStats, EventOption> = {
  logica:      { id: 'oport_logica',      text: 'Te proponen entrar en un proyecto de investigación exigente, con pocos recursos pero mucho potencial.',          consequence: 'Hay semanas que no duermes bien, pero hay otras en que sientes que lo estás entendiendo todo.',           statDeltas: { logica: 1, disciplina: 0.5 },      flag: { key: 'oportunidad', value: 'investigacion' } },
  creatividad: { id: 'oport_creatividad', text: 'Alguien te propone cofundar algo creativo. Sin garantías económicas, pero sin techos tampoco.',                   consequence: 'No sabes si es valentía o imprudencia, pero la distinción empieza a importarte menos.',                   statDeltas: { creatividad: 1, ambicion: 0.5 },   flag: { key: 'oportunidad', value: 'creativo' } },
  disciplina:  { id: 'oport_disciplina',  text: 'Un puesto exigente y bien definido. Exactamente el tipo de trabajo para el que llevas años preparándote.',        consequence: 'El primer año es duro. El segundo ya sabes lo que haces. El tercero eres imprescindible.',               statDeltas: { disciplina: 1, logica: 0.5 },      flag: { key: 'oportunidad', value: 'carrera' } },
  carisma:     { id: 'oport_carisma',     text: 'Te ofrecen liderar un equipo pequeño en una empresa que empieza a despegar.',                                     consequence: 'Descubres que liderar no es mandar. Es saber cuándo hablar y cuándo escuchar.',                          statDeltas: { carisma: 1, ambicion: 0.5 },       flag: { key: 'oportunidad', value: 'liderazgo' } },
  emocional:   { id: 'oport_emocional',   text: 'Una organización necesita a alguien capaz de gestionar personas en situaciones límite.',                          consequence: 'Ves cosas que no se pueden desver. Pero también haces cosas que importan de verdad.',                   statDeltas: { emocional: 1, carisma: 0.5 },      flag: { key: 'oportunidad', value: 'social' } },
  ambicion:    { id: 'oport_ambicion',    text: 'Un inversor te propone algo grande. Alto riesgo, alta recompensa, posibilidades reales de fracaso.',              consequence: 'Firmas. Esa noche no puedes dormir, pero sabes que tampoco podrías haberlo rechazado.',                  statDeltas: { ambicion: 1, riesgo: 0.5 },        flag: { key: 'oportunidad', value: 'inversion' } },
  fisico:      { id: 'oport_fisico',      text: 'Alguien con poder en tu disciplina muestra interés en ti. La ventana es estrecha. Es ahora o nunca.',            consequence: 'Te preparas como nunca lo habías hecho. El resultado ya no es lo único que importa.',                   statDeltas: { fisico: 1, disciplina: 0.5 },      flag: { key: 'oportunidad', value: 'deporte' } },
  riesgo:      { id: 'oport_riesgo',      text: 'Te ofrecen unirte a algo en el extranjero sin red de seguridad, sin garantía de vuelta.',                        consequence: 'No todo sale bien, pero todo pasa de verdad. Eso empieza a ser lo mismo para ti.',                      statDeltas: { riesgo: 1, fisico: 0.5 },          flag: { key: 'oportunidad', value: 'expedicion' } },
  estabilidad: { id: 'oport_estabilidad', text: 'Una institución reconocida te ofrece un puesto sólido. Menos gloria, pero suelo firme bajo los pies.',           consequence: 'Hay quien lo llama conformismo. Tú lo llamas saber lo que quieres.',                                    statDeltas: { estabilidad: 1, disciplina: 0.5 }, flag: { key: 'oportunidad', value: 'institucion' } },
};

// ─── Eventos ──────────────────────────────────────────────────────────────────

export const YOUTH_EVENTS: LifeEvent[] = [
  {
    id: 'encrucijada',
    age: 19,
    title: 'La encrucijada',
    getNarrative: () =>
      'Tienes diecinueve años y el mundo se abre de golpe. No hay mapa, no hay instrucciones. Solo hay tres puertas delante de ti y tienes que elegir cuál abrir primero.',
    getOptions: () => [
      {
        id: 'encrucijada_universidad',
        text: 'Decides estudiar. Cuatro o cinco años aprendiendo a pensar en un sitio diseñado para eso.',
        consequence: 'Los primeros meses son difíciles. Luego encuentras tu gente, y eso lo cambia todo.',
        statDeltas: { logica: 1, disciplina: 0.5 },
        flag: { key: 'encrucijada', value: 'universidad' },
      },
      {
        id: 'encrucijada_trabajo',
        text: 'Empiezas a trabajar. Sin red, sin teoría. Solo tú y lo que eres capaz de hacer.',
        consequence: 'Aprendes deprisa porque no te puedes permitir el lujo de aprender despacio.',
        statDeltas: { disciplina: 1, ambicion: 0.5 },
        flag: { key: 'encrucijada', value: 'trabajo' },
      },
      {
        id: 'encrucijada_aventura',
        text: 'Te vas. Sin destino fijo, sin plan de vuelta. Necesitas saber qué hay al otro lado.',
        consequence: 'Hay días en que tienes miedo. Hay otros en que sientes que podrías vivir así para siempre.',
        statDeltas: { riesgo: 1, creatividad: 0.5 },
        flag: { key: 'encrucijada', value: 'aventura' },
      },
    ],
  },
  {
    id: 'amor_serio',
    age: 22,
    title: 'El amor serio',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Conoces a alguien con quien podrías construir algo de verdad. No es como antes — esto pesa más, dura más. Por primera vez no sabes si estás ${m ? 'listo' : 'lista'} para algo así.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'amor_serio_entrega',
          text: 'Te entregas. Decides que esta persona merece la versión más honesta de ti.',
          consequence: 'Hay algo que cambia cuando dejas de protegerte tanto. No siempre es cómodo, pero es real.',
          statDeltas: { emocional: 1, estabilidad: 0.5 },
          flag: { key: 'amor_serio', value: 'entrega' },
        },
        {
          id: 'amor_serio_despacio',
          text: 'Te acercas despacio. Sin prisa, sin promesas que no puedas cumplir.',
          consequence: 'Construís algo que tiene sus propios ritmos. No perfecto, pero sólido.',
          statDeltas: { estabilidad: 1, emocional: 0.5 },
          flag: { key: 'amor_serio', value: 'despacio' },
        },
        {
          id: 'amor_serio_miedo',
          text: 'Te da miedo. Esa intensidad te hace querer desaparecer un poco.',
          consequence: `Corres. ${m ? 'Solo' : 'Sola'} después entiendes el precio de ese miedo.`,
          statDeltas: { riesgo: 0.5, ambicion: 0.5 },
          flag: { key: 'amor_serio', value: 'miedo' },
        },
      ];
    },
  },
  {
    id: 'oportunidad',
    age: 25,
    title: 'La oportunidad',
    getNarrative: () =>
      'No estabas buscándola, pero aparece de todas formas. Una oportunidad que encaja exactamente con lo que eres. Podrías dejarla pasar. Podrías no hacerlo.',
    getOptions: (character) => {
      const top = topStats(character.stats);
      const pool = Object.keys(OPPORTUNITY_OPTIONS) as (keyof CharacterStats)[];
      const rest = pool.filter((k) => !top.includes(k));
      const third = rest[Math.floor(Math.random() * rest.length)];
      return [top[0], top[1], third].map((k) => ({ ...OPPORTUNITY_OPTIONS[k] }));
    },
  },
  {
    id: 'perdida',
    age: 28,
    title: 'La pérdida',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Alguien que estaba en el centro de tu vida ya no está. No importa cómo pasó — lo que importa es que hay un hueco donde antes había algo. Estás ${m ? 'solo' : 'sola'} con eso.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'perdida_silencio',
          text: 'Te encierras. Necesitas procesar esto sin testigos.',
          consequence: `El dolor encuentra sus propios caminos cuando no le das salida. Lo aprendes ${m ? 'solo' : 'sola'}.`,
          statDeltas: { estabilidad: 0.5, emocional: -0.5 },
          flag: { key: 'perdida', value: 'silencio' },
        },
        {
          id: 'perdida_hablar',
          text: 'Buscas a alguien con quien hablar. Necesitas decirlo en voz alta para que sea real.',
          consequence: 'Hablar no lo arregla. Pero hace que el peso se distribuya un poco mejor.',
          statDeltas: { emocional: 1, carisma: 0.5 },
          flag: { key: 'perdida', value: 'hablar' },
        },
        {
          id: 'perdida_accion',
          text: 'Te metes de lleno en el trabajo o en el movimiento. La acción como anestesia.',
          consequence: 'Funciona, durante un tiempo. Más adelante tendrás que mirar atrás igualmente.',
          statDeltas: { ambicion: 1, disciplina: 0.5 },
          flag: { key: 'perdida', value: 'accion' },
        },
      ];
    },
  },
];
