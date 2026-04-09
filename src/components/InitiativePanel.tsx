import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Economy, Career, Time, Country, NivelCarrera, AppScreen } from '../store/gameStore';
import type { Character } from '../types';

const GOLD   = '#c9a84c';
const GARNET = '#8b1a2a';
const GREEN  = '#6ee7a0';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReqCheck { label: string; met: boolean }

interface CheckCtx {
  character: Character | null;
  economy:   Economy;
  career:    Career;
  time:      Time;
  country:   Country;
}

interface InitiativeDef {
  id:        string;
  title:     string;
  timeCost:  number;  // weeks
  moneyCost: number;  // €
  urgent?:   boolean;
  checkReqs: (ctx: CheckCtx) => ReqCheck[];
}

interface Category {
  id:           string;
  label:        string;
  icon:         string;
  initiatives:  InitiativeDef[];
}

// ─── Initiatives data ─────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'vida',
    label: 'Vida Personal',
    icon: '♡',
    initiatives: [
      {
        id: 'buscar_pareja',
        title: 'Buscar pareja',
        timeCost: 4,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Edad 18+', met: ctx.time.narrativeAge >= 18 },
          { label: 'Soltero/a', met: !ctx.character?.flags?.tiene_pareja },
        ],
      },
      {
        id: 'proponer_matrimonio',
        title: 'Proponer matrimonio',
        timeCost: 1,
        moneyCost: 2000,
        checkReqs: (ctx) => [
          { label: 'Tiene pareja', met: !!ctx.character?.flags?.tiene_pareja },
          { label: 'Afinidad 8+', met: (ctx.character?.flags?.afinidad_pareja as number ?? 0) >= 8 },
          { label: '2000€ disponibles', met: ctx.economy.liquidez >= 2000 },
        ],
      },
      {
        id: 'tener_hijo',
        title: 'Tener hijo',
        timeCost: 40,
        moneyCost: 500,
        checkReqs: (ctx) => [
          { label: 'Pareja estable', met: !!ctx.character?.flags?.casado || !!ctx.character?.flags?.pareja_estable },
          { label: '500€+ liquidez', met: ctx.economy.liquidez >= 500 },
          { label: 'Edad 18-45', met: ctx.time.narrativeAge >= 18 && ctx.time.narrativeAge <= 45 },
        ],
      },
      {
        id: 'emanciparse',
        title: 'Emanciparse',
        timeCost: 2,
        moneyCost: 1500,
        checkReqs: (ctx) => [
          { label: 'Edad 18+', met: ctx.time.narrativeAge >= 18 },
          { label: 'No emancipado', met: !ctx.character?.flags?.emancipado },
          { label: '1500€ disponibles', met: ctx.economy.liquidez >= 1500 },
        ],
      },
      {
        id: 'adoptar_mascota',
        title: 'Adoptar mascota',
        timeCost: 1,
        moneyCost: 200,
        checkReqs: (ctx) => [
          { label: 'Emancipado', met: !!ctx.character?.flags?.emancipado },
          { label: '200€ disponibles', met: ctx.economy.liquidez >= 200 },
        ],
      },
      {
        id: 'planificar_viaje',
        title: 'Planificar viaje',
        timeCost: 2,
        moneyCost: 1000,
        checkReqs: (ctx) => [
          { label: '1000€ disponibles', met: ctx.economy.liquidez >= 1000 },
        ],
      },
    ],
  },
  {
    id: 'carrera',
    label: 'Carrera',
    icon: '◈',
    initiatives: [
      {
        id: 'buscar_trabajo',
        title: 'Buscar primer trabajo',
        timeCost: 3,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Edad 16+', met: ctx.time.narrativeAge >= 16 },
          { label: 'Sin empleo', met: !ctx.career.profesion },
        ],
      },
      {
        id: 'pedir_ascenso',
        title: 'Pedir ascenso',
        timeCost: 1,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Empleado', met: !!ctx.career.profesion },
          { label: '2+ años experiencia', met: ctx.career.experiencia >= 2 },
        ],
      },
      {
        id: 'cambiar_profesion',
        title: 'Cambiar profesión',
        timeCost: 8,
        moneyCost: 500,
        checkReqs: (ctx) => [
          { label: 'Empleado', met: !!ctx.career.profesion },
        ],
      },
      {
        id: 'montar_negocio',
        title: 'Montar negocio',
        timeCost: 12,
        moneyCost: 5000,
        checkReqs: (ctx) => [
          { label: '5000€ disponibles', met: ctx.economy.liquidez >= 5000 },
          { label: 'Edad 18+', met: ctx.time.narrativeAge >= 18 },
        ],
      },
      {
        id: 'buscar_mentor',
        title: 'Buscar mentor',
        timeCost: 2,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Reputación 40+', met: ctx.career.reputacion >= 40 },
          { label: 'Empleado', met: !!ctx.career.profesion },
        ],
      },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: '◆',
    initiatives: [
      {
        id: 'abrir_cartera',
        title: 'Abrir cartera inversión',
        timeCost: 1,
        moneyCost: 500,
        checkReqs: (ctx) => [
          { label: '500€ disponibles', met: ctx.economy.liquidez >= 500 },
          { label: 'Sin cartera', met: ctx.economy.carteraInversion.length === 0 },
        ],
      },
      {
        id: 'comprar_inmueble',
        title: 'Comprar inmueble',
        timeCost: 4,
        moneyCost: 40000,
        checkReqs: (ctx) => [
          { label: '40000€ disponibles', met: ctx.economy.liquidez >= 40000 },
          { label: 'Edad 18+', met: ctx.time.narrativeAge >= 18 },
        ],
      },
      {
        id: 'ir_casino',
        title: 'Ir al casino',
        timeCost: 1,
        moneyCost: 200,
        checkReqs: (ctx) => [
          { label: '200€ disponibles', met: ctx.economy.liquidez >= 200 },
        ],
      },
      {
        id: 'gestionar_hipoteca',
        title: 'Gestionar hipoteca',
        timeCost: 1,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Tiene hipoteca', met: ctx.economy.inmuebles.some(i => i.hipoteca > 0) },
        ],
      },
      {
        id: 'ver_proyeccion',
        title: 'Ver proyección patrimonio',
        timeCost: 0,
        moneyCost: 0,
        checkReqs: () => [],
      },
    ],
  },
  {
    id: 'educacion',
    label: 'Educación',
    icon: '◉',
    initiatives: [
      {
        id: 'universidad',
        title: 'Universidad',
        timeCost: 208,
        moneyCost: 8000,
        checkReqs: (ctx) => [
          { label: 'Edad 17-25', met: ctx.time.narrativeAge >= 17 && ctx.time.narrativeAge <= 25 },
          { label: '8000€ disponibles', met: ctx.economy.liquidez >= 8000 },
          { label: 'Lógica 6+', met: (ctx.character?.stats.logica ?? 0) >= 6 },
        ],
      },
      {
        id: 'aprender_idioma',
        title: 'Aprender idioma',
        timeCost: 26,
        moneyCost: 300,
        checkReqs: (ctx) => [
          { label: '300€ disponibles', met: ctx.economy.liquidez >= 300 },
        ],
      },
      {
        id: 'curso_especializacion',
        title: 'Curso especialización',
        timeCost: 12,
        moneyCost: 1200,
        checkReqs: (ctx) => [
          { label: '1200€ disponibles', met: ctx.economy.liquidez >= 1200 },
          { label: 'Empleado', met: !!ctx.career.profesion },
        ],
      },
      {
        id: 'formacion_autodidacta',
        title: 'Formación autodidacta',
        timeCost: 4,
        moneyCost: 0,
        checkReqs: () => [],
      },
    ],
  },
  {
    id: 'salud',
    label: 'Salud',
    icon: '✦',
    initiatives: [
      {
        id: 'ir_medico',
        title: 'Ir al médico',
        timeCost: 1,
        moneyCost: 0,
        checkReqs: () => [],
      },
      {
        id: 'gimnasio',
        title: 'Apuntarse al gimnasio',
        timeCost: 1,
        moneyCost: 50,
        checkReqs: (ctx) => [
          { label: '50€ disponibles', met: ctx.economy.liquidez >= 50 },
          { label: 'No apuntado', met: !ctx.character?.flags?.tiene_gimnasio },
        ],
      },
      {
        id: 'terapeuta',
        title: 'Buscar terapeuta',
        timeCost: 2,
        moneyCost: 200,
        checkReqs: (ctx) => [
          { label: '200€ disponibles', met: ctx.economy.liquidez >= 200 },
        ],
      },
      {
        id: 'dejar_vicio',
        title: 'Dejar un vicio',
        timeCost: 8,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Tiene adicción', met: !!ctx.character?.flags?.tiene_adiccion },
        ],
      },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: '❋',
    initiatives: [
      {
        id: 'llamar_amigo',
        title: 'Llamar a un amigo',
        timeCost: 0,
        moneyCost: 0,
        checkReqs: () => [],
      },
      {
        id: 'reconciliarse',
        title: 'Reconciliarse',
        timeCost: 2,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Conflicto activo', met: !!ctx.character?.flags?.conflicto_activo },
        ],
      },
      {
        id: 'organizar_evento',
        title: 'Organizar evento social',
        timeCost: 2,
        moneyCost: 100,
        checkReqs: (ctx) => [
          { label: '100€ disponibles', met: ctx.economy.liquidez >= 100 },
          { label: 'Emancipado', met: !!ctx.character?.flags?.emancipado },
        ],
      },
      {
        id: 'contactar_mentor_rival',
        title: 'Contactar mentor o rival',
        timeCost: 1,
        moneyCost: 0,
        checkReqs: (ctx) => [
          { label: 'Tiene rival/mentor', met: !!ctx.character?.flags?.tiene_mentor || !!ctx.character?.flags?.rival_conocido },
        ],
      },
    ],
  },
];

// ─── Execute handlers ─────────────────────────────────────────────────────────

function useInitiativeExecutors() {
  const character        = useGameStore(s => s.character);
  const time             = useGameStore(s => s.time);
  const economy          = useGameStore(s => s.economy);
  const career           = useGameStore(s => s.career);
  const addFeedEntry     = useGameStore(s => s.addFeedEntry);
  const addFlag          = useGameStore(s => s.addFlag);
  const updateEconomy    = useGameStore(s => s.updateEconomy);
  const updateCareer     = useGameStore(s => s.updateCareer);
  const updateStats      = useGameStore(s => s.updateStats);
  const updateCargaVital = useGameStore(s => s.updateCargaVital);
  const avanzarSemana    = useGameStore(s => s.avanzarSemana);
  const cambiarProfesion = useGameStore(s => s.cambiarProfesion);
  const updateLegacy     = useGameStore(s => s.updateLegacy);
  const addTimelineEvent = useGameStore(s => s.addTimelineEvent);
  const addInversion     = useGameStore(s => s.addInversion);

  const año = character ? character.birthYear + time.añoActual : time.añoActual;

  const feed = (text: string, importance: 'normal' | 'alta' | 'critica' = 'normal') =>
    addFeedEntry({ semana: time.semanaActual, año, text, importance });

  const advance = (weeks: number, moneyCost: number) => {
    for (let i = 0; i < weeks; i++) avanzarSemana();
    if (moneyCost > 0) updateEconomy({ liquidez: economy.liquidez - moneyCost });
    const burden = Math.min(10, weeks * 0.15);
    updateCargaVital(Math.min(100, time.cargaVital + burden));
  };

  const NAME_PAIRS: [string, string][] = [
    ['Elena', 'Carlos'], ['Sofía', 'Andrés'], ['Laura', 'Miguel'],
    ['Carmen', 'Pablo'], ['Ana', 'Javier'], ['Lucía', 'David'],
  ];
  const randPair = () => NAME_PAIRS[Math.floor(Math.random() * NAME_PAIRS.length)];
  const places = ['la biblioteca del barrio', 'un evento local', 'una aplicación de citas', 'el trabajo', 'una fiesta de amigos', 'el gimnasio'];
  const randPlace = () => places[Math.floor(Math.random() * places.length)];

  const JOBS: { profesion: string; nivel: NivelCarrera; ingreso: number }[] = [
    { profesion: 'Técnico',                 nivel: 'junior', ingreso: 1200 },
    { profesion: 'Asistente administrativo', nivel: 'junior', ingreso: 1100 },
    { profesion: 'Operario',                nivel: 'junior', ingreso: 1000 },
    { profesion: 'Cajero/a',               nivel: 'junior', ingreso: 950 },
    { profesion: 'Repartidor',             nivel: 'junior', ingreso: 900 },
  ];
  const randJob = () => JOBS[Math.floor(Math.random() * JOBS.length)];

  return {
    buscar_pareja: () => {
      const pair   = randPair();
      const nombre = character?.gender === 'hombre' ? pair[0] : pair[1];
      const afinidad = 4 + Math.floor(Math.random() * 6);
      addFlag('tiene_pareja', true);
      addFlag('nombre_pareja', nombre);
      addFlag('afinidad_pareja', afinidad);
      advance(4, 0);
      feed(`Has conocido a ${nombre} en ${randPlace()}. La conexión fue inmediata. Afinidad inicial: ${afinidad}/10.`, 'alta');
      updateLegacy(3);
    },

    proponer_matrimonio: () => {
      const nombre = character?.flags?.nombre_pareja as string ?? 'tu pareja';
      addFlag('casado', true);
      addFlag('pareja_estable', true);
      advance(1, 2000);
      feed(`Le pediste matrimonio a ${nombre}. Dijo que sí. Una nueva etapa comienza.`, 'critica');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Matrimonio', type: 'logro' });
      updateLegacy(8);
    },

    tener_hijo: () => {
      const nombres_h = ['Lucas', 'Hugo', 'Mateo', 'Álvaro', 'Diego'];
      const nombres_m = ['Valeria', 'Sofía', 'Martina', 'Daniela', 'Alejandra'];
      const es_niña = Math.random() < 0.5;
      const nombre  = (es_niña ? nombres_m : nombres_h)[Math.floor(Math.random() * 5)];
      addFlag('tiene_hijo', true);
      addFlag('nombre_hijo_1', nombre);
      advance(40, 500);
      updateEconomy({ gastosMensuales: economy.gastosMensuales + 400 });
      feed(`${nombre} ha llegado al mundo. La responsabilidad pesa, pero también la alegría. Tus gastos mensuales aumentan 400€.`, 'critica');
      addTimelineEvent({ semana: time.semanaActual, año, label: `Nace ${nombre}`, type: 'logro' });
      updateLegacy(10);
    },

    emanciparse: () => {
      addFlag('emancipado', true);
      advance(2, 1500);
      updateEconomy({ gastosMensuales: economy.gastosMensuales + 600 });
      feed('Te has independizado. El alquiler y los gastos del hogar son ahora responsabilidad tuya. +600€/mes en gastos.', 'alta');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Independencia', type: 'hito' });
      updateLegacy(4);
    },

    adoptar_mascota: () => {
      addFlag('tiene_mascota', true);
      advance(1, 200);
      feed('Has adoptado un perro del refugio local. Un compañero fiel para los momentos difíciles.', 'normal');
      updateLegacy(2);
    },

    planificar_viaje: () => {
      const destinos = ['Portugal', 'Francia', 'Italia', 'Marruecos', 'Japón', 'Argentina', 'Colombia'];
      const destino  = destinos[Math.floor(Math.random() * destinos.length)];
      advance(2, 1000);
      updateStats({ creatividad: 0.3, emocional: 0.2 });
      feed(`Has viajado a ${destino}. Nuevas perspectivas han ampliado tu mente y enriquecido tu alma. +0.3 Creatividad, +0.2 Emocional.`, 'normal');
    },

    buscar_trabajo: () => {
      const job = randJob();
      cambiarProfesion(job.profesion, job.nivel, job.ingreso);
      advance(3, 0);
      updateEconomy({ ingresosMensuales: economy.ingresosMensuales + job.ingreso });
      feed(`Has conseguido tu primer trabajo como ${job.profesion}. Ingresos mensuales: ${job.ingreso}€. Empieza la vida adulta.`, 'alta');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Primer empleo', type: 'hito' });
      updateLegacy(5);
    },

    pedir_ascenso: () => {
      const nuevosIngresos = Math.round(career.ingresosProfesionales * 1.2);
      updateCareer({ ingresosProfesionales: nuevosIngresos });
      updateEconomy({ ingresosMensuales: economy.ingresosMensuales + (nuevosIngresos - career.ingresosProfesionales) });
      advance(1, 0);
      feed(`Has negociado un ascenso. Tu nuevo salario es ${nuevosIngresos}€/mes. La reputación continúa creciendo.`, 'alta');
      updateLegacy(4);
    },

    cambiar_profesion: () => {
      const nuevasProfesiones = ['Consultor', 'Docente', 'Técnico especializado', 'Gestor de proyectos', 'Analista'];
      const nueva = nuevasProfesiones[Math.floor(Math.random() * nuevasProfesiones.length)];
      cambiarProfesion(nueva, 'junior', Math.round(career.ingresosProfesionales * 0.9));
      advance(8, 500);
      feed(`Has decidido cambiar de rumbo profesional. Ahora eres ${nueva}. El cambio tiene un coste de adaptación.`, 'alta');
    },

    montar_negocio: () => {
      addFlag('tiene_negocio', true);
      cambiarProfesion('Empresario', 'independiente', 0);
      advance(12, 5000);
      feed('Has fundado tu propio negocio. Los primeros meses serán duros, pero la independencia tiene un precio que vale la pena.', 'critica');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Negocio propio', type: 'logro' });
      updateLegacy(8);
    },

    buscar_mentor: () => {
      addFlag('tiene_mentor', true);
      advance(2, 0);
      updateCareer({ reputacion: career.reputacion + 10 });
      feed('Has encontrado un mentor en tu sector. Su experiencia y red de contactos son invaluables. +10 Reputación.', 'alta');
      updateLegacy(5);
    },

    abrir_cartera: () => {
      addInversion({ id: `inv_${Date.now()}`, nombre: 'Fondo indexado global', valor: 500, rendimientoAnual: 7 });
      updateEconomy({ liquidez: economy.liquidez - 500, patrimonioBruto: economy.patrimonioBruto + 500 });
      advance(1, 0);
      feed('Has abierto una cartera de inversión con un fondo indexado. El dinero empieza a trabajar para ti. Rendimiento esperado: 7%/año.', 'normal');
    },

    comprar_inmueble: () => {
      advance(4, 40000);
      updateEconomy({
        patrimonioBruto: economy.patrimonioBruto + 200000,
        deudaTotal:      economy.deudaTotal + 160000,
        gastosMensuales: economy.gastosMensuales + 800,
      });
      feed('Has comprado un piso. Entrada de 40.000€. Hipoteca de 160.000€ a 25 años (800€/mes). Tu patrimonio bruto crece.', 'critica');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Compra vivienda', type: 'logro' });
      updateLegacy(6);
    },

    ir_casino: () => {
      const ganado   = Math.random() < 0.35;
      const cantidad = 200 + Math.floor(Math.random() * 500);
      if (ganado) {
        updateEconomy({ liquidez: economy.liquidez - 200 + cantidad });
        feed(`Una noche de suerte en el casino. Has ganado ${cantidad}€. Cuidado con que se convierta en hábito.`, 'alta');
      } else {
        advance(1, 200);
        feed('Perdiste los 200€ que llevabas. El casino siempre gana a largo plazo. Quizás fue una lección barata.', 'normal');
      }
    },

    gestionar_hipoteca: () => {
      advance(1, 0);
      feed('Has revisado los términos de tu hipoteca con el banco. Pequeña renegociación que podría ahorrarte dinero a largo plazo.', 'normal');
    },

    ver_proyeccion: () => {
      const neto   = economy.patrimonioBruto + economy.liquidez - economy.deudaTotal;
      const proy10 = Math.round(neto * 1.07 ** 10 + economy.ingresosMensuales * 12 * 10 * 0.3);
      feed(`Proyección patrimonial: patrimonio neto actual ${neto.toLocaleString('es-ES')}€. En 10 años, estimado: ${proy10.toLocaleString('es-ES')}€ (asumiendo 7%/año y ahorro constante).`, 'normal');
    },

    universidad: () => {
      advance(208, 8000);
      updateStats({ logica: 1.5, disciplina: 0.8, creatividad: 0.5 });
      updateCareer({ reputacion: career.reputacion + 20 });
      addFlag('tiene_titulo', true);
      feed('Han pasado cuatro años. Has obtenido tu título universitario. +1.5 Lógica, +0.8 Disciplina, +0.5 Creatividad. +20 Reputación.', 'critica');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Título universitario', type: 'logro' });
      updateLegacy(10);
    },

    aprender_idioma: () => {
      advance(26, 300);
      updateStats({ logica: 0.4, creatividad: 0.2 });
      const idiomas = ['inglés', 'francés', 'alemán', 'portugués', 'mandarín', 'árabe', 'italiano'];
      const idioma  = idiomas[Math.floor(Math.random() * idiomas.length)];
      addFlag(`idioma_${idioma}`, true);
      feed(`Tras seis meses de estudio, hablas ${idioma} con soltura. Nuevas puertas se abren. +0.4 Lógica, +0.2 Creatividad.`, 'normal');
    },

    curso_especializacion: () => {
      advance(12, 1200);
      updateStats({ disciplina: 0.6, logica: 0.4 });
      updateCareer({ reputacion: career.reputacion + 8 });
      feed('Curso de especialización completado. Tu perfil profesional se fortalece. +0.6 Disciplina, +0.4 Lógica, +8 Reputación.', 'normal');
    },

    formacion_autodidacta: () => {
      advance(4, 0);
      const stats: (keyof import('../types').CharacterStats)[] = ['logica', 'creatividad', 'disciplina'];
      const stat = stats[Math.floor(Math.random() * stats.length)];
      updateStats({ [stat]: 0.3 });
      feed('Has invertido un mes en formarte por tu cuenta. La constancia tiene recompensa. +0.3 en un stat cognitivo.', 'normal');
    },

    ir_medico: () => {
      advance(1, 0);
      feed('Visita médica rutinaria. Todo en orden. La salud preventiva es el mejor seguro de vida.', 'normal');
    },

    gimnasio: () => {
      addFlag('tiene_gimnasio', true);
      advance(1, 50);
      updateEconomy({ gastosMensuales: economy.gastosMensuales + 50 });
      updateStats({ fisico: 0.5 });
      feed('Te has apuntado al gimnasio. Cuota mensual de 50€. +0.5 Físico inmediato. La consistencia hará el resto.', 'normal');
    },

    terapeuta: () => {
      advance(2, 200);
      updateStats({ emocional: 0.7, estabilidad: 0.4 });
      feed('Dos meses de terapia. Empiezas a entender mejor tus patrones. +0.7 Emocional, +0.4 Estabilidad.', 'normal');
    },

    dejar_vicio: () => {
      advance(8, 0);
      addFlag('tiene_adiccion', false);
      updateStats({ disciplina: 1.0, fisico: 0.5 });
      feed('Lo has conseguido. Dos meses duros pero lo has superado. +1.0 Disciplina, +0.5 Físico. El cuerpo lo agradece.', 'alta');
      addTimelineEvent({ semana: time.semanaActual, año, label: 'Supera adicción', type: 'logro' });
      updateLegacy(6);
    },

    llamar_amigo: () => {
      const amigos = ['Roberto', 'Marta', 'Jorge', 'Patricia', 'Tomás', 'Nuria'];
      const amigo  = amigos[Math.floor(Math.random() * amigos.length)];
      updateStats({ emocional: 0.2, carisma: 0.1 });
      feed(`Larga conversación con ${amigo}. Te recuerda que no estás solo. Pequeño impulso emocional. +0.2 Emocional.`, 'normal');
    },

    reconciliarse: () => {
      addFlag('conflicto_activo', false);
      advance(2, 0);
      updateStats({ emocional: 0.5, carisma: 0.3 });
      feed('La conversación fue difícil pero necesaria. La reconciliación es un acto de valentía. +0.5 Emocional, +0.3 Carisma.', 'alta');
      updateLegacy(4);
    },

    organizar_evento: () => {
      advance(2, 100);
      updateStats({ carisma: 0.5, emocional: 0.3 });
      addFlag('tiene_red_social', true);
      feed('El evento fue un éxito. Tu red social se amplía y tu carisma brilla. +0.5 Carisma, +0.3 Emocional.', 'normal');
    },

    contactar_mentor_rival: () => {
      advance(1, 0);
      const con_mentor = character?.flags?.tiene_mentor;
      if (con_mentor) {
        updateStats({ logica: 0.3, disciplina: 0.2 });
        feed('Tu mentor te ha dado consejos que difícilmente aprenderías en otro lugar. +0.3 Lógica, +0.2 Disciplina.', 'normal');
      } else {
        feed('Has enviado un mensaje a tu rival. La respuesta fue fría pero directa. La competencia sana también forja el carácter.', 'normal');
        updateStats({ ambicion: 0.4 });
      }
    },
  } as Record<string, () => void>;
}

// ─── Initiative Card ──────────────────────────────────────────────────────────

function InitiativeCard({
  initiative,
  requirements,
  canExecute,
  onExecute,
}: {
  initiative:   InitiativeDef;
  requirements: ReqCheck[];
  canExecute:   boolean;
  onExecute:    () => void;
}) {
  const allMet = requirements.every(r => r.met);

  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '7px',
      border: `1px solid ${allMet ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`,
      background: allMet ? 'rgba(201,168,76,0.04)' : 'rgba(0,0,0,0.15)',
      opacity: canExecute ? 1 : 0.5,
      transition: 'all 0.2s ease',
      animation: initiative.urgent && allMet ? 'urgent-pulse 2s ease-in-out infinite' : undefined,
    }}>
      {/* Title + costs */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '8px', marginBottom: requirements.length > 0 ? '8px' : '0',
      }}>
        <div className="cinzel" style={{
          fontSize: '11px', fontWeight: 600,
          color: allMet ? GOLD : 'rgba(255,255,255,0.35)',
          letterSpacing: '0.04em', flex: 1,
        }}>
          {initiative.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
          {initiative.timeCost > 0 && (
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif' }}>
              {initiative.timeCost}sem
            </span>
          )}
          {initiative.moneyCost > 0 && (
            <span style={{ fontSize: '9px', color: 'rgba(110,231,160,0.5)', fontFamily: 'sans-serif' }}>
              {initiative.moneyCost.toLocaleString('es-ES')}€
            </span>
          )}
        </div>
      </div>

      {/* Requirements */}
      {requirements.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {requirements.map((req, i) => (
            <span key={i} style={{
              fontSize: '9px', padding: '2px 6px', borderRadius: '3px',
              background: req.met ? 'rgba(110,231,160,0.1)' : 'rgba(248,113,113,0.1)',
              color:      req.met ? GREEN : '#f87171',
              border:     `1px solid ${req.met ? 'rgba(110,231,160,0.2)' : 'rgba(248,113,113,0.2)'}`,
              fontFamily: 'sans-serif', letterSpacing: '0.03em',
            }}>
              {req.met ? '✓' : '✗'} {req.label}
            </span>
          ))}
        </div>
      )}

      {/* Execute button */}
      {allMet && (
        <button
          onClick={onExecute}
          style={{
            width: '100%',
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(201,168,76,0.4)',
            background: 'rgba(201,168,76,0.1)',
            color: 'rgba(232,208,138,0.85)',
            fontSize: '10px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onPointerEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.2)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.65)';
          }}
          onPointerLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.1)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.4)';
          }}
        >
          Ejecutar
        </button>
      )}
    </div>
  );
}

// ─── Accordion Category ───────────────────────────────────────────────────────

function CategoryAccordion({
  category,
  ctx,
  executors,
}: {
  category:  Category;
  ctx:       CheckCtx;
  executors: Record<string, () => void>;
}) {
  const [open, setOpen] = useState(false);
  const availableCount = category.initiatives.filter(i => i.checkReqs(ctx).every(r => r.met)).length;

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '12px 14px',
          background: 'transparent', border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '14px', lineHeight: 1 }}>{category.icon}</span>
        <span className="cinzel" style={{
          fontSize: '11px', fontWeight: 600,
          color: 'rgba(201,168,76,0.75)', letterSpacing: '0.12em',
          textTransform: 'uppercase', flex: 1,
        }}>
          {category.label}
        </span>
        {availableCount > 0 && (
          <span style={{
            fontSize: '9px', padding: '2px 6px', borderRadius: '10px',
            background: 'rgba(201,168,76,0.15)', color: GOLD,
            fontFamily: 'sans-serif', fontWeight: 700,
          }}>
            {availableCount}
          </span>
        )}
        <span style={{
          fontSize: '10px', color: 'rgba(201,168,76,0.35)',
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'none',
          lineHeight: 1,
        }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{
          padding: '4px 10px 12px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          animation: 'fade-up 0.2s ease forwards',
        }}>
          {category.initiatives.map(init => {
            const reqs = init.checkReqs(ctx);
            return (
              <InitiativeCard
                key={init.id}
                initiative={init}
                requirements={reqs}
                canExecute={reqs.every(r => r.met)}
                onExecute={executors[init.id] ?? (() => { /* no-op */ })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Continue Stage Button ────────────────────────────────────────────────────

function ContinueStageButton() {
  const setScreen = useGameStore(s => s.setScreen);
  const time      = useGameStore(s => s.time);

  const age = time.narrativeAge;
  let nextStage  = '';
  let nextScreen: AppScreen | null = null;

  if      (age < 13) { nextStage = 'Infancia';    nextScreen = 'childhood'; }
  else if (age < 19) { nextStage = 'Adolescencia'; nextScreen = 'adolescence'; }
  else if (age < 31) { nextStage = 'Juventud';    nextScreen = 'youth'; }
  else if (age < 51) { nextStage = 'Adultez';     nextScreen = 'adulthood'; }
  else if (age < 71) { nextStage = 'Madurez';     nextScreen = 'maturity'; }
  else               { nextStage = 'Vejez';        nextScreen = 'oldage'; }

  if (!nextScreen) return null;

  return (
    <button
      onClick={() => nextScreen && setScreen(nextScreen)}
      style={{
        width: '100%', padding: '14px',
        borderRadius: '6px',
        border: '1px solid rgba(201,168,76,0.4)',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(139,100,30,0.18))',
        color: 'rgba(232,208,138,0.85)',
        fontFamily: "'Cinzel', serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.25s ease',
      }}
      onPointerEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.7)';
        (e.currentTarget as HTMLButtonElement).style.background  = 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(139,100,30,0.28))';
      }}
      onPointerLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.4)';
        (e.currentTarget as HTMLButtonElement).style.background  = 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(139,100,30,0.18))';
      }}
    >
      Avanzar a {nextStage} →
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InitiativePanel() {
  const character = useGameStore(s => s.character);
  const economy   = useGameStore(s => s.economy);
  const career    = useGameStore(s => s.career);
  const time      = useGameStore(s => s.time);
  const country   = useGameStore(s => s.country);
  const executors = useInitiativeExecutors();

  const ctx: CheckCtx = { character, economy, career, time, country };

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(201,168,76,0.15) transparent',
    }}>
      <div style={{
        padding: '12px 14px 8px',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}>
        <p className="cinzel" style={{
          fontSize: '9px', letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.35)',
          margin: 0,
        }}>
          Panel de Iniciativa
        </p>
      </div>

      {CATEGORIES.map(cat => (
        <CategoryAccordion
          key={cat.id}
          category={cat}
          ctx={ctx}
          executors={executors}
        />
      ))}

      {/* Continue to next stage button */}
      <div style={{ padding: '16px 14px' }}>
        <ContinueStageButton />
      </div>
    </div>
  );
}

// suppress unused constant warnings
void GARNET;
