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

export const PATH_EVENTS: GameEventTemplate[] = [
  oportunidadCientifica,
]
