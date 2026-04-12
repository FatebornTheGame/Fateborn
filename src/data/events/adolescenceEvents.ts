import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'

function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'alguien de tu entorno'
}

// ═══ EVENTO 6: PRIMER AMOR (edad 13) ═════════════════════════════════════════
const firstLove: GameEventTemplate = {
  id:         'first_love',
  triggerAge: 13,
  weight:     1,

  context: (state) => {
    const hasAmigo = hasFlag(state, 'tiene_amigo_infancia')
    if (hasAmigo) {
      return `Con 13 años, alguien en el grupo de ${npcName(state)} capta la atención de ${state.character.name} de una manera diferente. Los sentimientos se vuelven confusos y reales al mismo tiempo.`
    }
    return `Con 13 años, ${state.character.name} experimenta algo nuevo: alguien ocupa pensamientos que antes estaban libres. No sabe qué hacer con eso.`
  },

  options: [
    {
      id:   'acercarse',
      text: (_s) => 'Intentas acercarte. La incertidumbre es parte del proceso.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = hasFlag(s, 'tiene_amigo_infancia')
          return hasAmigo
            ? `${s.character.name} da el paso. ${npcName(s)} lo ve y sonríe. Hay algo que empieza.`
            : `${s.character.name} da el paso. No sale perfecto. Pero sale.`
        },
        statDeltas: { carisma: 0.4, emocional: 0.3 },
        flags:      ['primer_amor_activo', 'extrovertido_amoroso'],
      },
      delayed: [
        {
          triggerAge: 18,
          narrative: (s) => {
            const activo = hasFlag(s, 'primer_amor_activo')
            return activo
              ? `${s.character.name} recuerda aquel primer amor con ternura. No duró para siempre. Pero fue real.`
              : `La primera relación real llega a los 18. ${s.character.name} lleva años practicando sin saberlo.`
          },
          statDeltas: { emocional: 0.2 },
        },
        {
          triggerAge: 25,
          narrative: (s) => `${s.character.name} reconoce patrones del primer amor en relaciones posteriores. La infancia emocional deja marcas largas.`,
          statDeltas: { emocional: 0.15, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_first_love',
        text: (_s) => 'La primera vez que alguien te ocupó los pensamientos de esa manera. Nada fue igual después.',
      },
      epitaphSeed: 'amó antes de tener palabras para ello',
    },
    {
      id:   'observar_desde_lejos',
      text: (_s) => 'Lo observas desde lejos. Quizás no sea el momento.',
      immediate: {
        narrative: (s) => `${s.character.name} guarda el sentimiento. Lo alimenta en silencio. Quizás sea más seguro así.`,
        statDeltas: { emocional: 0.25, creatividad: 0.2 },
        flags:      ['primer_amor_silencioso'],
      },
      delayed: [
        {
          triggerAge: 15,
          narrative: (_s) => `Aquella persona ya no está. La oportunidad pasó. ${_s.character.name} aprende que esperar también tiene precio.`,
          statDeltas: { emocional: 0.15 },
          flags:      ['oportunidad_perdida_amor'],
        },
        {
          triggerYearsAfter: 15,
          narrative: (s) => `${s.character.name} busca en internet a aquella persona. La encuentra. Tiene una vida. Eso está bien.`,
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_love_from_afar',
        text: (_s) => 'Aquella persona que observaste sin hablar nunca. Lo que podría haber sido.',
      },
      epitaphSeed: 'guardó algunos amores en silencio más tiempo del necesario',
    },
    {
      id:   'ignorar_sentimientos',
      text: (_s) => 'Ignoras los sentimientos. Hay cosas más importantes ahora.',
      immediate: {
        narrative: (s) => `${s.character.name} cierra esa puerta. Hay exámenes, hay cosas que hacer. Los sentimientos pueden esperar.`,
        statDeltas: { disciplina: 0.35, emocional: -0.1 },
        flags:      ['reprime_emociones_adolescencia'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `Con 20 años, ${s.character.name} se da cuenta de que aprendió a ignorar sentimientos de forma demasiado eficiente.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_love_suppressed',
        text: (_s) => 'La primera vez que decidiste que los sentimientos podían esperar. Tardaron más de lo pensado.',
      },
      epitaphSeed: 'puso la razón donde debía estar el corazón, y viceversa',
    },
  ],
}

// ═══ EVENTO 7: DECISIÓN ACADÉMICA (edad 14) ═══════════════════════════════════
const academicDecision: GameEventTemplate = {
  id:         'academic_decision',
  triggerAge: 14,
  weight:     1,

  context: (state) => {
    const s = state.stats
    const country = state.character.country
    const path = s.logica > s.creatividad ? 'ciencias y matemáticas' : 'humanidades y artes'
    const countryContext = ['España', 'Francia', 'Alemania', 'Italia'].includes(country)
      ? `En ${country}, el sistema te pide que te definas pronto.`
      : 'El sistema educativo pide que empieces a elegir.'
    return `Con 14 años, ${countryContext} Tu perfil apunta hacia ${path}, pero tú tienes la última palabra.`
  },

  options: [
    {
      id:   'ciencias',
      text: (_s) => 'Ciencias y Matemáticas. La lógica como herramienta.',
      immediate: {
        narrative: (s) => `${s.character.name} elige el camino exacto. Los números, los problemas con solución. Hay algo tranquilizador en eso.`,
        statDeltas: { logica: 0.5, disciplina: 0.3 },
        flags:      ['camino_academico_ciencias'],
      },
      delayed: [
        {
          triggerAge: 17,
          narrative: (s) => {
            const pressured = s.stats.disciplina < 5
            return pressured
              ? `Los exámenes de ciencias pesan. ${s.character.name} duda si eligió bien.`
              : `Con 17 años, el camino científico empieza a mostrar sus posibilidades.`
          },
          statDeltas: { logica: 0.2 },
        },
        {
          triggerAge: 22,
          narrative: (s) => `La decisión de ciencias a los 14 abrió puertas específicas. ${s.character.name} las está cruzando ahora.`,
          flags:      ['base_cientifica_solida'],
        },
      ],
      memory: {
        id:   'memory_science_path',
        text: (_s) => 'El día que elegiste ciencias. Parecía lo lógico. Quizás lo era.',
      },
      epitaphSeed: 'eligió la lógica como idioma y nunca se arrepintió del todo',
    },
    {
      id:   'humanidades',
      text: (_s) => 'Humanidades y Artes. El sentido como búsqueda.',
      immediate: {
        narrative: (s) => `${s.character.name} elige el camino del sentido. Las palabras, el análisis, la creación. Un camino menos recto pero más suyo.`,
        statDeltas: { creatividad: 0.5, emocional: 0.3 },
        flags:      ['camino_academico_humanidades'],
      },
      delayed: [
        {
          triggerAge: 18,
          narrative: (s) => {
            const hasAmigo = hasFlag(s, 'tiene_amigo_infancia')
            return hasAmigo
              ? `${npcName(s)} estudia algo diferente. Os veis menos. Pero lo que teníais en común era anterior a las carreras.`
              : `Con 18 años, humanidades abre preguntas que ${s.character.name} no esperaba.`
          },
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_humanities_path',
        text: (_s) => 'El día que elegiste humanidades. Todo el mundo tenía una opinión. Ninguna fue la tuya.',
      },
      epitaphSeed: 'buscó el sentido antes que las respuestas',
    },
    {
      id:   'tecnologia',
      text: (_s) => 'Tecnología e Informática. El futuro como herramienta.',
      immediate: {
        narrative: (s) => `${s.character.name} elige lo que todavía no existe del todo. La tecnología como lenguaje del futuro.`,
        statDeltas: { logica: 0.4, riesgo: 0.2, creatividad: 0.2 },
        flags:      ['camino_academico_tecnologia'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `${s.character.name} lleva años aprendiendo lo que otros apenas empiezan a entender. Eso tiene valor.`,
          statDeltas: { ambicion: 0.2, logica: 0.2 },
        },
      ],
      memory: {
        id:   'memory_tech_path',
        text: (_s) => 'La apuesta por la tecnología cuando nadie entendía exactamente qué era eso.',
      },
      epitaphSeed: 'apostó por el futuro cuando el futuro todavía no tenía nombre',
    },
  ],
}

// ═══ EVENTO 8: MOMENTO DE PRESIÓN (edad 15) ═══════════════════════════════════
const pressureMoment: GameEventTemplate = {
  id:         'pressure_moment',
  triggerAge: 15,
  weight:     1,

  context: (state) => {
    const isCiencias    = hasFlag(state, 'camino_academico_ciencias')
    const isHumanidades = hasFlag(state, 'camino_academico_humanidades')
    const hasHobby      = hasFlag(state, 'hobby_desarrollado')
    if (hasHobby && state.stats.fisico > 7) {
      return `Con 15 años, el deporte y los estudios empiezan a tirar en direcciones opuestas. ${state.character.name} no puede tenerlo todo.`
    }
    if (isCiencias) {
      return `Con 15 años, el nivel de ciencias se dispara. ${state.character.name} llega al límite de lo que salía solo.`
    }
    if (isHumanidades) {
      return `Con 15 años, alguien pone en duda el valor de lo que ${state.character.name} estudia. "¿Y de eso vas a vivir?"`
    }
    return `Con 15 años, ${state.character.name} se enfrenta a la primera prueba real: un momento en que el esfuerzo no es suficiente.`
  },

  options: [
    {
      id:   'doblar_esfuerzo',
      text: (_s) => 'Doblas el esfuerzo. Lo que cuesta más vale más.',
      immediate: {
        narrative: (s) => `${s.character.name} aprieta. Menos horas de sueño, más horas de trabajo. Funciona. Por ahora.`,
        statDeltas: { disciplina: 0.4, fisico: -0.15 },
        flags:      ['presion_superada_esfuerzo'],
      },
      delayed: [
        {
          triggerAge: 18,
          narrative: (_s) => `La disciplina construida a los 15 es uno de los activos más valiosos que ${_s.character.name} tiene ahora.`,
          statDeltas: { disciplina: 0.2, ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_pressure_effort',
        text: (_s) => 'Aquellas noches estudiando hasta las tres de la mañana. El cuerpo dolía. La mente también.',
      },
      epitaphSeed: 'aprendió que el límite siempre está un poco más allá de donde lo ponemos',
    },
    {
      id:   'buscar_equilibrio',
      text: (_s) => 'Buscas un equilibrio. No todo puede ser máximo esfuerzo.',
      immediate: {
        narrative: (s) => `${s.character.name} aprende a gestionar. Perfecto en nada, funcional en todo. Hay sabiduría en eso.`,
        statDeltas: { estabilidad: 0.35, disciplina: 0.15 },
        flags:      ['presion_gestionada_equilibrio'],
      },
      delayed: [
        {
          triggerAge: 25,
          narrative: (s) => `Con 25 años, ${s.character.name} ve a compañeros quemados que nunca aprendieron a gestionar la presión. Él sí.`,
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_pressure_balance',
        text: (_s) => 'El año que aprendiste que no todo puede ir a máxima velocidad al mismo tiempo.',
      },
      epitaphSeed: 'eligió la sostenibilidad sobre la brillantez efímera',
    },
    {
      id:   'dejar_algo',
      text: (_s) => 'Dejas algo. El fútbol, las clases extra, el hobby. No puedes con todo.',
      immediate: {
        narrative: (s) => {
          const hasHobby = hasFlag(s, 'hobby_desarrollado')
          return hasHobby
            ? `${s.character.name} deja el hobby. No hay otra forma. La pérdida deja un hueco que tarda en llenarse.`
            : `${s.character.name} corta con algo que consumía tiempo. La decisión es correcta pero deja poso.`
        },
        statDeltas: { disciplina: 0.25, emocional: -0.1 },
        flags:      ['sacrificio_adolescencia'],
        removeFlags: ['hobby_desarrollado'],
      },
      delayed: [
        {
          triggerAge: 22,
          narrative: (s) => `${s.character.name} retoma lo que dejó con 15. A veces hay que soltar para poder recoger.`,
          statDeltas: { creatividad: 0.2 },
          flags:      ['retoma_hobby'],
        },
      ],
      memory: {
        id:   'memory_sacrifice',
        text: (_s) => 'Lo que dejaste con 15 años para poder avanzar. La primera vez que entendiste que elegir significa renunciar.',
      },
      epitaphSeed: 'aprendió que elegir siempre significa renunciar a algo',
    },
  ],
}

// ═══ EVENTO 9: REFLEXIÓN DE IDENTIDAD (edad 15) — solo narrativa ══════════════
const identityReflection: GameEventTemplate = {
  id:         'identity_reflection',
  triggerAge: 15,
  weight:     0.6,  // no siempre ocurre

  context: (state) => {
    const s = state.stats
    const entries = Object.entries(s).sort((a, b) => (b[1] as number) - (a[1] as number))
    const [topKey, topVal] = entries[0] as [string, number]
    const [botKey] = entries[entries.length - 1] as [string, number]
    const LABELS: Record<string, string> = {
      logica: 'piensas con claridad', creatividad: 'imaginas sin límites',
      disciplina: 'te mantienes firme', carisma: 'conectas con los demás',
      emocional: 'sientes más de la cuenta', ambicion: 'quieres demasiado',
      fisico: 'tu cuerpo responde bien', riesgo: 'no tienes miedo a nada',
      estabilidad: 'te mantienes en calma',
    }
    return `${state.character.name} se mira en el espejo con 15 años. ${LABELS[topKey] ?? 'algo destaca'} (${topVal.toFixed(1)}/10). Pero también ${LABELS[botKey] ?? 'algo falla'}.`
  },

  options: [
    {
      id:   'aceptar',
      text: (_s) => 'Lo aceptas. Esto es lo que hay. Hay que trabajar con ello.',
      immediate: {
        narrative: (s) => `${s.character.name} se acepta. No es resignación. Es el comienzo de algo real.`,
        statDeltas: { estabilidad: 0.3, emocional: 0.2 },
        flags:      ['autoconocimiento_temprano'],
      },
      delayed: [],
      epitaphSeed: 'se conoció antes de tratar de cambiarse',
    },
    {
      id:   'cambiar',
      text: (_s) => 'Decides cambiar lo que no te gusta. La identidad no está fija.',
      immediate: {
        narrative: (s) => `${s.character.name} decide que lo que ve puede mejorarse. Esa creencia puede ser su mayor fortaleza o su mayor trampa.`,
        statDeltas: { ambicion: 0.3, riesgo: 0.2 },
        flags:      ['busca_cambio_personal'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `Con 20 años, ${s.character.name} mira atrás. Cambió algunas cosas. Otras resultaron inamovibles. Bien.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      epitaphSeed: 'nunca aceptó que era inmutable, y eso lo cambió todo',
    },
    {
      id:   'ignorar_reflexion',
      text: (_s) => 'Apartas esos pensamientos. Demasiado para un lunes.',
      immediate: {
        narrative: (s) => `${s.character.name} deja el espejo atrás. Hay tiempo para estas preguntas. Quizás no hoy.`,
        statDeltas: { estabilidad: 0.2 },
        flags:      ['evita_introspección'],
      },
      delayed: [
        {
          triggerAge: 30,
          narrative: (s) => `${s.character.name} retoma con 30 las preguntas que dejó sin responder con 15. Más difíciles ahora.`,
          statDeltas: { emocional: 0.3 },
        },
      ],
      epitaphSeed: 'llegó tarde a algunas preguntas pero llegó',
    },
  ],
}

// ═══ EVENTO 10: DIRECCIÓN LABORAL (edad 16) ═══════════════════════════════════
const firstJobDirection: GameEventTemplate = {
  id:         'first_job_direction',
  triggerAge: 16,
  weight:     1,

  context: (state) => {
    const s       = state.stats
    const country = state.character.country
    const hasHobby = hasFlag(state, 'hobby_elegido')
    const hobbyRef = hasHobby ? ' Tu hobby podría tener peso en esta decisión.' : ''
    const countryCtx = ['Nigeria', 'India', 'México', 'Brasil'].includes(country)
      ? 'En tu contexto, trabajar a los 16 no es una opción sino una necesidad para muchos.'
      : 'Con 16 años, el dinero empieza a tener un significado diferente.'
    const topStat = Object.entries(s).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]
    const statCtx = topStat === 'fisico'    ? ' Tu cuerpo es tu mayor activo ahora.' :
                    topStat === 'carisma'   ? ' Sabes relacionarte. Eso tiene mercado.' :
                    topStat === 'creatividad' ? ' Tu creatividad puede generar valor.' : ''
    return `${countryCtx}${statCtx}${hobbyRef} ¿Qué hace ${state.character.name} con este momento?`
  },

  options: [
    {
      id:   'primer_trabajo',
      text: (_s) => 'Buscas trabajo. La independencia económica vale el sacrificio.',
      immediate: {
        narrative: (s) => {
          const country = s.character.country
          const jobType = s.stats.fisico > 7 ? 'trabajo físico de almacén'
            : s.stats.carisma > 7 ? 'trabajo de atención al cliente'
            : 'trabajo básico de hostelería'
          return `${s.character.name} consigue su primer trabajo: ${jobType} en ${country}. El dinero propio cambia algo.`
        },
        statDeltas: { ambicion: 0.4, disciplina: 0.3 },
        flags:      ['primer_trabajo_a_16', 'independencia_temprana'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `Con 20 años, ${s.character.name} lleva 4 años en el mercado laboral. Esa experiencia temprana vale.`,
          statDeltas: { ambicion: 0.2, disciplina: 0.2 },
          flags:      ['experiencia_laboral_temprana'],
        },
      ],
      memory: {
        id:   'memory_first_job',
        text: (_s) => 'El primer sueldo. La primera vez que el dinero era tuyo de verdad.',
      },
      epitaphSeed: 'entendió el valor del trabajo antes de entender el valor del descanso',
    },
    {
      id:   'centrar_estudios',
      text: (_s) => 'Te centras en los estudios. El trabajo puede esperar.',
      immediate: {
        narrative: (s) => `${s.character.name} invierte en conocimiento. El mercado laboral puede esperar. O eso espera.`,
        statDeltas: { logica: 0.3, disciplina: 0.3 },
        flags:      ['prioriza_estudios_16'],
      },
      delayed: [
        {
          triggerAge: 22,
          narrative: (s) => `La inversión en estudios a los 16 da frutos a los 22. ${s.character.name} tiene base que otros no tienen.`,
          statDeltas: { logica: 0.3 },
          flags:      ['base_academica_solida'],
        },
      ],
      memory: {
        id:   'memory_studies_over_work',
        text: (_s) => 'La apuesta por el futuro cuando todos los demás ya ganaban dinero.',
      },
      epitaphSeed: 'apostó por el largo plazo cuando el corto plazo tentaba',
    },
    {
      id:   'equilibrio_estudios_trabajo',
      text: (_s) => 'Compaginas estudios y trabajo. No es fácil pero es posible.',
      immediate: {
        narrative: (s) => `${s.character.name} aprende a optimizar el tiempo. Unos meses agotadores. Una lección para toda la vida.`,
        statDeltas: { ambicion: 0.25, disciplina: 0.3, fisico: -0.1 },
        flags:      ['compagina_estudios_trabajo'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `Con 20 años, ${s.character.name} tiene experiencia y base académica. Esa combinación es rara.`,
          statDeltas: { ambicion: 0.2, disciplina: 0.15 },
        },
      ],
      memory: {
        id:   'memory_balance_work_study',
        text: (_s) => 'Aquellos años haciendo dos cosas a la vez. Exhausto pero vivo.',
      },
      epitaphSeed: 'nunca eligió entre aprender y ganar, y por eso hizo las dos',
    },
  ],
}

// ═══ EVENTO 11: PRESIÓN EXAMEN FINAL (edad 17) — condicional ══════════════════
const finalExamPressure: GameEventTemplate = {
  id:             'final_exam_pressure',
  triggerAge:     17,
  triggerFlags:   ['camino_academico_ciencias', 'camino_academico_humanidades'],
  weight:         0.8,

  context: (state) => {
    const isCiencias = hasFlag(state, 'camino_academico_ciencias')
    const examType   = isCiencias ? 'el examen de matemáticas que define el acceso a la carrera' : 'el trabajo de fin de bachillerato'
    return `La noche antes de ${examType}. ${state.character.name} lleva semanas preparando este momento. Mañana es el día.`
  },

  options: [
    {
      id:   'estudiar_toda_la_noche',
      text: (_s) => 'Estudias toda la noche. Una noche más no puede cambiar tanto las cosas.',
      immediate: {
        narrative: (s) => `${s.character.name} no duerme. A las 4 de la mañana, el cerebro deja de retener. A las 8, entra al examen.`,
        statDeltas: { disciplina: 0.3, fisico: -0.2 },
        flags:      ['noche_sin_dormir_examen'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => {
            const passed = s.stats.logica > 6
            return passed
              ? `${s.character.name} aprobó el examen. La noche sin dormir valió la pena. Quizás.`
              : `${s.character.name} no llegó a la nota que necesitaba. La noche sin dormir no ayudó. Hay que replantear.`
          },
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_all_nighter',
        text: (_s) => 'La noche antes del examen más importante hasta ese momento. El amanecer con el libro en la mano.',
      },
      epitaphSeed: 'se jugó el cuerpo por lo que creía que importaba',
    },
    {
      id:   'dormir_confiar',
      text: (_s) => 'Duermes. Lo que sabes ya está dentro. El descanso también importa.',
      immediate: {
        narrative: (s) => `${s.character.name} cierra los libros a las once. Mañana el cerebro necesita estar despejado.`,
        statDeltas: { disciplina: 0.2, estabilidad: 0.3 },
        flags:      ['confia_en_preparacion'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `${s.character.name} afrontó el examen descansado. La calma fue parte del resultado.`,
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_exam_sleep',
        text: (_s) => 'La noche que decidiste que el descanso era parte de la preparación. Tuviste razón.',
      },
      epitaphSeed: 'entendió que cuidarse también es parte del esfuerzo',
    },
    {
      id:   'llamar_amigo',
      text: (s) => hasFlag(s, 'tiene_amigo_infancia')
        ? `Llamas a ${npcName(s)}. Necesitas hablar con alguien.`
        : 'Llamas a alguien. Necesitas escuchar una voz conocida.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = hasFlag(s, 'tiene_amigo_infancia')
          return hasAmigo
            ? `${npcName(s)} está ahí. Una hora de conversación y ${s.character.name} entra al examen más tranquilo.`
            : `La conversación nocturna ayuda. ${s.character.name} no está solo en esto.`
        },
        statDeltas: { emocional: 0.3, carisma: 0.2 },
        flags:      ['apoyo_social_examen'],
      },
      delayed: [],
      memory: {
        id:   'memory_exam_call',
        text: (s) => hasFlag(s, 'tiene_amigo_infancia')
          ? `La llamada a ${npcName(s)} la noche antes del examen. A veces solo necesitas saber que alguien está ahí.`
          : 'La llamada nocturna antes del examen. La voz que necesitabas escuchar.',
      },
      epitaphSeed: 'supo que los logros solos no saben igual',
    },
  ],
}

// ═══ EVENTO 12: UMBRAL DE MAYORÍA DE EDAD (edad 18) ══════════════════════════
const adulthoodThreshold: GameEventTemplate = {
  id:         'adulthood_threshold',
  triggerAge: 18,
  weight:     1,

  context: (state) => {
    const hasAmigo = hasFlag(state, 'tiene_amigo_infancia')
    const amigoRef = hasAmigo ? ` ${npcName(state)} también cumple años este mes.` : ''
    return `${state.character.name} cumple 18 años.${amigoRef} La infancia y la adolescencia quedan atrás. A partir de ahora, cada decisión es tuya — y sus consecuencias, también. ¿Con qué mentalidad entras en la edad adulta?`
  },

  options: [
    {
      id:   'ambicioso',
      text: (_s) => 'Voy a construir algo grande. El mundo no me espera.',
      immediate: {
        narrative: (s) => `${s.character.name} entra en la adultez con los ojos abiertos y los puños apretados. Hay mucho por hacer. El tiempo empieza ahora.`,
        statDeltas: { ambicion: 0.5, riesgo: 0.2 },
        flags:      ['mentalidad_adulta_ambiciosa'],
      },
      delayed: [
        {
          triggerAge: 25,
          narrative: (s) => `Con 25 años, la ambición de ${s.character.name} ha encontrado algunos muros reales. Eso no la apaga. La afina.`,
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_18_ambitious',
        text: (_s) => 'Los 18 años. La certeza de que ibas a hacer algo grande. No sabías exactamente qué. Eso no importaba.',
      },
      epitaphSeed: 'entró en la adultez como si el mundo le debiera algo',
    },
    {
      id:   'cauto',
      text: (_s) => 'Paso a paso. Las decisiones precipitadas cuestan caro.',
      immediate: {
        narrative: (s) => `${s.character.name} observa antes de actuar. La madurez llega antes que la adultez en algunos. En él, llegaron juntas.`,
        statDeltas: { estabilidad: 0.4, disciplina: 0.3 },
        flags:      ['mentalidad_adulta_cauta'],
      },
      delayed: [
        {
          triggerAge: 30,
          narrative: (s) => `Con 30 años, la cautela de ${s.character.name} se llama experiencia. Evitó errores que otros pagaron caro.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_18_cautious',
        text: (_s) => 'Los 18 años con la convicción de que la prisa es el enemigo. No todos los de tu edad pensaban igual.',
      },
      epitaphSeed: 'midió antes de saltar y casi siempre llegó más lejos por eso',
    },
    {
      id:   'libre',
      text: (_s) => 'Primero quiero vivir. Ya habrá tiempo para ser responsable.',
      immediate: {
        narrative: (s) => `${s.character.name} elige la experiencia sobre el plan. La vida antes del proyecto de vida. Habrá quien no lo entienda.`,
        statDeltas: { creatividad: 0.3, emocional: 0.35, riesgo: 0.2 },
        flags:      ['mentalidad_adulta_libre'],
      },
      delayed: [
        {
          triggerAge: 28,
          narrative: (s) => `${s.character.name} con 28 tiene experiencias que otros no tienen. Y también cosas que otros sí. El balance es complejo.`,
          statDeltas: { emocional: 0.25 },
        },
      ],
      memory: {
        id:   'memory_18_free',
        text: (_s) => 'Los 18 años convencido de que vivir era la prioridad. Tenías razón. Y también te equivocabas.',
      },
      epitaphSeed: 'vivió antes de construir y construyó con lo que vivió',
    },
  ],
}

export const ADOLESCENCE_EVENTS: GameEventTemplate[] = [
  firstLove,
  academicDecision,
  pressureMoment,
  identityReflection,
  firstJobDirection,
  finalExamPressure,
  adulthoodThreshold,
]
