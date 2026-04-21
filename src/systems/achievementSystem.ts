import type { GameState, Achievement } from '../types/game.types'
import { hasFlag } from '../types/game.types'

export function checkAchievements(state: GameState, prevState: GameState): Achievement[] {
  const newAchievements: Achievement[] = []
  const age  = state.ageYears
  const year = state.character.birthYear + age

  // Guard: skip if the achievement was already unlocked in the previous state
  const has = (id: string) => prevState.achievements.some(a => a.id === id)

  // ── ECONÓMICO ──────────────────────────────────────────────────────────────

  // 6 months of income saved — first real financial cushion
  if (!has('INDEPENDENCIA_ECONOMICA')
      && state.economy.ingresosMensual > 0
      && state.economy.liquidez >= state.economy.ingresosMensual * 6)
    newAchievements.push({
      id: 'INDEPENDENCIA_ECONOMICA', age, year, category: 'economico',
      title:       'El colchón',
      description: 'Por primera vez, tienes suficiente para aguantar un golpe.',
    })

  // First career — first time a salary contract exists
  if (!has('PRIMER_EMPLEO') && state.career !== null && prevState.career === null)
    newAchievements.push({
      id: 'PRIMER_EMPLEO', age, year, category: 'profesional',
      title:       'La primera nómina',
      description: 'El primer contrato con tu nombre. Corto en dinero, largo en lo que significa.',
    })

  // ── SOCIAL ─────────────────────────────────────────────────────────────────

  // A friend who chose to stay — status 'leal' reached for the first time
  if (!has('AMIGO_LEAL') && state.friends.some(f => f.status === 'leal'))
    newAchievements.push({
      id: 'AMIGO_LEAL', age, year, category: 'social',
      title:       'Alguien que siempre está',
      description: 'Hay personas que eligen quedarse. No es algo menor.',
    })

  // 12-year friendship — the amistad_larga flag fires at age 18 in firstFriend delayed
  if (!has('AMISTAD_LARGA') && hasFlag(state, 'amistad_larga'))
    newAchievements.push({
      id: 'AMISTAD_LARGA', age, year, category: 'social',
      title:       'Doce años',
      description: 'Pocas relaciones sobreviven la infancia, la adolescencia y lo que viene después.',
    })

  // ── PERSONAL ───────────────────────────────────────────────────────────────

  // First stat to reach 8.0 — mastery in any dimension
  const statEntries = Object.entries(state.stats) as [string, number][]
  const prevStatEntries = Object.entries(prevState.stats) as [string, number][]
  const STAT_LABELS: Record<string, string> = {
    logica: 'lógica', creatividad: 'creatividad', disciplina: 'disciplina',
    carisma: 'carisma', emocional: 'inteligencia emocional', ambicion: 'ambición',
    fisico: 'condición física', riesgo: 'tolerancia al riesgo', estabilidad: 'estabilidad',
  }
  const firstMastery = statEntries.find(([k, v]) => {
    const prev = prevStatEntries.find(([pk]) => pk === k)?.[1] ?? 0
    return v >= 8.0 && prev < 8.0
  })
  if (!has('PRIMERA_MAESTRIA') && firstMastery) {
    const label = STAT_LABELS[firstMastery[0]] ?? firstMastery[0]
    newAchievements.push({
      id: 'PRIMERA_MAESTRIA', age, year, category: 'personal',
      title:       `Maestría en ${label}`,
      description: `Una capacidad que ahora define quién eres. La construiste despacio, sin que nadie lo viera.`,
    })
  }

  // Early self-knowledge — accepted who they are at 15
  if (!has('AUTOCONOCIMIENTO') && hasFlag(state, 'autoconocimiento_temprano'))
    newAchievements.push({
      id: 'AUTOCONOCIMIENTO', age, year, category: 'personal',
      title:       'El espejo honesto',
      description: 'Conocerse antes de los 20 es un privilegio que pocos se toman.',
    })

  // ── PROFESIONAL ────────────────────────────────────────────────────────────

  // Career consolidation — reached senior level (nivel >= 2)
  if (!has('CARRERA_CONSOLIDADA')
      && state.career !== null
      && state.career.nivel >= 2
      && (prevState.career === null || prevState.career.nivel < 2))
    newAchievements.push({
      id: 'CARRERA_CONSOLIDADA', age, year, category: 'profesional',
      title:       'El escalón real',
      description: 'Ya no eres el nuevo. Ahora hay decisiones que solo tú puedes tomar.',
    })

  // ── VITAL ──────────────────────────────────────────────────────────────────

  // Emancipation — living independently for the first time
  if (!has('EMANCIPADO')
      && hasFlag(state, 'emancipado')
      && !hasFlag(prevState, 'emancipado'))
    newAchievements.push({
      id: 'EMANCIPADO', age, year, category: 'vital',
      title:       'La puerta propia',
      description: 'Tu nombre en el contrato. Tus reglas en el espacio. Tu silencio cuando quieres.',
    })

  // Driving license — mobility unlocked
  if (!has('CARNET_CONDUCIR')
      && hasFlag(state, 'carnet_conducir')
      && !hasFlag(prevState, 'carnet_conducir'))
    newAchievements.push({
      id: 'CARNET_CONDUCIR', age, year, category: 'vital',
      title:       'La ciudad más pequeña',
      description: 'Con el carnet, los límites geográficos de tu vida cambiaron para siempre.',
    })

  // Dedup: remove anything already present in prevState (belt-and-suspenders guard)
  return newAchievements.filter(a => !prevState.achievements.some(p => p.id === a.id))
}
