import type { GameState, NarrativeEntry } from '../types/game.types'
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
        { id: 'jugar',    label: 'Invitar a jugar',       color: 'gold'   },
        { id: 'timido',   label: 'Quedarte en silencio',  color: 'muted'  },
      ],
    ),
  },
  {
    id: 'hobby_discovery',
    type: 'fixed',
    triggerAge: 8,
    generate: (state) => {
      const stat = state.character?.stats
      const isCreative = (stat?.creatividad ?? 0) > 6
      const isAthletic = (stat?.fisico ?? 0) > 6
      const hobby = isCreative ? 'dibujar y crear mundos imaginarios'
        : isAthletic ? 'correr y competir en el recreo'
        : 'leer y pasar horas en la biblioteca'
      return entry(
        `Con 8 años empiezas a dedicar tiempo libre a ${hobby}. ` +
        `Una semilla que podría crecer.`,
        'normal',
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
        { id: 'confrontar',  label: 'Plantarle cara',       color: 'garnet' },
        { id: 'ignorar',     label: 'Ignorarlo y seguir',   color: 'muted'  },
        { id: 'pedir_ayuda', label: 'Pedir ayuda a un adulto', color: 'gold' },
      ],
    ),
  },
  {
    id: 'family_dynamic',
    type: 'fixed',
    triggerAge: 11,
    generate: (state) => {
      const hasPareja = state.gameFlags.tienePareja
      const texto = hasPareja
        ? `Tu familia atraviesa un momento de tensión. Las discusiones en casa son cada vez más frecuentes.`
        : `Con 11 años empiezas a entender las complejidades de tu familia. Hay cosas que antes no veías.`
      return entry(texto, 'normal')
    },
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
      return entry(
        `Con 12 años, los que te rodean empiezan a notar algo especial en ti: ${DESC[topStat] ?? 'algo difícil de definir'}. ` +
        `Este talento natural será parte de quien eres.`,
        'alta',
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
        { id: 'acercarse',  label: 'Intentar acercarte',  color: 'gold'   },
        { id: 'observar',   label: 'Observar desde lejos', color: 'muted' },
        { id: 'ignorarlo',  label: 'Ignorar los sentimientos', color: 'garnet' },
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
          { id: 'ciencias',     label: 'Ciencias y Matemáticas', color: 'gold'   },
          { id: 'humanidades',  label: 'Humanidades y Artes',     color: 'garnet' },
          { id: 'tecnologia',   label: 'Tecnología e Informática', color: 'muted' },
        ],
      )
    },
  },
  {
    id: 'first_job_idea',
    type: 'fixed',
    triggerAge: 16,
    generate: (_state) => entry(
      `Con 16 años ya puedes trabajar de forma legal. El mundo laboral se abre ante ti. ` +
      `También eres libre de empezar a tomar decisiones importantes sobre tu futuro.`,
      'critica',
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
        { id: 'universidad',  label: 'Ir a la universidad',         color: 'gold'   },
        { id: 'fp',           label: 'Formación profesional',        color: 'muted'  },
        { id: 'trabajar',     label: 'Empezar a trabajar ya',        color: 'garnet' },
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
      `A partir de ahora, cada decisión es tuya — y sus consecuencias, también.`,
      'critica',
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
      return 0.05 + ambicion * 0.01  // 5-15% por trimestre
    },
    generate: (_state) => entry(
      `Una oportunidad aparece sin avisar. Requiere atención inmediata y algo de coraje.`,
      'alta',
      [
        { id: 'aprovechar', label: 'Aprovecharla', color: 'gold'   },
        { id: 'ignorar',    label: 'Dejarlo pasar', color: 'muted' },
      ],
    ),
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
