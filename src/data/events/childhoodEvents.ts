import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'
import { BEST_FRIEND_PARALLEL_ARC } from '../npcs/npcProfiles'

// ─── Helper ───────────────────────────────────────────────────────────────────
function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'tu amigo'
}

function dominantPhysicalStat(state: GameState): boolean {
  const s = state.stats
  return s.fisico >= s.logica && s.fisico >= s.creatividad
}
function dominantLogicStat(state: GameState): boolean {
  const s = state.stats
  return !dominantPhysicalStat(state) && s.logica >= s.creatividad
}

// ═══ EVENTO 1: PRIMER AMIGO (edad 6) ══════════════════════════════════════════
const firstFriend: GameEventTemplate = {
  id:         'first_friend',
  triggerAge: 6,
  weight:     1,

  context: (state) => {
    const name = state.character.name
    const country = state.character.country
    if (['España', 'Portugal', 'Italia', 'Francia'].includes(country)) {
      return `Con 6 años, ${name} llega al colegio un lunes y en el patio hay un niño que juega solo con un balón gastado. Nadie le hace caso. Os miráis.`
    }
    if (['Nigeria', 'Ghana', 'Senegal', 'Kenia', 'Camerún'].includes(country)) {
      return `Con 6 años, ${name} llega al colegio por primera vez. Bajo el sol de la mañana, hay un niño que te observa desde lejos con curiosidad directa.`
    }
    return `Con 6 años, ${name} entra al colegio por primera vez. En el patio hay alguien que podría cambiarlo todo.`
  },

  options: [
    {
      id:   'acercarse',
      text: (_s) => 'Te acercas y le preguntas su nombre. La curiosidad puede más que el miedo.',
      immediate: {
        narrative: (s) => `${s.character.name} se acerca. "¿Cómo te llamas?" Es tan simple como eso. El mundo tiene uno más.`,
        statDeltas:  { carisma: 0.3, emocional: 0.2 },
        flags:       ['tiene_amigo_infancia', 'extrovertido_infancia'],
        generateNPC: {
          role:        'friend',
          namePool:    [],
          statProfile: { carisma: 5.5, emocional: 6, estabilidad: 5 },
          arcProfile:  'hijo_de_obrero',
          parallelArc: BEST_FRIEND_PARALLEL_ARC,
        },
      },
      delayed: [
        {
          triggerFlag:       'school_conflict_fired',
          narrative:         (s) => `${npcName(s)} te recuerda aquella vez. "Siempre supe que eras de los buenos", te dice.`,
          statDeltas:        { emocional: 0.2 },
        },
        {
          triggerYearsAfter: 12,
          narrative:         (s) => `${npcName(s)} y tú lleváis doce años siendo amigos. Pocas cosas duran tanto.`,
          flags:             ['amistad_larga'],
        },
      ],
      memory: {
        id:   'memory_first_friend',
        text: (s) => `La primera vez que ${npcName(s)} te miró, supiste que algo empezaba.`,
      },
      epitaphSeed: 'encontró un amigo antes de entender lo que esa palabra significa',
    },
    {
      id:   'observar',
      text: (_s) => 'Le observas durante días antes de hablar. Cuando lo haces, ya le conoces.',
      immediate: {
        narrative: (s) => `${s.character.name} espera. Observa. Cuando por fin habla, tiene algo que decir.`,
        statDeltas:  { emocional: 0.3, logica: 0.2 },
        flags:       ['tiene_amigo_infancia', 'observador_infancia'],
        generateNPC: {
          role:        'friend',
          namePool:    [],
          statProfile: { logica: 6, emocional: 6.5, disciplina: 5 },
          arcProfile:  'hijo_de_academico',
          parallelArc: BEST_FRIEND_PARALLEL_ARC,
        },
      },
      delayed: [
        {
          triggerYearsAfter: 8,
          narrative:         (s) => `${npcName(s)} dice que siempre supo que eras diferente. "Te tomaste tu tiempo. Eso vale."`,
          statDeltas:        { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_observing_friend',
        text: (s) => `Pasaste días mirando a ${npcName(s)} antes de hablar. Fue la decisión correcta.`,
      },
      epitaphSeed: 'eligió observar antes de actuar, y eso le definió',
    },
    {
      id:   'solo',
      text: (_s) => 'Prefieres jugar solo. Los grupos siempre complican las cosas.',
      immediate: {
        narrative: (s) => `${s.character.name} vuelve a su mundo interior. Hay una calma en eso que los demás no entienden.`,
        statDeltas:  { estabilidad: 0.3, logica: 0.25 },
        flags:       ['introvertido_infancia'],
      },
      delayed: [
        {
          triggerAge:   10,
          narrative:    (_s) => `En el colegio, los que siempre juegan solos se convierten en blanco fácil. Hoy te toca.`,
          flags:        ['conflicto_solitario'],
        },
        {
          triggerYearsAfter: 7,
          narrative:    (s) => `Con 13 años, ${s.character.name} comprende que la soledad elegida es diferente a la impuesta.`,
          statDeltas:   { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_alone_child',
        text: (_s) => 'Aquel patio de colegio donde jugabas solo. No era tristeza. Era concentración.',
      },
      epitaphSeed: 'aprendió pronto que la mejor compañía a veces eres tú mismo',
    },
  ],
}

// ═══ EVENTO 2: DESCUBRIMIENTO DE HOBBY (edad 8) ════════════════════════════════
const hobbyDiscovery: GameEventTemplate = {
  id:         'hobby_discovery',
  triggerAge: 8,
  weight:     1,

  context: (state) => {
    const hasAmigo = hasFlag(state, 'tiene_amigo_infancia')
    const conAmigo = hasAmigo ? ` ${npcName(state)} está ahí también.` : ''
    if (dominantPhysicalStat(state)) {
      return `Con 8 años, ${state.character.name} siente que el cuerpo pide movimiento, competición.${conAmigo} ¿Qué eliges?`
    }
    if (dominantLogicStat(state)) {
      return `Con 8 años, la mente de ${state.character.name} busca desafíos con solución lógica.${conAmigo} ¿Qué eliges?`
    }
    return `Con 8 años, ${state.character.name} siente que necesita crear, expresar, inventar.${conAmigo} ¿Qué eliges?`
  },

  options: [
    {
      id:   'hobby_a',
      text: (state) => {
        if (dominantPhysicalStat(state)) return 'Fútbol con los niños del barrio.'
        if (dominantLogicStat(state))    return 'Ajedrez en el club del colegio.'
        return 'Dibujar en todos los cuadernos que encuentras.'
      },
      immediate: {
        narrative: (state) => {
          if (dominantPhysicalStat(state)) {
            return `El balón. El campo. El equipo. ${state.character.name} descubre que puede correr más que la mayoría.`
          }
          if (dominantLogicStat(state)) {
            return `El ajedrez. Las piezas que se mueven con lógica. ${state.character.name} pierde las primeras diez partidas y aprende más que nunca.`
          }
          return `El papel en blanco. El lápiz. ${state.character.name} dibuja mundos que no existen todavía.`
        },
        statDeltas: (state) => {
          if (dominantPhysicalStat(state)) return { fisico: 0.4, carisma: 0.2 }
          if (dominantLogicStat(state))    return { logica: 0.4, disciplina: 0.2 }
          return { creatividad: 0.4, disciplina: 0.2 }
        },
        flags: ['hobby_elegido', 'hobby_principal_a'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (state) => {
            if (dominantPhysicalStat(state)) return `${state.character.name} lleva 4 años jugando al fútbol. El entrenador habla de nivel regional.`
            if (dominantLogicStat(state))    return `${state.character.name} lleva 4 años con el ajedrez. Ganó su primer torneo escolar.`
            return `${state.character.name} lleva 4 años dibujando. Sus cuadernos son un mundo propio.`
          },
          flags: ['hobby_desarrollado'],
        },
      ],
      memory: {
        id:   'memory_hobby_a',
        text: (state) => {
          if (dominantPhysicalStat(state)) return 'El primer gol. El barro en las rodillas. La satisfacción pura.'
          if (dominantLogicStat(state))    return 'Aquella primera partida que ganaste después de meses perdiendo.'
          return 'Aquel primer dibujo que alguien miró con algo diferente en los ojos.'
        },
      },
      epitaphSeed: 'encontró su primer lenguaje propio con 8 años',
    },
    {
      id:   'hobby_b',
      text: (state) => {
        if (dominantPhysicalStat(state)) return 'Natación en la piscina municipal.'
        if (dominantLogicStat(state))    return 'Construir cosas con lo que encuentras.'
        return 'Inventar historias y contárselas a los demás.'
      },
      immediate: {
        narrative: (state) => {
          if (dominantPhysicalStat(state)) {
            return `El agua. El silencio bajo la superficie. ${state.character.name} descubre que hay una soledad buena.`
          }
          if (dominantLogicStat(state)) {
            return `Las piezas rotas, los cables, lo que nadie quiere. ${state.character.name} lo convierte en algo que funciona.`
          }
          return `Las historias. ${state.character.name} descubre que puede inventar personas que no existen y que la gente las escucha.`
        },
        statDeltas: (state) => {
          if (dominantPhysicalStat(state)) return { fisico: 0.4, disciplina: 0.2 }
          if (dominantLogicStat(state))    return { logica: 0.3, creatividad: 0.3 }
          return { creatividad: 0.3, carisma: 0.2 }
        },
        flags: ['hobby_elegido', 'hobby_principal_b'],
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (state) => {
            const hasAmigo = hasFlag(state, 'tiene_amigo_infancia')
            return hasAmigo
              ? `${npcName(state)} te dice que lo que haces es especial. No lo dice por decirlo.`
              : `Con 13 años, lo que empezó como hobby empieza a ser una forma de identidad.`
          },
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_hobby_b',
        text: (_s) => 'Aquellos años construyendo o nadando o contando historias. Antes de que todo se complicara.',
      },
      epitaphSeed: 'construyó su mundo interior antes de enfrentarse al exterior',
    },
    {
      id:   'hobby_c',
      text: (state) => {
        if (dominantPhysicalStat(state)) return 'Artes marciales que tu padre propone.'
        if (dominantLogicStat(state))    return 'Leer todo lo que cae en tus manos.'
        return 'Música: el instrumento que más te llama.'
      },
      immediate: {
        narrative: (state) => {
          if (dominantPhysicalStat(state)) {
            return `El dojo. La disciplina. ${state.character.name} aprende que el cuerpo obedece cuando la mente manda.`
          }
          if (dominantLogicStat(state)) {
            return `Los libros. ${state.character.name} lee todo sin orden, sin filtro, voraz.`
          }
          return `El instrumento. Las notas que no cuadran al principio. ${state.character.name} aprende que el error es parte del proceso.`
        },
        statDeltas: (state) => {
          if (dominantPhysicalStat(state)) return { fisico: 0.3, disciplina: 0.3 }
          if (dominantLogicStat(state))    return { logica: 0.3, emocional: 0.2 }
          return { creatividad: 0.3, emocional: 0.3 }
        },
        flags: ['hobby_elegido', 'hobby_principal_c'],
      },
      delayed: [
        {
          triggerAge: 16,
          narrative: (state) => {
            if (dominantPhysicalStat(state)) return `Las artes marciales te enseñaron disciplina. Con 16 años, lo notas en todo.`
            if (dominantLogicStat(state))    return `Años de lectura. ${state.character.name} tiene referencias que sus compañeros no tienen.`
            return `La música se convirtió en un lenguaje. Con 16 años, tocas algo que la gente siente.`
          },
          statDeltas: { disciplina: 0.3 },
          flags:      ['hobby_desarrollado'],
        },
      ],
      memory: {
        id:   'memory_hobby_c',
        text: (_s) => 'El olor de ese lugar. La sensación física de aprender algo que el cuerpo o el alma necesitaba.',
      },
      epitaphSeed: 'se forjó a través de la disciplina elegida libremente',
    },
  ],
}

// ═══ EVENTO 3: CONFLICTO ESCOLAR (edad 10) ════════════════════════════════════
const schoolConflict: GameEventTemplate = {
  id:         'school_conflict',
  triggerAge: 10,
  weight:     1,

  context: (state) => {
    const isAgresor  = state.stats.riesgo >= 8 && state.stats.emocional <= 4
    const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')

    if (isAgresor) {
      return `Con 10 años, ${state.character.name} descubre que tiene algo que los demás no: la capacidad de asustar. Y lo usa.`
    }
    if (tieneAmigo) {
      const fn = npcName(state)
      return `Con 10 años, hay un grupo en clase que se mete con ${fn} cada día. Lo ves. Los profesores no intervienen.`
    }
    return `Con 10 años, hay alguien en clase que te tiene en el punto de mira. Cada recreo. Los adultos no lo ven.`
  },

  options: [
    {
      id:   'confrontar',
      text: (state) => {
        const isAgresor  = state.stats.riesgo >= 8 && state.stats.emocional <= 4
        const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
        if (isAgresor)   return 'Continúas. El miedo en sus caras es difícil de resistir.'
        if (tieneAmigo)  return `Defiendes a ${npcName(state)}. No te importa lo que pase después.`
        return 'Le plantas cara. No vas a dejar que esto siga.'
      },
      immediate: {
        narrative: (state) => {
          const isAgresor  = state.stats.riesgo >= 8 && state.stats.emocional <= 4
          const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
          if (isAgresor)   return `El poder da miedo cuando lo tienes. ${state.character.name} cruza una línea que tardará años en entender.`
          if (tieneAmigo)  return `${state.character.name} se interpone. Hay un silencio. Luego el agresor retrocede. ${npcName(state)} no lo olvida nunca.`
          return `${state.character.name} habla. La voz tiembla, pero está ahí. El agresor retrocede. Solo por hoy.`
        },
        statDeltas: (state) => {
          const isAgresor = state.stats.riesgo >= 8 && state.stats.emocional <= 4
          return isAgresor
            ? { riesgo: 0.3, emocional: -0.2 }
            : { riesgo: 0.25, disciplina: 0.2 }
        },
        flags: ['school_conflict_fired', 'confronto_acoso'],
      },
      npcReaction: {
        npcId:         (state) => hasFlag(state, 'tiene_amigo_infancia') ? (getFirstFriend(state)?.id ?? null) : null,
        newStatus:     'leal',
        narrativeLine: (state) => {
          const fn = npcName(state)
          return `${fn} no ha dicho nada, pero desde ese día se sienta siempre a tu lado. Hay cosas que no necesitan palabras.`
        },
      },
      delayed: [
        {
          triggerAge: 12,
          narrative: (state) => {
            const isAgresor = state.stats.riesgo >= 8 && state.stats.emocional <= 4
            return isAgresor
              ? `Con 12 años, uno de los que acosabas te lo recuerda. Hay algo en eso que no cuadra con quien crees ser.`
              : `Con 12 años, recuerdas ese momento con claridad. No te arrepientes.`
          },
          statDeltas: { emocional: 0.15 },
        },
        {
          triggerAge: 30,
          narrative: (state) => {
            const isAgresor = state.stats.riesgo >= 8 && state.stats.emocional <= 4
            return isAgresor
              ? `${state.character.name} recuerda a ese niño que aterrorizó. Lo busca en internet. Necesita saber que está bien.`
              : `En terapia, ${state.character.name} habla de ese patio de colegio. Fue la primera vez que eligió ser él.`
          },
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_conflict_confront',
        text: (_s) => 'Aquel patio de colegio. El momento en que elegiste no mirar para otro lado.',
      },
      epitaphSeed: 'no miró para otro lado cuando importaba',
    },
    {
      id:   'ignorar',
      text: (state) => {
        const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
        return tieneAmigo
          ? `Dejas que ${npcName(state)} lo gestione solo. Demasiado arriesgado.`
          : 'Lo ignoras. Los conflictos se resuelven solos si esperas bastante.'
      },
      immediate: {
        narrative: (state) => {
          const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
          return tieneAmigo
            ? `${state.character.name} mira hacia otro lado. ${npcName(state)} lo nota. Algo se fractura, muy despacio.`
            : `${state.character.name} baja la cabeza. El conflicto continúa un mes más. Después para. Nadie gana.`
        },
        statDeltas: { estabilidad: 0.2, emocional: -0.15 },
        flags:      ['school_conflict_fired', 'evito_acoso'],
      },
      npcReaction: {
        npcId:         (state) => hasFlag(state, 'tiene_amigo_infancia') ? (getFirstFriend(state)?.id ?? null) : null,
        newStatus:     'distante',
        narrativeLine: (state) => {
          const fn = npcName(state)
          return `${fn} no dice nada. Pero durante semanas come solo en el patio. Tu ausencia tiene una forma muy precisa.`
        },
      },
      delayed: [
        {
          triggerAge: 16,
          narrative: (state) => {
            const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
            return tieneAmigo
              ? `${npcName(state)} nunca te lo reprocha directamente. Pero hay algo que ya no es igual.`
              : `Con 16 años, ${state.character.name} recuerda aquel año. La pregunta es si lo volvería a hacer igual.`
          },
          statDeltas: { emocional: 0.1 },
        },
      ],
      memory: {
        id:   'memory_conflict_avoid',
        text: (_s) => 'La vez que miraste para otro lado. No siempre es la decisión incorrecta. Pero la recuerdas.',
      },
      epitaphSeed: 'aprendió que el silencio también tiene consecuencias',
    },
    {
      id:   'buscar_adulto',
      text: (_s) => 'Buscas un adulto en quien confiar. Esto necesita más que tú.',
      immediate: {
        narrative: (state) => {
          const tieneAmigo = hasFlag(state, 'tiene_amigo_infancia')
          return tieneAmigo
            ? `${state.character.name} habla con un profesor. El problema se detiene. ${npcName(state)} dice que eres listo, no cobarde.`
            : `${state.character.name} encuentra un adulto que escucha. El problema tiene nombre ahora.`
        },
        statDeltas: { emocional: 0.3, disciplina: 0.15 },
        flags:      ['school_conflict_fired', 'busco_ayuda_adulto'],
      },
      npcReaction: {
        npcId:         (state) => hasFlag(state, 'tiene_amigo_infancia') ? (getFirstFriend(state)?.id ?? null) : null,
        newStatus:     'cercano',
        narrativeLine: (state) => {
          const fn = npcName(state)
          return `${fn} te busca al día siguiente. "Gracias", dice solo eso. Pero en la forma de decirlo hay mucho más.`
        },
      },
      delayed: [
        {
          triggerAge: 14,
          narrative: (_s) => `El profesor que te ayudó con el acoso te recuerda. Te recomienda para algo importante.`,
          flags:      ['mentor_escolar'],
          unlockEvent: 'mentor_encuentro',
        },
        {
          triggerAge: 20,
          narrative: (s) => `${s.character.name} recuerda pedir ayuda con 10 años. Esa capacidad de pedir ayuda le salva muchas veces.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_asked_help',
        text: (_s) => 'La primera vez que pediste ayuda. Costó más que enfrentarlo solo. Y funcionó.',
      },
      epitaphSeed: 'supo cuándo pedir ayuda y cuándo dar la cara',
    },
  ],
}

// ═══ EVENTO 4: DINÁMICA FAMILIAR (edad 11) ════════════════════════════════════
const familyDynamic: GameEventTemplate = {
  id:         'family_dynamic',
  triggerAge: 11,
  weight:     1,

  context: (state) => {
    const isPoor = state.economy.liquidez < 200
    const isRich = state.economy.liquidez > 1500
    if (isPoor) {
      return `Con 11 años, ${state.character.name} entiende por qué sus padres hablan en voz baja por las noches. El dinero escasea. El miedo se palpa.`
    }
    if (isRich) {
      return `Con 11 años, ${state.character.name} vive en una familia que lo tiene todo. Menos tiempo. Las ausencias tienen precio de mercado.`
    }
    return `Con 11 años, ${state.character.name} empieza a ver fisuras en lo que creía sólido. La familia es más complicada de lo que parecía.`
  },

  options: [
    {
      id:   'escuchar_comprender',
      text: (_s) => 'Escuchas sin decir nada. Aprendes más de lo que crees.',
      immediate: {
        narrative: (s) => `${s.character.name} aprende que las familias tienen capas. La suya tiene más de lo que ve desde fuera.`,
        statDeltas: { emocional: 0.35, estabilidad: 0.2 },
        flags:      ['comprende_familia'],
      },
      delayed: [
        {
          triggerAge: 18,
          narrative: (s) => `Al salir de casa, ${s.character.name} entiende mejor a sus padres. No los hace perfectos. Pero ayuda.`,
          statDeltas: { emocional: 0.2 },
        },
        {
          triggerAge: 35,
          narrative: (s) => `Con 35 años, ${s.character.name} vive algo parecido en su propia familia. Ahora sabe lo que aquello significaba.`,
          statDeltas: { emocional: 0.15 },
        },
      ],
      memory: {
        id:   'memory_family_listen',
        text: (_s) => 'Aquellas noches escuchando detrás de la puerta. No era curiosidad. Era querer entender.',
      },
      epitaphSeed: 'entendió la familia antes de poder explicarla',
    },
    {
      id:   'preguntar_directamente',
      text: (_s) => 'Preguntas directamente. Mereces saber la verdad.',
      immediate: {
        narrative: (s) => {
          const isPoor = s.economy.liquidez < 200
          return isPoor
            ? `La verdad llega: hay deudas, hay miedo. ${s.character.name} ya no puede fingir que todo va bien.`
            : `La respuesta llega a medias. Pero ${s.character.name} ha abierto una puerta que antes estaba cerrada.`
        },
        statDeltas: { riesgo: 0.2, carisma: 0.2 },
        flags:      ['pregunto_familia'],
      },
      delayed: [
        {
          triggerAge: 16,
          narrative: (_s) => `La pregunta que hiciste con 11 años cambió algo. Tu familia aprendió que puedes manejar la verdad.`,
          statDeltas: { estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_family_question',
        text: (_s) => 'La cara de tu madre cuando le preguntaste. Había orgullo en su mirada, aunque las noticias no fueran buenas.',
      },
      epitaphSeed: 'eligió la verdad incómoda sobre la comodidad de no saber',
    },
    {
      id:   'concentrarse_en_lo_propio',
      text: (_s) => 'Te centras en tus cosas. Los problemas adultos no son los tuyos todavía.',
      immediate: {
        narrative: (s) => `${s.character.name} cierra la puerta de su cuarto. El mundo de afuera puede esperar.`,
        statDeltas: { disciplina: 0.3, estabilidad: 0.25 },
        flags:      ['se_aisla_familia'],
      },
      delayed: [
        {
          triggerAge: 20,
          narrative: (s) => `Con 20 años, ${s.character.name} reconoce que la distancia con su familia tiene raíces antiguas.`,
          statDeltas: { emocional: 0.1 },
        },
        {
          triggerAge: 30,
          narrative: (s) => `${s.character.name} llama a su madre después de meses sin hablar. Hay silencio al otro lado. Luego alivio.`,
          statDeltas: { emocional: 0.25 },
        },
      ],
      memory: {
        id:   'memory_family_withdrawal',
        text: (_s) => 'Aquellos años de puerta cerrada. No era frialdad. Era supervivencia.',
      },
      epitaphSeed: 'construyó su mundo interior como refugio antes de abrirlo',
    },
  ],
}

// ═══ EVENTO 5: TALENTO DESCUBIERTO (edad 12) ══════════════════════════════════
const talentDiscovered: GameEventTemplate = {
  id:         'talent_discovered',
  triggerAge: 12,
  weight:     1,

  context: (state) => {
    const s = state.stats
    const entries = Object.entries(s).sort((a, b) => (b[1] as number) - (a[1] as number))
    const topKey  = entries[0][0]
    const DESC: Record<string, string> = {
      logica:      'una mente analítica que resuelve problemas con precisión fuera de lo común',
      creatividad: 'una imaginación que produce cosas que no existían antes',
      disciplina:  'una capacidad de concentración que asombra a los adultos',
      carisma:     'una facilidad para conectar con los demás que no enseña ningún libro',
      emocional:   'una sensibilidad especial para leer lo que los demás sienten',
      ambicion:    'un fuego interior que no se apaga con el primer obstáculo',
      fisico:      'unas capacidades físicas que destacan sin esfuerzo aparente',
      riesgo:      'una valentía que a veces alarma a quien lo observa',
      estabilidad: 'una madurez emocional que no debería tener con 12 años',
    }
    return `Con 12 años, los que rodean a ${state.character.name} empiezan a notar algo: ${DESC[topKey] ?? 'algo difícil de poner en palabras'}.`
  },

  options: [
    {
      id:   'cultivar_privado',
      text: (_s) => 'Lo cultivas en silencio. Practicas cuando nadie te ve.',
      immediate: {
        narrative: (s) => `${s.character.name} práctica en silencio. No necesita que lo vean. Necesita mejorar.`,
        statDeltas: (s) => {
          const entries = Object.entries(s.stats).sort((a, b) => (b[1] as number) - (a[1] as number))
          const topKey  = entries[0][0]
          if (topKey === 'logica')      return { logica:      0.3, disciplina: 0.25 }
          if (topKey === 'creatividad') return { creatividad: 0.3, disciplina: 0.25 }
          if (topKey === 'carisma')     return { carisma:     0.3, emocional:  0.2  }
          if (topKey === 'emocional')   return { emocional:   0.35, estabilidad: 0.15 }
          if (topKey === 'ambicion')    return { ambicion:    0.35, disciplina:  0.15 }
          if (topKey === 'fisico')      return { fisico:      0.35, disciplina:  0.15 }
          if (topKey === 'riesgo')      return { riesgo:      0.3,  ambicion:    0.2  }
          return { estabilidad: 0.35, emocional: 0.15 }
        },
        flags:       ['talento_cultivado', 'talento_privado'],
      },
      delayed: [
        {
          triggerAge:  16,
          narrative:  (s) => {
            const hasAmigo = hasFlag(s, 'tiene_amigo_infancia')
            return hasAmigo
              ? `${npcName(s)} te ve hacer algo con una destreza que no esperaba. "¿Cuándo aprendiste eso?"`
              : `Con 16 años, algo que cultivaste en privado empieza a ser visible. No lo buscabas. Llegó solo.`
          },
          statDeltas:  { ambicion: 0.2 },
        },
        {
          triggerYearsAfter: 10,
          narrative:  (s) => `${s.character.name} lleva diez años trabajando en silencio. El resultado habla ahora.`,
          statDeltas:  { disciplina: 0.3, ambicion: 0.2 },
          flags:       ['talento_maduro'],
        },
      ],
      memory: {
        id:   'memory_talent_private',
        text: (_s) => 'Aquellas horas practicando cuando todos dormían. El talento que nadie vio crecer.',
      },
      epitaphSeed: 'creyó en lo que construía antes de que nadie más lo viera',
    },
    {
      id:   'compartir_con_otros',
      text: (_s) => 'Lo compartes con otros. La admiración te impulsa a más.',
      immediate: {
        narrative: (s) => `${s.character.name} muestra lo que sabe hacer. La reacción de los demás enciende algo.`,
        statDeltas: { carisma: 0.3, ambicion: 0.2 },
        flags:      ['talento_publico'],
      },
      delayed: [
        {
          triggerAge: 14,
          narrative: (s) => {
            const hasAmigo = hasFlag(s, 'tiene_amigo_infancia')
            return hasAmigo
              ? `${npcName(s)} habla de ti a profesores, a otros. No lo hace por adulación. Es orgullo genuino.`
              : `Tu reputación precede a ${s.character.name}. Eso tiene ventajas y tiene precio.`
          },
          statDeltas: { carisma: 0.2 },
        },
      ],
      memory: {
        id:   'memory_talent_shared',
        text: (_s) => 'La primera vez que mostraste lo que sabías hacer. Las caras de los que miraban.',
      },
      epitaphSeed: 'compartió sus dones antes de entender que valían',
    },
    {
      id:   'no_le_da_importancia',
      text: (_s) => 'No le das importancia. El talento sin dirección no es nada.',
      immediate: {
        narrative: (s) => `${s.character.name} encoge los hombros. No es modestia. Es que todavía no sabe qué hacer con eso.`,
        statDeltas: { estabilidad: 0.3 },
        flags:      ['talento_ignorado'],
      },
      delayed: [
        {
          triggerAge: 18,
          narrative: (s) => `Con 18 años, alguien recuerda lo que ${s.character.name} hacía con 12. "¿Por qué lo dejaste?" No tiene respuesta.`,
          statDeltas: { ambicion: 0.15 },
          flags:      ['talento_redescubierto'],
        },
        {
          triggerAge: 30,
          narrative: (s) => `${s.character.name} retoma algo que abandonó con 12 años. Ya no es lo mismo. Pero está ahí.`,
          statDeltas: { creatividad: 0.2, disciplina: 0.2 },
        },
      ],
      memory: {
        id:   'memory_talent_dismissed',
        text: (_s) => 'Aquella vez que decidiste que no era para tanto. Tardaste años en entender que sí lo era.',
      },
      epitaphSeed: 'aprendió tarde que los dones no esperan para siempre',
    },
  ],
}

export const CHILDHOOD_EVENTS: GameEventTemplate[] = [
  firstFriend,
  hobbyDiscovery,
  schoolConflict,
  familyDynamic,
  talentDiscovered,
]
