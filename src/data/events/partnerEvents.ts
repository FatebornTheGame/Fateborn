import type { GameEventTemplate } from '../../types/game.types'
import { createPartner, partnerName } from '../../systems/partnerSystem'

// ═══ EVENTO P1: EL ENCUENTRO VITAL (edad 20-28) ═══════════════════════════════
// The first serious romantic encounter — creates the partner NPC.
// Respects sexual orientation when picking partner gender.
const encuentroVital: GameEventTemplate = {
  id:           'encuentro_vital',
  triggerAge:   [20, 28],
  blockIfFlags: ['pareja_npc_creada', 'independencia_elegida_adulto'],
  weight:       0.85,

  context: (s) => {
    const nombre = s.character.name
    const esSolitario = s.stats.estabilidad > 7
    if (esSolitario) {
      return `${nombre} no suele buscar estas cosas. Pero hay alguien — conocido de hace tiempo o recién llegado — que ocupa un espacio diferente al del resto. No es algo que se decida. Es algo que se nota.`
    }
    return `Ha habido personas antes. Pero esta es diferente — aunque todavía ${nombre} no sabe bien en qué. Hay una conversación que se alarga sin que ninguno de los dos lo fuerce.`
  },

  options: [
    {
      id:   'empiezo_la_relacion',
      text: (_s) => 'Lo que hay entre vosotros merece un nombre. Le das ese paso.',
      immediate: {
        narrative: (s) => {
          const partner = createPartner(s)
          return `${s.character.name} lo dice o lo hace — la acción importa poco. ${partner.name} lo recibe. Y así empieza algo que todavía no sabe que va a durar.`
        },
        statDeltas:     { emocional: 0.5, carisma: 0.2, estabilidad: 0.1 },
        flags:          ['pareja_npc_creada', 'pareja_conocida'],
        friendResolver: (s) => createPartner(s),
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Dos años. ${nombre} ya tiene el peso de alguien que ha estado en los momentos que importan. ${s.character.name} lo nota en cómo describe su vida cuando alguien nuevo le pregunta.`
          },
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_encuentro_pareja',
        text: (s) => `El momento en que ${partnerName(s)} dejó de ser una persona más y empezó a ser la persona.`,
      },
    },

    {
      id:   'con_calma',
      text: (_s) => 'Hay algo, pero lo dejas crecer sin forzarlo.',
      immediate: {
        narrative: (s) => {
          const partner = createPartner(s)
          return `${s.character.name} no lo llama nada todavía. Pero sí le escribe. Sí queda. Sí espera sus mensajes. ${partner.name} parece estar haciendo lo mismo. Hay cosas que no necesitan nombrarse para existir.`
        },
        statDeltas:     { emocional: 0.3, estabilidad: 0.2 },
        flags:          ['pareja_npc_creada', 'pareja_conocida', 'pareja_en_pausa'],
        friendResolver: (s) => ({ ...createPartner(s), relationship: 55 }),
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Tres años de ir despacio tienen su resultado: ${nombre} y ${s.character.name} se conocen de verdad. Sin acelerar nada, sin perder nada.`
          },
          statDeltas: { emocional: 0.3, estabilidad: 0.15 },
          flags:      ['pareja_conocida_profunda'],
        },
      ],
    },

    {
      id:   'no_lo_persigo',
      text: (_s) => 'No es el momento. O no es la persona. Lo dejas ir.',
      immediate: {
        narrative: (s) => `${s.character.name} elige no seguirlo. No porque no haya nada — porque en este momento, otras cosas tienen prioridad. O porque hay algo en ese tipo de vínculo que todavía no sabe cómo manejar. Ambas cosas son válidas.`,
        statDeltas: { estabilidad: 0.3, ambicion: 0.2, emocional: -0.1 },
        flags:      ['eleccion_soledad_joven'],
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => `Cinco años después, ${s.character.name} piensa en eso a veces. No con arrepentimiento — con la curiosidad de quien se pregunta por los caminos que no tomó.`,
          statDeltas: { emocional: 0.1 },
        },
      ],
    },
  ],
}

// ═══ EVENTO P2: LA DECISIÓN DE COMPARTIR LA VIDA (edad 25-34) ════════════════
// The moment the relationship demands a definition — commit or separate paths.
const decisionVidaCompartida: GameEventTemplate = {
  id:            'decision_vida_compartida',
  triggerAge:    [25, 34],
  requireAnyFlags: ['pareja_conocida', 'pareja_conocida_profunda'],
  blockIfFlags:  ['decision_pareja_adulta', 'ruptura_primera_pareja'],
  weight:        0.9,

  context: (s) => {
    const nombre = partnerName(s)
    const enPausa = s.flags.includes('pareja_en_pausa')
    if (enPausa) {
      return `La relación con ${nombre} lleva tiempo en un espacio indefinido que los dos saben que no puede durar. La pregunta que ninguno ha dicho en voz alta se hace cada vez más presente: ¿esto va a algún sitio?`
    }
    return `${nombre} y ${s.character.name} llevan tiempo en esto. Suficiente para que la pregunta ya no pueda ignorarse: ¿qué es esto que estáis construyendo, y hacia dónde?`
  },

  options: [
    {
      id:   'construir_juntos',
      text: (s) => `Construyes una vida con ${partnerName(s)}. No por defecto — por decisión.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} lo decide. No con declaraciones — con gestos. Un piso que se comparte, planes que empiezan a hacerse en plural. ${nombre} lo recibe con una mezcla de alivio y seriedad que ${s.character.name} no esperaba. Ambos saben lo que acaban de hacer.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.4, carisma: 0.1 },
        flags:      ['decision_pareja_adulta', 'construyendo_con_pareja', 'convivencia_juntos'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Cuatro años después, la vida con ${nombre} tiene textura. Lo fácil ya pasó. Quedan las conversaciones a las once de la noche, los silencios cómodos, las decisiones que se toman sin darse cuenta de que son importantes.`
          },
          statDeltas: { emocional: 0.2, estabilidad: 0.2 },
        },
        {
          triggerYearsAfter: 9,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `A los ${s.ageYears}, la relación con ${nombre} ya no necesita justificarse. Es parte del paisaje de quien es ${s.character.name}.`
          },
          statDeltas: { emocional: 0.15, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_decision_pareja',
        text: (s) => `El momento en que la relación con ${partnerName(s)} pasó de ser una situación a ser una decisión. La diferencia importa.`,
      },
      epitaphSeed: 'eligió compartir la vida con alguien sabiendo exactamente lo que eso implicaba',
    },

    {
      id:   'seguir_caminos_propios',
      text: (s) => `Lo que hay con ${partnerName(s)} es real. Pero vuestros caminos son distintos.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} lo dice con cuidado. ${nombre} no lo discute — en algún lugar lo sabía también. Hay rupturas que duelen pero que no sorprenden. Esta es de esas. Hay algo que los dos reconocen como correcto aunque duela.`
        },
        statDeltas: { estabilidad: 0.25, emocional: -0.3, riesgo: 0.15 },
        flags:      ['ruptura_primera_pareja'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Tres años después, ${nombre} y ${s.character.name} no se hablan mucho. Pero hay algo — una deuda de gratitud, quizás — que ninguno de los dos ha olvidado.`
          },
          statDeltas: { emocional: 0.15 },
        },
      ],
    },

    {
      id:   'vivir_sin_pareja',
      text: (_s) => 'Eliges la independencia con claridad. No como renuncia — como elección.',
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} lo ha pensado de verdad. Y la respuesta no es ${nombre} — no ahora, no así. La independencia no es lo que queda cuando no hay nadie. Es una forma de vida. Una que ${s.character.name} empieza a reconocer como propia.`
        },
        statDeltas: { estabilidad: 0.4, creatividad: 0.2, ambicion: 0.15, emocional: -0.1 },
        flags:      ['decision_pareja_adulta', 'independencia_elegida_adulto'],
      },
      delayed: [
        {
          triggerYearsAfter: 6,
          narrative: (s) => `A los ${s.ageYears}, la elección de ${s.character.name} de vivir sin pareja permanente tiene más sentido que nunca — para él. Los demás siguen sin entenderla del todo. Eso ya no le importa.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.1 },
        },
      ],
      epitaphSeed: 'vivió su independencia como una forma de vida, no como una ausencia',
    },
  ],
}

// ═══ EVENTO P3: LA GRIETA EN LA ESTRUCTURA (edad 33-47) ═══════════════════════
// The deep test of the relationship. Not the honeymoon phase — the real thing.
const grietaEstructura: GameEventTemplate = {
  id:            'grieta_en_la_estructura',
  triggerAge:    [33, 47],
  requireAnyFlags: ['construyendo_con_pareja'],
  blockIfFlags:  ['crisis_pareja_resuelta'],
  weight:        0.85,

  context: (s) => {
    const nombre = partnerName(s)
    const anos   = s.ageYears - (s.friends.find(f => f.role === 'romantic')?.ageAtMeeting ?? (s.ageYears - 6))
    return `${nombre} y ${s.character.name} llevan juntos ${anos > 2 ? `${anos} años` : 'un tiempo'}. Suficiente para que las grietas que no existían al principio hayan encontrado su forma. No hay un momento dramático — es una acumulación. Un día ${s.character.name} se da cuenta de que lleva tiempo sin decirle algo importante.`
  },

  options: [
    {
      id:   'lucho_por_esto',
      text: (s) => `Lo que tienes con ${partnerName(s)} vale más que lo que está pasando. Lo peleas.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} lo dice. Todo lo que llevaba tiempo sin decir. ${nombre} también. Hay conversaciones que duran horas y que dejan agotamiento y claridad en el mismo paquete. No se resuelve en un día. Pero se empieza.`
        },
        statDeltas: { emocional: 0.6, carisma: 0.3, estabilidad: 0.2, disciplina: -0.1 },
        flags:      ['crisis_pareja_resuelta', 'pareja_mas_fuerte'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Tres años después de aquella crisis, la relación con ${nombre} tiene una solidez diferente. No la de lo que nunca se ha roto — la de lo que se rompió y se decidió reconstruir.`
          },
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
          flags:      ['pareja_consolidada_tras_crisis'],
        },
      ],
      memory: {
        id:   'memory_pelea_pareja',
        text: (s) => `La crisis con ${partnerName(s)} que casi acaba con todo. Y el momento en que decidiste que no.`,
      },
      epitaphSeed: 'cuando la relación se rompió, eligió coger los pedazos y volver a construir',
    },

    {
      id:   'dejamos_de_hablar',
      text: (_s) => 'Nadie dice nada. La distancia se instala sola.',
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} no abre la conversación. ${nombre} tampoco. Hay silencios que se normalizan. Rutinas que reemplazan a las conversaciones reales. No es una ruptura — es algo más gradual y, en cierto modo, más difícil de nombrar.`
        },
        statDeltas: { estabilidad: -0.3, emocional: -0.4, disciplina: 0.2 },
        flags:      ['crisis_pareja_resuelta', 'crisis_pareja_difícil', 'pareja_en_distancia'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Cuatro años después, ${nombre} y ${s.character.name} conviven en una especie de acuerdo tácito. Hay afecto — pero hay también algo que ninguno de los dos se atreve a tocar.`
          },
          statDeltas: { emocional: -0.2, estabilidad: -0.1 },
        },
      ],
    },

    {
      id:   'separacion_honesta',
      text: (s) => `Esto ha terminado. Lo dices con honestidad a ${partnerName(s)}.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} lo dice con claridad. No con crueldad — con honestidad. ${nombre} llora, o no llora, pero escucha. Hay algo que se cierra, y en el momento en que se cierra, ${s.character.name} siente una mezcla de alivio y pérdida que no se parece a nada que haya sentido antes.`
        },
        statDeltas:  { riesgo: 0.3, emocional: -0.5, estabilidad: -0.3 },
        flags:       ['crisis_pareja_resuelta', 'ruptura_madura'],
        removeFlags: ['construyendo_con_pareja', 'convivencia_juntos'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Dos años después de dejar a ${nombre}, ${s.character.name} ha reconstruido una vida que es completamente suya. No mejor ni peor — diferente.`
          },
          statDeltas: { estabilidad: 0.25, emocional: 0.2 },
        },
      ],
      epitaphSeed: 'cuando supo que algo había terminado, tuvo el valor de decirlo',
    },
  ],
}

// ═══ EVENTO P4: REENCUENTRO O CIERRE (edad 41-55) ════════════════════════════
// For characters who drifted apart or separated — reconcile or close with peace.
const reencuentroOCierre: GameEventTemplate = {
  id:            'reencuentro_o_cierre',
  triggerAge:    [41, 55],
  requireAnyFlags: ['ruptura_madura', 'pareja_en_distancia', 'ruptura_primera_pareja'],
  blockIfFlags:  ['reconciliacion_lograda', 'pareja_cerrada', 'construyendo_con_pareja'],
  weight:        0.75,

  context: (s) => {
    const nombre = partnerName(s)
    const esDist = s.flags.includes('pareja_en_distancia')
    if (esDist) {
      return `${nombre} y ${s.character.name} llevan años en la misma casa con distintas vidas. Hay un momento — un viaje cancelado, una enfermedad, un silencio más largo que los otros — en que la pregunta ya no puede ignorarse más.`
    }
    return `${nombre} escribe. Un mensaje corto, sin demasiado. Pero ${s.character.name} sabe que los mensajes cortos sin demasiado a veces dicen todo lo importante. Hay algo que no está cerrado del todo. Y los dos lo saben.`
  },

  options: [
    {
      id:   'volvemos_a_intentarlo',
      text: (s) => `Lo que hay con ${partnerName(s)} todavía vale. Lo intentáis de nuevo — con más verdad esta vez.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${nombre} y ${s.character.name} hablan de lo que no hablaron entonces. Es incómodo y necesario al mismo tiempo. La reconciliación no borra lo que pasó — le da un lugar. Y eso es suficiente para empezar de nuevo, distinto.`
        },
        statDeltas: { emocional: 0.6, estabilidad: 0.4 },
        flags:      ['reconciliacion_lograda', 'construyendo_con_pareja'],
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Cinco años después de volver, ${nombre} y ${s.character.name} tienen una relación que ninguno de los dos cambiaría por la de antes. No es que sea perfecta. Es que es real.`
          },
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_reconciliacion',
        text: (s) => `La segunda oportunidad con ${partnerName(s)}. La que los dos sabían que necesitaban aunque ninguno lo hubiera dicho en voz alta.`,
      },
      epitaphSeed: 'tuvo el valor de volver cuando había razones suficientes para no hacerlo',
    },

    {
      id:   'cerramos_con_paz',
      text: (s) => `Lo que hubo con ${partnerName(s)} fue real. Pero es hora de cerrarlo con honestidad.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} y ${nombre} se ven. Hablan de lo que pasó con más calma de la que habrían tenido años antes. No hay acusaciones — hay reconocimiento. Lo que hubo fue real. Lo que viene es otra cosa. Se despiden sin rencor. Eso no es poca cosa.`
        },
        statDeltas: { estabilidad: 0.4, emocional: 0.2, riesgo: 0.1 },
        flags:      ['pareja_cerrada'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `A los ${s.ageYears}, ${s.character.name} piensa en esa despedida como en una de las conversaciones más honestas que ha tenido. No siempre se puede cerrar así. Fue un regalo.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
    },

    {
      id:   'prefiero_no_reabrir',
      text: (_s) => 'Algunas puertas es mejor dejarlas cerradas. Eliges seguir sin reabrirla.',
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} decide que no. No con frialdad — con lucidez. Lo que hubo con ${nombre} tiene su lugar en la memoria. No necesita actualizarse para ser válido.`
        },
        statDeltas: { estabilidad: 0.3, emocional: -0.1 },
        flags:      ['pareja_cerrada'],
      },
      delayed: [],
    },
  ],
}

// ═══ EVENTO P5: PAREJA EN LA MADUREZ (edad 53-66) ════════════════════════════
// Long-term partnership — who are you together after all this time?
const parejaEnLaMadurez: GameEventTemplate = {
  id:            'pareja_en_la_madurez',
  triggerAge:    [53, 66],
  requireAnyFlags: ['construyendo_con_pareja', 'reconciliacion_lograda'],
  blockIfFlags:  ['inventario_pareja_vivido'],
  weight:        0.8,

  context: (s) => {
    const nombre = partnerName(s)
    const tieneConsolidacion = s.flags.includes('pareja_consolidada_tras_crisis')
    if (tieneConsolidacion) {
      return `${nombre} y ${s.character.name} lo han atravesado todo — las crisis, los reencuentros, los años sin palabras y los años con demasiadas. Y siguen aquí. La pregunta no es si funciona — es qué quieren hacer con lo que les queda.`
    }
    return `Después de tantos años con ${nombre}, hay una pregunta que llega sin dramatismo: ¿quiénes son ahora el uno para el otro? No como crítica. Como curiosidad genuine y algo tardía.`
  },

  options: [
    {
      id:   'redescubrimiento',
      text: (s) => `Decidís conoceros de nuevo. No como antes — como los que sois ahora.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} propone algo que no hacían desde hacía años — hablar de lo que cada uno quiere todavía. No de los hijos, no del trabajo, no de las facturas. De ellos. ${nombre} tarda un momento en entender la pregunta. Y luego responde con una honestidad que los dos agradecen.`
        },
        statDeltas: { emocional: 0.6, carisma: 0.3, estabilidad: 0.2 },
        flags:      ['inventario_pareja_vivido', 'pareja_redescubierta'],
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Cinco años después de aquella conversación, ${nombre} y ${s.character.name} siguen teniendo versiones más frescas de esa pregunta. Resulta que hay pareja que dura porque siempre encuentran algo nuevo.`
          },
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_redescubrimiento',
        text: (s) => `La conversación con ${partnerName(s)} en la madurez que os recordó por qué seguíais juntos. No siempre se tiene esa conversación a tiempo.`,
      },
      epitaphSeed: 'nunca dejó de preguntarse quién era la persona con la que vivía',
    },

    {
      id:   'convivencia_serena',
      text: (_s) => 'No necesitáis grandes palabras. Lo que tenéis es sólido y lo sabéis.',
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${nombre} y ${s.character.name} no tienen que hablar de esto — ya lo saben. Hay una serenidad en los años largos con alguien que no se parece a nada anterior. No es pasión — es algo más parecido a la certeza. Y la certeza, resulta, tiene su propio calor.`
        },
        statDeltas: { estabilidad: 0.5, emocional: 0.3 },
        flags:      ['inventario_pareja_vivido'],
      },
      delayed: [],
      epitaphSeed: 'construyó algo sólido sin necesitar que nadie lo llamara extraordinario',
    },

    {
      id:   'momento_de_honestidad',
      text: (s) => `Hay cosas que nunca dijisteis. Es el momento de decirlas — aunque cambie todo.`,
      immediate: {
        narrative: (s) => {
          const nombre = partnerName(s)
          return `${s.character.name} abre una conversación que llevaba años esperando. ${nombre} escucha. Lo que sale no es fácil — nunca lo es cuando es verdad. Pero hay algo que se mueve en la habitación cuando se dice lo que se tenía que decir. Sea lo que sea lo que pase después, al menos es real.`
        },
        statDeltas: { emocional: 0.4, carisma: 0.3, riesgo: 0.3, estabilidad: -0.2 },
        flags:      ['inventario_pareja_vivido', 'verdad_dicha_tarde'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => {
            const nombre = partnerName(s)
            return `Dos años después de aquella conversación, ${nombre} y ${s.character.name} son distintos juntos. No necesariamente más felices — pero más honestos. Y eso también cuenta.`
          },
          statDeltas: { emocional: 0.3, estabilidad: 0.1 },
        },
      ],
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────
export const PARTNER_EVENTS: GameEventTemplate[] = [
  encuentroVital,
  decisionVidaCompartida,
  grietaEstructura,
  reencuentroOCierre,
  parejaEnLaMadurez,
]
