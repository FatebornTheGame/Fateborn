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

export const ADULTHOOD_EVENTS: LifeEvent[] = [
  {
    id: 'familia',
    age: 33,
    title: 'La familia',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Tienes treinta y tres años y la pregunta ya no puedes ignorarla. ¿Qué quieres construir? ¿Con quién? Hay personas esperando una respuesta tuya. Tú también llevas tiempo esperándola.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'familia_construir',
          text: 'Decides formar una familia. Pones eso por encima de cualquier otra ambición.',
          consequence: `Hay noches de cansancio extremo y mañanas que lo compensan todo. Aprendes que querer a alguien más que a ti ${m ? 'mismo' : 'misma'} cambia la forma en que ves el mundo.`,
          statDeltas: { emocional: 1, estabilidad: 0.5, ambicion: -0.5 },
          flag: { key: 'familia', value: 'construir' },
        },
        {
          id: 'familia_carrera',
          text: 'Priorizas tu carrera. Lo que estás construyendo profesionalmente necesita todo lo que tienes.',
          consequence: `Llegas lejos. Hay momentos en que el éxito sabe a victoria y momentos en que sabe a algo que no puedes nombrar bien.`,
          statDeltas: { ambicion: 1, disciplina: 0.5, emocional: -0.5 },
          flag: { key: 'familia', value: 'carrera' },
        },
        {
          id: 'familia_equilibrio',
          text: 'Intentas las dos cosas. Sabes que ninguna tendrá el cien por cien, pero no puedes renunciar a ninguna.',
          consequence: `El equilibrio nunca es perfecto. Pero aprendes a vivir con eso, y a veces el intento vale más que la perfección.`,
          statDeltas: { estabilidad: 1, carisma: 0.5 },
          flag: { key: 'familia', value: 'equilibrio' },
        },
      ];
    },
  },
  {
    id: 'crisis',
    age: 38,
    title: 'La crisis',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Todo lo que construiste empieza a crujir. No es un desastre repentino — es algo más lento y más profundo. Te despiertas un día y ves las grietas en sitios donde antes solo veías estructura. Tienes que decidir qué haces con eso.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'crisis_resistir',
          text: 'Resistes. Aprietas los dientes y sigues adelante. Esto también pasará.',
          consequence: `Pasa. Pero algunas grietas no desaparecen del todo. Aprendes a vivir con ellas como parte del paisaje.`,
          statDeltas: { disciplina: 1, estabilidad: 0.5, emocional: -0.5 },
          flag: { key: 'crisis', value: 'resistir' },
        },
        {
          id: 'crisis_cambiar',
          text: 'Decides que las grietas son una señal. Cambias lo que tiene que cambiar, aunque duela.',
          consequence: `El cambio cuesta más de lo que esperabas. Pero lo que construyes después tiene una base que el anterior nunca tuvo.`,
          statDeltas: { riesgo: 1, creatividad: 0.5, estabilidad: -0.5 },
          flag: { key: 'crisis', value: 'cambiar' },
        },
        {
          id: 'crisis_pedir_ayuda',
          text: 'Buscas ayuda. Un terapeuta, un mentor, alguien que haya estado donde tú estás.',
          consequence: `Hay algo liberador en decir en voz alta que no puedes ${m ? 'solo' : 'sola'}. Lo que viene después es más honesto que lo que había antes.`,
          statDeltas: { emocional: 1, carisma: 0.5 },
          flag: { key: 'crisis', value: 'ayuda' },
        },
      ];
    },
  },
  {
    id: 'legado',
    age: 43,
    title: 'El legado',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Cuarenta y tres años. Por primera vez te preguntas no qué quieres conseguir, sino qué quieres dejar. La pregunta del legado llega siempre demasiado tarde o demasiado pronto. Hoy te ha llegado a ti.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'legado_personas',
          text: 'Tu legado son las personas. Lo que les has dado, lo que han aprendido contigo.',
          consequence: `Empiezas a medir el éxito en términos que no caben en ningún currículum. Eso te hace ${m ? 'diferente' : 'diferente'} a la persona que eras a los veinte.`,
          statDeltas: { emocional: 1, carisma: 0.5 },
          flag: { key: 'legado', value: 'personas' },
        },
        {
          id: 'legado_obra',
          text: 'Tu legado es lo que creas. Una obra, un proyecto, algo que existirá cuando tú ya no estés.',
          consequence: `Te metes de lleno. Hay algo casi obsesivo en la forma en que trabajas, pero también algo que por fin parece tener el tamaño correcto.`,
          statDeltas: { creatividad: 1, disciplina: 0.5, ambicion: 0.5 },
          flag: { key: 'legado', value: 'obra' },
        },
        {
          id: 'legado_valores',
          text: 'Tu legado son tus valores. Vivir de forma coherente con lo que crees, cada día.',
          consequence: `Es más difícil de lo que parece. Pero cuando lo consigues, hay una calma que no conocías antes.`,
          statDeltas: { estabilidad: 1, disciplina: 0.5 },
          flag: { key: 'legado', value: 'valores' },
        },
      ];
    },
  },
  {
    id: 'reconciliacion',
    age: 48,
    title: 'La reconciliación',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Alguien del pasado reaparece. No lo esperabas, o quizás sí lo esperabas pero no así. Hay una historia entre vosotros que nunca se cerró del todo. Ahora tienes que decidir qué haces con ella.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'reconciliacion_abrir',
          text: 'Abres la puerta. Decides que lo que fue importa menos que lo que podría ser.',
          consequence: `No todo se restaura. Pero algo se repara, y eso resulta ser suficiente para los dos.`,
          statDeltas: { emocional: 1, estabilidad: 0.5 },
          flag: { key: 'reconciliacion', value: 'abrir' },
        },
        {
          id: 'reconciliacion_cerrar',
          text: 'Cierras esa puerta con calma. Sin rabia, pero con claridad.',
          consequence: `Hay alivio en el cierre. Llevas años cargando algo que ya no te pertenece, y por fin lo sueltas.`,
          statDeltas: { estabilidad: 1, disciplina: 0.5 },
          flag: { key: 'reconciliacion', value: 'cerrar' },
        },
        {
          id: 'reconciliacion_escuchar',
          text: 'Escuchas antes de decidir. Quieres entender qué ha pasado todo este tiempo.',
          consequence: `Lo que escuchas cambia algo en cómo recuerdas la historia. No la reescribe, pero sí la hace más grande.`,
          statDeltas: { emocional: 0.5, logica: 0.5, carisma: 0.5 },
          flag: { key: 'reconciliacion', value: 'escuchar' },
        },
      ];
    },
  },
];
