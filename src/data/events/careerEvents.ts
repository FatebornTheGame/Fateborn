import type { GameEventTemplate } from '../../types/game.types'
import { promoteCareer, getCareerSalary } from '../../systems/careerSystem'

// ═══ EVENTO C1: EL PRIMER ASCENSO (edad 27-33) ════════════════════════════════
// Fires when the character has been working at nivel 1 for a while.
// First real career advancement — defines how they relate to ambition.
const ascensoLaboral: GameEventTemplate = {
  id:           'ascenso_laboral',
  triggerAge:   [27, 33],
  requireCareer: { nivel: 1 },
  requireAnyFlags: ['primer_empleo_conseguido', 'empleo_sector_formal', 'autonomo_desde_joven'],
  blockIfFlags: ['ascenso_laboral_respondido', 'decision_profesional_adulta'],
  weight:       0.9,

  context: (s) => {
    const nombre = s.character.name
    const profesion = s.career?.profesion ?? 'tu trabajo'
    return `${nombre} lleva tiempo en ${profesion.toLowerCase()}. Lo suficiente para que alguien se haya dado cuenta. Te llaman a una reunión que no estaba en el calendario. El jefe no rodea nada: hay una propuesta sobre la mesa.`
  },

  options: [
    {
      id:   'acepto_ascenso',
      text: (_s) => 'Lo acepto. Era lo que esperaba.',
      immediate: {
        narrative: (s) => {
          const c = s.career!
          return `${s.character.name} dice que sí. Llega el contrato nuevo. Más responsabilidad, más sueldo, una planta de diferencia en el edificio. Y una sensación extraña, como si algo que era tuyo ahora fuera también de los demás.`
        },
        statDeltas:     { ambicion: 0.35, disciplina: 0.25 },
        flags:          ['ascenso_laboral_respondido', 'ascenso_aceptado'],
        careerResolver: (s) => promoteCareer(s),
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `A los ${s.ageYears}, lo que aceptaste aquellos años antes tiene forma de algo reconocible. El ascenso no fue solo el sueldo. Fue aprender que podías ir más lejos.`,
          statDeltas: { ambicion: 0.2, estabilidad: 0.15 },
        },
      ],
      memory: {
        id:   'memory_primer_ascenso',
        text: (_s) => 'El día que te ofrecieron más y dijiste que sí sin dudarlo. Algo cambió entonces.',
      },
      epitaphSeed: 'no esperó a que las cosas llegaran solas',
    },

    {
      id:   'negocio_ascenso',
      text: (_s) => 'Antes de decidir, pido un día. Y vuelvo con una contraoferta.',
      immediate: {
        narrative: (s) => `${s.character.name} pide tiempo. Estudia los números. Vuelve con un planteamiento diferente — no mucho más, pero más. Silencio al otro lado de la mesa. Luego: «De acuerdo». Eso fue también una negociación de otra cosa: de lo que vales.`,
        statDeltas:     { carisma: 0.45, ambicion: 0.35, logica: 0.2 },
        flags:          ['ascenso_laboral_respondido', 'ascenso_aceptado', 'negociacion_exitosa'],
        careerResolver: (s) => {
          const promoted = promoteCareer(s)
          return { ...promoted, salarioMensual: Math.round(promoted.salarioMensual * 1.15) }
        },
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `Años después, ${s.character.name} sigue usando esa misma táctica — pedir tiempo, prepararse, volver con algo concreto. Funciona con más frecuencia de lo que sería razonable esperar.`,
          statDeltas: { carisma: 0.2, logica: 0.15 },
          flags:      ['patron_negociacion_asentado'],
        },
      ],
      memory: {
        id:   'memory_negociacion_ascenso',
        text: (_s) => 'La primera vez que negociaste en serio y ganaste. No lo olvidaste.',
      },
    },

    {
      id:   'rechazo_ascenso',
      text: (_s) => 'Lo pienso. Y decido que no. Todavía no, al menos.',
      immediate: {
        narrative: (s) => `${s.character.name} dice que no. No con una excusa — con la verdad: que ahora mismo, hay cosas que pesan más que la siguiente planta. Hay quien lo entiende y quien no. ${s.character.name} aprende algo sobre sí mismo en cómo lo dice.`,
        statDeltas: { estabilidad: 0.5, emocional: 0.35, ambicion: -0.2 },
        flags:      ['ascenso_laboral_respondido', 'rechazo_ascenso', 'equilibrio_antes_que_carrera'],
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => `Cinco años después, ${s.character.name} no sabe si tomó la decisión correcta. Pero sabe que fue la suya. Y eso tiene un valor que los ascensos no siempre tienen.`,
          statDeltas: { emocional: 0.2, estabilidad: 0.1 },
        },
      ],
    },
  ],
}

// ═══ EVENTO C2: OFERTA DE LA COMPETENCIA (edad 31-43) ═════════════════════════
// A rival company or sector contacts the character directly.
// Tests loyalty, ambition, and economic judgment.
const ofertaCompetencia: GameEventTemplate = {
  id:           'oferta_competencia_laboral',
  triggerAge:   [31, 43],
  requireCareer: { nivel: 2 },
  blockIfFlags: ['oferta_competencia_resuelta'],
  weight:       0.8,

  context: (s) => {
    const nombre = s.career?.profesion?.toLowerCase() ?? 'tu sector'
    return `Un mensaje que no esperabas. Alguien de otra empresa — una que conoces bien, una que has mirado de reojo — quiere hablar. «Sin compromiso», dicen. Pero las dos palabras que más suenan son las que no dicen: más dinero.`
  },

  options: [
    {
      id:   'acepto_oferta',
      text: (_s) => 'Me voy. Es el momento.',
      immediate: {
        narrative: (s) => `${s.character.name} negocia, pide referencias, firma. El día que lo anuncia en el trabajo hay silencios incómodos y un par de felicitaciones que suenan a otra cosa. Pero la cuenta bancaria empieza a escribir un capítulo diferente.`,
        statDeltas:     { ambicion: 0.4, riesgo: 0.3, estabilidad: -0.2 },
        flags:          ['oferta_competencia_resuelta', 'cambio_empresa'],
        careerResolver: (s) => ({
          ...s.career!,
          salarioMensual: Math.round(s.career!.salarioMensual * 1.35),
        }),
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `El cambio fue duro los primeros meses. Nueva cultura, nuevas dinámicas, nuevas expectativas. Pero ${s.character.name} se adaptó. Se adapta. Siempre se ha adaptado.`,
          statDeltas: { estabilidad: 0.25, emocional: 0.15 },
        },
      ],
    },

    {
      id:   'negocio_con_oferta',
      text: (_s) => 'Antes de decidir, llevo la oferta a mi empresa actual.',
      immediate: {
        narrative: (s) => `${s.character.name} va al jefe con la oferta sobre la mesa. Incomodidad mutua. Una reunión que dura más de lo habitual. Al final, el número que pedía — o algo muy parecido. Resulta que la empresa siempre pudo. Solo necesitaba tener un motivo.`,
        statDeltas:     { carisma: 0.5, ambicion: 0.3, logica: 0.25 },
        flags:          ['oferta_competencia_resuelta', 'negociacion_exitosa'],
        careerResolver: (s) => ({
          ...s.career!,
          salarioMensual: Math.round(s.career!.salarioMensual * 1.2),
        }),
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `${s.character.name} sigue usando esa lógica cuando negocia: el mercado como argumento. No siempre funciona. Pero funciona más de lo esperado.`,
          statDeltas: { carisma: 0.15, logica: 0.1 },
        },
      ],
      memory: {
        id:   'memory_negociacion_oferta',
        text: (_s) => 'La vez que usaste una oferta externa para conseguir lo que merecías en casa. Funciona. Lo supiste ese día.',
      },
    },

    {
      id:   'rechazo_oferta',
      text: (_s) => 'Gracias, pero no. Hay algo aquí que todavía no he terminado.',
      immediate: {
        narrative: (s) => `${s.character.name} declina con educación y con claridad. No es miedo al cambio. Es que hay algo donde está que todavía no está resuelto. La lealtad no siempre es ingenuidad — a veces es saber cuándo quedarse.`,
        statDeltas: { estabilidad: 0.5, emocional: 0.3, ambicion: -0.1 },
        flags:      ['oferta_competencia_resuelta', 'lealtad_profesional'],
      },
      delayed: [],
    },
  ],
}

// ═══ EVENTO C3: CRISIS DE BURNOUT (edad 35-51) ════════════════════════════════
// Requires high ambición and mid-to-senior career. The machine that runs too fast.
const crisisBurnout: GameEventTemplate = {
  id:           'crisis_burnout',
  triggerAge:   [35, 51],
  requireCareer: { nivel: 2 },
  requireStats:  { ambicion: { min: 6.0 } },
  blockIfFlags: ['burnout_resuelto'],
  weight:       0.85,

  context: (s) => {
    const hora = s.stats.disciplina > 7 ? 'medianoche' : 'las diez de la noche'
    return `Son ${hora}. ${s.character.name} está mirando la pantalla. El trabajo está hecho. También el de mañana. Y el del martes. No recuerda bien cuándo empezó a sentirse así — como correr dentro de un sueño: mucho esfuerzo, sin llegar a ningún sitio.`
  },

  options: [
    {
      id:   'paro_y_descanso',
      text: (_s) => 'Pido la baja. Necesito parar de verdad.',
      immediate: {
        narrative: (s) => `${s.character.name} pide la baja. Dos semanas, tres. Al principio parece que está tirando el tiempo. Luego entiende que el tiempo que tiró fue el anterior. Duerme. Sale a caminar. Come sin mirar el móvil. El cuerpo tiene buena memoria cuando se le da espacio.`,
        statDeltas: { emocional: 1.0, fisico: 0.7, ambicion: -0.6, disciplina: -0.3 },
        flags:      ['burnout_resuelto', 'burnout_superado_descansando'],
      },
      delayed: [
        {
          triggerYearsAfter: 2,
          narrative: (s) => `Dos años después del parón, ${s.character.name} trabaja diferente. No menos — diferente. Con límites que antes no existían. Con la certeza de que el trabajo no tiene que ser lo último que ves antes de dormir.`,
          statDeltas: { estabilidad: 0.3, emocional: 0.2 },
          flags:      ['patron_trabajo_saludable'],
        },
      ],
      memory: {
        id:   'memory_baja_burnout',
        text: (_s) => 'El día que paraste. No porque quisieras — porque no quedaba otra. Y resultó ser lo más inteligente que hiciste ese año.',
      },
    },

    {
      id:   'sigo_adelante',
      text: (_s) => 'No es para tanto. Todos lo pasan. Ajusto y continúo.',
      immediate: {
        narrative: (s) => `${s.character.name} reorganiza la agenda, cambia el orden de las tareas, hace más café. No se va. Pero tampoco desaparece. Es una especie de equilibrio precario que parece sostenible — hasta que no lo es.`,
        statDeltas: { disciplina: 0.4, ambicion: 0.2, emocional: -0.6, fisico: -0.5 },
        flags:      ['burnout_resuelto', 'burnout_ignorado'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `A los ${s.ageYears}, el cuerpo presentó la factura de lo que ${s.character.name} no pagó cuando tocaba. No fue un colapso dramático — fue un desgaste gradual que se hizo imposible de ignorar.`,
          statDeltas: { fisico: -0.6, emocional: -0.5, disciplina: -0.2 },
        },
      ],
    },

    {
      id:   'cambio_de_rumbo',
      text: (_s) => 'No puedo seguir así. Necesito algo diferente, no solo un descanso.',
      immediate: {
        narrative: (s) => `${s.character.name} no pide una baja — pide una salida. No mejor necesariamente. Solo distinta. Con espacio para respirar, para no saber qué viene después, para empezar desde el principio sin la prisa de llegar a un sitio que ya no reconoce.`,
        statDeltas:     { riesgo: 0.5, emocional: 0.4, ambicion: -0.4, estabilidad: -0.2 },
        flags:          ['burnout_resuelto', 'pivot_por_burnout'],
        careerResolver: (s) => ({
          profesion:      'Nuevo camino',
          nivel:          Math.max(1, (s.career?.nivel ?? 2) - 1),
          salarioMensual: getCareerSalary(s.character.country, Math.max(1, (s.career?.nivel ?? 2) - 1)),
        }),
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `El salto que ${s.character.name} dio entonces fue difícil de explicarle a los demás. Pero hay cosas que solo se entienden desde dentro.`,
          statDeltas: { emocional: 0.3, estabilidad: 0.2 },
        },
      ],
    },
  ],
}

// ═══ EVENTO C4: EL PROYECTO DEFINITIVO (edad 38-54) ══════════════════════════
// A high-visibility, high-stakes project lands on the table.
// Defines how the character relates to leadership and sacrifice.
const proyectoDefinitivo: GameEventTemplate = {
  id:           'proyecto_definitivo',
  triggerAge:   [38, 54],
  requireCareer: { nivel: 2 },
  blockIfFlags: ['proyecto_definitivo_vivido'],
  weight:       0.75,

  context: (s) => {
    return `Se lo proponen directamente a ${s.character.name}. El proyecto más grande que ha pasado por su mesa en años — quizás en toda la carrera. Alto riesgo, alta visibilidad, todos mirando. El que lo hace bien no lo olvida nadie. El que falla, tampoco.`
  },

  options: [
    {
      id:   'lidero_el_proyecto',
      text: (_s) => 'Lo lidero yo. Es mi momento.',
      immediate: {
        narrative: (s) => `${s.character.name} se pone al frente. Hay semanas brutales, decisiones que no tienen respuesta correcta, noches que no terminan. Pero cuando acaba, hay algo nuevo: saber de qué está hecho. Los demás también lo saben ahora.`,
        statDeltas:     { ambicion: 0.45, logica: 0.35, disciplina: 0.2, emocional: -0.25 },
        flags:          ['proyecto_definitivo_vivido', 'proyecto_definitivo_liderado'],
        careerResolver: (s) => promoteCareer(s),
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => `Lo que ${s.character.name} construyó en aquel proyecto sigue en pie. Y sigue siendo suyo, aunque ahora lo lleven otros.`,
          statDeltas: { ambicion: 0.2, estabilidad: 0.2 },
          flags:      ['legado_profesional_visible'],
        },
      ],
      memory: {
        id:   'memory_proyecto_clave',
        text: (_s) => 'El proyecto que te demostró de qué eras capaz. No lo olvidaste. Y tampoco lo olvidaron los demás.',
      },
      epitaphSeed: 'lideró cuando más importaba y no falló',
    },

    {
      id:   'delego_y_guio',
      text: (_s) => 'Lo hago, pero formando al equipo. Yo en segundo plano.',
      immediate: {
        narrative: (s) => `${s.character.name} decide que su rol no es ejecutar — es hacer que los demás ejecuten bien. Da un paso atrás visible. Cuando el proyecto termina, el equipo comparte el crédito. Y ${s.character.name} descubre que eso no le molesta. Al contrario.`,
        statDeltas: { carisma: 0.6, emocional: 0.4, logica: 0.2, ambicion: -0.1 },
        flags:      ['proyecto_definitivo_vivido', 'liderazgo_reconocido', 'eslabon_generacional'],
      },
      delayed: [
        {
          triggerYearsAfter: 4,
          narrative: (s) => `Gente que estuvo en aquel equipo sigue citando a ${s.character.name} cuando hablan de cómo aprendieron a trabajar. No siempre se deja ese rastro.`,
          statDeltas: { carisma: 0.2, emocional: 0.3 },
          flags:      ['mentor_activo'],
        },
      ],
      epitaphSeed: 'enseñó más de lo que construyó directamente',
    },

    {
      id:   'rechazo_proyecto',
      text: (_s) => 'Lo dejo pasar. Ahora mismo no es mi prioridad.',
      immediate: {
        narrative: (s) => `${s.character.name} dice que no. No con una excusa — con la verdad: que en este momento hay cosas que pesan más que la visibilidad. Hay quien lo entiende y quien archiva esa respuesta como información sobre ${s.character.name}. Los dos tienen razón.`,
        statDeltas: { estabilidad: 0.5, emocional: 0.4, fisico: 0.25, ambicion: -0.25 },
        flags:      ['proyecto_definitivo_vivido', 'equilibrio_antes_que_carrera'],
      },
      delayed: [
        {
          triggerYearsAfter: 6,
          narrative: (s) => `${s.character.name} no sabe si decir que no aquel día fue la decisión correcta. Pero sabe que fue la suya. Y hay algo en eso que todavía no tiene nombre claro.`,
          statDeltas: { emocional: 0.2 },
        },
      ],
    },
  ],
}

// ═══ EVENTO C5: LA CUMBRE PROFESIONAL (edad 46-62) ════════════════════════════
// The character has reached a position of genuine influence.
// How they navigate the apex defines their legacy.
const cumbreProfesional: GameEventTemplate = {
  id:           'cumbre_profesional',
  triggerAge:   [46, 62],
  requireCareer: { nivel: 3 },
  blockIfFlags: ['cumbre_profesional_alcanzada'],
  weight:       0.8,

  context: (s) => {
    const profesion = s.career?.profesion?.toLowerCase() ?? 'lo que hace'
    return `Lo que ${s.character.name} empezó hace décadas — lo que antes era ${profesion} y ahora es otra cosa — ha llegado a un punto de reconocimiento real. No el que se busca: el que llega solo. La pregunta que no da señal de querer irse: ¿y ahora qué?`
  },

  options: [
    {
      id:   'hasta_arriba',
      text: (_s) => 'Voy a por el máximo. No puedo parar aquí.',
      immediate: {
        narrative: (s) => `${s.character.name} decide ir hasta el límite. No porque necesite más — sino porque parar ahora se sentiría como rendirse a mitad de una frase. La ambición no siempre tiene explicación razonable. Pero tiene fuerza propia.`,
        statDeltas:     { ambicion: 0.5, logica: 0.2, estabilidad: -0.2, emocional: -0.15 },
        flags:          ['cumbre_profesional_alcanzada', 'ambicion_maxima'],
        careerResolver: (s) => ({
          ...s.career!,
          nivel:          5,
          salarioMensual: getCareerSalary(s.character.country, 5),
        }),
      },
      delayed: [
        {
          triggerYearsAfter: 5,
          narrative: (s) => `Desde la cima, ${s.character.name} ve más — y también siente el peso de lo que cuesta mantenerse ahí. Las dos cosas son ciertas al mismo tiempo.`,
          statDeltas: { ambicion: 0.15, estabilidad: 0.2 },
          flags:      ['perspectiva_desde_la_cima'],
        },
      ],
      memory: {
        id:   'memory_cumbre_maxima',
        text: (_s) => 'Cuando elegiste seguir subiendo cuando podías haberte quedado. Quisiste saber hasta dónde llegabas. Ahora lo sabes.',
      },
      epitaphSeed: 'fue más lejos de lo que cualquiera habría apostado',
    },

    {
      id:   'paso_el_testigo',
      text: (_s) => 'Empiezo a invertir en los que vienen detrás.',
      immediate: {
        narrative: (s) => `${s.character.name} empieza a redirigir la energía. Menos reuniones propias, más tiempo con los que están empezando. Hay algo en enseñar lo que sabes que no tiene equivalente en lo que construyes directamente. Y lo descubre tarde — pero lo descubre.`,
        statDeltas: { carisma: 0.5, emocional: 0.6, ambicion: -0.2 },
        flags:      ['cumbre_profesional_alcanzada', 'mentor_activo', 'eslabon_generacional'],
      },
      delayed: [
        {
          triggerYearsAfter: 8,
          narrative: (s) => `Gente que ${s.character.name} formó ocupa ahora posiciones que antes eran suyas. El legado tiene esa forma: no es tuyo, pero lleva tu huella.`,
          statDeltas: { emocional: 0.4, estabilidad: 0.3 },
          flags:      ['legado_profesional_visible'],
        },
      ],
      epitaphSeed: 'lo que construyó no fue solo para sí misma — lo repartió',
    },

    {
      id:   'salgo_de_la_cima',
      text: (_s) => 'Me salgo. La cima no era el destino que creía.',
      immediate: {
        narrative: (s) => `${s.character.name} decide que ha llegado — y que llegando se ha dado cuenta de que el sitio no era el que imaginaba. Lo deja. No en crisis: en claridad. Ahora la pregunta es otra. Y esa pregunta se parece más a vivir que cualquier reunión de los últimos diez años.`,
        statDeltas: { riesgo: 0.4, emocional: 0.6, estabilidad: -0.25, ambicion: -0.35 },
        flags:      ['cumbre_profesional_alcanzada', 'cumbre_superada'],
      },
      delayed: [
        {
          triggerYearsAfter: 3,
          narrative: (s) => `Tres años después de dejar la cima, ${s.character.name} se sorprende de lo poco que la echa de menos — y de lo mucho que no nota que falta.`,
          statDeltas: { emocional: 0.35, estabilidad: 0.25 },
        },
      ],
      epitaphSeed: 'llegó arriba y eligió bajarse para vivir otra cosa',
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────
export const CAREER_EVENTS: GameEventTemplate[] = [
  ascensoLaboral,
  ofertaCompetencia,
  crisisBurnout,
  proyectoDefinitivo,
  cumbreProfesional,
]
