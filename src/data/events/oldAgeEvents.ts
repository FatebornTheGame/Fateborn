import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'

function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'alguien cercano'
}

// ═══ EVENTO 31: EL RITMO DE LA VEJEZ (edad 71-78) ════════════════════════════
// How to inhabit old age — not a crisis, a recalibration.
// The three paths define the character's relationship with this final chapter.
const ritmoVejez: GameEventTemplate = {
  id:              'ritmo_vejez',
  triggerAge:      [71, 78],
  triggerAntiFlags: ['ritmo_vejez_establecido'],
  weight:          0.95,

  context: (state) => {
    const hasPaz     = hasFlag(state, 'sesenta_con_paz') || hasFlag(state, 'inventario_sesenta_cerrado')
    const hasActivo  = hasFlag(state, 'sigue_trabajando_madurez') || hasFlag(state, 'reinvencion_post_carrera')
    const hasLegado  = hasFlag(state, 'mentor_activo') || hasFlag(state, 'proyecto_legado')

    if (hasPaz && hasLegado) {
      return `${state.character.name} llega a los setenta con las cuentas en orden y algo que dejó en marcha. La vejez no llega como una imposición — llega como una etapa que tiene su propio ritmo, si uno aprende a escucharlo.`
    }
    if (hasActivo) {
      return `${state.character.name} no ha parado fácilmente nunca. Con más de setenta, el cuerpo y el tiempo empiezan a negociar los términos. La pregunta ya no es si parar, sino cómo seguir de otra forma.`
    }
    return `Con setenta pasados, la vida de ${state.character.name} entra en una fase que no tiene mapa claro. Lo que funcionó antes — el ritmo, las rutinas, las urgencias — ya no encaja del todo. Hay que encontrar uno nuevo.`
  },

  options: [
    {
      id:   'vejez_activa',
      text: (_s) => 'Encuentras una forma de seguir activo. El ritmo cambia, no la dirección.',
      immediate: {
        narrative: (s) => {
          const hasLegado = hasFlag(s, 'mentor_activo') || hasFlag(s, 'proyecto_legado')
          return hasLegado
            ? `${s.character.name} no vacía el calendario — lo reordena. Menos urgencias, más presencia en lo que importa. El legado sigue avanzando. El cuerpo pone los límites. La cabeza todavía no.`
            : `${s.character.name} sigue. Camina, lee, conversa, tiene proyectos pequeños que le ocupan la mañana. La vejez activa no es resistencia al tiempo — es una negociación honesta con él.`
        },
        statDeltas: { fisico: 0.2, emocional: 0.3, ambicion: 0.15, estabilidad: 0.3 },
        flags:      ['ritmo_vejez_establecido', 'vejez_activa'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `Cuatro años después, ${s.character.name} sigue en movimiento. No igual que antes — mejor en algunas cosas. Más deliberado. Más suyo.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_vejez_activa',
        text: (_s) => 'Cuando decidiste que los setenta no eran el final de nada — solo el inicio de otro ritmo.',
      },
      epitaphSeed: 'encontró en la vejez un ritmo nuevo en vez de una parada',
    },
    {
      id:   'contemplacion_plena',
      text: (_s) => 'Te retiras hacia dentro. La quietud de esta etapa tiene su propia riqueza.',
      immediate: {
        narrative: (s) => {
          const hasPaz = hasFlag(s, 'sesenta_con_paz')
          return hasPaz
            ? `${s.character.name} lo encuentra natural. La quietud no llegó de golpe — se fue instalando desde los sesenta. Ahora ocupa el espacio que antes llenaban las urgencias. No está vacío. Está lleno de otra cosa.`
            : `${s.character.name} descubre que la contemplación no es rendición. Es una forma de estar que no había tenido tiempo de aprender. A los setenta, el tiempo para aprender eso finalmente existe.`
        },
        statDeltas: { emocional: 0.45, estabilidad: 0.4, ambicion: -0.15 },
        flags:      ['ritmo_vejez_establecido', 'contemplativo'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `${s.character.name} ha encontrado en el silencio algo que buscó toda la vida sin saberlo. No todo el mundo llega a esto. Es un privilegio que no eligió pero que sabe usar.`,
          statDeltas: { emocional: 0.25, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_contemplacion_vejez',
        text: (_s) => 'Los años en que aprendiste a estar quieto. Llegaron tarde. Llegaron bien.',
      },
      epitaphSeed: 'aprendió en la vejez la quietud que no había tenido tiempo de encontrar antes',
    },
    {
      id:   'resistencia_al_tiempo',
      text: (_s) => 'No te adaptas. Sigues como siempre, aunque cueste más.',
      immediate: {
        narrative: (s) => {
          const tieneRiesgo = s.stats.riesgo > 6
          return tieneRiesgo
            ? `${s.character.name} no negocia con el tiempo — le planta cara. El cuerpo se queja. Él sigue. No es negación — es carácter. Aunque a esta edad la diferencia entre los dos se estrecha.`
            : `${s.character.name} mantiene el ritmo de antes aunque ya no le siente bien. Hay algo en él que no acepta el ajuste. No es un defecto — es identidad. Solo que la identidad también tiene un precio en el cuerpo.`
        },
        statDeltas: { ambicion: 0.2, fisico: -0.2, disciplina: 0.15 },
        flags:      ['ritmo_vejez_establecido', 'resistencia_vejez'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.fisico > 5
              ? `Tres años resistiendo, ${s.character.name} todavía está en pie. El cuerpo no cedió del todo. Aún hay margen.`
              : `Tres años resistiendo, el cuerpo de ${s.character.name} empieza a cobrar la factura. El tiempo no se negocia indefinidamente.`
          },
          statDeltas: (s) => s.stats.fisico > 5
            ? { ambicion: 0.1, fisico: -0.1 }
            : { fisico: -0.25, emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_resistencia_vejez',
        text: (_s) => 'Los años en que te negaste a bajar el ritmo. El cuerpo lo pagó. La identidad lo agradece. A partes iguales.',
      },
      epitaphSeed: 'no negoció con el tiempo hasta que no tuvo más remedio — y entonces lo hizo con dignidad',
    },
  ],
}

// ═══ EVENTO 32: LA PÉRDIDA DEL COMPAÑERO (edad 73-83) ════════════════════════
// The death of a life partner or oldest remaining friend.
// The loneliness that follows is unlike any other.
const perdidaCompanero: GameEventTemplate = {
  id:              'perdida_companero',
  triggerAge:      [73, 83],
  triggerAntiFlags: ['perdida_companero_procesada'],
  requireAnyFlags: ['construyendo_con_pareja', 'reconciliacion_lograda', 'eslabon_generacional'],
  weight:          0.85,

  context: (state) => {
    const tienePareja = hasFlag(state, 'construyendo_con_pareja')
    const hasAmigo    = !!getFirstFriend(state)
    const nombre      = getFirstFriend(state)?.name

    if (tienePareja) {
      return `Después de décadas juntos, la pareja de ${state.character.name} muere. No hay forma de prepararse para esto aunque uno sepa que llegará. La vida en plural termina. La vida en singular empieza, sin haberla pedido.`
    }
    if (hasAmigo && nombre) {
      return `${nombre}, la persona que más tiempo lleva en la vida de ${state.character.name}, muere. No era familia de sangre — era algo que se elige y que con los años pesa más que lo que se hereda.`
    }
    return `Una de las personas más cercanas a ${state.character.name} muere. A esta edad, cada pérdida tiene un eco distinto: no solo dueles por quien se fue, sino por el trozo de mundo compartido que se lleva.`
  },

  options: [
    {
      id:   'seguir_con_todo',
      text: (_s) => 'Sigues. No por negación — porque eso es lo que harían ellos.',
      immediate: {
        narrative: (s) => {
          const tienePareja = hasFlag(s, 'construyendo_con_pareja')
          return tienePareja
            ? `${s.character.name} llora lo que tiene que llorar y después se levanta. La casa está en silencio de una forma nueva. Pero hay cosas por hacer, personas que necesitan presencia, días que seguir viviendo. Así lo harían ellos.`
            : `La pérdida de ${npcName(s)} deja un hueco real. ${s.character.name} lo reconoce sin pretender llenarlo. Sigue porque las personas que se van se llevan lo que dieron, pero no lo que enseñaron a ver.`
        },
        statDeltas: { emocional: 0.45, estabilidad: 0.2, disciplina: 0.15 },
        flags:      ['perdida_companero_procesada', 'sigue_tras_perdida'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} ha aprendido a vivir en el espacio que dejó quien se fue. No igual — diferente. Con cosas que solo se aprenden en ese silencio.`,
          statDeltas: { emocional: 0.25, estabilidad: 0.15 },
        },
        {
          triggerYearsAfter: 3,
          narrative: (s) => `Tres años sin ellos. ${s.character.name} lleva la conversación que ya no puede tener en los momentos en que la necesita. Es una forma de presencia que no caduca.`,
          statDeltas: { emocional: 0.1 },
        },
      ],
      memory: {
        id:   'memory_perdida_companero_seguir',
        text: (_s) => 'El día en que te quedaste sin la persona con quien habías compartido más. Y decidiste seguir como habrían querido que siguieras.',
      },
      epitaphSeed: 'aprendió que querer bien a alguien también significa seguir cuando ya no están',
    },
    {
      id:   'duelo_largo',
      text: (_s) => 'El duelo lleva su propio tiempo. No hay prisa en salir de él.',
      immediate: {
        narrative: (s) => `${s.character.name} no abrevia. El duelo es largo porque lo que se perdió era grande. No hay fórmula para esto y no busca ninguna. La tristeza ocupa el espacio que le corresponde. Eso también es una forma de honrar.`,
        statDeltas: { emocional: 0.5, estabilidad: -0.1 },
        flags:      ['perdida_companero_procesada', 'duelo_largo_vejez'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años en el duelo largo. ${s.character.name} empieza a encontrar días con algo de luz entre medias. No como señal de olvido — como señal de que la vida insiste.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
        },
        {
          triggerYearsAfter: 4,
          narrative: (s) => `Cuatro años después, lo que era dolor agudo se ha convertido en algo diferente — más sordo, más integrado. ${s.character.name} lo lleva con dignidad.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_duelo_largo',
        text: (_s) => 'Los años de duelo sin fecha de caducidad. No los acortaste. Los viviste.',
      },
      epitaphSeed: 'llevó el duelo a su propio ritmo, sin fingir que era menos de lo que era',
    },
    {
      id:   'redescubrirse_solo',
      text: (_s) => 'La pérdida revela una persona que llevaba tiempo sin verse a sí misma.',
      immediate: {
        narrative: (s) => {
          const tienePareja = hasFlag(s, 'construyendo_con_pareja')
          return tienePareja
            ? `Décadas en plural hacen que el singular cueste. ${s.character.name} descubre que hay partes de él que la convivencia había cubierto. No se habían ido — estaban esperando. La pérdida, entre todo lo que se lleva, devuelve algunas de esas cosas.`
            : `Sin quien lo completaba, ${s.character.name} se redescubre. No con facilidad — con la lentitud del que vuelve a aprender algo que creía saber.`
        },
        statDeltas: { emocional: 0.4, creatividad: 0.2, estabilidad: 0.25 },
        flags:      ['perdida_companero_procesada', 'redescubrimiento_solitario'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años en solitario, ${s.character.name} ha recuperado algo que no sabía que había perdido. No sustituye lo que falta. Lo complementa de una forma inesperada.`,
          statDeltas: { emocional: 0.25, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_redescubrimiento_solo',
        text: (_s) => 'Los años en que la pérdida te devolvió partes de ti que habías dado por desaparecidas.',
      },
      epitaphSeed: 'encontró en la soledad más grande algo de sí mismo que no esperaba encontrar',
    },
  ],
}

// ═══ EVENTO 33: EL CUERPO QUE CEDE (edad 76-85) ══════════════════════════════
// The body's final major limitation — not necessarily terminal, but defining.
// Requires adjustment in identity, dependence, and daily life.
const cuerpoCede: GameEventTemplate = {
  id:              'cuerpo_cede',
  triggerAge:      [76, 85],
  triggerAntiFlags: ['limite_fisico_integrado'],
  weight:          0.9,

  context: (state) => {
    const tieneHabitos = hasFlag(state, 'cambio_habitos_tardio')
    const hasResiste   = hasFlag(state, 'resistencia_vejez')
    const hasActivo    = hasFlag(state, 'vejez_activa')

    if (hasResiste) {
      return `El cuerpo de ${state.character.name} lleva años resistiendo más allá de lo razonable. Ahora llega el límite que no tiene vuelta atrás: un diagnóstico, una caída, una operación que cambia el panorama.`
    }
    if (hasActivo) {
      return `La vejez activa de ${state.character.name} llega a un punto de inflexión: el cuerpo impone condiciones nuevas que no se pueden ignorar. El ritmo que encontró necesita ajustarse otra vez.`
    }
    if (tieneHabitos) {
      return `Los cambios de hábito que ${state.character.name} hizo antes dieron sus frutos. Pero el cuerpo tiene su propia lógica, y a esta edad esa lógica incluye límites que no se negocian.`
    }
    return `Con más de setenta y cinco, el cuerpo de ${state.character.name} empieza a poner condiciones que no estaban antes. No es el final — es el inicio de una nueva negociación con lo que puede y lo que ya no puede.`
  },

  options: [
    {
      id:   'aceptar_los_limites',
      text: (_s) => 'Aceptas lo que hay y te adaptas con dignidad.',
      immediate: {
        narrative: (s) => {
          const hasPaz = hasFlag(s, 'sesenta_con_paz') || hasFlag(s, 'contemplativo')
          return hasPaz
            ? `${s.character.name} recibe la noticia como recibe casi todo a esta altura: sin resistencia inútil. El cuerpo manda sus señales. Él las escucha. La dignidad no está en ignorarlas — está en gestionarlas.`
            : `${s.character.name} no dramatiza. Los límites del cuerpo son información, no veredicto. Reorganiza lo que puede reorganizar y suelta lo que no puede sostener. Eso también requiere valor.`
        },
        statDeltas: { emocional: 0.4, estabilidad: 0.35, fisico: 0.1 },
        flags:      ['limite_fisico_integrado', 'limites_aceptados'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años ajustado a los nuevos términos, ${s.character.name} ha encontrado formas de vivir bien dentro de los límites. No iguales. Suyos.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_limites_aceptados',
        text: (_s) => 'Cuando el cuerpo puso límites que no podías negociar y decidiste vivir bien dentro de ellos.',
      },
      epitaphSeed: 'aceptó los límites del cuerpo sin dejar que definieran quién era',
    },
    {
      id:   'resistir_con_metodo',
      text: (_s) => 'Peleas contra el deterioro con todo lo que tienes. Hay margen todavía.',
      immediate: {
        narrative: (s) => {
          return s.stats.disciplina > 6
            ? `${s.character.name} no acepta pasivamente. Rehabilitación, cambio de dieta, nueva rutina de ejercicio adaptada. El cuerpo tiene más margen del que el diagnóstico sugería si se trabaja con método. ${s.character.name} lo trabaja.`
            : `${s.character.name} lucha contra el deterioro. No siempre con el método más eficiente — pero con la constancia que le define. El resultado no es el que esperaba. Tampoco es rendición.`
        },
        statDeltas: { disciplina: 0.3, fisico: 0.2, ambicion: 0.2 },
        flags:      ['limite_fisico_integrado', 'resistencia_fisica_vejez'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => {
            return s.stats.fisico > 5
              ? `Tres años de trabajo constante. ${s.character.name} ha recuperado más de lo que el primer diagnóstico prometía. El cuerpo, bien tratado, tiene más margen del que la edad sugiere.`
              : `Tres años peleando, ${s.character.name} ha ganado tiempo y calidad. No ha ganado la batalla — nadie la gana. Pero ha ganado batallas más pequeñas y más importantes.`
          },
          statDeltas: (s) => s.stats.fisico > 5
            ? { fisico: 0.2, emocional: 0.15 }
            : { emocional: 0.25, estabilidad: 0.1 },
        },
      ],
      memory: {
        id:   'memory_resistencia_fisica',
        text: (_s) => 'Los años en que combatiste el deterioro con método. No ganaste. Ganaste tiempo. Que es diferente.',
      },
      epitaphSeed: 'peleó por cada año de calidad con la misma determinación con que peleó por todo lo demás',
    },
    {
      id:   'soltar_lo_que_toca',
      text: (_s) => 'Sueltas lo que ya no puedes sostener. Hay una forma de libertad en eso.',
      immediate: {
        narrative: (s) => `${s.character.name} reconoce que hay cosas que ya no son para él. Las suelta. No como derrota — como reconocimiento de que cada etapa tiene sus propias posibilidades, y forzar las de antes es perder las de ahora. En el soltar hay algo inesperadamente ligero.`,
        statDeltas: { emocional: 0.45, estabilidad: 0.35, ambicion: -0.2, fisico: 0.05 },
        flags:      ['limite_fisico_integrado', 'soltura_vejez'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después de soltar lo que tocaba soltar, ${s.character.name} descubre que lo que quedó tiene más peso del que esperaba. La vida reducida también puede ser la vida esencial.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_soltar_vejez',
        text: (_s) => 'Lo que soltaste cuando ya no podías sostenerlo. Inesperadamente, soltar algo peso lo alivió todo.',
      },
      epitaphSeed: 'aprendió en la vejez la diferencia entre perder y soltar',
    },
  ],
}

// ═══ EVENTO 34: EL MOMENTO DE LA CLARIDAD FINAL (edad 80-88) ════════════════
// Not necessarily death approaching — but the shift in consciousness
// that comes when the remaining time is short and clearly finite.
// This is the most interior event in the game.
const claridadFinal: GameEventTemplate = {
  id:              'claridad_final',
  triggerAge:      [80, 88],
  triggerAntiFlags: ['claridad_final_alcanzada'],
  weight:          0.95,

  context: (state) => {
    const hasPaz     = hasFlag(state, 'sesenta_con_paz') || hasFlag(state, 'limites_aceptados')
    const hasSombras = hasFlag(state, 'sesenta_con_sombras') || hasFlag(state, 'duelo_complejo')
    const hasMentor  = hasFlag(state, 'mentor_activo') || hasFlag(state, 'proyecto_legado')

    if (hasPaz && hasMentor) {
      return `A esta edad, ${state.character.name} sabe que el tiempo que queda es corto y es suyo. No hay urgencias del mundo exterior que superen las del interior. La pregunta ya no es qué hacer — es cómo estar.`
    }
    if (hasSombras) {
      return `${state.character.name} lleva las sombras de lo que no se resolvió. Con ochenta, la pregunta de si uno puede morir en paz con lo que dejó sin cerrar adquiere una urgencia diferente.`
    }
    return `Con ochenta años pasados, algo en ${state.character.name} se asienta de una forma que no había ocurrido antes. El tiempo corto produce una claridad que el tiempo largo no da.`
  },

  options: [
    {
      id:   'paz_autentica',
      text: (_s) => 'Hay paz. No porque todo fuera perfecto — porque fue tuyo.',
      immediate: {
        narrative: (s) => {
          const hasMentor = hasFlag(s, 'mentor_activo') || hasFlag(s, 'proyecto_legado')
          const hasPareja = hasFlag(s, 'construyendo_con_pareja')

          if (hasMentor) {
            return `${s.character.name} mira lo que dejó en marcha y lo que dejó en las personas. No todo lo que planeó. Más de lo que esperaba. La vida tiene esa costumbre de superar los planes cuando uno vivió con atención.`
          }
          if (hasPareja) {
            return `${s.character.name} piensa en quien compartió la mayor parte de esto — los que se fueron primero, los que todavía están. La gratitud tiene una textura específica a esta edad. No es romanticismo. Es reconocimiento.`
          }
          return `${s.character.name} llega a los ochenta con algo que no tiene nombre exacto pero que se parece a la paz. No la paz de quien no padeció — la de quien padeció y no se quedó ahí.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.5, ambicion: 0.05 },
        flags:      ['claridad_final_alcanzada', 'paz_final'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Con más de ochenta, ${s.character.name} vive los días despacio, con una atención que de joven no tenía. Es el privilegio de quien ya no necesita llegar a ningún sitio.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_paz_final',
        text: (_s) => 'Cuando dejaste de esperar algo que aún no había llegado y te diste cuenta de que ya estaba todo.',
      },
      epitaphSeed: 'llegó al final con la paz de quien vivió su propia vida, no la que le habían puesto delante',
    },
    {
      id:   'reconciliacion_existencial',
      text: (_s) => 'Hay cosas que no se resolvieron. Las sueltas ahora, en el único momento que queda.',
      immediate: {
        narrative: (s) => {
          const hasSombras = hasFlag(s, 'sesenta_con_sombras') || hasFlag(s, 'duelo_complejo')
          return hasSombras
            ? `Las cuentas que ${s.character.name} no cerró en vida se presentan ahora de otra forma. No como remordimiento — como material que todavía puede trabajarse. Con ochenta años, el perdón — el propio y el ajeno — es la última tarea importante.`
            : `${s.character.name} hace el balance final con los ojos abiertos. Hay huecos. Decisiones que le pesan. No los tacha — los pone en su lugar: parte del todo, no el todo. Eso también es una forma de paz.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.4 },
        flags:      ['claridad_final_alcanzada', 'reconciliacion_existencial'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después del trabajo interno, ${s.character.name} lleva lo que quedaba sin resolver de otra forma. Más liviana. No resuelta del todo — integrada.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_reconciliacion_final',
        text: (_s) => 'El momento en que soltaste lo que no se iba a resolver de otra forma. Tarde, pero real.',
      },
      epitaphSeed: 'encontró la reconciliación que necesitaba cuando ya solo quedaba tiempo para lo esencial',
    },
    {
      id:   'presencia_total',
      text: (_s) => 'No buscas balance ni cierre. Estás aquí, en este día, y eso es suficiente.',
      immediate: {
        narrative: (s) => {
          const hasContemplativo = hasFlag(s, 'contemplativo') || hasFlag(s, 'soltura_vejez')
          return hasContemplativo
            ? `${s.character.name} ya aprendió esto antes. A los ochenta solo se profundiza: el presente es lo único que existe y lo único que vale. No como filosofía — como forma de vivir lo que queda.`
            : `${s.character.name} no busca conclusión. No necesita que la vida tenga moraleja. Lo que hay hoy —la luz, el café, la voz de alguien— es suficiente. Y suficiente es todo.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.45 },
        flags:      ['claridad_final_alcanzada', 'presencia_plena'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `${s.character.name} vive cada día con más atención que urgencia. Lo que queda no es poco — es lo más valioso, por ser lo último.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.2 },
        },
      ],
      memory: {
        id:   'memory_presencia_plena',
        text: (_s) => 'Los años en que dejaste de necesitar que la vida significara algo distinto a lo que era.',
      },
      epitaphSeed: 'vivió los últimos años con una presencia que los primeros no le habían enseñado',
    },
  ],
}

// ═══ EVENTO 35: EL CIERRE CONSCIENTE (edad 85-90) ════════════════════════════
// The final event of the game. Not death itself — the preparation.
// The character knows, feels, or simply accepts that the end is near.
// The three paths determine the final epitaph tone.
const cierreConsciante: GameEventTemplate = {
  id:              'cierre_consciente',
  triggerAge:      [85, 90],
  triggerAntiFlags: ['cierre_consciente_alcanzado'],
  weight:          1.0,

  context: (state) => {
    const hasPaz    = hasFlag(state, 'paz_final') || hasFlag(state, 'presencia_plena')
    const hasLegado = hasFlag(state, 'eslabon_generacional') || hasFlag(state, 'mentor_activo')

    if (hasPaz && hasLegado) {
      return `${state.character.name} siente que se acerca el final. No con miedo — con la serenidad de quien hizo lo que tenía que hacer y lo sabe. Queda poco. Pero queda él.`
    }
    if (hasLegado) {
      return `Con más de ochenta y cinco, ${state.character.name} empieza a prepararse para lo que viene. No como rendición — como último acto de conciencia. Hay personas, hay cosas, hay palabras que merece decir antes de que ya no pueda.`
    }
    return `El final se aproxima. ${state.character.name} lo siente. No como amenaza — como la última estación de un viaje que duró más de lo que esperaba y menos de lo que habría querido.`
  },

  options: [
    {
      id:   'gratitud_final',
      text: (_s) => 'Lo que sientes es gratitud. Por lo vivido, por quienes estuvieron, por haber llegado hasta aquí.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = !!getFirstFriend(s)
          const sufijo   = hasAmigo && getFirstFriend(s)?.alive
            ? ` ${npcName(s)} todavía está. Eso también es un regalo.`
            : ''
          return `${s.character.name} no busca más. Lo que hubo fue suficiente — con sus huecos, con sus costes, con sus partes sin resolver. La gratitud no exige que todo haya sido bueno. Solo que haya sido.${sufijo}`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.5 },
        flags:      ['cierre_consciente_alcanzado', 'cierre_en_gratitud'],
      },
      delayed: [],
      memory: {
        id:   'memory_gratitud_final',
        text: (_s) => 'Los últimos días en que lo que sentiste, sobre todo, fue gratitud.',
      },
      epitaphSeed: 'se fue agradecido por lo que fue, no resentido por lo que no pudo ser',
    },
    {
      id:   'serenidad_del_que_sabe',
      text: (_s) => 'Sabes que fue lo que tenía que ser. No hay más preguntas.',
      immediate: {
        narrative: (s) => `${s.character.name} lo sabe. No hay revelación — hay certeza tranquila. La vida que vivió no necesita justificación ni reescritura. Fue la suya. La vivió desde dentro. Eso es todo lo que se puede pedir de una vida y todo lo que se puede dar de una.`,
        statDeltas: { emocional: 0.5, estabilidad: 0.5, logica: 0.1 },
        flags:      ['cierre_consciente_alcanzado', 'cierre_sereno'],
      },
      delayed: [],
      memory: {
        id:   'memory_serenidad_cierre',
        text: (_s) => 'Cuando llegaste al final y no tuviste más preguntas. No porque las hubieras respondido todas — porque las que quedaban ya no te pesaban.',
      },
      epitaphSeed: 'llegó al final con las preguntas que no necesitaban respuesta y la paz de saberlo',
    },
    {
      id:   'presencia_hasta_el_final',
      text: (_s) => 'Sigues aquí, atento, hasta el último momento. No hay más que eso.',
      immediate: {
        narrative: (s) => {
          const hasPresencia = hasFlag(s, 'presencia_plena') || hasFlag(s, 'contemplativo')
          return hasPresencia
            ? `${s.character.name} no prepara el final — lo vive. Como ha vivido los últimos años: presente, atento, sin necesitar que las cosas sean distintas a lo que son. El final no cambia la forma. La forma fue siempre esta.`
            : `${s.character.name} está aquí. Eso es lo que tiene y lo que da. La presencia total hasta el último momento es la última forma de respeto por la propia vida.`
        },
        statDeltas: { emocional: 0.5, estabilidad: 0.5 },
        flags:      ['cierre_consciente_alcanzado', 'presencia_hasta_el_fin'],
      },
      delayed: [],
      memory: {
        id:   'memory_presencia_final',
        text: (_s) => 'Los últimos días, aquí. Atento. Sin buscar más de lo que había.',
      },
      epitaphSeed: 'estuvo presente hasta el último momento — eso fue suficiente y era todo',
    },
  ],
}

export const OLD_AGE_EVENTS: GameEventTemplate[] = [
  ritmoVejez,
  perdidaCompanero,
  cuerpoCede,
  claridadFinal,
  cierreConsciante,
]
