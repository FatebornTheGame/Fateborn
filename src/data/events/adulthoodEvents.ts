import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'

function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'alguien de tu entorno'
}

// ═══ EVENTO 19: LA TOMA DE INVENTARIO (edad 31-34) ════════════════════════════
// Every character faces this: the first real adult reckoning after 30.
// Not a crisis necessarily — a stocktake of what's been built and whether it still fits.
const crisisTreinta: GameEventTemplate = {
  id:              'crisis_treinta',
  triggerAge:      [31, 34],
  triggerAntiFlags: ['inventario_treinta_resuelto'],
  weight:          1,

  context: (state) => {
    const isAmbicioso = hasFlag(state, 'mentalidad_adulta_ambiciosa')

    if (state.career !== null && isAmbicioso) {
      return `${state.character.name} lleva años con la cabeza puesta en construir. Con los treinta superados, el mundo exige una revisión que no es fácil de ignorar: ¿esto que estás construyendo es lo que querías construir?`
    }
    if (state.career !== null) {
      return `Con los treinta en el retrovisor, ${state.character.name} mira lo que ha levantado. No para juzgarlo. Para saber si sigue siendo el camino.`
    }
    return `Los treinta tienen una gravedad propia. ${state.character.name} los siente como una bisagra. Lo de antes y lo de ahora no son la misma cosa, aunque nadie lo haya declarado oficialmente.`
  },

  options: [
    {
      id:   'continuidad_consciente',
      text: (_s) => 'Estás donde querías estar. No exactamente, pero sí en esencia.',
      immediate: {
        narrative: (s) => `${s.character.name} hace el inventario y el resultado no es perfecto — nunca lo es — pero es reconocible. Lo que decidiste a los 18, a los 22, a los 25 tiene forma de algo. Eso no es poco.`,
        statDeltas: { estabilidad: 0.35, ambicion: 0.25, emocional: 0.2 },
        flags:      ['inventario_treinta_resuelto', 'treinta_con_claridad'],
      },
      delayed: [
        {
          triggerAge: 37,
          narrative: (s) => `A los 37, la claridad que ${s.character.name} tuvo a los treinta ha sido una base silenciosa. No perfecta, pero estable.`,
          statDeltas: { estabilidad: 0.2, ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_inventario_positivo',
        text: (_s) => 'Cuando te paraste a contar lo construido y el resultado fue más de lo que esperabas. No siempre pasa.',
      },
      epitaphSeed: 'supo reconocer lo que había construido antes de seguir construyendo',
    },
    {
      id:   'recalibracion',
      text: (_s) => 'No estás donde querías, pero sabes exactamente cómo corregir el rumbo.',
      immediate: {
        narrative: (s) => {
          const isAmbicioso = hasFlag(s, 'mentalidad_adulta_ambiciosa')
          return isAmbicioso
            ? `${s.character.name} tiene la ambición intacta pero la dirección desplazada. No es fracaso — es información. Y con buena información, se corrige.`
            : `${s.character.name} traza la distancia entre donde está y donde quería estar. No es abismal. Es ajustable. Eso es diferente.`
        },
        statDeltas: { ambicion: 0.4, riesgo: 0.2, emocional: 0.25 },
        flags:      ['inventario_treinta_resuelto', 'treinta_con_recalibracion'],
      },
      delayed: [
        {
          triggerAge: 35,
          narrative: (s) => {
            return s.career !== null
              ? `Los ajustes que ${s.character.name} hizo a los treinta empiezan a tener resultado. No fue rápido. Fue real.`
              : `Con 35, ${s.character.name} ha recalibrado. No todo lo que imaginó a los treinta, pero más de lo que había antes.`
          },
          statDeltas: { ambicion: 0.2 },
        },
      ],
      memory: {
        id:   'memory_inventario_recalibracion',
        text: (_s) => 'El momento en que viste la desviación y decidiste corregirla. Sin drama. Con claridad.',
      },
      epitaphSeed: 'supo ajustar el rumbo sin perder el destino de vista',
    },
    {
      id:   'crisis_orientacion',
      text: (_s) => 'Lo que construiste no te pertenece emocionalmente. Es el momento de entender qué quieres realmente.',
      immediate: {
        narrative: (s) => `${s.character.name} lleva semanas sin poder terminar una frase que empiece por "lo que quiero es...". Lo que hay — trabajo, rutinas, relaciones — no encaja. No es crisis de nervios. Es que algo por dentro ha dejado de reconocer lo de fuera.`,
        statDeltas: { emocional: 0.45, estabilidad: -0.2, creatividad: 0.2, riesgo: 0.2 },
        flags:      ['inventario_treinta_resuelto', 'crisis_identidad_treinta'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después del punto de inflexión, ${s.character.name} no ha resuelto todo. Pero sabe al menos qué preguntas son suyas.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
          flags:      ['crisis_treinta_procesada'],
        },
        {
          triggerAge: 40,
          narrative: (s) => `A los 40, la crisis de los treinta de ${s.character.name} tiene perspectiva. Quien la vivió como ruptura la entiende ahora como punto de partida.`,
          statDeltas: { emocional: 0.2, ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_inventario_crisis',
        text: (_s) => 'Cuando la vida que habías construido dejó de reconocerte. No fue una crisis fácil. Fue honesta.',
      },
      epitaphSeed: 'tuvo el coraje de no reconocerse para encontrarse después',
    },
  ],
}

// ═══ EVENTO 20: EL ASCENSO / EL TECHO (edad 34-39) ════════════════════════════
// A major professional crossroads: management, deep specialization, or going independent.
// Requires career nivel 2 — the character has earned their stripes.
const ascensoProfesional: GameEventTemplate = {
  id:              'ascenso_profesional',
  triggerAge:      [34, 39],
  triggerAntiFlags: ['decision_profesional_adulta'],
  requireCareer:   { nivel: 2 },
  weight:          0.9,

  context: (state) => {
    const isAutonomo = hasFlag(state, 'autonomo_desde_joven')
    const hasCambio  = hasFlag(state, 'cambio_profesional_25')

    if (isAutonomo) {
      return `${state.character.name} lleva años construyendo por su cuenta. El negocio tiene tracción. Ahora la pregunta no es si puede sobrevivir — es si puede escalar.`
    }
    if (hasCambio) {
      return `El cambio profesional que ${state.character.name} hizo a los 25 ha madurado. Hay opciones encima de la mesa que antes no existían.`
    }
    return `Con más de diez años de experiencia, ${state.character.name} está en el punto donde el camino se bifurca: gestionar personas, profundizar en la especialidad, o crear algo propio. Los tres son válidos. Solo hay presupuesto vital para uno.`
  },

  options: [
    {
      id:   'aceptar_gestion',
      text: (_s) => 'Asumes el cargo de gestión. Más responsabilidad, más impacto, mejor sueldo.',
      immediate: {
        narrative: (s) => `${s.character.name} acepta. El despacho cambia, el email cambia, la agenda cambia. El trabajo que hacía antes lo hacen ahora otras personas. Eso es poder. También es distancia.`,
        statDeltas: { ambicion: 0.45, carisma: 0.3, disciplina: 0.2, creatividad: -0.1 },
        flags:      ['decision_profesional_adulta', 'rol_gestion'],
        career:     { profesion: 'Director', nivel: 3, salarioMensual: 3200 },
      },
      delayed: [
        {
          triggerAge: 40,
          narrative: (s) => `A los 40, ${s.character.name} dirige personas. No siempre es lo que imaginaba que sería. Pero el impacto es real y medible.`,
          statDeltas: { ambicion: 0.2, carisma: 0.15 },
        },
        {
          triggerAge: 45,
          narrative: (s) => {
            return s.stats.creatividad > 6
              ? `Con 45, ${s.character.name} equilibra la gestión con proyectos que mantienen viva la parte creativa. Es un acto de equilibrio difícil. Lo consigue.`
              : `Con 45 años en carrera ejecutiva, ${s.character.name} reconoce que cedió algo al subir. No sabe si fue la creatividad, la libertad o simplemente el tiempo. Probablemente los tres.`
          },
          statDeltas: (s) => s.stats.creatividad > 6
            ? { creatividad: 0.15, emocional: 0.1 }
            : { emocional: 0.2, ambicion: -0.1 },
        },
      ],
      memory: {
        id:   'memory_ascenso_gestion',
        text: (_s) => 'El día que dejaste de hacer para gestionar. Algunas cosas se ganan. Otras se quedan en el despacho anterior.',
      },
      epitaphSeed: 'eligió dirigir sabiendo que dirigir también significa alejarse de lo que más hacías',
    },
    {
      id:   'especializacion_profunda',
      text: (_s) => 'Prefieres ser el mejor en lo que haces. El trabajo técnico es donde tienes impacto real.',
      immediate: {
        narrative: (s) => {
          const esTecnico = hasFlag(s, 'direccion_ciencias') || hasFlag(s, 'implicacion_laboral_alta')
          return esTecnico
            ? `${s.character.name} declina el cargo. Lo que hace bien lo hace muy bien, y eso vale más que un título. La especialización profunda tiene su propio tipo de poder.`
            : `${s.character.name} decide no subir. No es humildad falsa — es claridad sobre dónde está el valor real de lo que aporta. Eso también es una forma de ambición.`
        },
        statDeltas: { logica: 0.35, disciplina: 0.3, estabilidad: 0.2 },
        flags:      ['decision_profesional_adulta', 'experto_referencia'],
        career:     { profesion: 'Experto', nivel: 3, salarioMensual: 2600 },
      },
      delayed: [
        {
          triggerAge: 42,
          narrative: (s) => `Con 42 años en el sector, ${s.character.name} es una referencia. No necesita el cargo — el cargo lo busca a él.`,
          statDeltas: { ambicion: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_especializacion',
        text: (_s) => 'Cuando rechazaste el cargo para quedarte con el trabajo. Mucha gente no lo entendió. Tú no necesitabas que lo entendieran.',
      },
      epitaphSeed: 'eligió la profundidad sobre la altura y construyó desde dentro',
    },
    {
      id:   'crear_propio',
      text: (_s) => 'Es el momento. Tienes experiencia, contactos y claridad. Creas algo propio.',
      immediate: {
        narrative: (s) => {
          const tieneBase = hasFlag(s, 'experiencia_empresa_3_anos') || hasFlag(s, 'autonomo_desde_joven')
          return tieneBase
            ? `${s.character.name} tiene lo que necesita: años de experiencia, red de contactos y claridad sobre lo que quiere construir. La empresa empieza en una hoja de cálculo y en un nombre en el registro mercantil.`
            : `${s.character.name} da el salto sin tener todo perfecto. Nunca lo está. Arranca con lo que tiene.`
        },
        statDeltas: { ambicion: 0.5, riesgo: 0.4, estabilidad: -0.25 },
        flags:      ['decision_profesional_adulta', 'empresa_propia_adulto'],
        career:     { profesion: 'Fundador', nivel: 2, salarioMensual: 1200 },
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => {
            return s.stats.ambicion > 7
              ? `Dos años desde el arranque. ${s.character.name} ha sobrevivido la fase más difícil. La empresa tiene clientes reales. El camino sigue siendo empinado.`
              : `A los dos años, el proyecto de ${s.character.name} ha tenido meses buenos y meses duros. Sigue en pie. Eso ya es algo.`
          },
          statDeltas: (s) => s.stats.ambicion > 7
            ? { ambicion: 0.3, riesgo: 0.15 }
            : { estabilidad: 0.25, emocional: 0.2 },
        },
        {
          triggerAge: 42,
          narrative: (s) => `Con 42 y varios años de empresa, ${s.character.name} sabe lo que no sale en los libros de negocios: la soledad del que funda es diferente a cualquier otra.`,
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_empresa_propia',
        text: (_s) => 'El día que pusiste tu nombre en algo que era completamente tuyo. El miedo y la claridad al mismo tiempo.',
      },
      epitaphSeed: 'fundó algo desde cero sabiendo que podía fallar y lo hizo de todas formas',
    },
  ],
}

// ═══ EVENTO 21: EL COMPROMISO DEFINITIVO (edad 33-40) ═══════════════════════════
// The question of building a life with someone — or consciously not.
// Fires for characters who haven't resolved the partnership question.
const compromisoDefinitivo: GameEventTemplate = {
  id:              'compromiso_definitivo',
  triggerAge:      [33, 40],
  triggerAntiFlags: ['decision_pareja_adulta'],
  weight:          0.85,

  context: (state) => {
    const isPrimerAmorSup = hasFlag(state, 'primer_amor_suprimido')
    const viveSolo        = hasFlag(state, 'vive_solo')
    const hasAmigo        = !!getFirstFriend(state)
    const amigoRef        = hasAmigo ? ` ${npcName(state)} ya resolvió esta pregunta hace años.` : ''

    if (viveSolo && isPrimerAmorSup) {
      return `${state.character.name} lleva tiempo solo. No por falta de oportunidades — por elección, o por algo que se parece a elección. Con más de treinta, la pregunta de si eso va a seguir siendo así ya no puede ignorarse.${amigoRef}`
    }
    return `${state.character.name} está en el punto donde la vida sentimental exige más definición de la que ha tenido. No es urgencia social — es que las cosas que no se definen a tiempo tienden a definirse solas.${amigoRef}`
  },

  options: [
    {
      id:   'comprometerse',
      text: (_s) => 'Construyes una vida con alguien. La relación pasa a ser una decisión activa.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = !!getFirstFriend(s)
          const testigo  = hasAmigo ? ` ${npcName(s)} está en la primera fila.` : ''
          return `${s.character.name} lo decide. No con declaraciones — con gestos. Con un piso que se comparte, con planes que se hacen en plural.${testigo} La vida tiene ahora un interlocutor permanente.`
        },
        statDeltas: { emocional: 0.4, estabilidad: 0.35, carisma: 0.1 },
        flags:      ['decision_pareja_adulta', 'construyendo_con_pareja'],
      },
      delayed: [
        {
          triggerAge: 38,
          narrative: (s) => `A los 38, la relación de ${s.character.name} tiene peso y textura. Lo fácil ya pasó. Lo que queda es lo que decidiste.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
        {
          triggerAge: 44,
          narrative: (s) => `A los 44, la pareja de ${s.character.name} ya no es solo una persona — es parte del paisaje de quien es. Eso cambia cómo se pierde si se pierde y cómo se valora si se mantiene.`,
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_compromiso',
        text: (_s) => 'El momento en que la relación pasó a ser una decisión consciente, no solo una situación.',
      },
      epitaphSeed: 'eligió construir con alguien sabiendo que construir juntos es comprometerse también con los bordes',
    },
    {
      id:   'independencia_elegida',
      text: (_s) => 'Eliges la independencia con claridad. No es soledad — es una forma de vida.',
      immediate: {
        narrative: (s) => `${s.character.name} lo ha pensado mucho. No se siente incompleto sin pareja — se siente completo de otra forma. No es una decisión de renuncia. Es una decisión de preferencia. La diferencia importa.`,
        statDeltas: { estabilidad: 0.35, creatividad: 0.2, ambicion: 0.15 },
        flags:      ['decision_pareja_adulta', 'independencia_elegida_adulto'],
      },
      delayed: [
        {
          triggerAge: 40,
          narrative: (s) => `Con 40, ${s.character.name} lleva años con la independencia como estructura de vida. Hay noches que pesa. Hay mañanas en que no cambiaría nada.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.15 },
        },
        {
          triggerAge: 50,
          narrative: (s) => `A los 50, la elección de ${s.character.name} de vivir sin pareja permanente tiene más defensores ahora que cuando la tomó. El mundo cambió. Él también.`,
          statDeltas: { estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_independencia_adulta',
        text: (_s) => 'El día que decidiste que tu vida sin pareja era una elección, no una falta. Mucha gente no lo creyó. Ya no necesitabas que lo creyeran.',
      },
      epitaphSeed: 'vivió solo por elección y lo construyó de forma que nadie pudiera confundirlo con renuncia',
    },
    {
      id:   'dejar_al_tiempo',
      text: (_s) => 'Lo dejas al tiempo. Todavía no está claro y forzarlo no sirve.',
      immediate: {
        narrative: (s) => `${s.character.name} no cierra ninguna puerta. Tampoco las abre del todo. La ambigüedad tiene su comodidad — y su coste. Por ahora, el coste parece aceptable.`,
        statDeltas: { estabilidad: 0.1 },
        flags:      ['decision_pareja_aplazada'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => {
            const tieneDecision = hasFlag(s, 'construyendo_con_pareja') || hasFlag(s, 'independencia_elegida_adulto')
            return tieneDecision
              ? `Cuatro años después, la vida de ${s.character.name} tomó su propia dirección. A veces el tiempo sí decide.`
              : `Con casi cuarenta, ${s.character.name} sigue sin haber cerrado la pregunta. No está mal. Tampoco está cerrado.`
          },
          flags:      ['decision_pareja_adulta'],
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_pareja_aplazada',
        text: (_s) => 'Los años en que dejaste la pregunta abierta. A veces funciona. A veces la pregunta se responde sola de formas que no elegiste.',
      },
      epitaphSeed: 'dejó algunas preguntas abiertas más tiempo del necesario, y aprendió lo que eso cuesta',
    },
  ],
}

// ═══ EVENTO 22: EL PRIMER GOLPE ECONÓMICO GRAVE (edad 36-45) ═══════════════════
// First serious financial blow: layoff, company collapse, business setback.
// Not triggered for precario economy — only those who had something to lose.
const golpeEconomicoGrave: GameEventTemplate = {
  id:              'golpe_economico_grave',
  triggerAge:      [36, 45],
  triggerAntiFlags: ['golpe_economico_resuelto'],
  weight:          0.75,

  context: (state) => {
    const tieneEmpresa = hasFlag(state, 'empresa_propia_adulto') || hasFlag(state, 'autonomo_desde_joven')

    if (tieneEmpresa) {
      return `El negocio de ${state.character.name} ha tenido sus ciclos. Pero esto es diferente: un cliente grande que se va, un socio que traiciona, o un cambio de mercado que nadie vio venir. El golpe es real y exige respuesta.`
    }
    if (state.career !== null) {
      return `Un ERE, una empresa que cierra, un proyecto cancelado. ${state.character.name} se enfrenta al primer golpe económico serio de su vida adulta. No es teórico. Es el sueldo del mes que viene.`
    }
    return `${state.character.name} lleva años construyendo una base económica. Algo la sacude ahora de forma seria. Ninguna base es inatacable.`
  },

  options: [
    {
      id:   'reinvencion_rapida',
      text: (_s) => 'Te recompones rápido. El golpe es real pero no define lo que viene.',
      immediate: {
        narrative: (s) => {
          const tieneRed = hasFlag(s, 'experiencia_empresa_3_anos') || hasFlag(s, 'experto_referencia')
          return tieneRed
            ? `${s.character.name} activa su red. Contactos, referencias, proyectos pendientes de aceptar. El golpe fue real. La respuesta también.`
            : `${s.character.name} no se queda quieto. El primer instinto es moverse antes de que el miedo se instale. No es lo más reflexivo. Suele ser lo más efectivo.`
        },
        statDeltas: { ambicion: 0.35, riesgo: 0.2, estabilidad: 0.15, emocional: 0.1 },
        flags:      ['golpe_economico_resuelto', 'resiliencia_economica'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después del golpe, ${s.character.name} está en una posición diferente. No necesariamente mejor en todos los sentidos — pero más suya.`,
          statDeltas: { estabilidad: 0.2, ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_golpe_resurreccion',
        text: (_s) => 'El año que todo se cayó y te levantaste antes de que alguien te viera en el suelo. Aprendiste que puedes.',
      },
      epitaphSeed: 'demostró que la velocidad de recuperación define más que la magnitud del golpe',
    },
    {
      id:   'reestructuracion_total',
      text: (_s) => 'Reconoces que el modelo tenía un fallo. El golpe es la oportunidad de reconstruir bien.',
      immediate: {
        narrative: (s) => `${s.character.name} no busca volver a donde estaba — busca entender por qué cayó. Eso lleva meses. Duele. Al final da una imagen más clara de lo que falló y de lo que puede funcionar.`,
        statDeltas: { disciplina: 0.3, logica: 0.3, estabilidad: 0.1, emocional: 0.2 },
        flags:      ['golpe_economico_resuelto', 'reestructuracion_post_crisis'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.logica > 7
              ? `Tres años de reconstrucción. ${s.character.name} tiene ahora una arquitectura económica más sólida que la anterior. El golpe fue el precio de la lección.`
              : `Tres años de reestructuración. El proceso fue más lento de lo que ${s.character.name} esperaba. Pero lo que queda es más honesto.`
          },
          statDeltas: (s) => s.stats.logica > 7
            ? { estabilidad: 0.25, disciplina: 0.2 }
            : { estabilidad: 0.15, emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_reestructuracion',
        text: (_s) => 'Los meses que pasaste mirando el fallo sin buscar excusas. Fue duro. Fue lo correcto.',
      },
      epitaphSeed: 'cuando cayó, eligió entender en lugar de repetir',
    },
    {
      id:   'esperar_ciclo',
      text: (_s) => 'Esperas que pase. Hay ciclos, y esto es uno de ellos.',
      immediate: {
        narrative: (s) => `${s.character.name} asume que es temporal. El mercado se recupera, los clientes vuelven, el ciclo gira. No es del todo incorrecto. Pero los problemas que se atribuyen al ciclo y no son solo ciclo tienen costumbre de volver peores.`,
        statDeltas: { estabilidad: 0.05 },
        flags:      ['golpe_economico_minimizado'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => {
            return s.economy.liquidez > 5000
              ? `Dos años después, el ciclo giró como ${s.character.name} esperaba. No siempre funciona así. Esta vez sí.`
              : `Dos años esperando que pasara, ${s.character.name} reconoce que no pasó. El coste de no actuar a tiempo es más alto que el del golpe original.`
          },
          flags:      ['golpe_economico_resuelto'],
          statDeltas: (s) => s.economy.liquidez > 5000
            ? { estabilidad: 0.2 }
            : { emocional: 0.25, estabilidad: -0.2, ambicion: 0.1 },
        },
      ],
      memory: {
        id:   'memory_esperar_crisis',
        text: (_s) => 'El año que esperaste que la situación económica se resolviese sola. A veces lo hace. A veces el tiempo es parte del problema.',
      },
      epitaphSeed: 'aprendió que esperar también es una decisión, y que tiene su propio coste',
    },
  ],
}

// ═══ EVENTO 23: LA CRISIS DE LOS CUARENTA (edad 38-46) ════════════════════════
// The universal mid-life reckoning: who have I become, is this enough?
// Not a crisis in the clinical sense — an unavoidable stocktake.
const crisisCuarenta: GameEventTemplate = {
  id:              'crisis_cuarenta',
  triggerAge:      [38, 46],
  triggerAntiFlags: ['crisis_cuarenta_procesada'],
  weight:          0.9,

  context: (state) => {
    const hasCrisis30 = hasFlag(state, 'crisis_identidad_treinta')
    const hasRol      = hasFlag(state, 'rol_gestion')

    if (hasCrisis30) {
      return `La de los treinta fue la primera pregunta. La de los cuarenta es diferente: ya no es "¿qué quiero?", es "¿quién me he convertido?". ${state.character.name} conoce la diferencia.`
    }
    if (hasRol) {
      return `${state.character.name} tiene carrera, tiene trayectoria, tiene lo que quería tener. Y sin embargo hay algo — difícil de nombrar — que no cuadra. No es fracaso. Es una pregunta que el éxito no responde.`
    }
    return `Los cuarenta llegan con una pregunta que no está en ningún manual: ¿es esto para lo que vine? ${state.character.name} la escucha. No puede no escucharla.`
  },

  options: [
    {
      id:   'integracion_tranquila',
      text: (_s) => 'Integras lo vivido. No todo fue perfecto, pero fue tuyo.',
      immediate: {
        narrative: (s) => {
          const hasLogros = hasFlag(s, 'treinta_con_claridad') || hasFlag(s, 'apuesta_por_estabilidad')
          return hasLogros
            ? `${s.character.name} hace el balance con los ojos abiertos. Los errores tienen nombre. Los logros también. La suma no da perfecto — da verdadero. Eso es diferente y vale más.`
            : `${s.character.name} no fuerza ninguna conclusión. Lo vivido está ahí — con sus contradicciones y sus costes. Integrarlo sin reescribirlo es posible. ${s.character.name} elige eso.`
        },
        statDeltas: { emocional: 0.45, estabilidad: 0.35, ambicion: 0.1 },
        flags:      ['crisis_cuarenta_procesada', 'cuarenta_integrados'],
      },
      delayed: [
        {
          triggerAge: 50,
          narrative: (s) => `A los 50, la paz que ${s.character.name} encontró a los cuarenta tiene raíces. No hay drama pendiente. Hay vida por delante.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_cuarenta_paz',
        text: (_s) => 'Cuando cumpliste cuarenta y miraste lo que había y lo reconociste como tuyo. Eso no es poco.',
      },
      epitaphSeed: 'llegó a los cuarenta y reconoció su propia vida sin necesidad de cambiarla',
    },
    {
      id:   'cambio_fundamental',
      text: (_s) => 'Algo tiene que cambiar. Ya sabes qué. Solo necesitabas el momento.',
      immediate: {
        narrative: (s) => {
          const hasCambio25 = hasFlag(s, 'cambio_profesional_25')
          return hasCambio25
            ? `No es la primera vez. ${s.character.name} ya sabe lo que cuesta cambiar de dirección. También sabe lo que cuesta no hacerlo. Da el paso.`
            : `${s.character.name} da el salto. Puede ser el trabajo, la ciudad, la relación, la vida entera — lo que sea que lleva tiempo sin encajar. La crisis de los cuarenta tiene reputación de destructiva. A veces es constructiva.`
        },
        statDeltas: { riesgo: 0.35, ambicion: 0.4, emocional: 0.3, estabilidad: -0.2 },
        flags:      ['crisis_cuarenta_procesada', 'cambio_en_cuarenta'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.riesgo > 6
              ? `Tres años después del cambio, ${s.character.name} no volvería atrás. El proceso fue difícil. El resultado es suyo.`
              : `Tres años después, ${s.character.name} lleva las cicatrices del cambio. También los frutos. No en el orden que esperaba.`
          },
          statDeltas: (s) => s.stats.riesgo > 6
            ? { ambicion: 0.25, emocional: 0.2 }
            : { estabilidad: 0.2, emocional: 0.2 },
        },
        {
          triggerAge: 48,
          narrative: (s) => `A los 48, el cambio que ${s.character.name} hizo en la crisis de los cuarenta ya tiene perspectiva. El tiempo convierte las crisis en puntos de inflexión o en errores. Todavía es demasiado pronto para saberlo del todo.`,
          statDeltas: { emocional: 0.1 },
        },
      ],
      memory: {
        id:   'memory_cuarenta_cambio',
        text: (_s) => 'La crisis que usaste como palanca. No como catástrofe — como acelerador. No todo el mundo lo hace así.',
      },
      epitaphSeed: 'convirtió la crisis de los cuarenta en el punto de partida de lo que más orgulloso estuvo',
    },
    {
      id:   'ignorar_activamente',
      text: (_s) => 'No es el momento. Tienes demasiadas responsabilidades para permitirte una crisis.',
      immediate: {
        narrative: (s) => `${s.character.name} lo aparca. El trabajo, la familia, los compromisos — todo exige presencia ahora. La pregunta puede esperar. Aunque las preguntas que esperan no desaparecen. Solo se profundizan.`,
        statDeltas: { estabilidad: 0.2, disciplina: 0.15 },
        flags:      ['crisis_cuarenta_aplazada'],
      },
      delayed: [
        {
          triggerAge: 50,
          narrative: (s) => {
            return hasFlag(s, 'crisis_cuarenta_aplazada')
              ? `Lo que ${s.character.name} ignoró a los cuarenta regresa a los cincuenta con más fuerza. Las preguntas aplazadas cobran intereses.`
              : `Con 50, ${s.character.name} mira hacia atrás y reconoce que la pregunta de los cuarenta sí tuvo respuesta — solo que la dio el tiempo, no él.`
          },
          statDeltas: { emocional: 0.3, estabilidad: -0.1 },
          flags:      ['crisis_cuarenta_procesada', 'crisis_llegada_tarde'],
        },
      ],
      memory: {
        id:   'memory_cuarenta_ignorada',
        text: (_s) => 'Los años en que decidiste no parar a pensar porque parar costaba demasiado. La pregunta esperó. Volvió.',
      },
      epitaphSeed: 'aplazó las preguntas difíciles hasta que dejaron de ser opcionales',
    },
  ],
}

// ═══ EVENTO 24: LA PRIMERA GRAN PÉRDIDA (edad 42-52) ══════════════════════════
// Death of a parent — the most universal adult experience.
// No happy option exists. The three paths are different ways to process the same loss.
const muertePrimerProgenitor: GameEventTemplate = {
  id:              'muerte_primer_progenitor',
  triggerAge:      [42, 52],
  triggerAntiFlags: ['perdida_progenitor_procesada'],
  weight:          0.85,

  context: (state) => {
    const hasFamily = hasFlag(state, 'familia_unida') || hasFlag(state, 'comprende_familia')

    if (hasFamily) {
      return `Llega la noticia que ${state.character.name} sabía que llegaría algún día. No hay forma de prepararse. Cada persona que ha perdido a un padre dice lo mismo: no hay forma de prepararse.`
    }
    return `Uno de los progenitores de ${state.character.name} muere. La relación no era perfecta. Las relaciones con los padres casi nunca lo son. Pero algo se cierra que nunca volverá a abrirse.`
  },

  options: [
    {
      id:   'pilar_familia',
      text: (_s) => 'Te conviertes en el pilar. La familia te necesita y estás ahí.',
      immediate: {
        narrative: (s) => {
          const hasMediador = hasFlag(s, 'mediador_familiar')
          return hasMediador
            ? `${s.character.name} ya sabía hacerlo. La pérdida lo confirma como el centro de gravedad familiar. No es un rol que eligió — es uno que ejerció hasta que se volvió suyo.`
            : `${s.character.name} asume la responsabilidad. Las gestiones, las llamadas, los familiares que no saben qué decir. El duelo propio tiene que esperar. Eso también tiene un precio.`
        },
        statDeltas: { carisma: 0.2, emocional: 0.35, estabilidad: -0.15 },
        flags:      ['perdida_progenitor_procesada', 'pilar_familiar'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} llora lo que no pudo llorar cuando había que gestionar. El duelo llegó tarde pero llegó completo.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
          flags:      ['duelo_completado'],
        },
        {
          triggerAge: 55,
          narrative: (s) => `Con 55, ${s.character.name} empieza a parecerse a quien perdió en formas que no esperaba. En los gestos, en la voz. No es pérdida — es continuidad.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_pilar_perdida',
        text: (_s) => 'La semana que te convertiste en el adulto de la familia. Nadie te lo pidió. Nadie tuvo que hacerlo.',
      },
      epitaphSeed: 'fue el que sostuvo cuando ya no quedaba nadie que pudiera sostenerle',
    },
    {
      id:   'duelo_en_soledad',
      text: (_s) => 'Lo procesas a tu manera. No todo el mundo necesita los mismos ritos.',
      immediate: {
        narrative: (s) => {
          const viveSolo = hasFlag(s, 'vive_solo')
          return viveSolo
            ? `${s.character.name} vuelve a casa y cierra la puerta. El duelo en solitario tiene una textura distinta. Sin testigos, sin gestión, sin rol que cumplir. Solo el peso exacto de lo que pasó.`
            : `${s.character.name} necesita silencio. No ausencia de la familia — silencio interior. Los demás no siempre lo entienden. Lo suyo tampoco necesita ser entendido.`
        },
        statDeltas: { emocional: 0.45, estabilidad: 0.15 },
        flags:      ['perdida_progenitor_procesada', 'duelo_solitario'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `Tres años después, ${s.character.name} ha integrado la pérdida sin hablar demasiado de ella. Está ahí, en su sitio. Ya no pesa igual.`,
          statDeltas: { emocional: 0.25, estabilidad: 0.2 },
          flags:      ['duelo_completado'],
        },
      ],
      memory: {
        id:   'memory_duelo_soledad',
        text: (_s) => 'Los días en que procesaste la pérdida solo. Sin explicaciones, sin rituales prestados. A tu manera.',
      },
      epitaphSeed: 'procesó las pérdidas como vivió: en sus propios términos',
    },
    {
      id:   'revision_existencial',
      text: (_s) => 'La muerte te hace revisar todo. Hay cosas que ya no puedes seguir aplazando.',
      immediate: {
        narrative: (s) => {
          const tieneCrisis30 = hasFlag(s, 'crisis_identidad_treinta')
          return tieneCrisis30
            ? `La segunda vez que ${s.character.name} siente que el tiempo tiene límites. La primera fue a los treinta. Esto es diferente — más concreto, más urgente, más suyo.`
            : `La muerte de alguien cercano tiene esa capacidad: te muestra con claridad lo que has aplazado demasiado. ${s.character.name} tiene una lista. Ahora tiene también una razón para empezar.`
        },
        statDeltas: { emocional: 0.4, ambicion: 0.3, riesgo: 0.25, estabilidad: -0.1 },
        flags:      ['perdida_progenitor_procesada', 'revision_por_perdida'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después de la pérdida, ${s.character.name} ha hecho al menos una de las cosas que tenía pendientes. La muerte de alguien querido es un acelerador que no pediste.`,
          statDeltas: { ambicion: 0.2, emocional: 0.15 },
          flags:      ['acelerado_por_perdida'],
        },
      ],
      memory: {
        id:   'memory_revision_perdida',
        text: (_s) => 'Cuando la muerte de alguien te hizo ver con claridad lo que seguías aplazando. El dolor y la claridad juntos.',
      },
      epitaphSeed: 'dejó que las pérdidas le recordaran que el tiempo no vuelve',
    },
  ],
}

export const ADULTHOOD_EVENTS: GameEventTemplate[] = [
  crisisTreinta,
  ascensoProfesional,
  compromisoDefinitivo,
  golpeEconomicoGrave,
  crisisCuarenta,
  muertePrimerProgenitor,
]
