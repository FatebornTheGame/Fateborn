import type { Character } from '../types';

export interface EventOption {
  id: string;
  text: string;
  consequence: string;
  statDeltas: Partial<import('../types').CharacterStats>;
  flag?: { key: string; value: boolean | string | number };
}

export interface LifeEvent {
  id: string;
  age: number;
  title: string;
  getNarrative: (character: Character) => string;
  getOptions: (character: Character) => EventOption[];
}

export const MATURITY_EVENTS: LifeEvent[] = [
  {
    id: 'balance',
    age: 53,
    title: 'El balance',
    getNarrative: (character) =>
      `Cincuenta y tres años, ${character.name}. Por primera vez tienes suficiente distancia para ver la forma completa de tu vida. No como la estabas viviendo, sino como realmente fue. Lo que ves no es ni tan bueno ni tan malo como esperabas.`,
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'balance_orgullo',
          text: 'Ves más de lo que construiste que de lo que perdiste. Hay orgullo en eso, y no te avergüenza sentirlo.',
          consequence: `Esa paz contigo ${m ? 'mismo' : 'misma'} no es complacencia. Es el resultado de haber pagado el precio de tus decisiones sin mirar para otro lado.`,
          statDeltas: { estabilidad: 1, emocional: 0.5 },
          flag: { key: 'balance', value: 'orgullo' },
        },
        {
          id: 'balance_deuda',
          text: 'Ves las cosas que no hiciste, las personas a las que fallaste. Esa cuenta todavía está abierta.',
          consequence: `La lucidez duele. Pero reconocer la deuda es el primer paso para saldarla, o al menos para dejar de ignorarla.`,
          statDeltas: { emocional: 1, disciplina: 0.5 },
          flag: { key: 'balance', value: 'deuda' },
        },
        {
          id: 'balance_aceptacion',
          text: 'Ves las dos cosas a la vez. Lo bueno y lo malo. Y decides que así fue, y que así tenía que ser.',
          consequence: `La aceptación no es resignación. Es entender que la vida que viviste es la única que tenías disponible.`,
          statDeltas: { estabilidad: 1, logica: 0.5 },
          flag: { key: 'balance', value: 'aceptacion' },
        },
      ];
    },
  },
  {
    id: 'salud',
    age: 58,
    title: 'La salud',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Tu cuerpo empieza a hablar de formas que antes ignorabas. No es una crisis, pero es una advertencia. Llevas décadas tratándolo como una herramienta. Ahora te pide algo diferente.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'salud_cuidar',
          text: 'Cambias hábitos. Duermes más, comes mejor, reduces lo que te daña. Por fin te tomas en serio.',
          consequence: `No recuperas los veinte años, pero recuperas claridad. Tu cuerpo responde mejor de lo que esperabas.`,
          statDeltas: { fisico: 1, disciplina: 0.5, estabilidad: 0.5 },
          flag: { key: 'salud', value: 'cuidar' },
        },
        {
          id: 'salud_ignorar',
          text: 'Lo ignoras. Siempre has funcionado así y no vas a cambiar ahora.',
          consequence: `El cuerpo acepta el trato durante un tiempo. Pero acumula intereses, y algún día los cobrará.`,
          statDeltas: { ambicion: 0.5, fisico: -0.5 },
          flag: { key: 'salud', value: 'ignorar' },
        },
        {
          id: 'salud_aceptar',
          text: 'Aceptas los límites sin drama. Ajustas el ritmo y aprendes a moverse dentro de lo que tienes.',
          consequence: `Hay dignidad en saber cuándo dejar de forzar. Lo que pierdes en velocidad lo ganas en profundidad.`,
          statDeltas: { estabilidad: 1, emocional: 0.5 },
          flag: { key: 'salud', value: 'aceptar' },
        },
      ];
    },
  },
  {
    id: 'sabiduria',
    age: 63,
    title: 'La sabiduría',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Alguien joven te busca. No sabe exactamente qué necesita, pero sabe que tú tienes algo que ${m ? 'él' : 'ella'} no tiene todavía: tiempo vivido. Lo que hagas con esa confianza importa.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'sabiduria_experiencia',
          text: 'Le cuentas lo que viviste. Sin adornos, sin lecciones empaquetadas. Solo la verdad de lo que pasó.',
          consequence: `Escucha de una forma que no esperabas. A veces la experiencia cruda vale más que cualquier consejo bien formulado.`,
          statDeltas: { carisma: 1, emocional: 0.5 },
          flag: { key: 'sabiduria', value: 'experiencia' },
        },
        {
          id: 'sabiduria_preguntas',
          text: 'No le das respuestas. Le haces preguntas. Las que nadie le había hecho todavía.',
          consequence: `Descubres que enseñar bien no es transmitir lo que sabes, sino ayudar a alguien a encontrar lo que ya lleva dentro.`,
          statDeltas: { logica: 1, emocional: 0.5 },
          flag: { key: 'sabiduria', value: 'preguntas' },
        },
        {
          id: 'sabiduria_presencia',
          text: 'Simplemente estás. Sin agenda, sin lecciones. A veces lo más útil es no desaparecer.',
          consequence: `Años después, esa persona recordará que estuviste. No lo que dijiste. Solo que estuviste.`,
          statDeltas: { emocional: 1, estabilidad: 0.5 },
          flag: { key: 'sabiduria', value: 'presencia' },
        },
      ];
    },
  },
  {
    id: 'tiempo',
    age: 68,
    title: 'El tiempo',
    getNarrative: (character) =>
      `Sesenta y ocho años, ${character.name}. El tiempo ya no es algo que gestionas — es algo que sientes. Los días tienen el mismo número de horas, pero pesan diferente. Hay una forma de vivir estos años que todavía puedes elegir.`,
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'tiempo_intensidad',
          text: 'Lo vives con intensidad. Cada día como si fuera el que más importa, porque probablemente lo es.',
          consequence: `Hay cansancio en esa forma de vivir. Pero también hay una plenitud que no conocías cuando tenías tiempo de sobra.`,
          statDeltas: { ambicion: 0.5, emocional: 1, riesgo: 0.5 },
          flag: { key: 'tiempo_final', value: 'intensidad' },
        },
        {
          id: 'tiempo_calma',
          text: 'Lo vives despacio. Con atención. Aprendiendo a estar en un lugar sin querer estar ya en el siguiente.',
          consequence: `La calma que encuentras a esta edad tiene una textura diferente a la que conocías. No es quietud — es presencia.`,
          statDeltas: { estabilidad: 1, emocional: 0.5 },
          flag: { key: 'tiempo_final', value: 'calma' },
        },
        {
          id: 'tiempo_gratitud',
          text: 'Lo vives con gratitud. Mirando lo que tienes, no lo que ya no está.',
          consequence: `No es fácil. Hay días en que la gratitud cuesta. Pero los días en que sale natural son los mejores que recuerdas.`,
          statDeltas: { emocional: 1, estabilidad: 1 },
          flag: { key: 'tiempo_final', value: 'gratitud' },
        },
      ];
    },
  },
];
