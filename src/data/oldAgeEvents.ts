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

export const OLD_AGE_EVENTS: LifeEvent[] = [
  {
    id: 'recuerdos',
    age: 73,
    title: 'Los recuerdos',
    getNarrative: (character) =>
      `A esta edad los recuerdos ya no llegan cuando los llamas — llegan cuando quieren. Aparecen en mitad de la noche, en el olor de algo, en una voz que se parece a otra. Y en ellos estás tú, ${character.name}, más joven, tomando decisiones que ya no puedes cambiar.`,
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'recuerdos_gratitud',
          text: 'Los miras con gratitud. Fueron tuyos, buenos y malos, y eso los hace valiosos.',
          consequence: `Hay una paz extraña en aceptar que lo que fue, fue. No perfecta, pero real. Más real que cualquier otra cosa que hayas sentido.`,
          statDeltas: { estabilidad: 1, emocional: 0.5 },
          flag: { key: 'recuerdos', value: 'gratitud' },
        },
        {
          id: 'recuerdos_pena',
          text: 'Los miras con pena. Hay demasiadas cosas que harías diferente.',
          consequence: `La pena no es solo tristeza — también es amor. Solo lamentas lo que alguna vez te importó de verdad.`,
          statDeltas: { emocional: 1, disciplina: 0.5 },
          flag: { key: 'recuerdos', value: 'pena' },
        },
        {
          id: 'recuerdos_curiosidad',
          text: 'Los miras con curiosidad. Como si fueran de otra persona, y esa persona te resulta interesante.',
          consequence: `Distanciarte de ti ${m ? 'mismo' : 'misma'} no es frialdad — es la única forma que encontraste de entenderte sin juzgarte.`,
          statDeltas: { logica: 1, estabilidad: 0.5 },
          flag: { key: 'recuerdos', value: 'curiosidad' },
        },
      ];
    },
  },
  {
    id: 'perdon',
    age: 77,
    title: 'El perdón',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Hay algo que llevas cargando desde hace mucho tiempo. No siempre tienes nombre para ello, pero está ahí. Una persona, una decisión, una versión de ti ${m ? 'mismo' : 'misma'} que nunca pudiste aceptar del todo. Ya no tienes tiempo infinito para seguir cargándolo.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'perdon_otro',
          text: 'Perdonas a quien te hizo daño. No porque lo merezca, sino porque tú necesitas soltar ese peso.',
          consequence: `No desaparece del todo. Pero se vuelve más ligero. Y ligero es suficiente a esta altura.`,
          statDeltas: { emocional: 1, estabilidad: 1 },
          flag: { key: 'perdon', value: 'otro' },
        },
        {
          id: 'perdon_propio',
          text: `Te perdonas a ti ${m ? 'mismo' : 'misma'}. Por lo que hiciste, por lo que no hiciste, por quien fuiste.`,
          consequence: `Es el perdón más difícil de todos. Y el más necesario. Llevas décadas siendo tu peor juez.`,
          statDeltas: { emocional: 1, ambicion: 0.5 },
          flag: { key: 'perdon', value: 'propio' },
        },
        {
          id: 'perdon_soltar',
          text: 'No perdonas, pero sueltas. Hay una diferencia, y a tu edad la conoces bien.',
          consequence: `Soltar no es olvidar. Es decidir que esa historia ya no tiene poder sobre los días que te quedan.`,
          statDeltas: { estabilidad: 1, logica: 0.5 },
          flag: { key: 'perdon', value: 'soltar' },
        },
      ];
    },
  },
  {
    id: 'ultimo_dia',
    age: 81,
    title: 'El último día',
    getNarrative: (character) =>
      `Lo sientes, ${character.name}. No con miedo, o no solo con miedo. Hay algo más — una claridad que no habías tenido antes. Las cosas pequeñas se vuelven grandes. Las cosas grandes se vuelven pequeñas. Sabes que hoy importa de una forma que los otros días no importaron.`,
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'ultimo_personas',
          text: 'Lo pasas con las personas que quieres. Sin palabras importantes, solo presencia.',
          consequence: `No hay nada que decir que no esté ya dicho. Y resulta que eso es suficiente. Siempre lo fue.`,
          statDeltas: { emocional: 1, carisma: 0.5 },
          flag: { key: 'ultimo_dia', value: 'personas' },
        },
        {
          id: 'ultimo_solo',
          text: `Lo pasas ${m ? 'solo' : 'sola'}. En silencio, con todo lo que has sido.`,
          consequence: `Hay dignidad en despedirse así — sin audiencia, sin performance. Solo tú y la vida que viviste.`,
          statDeltas: { estabilidad: 1, logica: 0.5 },
          flag: { key: 'ultimo_dia', value: 'solo' },
        },
        {
          id: 'ultimo_paz',
          text: 'Lo recibes con paz. Sin resistencia. Lo que tiene que ser, que sea.',
          consequence: `No es rendición — es sabiduría. La más difícil de todas: saber cuándo dejar de luchar y simplemente estar.`,
          statDeltas: { estabilidad: 1, emocional: 1 },
          flag: { key: 'ultimo_dia', value: 'paz' },
        },
      ];
    },
  },
];
