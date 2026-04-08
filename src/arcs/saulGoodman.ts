import type { Character } from '../types';
import type { Career, Economy } from '../store/gameStore';

// ─── Phases ───────────────────────────────────────────────────────────────────

export type SGPhase =
  | 'caso_comprometido'
  | 'metodos_cuestionables'
  | 'red_criminal'
  | 'bufete_sombra'
  | 'blanqueo_carteles'
  | 'final_multiple';

// ─── Arc state ────────────────────────────────────────────────────────────────

export interface SGState {
  unlocked:         boolean;
  active:           boolean;
  phase:            SGPhase;
  precioVictoria:   number; // 0-100
}

export const SG_STATE_DEFAULT: SGState = {
  unlocked:       false,
  active:         false,
  phase:          'caso_comprometido',
  precioVictoria: 0,
};

// ─── Phase data ───────────────────────────────────────────────────────────────

export interface SGPhaseData {
  id:           SGPhase;
  nombre:       string;
  descripcion:  string;
  /** Minimum precioVictoria to enter this phase */
  umbral:       number;
  opciones:     SGOption[];
}

export interface SGOption {
  id:             string;
  label:          string;
  descripcion:    string;
  precioDelta:    number;
  statDeltas:     Partial<{ [K in keyof import('../types').CharacterStats]: number }>;
  ingresosDelta:  number;
  consecuencia:   string;
  triggersFinal?: boolean;
  isExit?:        boolean;
}

export const SG_PHASES: SGPhaseData[] = [
  {
    id:          'caso_comprometido',
    nombre:      'El Caso Comprometido',
    descripcion: 'Un cliente con antecedentes. Dinero real sobre la mesa. El caso es sucio pero la ley, bien manejada, puede hacerlo desaparecer. Solo esta vez.',
    umbral:      0,
    opciones: [
      {
        id:           'aceptar_caso',
        label:        'Aceptar el caso y defenderlo a fondo',
        descripcion:  'Todos merecen defensa. Eso es lo que te dices.',
        precioDelta:  10,
        statDeltas:   { ambicion: 0.3, carisma: 0.2, estabilidad: -0.1 },
        ingresosDelta: 1500,
        consecuencia: 'Ganas el caso. El cliente queda libre. Y tú tienes un nuevo número en el teléfono que no debería estar ahí.',
      },
      {
        id:           'rechazar_caso',
        label:        'Rechazar: este cliente no encaja con tu práctica',
        descripcion:  'Hay líneas que es mejor no cruzar desde el principio.',
        precioDelta:  2,
        statDeltas:   { estabilidad: 0.2, emocional: 0.1 },
        ingresosDelta: 0,
        consecuencia: 'Cuelgas el teléfono. Otros abogados menos escrupulosos lo tomarán. Tú dormirás mejor.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'metodos_cuestionables',
    nombre:      'Los Métodos Cuestionables',
    descripcion: 'La red crece. Los métodos que funcionan en este mundo no siempre están en los libros de Derecho. Testigos que cambian su versión. Pruebas que se extravían.',
    umbral:      10,
    opciones: [
      {
        id:           'manipular_testigo',
        label:        'Presionar a un testigo clave',
        descripcion:  'No amenazas. Solo… conversación persuasiva.',
        precioDelta:  18,
        statDeltas:   { carisma: 0.4, logica: 0.2, emocional: -0.3, estabilidad: -0.2 },
        ingresosDelta: 2000,
        consecuencia: 'El testigo retira su declaración. Tu cliente brinda. El fiscal tiene una teoría pero no puede probar nada. Aún.',
      },
      {
        id:           'tecnicismo_legal',
        label:        'Explotar cada tecnicismo procesal disponible',
        descripcion:  'Dentro de la ley, pero en su límite más oscuro.',
        precioDelta:  12,
        statDeltas:   { logica: 0.4, disciplina: 0.2, estabilidad: -0.1 },
        ingresosDelta: 1200,
        consecuencia: 'El caso se cae por procedimiento. Nadie puede acusarte de nada ilegal. Pero el juez te mira diferente ahora.',
      },
      {
        id:           'denunciar_irregularidad',
        label:        'Reportar la irregularidad al Colegio de Abogados',
        descripcion:  'Antes de que seas tú quien necesite un abogado.',
        precioDelta:  0,
        statDeltas:   { estabilidad: 0.3, emocional: 0.2, ambicion: -0.2 },
        ingresosDelta: -500,
        consecuencia: 'La investigación se abre. Pierdes el cliente pero mantienes el carnet. Por ahora, eso es suficiente.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'red_criminal',
    nombre:      'La Red Criminal',
    descripcion: 'Ya no son clientes aislados. Es una red. Y tú eres su abogado de cabecera. Dinero, protección, contactos. Y una deuda que nunca termina de saldarse.',
    umbral:      25,
    opciones: [
      {
        id:           'abogado_retenedor',
        label:        'Convertirte en abogado retenedor de la organización',
        descripcion:  'Pago mensual fijo. A cambio de disponibilidad total.',
        precioDelta:  22,
        statDeltas:   { ambicion: 0.4, carisma: 0.3, emocional: -0.4, estabilidad: -0.3 },
        ingresosDelta: 5000,
        consecuencia: 'El dinero es obsceno. La seguridad también. Pero ahora eres parte del engranaje, no solo un servicio externo.',
      },
      {
        id:           'casos_selectivos',
        label:        'Solo casos selectivos: los que puedes justificar',
        descripcion:  'Mantener cierta plausible denegación.',
        precioDelta:  14,
        statDeltas:   { disciplina: 0.2, logica: 0.3, estabilidad: -0.2 },
        ingresosDelta: 2500,
        consecuencia: 'El equilibrio es inestable. En este mundo, la neutralidad no existe para siempre.',
      },
      {
        id:           'colaborar_fiscalia',
        label:        'Contactar en secreto con la fiscalía',
        descripcion:  'Convertirte en confidente. A cambio de inmunidad.',
        precioDelta:  5,
        statDeltas:   { estabilidad: 0.3, riesgo: 0.4, emocional: -0.3 },
        ingresosDelta: -2000,
        consecuencia: 'Juegas a dos bandas. Si se descubre, no habrá abogado en el mundo que te salve.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'bufete_sombra',
    nombre:      'El Bufete en la Sombra',
    descripcion: 'Tu despacho oficial es la fachada. El negocio real ocurre en otras direcciones, otros nombres, otras cuentas. Has construido algo que admiras y odias a partes iguales.',
    umbral:      45,
    opciones: [
      {
        id:           'estructuras_offshore',
        label:        'Crear estructuras legales offshore para la organización',
        descripcion:  'Sociedades pantalla, jurisdicciones opacas. Arte puro.',
        precioDelta:  25,
        statDeltas:   { logica: 0.5, ambicion: 0.4, emocional: -0.5, estabilidad: -0.4 },
        ingresosDelta: 8000,
        consecuencia: 'La arquitectura legal es impecable. Técnicamente, nada es ilegal en ningún país por separado. En conjunto, es otra historia.',
      },
      {
        id:           'limite_bufete',
        label:        'Poner un límite: solo asesoría, sin ejecución directa',
        descripcion:  'El abogado da consejo. Lo que hagan con él no es tu responsabilidad.',
        precioDelta:  15,
        statDeltas:   { disciplina: 0.3, carisma: 0.2, estabilidad: -0.2 },
        ingresosDelta: 4000,
        consecuencia: 'La distinción que te inventas es válida para tu conciencia. Los tribunales no suelen verlo así.',
      },
      {
        id:           'intentar_salida',
        label:        'Intentar vender el bufete y desaparecer',
        descripcion:  'Si te vas ahora, quizás aún sea posible.',
        precioDelta:  8,
        statDeltas:   { estabilidad: 0.2, emocional: 0.3, riesgo: 0.3 },
        ingresosDelta: -3000,
        consecuencia: 'La salida no es tan limpia como esperabas. Conoces demasiado para que te dejen ir fácil.',
        isExit:       true,
      },
    ],
  },
  {
    id:          'blanqueo_carteles',
    nombre:      'Blanqueo y Cárteles',
    descripcion: 'El dinero fluye a través de ti. Millones que cambian de forma con cada firma tuya. Has olvidado cuándo fue la última vez que hiciste algo legítimo.',
    umbral:      65,
    opciones: [
      {
        id:           'arquitecto_blanqueo',
        label:        'Ser el arquitecto del sistema de blanqueo',
        descripcion:  'Lo que otros llaman delito, tú lo llamas ingeniería financiera.',
        precioDelta:  25,
        statDeltas:   { ambicion: 0.5, logica: 0.4, emocional: -0.7, estabilidad: -0.6 },
        ingresosDelta: 15000,
        consecuencia: 'Eres indispensable. Eso te protege. Y te condena.',
        triggersFinal: true,
      },
      {
        id:           'confesion_controlada',
        label:        'Negociar una entrega controlada con la DEA',
        descripcion:  'Con condiciones, con documentación, con un abogado propio.',
        precioDelta:  10,
        statDeltas:   { emocional: 0.4, estabilidad: 0.3, ambicion: -0.4 },
        ingresosDelta: -8000,
        consecuencia: 'Las negociaciones son largas. Pero tienes lo que ellos quieren. Y eso vale algo.',
      },
      {
        id:           'entrega_espontanea',
        label:        'Entregarte sin condiciones',
        descripcion:  'El único movimiento que nadie espera.',
        precioDelta:  0,
        statDeltas:   { estabilidad: 0.5, emocional: 0.4 },
        ingresosDelta: -10000,
        consecuencia: 'La sentencia será dura. Pero la decisión fue tuya. En este mundo, eso es un lujo.',
        isExit:       true,
        triggersFinal: true,
      },
    ],
  },
  {
    id:          'final_multiple',
    nombre:      'El Final',
    descripcion: 'Todo lo que construiste sobre el filo de la ley. Todo lo que destruiste dentro de ella. Las cuentas se saldan.',
    umbral:      85,
    opciones: [
      {
        id:           'final_huida',
        label:        'Desaparecer con una identidad nueva',
        descripcion:  'Existe un protocolo para esto. Lo has preparado desde hace años.',
        precioDelta:  20,
        statDeltas:   { riesgo: 0.5, emocional: -0.7, estabilidad: -0.8 },
        ingresosDelta: 5000,
        consecuencia: 'Técnicamente vivo. Manejando un negocio de ropa en algún lugar sin extradición. La persona que fuiste ha muerto. Nadie la llora públicamente.',
        triggersFinal: true,
      },
      {
        id:           'final_carcel',
        label:        'Enfrentar el juicio y aceptar la condena',
        descripcion:  'Con la cabeza alta. Un último gesto de quien una vez creyó en la ley.',
        precioDelta:  5,
        statDeltas:   { emocional: 0.5, estabilidad: 0.4, ambicion: -0.6 },
        ingresosDelta: -15000,
        consecuencia: 'La sala llena. La sentencia, larga. Pero el discurso final que das es lo más honesto que has dicho en años. Algunos lo recuerdan.',
        triggersFinal: true,
      },
      {
        id:           'final_leyenda',
        label:        'Convertirte en leyenda: publicar tus memorias desde el exilio',
        descripcion:  'Si de todas formas el mundo ya sabe quién eres, que al menos lo cuente bien.',
        precioDelta:  15,
        statDeltas:   { carisma: 0.6, ambicion: 0.4, emocional: -0.3 },
        ingresosDelta: 10000,
        consecuencia: 'El libro se vende en 40 países. Tu nombre es caso de estudio en facultades de derecho como advertencia. O como inspiración. Depende de quien lo lea.',
        triggersFinal: true,
      },
    ],
  },
];

// ─── Unlock condition ─────────────────────────────────────────────────────────

const NIVEL_RANK: Record<string, number> = {
  junior: 1, mid: 2, senior: 3, director: 4, ejecutivo: 5, independiente: 3,
};

export interface SGUnlockConditions {
  esAbogado:             boolean;
  nivelSuficiente:       boolean;
  contactoCriminal:      boolean;
  ambicionSuficiente:    boolean;
  clienteAntecedentes:   boolean;
  allMet:                boolean;
}

export function evaluateSGUnlock(
  character: Character,
  career:    Career,
  _economy:  Economy,
): SGUnlockConditions {
  const profLower = career.profesion.toLowerCase();
  const esAbogado = profLower.includes('abogad') || profLower.includes('derecho') || profLower.includes('letrado');
  const nivelSuficiente = (NIVEL_RANK[career.nivel] ?? 0) >= 3;

  const flags = character.flags ?? {};
  const contactoCriminal    = !!(flags['contacto_criminal']);
  const clienteAntecedentes = !!(flags['cliente_antecedentes']);
  const ambicionSuficiente  = character.stats.ambicion > 7;

  return {
    esAbogado,
    nivelSuficiente,
    contactoCriminal,
    ambicionSuficiente,
    clienteAntecedentes,
    allMet: esAbogado && nivelSuficiente && contactoCriminal && ambicionSuficiente && clienteAntecedentes,
  };
}

/** Returns the current phase data object */
export function getSGCurrentPhase(sgState: SGState): SGPhaseData {
  return SG_PHASES.find(p => p.id === sgState.phase) ?? SG_PHASES[0];
}

/** Returns the next phase based on precioVictoria */
export function resolveSGNextPhase(precioVictoria: number): SGPhase {
  const phases = [...SG_PHASES].reverse();
  for (const phase of phases) {
    if (precioVictoria >= phase.umbral) return phase.id;
  }
  return 'caso_comprometido';
}
