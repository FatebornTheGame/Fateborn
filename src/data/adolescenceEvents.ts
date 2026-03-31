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

const FUTURE_OPTIONS: Record<keyof CharacterStats, EventOption> = {
  logica:      { id: 'futuro_logica',      text: 'Te matriculas en ciencias. Los números y los problemas te dan calma.',            consequence: 'Encuentras en el rigor intelectual una forma de poner orden al mundo.',    statDeltas: { logica: 1, disciplina: 0.5 },      flag: { key: 'vocacion', value: 'ciencias' } },
  creatividad: { id: 'futuro_creatividad', text: 'Decides perseguir el arte o la escritura. Hay algo que necesitas decir.',          consequence: 'No sabes si llegarás lejos, pero sabes que no puedes hacer otra cosa.',    statDeltas: { creatividad: 1, ambicion: 0.5 },   flag: { key: 'vocacion', value: 'arte' } },
  disciplina:  { id: 'futuro_disciplina',  text: 'Estudias con método. Sabes que el esfuerzo constante es tu ventaja real.',        consequence: 'Mientras otros improvisan, tú ya llevas semanas de ventaja.',             statDeltas: { disciplina: 1, logica: 0.5 },      flag: { key: 'vocacion', value: 'estudio' } },
  carisma:     { id: 'futuro_carisma',     text: 'Te ves liderando. Política, empresa, cualquier cosa donde la gente te escuche.',  consequence: 'Empiezas a entender que el poder se construye despacio, relación a relación.', statDeltas: { carisma: 1, ambicion: 0.5 },    flag: { key: 'vocacion', value: 'liderazgo' } },
  emocional:   { id: 'futuro_emocional',   text: 'Quieres ayudar a la gente. Psicología, medicina, trabajo social.',               consequence: 'Aprendes que escuchar bien es más difícil y más raro de lo que parece.',   statDeltas: { emocional: 1, carisma: 0.5 },      flag: { key: 'vocacion', value: 'cuidado' } },
  ambicion:    { id: 'futuro_ambicion',    text: 'No sabes el camino exacto, pero sabes que quieres llegar muy lejos.',            consequence: 'Esa hambre vaga se irá afilando con los años hasta cortar como un cuchillo.', statDeltas: { ambicion: 1, riesgo: 0.5 },      flag: { key: 'vocacion', value: 'ambicion' } },
  fisico:      { id: 'futuro_fisico',      text: 'El deporte es tu lengua. Entrenar deja de ser hábito y se convierte en identidad.',consequence: 'Tu cuerpo empieza a ser la prueba de lo que eres capaz de hacer.',        statDeltas: { fisico: 1, disciplina: 0.5 },      flag: { key: 'vocacion', value: 'deporte' } },
  riesgo:      { id: 'futuro_riesgo',      text: 'No te imaginas atado a un escritorio. Quieres algo con movimiento, con riesgo.', consequence: 'Todavía no sabes qué nombre tiene ese camino, pero lo reconocerás al verlo.', statDeltas: { riesgo: 1, ambicion: 0.5 },      flag: { key: 'vocacion', value: 'aventura' } },
  estabilidad: { id: 'futuro_estabilidad', text: 'Prefieres un camino seguro, con suelo firme bajo los pies.',                     consequence: 'No es falta de ambición: es saber que la tranquilidad tiene su propio valor.', statDeltas: { estabilidad: 1, disciplina: 0.5 }, flag: { key: 'vocacion', value: 'seguridad' } },
};

export const ADOLESCENCE_EVENTS: LifeEvent[] = [
  {
    id: 'primer_amor',
    age: 13,
    title: 'El primer amor',
    getNarrative: (character) => {
      const m = character.gender === 'hombre';
      return `Hay alguien. No sabes exactamente cuándo empezó, pero ahora no puedes dejar de pensar en esa persona. Te pone ${m ? 'nervioso' : 'nerviosa'} de una forma que no habías sentido antes. Tienes que hacer algo.`;
    },
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'amor_confesion',
          text: 'Te lanzas y le dices lo que sientes. No sabes lo que va a pasar, pero no puedes callarlo más.',
          consequence: `Hay un momento de silencio que se hace eterno. Luego, pase lo que pase, algo en ti se asienta.`,
          statDeltas: { carisma: 1, riesgo: 0.5 },
          flag: { key: 'primer_amor', value: 'confesion' },
        },
        {
          id: 'amor_distancia',
          text: `Te quedas ${m ? 'callado' : 'callada'}. ${m ? 'Lo' : 'La'} observas desde lejos y aprendes a convivir con ese peso.`,
          consequence: `Guardas ese sentimiento tan dentro que se convierte en parte de ti sin que nadie lo sepa.`,
          statDeltas: { emocional: 1, estabilidad: 0.5 },
          flag: { key: 'primer_amor', value: 'distancia' },
        },
        {
          id: 'amor_amistad',
          text: `Te acercas despacio. Primero la amistad. Luego ya verás.`,
          consequence: `Aprendes que hay formas de querer que no necesitan nombre para ser reales.`,
          statDeltas: { emocional: 0.5, carisma: 1 },
          flag: { key: 'primer_amor', value: 'amistad' },
        },
      ];
    },
  },
  {
    id: 'tension_familiar',
    age: 14,
    title: 'La decisión',
    getNarrative: () =>
      'Las discusiones en casa son cada vez más frecuentes. El ambiente es denso, pesado. Hay noches en que el silencio duele más que los gritos. Llevas semanas buscando cómo sobrevivir a esto.',
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'decision_evasion',
          text: 'Te encierras en tu habitación. Música alta, puerta cerrada. No escuchas si no oyes.',
          consequence: `Construyes un refugio interior que nadie puede tocar. Es tuyo y de nadie más.`,
          statDeltas: { estabilidad: 1, emocional: -0.5 },
          flag: { key: 'hogar_adolescencia', value: 'evasion' },
        },
        {
          id: 'decision_mediador',
          text: 'Intentas mediar. Poner palabras donde solo hay reproches.',
          consequence: `Aprendes que las personas que más quieres pueden decepcionarte, y sigues queriéndolas igual.`,
          statDeltas: { emocional: 1, carisma: 0.5 },
          flag: { key: 'hogar_adolescencia', value: 'mediador' },
        },
        {
          id: 'decision_exterior',
          text: 'Pasas el tiempo fuera de casa. Con amigos, en la calle, en cualquier sitio menos ahí.',
          consequence: `El mundo exterior se vuelve más familiar que tu propia casa. No sabes si eso te salvó o te perdió.`,
          statDeltas: { riesgo: 0.5, disciplina: 0.5 },
          flag: { key: 'hogar_adolescencia', value: 'exterior' },
        },
      ];
    },
  },
  {
    id: 'tentacion',
    age: 16,
    title: 'La tentación',
    getNarrative: () =>
      'Estás en una fiesta. La música está alta, las luces bajas. Alguien que apenas conoces te ofrece algo con una sonrisa que da a entender que todo el mundo lo hace. Todos te están mirando.',
    getOptions: (character) => {
      const m = character.gender === 'hombre';
      return [
        {
          id: 'tentacion_rechazo',
          text: `Lo rechazas sin darle más vueltas. No es lo tuyo y no te importa lo que piensen.`,
          consequence: `Hay un instante de silencio incómodo. Luego la noche sigue como si nada.`,
          statDeltas: { disciplina: 1, estabilidad: 0.5 },
          flag: { key: 'tentacion', value: 'rechazo' },
        },
        {
          id: 'tentacion_probar',
          text: `Lo pruebas. Solo una vez, te dices a ti ${m ? 'mismo' : 'misma'}.`,
          consequence: `Esa noche cambia algo. No sabes todavía si para bien o para mal.`,
          statDeltas: { riesgo: 1, emocional: 0.5 },
          flag: { key: 'tentacion', value: 'probar' },
        },
        {
          id: 'tentacion_fachada',
          text: `Finges que lo pruebas. Lo suficiente para no quedar fuera. No lo suficiente para que importe.`,
          consequence: `Aprendes que a veces la mejor salida es la que nadie nota.`,
          statDeltas: { carisma: 1, disciplina: 0.5 },
          flag: { key: 'tentacion', value: 'fachada' },
        },
      ];
    },
  },
  {
    id: 'eleccion_futuro',
    age: 17,
    title: 'El futuro',
    getNarrative: () =>
      'Todo el mundo a tu alrededor parece tenerlo claro. Tú también empiezas a sentirlo: hay algo dentro de ti que tira más fuerte que el resto. No es un plan todavía, pero es una dirección.',
    getOptions: (character) => {
      const top = topStats(character.stats);
      const pool = Object.keys(FUTURE_OPTIONS) as (keyof CharacterStats)[];
      const rest = pool.filter((k) => !top.includes(k));
      const third = rest[Math.floor(Math.random() * rest.length)];
      return [top[0], top[1], third].map((k) => {
        const opt = { ...FUTURE_OPTIONS[k] };
        // Gender agreement for "atado/atada"
        if (k === 'riesgo' && character.gender === 'mujer') {
          opt.text = 'No te imaginas atada a un escritorio. Quieres algo con movimiento, con riesgo.';
        }
        return opt;
      });
    },
  },
];
