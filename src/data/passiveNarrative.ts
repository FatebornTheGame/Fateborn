import type { GameState } from '../types/game.types'

export interface PassiveNarrativeDef {
  id:            string
  minAge:        number
  maxAge:        number
  text:          (state: GameState) => string
  excludeFlags?: string[]
  requireFlags?: string[]  // all must be present for this entry to be eligible
}

// ─── Infancia (6–12) ─────────────────────────────────────────────────────────
const INFANCIA: PassiveNarrativeDef[] = [
  {
    id:    'inf_dias_textura',
    minAge: 6, maxAge: 12,
    text: s => `${s.character.name} aprende que los días tienen texturas distintas. Algunos saben a recreo, otros a espera.`,
  },
  {
    id:    'inf_tiempo_agua',
    minAge: 6, maxAge: 12,
    text: s => `Hay semanas en las que el tiempo pasa como agua. ${s.character.name} no lo nota hasta que ya fue.`,
  },
  {
    id:    'inf_mundo_grande',
    minAge: 6, maxAge: 12,
    text: s => `El mundo sigue siendo más grande que ${s.character.name}. Eso, de momento, es una ventaja.`,
  },
  {
    id:    'inf_recuerdo_nitido',
    minAge: 6, maxAge: 12,
    text: s => `${s.character.name} todavía no sabe que estos años serán los que recuerde con más nitidez.`,
  },
  {
    id:    'inf_estaciones',
    minAge: 6, maxAge: 12,
    text: s => `Las estaciones cambian. ${s.character.name} sigue creciendo sin darse cuenta.`,
  },
  {
    id:    'inf_barrio_reglas',
    minAge: 6, maxAge: 12,
    text: s => `El barrio tiene sus propias reglas. ${s.character.name} las aprende despacio, con los pies.`,
  },
  {
    id:    'inf_preguntas_tarde',
    minAge: 8, maxAge: 12,
    text: s => `Algunas preguntas llegan demasiado pronto. ${s.character.name} las guarda sin saberlo.`,
  },
]

// ─── Adolescencia (13–18) ─────────────────────────────────────────────────────
const ADOLESCENCIA: PassiveNarrativeDef[] = [
  {
    id:    'adol_no_dicho',
    minAge: 13, maxAge: 18,
    text: s => `Hay algo que ${s.character.name} no ha dicho todavía. Quizás no encuentre las palabras. Quizás no haga falta.`,
  },
  {
    id:    'adol_cuerpo_identidad',
    minAge: 13, maxAge: 18,
    text: s => `El cuerpo cambia más rápido que la identidad. ${s.character.name} va detrás.`,
  },
  {
    id:    'adol_decisiones_pequenas',
    minAge: 13, maxAge: 18,
    text: s => `Pasan los trimestres. ${s.character.name} toma decisiones pequeñas que no parecen decisiones.`,
  },
  {
    id:    'adol_horizonte_borroso',
    minAge: 13, maxAge: 18,
    text: s => `El futuro empieza a tomar forma borrosa en el horizonte. ${s.character.name} prefiere no mirarlo fijo.`,
  },
  {
    id:    'adol_noches_largas',
    minAge: 14, maxAge: 18,
    text: s => `Las noches duran más cuando hay demasiadas preguntas y demasiado silencio. ${s.character.name} lo sabe.`,
  },
  {
    id:    'adol_vidas_ajenas',
    minAge: 14, maxAge: 18,
    text: s => `${s.character.name} nota que hay vidas que le gustaría tener. Todavía no sabe cuál es la suya.`,
  },
  {
    id:    'adol_mapa_propio',
    minAge: 15, maxAge: 18,
    text: s => `Nadie te enseña el mapa de tu propia vida. ${s.character.name} lo dibuja a medida que avanza.`,
  },
]

// ─── Juventud (19–30) ─────────────────────────────────────────────────────────
const JUVENTUD: PassiveNarrativeDef[] = [
  {
    id:    'juv_libertad_precio',
    minAge: 19, maxAge: 30,
    text: s => `Ser libre tiene un precio que ${s.character.name} todavía está calculando.`,
  },
  {
    id:    'juv_meses_sin_huella',
    minAge: 19, maxAge: 30,
    text: s => `Hay meses que se van sin dejar huella. ${s.character.name} los deja pasar.`,
  },
  {
    id:    'juv_duerme_menos',
    minAge: 19, maxAge: 28,
    text: s => `${s.character.name} duerme menos. Piensa más. No está seguro de que sea un buen trato.`,
  },
  {
    id:    'juv_ciudad_capas',
    minAge: 19, maxAge: 30,
    text: s => `La ciudad tiene capas. ${s.character.name} va conociendo las que le pertenecen.`,
  },
  {
    id:    'juv_fingir_saber',
    minAge: 19, maxAge: 26,
    text: s => `Todo el mundo parece saber lo que hace. ${s.character.name} aprende a fingir que también.`,
  },
  {
    id:    'juv_vinculos_aflojan',
    minAge: 21, maxAge: 30,
    text: s => `Algunos vínculos de ${s.character.name} se aflojan sin que nadie los corte. Es la forma más silenciosa de perder.`,
  },
  {
    id:    'juv_construir_o_aguantar',
    minAge: 25, maxAge: 30,
    text: s => `${s.character.name} se pregunta si está construyendo algo o simplemente aguantando. Hoy no sabe la respuesta.`,
  },
  {
    id:    'juv_primer_nostalgia',
    minAge: 24, maxAge: 30,
    text: s => `Por primera vez, ${s.character.name} siente nostalgia de algo que no ha terminado todavía.`,
  },
  {
    id:    'juv_planes_cambian',
    minAge: 25, maxAge: 30,
    text: s => `Los planes de ${s.character.name} a diez años han cambiado tres veces. Eso también es información.`,
  },
]

// ─── Adultez (31–50) ─────────────────────────────────────────────────────────
const ADULTEZ: PassiveNarrativeDef[] = [
  {
    id:    'adu_semanas_parecidas',
    minAge: 31, maxAge: 50,
    text: s => `Las semanas de ${s.character.name} se parecen entre sí. Eso puede ser una victoria o una derrota, según el día.`,
  },
  {
    id:    'adu_sin_coste',
    minAge: 31, maxAge: 50,
    text: s => `${s.character.name} empieza a entender que no hay versión sin coste. Solo distintos precios.`,
  },
  {
    id:    'adu_cansancio_otro',
    minAge: 33, maxAge: 50,
    text: s => `Hay un cansancio que no es de falta de sueño. ${s.character.name} lo reconoce aunque no lo nombre.`,
  },
  {
    id:    'adu_anos_peso',
    minAge: 35, maxAge: 50,
    text: s => `Los años empiezan a tener peso específico. ${s.character.name} nota el de los últimos.`,
  },
  {
    id:    'adu_urgencias_falsas',
    minAge: 35, maxAge: 50,
    text: s => `Hay cosas que a ${s.character.name} le parecían urgentes y ya no lo son. Otras siguen ahí, quietas, esperando.`,
  },
  {
    id:    'adu_rutina_escudo',
    minAge: 31, maxAge: 45,
    text: s => `La rutina de ${s.character.name} es también un escudo. No siempre sabe contra qué.`,
  },
  {
    id:    'adu_mediana_edad',
    minAge: 40, maxAge: 50,
    text: s => `${s.character.name} cruza un umbral invisible. No hay señal, no hay aviso. Solo el siguiente día.`,
  },
  {
    id:    'adu_lo_no_elegido',
    minAge: 38, maxAge: 50,
    text: s => `También pesan las cosas que no se eligieron. ${s.character.name} las lleva igual.`,
  },
]

// ─── Adultez con mentalidad_ambiciosa ────────────────────────────────────────
const ADULTEZ_AMBICION: PassiveNarrativeDef[] = [
  {
    id:           'adu_amb_precio_exito',
    minAge:       31, maxAge: 55,
    requireFlags: ['mentalidad_ambiciosa'],
    text: s => `${s.character.name} consigue lo que se propone. El precio viene siempre después, cuando ya no se puede devolver.`,
  },
  {
    id:           'adu_amb_escalon',
    minAge:       31, maxAge: 50,
    requireFlags: ['mentalidad_ambiciosa'],
    text: s => `Cada éxito de ${s.character.name} es un escalón que lo aleja un poco más de donde empezó.`,
  },
  {
    id:           'adu_amb_no_es_suficiente',
    minAge:       33, maxAge: 55,
    requireFlags: ['mentalidad_ambiciosa'],
    text: s => `Lo que ayer parecía suficiente hoy ya no lo es. ${s.character.name} conoce ese ciclo. Sigue igual.`,
  },
  {
    id:           'adu_amb_soledad_cima',
    minAge:       38, maxAge: 55,
    requireFlags: ['mentalidad_ambiciosa'],
    text: s => `Hay una soledad específica en la cima. ${s.character.name} la reconoce sin nombrarla.`,
  },
  {
    id:           'adu_amb_cuerpo_deuda',
    minAge:       40, maxAge: 55,
    requireFlags: ['mentalidad_ambiciosa'],
    text: s => `El cuerpo de ${s.character.name} lleva la cuenta de todo lo que la ambición tomó prestado.`,
  },
]

// ─── Madurez (51–70) ─────────────────────────────────────────────────────────
const MADUREZ: PassiveNarrativeDef[] = [
  {
    id:    'mad_tiempo_menos',
    minAge: 51, maxAge: 70,
    text: s => `El tiempo no va más rápido. Es que ${s.character.name} tiene menos de él, y eso cambia el ritmo.`,
  },
  {
    id:    'mad_ausencias',
    minAge: 51, maxAge: 70,
    text: s => `Hay personas que ya no están. Su ausencia ocupa espacio en los días de ${s.character.name}.`,
  },
  {
    id:    'mad_sin_demostrar',
    minAge: 53, maxAge: 70,
    text: s => `${s.character.name} ya no necesita demostrar nada. Le ha costado años entenderlo.`,
  },
  {
    id:    'mad_cuerpo_cuenta',
    minAge: 55, maxAge: 70,
    text: s => `El cuerpo lleva la cuenta de todo. ${s.character.name} empieza a escucharla.`,
  },
  {
    id:    'mad_sabiduria_tarde',
    minAge: 58, maxAge: 70,
    text: s => `Hay sabidurías que solo llegan tarde. ${s.character.name} las recibe sin prisa.`,
  },
  {
    id:    'mad_legado_silencioso',
    minAge: 60, maxAge: 70,
    text: s => `El legado no siempre hace ruido. A veces es solo la forma en que ${s.character.name} trata a los demás.`,
  },
  {
    id:    'mad_persona_mayor',
    minAge: 51, maxAge: 70,
    text: s => `${s.character.name} empieza a ser la persona mayor en algunas conversaciones. Le sorprende cada vez.`,
  },
  {
    id:    'mad_decisiones_veinte',
    minAge: 51, maxAge: 70,
    text: s => `Hay decisiones que ${s.character.name} tomó hace veinte años que siguen dando forma a hoy.`,
  },
  {
    id:    'mad_sin_prisa',
    minAge: 51, maxAge: 70,
    text: s => `${s.character.name} ya no tiene prisa por demostrar nada. Tardó demasiado en llegar a eso.`,
  },
  {
    id:    'mad_historia_compartida',
    minAge: 51, maxAge: 70,
    text: s => `Algunas amistades de ${s.character.name} se han convertido en historia compartida. Eso no tiene precio.`,
  },
  {
    id:    'mad_cuerpo_presenta',
    minAge: 51, maxAge: 70,
    text: s => `El cuerpo de ${s.character.name} lleva la cuenta de todo. Algunos días la presenta sin avisar.`,
  },
  {
    id:    'mad_mira_jovenes',
    minAge: 51, maxAge: 70,
    text: s => `${s.character.name} mira a los jóvenes y reconoce cosas. No dice nada. No haría falta.`,
  },
  {
    id:    'mad_serenidad_trabajo',
    minAge: 51, maxAge: 70,
    text: s => `Hay una serenidad en ${s.character.name} que no existía antes. No fue un regalo. Fue un trabajo.`,
  },
  {
    id:    'mad_lo_que_importa',
    minAge: 51, maxAge: 70,
    text: s => `${s.character.name} tiene claro lo que importa. Le costó décadas. Valió la pena.`,
  },
]

// ─── Vejez (71+) ──────────────────────────────────────────────────────────────
const VEJEZ: PassiveNarrativeDef[] = [
  {
    id:    'vej_dias_cortos',
    minAge: 71, maxAge: 99,
    text: s => `Los días son más cortos. ${s.character.name} los aprovecha de otra manera.`,
  },
  {
    id:    'vej_serenidad',
    minAge: 71, maxAge: 99,
    text: s => `Hay una serenidad que no es resignación. ${s.character.name} tardó mucho en distinguirlas.`,
  },
  {
    id:    'vej_mundo_gira',
    minAge: 71, maxAge: 99,
    text: s => `El mundo sigue girando sin pedir permiso. ${s.character.name} lo observa con menos urgencia.`,
  },
  {
    id:    'vej_memorias_solas',
    minAge: 73, maxAge: 99,
    text: s => `Algunas memorias vienen solas, sin avisar. ${s.character.name} las deja estar.`,
  },
  {
    id:    'vej_lo_que_fue',
    minAge: 75, maxAge: 99,
    text: s => `Lo que queda ya no es solo lo que uno tiene, sino lo que fue. ${s.character.name} lo cuenta en silencio.`,
  },
  {
    id:    'vej_menos_palabras',
    minAge: 71, maxAge: 99,
    text: s => `Con los años, ${s.character.name} habla menos y entiende más. No es un intercambio malo.`,
  },
]

// ─── Índice completo ──────────────────────────────────────────────────────────
export const PASSIVE_NARRATIVES: PassiveNarrativeDef[] = [
  ...INFANCIA,
  ...ADOLESCENCIA,
  ...JUVENTUD,
  ...ADULTEZ,
  ...ADULTEZ_AMBICION,
  ...MADUREZ,
  ...VEJEZ,
]

function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getStageKey(age: number): string {
  if (age <= 12) return 'infancia'
  if (age <= 18) return 'adolescencia'
  if (age <= 30) return 'juventud'
  if (age <= 50) return 'adultez'
  if (age <= 70) return 'madurez'
  return 'vejez'
}

// Tracks used pool indices per stage bucket across the session — prevents repeats until pool exhausted
const usedByStage = new Map<string, Set<number>>()

/**
 * Devuelve un texto pasivo elegible para la edad actual.
 * Evita repetir entradas hasta agotar el pool; luego reinicia.
 * El nombre del personaje aparece siempre con primera letra en mayúscula.
 */
export function getPassiveNarrative(state: GameState): string | null {
  const age = state.ageYears

  const stateWithCapName: GameState = {
    ...state,
    character: { ...state.character, name: capitalize(state.character.name) },
  }

  const isEligible = (p: PassiveNarrativeDef): boolean => {
    if (age < p.minAge || age > p.maxAge) return false
    if (p.excludeFlags?.some(f => state.flags.includes(f))) return false
    if (p.requireFlags?.some(f => !state.flags.includes(f))) return false
    return true
  }

  const pool = PASSIVE_NARRATIVES.filter(isEligible)
  if (pool.length === 0) return null

  const key = getStageKey(age)
  if (!usedByStage.has(key)) usedByStage.set(key, new Set())
  const used = usedByStage.get(key)!
  const available = pool.map((_, i) => i).filter(i => !used.has(i))
  const indices = available.length > 0 ? available : pool.map((_, i) => i)
  if (available.length === 0) usedByStage.set(key, new Set())
  const chosen = indices[Math.floor(Math.random() * indices.length)]
  usedByStage.get(key)!.add(chosen)
  return pool[chosen].text(stateWithCapName)
}
