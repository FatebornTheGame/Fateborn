import type { GameEventTemplate, GameState } from '../../types/game.types'
import { hasFlag, getFirstFriend } from '../../types/game.types'

function npcName(state: GameState): string {
  return getFirstFriend(state)?.name ?? 'alguien de tu entorno'
}

// ═══ EVENTO 13: PRIMER EMPLEO REAL (edad 19) ══════════════════════════════════
// Fires only when career is null — the player has never held a formal job.
const firstJobSearch: GameEventTemplate = {
  id:              'first_job_search',
  triggerAge:      19,
  triggerAntiFlags: ['primer_empleo_conseguido'],
  weight:          1,

  context: (state) => {
    const isCiencias    = hasFlag(state, 'camino_academico_ciencias')
    const isHumanidades = hasFlag(state, 'camino_academico_humanidades')
    const isTecnologia  = hasFlag(state, 'camino_academico_tecnologia')
    const isAmbicioso   = hasFlag(state, 'mentalidad_adulta_ambiciosa')
    const hasTrabajo16  = hasFlag(state, 'primer_trabajo_a_16')

    if (hasTrabajo16) {
      return `${state.character.name} lleva tres años haciendo trabajos eventuales. Con 19 llega el momento de dar el salto a algo con futuro real. ¿Qué dirección toma?`
    }
    if (isCiencias || isTecnologia) {
      return `Con la carrera técnica en el horizonte — o ya descartada — ${state.character.name} necesita saber de qué va a vivir. El primer empleo real define más de lo que parece.`
    }
    if (isHumanidades) {
      return `"¿Y de eso vas a vivir?" La pregunta que ${state.character.name} escuchó a los 14 regresa con más peso. El primer empleo real espera respuesta.`
    }
    if (isAmbicioso) {
      return `${state.character.name} quería construir algo grande. Con 19, la primera pregunta práctica es: ¿desde dónde?`
    }
    return `Con 19 años, ${state.character.name} se enfrenta al mercado laboral por primera vez. No hay teoría que valga — hay que entrar.`
  },

  options: [
    {
      id:   'empresa_sector',
      text: (s) => {
        if (hasFlag(s, 'camino_academico_ciencias') || hasFlag(s, 'camino_academico_tecnologia')) {
          return 'Entras en una empresa del sector. Sueldo modesto, pero con proyección.'
        }
        return 'Entras a trabajar en una empresa. No es tu sueño pero es un punto de partida sólido.'
      },
      immediate: {
        narrative: (s) => {
          const isTech = hasFlag(s, 'camino_academico_tecnologia')
          const isCiencias = hasFlag(s, 'camino_academico_ciencias')
          const empresa = isTech
            ? 'una startup tecnológica'
            : isCiencias
            ? 'una empresa de ingeniería'
            : 'una empresa de servicios'
          return `${s.character.name} empieza en ${empresa}. El primer día es largo. La primera nómina, corta. Pero hay un contrato con su nombre.`
        },
        statDeltas: { ambicion: 0.4, disciplina: 0.3 },
        flags:      ['primer_empleo_conseguido', 'empleo_sector_formal'],
        career: {
          profesion:      'Junior',
          nivel:          1,
          salarioMensual: 1100,
        },
      },
      delayed: [
        {
          triggerAge: 22,
          narrative: (s) => `Tres años en la misma empresa. ${s.character.name} sabe cómo funciona esto por dentro. Eso tiene precio en el mercado.`,
          statDeltas: { ambicion: 0.2, disciplina: 0.15 },
          flags:      ['experiencia_empresa_3_anos'],
        },
        {
          triggerAge: 26,
          narrative: (s) => {
            const hasExperiencia = hasFlag(s, 'experiencia_empresa_3_anos')
            return hasExperiencia
              ? `${s.character.name} con 26 tiene 7 años de experiencia. Poca gente de su generación puede decir lo mismo.`
              : `Con 26, ${s.character.name} revisa lo que ha construido laboralmente. La trayectoria empieza a tener forma.`
          },
          statDeltas: { ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_first_real_job',
        text: (_s) => 'El primer contrato de trabajo. La firma en el papel. Esa noche la cerveza sabía diferente.',
      },
      epitaphSeed: 'supo desde el primer contrato que el trabajo no lo era todo, pero entendió que sin él no había nada',
    },
    {
      id:   'autonomo_freelance',
      text: (_s) => 'Te lanzas por tu cuenta. Más riesgo, más control.',
      immediate: {
        narrative: (s) => {
          const isCreativo = s.stats.creatividad > 6
          const sector = isCreativo
            ? 'diseño y comunicación'
            : 'servicios y consultoría'
          return `${s.character.name} se da de alta como autónomo. ${sector.charAt(0).toUpperCase() + sector.slice(1)}. Los primeros clientes llegan despacio. La incertidumbre es constante. La libertad también.`
        },
        statDeltas: { riesgo: 0.4, ambicion: 0.5, estabilidad: -0.2 },
        flags:      ['primer_empleo_conseguido', 'autonomo_desde_joven'],
        career: {
          profesion:      'Autónomo',
          nivel:          1,
          salarioMensual: 800,
        },
      },
      delayed: [
        {
          triggerAge: 23,
          narrative: (s) => {
            const estaEstable = s.stats.estabilidad > 5 && s.economy.liquidez > 0
            return estaEstable
              ? `${s.character.name} con 23 ha construido una base de clientes estable. No es fácil. Es suyo.`
              : `Con 23, los altibajos del trabajo autónomo pesan. ${s.character.name} se pregunta si eligió bien.`
          },
          statDeltas: (s) => s.stats.estabilidad > 5
            ? { ambicion: 0.3, riesgo: 0.15 }
            : { estabilidad: 0.2, emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_freelance_start',
        text: (_s) => 'El día que decidiste que preferías la incertidumbre propia a la seguridad ajena.',
      },
      epitaphSeed: 'eligió el riesgo propio sobre la comodidad prestada',
    },
    {
      id:   'seguir_formandose',
      text: (_s) => 'Sigues formándote. El mercado puede esperar un poco más.',
      immediate: {
        narrative: (s) => {
          const hasBase = hasFlag(s, 'base_academica_solida') || hasFlag(s, 'base_cientifica_solida')
          return hasBase
            ? `${s.character.name} profundiza en lo que ya tiene. La formación avanzada puede abrir puertas que el primer empleo cierra.`
            : `${s.character.name} invierte un año más en formación. No hay nómina, pero hay dirección.`
        },
        statDeltas: { logica: 0.4, disciplina: 0.35 },
        flags:      ['formacion_extendida_19'],
      },
      delayed: [
        {
          triggerAge: 21,
          narrative: (s) => `Con 21, la formación extra de ${s.character.name} empieza a dar señales de valor. Las entrevistas van diferente.`,
          statDeltas: { ambicion: 0.2, logica: 0.2 },
          flags:      ['perfil_formado_21'],
        },
        {
          triggerAge: 24,
          narrative: (s) => {
            const hasEmpleo = hasFlag(s, 'primer_empleo_conseguido')
            return hasEmpleo
              ? `La formación tardía de ${s.character.name} combinada con experiencia lo sitúa en una posición sólida a los 24.`
              : `Con 24, ${s.character.name} tiene formación pero aún no ha dado el salto al mercado. Toca hacerlo.`
          },
          statDeltas: { disciplina: 0.2 },
        },
      ],
      memory: {
        id:   'memory_extra_study',
        text: (_s) => 'El año que decidiste estudiar un poco más cuando todos los demás ya ganaban dinero. La apuesta larga.',
      },
      epitaphSeed: 'apostó por la preparación cuando la impaciencia era la norma',
    },
  ],
}

// ═══ EVENTO 14: EMANCIPACIÓN (edad 21) ═══════════════════════════════════════
// The first time the character faces living independently.
const emancipation: GameEventTemplate = {
  id:         'emancipation',
  triggerAge: 21,
  weight:     1,

  context: (state) => {
    const hasTrabajo  = hasFlag(state, 'primer_empleo_conseguido') || state.career !== null
    const hasAmigo    = !!getFirstFriend(state)
    const amigoRef    = hasAmigo ? ` ${npcName(state)} ya se ha ido de casa.` : ''
    if (hasTrabajo) {
      return `${state.character.name} lleva tiempo con nómina pero sigue en casa.${amigoRef} La pregunta ya no es si irse — es cuándo.`
    }
    return `Con 21 años, la presión de independizarse se vuelve difícil de ignorar.${amigoRef} El mundo espera fuera.`
  },

  options: [
    {
      id:   'piso_compartido',
      text: (_s) => 'Piso compartido. Es la forma más razonable de empezar.',
      immediate: {
        narrative: (s) => {
          const hasAmigo = !!getFirstFriend(s)
          const companero = hasAmigo ? `con ${npcName(s)} y otros dos` : 'con tres desconocidos que acaban siendo algo más'
          return `${s.character.name} se muda ${companero}. El primer piso compartido huele a humedad y a libertad. No necesariamente en ese orden.`
        },
        statDeltas: { carisma: 0.3, emocional: 0.3, estabilidad: 0.1 },
        flags:      ['emancipado', 'piso_compartido'],
      },
      delayed: [
        {
          triggerAge: 24,
          narrative: (s) => `Tres años viviendo con otros. ${s.character.name} sabe cosas sobre la convivencia que no se aprenden de otra forma.`,
          statDeltas: { emocional: 0.2, carisma: 0.15 },
        },
      ],
      memory: {
        id:   'memory_first_flat',
        text: (_s) => 'El primer piso compartido. Las llaves propias. Las normas inventadas entre todos. El primer hogar tuyo.',
      },
      epitaphSeed: 'aprendió a convivir antes de aprender a vivir solo',
    },
    {
      id:   'piso_solo',
      text: (s) => s.career !== null
        ? 'Piso propio. Tienes ingresos. Vale la pena el esfuerzo económico.'
        : 'Piso solo. Ajustado, pero tuyo completamente.',
      immediate: {
        narrative: (s) => {
          const tieneCarrera = s.career !== null
          const ajuste = tieneCarrera
            ? 'La mitad del sueldo se va en alquiler. El resto alcanza justo. Pero es suyo.'
            : 'Los números no cuadran bien. Pero la independencia real tiene ese precio.'
          return `${s.character.name} firma el contrato de alquiler en solitario. ${ajuste}`
        },
        statDeltas: { estabilidad: 0.4, riesgo: 0.2, emocional: 0.25 },
        flags:      ['emancipado', 'vive_solo'],
      },
      delayed: [
        {
          triggerAge: 25,
          narrative: (s) => `Cuatro años solo. ${s.character.name} conoce sus propios ritmos mejor que nadie. Eso también es una forma de riqueza.`,
          statDeltas: { estabilidad: 0.2, disciplina: 0.15 },
        },
      ],
      memory: {
        id:   'memory_living_alone',
        text: (_s) => 'La primera noche solo en tu propio piso. El silencio que elegiste.',
      },
      epitaphSeed: 'aprendió que la soledad elegida es muy distinta a la impuesta',
    },
    {
      id:   'quedarse_en_casa',
      text: (_s) => 'Te quedas en casa un tiempo más. La situación económica no lo permite todavía.',
      immediate: {
        narrative: (s) => `${s.character.name} decide esperar. No es rendirse — es estrategia. Ahorrar ahora para saltar mejor después.`,
        statDeltas: { estabilidad: 0.3, ambicion: 0.1 },
        flags:      ['retrasa_emancipacion'],
      },
      delayed: [
        {
          triggerAge: 25,
          narrative: (s) => {
            const haAhorrado = s.economy.liquidez > 2000
            return haAhorrado
              ? `Con 25, ${s.character.name} tiene colchón económico real. Quedarse fue la decisión correcta.`
              : `Con 25, ${s.character.name} lleva cuatro años sin dar el paso. Hay algo que no termina de arrancar.`
          },
          statDeltas: (s) => s.economy.liquidez > 2000
            ? { estabilidad: 0.25, ambicion: 0.15 }
            : { emocional: 0.2 },
          flags: ['emancipado'],
        },
      ],
      memory: {
        id:   'memory_stayed_home',
        text: (_s) => 'El año que decidiste quedarte. No fue fácil explicárselo a nadie. No hacía falta.',
      },
      epitaphSeed: 'eligió el momento en lugar del impulso, y el momento llegó',
    },
  ],
}

// ═══ EVENTO 15: CRISIS DE CARRERA (edad 25) ═══════════════════════════════════
// The first real professional crossroads — stay the course or pivot.
// Fires once the character has been working for a few years.
const careerChallenge: GameEventTemplate = {
  id:              'career_challenge',
  triggerAge:      25,
  triggerAntiFlags: ['crisis_carrera_resuelta'],
  weight:          1,

  context: (state) => {
    const isAmbicioso = hasFlag(state, 'mentalidad_adulta_ambiciosa')
    const isAutonomo  = hasFlag(state, 'autonomo_desde_joven')
    const hasCarrera  = state.career !== null

    if (isAutonomo) {
      return `Cinco años como autónomo. ${state.character.name} tiene clientes y tiene cicatrices. Ahora se plantea si seguir igual o cambiar el modelo.`
    }
    if (hasCarrera && isAmbicioso) {
      return `${state.character.name} lleva años trabajando con la cabeza en algo más grande. Con 25, la brecha entre lo que hace y lo que quiere hacer es difícil de ignorar.`
    }
    if (hasCarrera) {
      return `Con 25 años y varios en el mercado laboral, ${state.character.name} se pregunta si está en el camino correcto o simplemente en el camino que tomó.`
    }
    return `Con 25 años, la dirección profesional de ${state.character.name} sigue sin estar clara. Ya no hay tiempo para dejarlo para después.`
  },

  options: [
    {
      id:   'ascender_consolidar',
      text: (_s) => 'Te quedas y apuestas por crecer dentro. La estabilidad tiene valor.',
      immediate: {
        narrative: (s) => {
          const nivel = s.career ? s.career.nivel : 1
          const siguiente = nivel >= 3 ? 'un puesto de responsabilidad real' : 'el siguiente escalón'
          return `${s.character.name} decide que vale la pena apostar por lo que tiene. Pide ${siguiente}. La respuesta tarda tres meses.`
        },
        statDeltas: { disciplina: 0.3, ambicion: 0.35, estabilidad: 0.2 },
        flags:      ['crisis_carrera_resuelta', 'apuesta_por_estabilidad'],
        career: {
          profesion:      'Senior',
          nivel:          2,
          salarioMensual: 1800,
        },
      },
      delayed: [
        {
          triggerAge: 30,
          narrative: (s) => `A los 30, la apuesta por la estabilidad de ${s.character.name} tiene nombre y cifra. No todo el mundo eligió igual. No todos llegaron igual.`,
          statDeltas: { estabilidad: 0.2, ambicion: 0.15 },
        },
      ],
      memory: {
        id:   'memory_career_stability',
        text: (_s) => 'La primera vez que elegiste quedarte cuando todo el mundo parecía irse. La apuesta por lo construido.',
      },
      epitaphSeed: 'entendió que crecer despacio también es crecer',
    },
    {
      id:   'cambio_radical',
      text: (_s) => 'Cambias de dirección. Lo que construiste sirve de base, no de jaula.',
      immediate: {
        narrative: (s) => {
          const isTech = hasFlag(s, 'camino_academico_tecnologia')
          const nuevaSector = isTech ? 'un proyecto propio con base técnica' : 'un giro hacia algo más alineado con lo que realmente quiere'
          return `${s.character.name} da el salto. ${nuevaSector.charAt(0).toUpperCase() + nuevaSector.slice(1)}. El miedo y la claridad llegan juntos, como siempre.`
        },
        statDeltas: { riesgo: 0.4, ambicion: 0.5, estabilidad: -0.15 },
        flags:      ['crisis_carrera_resuelta', 'cambio_profesional_25'],
        career: {
          profesion:      'Emprendedor',
          nivel:          1,
          salarioMensual: 900,
        },
      },
      delayed: [
        {
          triggerAge: 28,
          narrative: (s) => {
            const riesgoAlto = s.stats.riesgo > 6
            return riesgoAlto
              ? `Con 28, el cambio de ${s.character.name} tiene nombre y tracción. No fue el camino fácil. Fue el suyo.`
              : `Con 28, el cambio profesional de ${s.character.name} muestra resultados mixtos. Aprender es parte del precio.`
          },
          statDeltas: (s) => s.stats.riesgo > 6
            ? { ambicion: 0.3, riesgo: 0.2 }
            : { estabilidad: 0.25, emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_career_pivot',
        text: (_s) => 'El día que decidiste que lo construido era una base y no un destino. El salto.',
      },
      epitaphSeed: 'nunca confundió comodidad con vocación',
    },
    {
      id:   'pausa_reflexion',
      text: (_s) => 'Tomas una pausa. Antes de decidir, necesitas saber adónde quieres ir.',
      immediate: {
        narrative: (s) => `${s.character.name} frena. No es cobardia — es no querer equivocarse de dirección a 200km/h. Algunos meses para pensar cuestan menos que años en el camino incorrecto.`,
        statDeltas: { emocional: 0.4, estabilidad: 0.3 },
        flags:      ['crisis_carrera_resuelta', 'pausa_reflexiva_25'],
      },
      delayed: [
        {
          triggerYearsAfter: 1,
          narrative: (s) => `Un año después, ${s.character.name} tiene más claridad. No certeza — claridad. Con eso se puede avanzar.`,
          statDeltas: { estabilidad: 0.2, ambicion: 0.25 },
          flags:      ['claridad_post_pausa'],
        },
        {
          triggerAge: 30,
          narrative: (s) => {
            const tieneCarrera = s.career !== null
            return tieneCarrera
              ? `A los 30, la pausa de ${s.character.name} tiene perspectiva. Quien la tomó por debilidad se equivocaba.`
              : `Con 30, ${s.character.name} sabe lo que no quiere con más precisión que nunca. El siguiente paso es definir lo que sí.`
          },
          statDeltas: { emocional: 0.2 },
        },
      ],
      memory: {
        id:   'memory_career_pause',
        text: (_s) => 'Los meses que te tomaste para pensar en lugar de actuar. Parecía un lujo. Era una inversión.',
      },
      epitaphSeed: 'aprendió que parar a tiempo es también una forma de avanzar',
    },
  ],
}

export const YOUTH_EVENTS: GameEventTemplate[] = [
  firstJobSearch,
  emancipation,
  careerChallenge,
]
