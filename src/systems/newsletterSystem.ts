import type { GameState } from '../types/game.types'
import { hasFlag } from '../types/game.types'
import { getEconomyLevel } from './economySystem'

export interface NewsHeadline {
  text:       string
  size:       'main' | 'secondary' | 'brief'
}

export interface Newspaper {
  year:      number
  age:       number
  masthead:  string
  headlines: NewsHeadline[]
}

// ─── Mastheads ────────────────────────────────────────────────────────────────
const MASTHEADS: Record<string, string> = {
  'España':     'El Correo Nacional',
  'Portugal':   'Diário da República',
  'Francia':    'Le Journal du Soir',
  'Alemania':   'Die Tageszeitung',
  'Italia':     'Il Giornale',
  'México':     'El Diario del Norte',
  'Brasil':     'O Correio do Povo',
  'Argentina':  'La Crónica',
  'Colombia':   'El Espectador',
  'Nigeria':    'The Daily Chronicle',
  'Sudáfrica':  'The Morning Post',
  'India':      'The National Observer',
  'Japón':      '朝刊タイムズ',
  'China':      '人民日报国际版',
  'Australia':  'The Daily Herald',
  'Canadá':     'The National Gazette',
  'USA':        'The Daily Tribune',
}

function getMasthead(country: string): string {
  return MASTHEADS[country] ?? 'La Gaceta'
}

// ─── Headline pools ───────────────────────────────────────────────────────────

// Headlines based on life stage and age
function stageHeadline(state: GameState): string {
  const age = state.ageYears

  if (age < 16) {
    const pool = [
      'Los jóvenes de hoy enfrentan un futuro incierto pero lleno de posibilidades',
      'Educación: más exigente que nunca para la generación que viene',
      'El mercado laboral del mañana requiere habilidades que aún no se enseñan',
      'Informe: La infancia en el siglo XXI es más corta que nunca',
      'Estudio: los adolescentes duermen menos y rinden más de lo que se cree',
    ]
    return pool[state.totalQuarters % pool.length]
  }
  if (age < 25) {
    const pool = [
      'La generación que llega al mercado laboral: preparada, pero sin oportunidades',
      'El precio de la vivienda cierra la puerta a los menores de 30',
      'Nuevo informe: el acceso a la universidad no garantiza el empleo',
      'Jóvenes y economía: el 40% vive con sus padres más allá de los 25',
      'La brecha salarial entre generaciones, en máximos históricos',
      'El cambio climático ya es la primera preocupación de los menores de 30',
    ]
    return pool[state.totalQuarters % pool.length]
  }
  if (age < 40) {
    const pool = [
      'La clase media: entre la estabilidad y la precariedad laboral',
      'El mercado inmobiliario alcanza nuevos récords de dificultad de acceso',
      'Informe: el burnout laboral afecta ya al 35% de los trabajadores activos',
      'Los treintañeros de hoy son la generación con más titulaciones y menos certezas',
      'La conciliación laboral-familiar: asignatura pendiente en una década',
      'Economía: la inflación erosiona el poder adquisitivo por quinto año consecutivo',
    ]
    return pool[state.totalQuarters % pool.length]
  }
  if (age < 55) {
    const pool = [
      'Los cuarentones llevan el peso del sistema: cotizaciones, cuidados y deuda',
      'La brecha de género en pensiones persiste en todo el mundo desarrollado',
      'Informe: la productividad laboral baja a partir de los 50, pero no la calidad',
      'El sistema de pensiones bajo presión: las reformas que vienen',
      'Mediana edad y salud mental: el tabú que empieza a romperse',
      'Los cuidadores invisibles: quienes cuidan a mayores y trabajan al mismo tiempo',
    ]
    return pool[state.totalQuarters % pool.length]
  }
  if (age < 70) {
    const pool = [
      'La jubilación anticipada crece entre los mayores de 55: ¿crisis o elección?',
      'El envejecimiento activo: el modelo que Europa quiere exportar al mundo',
      'Los mayores de 60 son el grupo con mayor crecimiento de emprendimiento',
      'Pensiones: la reforma que lleva décadas pendiente y nadie quiere tocar',
      'Longevidad y trabajo: el debate sobre la edad de jubilación vuelve al Parlamento',
      'La soledad en la madurez: el problema que ningún gobierno quiere reconocer',
    ]
    return pool[state.totalQuarters % pool.length]
  }
  const pool = [
    'Centenarios en aumento: el fenómeno demográfico del siglo XXI',
    'Longevidad: vivir más años no siempre significa vivirlos mejor',
    'Los mayores de 75: el grupo de edad más rápido en adoptar tecnología',
    'El sistema de cuidados en quiebra: quién cuida a los que llegan al final',
    'Legado y herencia: el debate que las familias evitan hasta que no pueden',
  ]
  return pool[state.totalQuarters % pool.length]
}

// Personal headline: derived from the character's current state
function personalHeadline(state: GameState): string {
  const nivel = getEconomyLevel(state)

  // Career-related
  if (state.career !== null) {
    const { nivel: careerNivel, profesion } = state.career
    if (careerNivel >= 3) {
      const pool = [
        `El sector de ${profesion.toLowerCase()} registra mayor demanda de perfiles senior`,
        `Mercado laboral: los profesionales consolidados siguen siendo los más buscados`,
        `La experiencia vuelve a cotizar al alza en el mercado de trabajo`,
      ]
      return pool[state.ageYears % pool.length]
    }
    if (hasFlag(state, 'empresa_propia_adulto') || hasFlag(state, 'autonomo_desde_joven')) {
      const pool = [
        'El emprendimiento autónomo: más resiliente de lo que anticipaban los expertos',
        'Los autónomos siguen siendo la columna vertebral de la economía local',
        'Pequeñas empresas: el motor silencioso de la generación de empleo',
      ]
      return pool[state.ageYears % pool.length]
    }
  }

  // Economy-related
  if (nivel === 'rico' || nivel === 'alto') {
    return 'El patrimonio familiar: qué hacen bien los que construyen riqueza duradera'
  }
  if (nivel === 'precario') {
    return 'La economía informal crece a medida que el mercado regular falla'
  }

  // Relationship-related
  if (hasFlag(state, 'construyendo_con_pareja')) {
    const pool = [
      'El hogar compartido: la fórmula que aguanta mejor las crisis económicas',
      'Estudio: las parejas estables muestran mayor bienestar a largo plazo',
    ]
    return pool[state.ageYears % pool.length]
  }

  if (hasFlag(state, 'independencia_elegida_adulto')) {
    return 'Vivir solo: el modelo de vida que crece y que la sociedad aún no entiende del todo'
  }

  // Stat-based
  if (state.stats.creatividad > 7) {
    return 'La economía creativa: el sector que no para de crecer en tiempos inciertos'
  }
  if (state.stats.logica > 7) {
    return 'Los perfiles analíticos lideran el mercado laboral de la próxima década'
  }
  if (state.stats.ambicion > 7) {
    return 'Informe: quienes más trabajan no siempre son los que más logran — pero casi'
  }

  // Generic fallback
  const fallbacks = [
    'El bienestar personal: el indicador que los economistas no saben medir',
    'Tiempo libre y productividad: la paradoja de la sociedad moderna',
    'Estudio: las decisiones tomadas en la veintena definen más de lo que se cree',
    'La salud mental en los titulares: un paso adelante, dos pendientes',
    'La desigualdad social: persistente, documentada, y sin solución a la vista',
  ]
  return fallbacks[state.totalQuarters % fallbacks.length]
}

// Brief local note
function briefNote(state: GameState): string {
  const age  = state.ageYears
  const year = state.character.birthYear + age

  if (age < 20) {
    return `Año ${year} — Una generación que llegó al mundo con todo por escribir.`
  }
  if (age < 35) {
    return `Año ${year} — Los primeros años adultos. Los más difíciles y los más decisivos.`
  }
  if (age < 50) {
    return `Año ${year} — La etapa en que las decisiones ya tienen nombre propio.`
  }
  if (age < 65) {
    return `Año ${year} — Lo que se sembró empieza a tener forma reconocible.`
  }
  if (age < 80) {
    return `Año ${year} — El tiempo que queda ya no se puede ignorar.`
  }
  return `Año ${year} — Lo esencial permanece. Lo demás ya pasó.`
}

// ─── Main generator ───────────────────────────────────────────────────────────
export function generateNewspaper(state: GameState): Newspaper {
  const year = state.character.birthYear + state.ageYears

  return {
    year,
    age:      state.ageYears,
    masthead: getMasthead(state.character.country),
    headlines: [
      { text: stageHeadline(state),    size: 'main' },
      { text: personalHeadline(state), size: 'secondary' },
      { text: briefNote(state),        size: 'brief' },
    ],
  }
}
