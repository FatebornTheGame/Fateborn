import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Economy, Career, GameFlags, Character } from '../types/game.types'

interface InitiativePanelProps {
  onRequestQuarter?: () => void
}

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const MUTED  = '#555'
const BG2    = '#0f0d0a'

// ─── Tipos internos ───────────────────────────────────────────────────────────
interface Ctx {
  char: Character
  age: number
  eco: Economy
  career: Career | null
  flags: GameFlags
  totalWeeks: number
}

interface ReqResult { ok: boolean; reason?: string }

interface InitDef {
  id: string
  title: string
  desc: string
  weekCost: number
  moneyCost: number
  req: (ctx: Ctx) => ReqResult
  urgent?: (ctx: Ctx) => boolean
  subMenuId?: string   // si tiene sub-menú
}

interface CategoryDef {
  id: string
  label: string
  icon: string
  items: InitDef[]
}

// ─── Trabajos disponibles ─────────────────────────────────────────────────────
const JOBS = [
  { id: 'obrero',       name: 'Obrero',          salary: 1200, reqStat: 'fisico'      as const, reqVal: 4 },
  { id: 'vendedor',     name: 'Vendedor',         salary: 1500, reqStat: 'carisma'     as const, reqVal: 4 },
  { id: 'artista',      name: 'Artista',          salary: 900,  reqStat: 'creatividad' as const, reqVal: 6 },
  { id: 'profesor',     name: 'Profesor',         salary: 1700, reqStat: 'logica'      as const, reqVal: 5 },
  { id: 'deportista',   name: 'Deportista',       salary: 2000, reqStat: 'fisico'      as const, reqVal: 7 },
  { id: 'empresario_jr',name: 'Empresario Junior',salary: 2200, reqStat: 'ambicion'    as const, reqVal: 6 },
  { id: 'abogado_jr',   name: 'Abogado Junior',   salary: 2500, reqStat: 'logica'      as const, reqVal: 7 },
  { id: 'medico_jr',    name: 'Médico Junior',    salary: 3000, reqStat: 'logica'      as const, reqVal: 8 },
]

// ─── Definición de categorías e iniciativas ───────────────────────────────────
const CATEGORIES: CategoryDef[] = [
  {
    id: 'vida_personal', label: 'VIDA PERSONAL', icon: '♡',
    items: [
      {
        id: 'emanciparse', title: 'Emanciparse', weekCost: 0, moneyCost: 0,
        desc: 'Independizarte de la familia y vivir por tu cuenta.',
        req: (c) => {
          if (c.age < 18)         return { ok: false, reason: 'Requiere 18 años' }
          if (c.flags.emancipado) return { ok: false, reason: 'Ya vives de forma independiente' }
          return { ok: true }
        },
      },
      {
        id: 'buscar_pareja', title: 'Buscar pareja', weekCost: 2, moneyCost: 0,
        desc: 'Dedicar tiempo a conocer personas y buscar una relación.',
        req: (c) => {
          if (c.age < 18)           return { ok: false, reason: 'Requiere 18 años' }
          if (c.flags.tienePareja)  return { ok: false, reason: 'Ya tienes pareja' }
          return { ok: true }
        },
      },
      {
        id: 'tener_hijo', title: 'Tener un hijo', weekCost: 0, moneyCost: 0,
        desc: 'Iniciar el proceso de ser padre/madre. Evento diferido.',
        req: (c) => {
          if (!c.flags.parejaEstable)   return { ok: false, reason: 'Requiere pareja estable' }
          if (c.eco.liquidez < 500)     return { ok: false, reason: 'Requiere al menos €500 de liquidez' }
          return { ok: true }
        },
        urgent: (c) => c.flags.parejaEstable && c.age >= 30 && c.flags.tieneHijos === 0,
      },
      {
        id: 'adoptar_mascota', title: 'Adoptar mascota', weekCost: 1, moneyCost: 200,
        desc: 'Un compañero fiel que mejora tu estado emocional.',
        req: (c) => {
          if (!c.flags.emancipado)   return { ok: false, reason: 'Requiere emancipación previa' }
          if (c.flags.tieneMascota)  return { ok: false, reason: 'Ya tienes mascota' }
          if (c.eco.liquidez < 200)  return { ok: false, reason: 'Requiere €200 de liquidez' }
          return { ok: true }
        },
      },
    ],
  },
  {
    id: 'carrera', label: 'CARRERA', icon: '💼',
    items: [
      {
        id: 'buscar_trabajo', title: 'Buscar trabajo', weekCost: 2, moneyCost: 0,
        desc: 'Explorar el mercado laboral según tus capacidades.',
        subMenuId: 'jobs',
        req: (c) => {
          if (c.age < 16) return { ok: false, reason: 'Requiere 16 años' }
          if (c.career)   return { ok: false, reason: 'Ya tienes empleo activo' }
          return { ok: true }
        },
      },
      {
        id: 'pedir_ascenso', title: 'Pedir ascenso', weekCost: 1, moneyCost: 0,
        desc: 'Negociar una mejora de nivel con tu empleador.',
        req: (c) => {
          if (!c.career) return { ok: false, reason: 'Requiere empleo activo' }
          if ((c.career?.experiencia ?? 0) < 2) return { ok: false, reason: 'Requiere 2+ años de experiencia' }
          if ((c.career?.nivel ?? 0) >= 10)     return { ok: false, reason: 'Ya estás en el nivel máximo' }
          return { ok: true }
        },
      },
      {
        id: 'cambiar_profesion', title: 'Cambiar de profesión', weekCost: 4, moneyCost: 0,
        desc: 'Reiniciar tu carrera en otro campo.',
        subMenuId: 'jobs_change',
        req: (c) => {
          if (!c.career) return { ok: false, reason: 'Requiere empleo activo para cambiar' }
          return { ok: true }
        },
      },
      {
        id: 'montar_negocio', title: 'Montar un negocio', weekCost: 8, moneyCost: 5000,
        desc: 'Emprender tu propio camino empresarial.',
        req: (c) => {
          if (c.eco.liquidez < 5000)  return { ok: false, reason: 'Requiere €5.000 de liquidez' }
          if (c.age < 18)             return { ok: false, reason: 'Requiere ser mayor de edad' }
          return { ok: true }
        },
      },
    ],
  },
  {
    id: 'finanzas', label: 'FINANZAS', icon: '◈',
    items: [
      {
        id: 'abrir_inversion', title: 'Abrir inversión', weekCost: 1, moneyCost: 500,
        desc: 'Invertir tu capital en ETF, acciones, oro o crypto.',
        subMenuId: 'inversiones',
        req: (c) => {
          if (c.eco.liquidez < 500) return { ok: false, reason: 'Requiere €500 de liquidez' }
          return { ok: true }
        },
      },
      {
        id: 'comprar_inmueble', title: 'Comprar inmueble', weekCost: 4, moneyCost: 0,
        desc: 'Adquirir una propiedad para vivir o como inversión.',
        req: (c) => {
          if (c.eco.liquidez < 20000) return { ok: false, reason: 'Requiere €20.000 de liquidez mínima' }
          if (!c.flags.emancipado)    return { ok: false, reason: 'Requiere emancipación previa' }
          return { ok: true }
        },
      },
      {
        id: 'ir_casino', title: 'Ir al casino', weekCost: 1, moneyCost: 200,
        desc: '⚠ Riesgo alto. Puedes ganar o perderlo todo.',
        req: (c) => {
          if (c.eco.liquidez < 200) return { ok: false, reason: 'Requiere €200 de liquidez' }
          return { ok: true }
        },
        urgent: (c) => c.eco.liquidez < 500 && c.eco.ingresosMensuales === 0,
      },
      {
        id: 'ver_proyeccion', title: 'Ver proyección patrimonial', weekCost: 0, moneyCost: 0,
        desc: 'Analiza la evolución estimada de tu patrimonio.',
        req: () => ({ ok: true }),
      },
    ],
  },
  {
    id: 'educacion', label: 'EDUCACIÓN', icon: '📚',
    items: [
      {
        id: 'universidad', title: 'Ir a la universidad', weekCost: 52, moneyCost: 3000,
        desc: 'Titulación universitaria que abre puertas laborales.',
        req: (c) => {
          if (c.age < 17)   return { ok: false, reason: 'Requiere 17 años' }
          if (c.age > 30)   return { ok: false, reason: 'Ventana de oportunidad: 17-30 años' }
          if (c.eco.liquidez < 3000) return { ok: false, reason: 'Requiere €3.000 de liquidez' }
          return { ok: true }
        },
        urgent: (c) => c.age >= 17 && c.age <= 19 && !c.career,
      },
      {
        id: 'aprender_idioma', title: 'Aprender un idioma', weekCost: 13, moneyCost: 300,
        desc: 'Amplía tus horizontes culturales y profesionales.',
        req: (c) => {
          if (c.eco.liquidez < 300) return { ok: false, reason: 'Requiere €300' }
          return { ok: true }
        },
      },
      {
        id: 'curso_especializacion', title: 'Curso de especialización', weekCost: 8, moneyCost: 800,
        desc: 'Mejora tus habilidades en tu campo profesional.',
        req: (c) => {
          if (c.eco.liquidez < 800) return { ok: false, reason: 'Requiere €800' }
          return { ok: true }
        },
      },
    ],
  },
  {
    id: 'salud', label: 'SALUD', icon: '✚',
    items: [
      {
        id: 'chequeo_medico', title: 'Chequeo médico', weekCost: 1, moneyCost: 150,
        desc: 'Revisión general de salud. Reduce la carga vital.',
        req: (c) => {
          if (c.eco.liquidez < 150) return { ok: false, reason: 'Requiere €150' }
          return { ok: true }
        },
      },
      {
        id: 'gimnasio', title: 'Apuntarse al gimnasio', weekCost: 1, moneyCost: 50,
        desc: 'Mejora física continua. Coste mensual recurrente.',
        req: (c) => {
          if (c.eco.liquidez < 50) return { ok: false, reason: 'Requiere €50/mes' }
          return { ok: true }
        },
      },
      {
        id: 'terapeuta', title: 'Ir al terapeuta', weekCost: 1, moneyCost: 80,
        desc: 'Bienestar mental. Reduce estrés y carga vital.',
        req: (c) => {
          if (c.eco.liquidez < 80) return { ok: false, reason: 'Requiere €80' }
          return { ok: true }
        },
      },
      {
        id: 'dejar_vicio', title: 'Dejar un vicio', weekCost: 4, moneyCost: 0,
        desc: 'Superar una adicción activa. Proceso largo y difícil.',
        req: (c) => {
          if (!c.flags.adiccion) return { ok: false, reason: 'No tienes adicciones activas' }
          return { ok: true }
        },
        urgent: (c) => !!c.flags.adiccion,
      },
    ],
  },
  {
    id: 'social', label: 'SOCIAL', icon: '◉',
    items: [
      {
        id: 'llamar_amigo', title: 'Llamar a un amigo', weekCost: 1, moneyCost: 0,
        desc: 'Fortalecer vínculos sociales existentes.',
        req: (c) => {
          if (!c.flags.tieneAmigos) return { ok: false, reason: 'Necesitas construir amistades primero' }
          return { ok: true }
        },
      },
      {
        id: 'buscar_mentor', title: 'Buscar un mentor', weekCost: 2, moneyCost: 0,
        desc: 'Alguien con experiencia que guíe tu camino.',
        req: (c) => {
          if (c.flags.reputacion < 40) return { ok: false, reason: 'Requiere reputación 40+' }
          return { ok: true }
        },
      },
      {
        id: 'organizar_evento', title: 'Organizar un evento', weekCost: 2, moneyCost: 200,
        desc: 'Fortalecer tu red social y ganar reputación.',
        req: (c) => {
          if (c.eco.liquidez < 200)    return { ok: false, reason: 'Requiere €200' }
          if (!c.flags.emancipado)     return { ok: false, reason: 'Requiere tener hogar propio' }
          return { ok: true }
        },
      },
    ],
  },
]

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InitiativePanel({ onRequestQuarter }: InitiativePanelProps) {
  const character   = useGameStore(s => s.character)
  const ageYears    = useGameStore(s => s.ageYears)
  const economy     = useGameStore(s => s.economy)
  const career      = useGameStore(s => s.career)
  const gameFlags   = useGameStore(s => s.gameFlags)
  const totalWeeks  = useGameStore(s => s.totalWeeks)

  const advanceWeeks    = useGameStore(s => s.advanceWeeks)
  const addFeedEntry    = useGameStore(s => s.addFeedEntry)
  const addTimelineEvent = useGameStore(s => s.addTimelineEvent)
  const updateEconomy   = useGameStore(s => s.updateEconomy)
  const updateGameFlag  = useGameStore(s => s.updateGameFlag)
  const setCareer       = useGameStore(s => s.setCareer)
  const addVitalLoad    = useGameStore(s => s.addVitalLoad)
  const addLegacy       = useGameStore(s => s.addLegacy)
  const currentYear     = useGameStore(s => s.currentYear)

  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['vida_personal', 'carrera']))
  const [subMenu,  setSubMenu]  = useState<string | null>(null)  // id de la iniciativa con sub-menú abierto

  if (!character) return null

  const ctx: Ctx = { char: character, age: ageYears, eco: economy, career, flags: gameFlags, totalWeeks }

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Ejecutores de iniciativas ────────────────────────────────────────────
  function execute(initId: string, extra?: { jobId?: string; inversion?: string }) {
    const week = totalWeeks % 52
    const year = currentYear

    switch (initId) {
      // VIDA PERSONAL
      case 'emanciparse':
        advanceWeeks(0)
        updateEconomy({ gastosMensuales: 350 })
        updateGameFlag('emancipado', true)
        updateGameFlag('tieneAmigos', true)
        addFeedEntry({ week, year, importance: 'alta', answered: true,
          text: `Te emancipas. Ahora vives de forma independiente en ${character?.country ?? ''}. Los gastos mensuales aumentan en €350.` })
        addTimelineEvent({ yearOffset: ageYears, label: 'Emancipación', type: 'hito' })
        addLegacy(3)
        break

      case 'buscar_pareja':
        advanceWeeks(2)
        updateGameFlag('tieneAmigos', true)
        if (Math.random() < 0.6) {
          updateGameFlag('tienePareja', true)
          addFeedEntry({ week, year, importance: 'alta', answered: true,
            text: `Tras varias semanas conociendo gente, encuentras a alguien especial. Comienzas una relación.` })
          addLegacy(5)
        } else {
          addFeedEntry({ week, year, importance: 'normal', answered: true,
            text: `Pasas dos semanas saliendo y conociendo gente, pero no encuentras a nadie con quien conectar de verdad. Por ahora.` })
        }
        break

      case 'tener_hijo':
        advanceWeeks(0)
        updateGameFlag('tieneHijos', gameFlags.tieneHijos + 1)
        updateEconomy({ gastosMensuales: 600 })
        addFeedEntry({ week, year, importance: 'critica', answered: true,
          text: `Nueve meses después, llega un nuevo ser al mundo. Tu vida cambia para siempre.` })
        addTimelineEvent({ yearOffset: ageYears, label: `Nace hijo ${gameFlags.tieneHijos + 1}`, type: 'logro' })
        addLegacy(10)
        break

      case 'adoptar_mascota':
        advanceWeeks(1)
        updateEconomy({ liquidez: -200, gastosMensuales: 80 })
        updateGameFlag('tieneMascota', true)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Adoptas una mascota. Su compañía alegra tus días y estabiliza tu estado emocional.` })
        addVitalLoad(-5)
        break

      // CARRERA
      case 'buscar_trabajo':
      case 'cambiar_profesion': {
        if (!extra?.jobId) { setSubMenu(initId); return }
        const job = JOBS.find(j => j.id === extra.jobId)
        if (!job) break
        advanceWeeks(2)
        const newCareer = { profesion: job.name, nivel: 1, experiencia: 0, salarioMensual: job.salary }
        setCareer(newCareer)
        updateEconomy({ ingresosMensuales: job.salary })
        addFeedEntry({ week, year, importance: 'alta', answered: true,
          text: `Comienzas como ${job.name}. Tu salario mensual es de €${job.salary.toLocaleString('es')}.` })
        addTimelineEvent({ yearOffset: ageYears, label: `Trabajo: ${job.name}`, type: 'logro' })
        addLegacy(4)
        setSubMenu(null)
        break
      }

      case 'pedir_ascenso':
        if (!career) break
        advanceWeeks(1)
        if (Math.random() < 0.55) {
          const newNivel = Math.min(10, career.nivel + 1)
          const salaryBoost = Math.round(career.salarioMensual * 0.15)
          setCareer({ ...career, nivel: newNivel, salarioMensual: career.salarioMensual + salaryBoost })
          updateEconomy({ ingresosMensuales: salaryBoost })
          addFeedEntry({ week, year, importance: 'alta', answered: true,
            text: `¡Ascenso aprobado! Subes al nivel ${newNivel}. Tu salario aumenta €${salaryBoost}/mes.` })
          addLegacy(3)
        } else {
          addFeedEntry({ week, year, importance: 'normal', answered: true,
            text: `Tu solicitud de ascenso es denegada esta vez. Tu jefe valora tu trabajo pero no es el momento.` })
        }
        break

      case 'montar_negocio':
        advanceWeeks(8)
        updateEconomy({ liquidez: -5000 })
        setCareer({ profesion: 'Empresario', nivel: 1, experiencia: 0, salarioMensual: 1500 })
        updateEconomy({ ingresosMensuales: 1500 })
        addFeedEntry({ week, year, importance: 'critica', answered: true,
          text: `Inviertes €5.000 y fundes tu propio negocio. Los primeros meses son caóticos, pero el proyecto empieza a andar.` })
        addTimelineEvent({ yearOffset: ageYears, label: 'Negocio propio', type: 'logro' })
        addLegacy(8)
        break

      // FINANZAS
      case 'abrir_inversion': {
        if (!extra?.inversion) { setSubMenu(initId); return }
        const rendimientos: Record<string, number> = { etf: 0.07, acciones: 0.12, oro: 0.05, crypto: 0.25 }
        const rend = rendimientos[extra.inversion] ?? 0.07
        updateEconomy({ liquidez: -500, patrimonioBruto: 500 })
        advanceWeeks(1)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Abres una posición en ${extra.inversion.toUpperCase()}. Rendimiento anual esperado: ${(rend*100).toFixed(0)}%.` })
        setSubMenu(null)
        break
      }

      case 'comprar_inmueble':
        advanceWeeks(4)
        updateEconomy({ liquidez: -20000, patrimonioBruto: 20000, gastosMensuales: -200 }) // se cancela alquiler
        addFeedEntry({ week, year, importance: 'alta', answered: true,
          text: `Firmas la escritura. Ahora eres propietario de un inmueble. Tu alquiler desaparece y construyes patrimonio.` })
        addTimelineEvent({ yearOffset: ageYears, label: 'Inmueble propio', type: 'logro' })
        addLegacy(6)
        break

      case 'ir_casino':
        advanceWeeks(1)
        updateEconomy({ liquidez: -200 })
        addVitalLoad(8)
        if (Math.random() < 0.4) {
          const ganancia = Math.round(200 + Math.random() * 800)
          updateEconomy({ liquidez: ganancia })
          addFeedEntry({ week, year, importance: 'alta', answered: true,
            text: `¡Suerte esta vez! Sales del casino con €${ganancia} de ganancia. Pero la casa siempre gana a largo plazo.` })
        } else {
          addFeedEntry({ week, year, importance: 'normal', answered: true,
            text: `La noche en el casino no fue favorable. Pierdes los €200 apostados. La ruleta no perdona.` })
        }
        break

      case 'ver_proyeccion':
        advanceWeeks(0)
        {
          const monthly = economy.ingresosMensuales - economy.gastosMensuales
          const annual  = monthly * 12
          addFeedEntry({ week, year, importance: 'normal', answered: true,
            text: `PROYECCIÓN PATRIMONIAL\n\nFlujo mensual: ${monthly >= 0 ? '+' : ''}€${monthly}/mes\nAnual estimado: €${annual.toLocaleString('es')}\nPatrimonio actual: €${economy.patrimonioBruto.toLocaleString('es')}` })
        }
        break

      // EDUCACIÓN
      case 'universidad':
        advanceWeeks(52)
        updateEconomy({ liquidez: -3000 })
        addFeedEntry({ week, year, importance: 'critica', answered: true,
          text: `Cuatro años de estudio, sacrificio y aprendizaje. Obtienes tu titulación universitaria. Las puertas del mundo profesional se abren.` })
        addTimelineEvent({ yearOffset: ageYears, label: 'Titulación universitaria', type: 'logro' })
        addLegacy(8)
        break

      case 'aprender_idioma':
        advanceWeeks(13)
        updateEconomy({ liquidez: -300 })
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Tras meses de estudio constante, alcanzas un nivel funcional en el nuevo idioma. Tu mente se expande.` })
        addVitalLoad(-3)
        break

      case 'curso_especializacion':
        advanceWeeks(8)
        updateEconomy({ liquidez: -800 })
        if (career) {
          setCareer({ ...career, nivel: Math.min(10, career.nivel + 1) })
        }
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Completar el curso de especialización refuerza tu perfil profesional.` })
        addLegacy(2)
        break

      // SALUD
      case 'chequeo_medico':
        advanceWeeks(1)
        updateEconomy({ liquidez: -150 })
        addVitalLoad(-10)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `El médico confirma que tu salud es razonable para tu edad. Algunos ajustes en el estilo de vida son recomendables.` })
        break

      case 'gimnasio':
        advanceWeeks(1)
        updateEconomy({ liquidez: -50, gastosMensuales: 50 })
        addVitalLoad(-6)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Te apuntas al gimnasio. El ejercicio regular comienza a notarse en tu estado físico y mental.` })
        break

      case 'terapeuta':
        advanceWeeks(1)
        updateEconomy({ liquidez: -80 })
        addVitalLoad(-12)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `La sesión con el terapeuta te ayuda a ordenar pensamientos y reducir el estrés acumulado.` })
        break

      case 'dejar_vicio':
        advanceWeeks(4)
        updateGameFlag('adiccion', null)
        addVitalLoad(-15)
        addFeedEntry({ week, year, importance: 'alta', answered: true,
          text: `Cuatro semanas de lucha interna. Finalmente, consigues superar la adicción. No ha sido fácil, pero lo has logrado.` })
        addLegacy(5)
        break

      // SOCIAL
      case 'llamar_amigo':
        advanceWeeks(1)
        addVitalLoad(-4)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `Una larga llamada telefónica con un amigo de confianza. A veces solo hace falta ser escuchado.` })
        break

      case 'buscar_mentor':
        advanceWeeks(2)
        updateGameFlag('reputacion', Math.min(100, gameFlags.reputacion + 10))
        addFeedEntry({ week, year, importance: 'alta', answered: true,
          text: `Encuentras a alguien con experiencia dispuesto a guiarte. Su perspectiva cambia tu forma de ver las cosas.` })
        addLegacy(4)
        break

      case 'organizar_evento':
        advanceWeeks(2)
        updateEconomy({ liquidez: -200 })
        updateGameFlag('reputacion', Math.min(100, gameFlags.reputacion + 8))
        updateGameFlag('tieneAmigos', true)
        addFeedEntry({ week, year, importance: 'normal', answered: true,
          text: `El evento resulta un éxito. Fortaleces lazos existentes y conoces caras nuevas. Tu red social crece.` })
        addLegacy(2)
        break
    }
  }

  // ── Sub-menús ────────────────────────────────────────────────────────────
  const availableJobs = JOBS.filter(j => ((character?.stats[j.reqStat]) ?? 0) >= j.reqVal)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG2 }}>
      <style>{`
        @keyframes urgentPulse {
          0%, 100% { box-shadow: -4px 0 10px ${GARNET}44; }
          50%       { box-shadow: -4px 0 18px ${GARNET}66; }
        }
        .init-btn {
          width: 100%;
          background: #1e1a12;
          border: none;
          border-left: 3px solid ${GOLD}88;
          border-radius: 0 4px 4px 0;
          padding: 0.75rem 0.85rem 0.75rem 0.7rem;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, border-left-color 0.15s;
          margin-bottom: 0.3rem;
        }
        .init-btn:not(.init-disabled):hover {
          background: #2a2418;
          border-left-color: ${GOLD};
        }
        .init-disabled {
          background: #0f0d0a !important;
          border-left-color: #2a2420 !important;
          cursor: not-allowed;
        }
        .init-disabled:hover {
          background: #0f0d0a !important;
        }
        .init-urgent {
          border-left-color: ${GARNET} !important;
          animation: urgentPulse 2s ease-in-out infinite;
        }
        .exec-btn {
          border: 1px solid ${GOLD}88;
          background: transparent;
          color: ${GOLD};
          font-family: Cinzel, serif;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.7rem;
          min-height: 28px;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s, border-color 0.15s;
          margin-top: 0.5rem;
        }
        .exec-btn:hover { background: ${GOLD}22; border-color: ${GOLD}; }
        .cat-header {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          cursor: pointer;
          background: #1a1510;
          border-bottom: 1px solid #0d0b08;
          user-select: none;
          transition: background 0.15s;
        }
        .cat-header:hover { background: #241e16; }
      `}</style>

      {/* Panel header */}
      <div style={{
        padding: '0.6rem 1rem',
        borderBottom: '1px solid #1a1510',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        position: 'sticky', top: 0, background: BG2, zIndex: 10,
      }}>
        <span style={{ fontSize: '0.9rem' }}>📋</span>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.62rem',
          color: '#555', letterSpacing: '0.18em',
        }}>
          INICIATIVA
        </span>
      </div>

      {/* ── Mensaje infancia (0-15 años) ─────────────────────────────────── */}
      {ageYears < 16 && (
        <div style={{
          padding: '2rem 1.5rem',
          textAlign: 'center',
          borderBottom: '1px solid #1a1510',
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🧒</div>
          <p style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.78rem',
            color: '#d4c5a0', lineHeight: 1.7, margin: '0 0 1rem',
          }}>
            Eres demasiado joven para tomar<br />
            decisiones importantes.
          </p>
          <p style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.7rem',
            color: '#888', lineHeight: 1.6, margin: '0 0 1.5rem',
          }}>
            Tu vida empieza a los 16 años.
          </p>
          {/* Countdown visual */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            background: '#1a1510', borderRadius: 6, padding: '0.75rem 1.5rem',
            border: `1px solid ${GOLD}33`,
          }}>
            <span style={{
              fontFamily: 'Cinzel, serif', fontSize: '2rem',
              color: GOLD, fontWeight: 700, lineHeight: 1,
            }}>
              {16 - ageYears}
            </span>
            <span style={{
              fontFamily: 'Cinzel, serif', fontSize: '0.5rem',
              color: '#555', letterSpacing: '0.18em', marginTop: '0.3rem',
            }}>
              {16 - ageYears === 1 ? 'AÑO RESTANTE' : 'AÑOS RESTANTES'}
            </span>
          </div>
          {/* Barra de progreso hacia los 16 */}
          <div style={{ marginTop: '1.2rem' }}>
            <div style={{
              width: '100%', height: 4, background: '#1a1510',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                width: `${(ageYears / 16) * 100}%`, height: '100%',
                background: `linear-gradient(90deg, ${GOLD}66, ${GOLD})`,
                borderRadius: 2,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ fontSize: '0.55rem', color: '#444', marginTop: '0.4rem', letterSpacing: '0.1em' }}>
              {ageYears} / 16 años
            </div>
          </div>
        </div>
      )}

      {/* Categorías (solo si tiene 16+) */}
      {ageYears >= 16 && CATEGORIES.map(cat => {
        const isOpen = openCats.has(cat.id)
        const urgentCount = cat.items.filter(i =>
          i.urgent?.(ctx) && i.req(ctx).ok
        ).length

        return (
          <div key={cat.id}>
            {/* Header de categoría */}
            <div className="cat-header" onClick={() => toggleCat(cat.id)}>
              <span style={{ fontSize: '0.85rem' }}>{cat.icon}</span>
              <span style={{
                fontFamily: 'Cinzel, serif', fontSize: '0.65rem',
                color: `${GOLD}cc`, letterSpacing: '0.15em', flex: 1,
              }}>
                {cat.label}
              </span>
              {urgentCount > 0 && (
                <span style={{
                  background: GARNET, color: '#d4c5a0',
                  fontSize: '0.52rem', fontFamily: 'Cinzel, serif',
                  padding: '0.1rem 0.35rem', borderRadius: 2,
                }}>
                  {urgentCount}
                </span>
              )}
              <span style={{
                color: `${GOLD}66`, fontSize: '0.65rem',
                display: 'inline-block',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
              }}>
                ▼
              </span>
            </div>

            {/* Items */}
            {isOpen && (
              <div style={{ padding: '0.5rem 0.85rem' }}>
                {cat.items.map(item => {
                  const req = item.req(ctx)
                  const urgent = item.urgent?.(ctx) && req.ok
                  const hasSubMenu = !!item.subMenuId
                  const subMenuOpen = subMenu === item.id

                  return (
                    <div key={item.id}>
                      <div
                        className={[
                          'init-btn',
                          !req.ok ? 'init-disabled' : '',
                          urgent ? 'init-urgent' : '',
                        ].join(' ')}
                        title={req.ok ? '' : (req.reason ?? '')}
                      >
                        {/* Título + costes */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{
                            fontFamily: 'Cinzel, serif', fontSize: '14px',
                            color: req.ok ? '#e8dfc8' : '#666',
                            letterSpacing: '0.06em',
                            display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap',
                          }}>
                            {!req.ok && <span>🔒</span>}
                            {item.title}
                            {urgent && (
                              <span style={{
                                background: GARNET, color: '#d4c5a0',
                                fontSize: '0.45rem', fontFamily: 'Cinzel, serif',
                                letterSpacing: '0.1em', padding: '0.1rem 0.3rem',
                                borderRadius: 2, verticalAlign: 'middle',
                              }}>
                                URGENTE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.58rem', color: `${GOLD}88`, textAlign: 'right', flexShrink: 0 }}>
                            {item.weekCost > 0 && <div>{item.weekCost}sem</div>}
                            {item.moneyCost > 0 && <div>€{item.moneyCost.toLocaleString('es')}</div>}
                          </div>
                        </div>

                        {/* Descripción */}
                        <div style={{ fontSize: '12px', color: req.ok ? '#a09080' : '#3a3530', marginTop: '0.25rem', lineHeight: 1.5 }}>
                          {item.desc}
                        </div>

                        {/* Requisito bloqueado */}
                        {!req.ok && (
                          <div style={{ fontSize: '0.58rem', color: '#c05050', marginTop: '0.3rem' }}>
                            ✗ {req.reason}
                          </div>
                        )}
                        {req.ok && (
                          <div style={{ fontSize: '0.58rem', color: '#4aff8a88', marginTop: '0.3rem' }}>
                            ✓ Disponible
                          </div>
                        )}

                        {/* Botón de ejecutar */}
                        {req.ok && !hasSubMenu && (
                          <button
                            className="exec-btn"
                            onClick={(e) => { e.stopPropagation(); execute(item.id) }}
                          >
                            EJECUTAR →
                          </button>
                        )}
                        {req.ok && hasSubMenu && (
                          <button
                            className="exec-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSubMenu(subMenuOpen ? null : item.id)
                            }}
                            style={{
                              borderColor: subMenuOpen ? GOLD : `${GOLD}88`,
                              background: subMenuOpen ? `${GOLD}18` : 'transparent',
                            }}
                          >
                            {subMenuOpen ? 'CERRAR ▲' : 'ELEGIR ▼'}
                          </button>
                        )}
                      </div>

                      {/* Sub-menú: trabajos */}
                      {subMenuOpen && (item.id === 'buscar_trabajo' || item.id === 'cambiar_profesion') && (
                        <div style={{
                          background: '#0d0b08', border: `1px solid ${GOLD}33`,
                          borderRadius: 4, padding: '0.5rem', marginBottom: '0.5rem',
                        }}>
                          {availableJobs.length === 0 ? (
                            <p style={{ fontSize: '0.65rem', color: MUTED, margin: 0 }}>
                              Ningún trabajo disponible con tus stats actuales.
                            </p>
                          ) : (
                            availableJobs.map(job => (
                              <button
                                key={job.id}
                                onClick={() => execute(item.id, { jobId: job.id })}
                                style={{
                                  display: 'block', width: '100%', textAlign: 'left',
                                  background: 'transparent', border: `1px solid #2a2420`,
                                  borderRadius: 3, padding: '0.45rem 0.7rem',
                                  color: '#d4c5a0', cursor: 'pointer', marginBottom: '0.3rem',
                                  transition: 'border-color 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2420' }}
                              >
                                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.68rem' }}>
                                  {job.name}
                                </span>
                                <span style={{ float: 'right', fontSize: '0.62rem', color: '#4aff8a' }}>
                                  €{job.salary.toLocaleString('es')}/mes
                                </span>
                              </button>
                            ))
                          )}

                        </div>
                      )}

                      {/* Sub-menú: inversiones */}
                      {subMenuOpen && item.id === 'abrir_inversion' && (
                        <div style={{
                          background: '#0d0b08', border: `1px solid ${GOLD}33`,
                          borderRadius: 4, padding: '0.5rem', marginBottom: '0.5rem',
                        }}>
                          {[
                            { id: 'etf',      name: 'ETF Indexado',    rend: '7%',  riesgo: 'Bajo' },
                            { id: 'acciones', name: 'Acciones',        rend: '12%', riesgo: 'Medio' },
                            { id: 'oro',      name: 'Oro',             rend: '5%',  riesgo: 'Bajo' },
                            { id: 'crypto',   name: 'Criptomonedas',   rend: '25%', riesgo: 'Muy alto' },
                          ].map(inv => (
                            <button
                              key={inv.id}
                              onClick={() => execute('abrir_inversion', { inversion: inv.id })}
                              style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                background: 'transparent', border: `1px solid #2a2420`,
                                borderRadius: 3, padding: '0.45rem 0.7rem',
                                color: '#d4c5a0', cursor: 'pointer', marginBottom: '0.3rem',
                                transition: 'border-color 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2420' }}
                            >
                              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.68rem' }}>
                                {inv.name}
                              </span>
                              <span style={{ float: 'right', fontSize: '0.6rem', color: '#555' }}>
                                {inv.rend} · {inv.riesgo}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Vivir trimestre: flotante en esquina inferior derecha del panel ── */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 10,
        display: 'flex', justifyContent: 'flex-end',
        padding: '0.5rem 0.85rem',
        background: `linear-gradient(transparent, ${BG2} 40%)`,
        pointerEvents: 'none',
      }}>
        <button
          onClick={() => onRequestQuarter?.()}
          title="Asignar tiempo y avanzar trimestre"
          style={{
            pointerEvents: 'auto',
            background: '#0f0d0a',
            border: `1px solid ${GOLD}66`,
            color: GOLD,
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            padding: '0.4rem 0.85rem',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = GOLD
            e.currentTarget.style.background = `${GOLD}18`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${GOLD}66`
            e.currentTarget.style.background = '#0f0d0a'
          }}
        >
          VIVIR TRIMESTRE ▶
        </button>
      </div>
    </div>
  )
}
