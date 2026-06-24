import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'

function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'alguien cercano'
}

// ═══ EVENTO 25: EL RETIRO PROFESIONAL (edad 51-60) ════════════════════════════
// The professional identity question: who are you without work?
// For characters who have (or had) a career — the most disorienting transition.
const retiroProfesional: GameEventTemplate = {
  id:              'retiro_profesional',
  triggerAge:      [51, 60],
  triggerAntiFlags: ['retiro_profesional_resuelto'],
  weight:          0.85,

  context: (state) => {
    const tieneEmpresa = hasFlag(state, 'empresa_propia_adulto') || hasFlag(state, 'autonomo_desde_joven')
    const esExperto    = hasFlag(state, 'experto_referencia')
    const esDirector   = hasFlag(state, 'rol_gestion')

    if (tieneEmpresa) {
      return `${state.character.name} lleva décadas construyendo algo propio. La pregunta ya no es si funciona — es cuánto tiempo más quiere seguir siendo la persona que lo sostiene.`
    }
    if (esExperto) {
      return `${state.character.name} es una referencia en su campo. Y sin embargo, la pregunta llega: ¿cuánto de lo que eres tiene que ver con lo que haces? No es fácil de responder cuando lo que haces es casi todo.`
    }
    if (esDirector) {
      return `${state.character.name} ha dirigido durante años. La organización funciona, el equipo sabe lo que hace. Y surge la pregunta que nadie del equipo se atreve a formular: ¿cuándo se va?`
    }
    return `Con más de cincuenta, la vida laboral de ${state.character.name} empieza a tener fecha de caducidad visible. No es urgente todavía. Pero ya no es lejano.`
  },

  options: [
    {
      id:   'jubilacion_plena',
      text: (_s) => 'Decides retirarte. Lo que viene ahora es tuyo de otra manera.',
      immediate: {
        narrative: (s) => {
          const tienePareja = hasFlag(s, 'construyendo_con_pareja')
          const sufijo = tienePareja
            ? ` Con pareja al lado, la nueva etapa tiene interlocutor.`
            : ` Solo, o con sus personas, ${s.character.name} empieza a aprender cómo llenar el tiempo que antes llenaba el trabajo.`
          return `${s.character.name} lo cierra. No con drama — con la claridad de quien sabe que esto era una fase y la fase terminó.${sufijo} La identidad tiene que rehacerse. No es poco.`
        },
        statDeltas: { estabilidad: 0.4, emocional: 0.35, ambicion: -0.2 },
        flags:      ['retiro_profesional_resuelto', 'jubilado_pleno'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años retirado, ${s.character.name} ha descubierto que el tiempo libre también exige estructura. No la del trabajo — una propia.`,
          statDeltas: { estabilidad: 0.2, creatividad: 0.15 },
        },
        {
          triggerAge: 65,
          narrative: (s) => `Con 65, ${s.character.name} mira la decisión de retirarse y la encuentra correcta. No porque fuera fácil — porque era la siguiente.`,
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_jubilacion',
        text: (_s) => 'El día que cerró la carpeta por última vez. Sin discurso, sin tarta. Solo el peso de saber que ya no volvería así.',
      },
      epitaphSeed: 'supo cuándo parar y tuvo el valor de hacerlo',
    },
    {
      id:   'reinvencion_tardia',
      text: (_s) => 'No te retiras. Cambias de forma. Lo que sabes ahora lo usas de otra manera.',
      immediate: {
        narrative: (s) => {
          const esMentor  = hasFlag(s, 'pilar_familiar') || hasFlag(s, 'experto_referencia')
          return esMentor
            ? `${s.character.name} empieza a traspasar lo que sabe. No como empresa, no como cargo — como transmisión. Enseñar tiene una satisfacción diferente a hacer.`
            : `${s.character.name} no se jubila — se transforma. Lo que construyó durante décadas lo convierte en otra cosa. Consultoría, mentoring, proyectos propios sin la presión del sueldo. Es más libre. También más incierto.`
        },
        statDeltas: { ambicion: 0.25, creatividad: 0.35, estabilidad: 0.1, emocional: 0.2 },
        flags:      ['retiro_profesional_resuelto', 'reinvencion_post_carrera'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.creatividad > 6
              ? `Tres años después, la reinvención de ${s.character.name} tiene resultados que no esperaba. El cambio de forma era lo que faltaba.`
              : `Tres años en la nueva etapa, ${s.character.name} sigue ajustando. Reinventarse cuesta. Vale la pena.`
          },
          statDeltas: (s) => s.stats.creatividad > 6
            ? { creatividad: 0.2, emocional: 0.2 }
            : { estabilidad: 0.2, emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_reinvencion_tardia',
        text: (_s) => 'Cuando decidiste que retirarte no era la única opción y buscaste la tercera. No todos la encuentran.',
      },
      epitaphSeed: 'descubrió que la segunda forma de hacer las cosas era la que más le iba',
    },
    {
      id:   'seguir_hasta_el_final',
      text: (_s) => 'No estás listo para parar. Mientras puedas, sigues.',
      immediate: {
        narrative: (s) => {
          const tieneRiesgo = s.stats.riesgo > 6
          return tieneRiesgo
            ? `${s.character.name} no concibe el retiro. La parada es para los que ya no tienen nada que hacer. Mientras el cuerpo aguante y la cabeza funcione, la respuesta es seguir.`
            : `${s.character.name} no toca el freno. No por negación — porque genuinamente no quiere parar. El trabajo da estructura, propósito, identidad. Quitarlo no es ganancia.`
        },
        statDeltas: { ambicion: 0.3, disciplina: 0.2, fisico: -0.1 },
        flags:      ['sigue_trabajando_madurez'],
      },
      delayed: [
        {
          triggerAge: 62,
          narrative: (s) => {
            return hasFlag(s, 'retiro_profesional_resuelto')
              ? `A los 62, ${s.character.name} ya ha tomado la decisión. Lo que viene es diferente.`
              : `Con 62, ${s.character.name} todavía no ha parado. El cuerpo empieza a opinar. Escucharle es cada vez más necesario.`
          },
          statDeltas: { fisico: -0.15, estabilidad: 0.1 },
          flags:      ['retiro_profesional_resuelto'],
        },
      ],
      memory: {
        id:   'memory_seguir_trabajando',
        text: (_s) => 'Los años en que todo el mundo esperaba que pararás y tú seguiste. No era cabezonería. Era identidad.',
      },
      epitaphSeed: 'no encontró razón para parar mientras pudo seguir',
    },
  ],
}

// ═══ EVENTO 26: EL PRIMER AVISO SERIO DEL CUERPO (edad 54-66) ════════════════
// The universal health moment: not necessarily a crisis, but the first time
// the body makes itself undeniable. The three paths are different ways of receiving the news.
const avisoSaludSerio: GameEventTemplate = {
  id:              'aviso_salud_serio',
  triggerAge:      [54, 66],
  triggerAntiFlags: ['aviso_salud_resuelto'],
  weight:          0.9,

  context: (state) => {
    const hasAmbicion = hasFlag(state, 'mentalidad_adulta_ambiciosa') || hasFlag(state, 'sigue_trabajando_madurez')

    if (hasAmbicion) {
      return `El cuerpo de ${state.character.name} lleva décadas pagando la cuenta de la ambición. La primera vez que hace sonar la alarma seria, el aviso no llega con tacto.`
    }
    return `A esta edad, los cuerpos empiezan a hablar más alto. El de ${state.character.name} lleva tiempo enviando señales. Ahora manda una que no se puede ignorar: revisiones, diagnóstico, una conversación con el médico que cambia algo.`
  },

  options: [
    {
      id:   'cambio_radical_habitos',
      text: (_s) => 'Lo tomas en serio. El aviso reordena las prioridades.',
      immediate: {
        narrative: (s) => {
          const tieneApoyo = hasFlag(s, 'construyendo_con_pareja') || hasFlag(s, 'pilar_familiar')
          return tieneApoyo
            ? `${s.character.name} recibe el diagnóstico con sus personas cerca. El cambio viene apoyado — dieta, sueño, ritmo. No perfectamente. Pero sí.`
            : `${s.character.name} toma el aviso como la señal que era. Cambia lo que puede cambiar. Algunos hábitos ceden. Otros resultan más difíciles de lo esperado. El proceso no es lineal, pero la dirección sí.`
        },
        statDeltas: { fisico: 0.4, estabilidad: 0.25, disciplina: 0.3, emocional: 0.1 },
        flags:      ['aviso_salud_resuelto', 'cambio_habitos_tardio'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después del aviso, ${s.character.name} nota la diferencia. No toda la que esperaba. Suficiente para saber que valió la pena.`,
          statDeltas: { fisico: 0.2, emocional: 0.15 },
        },
        {
          triggerAge: 65,
          narrative: (s) => `Con 65, ${s.character.name} está en mejor forma que a los 55. No es un logro menor. Es el resultado de una decisión sostenida en el tiempo.`,
          statDeltas: { fisico: 0.15, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_aviso_salud_positivo',
        text: (_s) => 'El diagnóstico que llegó a tiempo y que tomaste en serio. El cuerpo te dio una oportunidad. La aprovechaste.',
      },
      epitaphSeed: 'cuando el cuerpo habló, supo escuchar antes de que fuera tarde',
    },
    {
      id:   'minimizar_seguir',
      text: (_s) => 'Lo gestionas, pero no cambias el fondo. La vida sigue igual.',
      immediate: {
        narrative: (s) => `${s.character.name} acude a las revisiones, toma lo que hay que tomar, hace lo que hay que hacer — dentro de lo razonable. Pero el ritmo de fondo no cambia. Es un parche con buena intención y límites claros.`,
        statDeltas: { estabilidad: 0.1, fisico: 0.05 },
        flags:      ['aviso_salud_minimizado'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.fisico > 5
              ? `Tres años después, ${s.character.name} sigue más o menos en el mismo punto. Sin mejora notable, sin deterioro grave. A veces la gestión mínima es suficiente.`
              : `Tres años después, el aviso que ${s.character.name} no tomó del todo en serio vuelve con más peso. El cuerpo insiste.`
          },
          flags:      ['aviso_salud_resuelto'],
          statDeltas: (s) => s.stats.fisico > 5
            ? { fisico: 0.05 }
            : { fisico: -0.2, emocional: 0.2, estabilidad: -0.1 },
        },
      ],
      memory: {
        id:   'memory_aviso_salud_gestionado',
        text: (_s) => 'Cuando el cuerpo avisó y tú lo gestionaste sin cambiar demasiado. No fue la decisión heroica. Fue la cómoda.',
      },
      epitaphSeed: 'gestionó los avisos con sensatez y, en ocasiones, con demasiada comodidad',
    },
    {
      id:   'transformacion_existencial',
      text: (_s) => 'El diagnóstico lo cambia todo. No solo los hábitos — la forma de ver.',
      immediate: {
        narrative: (s) => {
          const hasCrisis40 = hasFlag(s, 'crisis_cuarenta_aplazada')
          return hasCrisis40
            ? `Lo que ${s.character.name} aplazó a los cuarenta llega ahora por otra puerta. El cuerpo hace lo que la mente no quería: abrir la pregunta de qué queda por vivir y cómo se quiere vivir.`
            : `El aviso médico actúa en ${s.character.name} como un clarificador. De repente, hay cosas que importan mucho y cosas que ya no importan nada. La línea entre unas y otras se vuelve nítida.`
        },
        statDeltas: { emocional: 0.5, ambicion: 0.2, riesgo: 0.15, estabilidad: 0.1, fisico: 0.2 },
        flags:      ['aviso_salud_resuelto', 'transformacion_por_salud'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después de que el cuerpo redefiniera las prioridades, ${s.character.name} vive de otra forma. No perfecta. Más honesta.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_aviso_transformacion',
        text: (_s) => 'Cuando el diagnóstico te hizo revisar todo lo que dabas por sentado. No fue un regalo. Fue un empujón que funcionó.',
      },
      epitaphSeed: 'dejó que el miedo al final le mostrara cómo quería vivir antes de llegar a él',
    },
  ],
}

// ═══ EVENTO 27: EL ÚLTIMO PROGENITOR (edad 57-68) ══════════════════════════════
// The orphan moment — losing the last parent. Universal and irreversible.
// Changes the character's position in the generational chain.
const ultimoProgenitor: GameEventTemplate = {
  id:              'ultimo_progenitor',
  triggerAge:      [57, 68],
  triggerAntiFlags: ['huerfano_procesado'],
  triggerFlags:    ['perdida_progenitor_procesada'],
  weight:          0.85,

  context: (state) => {
    const hasLegado = hasFlag(state, 'pilar_familiar') || hasFlag(state, 'cuarenta_integrados')

    if (hasLegado) {
      return `Cuando muere el último progenitor, ${state.character.name} se convierte en la generación más vieja de su árbol. No hay nadie por encima ya. Eso cambia el peso de todo.`
    }
    return `El segundo progenitor de ${state.character.name} muere. Con él o ella se va la última persona que te conoció antes de que fueras quien eres ahora. Eso es una pérdida diferente a todas las demás.`
  },

  options: [
    {
      id:   'raiz_que_sostiene',
      text: (_s) => 'Eres el eslabón ahora. Llevas lo que ellos te dieron hacia adelante.',
      immediate: {
        narrative: (s) => {
          const hasAmigo  = !!getFirstFriend(s)
          const testigo   = hasAmigo ? ` ${npcName(s)}, que conoció a la familia, está presente.` : ''
          return `${s.character.name} llora lo que tiene que llorar y después asume la nueva posición. La última persona que le vio nacer ya no está.${testigo} Ahora es el principio de algo para quienes vienen detrás.`
        },
        statDeltas: { emocional: 0.45, estabilidad: 0.3, carisma: 0.15 },
        flags:      ['huerfano_procesado', 'eslabon_generacional'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} nota que ha adoptado gestos de quien perdió. No es imitación — es herencia. La más silenciosa.`,
          statDeltas: { emocional: 0.2 },
          flags:      ['herencia_asumida'],
        },
        {
          triggerAge: 65,
          narrative: (s) => `Con 65, ${s.character.name} es la memoria viva de personas que ya no están. Ese rol tiene un peso y una responsabilidad que no eligió pero que lleva.`,
          statDeltas: { emocional: 0.15, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_ultimo_progenitor_herencia',
        text: (_s) => 'El día en que te quedaste sin la persona que te conoció antes de que fueras quien eres. Y decidiste llevar lo que te dio.',
      },
      epitaphSeed: 'cuando se quedó huérfano, eligió ser raíz para los que venían después',
    },
    {
      id:   'cuentas_pendientes',
      text: (_s) => 'La relación era complicada. La muerte cierra lo que no se pudo resolver.',
      immediate: {
        narrative: (s) => {
          const tieneCrisis30 = hasFlag(s, 'crisis_identidad_treinta')
          return tieneCrisis30
            ? `${s.character.name} lleva décadas cargando la relación difícil con su progenitor. La muerte no resuelve lo que no se resolvió en vida — pero cierra la posibilidad de que se resuelva. Eso duele de otra manera.`
            : `La muerte del último progenitor de ${s.character.name} llega con cuentas abiertas. Cosas que se dijeron, cosas que no se dijeron. El duelo no es solo por la persona — es por las conversaciones que ya no pueden ocurrir.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.1, logica: 0.15 },
        flags:      ['huerfano_procesado', 'duelo_complejo'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después, ${s.character.name} procesa lo que no pudo decir. A veces el duelo más largo es el de las relaciones no resueltas.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
          flags:      ['duelo_complejo_procesado'],
        },
      ],
      memory: {
        id:   'memory_ultimo_progenitor_cuentas',
        text: (_s) => 'Cuando murió la última persona con quien aún tenías algo pendiente. El silencio que quedó era más ruidoso que cualquier conversación.',
      },
      epitaphSeed: 'aprendió a cerrar lo que no pudo resolverse y a vivir con eso',
    },
    {
      id:   'liberacion_silenciosa',
      text: (_s) => 'Algo se asienta con esta muerte. No sabes exactamente qué, pero lo notas.',
      immediate: {
        narrative: (s) => `La muerte del último progenitor de ${s.character.name} llega con una quietud inesperada. No es alivio exactamente. Es algo más difícil de nombrar: la sensación de que una etapa de la vida — la de tener padres — ha terminado oficialmente. Con todo lo que eso significa.`,
        statDeltas: { emocional: 0.35, estabilidad: 0.35, ambicion: 0.1 },
        flags:      ['huerfano_procesado', 'cierre_generacional'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} se da cuenta de que mira hacia atrás menos. No por olvido — porque ya ha integrado lo que había que integrar.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.1 },
        },
      ],
      memory: {
        id:   'memory_ultimo_progenitor_cierre',
        text: (_s) => 'La muerte que cerró una era. No de forma dramática. De forma definitiva.',
      },
      epitaphSeed: 'supo reconocer el cierre de una era y encontró paz en ello',
    },
  ],
}

// ═══ EVENTO 28: LA RECONCILIACIÓN O EL CIERRE (edad 58-67) ═══════════════════
// A severed relationship that has aged — sibling, old friend, former partner.
// The three paths: reconcile, close with peace, or leave it unresolved.
const reconciliacionOCierre: GameEventTemplate = {
  id:              'reconciliacion_o_cierre',
  triggerAge:      [58, 67],
  triggerAntiFlags: ['relacion_antigua_resuelta'],
  weight:          0.8,

  context: (state) => {
    const hasRival = state.friends.find(f => f.role === 'rival')
    const hasAmigo = state.friends.find(f => f.role === 'friend' && f.status === 'distante')
    const nombre   = (hasRival ?? hasAmigo)?.name ?? 'alguien del pasado'

    if (hasRival) {
      return `${state.character.name} y ${nombre} llevan mucho tiempo sin hablar bien. La rivalidad envejeció. Lo que quedó tiene menos filo, pero sigue ahí. A esta edad, las cosas no resueltas pesan diferente.`
    }
    if (hasAmigo) {
      return `${nombre} y ${state.character.name} se distanciaron. No de golpe — de esa forma silenciosa en que las distancias se instalan sin que nadie las declare. A los sesenta, esa distancia tiene un sabor específico.`
    }
    return `Hay una relación del pasado de ${state.character.name} que sigue sin resolver. No todos los días —pero sí en los momentos quietos. A esta edad, lo que no se cierra tiene tendencia a quedarse.`
  },

  options: [
    {
      id:   'reconciliacion_real',
      text: (_s) => 'Buscas el contacto. No para rescatar lo que fue — para cerrar bien lo que es.',
      immediate: {
        narrative: (s) => {
          const hasRival = s.friends.find(f => f.role === 'rival')
          const nombre   = hasRival?.name ?? npcName(s)
          return hasRival
            ? `${s.character.name} escribe a ${nombre}. No una declaración — solo una apertura. La respuesta tarda días. Llega. No es perfecta. Es suficiente. A cierta edad, suficiente es mucho.`
            : `${s.character.name} retoma el contacto. La conversación no recupera los años perdidos — pero sí algo de lo que había antes de que se perdieran. Eso ya es más de lo esperado.`
        },
        statDeltas: { emocional: 0.45, carisma: 0.25, estabilidad: 0.2 },
        flags:      ['relacion_antigua_resuelta', 'reconciliacion_lograda'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después de la reconciliación, la relación no es lo que era a los veinte. Es algo diferente. Más honesta, más elegida.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_reconciliacion',
        text: (_s) => 'El mensaje que tardaste años en enviar. La respuesta que no esperabas recibir. Lo que vino después fue imperfecto. Y fue real.',
      },
      epitaphSeed: 'tendió la mano cuando era más difícil que fácil hacerlo',
    },
    {
      id:   'cierre_limpio',
      text: (_s) => 'No buscas el reencuentro. Cierras en paz, solo, sin necesitar que lo sepan.',
      immediate: {
        narrative: (s) => `${s.character.name} decide que no necesita la conversación para cerrar. Lo hace internamente — sin dramatismo, sin carta que no se enviará. Perdona lo que haya que perdonar, incluido lo propio. A veces el cierre no requiere al otro.`,
        statDeltas: { emocional: 0.4, estabilidad: 0.35 },
        flags:      ['relacion_antigua_resuelta', 'cierre_en_paz'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} nota que ya no le ocupa espacio lo que cerraste. Eso es lo que el cierre real hace: deja sitio.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.1 },
        },
      ],
      memory: {
        id:   'memory_cierre_en_paz',
        text: (_s) => 'Cuando decidiste soltar lo que no se iba a resolver. Sin ceremonia. Con claridad.',
      },
      epitaphSeed: 'aprendió que algunos cierres ocurren solo por dentro, y son los más limpios',
    },
    {
      id:   'dejar_sin_resolver',
      text: (_s) => 'No mueves nada. Hay cosas que se quedan como están.',
      immediate: {
        narrative: (s) => `${s.character.name} no actúa. No por cobardía — por convicción de que algunas cosas ya no tienen solución que merezca el coste. La distancia se vuelve permanente sin que nadie lo declare. También eso es una decisión.`,
        statDeltas: { estabilidad: 0.1 },
        flags:      ['relacion_sin_resolver'],
      },
      delayed: [
        {
          triggerAge: 68,
          narrative: (s) => {
            return hasFlag(s, 'relacion_antigua_resuelta')
              ? `La relación que ${s.character.name} dejó sin resolver encontró su propio cierre con el tiempo.`
              : `Con 68, lo que no se resolvió sigue sin resolverse. No todo necesita clausura. Aunque a veces pese.`
          },
          flags:      ['relacion_antigua_resuelta'],
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_relacion_sin_resolver',
        text: (_s) => 'Lo que decidiste no resolver. A veces es sabiduría. A veces es peso que se lleva sin nombre.',
      },
      epitaphSeed: 'cargó algunas preguntas sin respuesta porque no todas merecen el coste de la respuesta',
    },
  ],
}

// ═══ EVENTO 29: EL LEGADO ACTIVO (edad 60-68) ════════════════════════════════
// What am I leaving behind? The deliberate act of passing something on —
// knowledge, relationships, a project, a way of being.
const legadoActivo: GameEventTemplate = {
  id:              'legado_activo',
  triggerAge:      [60, 68],
  triggerAntiFlags: ['legado_definido'],
  weight:          0.8,

  context: (state) => {
    const esExperto      = hasFlag(state, 'experto_referencia') || hasFlag(state, 'reinvencion_post_carrera')
    const tieneEmpresa   = hasFlag(state, 'empresa_propia_adulto')
    const esEslabon      = hasFlag(state, 'eslabon_generacional')

    if (tieneEmpresa) {
      return `${state.character.name} ha construido algo que existe más allá de él. La pregunta ya no es si sobrevivirá — es a quién se lo traspasa y cómo.`
    }
    if (esExperto) {
      return `${state.character.name} sabe cosas que no están escritas en ningún sitio. La pregunta es si se quedan con él o encuentran un destino.`
    }
    if (esEslabon) {
      return `${state.character.name} es ahora la memoria de su familia. Lo que sabe sobre las personas que vinieron antes, la forma de hacer las cosas, los valores que se transmitieron sin declararse — todo eso necesita destino.`
    }
    return `Con los sesenta en el horizonte cercano, ${state.character.name} empieza a pensar en lo que va a quedar de lo que ha hecho. No en términos de fama — en términos de continuidad.`
  },

  options: [
    {
      id:   'mentor_de_verdad',
      text: (_s) => 'Encuentras a alguien a quien traspasar lo que sabes. Enseñar bien es la mejor herencia.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = !!getFirstFriend(s)
          const ref      = hasAmigo ? ` No es ${npcName(s)} — es alguien más joven, que todavía tiene preguntas que ${s.character.name} ya respondió.` : ''
          return `${s.character.name} identifica a quien necesita lo que sabe.${ref} No es una relación de jefe a empleado ni de maestro a alumno formal. Es una transferencia de lo que no sale en los libros — los errores, los atajos, los límites que aprendió a golpes.`
        },
        statDeltas: { carisma: 0.3, emocional: 0.45, ambicion: 0.15, estabilidad: 0.2 },
        flags:      ['legado_definido', 'mentor_activo'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `Tres años de mentoring. ${s.character.name} ha recibido más de lo que ha dado — eso es lo que nadie te explica antes de empezar a enseñar.`,
          statDeltas: { emocional: 0.25, carisma: 0.1 },
        },
      ],
      memory: {
        id:   'memory_mentor',
        text: (_s) => 'La persona a quien le traspasaste lo que más te costó aprender. Verla crecer fue lo mejor de lo que construiste.',
      },
      epitaphSeed: 'entendió que lo mejor de lo que sabía era lo que podía dar',
    },
    {
      id:   'proyecto_permanente',
      text: (_s) => 'Creas algo que va a durar más que tú. Una fundación, un archivo, un proyecto comunitario.',
      immediate: {
        narrative: (s) => {
          const tieneRecursos = s.economy.liquidez > 10000
          return tieneRecursos
            ? `${s.character.name} tiene los recursos y la claridad. Monta algo que no depende de que él siga activo para funcionar. Es el proyecto más consciente de su vida — porque sabe exactamente para qué existe.`
            : `${s.character.name} lanza algo sin los recursos perfectos. Lo importante no era esperar a tenerlos — era empezar. El proyecto existe ahora. Pequeño, pero real.`
        },
        statDeltas: { ambicion: 0.35, carisma: 0.2, emocional: 0.3 },
        flags:      ['legado_definido', 'proyecto_legado'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `Cuatro años después, el proyecto de ${s.character.name} tiene vida propia. Ya no lo necesita a él para seguir. Eso es exactamente lo que buscaba.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_proyecto_legado',
        text: (_s) => 'Cuando pusiste en marcha algo pensado para funcionar sin ti. La primera vez que el futuro no dependía de tu presencia.',
      },
      epitaphSeed: 'construyó algo que no necesitaba de él para seguir existiendo',
    },
    {
      id:   'vivir_sin_legado',
      text: (_s) => 'No piensas en el legado. Vives el presente con lo que tienes.',
      immediate: {
        narrative: (s) => `${s.character.name} no se preocupa por lo que va a quedar. No por negligencia — por convicción de que la obsesión con el legado es una trampa del ego. Lo que se haga bien ya tendrá su efecto. No hace falta gestionarlo.`,
        statDeltas: { estabilidad: 0.3, emocional: 0.2 },
        flags:      ['legado_definido', 'legado_no_buscado'],
      },
      delayed: [
        {
          triggerAge: 70,
          narrative: (s) => `Con 70, ${s.character.name} descubre que dejó huella donde menos lo planificó. El legado sin gestionar también existe — solo que llega por donde no esperabas.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_sin_legado',
        text: (_s) => 'Los años en que decidiste no gestionar lo que ibas a dejar. Resultó que dejaste cosas igualmente.',
      },
      epitaphSeed: 'vivió sin buscar su huella y la encontró donde no había mirado',
    },
  ],
}

// ═══ EVENTO 30: EL INVENTARIO DE LOS SESENTA (edad 62-69) ════════════════════
// The final big stocktake. Not like the one at 30 or 40 —
// this one has the weight of knowing that the big decisions are mostly made.
const inventarioSesenta: GameEventTemplate = {
  id:              'inventario_sesenta',
  triggerAge:      [62, 69],
  triggerAntiFlags: ['inventario_sesenta_cerrado'],
  weight:          0.95,

  context: (state) => {
    const hasPaz30   = hasFlag(state, 'treinta_con_claridad')
    const hasPaz40   = hasFlag(state, 'cuarenta_integrados')
    const hasCambio  = hasFlag(state, 'cambio_en_cuarenta')
    const hasLegado  = hasFlag(state, 'mentor_activo') || hasFlag(state, 'proyecto_legado')

    if (hasPaz30 && hasPaz40) {
      return `${state.character.name} ya pasó por este ejercicio dos veces. A los treinta y a los cuarenta. Esta vez es diferente: las grandes decisiones están tomadas. Lo que queda por vivir es real pero más corto. Esa asimetría cambia la pregunta.`
    }
    if (hasCambio) {
      return `${state.character.name} cambió de dirección en la crisis de los cuarenta. Ahora, con más de sesenta, toca ver si ese cambio fue lo correcto. No para juzgarlo — para integrarlo.`
    }
    if (hasLegado) {
      return `${state.character.name} tiene cosas en marcha que van a durar. Con los sesenta bien pasados, la pregunta que le queda no es qué ha hecho — es cómo quiere vivir lo que queda.`
    }
    return `Con más de sesenta años, ${state.character.name} hace el balance definitivo. No el de los treinta, que era "¿qué quiero?". No el de los cuarenta, que era "¿quién soy?". Este es diferente: ¿lo que hice fue lo que quería hacer?`
  },

  options: [
    {
      id:   'paz_real',
      text: (_s) => 'Sí. Con todo lo que faltó y todo lo que sobró — fue tuyo.',
      immediate: {
        narrative: (s) => {
          const hasDuelo   = hasFlag(s, 'duelo_completado') || hasFlag(s, 'duelo_complejo_procesado')
          const hasMentor  = hasFlag(s, 'mentor_activo')
          if (hasMentor) {
            return `${s.character.name} hace el inventario y lo que ve no es perfecto — nunca lo fue. Pero hay personas a las que influyó, cosas que se construyeron, vínculos que se eligieron. La suma tiene nombre. El nombre es una vida.`
          }
          return hasDuelo
            ? `${s.character.name} ha perdido personas, ha cerrado capítulos difíciles, ha cambiado de dirección y de opinión. El balance no es de triunfos — es de lo vivido. Y lo vivido tiene peso y tiene textura. Es suficiente.`
            : `${s.character.name} lo mira todo y reconoce algo sin romantizarlo: esto fue su vida. Con sus huecos y sus llenos. No cambiaría demasiado. No porque fuera perfecto — porque fue honesto.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.45, ambicion: 0.1 },
        flags:      ['inventario_sesenta_cerrado', 'sesenta_con_paz'],
      },
      delayed: [
        {
          triggerAge: 70,
          narrative: (s) => `Al llegar a los setenta, ${s.character.name} no carga preguntas pendientes. Lo que hay que haber hecho, está hecho. Lo que hay que haber dicho, está dicho. Eso no es poco.`,
          statDeltas: { estabilidad: 0.2, emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_inventario_sesenta_paz',
        text: (_s) => 'Cuando miraste atrás y reconociste que lo que había era tuyo. No perfecto. Tuyo.',
      },
      epitaphSeed: 'llegó a los sesenta y reconoció su propia vida sin necesidad de cambiarla',
    },
    {
      id:   'redefinicion_tardia',
      text: (_s) => 'Todavía hay algo que quieres que sea diferente. No es tarde para eso.',
      immediate: {
        narrative: (s) => {
          const hasCrisis40 = hasFlag(s, 'crisis_llegada_tarde')
          return hasCrisis40
            ? `${s.character.name} lleva décadas aplazando algo. Con más de sesenta, la última oportunidad real de cambiarlo es ahora — después vendrá la resignación o la aceptación, pero no la acción. Da el paso.`
            : `${s.character.name} identifica lo que todavía puede cambiar y decide cambiarlo. No con urgencia de joven — con la determinación de quien ya no tiene tiempo para los rodeos.`
        },
        statDeltas: { ambicion: 0.35, riesgo: 0.25, emocional: 0.3, estabilidad: -0.1 },
        flags:      ['inventario_sesenta_cerrado', 'redefinicion_sesenta'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.ambicion > 6
              ? `Tres años después de la redefinición tardía, ${s.character.name} no arrepiente el cambio. La dificultad fue proporcional a la ganancia.`
              : `Tres años después, el cambio que ${s.character.name} intentó a los sesenta no salió exactamente como esperaba. Pero fue mejor que no intentarlo.`
          },
          statDeltas: (s) => s.stats.ambicion > 6
            ? { emocional: 0.25, estabilidad: 0.2 }
            : { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_redefinicion_sesenta',
        text: (_s) => 'El cambio que hiciste cuando muchos dirían que era tarde. Fue la decisión más lúcida de los últimos años.',
      },
      epitaphSeed: 'demostró que nunca es del todo tarde para ser más honesto con lo que uno es',
    },
    {
      id:   'aceptacion_con_sombras',
      text: (_s) => 'Hay cosas que habrías hecho distinto. Las aceptas sin dramatizarlas.',
      immediate: {
        narrative: (s) => `${s.character.name} no reescribe. Hubo caminos no tomados, personas que se perdieron, decisiones que costaron más de lo previsto. El balance no es luminoso del todo. Tampoco oscuro. Es real. Y lo real, a esta edad, tiene más valor que la narrativa perfecta.`,
        statDeltas: { emocional: 0.4, estabilidad: 0.3, logica: 0.15 },
        flags:      ['inventario_sesenta_cerrado', 'sesenta_con_sombras'],
      },
      delayed: [
        {
          triggerAge: 70,
          narrative: (s) => `Con setenta, ${s.character.name} ha hecho las paces con las sombras que quedaron. No las borra — las integra. Eso también es una forma de paz.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_sesenta_con_sombras',
        text: (_s) => 'Cuando hiciste el balance y no fue todo lo que esperabas, y lo aceptaste sin caer en la amargura. Eso es más difícil de lo que parece.',
      },
      epitaphSeed: 'integró sus sombras sin romantizarlas y sin dejar que lo definieran',
    },
  ],
}

export const MATURITY_EVENTS: GameEventTemplate[] = [
  retiroProfesional,
  avisoSaludSerio,
  ultimoProgenitor,
  reconciliacionOCierre,
  legadoActivo,
  inventarioSesenta,
]
