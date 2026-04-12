import type { GameState, NarrativeEntry, CharacterStats } from '../types/game.types'
import { getLifeStage } from './timeSystem'

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface GameEvent {
  id: string
  type: 'fixed' | 'probabilistic'
  triggerAge?: number
  triggerCondition?: (state: GameState) => boolean
  probability?: (state: GameState) => number
  repeatable?: boolean
  generate: (state: GameState) => NarrativeEntry
}

// ─── Helpers internos ─────────────────────────────────────────────────────────
function entry(
  text: string,
  importance: NarrativeEntry['importance'],
  options?: NarrativeEntry['options'],
): NarrativeEntry {
  return { week: 0, year: 0, text, importance, answered: options === undefined, options }
}

// ─── EVENTOS FIJOS — INFANCIA (0-12) ─────────────────────────────────────────
export const CHILDHOOD_EVENTS: GameEvent[] = [
  {
    id: 'first_friend',
    type: 'fixed',
    triggerAge: 6,
    generate: (state) => entry(
      `Con 6 años, ${state.character?.name ?? 'tú'} conoce a su primer amigo en el colegio. ` +
      `Una conexión sencilla pero real. ¿Cómo reaccionas?`,
      'alta',
      [
        { id: 'acercarse', color: 'gold',
          label: 'Te acercas y le preguntas su nombre. La curiosidad puede más que la timidez.',
          statDeltas: [{ stat: 'carisma', delta: 0.3 }],
          addFriend: true,
          flagsToSet: { perfil_social: 'extrovertido' } },
        { id: 'observar', color: 'muted',
          label: 'Le observas durante días antes de hablar. Cuando lo haces, ya le conoces.',
          statDeltas: [{ stat: 'emocional', delta: 0.3 }],
          addFriend: true,
          flagsToSet: { perfil_social: 'observador' } },
        { id: 'solo', color: 'garnet',
          label: 'Prefieres jugar solo. Los grupos siempre complican las cosas.',
          statDeltas: [{ stat: 'estabilidad', delta: 0.2 }, { stat: 'logica', delta: 0.2 }],
          flagsToSet: { perfil_social: 'introvertido' } },
      ],
    ),
  },
  {
    id: 'hobby_discovery',
    type: 'fixed',
    triggerAge: 8,
    generate: (state) => {
      const s = state.character?.stats
      const fisico      = s?.fisico      ?? 0
      const logica      = s?.logica      ?? 0
      const creatividad = s?.creatividad ?? 0

      if (fisico >= logica && fisico >= creatividad) {
        return entry(
          `Con 8 años, tu energía desbordante pide ser canalizada. El deporte te llama. ¿Qué eliges?`,
          'alta',
          [
            { id: 'futbol', color: 'gold',
              label: 'Fútbol con otros niños del barrio.',
              statDeltas: [{ stat: 'fisico', delta: 0.4 }, { stat: 'carisma', delta: 0.2 }],
              flagsToSet: { hobby_principal: 'futbol' } },
            { id: 'natacion', color: 'muted',
              label: 'Natación en la piscina municipal.',
              statDeltas: [{ stat: 'fisico', delta: 0.4 }, { stat: 'disciplina', delta: 0.2 }],
              flagsToSet: { hobby_principal: 'natacion' } },
            { id: 'artes_marciales', color: 'garnet',
              label: 'Artes marciales que tu padre propone.',
              statDeltas: [{ stat: 'fisico', delta: 0.3 }, { stat: 'disciplina', delta: 0.3 }],
              flagsToSet: { hobby_principal: 'artes_marciales' } },
          ],
        )
      }
      if (logica >= creatividad) {
        return entry(
          `Con 8 años, tu mente busca desafíos. Te atraen las cosas que tienen solución. ¿Qué eliges?`,
          'alta',
          [
            { id: 'ajedrez', color: 'gold',
              label: 'Ajedrez en el club del colegio.',
              statDeltas: [{ stat: 'logica', delta: 0.4 }, { stat: 'disciplina', delta: 0.2 }],
              flagsToSet: { hobby_principal: 'ajedrez' } },
            { id: 'construir', color: 'muted',
              label: 'Construir cosas con lo que encuentras.',
              statDeltas: [{ stat: 'logica', delta: 0.3 }, { stat: 'creatividad', delta: 0.3 }],
              flagsToSet: { hobby_principal: 'construir' } },
            { id: 'leer', color: 'garnet',
              label: 'Leer todo lo que cae en tus manos.',
              statDeltas: [{ stat: 'logica', delta: 0.3 }, { stat: 'emocional', delta: 0.2 }],
              flagsToSet: { hobby_principal: 'leer' } },
          ],
        )
      }
      return entry(
        `Con 8 años, tu imaginación trabaja sin descanso. Necesitas crear. ¿Qué eliges?`,
        'alta',
        [
          { id: 'dibujar', color: 'gold',
            label: 'Dibujar en todos los cuadernos.',
            statDeltas: [{ stat: 'creatividad', delta: 0.4 }, { stat: 'disciplina', delta: 0.2 }],
            flagsToSet: { hobby_principal: 'dibujar' } },
          { id: 'historias', color: 'muted',
            label: 'Inventar historias y contarlas.',
            statDeltas: [{ stat: 'creatividad', delta: 0.3 }, { stat: 'carisma', delta: 0.2 }],
            flagsToSet: { hobby_principal: 'contar_historias' } },
          { id: 'musica', color: 'garnet',
            label: 'Música: el instrumento que más te llama.',
            statDeltas: [{ stat: 'creatividad', delta: 0.3 }, { stat: 'emocional', delta: 0.3 }],
            flagsToSet: { hobby_principal: 'musica' } },
        ],
      )
    },
  },
  {
    id: 'school_conflict',
    type: 'fixed',
    triggerAge: 10,
    generate: (_state) => entry(
      `Un conflicto en el colegio. Un compañero se mete contigo de forma repetida. ` +
      `Los profesores no intervienen. ¿Qué haces?`,
      'alta',
      [
        { id: 'confrontar',  label: 'Plantarle cara',           color: 'garnet',
          statDeltas: [{ stat: 'riesgo', delta: 0.3 }, { stat: 'disciplina', delta: 0.2 }] },
        { id: 'ignorar',     label: 'Ignorarlo y seguir',       color: 'muted',
          statDeltas: [{ stat: 'estabilidad', delta: 0.3 }] },
        { id: 'pedir_ayuda', label: 'Pedir ayuda a un adulto',  color: 'gold',
          statDeltas: [{ stat: 'emocional', delta: 0.3 }, { stat: 'disciplina', delta: 0.15 }] },
      ],
    ),
  },
  {
    id: 'family_dynamic',
    type: 'fixed',
    triggerAge: 11,
    generate: (_state) => entry(
      `Con 11 años empiezas a captar las tensiones dentro de tu familia. ` +
      `Las conversaciones de los adultos llegan a tus oídos. ¿Cómo reaccionas?`,
      'alta',
      [
        { id: 'escuchar', color: 'gold',
          label: 'Escuchas sin decir nada. Aprendes mucho así.',
          statDeltas: [{ stat: 'emocional', delta: 0.3 }, { stat: 'estabilidad', delta: 0.2 }] },
        { id: 'preguntar', color: 'muted',
          label: 'Preguntas directamente. Mereces saber la verdad.',
          statDeltas: [{ stat: 'carisma', delta: 0.2 }, { stat: 'riesgo', delta: 0.2 }] },
        { id: 'ignorar', color: 'garnet',
          label: 'Te concentras en tus cosas. Los problemas adultos no son los tuyos.',
          statDeltas: [{ stat: 'estabilidad', delta: 0.3 }, { stat: 'disciplina', delta: 0.2 }] },
      ],
    ),
  },
  {
    id: 'talent_discovered',
    type: 'fixed',
    triggerAge: 12,
    generate: (state) => {
      const stats = state.character?.stats
      if (!stats) return entry('Con 12 años, algo en ti empieza a destacar.', 'normal')
      const sorted = (Object.entries(stats) as [string, number][])
        .sort((a, b) => b[1] - a[1])
      const [topStat] = sorted[0]
      const DESC: Record<string, string> = {
        logica:       'una mente analítica que resuelve problemas con facilidad',
        creatividad:  'una imaginación desbordante que sorprende a todos',
        disciplina:   'una capacidad de concentración poco común para tu edad',
        carisma:      'una facilidad natural para hacer amigos y liderar',
        emocional:    'una sensibilidad especial que te permite leer a los demás',
        ambicion:     'un fuego interior que te impulsa a querer más',
        fisico:       'unas capacidades físicas que destacan entre tus iguales',
        riesgo:       'una valentía que a veces alarma a los adultos',
        estabilidad:  'una madurez emocional avanzada para tu edad',
      }
      const topStatKey = topStat as keyof CharacterStats
      return entry(
        `Con 12 años, los que te rodean empiezan a notar algo especial en ti: ${DESC[topStat] ?? 'algo difícil de definir'}. ` +
        `¿Cómo canalizas este talento?`,
        'alta',
        [
          { id: 'cultivar', color: 'gold',
            label: 'Lo cultivas con dedicación. Practicas cuando nadie te ve.',
            statDeltas: [{ stat: topStatKey, delta: 0.4 }, { stat: 'disciplina', delta: 0.2 }],
            flagsToSet: { talento_cultivado: true } },
          { id: 'compartir', color: 'muted',
            label: 'Lo compartes con otros. La admiración te impulsa a más.',
            statDeltas: [{ stat: topStatKey, delta: 0.2 }, { stat: 'carisma', delta: 0.3 }],
            flagsToSet: { talento_publico: true } },
          { id: 'ignorar', color: 'garnet',
            label: 'No le das importancia. El talento sin dirección no es nada.',
            statDeltas: [{ stat: 'estabilidad', delta: 0.3 }] },
        ],
      )
    },
  },
]

// ─── EVENTOS FIJOS — ADOLESCENCIA (13-18) ────────────────────────────────────
export const ADOLESCENCE_EVENTS: GameEvent[] = [
  {
    id: 'first_love',
    type: 'fixed',
    triggerAge: 13,
    generate: (_state) => entry(
      `Con 13 años, alguien capta tu atención de una manera diferente. ` +
      `Por primera vez, los sentimientos se vuelven confusos y emocionantes al mismo tiempo. ` +
      `¿Cómo lo manejas?`,
      'alta',
      [
        { id: 'acercarse', label: 'Intentar acercarte',        color: 'gold',
          statDeltas: [{ stat: 'carisma', delta: 0.4 }, { stat: 'emocional', delta: 0.3 }],
          addFriend: true },
        { id: 'observar',  label: 'Observar desde lejos',      color: 'muted',
          statDeltas: [{ stat: 'emocional', delta: 0.2 }, { stat: 'creatividad', delta: 0.2 }] },
        { id: 'ignorarlo', label: 'Ignorar los sentimientos',  color: 'garnet',
          statDeltas: [{ stat: 'disciplina', delta: 0.3 }] },
      ],
    ),
  },
  {
    id: 'academic_path',
    type: 'fixed',
    triggerAge: 14,
    generate: (state) => {
      const logica = state.character?.stats.logica ?? 5
      const creatividad = state.character?.stats.creatividad ?? 5
      const path = logica > creatividad ? 'ciencias y matemáticas' : 'humanidades y artes'
      return entry(
        `Con 14 años, el sistema educativo empieza a pedir que te definas. ` +
        `Tu perfil apunta hacia ${path}, pero tú tienes la última palabra. ¿Qué eliges?`,
        'alta',
        [
          { id: 'ciencias',    label: 'Ciencias y Matemáticas',    color: 'gold',
            statDeltas: [{ stat: 'logica', delta: 0.5 }, { stat: 'disciplina', delta: 0.3 }],
            flagsToSet: { camino_academico: 'ciencias' } },
          { id: 'humanidades', label: 'Humanidades y Artes',       color: 'garnet',
            statDeltas: [{ stat: 'creatividad', delta: 0.5 }, { stat: 'emocional', delta: 0.3 }],
            flagsToSet: { camino_academico: 'humanidades' } },
          { id: 'tecnologia',  label: 'Tecnología e Informática',  color: 'muted',
            statDeltas: [{ stat: 'logica', delta: 0.4 }, { stat: 'riesgo', delta: 0.2 }],
            flagsToSet: { camino_academico: 'tecnologia' } },
        ],
      )
    },
  },
  {
    id: 'first_job_idea',
    type: 'fixed',
    triggerAge: 16,
    generate: (_state) => entry(
      `Con 16 años ya puedes trabajar de forma legal. El mundo laboral se abre ante ti, ` +
      `pero el tiempo es limitado. ¿Qué priorizas?`,
      'critica',
      [
        { id: 'trabajar', color: 'gold',
          label: 'Busco un trabajo. La independencia económica vale el sacrificio.',
          statDeltas: [{ stat: 'ambicion', delta: 0.4 }, { stat: 'disciplina', delta: 0.3 }],
          flagsToSet: { decision_16: 'trabajar' } },
        { id: 'estudiar', color: 'muted',
          label: 'Me centro en los estudios. El trabajo puede esperar.',
          statDeltas: [{ stat: 'logica', delta: 0.3 }, { stat: 'disciplina', delta: 0.3 }],
          flagsToSet: { decision_16: 'estudiar' } },
        { id: 'equilibrio', color: 'garnet',
          label: 'Intento compaginar ambas cosas. No es fácil, pero aprendo.',
          statDeltas: [{ stat: 'ambicion', delta: 0.2 }, { stat: 'estabilidad', delta: 0.3 }],
          flagsToSet: { decision_16: 'equilibrio' } },
      ],
    ),
  },
  {
    id: 'end_of_high_school',
    type: 'fixed',
    triggerAge: 17,
    generate: (_state) => entry(
      `El final del instituto se acerca. Años de rutina, amigos, conflictos y aprendizajes. ` +
      `La siguiente etapa exige una decisión: ¿universidad, formación profesional o vida laboral directa?`,
      'critica',
      [
        { id: 'universidad', label: 'Ir a la universidad',    color: 'gold',
          statDeltas: [{ stat: 'logica', delta: 0.4 }, { stat: 'ambicion', delta: 0.3 }],
          flagsToSet: { decision_instituto: 'universidad' } },
        { id: 'fp',          label: 'Formación profesional',  color: 'muted',
          statDeltas: [{ stat: 'disciplina', delta: 0.4 }, { stat: 'ambicion', delta: 0.2 }],
          flagsToSet: { decision_instituto: 'fp' } },
        { id: 'trabajar',    label: 'Empezar a trabajar ya',  color: 'garnet',
          statDeltas: [{ stat: 'ambicion', delta: 0.5 }, { stat: 'riesgo', delta: 0.3 }],
          flagsToSet: { decision_instituto: 'trabajo_directo' } },
      ],
    ),
  },
  {
    id: 'adulthood_threshold',
    type: 'fixed',
    triggerAge: 18,
    generate: (state) => entry(
      `${state.character?.name ?? 'Tú'} cumple 18 años. ` +
      `La infancia y la adolescencia quedan atrás. ` +
      `A partir de ahora, cada decisión es tuya — y sus consecuencias, también. ` +
      `¿Cuál es tu mentalidad al entrar en la edad adulta?`,
      'critica',
      [
        { id: 'ambicioso', color: 'gold',
          label: 'Voy a construir algo grande. El mundo no me espera.',
          statDeltas: [{ stat: 'ambicion', delta: 0.5 }, { stat: 'riesgo', delta: 0.2 }],
          flagsToSet: { mentalidad_adulta: 'ambicioso' } },
        { id: 'cauto', color: 'muted',
          label: 'Paso a paso. Las decisiones precipitadas cuestan caro.',
          statDeltas: [{ stat: 'estabilidad', delta: 0.4 }, { stat: 'disciplina', delta: 0.3 }],
          flagsToSet: { mentalidad_adulta: 'cauto' } },
        { id: 'libre', color: 'garnet',
          label: 'Primero quiero vivir. Ya habrá tiempo para ser responsable.',
          statDeltas: [{ stat: 'creatividad', delta: 0.3 }, { stat: 'emocional', delta: 0.3 }],
          flagsToSet: { mentalidad_adulta: 'libre' } },
      ],
    ),
  },
]

// ─── EVENTOS PROBABILÍSTICOS ──────────────────────────────────────────────────
export const PROBABILISTIC_EVENTS: GameEvent[] = [
  {
    id: 'unexpected_opportunity',
    type: 'probabilistic',
    repeatable: true,
    probability: (state) => {
      const ambicion = state.character?.stats.ambicion ?? 5
      return 0.05 + ambicion * 0.01  // 5–15% por trimestre
    },
    generate: (state) => {
      const st      = state.character?.stats
      const country = state.character?.country ?? ''
      const fisico  = st?.fisico   ?? 5
      const logica  = st?.logica   ?? 5
      const carisma = st?.carisma  ?? 5
      const ambicion = st?.ambicion ?? 5

      // África subsahariana + Físico alto → oportunidad deportiva
      if (['Nigeria', 'Senegal', 'Ghana', 'Camerún', 'Costa de Marfil'].includes(country) && fisico >= 7) {
        return entry(
          `Un entrenador de fútbol del barrio ha visto cómo juegas. ` +
          `Te propone entrenar con su equipo los sábados por la mañana. ` +
          `Requiere constancia, pero podría abrirte puertas que ahora no imaginas.`,
          'alta',
          [
            { id: 'aceptar', color: 'gold',
              label: 'Acepto. El esfuerzo merece la pena.',
              statDeltas: [{ stat: 'fisico', delta: 0.4 }, { stat: 'disciplina', delta: 0.3 }],
              flagsToSet: { oportunidad_deporte: true } },
            { id: 'pensar', color: 'muted',
              label: 'Me interesa, pero necesito pensarlo.',
              statDeltas: [{ stat: 'estabilidad', delta: 0.1 }],
              flagsToSet: { oportunidad_pendiente: 'futbol' } },
            { id: 'rechazar', color: 'garnet',
              label: 'No es el momento. Hay otras prioridades.',
              statDeltas: [{ stat: 'estabilidad', delta: 0.2 }] },
          ],
        )
      }

      // Europa Occidental + Lógica alta → olimpiada escolar
      if (['España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal'].includes(country) && logica >= 7) {
        return entry(
          `Tu profesora de matemáticas cree que tienes potencial para la olimpiada escolar. ` +
          `Requiere preparación extra fuera del horario lectivo, ` +
          `pero el reconocimiento podría acompañarte durante años.`,
          'alta',
          [
            { id: 'aceptar', color: 'gold',
              label: 'Acepto el reto. Me preparo en serio.',
              statDeltas: [{ stat: 'logica', delta: 0.5 }, { stat: 'disciplina', delta: 0.3 }],
              flagsToSet: { olimpiada_academica: true } },
            { id: 'pensar', color: 'muted',
              label: 'Pido tiempo para decidirlo.',
              statDeltas: [{ stat: 'logica', delta: 0.1 }],
              flagsToSet: { oportunidad_pendiente: 'olimpiada' } },
            { id: 'rechazar', color: 'garnet',
              label: 'No quiero presión extra ahora mismo.',
              statDeltas: [{ stat: 'estabilidad', delta: 0.2 }] },
          ],
        )
      }

      // Carisma alto → liderazgo en clase
      if (carisma >= 7) {
        return entry(
          `El tutor de tu clase propone que lideres el proyecto de fin de curso. ` +
          `Tendrás que coordinar a otros, gestionar tiempos y hablar en público. ` +
          `Es una responsabilidad que no pasa desapercibida.`,
          'alta',
          [
            { id: 'aceptar', color: 'gold',
              label: 'Lo hago. La responsabilidad me motiva.',
              statDeltas: [{ stat: 'carisma', delta: 0.4 }, { stat: 'ambicion', delta: 0.3 }],
              flagsToSet: { lider_clase: true } },
            { id: 'compartir', color: 'muted',
              label: 'Acepto si puedo elegir con quién trabajar.',
              statDeltas: [{ stat: 'carisma', delta: 0.2 }, { stat: 'emocional', delta: 0.2 }] },
            { id: 'rechazar', color: 'garnet',
              label: 'No es para mí. Prefiero contribuir desde atrás.',
              statDeltas: [{ stat: 'estabilidad', delta: 0.2 }] },
          ],
        )
      }

      // Ambición alta → oportunidad genérica con contexto
      if (ambicion >= 6) {
        return entry(
          `Alguien en quien confías señala algo en ti que todavía no has explorado. ` +
          `La oportunidad requiere salir de tu zona de confort, pero podría cambiarlo todo.`,
          'alta',
          [
            { id: 'aprovechar', color: 'gold',
              label: 'La aprovecho. Hay que actuar cuando llega el momento.',
              statDeltas: [{ stat: 'ambicion', delta: 0.3 }, { stat: 'riesgo', delta: 0.2 }] },
            { id: 'evaluar', color: 'muted',
              label: 'La evalúo con calma antes de decidir.',
              statDeltas: [{ stat: 'logica', delta: 0.2 }, { stat: 'estabilidad', delta: 0.2 }] },
            { id: 'ignorar', color: 'garnet',
              label: 'No es el momento adecuado.',
              statDeltas: [{ stat: 'estabilidad', delta: 0.2 }] },
          ],
        )
      }

      // Fallback
      return entry(
        `Una oportunidad pequeña pero real aparece sin avisar. ` +
        `A veces las cosas importantes empiezan así, sin fanfarria.`,
        'normal',
        [
          { id: 'aprovechar', color: 'gold',
            label: 'La aprovecho sin pensarlo demasiado.',
            statDeltas: [{ stat: 'riesgo', delta: 0.2 }] },
          { id: 'evaluar', color: 'muted',
            label: 'Analizo antes de decidir.',
            statDeltas: [{ stat: 'logica', delta: 0.2 }] },
          { id: 'ignorar', color: 'garnet',
            label: 'Paso. No todas las oportunidades son para uno.',
            statDeltas: [{ stat: 'estabilidad', delta: 0.2 }] },
        ],
      )
    },
  },
  {
    id: 'health_scare',
    type: 'probabilistic',
    repeatable: true,
    probability: (state) => {
      if (state.vitalLoad < 50) return 0.02
      if (state.vitalLoad < 75) return 0.06
      return 0.12  // 12% si carga vital > 75
    },
    generate: (_state) => entry(
      `Un susto de salud. Nada grave de momento, pero el cuerpo avisa. ` +
      `El médico recomienda descanso y menos estrés.`,
      'alta',
    ),
  },
  {
    id: 'social_event',
    type: 'probabilistic',
    repeatable: true,
    probability: (state) => {
      const social = (state.character?.stats.carisma ?? 5) / 10
      return 0.08 * social  // más carisma = más eventos sociales
    },
    triggerCondition: (state) => state.ageYears >= 16,
    generate: (_state) => entry(
      `Una reunión social inesperada. Puede ser el inicio de algo, o simplemente un buen momento.`,
      'normal',
    ),
  },
]

// ─── Motor de selección de eventos por trimestre ──────────────────────────────
export function getEventsForQuarter(state: GameState): GameEvent[] {
  const fired = state.character?.flags ?? {}
  const stage = getLifeStage(state.ageYears)
  const result: GameEvent[] = []

  const allFixed = [...CHILDHOOD_EVENTS, ...ADOLESCENCE_EVENTS]

  // 1. Eventos fijos por edad (solo si no han disparado ya)
  for (const ev of allFixed) {
    if (ev.triggerAge === state.ageYears && !fired[`ev_${ev.id}`]) {
      result.push(ev)
    }
  }

  // 2. Eventos probabilísticos (según stage y condiciones)
  for (const ev of PROBABILISTIC_EVENTS) {
    // Condición de stage mínimo (ej: no social events en infancia)
    if (ev.triggerCondition && !ev.triggerCondition(state)) continue
    if (stage === 'infancia' && ev.id !== 'health_scare') continue

    const alreadyFired = fired[`ev_${ev.id}`]
    if (alreadyFired && !ev.repeatable) continue

    const prob = ev.probability?.(state) ?? 0
    if (Math.random() < prob) {
      result.push(ev)
    }
  }

  return result
}
