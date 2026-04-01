import type { Character } from '../types';
import type { Career, Economy } from '../store/gameStore';

// ─── Phases ───────────────────────────────────────────────────────────────────

export type BBPhase =
  | 'contacto'
  | 'primer_laboratorio'
  | 'produccion'
  | 'escalada'
  | 'punto_no_retorno'
  | 'final_multiple';

// ─── Arc state ────────────────────────────────────────────────────────────────

export interface BBState {
  unlocked:     boolean;
  active:       boolean;
  phase:        BBPhase;
  lineaCruzada: number;  // 0-100
}

export const BB_STATE_DEFAULT: BBState = {
  unlocked:     false,
  active:       false,
  phase:        'contacto',
  lineaCruzada: 0,
};

// ─── Phase data ───────────────────────────────────────────────────────────────

export interface BBPhaseData {
  id:            BBPhase;
  nombre:        string;
  descripcion:   string;
  /** Minimum lineaCruzada to enter this phase */
  umbral:        number;
  /** Narrative options available in this phase */
  opciones:      BBOption[];
}

export interface BBOption {
  id:               string;
  label:            string;
  descripcion:      string;
  /** How much lineaCruzada increases */
  lineaDelta:       number;
  /** Stat changes */
  statDeltas:       Partial<{ [K in keyof import('../types').CharacterStats]: number }>;
  /** Economy impact (monthly income delta) */
  ingresosDelta:    number;
  /** Narrative consequence text */
  consecuencia:     string;
  /** If true, this option triggers the finale */
  triggersFinal?:   boolean;
  /** If true, this option is the "exit" option (refuse / turn yourself in) */
  isExit?:          boolean;
}

export const BB_PHASES: BBPhaseData[] = [
  {
    id:          'contacto',
    nombre:      'El Primer Contacto',
    descripcion: 'El diagnóstico lo cambia todo. Un conocido del pasado te plantea una propuesta que hace semanas habrías rechazado sin pensarlo.',
    umbral:      0,
    opciones: [
      {
        id:           'escuchar',
        label:        'Escucharle',
        descripcion:  'No comprometes nada. Solo escuchas.',
        lineaDelta:   8,
        statDeltas:   { ambicion: 0.2, estabilidad: -0.1 },
        ingresosDelta: 0,
        consecuencia: 'Su oferta es clara. El dinero es real. Tu vida entera te ha preparado para esto, aunque nunca lo supiste.',
      },
      {
        id:           'rechazar_inicial',
        label:        'Rechazar y cortar el contacto',
        descripcion:  'No. Aún hay otras opciones.',
        lineaDelta:   2,
        statDeltas:   { estabilidad: 0.2, emocional: 0.1 },
        ingresosDelta: 0,
        consecuencia: 'Cuelgas el teléfono. Pero el diagnóstico sigue ahí, y las facturas también.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'primer_laboratorio',
    nombre:      'El Primer Laboratorio',
    descripcion: 'Has aceptado. Un espacio improvisado, equipamiento básico. Tu conocimiento científico vale más que cualquier capital inicial.',
    umbral:      8,
    opciones: [
      {
        id:           'perfeccionar',
        label:        'Buscar la pureza máxima',
        descripcion:  'Tu orgullo científico no acepta mediocridad. Si vas a hacer esto, lo harás bien.',
        lineaDelta:   15,
        statDeltas:   { logica: 0.3, ambicion: 0.3, estabilidad: -0.2 },
        ingresosDelta: 800,
        consecuencia: 'El producto es excepcional. La palabra se corre. Eso tiene consecuencias que aún no puedes ver.',
      },
      {
        id:           'minimo_viable',
        label:        'Producción mínima, solo para las facturas',
        descripcion:  'Solo lo necesario para sobrevivir. Esto termina en cuanto puedas.',
        lineaDelta:   10,
        statDeltas:   { estabilidad: -0.3, emocional: -0.2 },
        ingresosDelta: 400,
        consecuencia: 'El dinero llega. También la culpa. Y la deuda contigo mismo que crece cada noche.',
      },
      {
        id:           'denunciar',
        label:        'Entregar la operación a las autoridades',
        descripcion:  'Antes de que sea demasiado tarde.',
        lineaDelta:   0,
        statDeltas:   { estabilidad: 0.4, emocional: 0.3 },
        ingresosDelta: -200,
        consecuencia: 'Las consecuencias legales son complejas. Pero puedes mirarte al espejo.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'produccion',
    nombre:      'La Producción',
    descripcion: 'Ya no es un experimento. Es un negocio. Tu nombre —aunque nadie sepa que eres tú— empieza a circular.',
    umbral:      20,
    opciones: [
      {
        id:           'expandir_red',
        label:        'Expandir la red de distribución',
        descripcion:  'Más canales, más ingresos, más control.',
        lineaDelta:   20,
        statDeltas:   { carisma: 0.2, ambicion: 0.4, emocional: -0.3, estabilidad: -0.3 },
        ingresosDelta: 2000,
        consecuencia: 'La operación escala. También el riesgo. Y las personas que dependen de ti sin saberlo.',
      },
      {
        id:           'mantener_bajo_perfil',
        label:        'Mantener perfil bajo',
        descripcion:  'Dinero suficiente. Sin llamar la atención.',
        lineaDelta:   12,
        statDeltas:   { disciplina: 0.2, estabilidad: -0.2 },
        ingresosDelta: 1200,
        consecuencia: 'El equilibrio es frágil. En este negocio, quedarse quieto también tiene un coste.',
      },
      {
        id:           'involucrar_familiar',
        label:        'Proteger la operación con un familiar',
        descripcion:  'Necesitas a alguien de confianza. Alguien que no te va a traicionar.',
        lineaDelta:   25,
        statDeltas:   { ambicion: 0.3, emocional: -0.5, estabilidad: -0.4 },
        ingresosDelta: 1500,
        consecuencia: 'Has cruzado una línea diferente. Ya no solo te arriesgas tú.',
      },
    ],
  },
  {
    id:          'escalada',
    nombre:      'La Escalada',
    descripcion: 'Hay competencia. Hay violencia en el horizonte. La persona que eras hace un año ya no reconocería este lugar.',
    umbral:      40,
    opciones: [
      {
        id:           'eliminar_competencia',
        label:        'Eliminar la competencia directamente',
        descripcion:  'No te queda otra opción. Así te dicen.',
        lineaDelta:   30,
        statDeltas:   { riesgo: 0.5, emocional: -0.6, estabilidad: -0.5 },
        ingresosDelta: 3000,
        consecuencia: 'Lo has hecho. No con tus manos, pero lo has ordenado. Ya no hay vuelta atrás.',
      },
      {
        id:           'negociar_territorio',
        label:        'Negociar un acuerdo territorial',
        descripcion:  'La violencia es ineficiente. Hay mejores caminos.',
        lineaDelta:   18,
        statDeltas:   { carisma: 0.3, ambicion: 0.3, estabilidad: -0.2 },
        ingresosDelta: 2200,
        consecuencia: 'El acuerdo dura. Por ahora. Los socios de este tipo no entienden de contratos.',
      },
      {
        id:           'intentar_salida',
        label:        'Intentar una salida limpia',
        descripcion:  'Salir antes de que todo explote.',
        lineaDelta:   5,
        statDeltas:   { estabilidad: 0.2, emocional: 0.3 },
        ingresosDelta: -1000,
        consecuencia: 'No dejan que te vayas así de fácil. La salida tiene un precio.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'punto_no_retorno',
    nombre:      'El Punto de No Retorno',
    descripcion: 'Tu familia lo sospecha. La policía tiene un hilo. El dinero ya no compensa lo que ves en el espejo cada mañana.',
    umbral:      65,
    opciones: [
      {
        id:           'doblar_apuesta',
        label:        'Doblar la apuesta: control total',
        descripcion:  'Si vas a caer, que sea siendo el número uno.',
        lineaDelta:   25,
        statDeltas:   { ambicion: 0.5, emocional: -0.8, estabilidad: -0.7, disciplina: 0.3 },
        ingresosDelta: 5000,
        consecuencia: 'Eres el que llama. El que decide. El dinero fluye. Y el reloj corre.',
        triggersFinal: true,
      },
      {
        id:           'confesion_familia',
        label:        'Confesar a tu familia la verdad',
        descripcion:  'Antes de que lo descubran por otro camino.',
        lineaDelta:   10,
        statDeltas:   { emocional: 0.4, estabilidad: 0.3, ambicion: -0.3 },
        ingresosDelta: 0,
        consecuencia: 'La conversación más difícil de tu vida. También la más honesta.',
      },
      {
        id:           'entrega_voluntaria',
        label:        'Entregarte voluntariamente',
        descripcion:  'Con un abogado, en tus propios términos.',
        lineaDelta:   0,
        statDeltas:   { estabilidad: 0.5, emocional: 0.4 },
        ingresosDelta: -3000,
        consecuencia: 'El sistema toma su curso. Pero la decisión fue tuya. Eso importa.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'final_multiple',
    nombre:      'El Final',
    descripcion: 'Todo lo que construiste. Todo lo que destruiste. Las consecuencias no esperan.',
    umbral:      80,
    opciones: [
      {
        id:           'final_legado',
        label:        'Asegurar el legado económico',
        descripcion:  'Al menos que el dinero sirva para algo.',
        lineaDelta:   10,
        statDeltas:   { ambicion: 0.3, emocional: -0.5 },
        ingresosDelta: 8000,
        consecuencia: 'El dinero llega a quienes querías proteger. Ellos nunca sabrán de dónde viene. O sí. La verdad siempre encuentra un camino.',
        triggersFinal: true,
      },
      {
        id:           'final_verdad',
        label:        'Contar toda la verdad',
        descripcion:  'A la familia, a las autoridades, a todos.',
        lineaDelta:   0,
        statDeltas:   { emocional: 0.6, estabilidad: 0.5, ambicion: -0.5 },
        ingresosDelta: -5000,
        consecuencia: 'La historia completa. Sin omisiones. El juicio será público, pero tendrás algo que muy pocos conservan: la posibilidad de morir en paz.',
        triggersFinal: true,
      },
      {
        id:           'final_huir',
        label:        'Desaparecer con una identidad nueva',
        descripcion:  'Existe un camino. Cuesta todo.',
        lineaDelta:   20,
        statDeltas:   { riesgo: 0.5, emocional: -0.7, estabilidad: -0.8 },
        ingresosDelta: 2000,
        consecuencia: 'Técnicamente vivo. Pero la persona que fuiste ha muerto. Todo lo que amaste, también.',
        triggersFinal: true,
      },
    ],
  },
];

// ─── Unlock condition ─────────────────────────────────────────────────────────

const QUALIFYING_PROFESSIONS = [
  'científico', 'cientifico', 'médico', 'medico', 'farmacéutico', 'farmaceutico',
  'químico', 'quimico', 'biólogo', 'biologo', 'investigador', 'doctor',
  'farmacología', 'farmacologia',
];

const NIVEL_RANK: Record<string, number> = {
  junior: 1, mid: 2, senior: 3, director: 4, ejecutivo: 5, independiente: 3,
};

export interface BBUnlockConditions {
  professionQualifies: boolean;
  nivelSuficiente:     boolean;
  hasTerminalDisease:  boolean;
  hasFinancialPressure: boolean;
  ambicionSuficiente:  boolean;
  allMet:              boolean;
}

export function evaluateBBUnlock(
  character: Character,
  career:    Career,
  economy:   Economy,
  terminalDiseaseActive: boolean,
  familiasDependientes:  boolean,
): BBUnlockConditions {
  const profLower = career.profesion.toLowerCase();
  const professionQualifies = QUALIFYING_PROFESSIONS.some(p => profLower.includes(p));
  const nivelSuficiente     = (NIVEL_RANK[career.nivel] ?? 0) >= 3;
  const hasTerminalDisease  = terminalDiseaseActive;
  const hasFinancialPressure = economy.deudaTotal > 0 || familiasDependientes;
  const ambicionSuficiente  = character.stats.ambicion > 6;

  return {
    professionQualifies,
    nivelSuficiente,
    hasTerminalDisease,
    hasFinancialPressure,
    ambicionSuficiente,
    allMet: professionQualifies && nivelSuficiente && hasTerminalDisease &&
            hasFinancialPressure && ambicionSuficiente,
  };
}

/** Returns the current phase data object */
export function getCurrentPhase(bbState: BBState): BBPhaseData {
  return BB_PHASES.find(p => p.id === bbState.phase) ?? BB_PHASES[0];
}

/** Returns the next phase based on lineaCruzada, or null if final */
export function resolveNextPhase(lineaCruzada: number): BBPhase {
  const phases = [...BB_PHASES].reverse();
  for (const phase of phases) {
    if (lineaCruzada >= phase.umbral) return phase.id;
  }
  return 'contacto';
}
