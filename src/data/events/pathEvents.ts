import type { GameEventTemplate } from '../../types/game.types'

// ═══ EVENTO — OPORTUNIDAD CIENTÍFICA (edad 24–30) ══════════════════════════════
// Science-path exclusive. Fires when the character has proven themselves in a
// technical career and a senior researcher offers them a seat on a major project.
const oportunidadCientifica: GameEventTemplate = {
  id:              'oportunidad_cientifica',
  triggerAge:      [24, 30],
  weight:          1,
  requireAllFlags: ['direccion_ciencias', 'implicacion_laboral_alta'],
  requireStats:    { logica: { min: 7 } },
  requireCareer:   { nivel: 2 },
  blockIfFlags:    ['oportunidad_cientifica_fired'],

  context: (state) => {
    const name = state.character.name
    return `Un investigador senior contacta a ${name}. Hay un proyecto en marcha — financiación asegurada, equipo pequeño, resultados en dos años. Quieren a alguien como ${name}. La oferta tiene fecha de caducidad.`
  },

  options: [
    {
      id:   'aceptar_sacrificando_estabilidad',
      text: (_s) => 'Aceptas. El proyecto importa más que la comodidad.',
      immediate: {
        narrative: (s) => `${s.character.name} firma. El contrato actual queda atrás. Lo que viene no tiene garantías, pero tiene peso real. Esa noche no duerme bien — no por miedo, sino porque sabe que algo ha cambiado.`,
        statDeltas: { ambicion: 0.4, estabilidad: -0.3 },
        flags:      ['oportunidad_cientifica_aceptada', 'oportunidad_cientifica_fired'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después, el proyecto tiene resultados. El nombre de ${s.character.name} aparece en el paper. No es fama — es registro permanente.`,
          statDeltas: { ambicion: 0.2, logica: 0.15 },
          flags:      ['contribucion_cientifica_publicada'],
        },
      ],
      memory: {
        id:   'memory_scientific_leap',
        text: (_s) => 'El día que dijiste sí sabiendo que ibas a perder algo. Y lo perdiste. Y valió.',
      },
      epitaphSeed: 'eligió el riesgo real sobre la comodidad documentada',
    },
    {
      id:   'negociar_condiciones',
      text: (_s) => 'Negocias. Puedes aportar más si las condiciones son justas.',
      immediate: {
        narrative: (s) => `${s.character.name} no dice sí ni no. Propone condiciones — tiempo parcial los primeros tres meses, cláusula de salida, autoría compartida desde el inicio. El investigador tarda dos días en responder. Acepta.`,
        statDeltas: { carisma: 0.2, ambicion: 0.2 },
        flags:      ['oportunidad_cientifica_negociada', 'oportunidad_cientifica_fired'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año dentro del proyecto, las condiciones que ${s.character.name} negoció resultan ser exactamente lo que necesitaba. Otros miembros del equipo lo notan.`,
          statDeltas: { carisma: 0.15, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_scientific_negotiation',
        text: (_s) => 'La negociación que no debías ganar y ganaste. Aprendiste que pedir condiciones no es arrogancia.',
      },
      epitaphSeed: 'supo que el valor de una oportunidad también depende de los términos',
    },
    {
      id:   'declinar_por_seguridad',
      text: (_s) => 'Declinas. Lo que tienes ahora tiene un valor que no puedes ignorar.',
      immediate: {
        narrative: (s) => `${s.character.name} escribe un correo breve. Agradece la consideración. Lo que tiene — el contrato, la rutina, la certeza — pesa más que lo que podría ser. El investigador responde con una sola línea: "Entendido. Si cambias de opinión, ya sabes."`,
        statDeltas: { estabilidad: 0.3 },
        flags:      ['oportunidad_cientifica_rechazada', 'oportunidad_cientifica_fired'],
      },
      delayed: [
        {
          triggerAge: 35,
          narrative: (s) => {
            return `Con 35 años, ${s.character.name} busca en Google el proyecto que rechazó. Está publicado. Los autores son desconocidos y conocidos a la vez. No es arrepentimiento — es información.`
          },
          statDeltas: { ambicion: 0.1 },
        },
      ],
      memory: {
        id:   'memory_scientific_decline',
        text: (_s) => 'La oportunidad que dejaste pasar. Tomaste la decisión correcta para entonces. Lo que no sabes es si también lo fue para siempre.',
      },
      epitaphSeed: 'eligió la certeza cuando el riesgo era real, no imaginado',
    },
  ],
}

// ═══ EVENTO — CONTACTO CRIMINAL (edad 18–28) ══════════════════════════════════
// High-risk + low-economy characters encounter an offer of easy money.
// Option B spawns a follow-up event (contacto_criminal_decision) via flag.
const contactoCriminal: GameEventTemplate = {
  id:              'contacto_criminal_evento',
  triggerAge:      [18, 28],
  weight:          1,
  requireStats:    { riesgo: { min: 8 } },
  requireEconomy:  { nivel: 'bajo' },
  blockIfFlags:    ['contacto_criminal', 'contacto_criminal_rechazado'],

  context: (state) => {
    const name = state.character.name
    return `Alguien del entorno de ${name} le habla de dinero fácil. No da detalles — solo dice que es seguro, que otros lo hacen, que la recompensa es inmediata. ${name} sabe que no está hablando de un trabajo normal.`
  },

  options: [
    {
      id:   'aceptar',
      text: (_s) => 'Aceptas. Necesitas el dinero y el riesgo no te asusta.',
      immediate: {
        narrative: (s) => `${s.character.name} dice que sí. El dinero llega en dos días. No hay contrato, no hay nombre, no hay rastro. Solo el billete y la sensación de que algo ha cruzado una línea que no tiene vuelta atrás.`,
        statDeltas:   { estabilidad: -0.2 },
        economyDelta: 500,
        flags:        ['contacto_criminal'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después, ${s.character.name} sigue sabiendo lo que hizo. No hay consecuencias legales. Pero hay una forma de mirarse al espejo que cambió.`,
          statDeltas: { emocional: 0.15, estabilidad: -0.1 },
        },
      ],
      memory: {
        id:   'memory_criminal_yes',
        text: (_s) => 'El día que dijiste sí sin saber del todo qué estabas diciendo. El dinero llegó. El resto también.',
      },
      epitaphSeed: 'cruzó una línea una vez y supo exactamente cuándo fue',
    },
    {
      id:   'preguntar_mas',
      text: (_s) => 'Preguntas más antes de decidir. Necesitas saber en qué te metes.',
      immediate: {
        narrative: (s) => `${s.character.name} no dice ni sí ni no. Hace preguntas. La persona del otro lado responde con vaguedades y una fecha límite. ${s.character.name} pide tiempo. Se lo dan. Por ahora.`,
        statDeltas: { riesgo: 0.1 },
        flags:      ['contacto_criminal_investigando'],
      },
      delayed: [
        {
          // 0.5 resolves to triggerAge = currentAge + 0.5; fires at next integer age
          triggerYearsAfter: 0.5,
          narrative: (s) => `La persona vuelve con más información. Lo que ${s.character.name} descubre cambia el peso de la decisión.`,
          unlockEvent: 'contacto_criminal_decision',
        },
      ],
      memory: {
        id:   'memory_criminal_wait',
        text: (_s) => 'Cuando pediste tiempo antes de decidir. Sabías que era importante. No sabías cuánto.',
      },
      epitaphSeed: 'no tomó decisiones importantes sin información',
    },
    {
      id:   'rechazar',
      text: (_s) => 'Rechazas. No es el camino.',
      immediate: {
        narrative: (s) => `${s.character.name} dice que no. Sin explicaciones largas. La persona no insiste demasiado. ${s.character.name} se aleja sabiendo que el dinero habría venido bien — y que eso hace más difícil la respuesta, no más fácil.`,
        statDeltas: { estabilidad: 0.2 },
        flags:      ['contacto_criminal_rechazado'],
      },
      delayed: [],
      memory: {
        id:   'memory_criminal_no',
        text: (_s) => 'El día que dijiste no cuando el dinero habría cambiado cosas reales. Costó más de lo que esperabas.',
      },
      epitaphSeed: 'eligió no cuando habría sido más fácil decir sí',
    },
  ],
}

// ═══ EVENTO — DECISIÓN CRIMINAL (seguimiento) ═════════════════════════════════
// Fires only if the character asked for more information in contacto_criminal.
// Presents the full picture and forces a final choice.
const contactoCriminalDecision: GameEventTemplate = {
  id:              'contacto_criminal_decision',
  triggerAge:      [18, 30],
  triggerFlags:    ['unlock_contacto_criminal_decision'],
  blockIfFlags:    ['contacto_criminal', 'contacto_criminal_rechazado'],
  weight:          1,

  context: (state) => {
    const name = state.character.name
    return `${name} sabe ahora en qué consiste. No es violento, pero es ilegal. Dinero que entra sin rastro a cambio de mover algo, guardar algo, o mirar hacia otro lado en el momento justo. La persona espera respuesta.`
  },

  options: [
    {
      id:   'aceptar_sabiendo',
      text: (_s) => 'Aceptas. Ahora sabes lo que es y lo aceptas igual.',
      immediate: {
        narrative: (s) => `${s.character.name} dice sí con los ojos abiertos. Eso lo hace diferente a otros. No fue un error de juicio. Fue una elección.`,
        statDeltas:   { estabilidad: -0.25, riesgo: 0.15 },
        economyDelta: 500,
        flags:        ['contacto_criminal'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `${s.character.name} lleva tres años sabiendo lo que hizo. No hay rastro legal. Pero el silencio tiene un peso propio.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_criminal_informed_yes',
        text: (_s) => 'La segunda vez que te lo ofrecieron. Ya sabías todo. Dijiste sí de todas formas.',
      },
      epitaphSeed: 'eligió con información completa, sin excusas de ignorancia',
    },
    {
      id:   'rechazar_sabiendo',
      text: (_s) => 'Rechazas. Saber los detalles lo hace imposible.',
      immediate: {
        narrative: (s) => `${s.character.name} dice que no. Con los detalles encima de la mesa, la respuesta es diferente. Más clara y más cara al mismo tiempo.`,
        statDeltas: { estabilidad: 0.25, emocional: 0.1 },
        flags:      ['contacto_criminal_rechazado'],
      },
      delayed: [],
      memory: {
        id:   'memory_criminal_informed_no',
        text: (_s) => 'Cuando conociste todos los detalles y dijiste no. No fue fácil. Fue correcto.',
      },
      epitaphSeed: 'rechazó lo que no podía sostener en su nombre',
    },
    {
      id:   'desaparecer',
      text: (_s) => 'Desapareces del radar. Sin respuesta, sin contacto.',
      immediate: {
        narrative: (s) => `${s.character.name} no responde. Cambia de número, cambia de rutina. La persona deja de aparecer después de dos semanas. Nadie pregunta. Nadie sigue. Esta vez.`,
        statDeltas: { estabilidad: 0.1, riesgo: -0.1 },
        flags:      ['contacto_criminal_rechazado', 'desaparecio_del_radar'],
      },
      delayed: [],
      memory: {
        id:   'memory_criminal_vanish',
        text: (_s) => 'Las semanas que desapareciste. Sin explicación, sin confrontación. Funcionó. No siempre funciona.',
      },
      epitaphSeed: 'aprendió que a veces la respuesta es no aparecer',
    },
  ],
}

export const PATH_EVENTS: GameEventTemplate[] = [
  oportunidadCientifica,
  contactoCriminal,
  contactoCriminalDecision,
]
