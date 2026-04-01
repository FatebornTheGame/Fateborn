import { useState, useCallback } from 'react';
import type { Character, CharacterStats } from '../types';
import type { Economy, Career, Time } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Initiative {
  id:          string;
  label:       string;
  description: string;
  effect:      string;          // short outcome shown after execution
  costLabel?:  string;
  locked:      boolean;
  lockReason?: string;
  onActivate:  (() => void) | null;
}

interface Category {
  id:    string;
  label: string;
  icon:  string;
  items: Initiative[];
}

// ─── Profession selector based on dominant stat ───────────────────────────────

function suggestProfession(stats: CharacterStats): { profesion: string; nivel: 'junior'; ingreso: number } {
  const s = stats;
  const ranked = [
    { key: 'logica',      val: s.logica      },
    { key: 'disciplina',  val: s.disciplina  },
    { key: 'creatividad', val: s.creatividad },
    { key: 'carisma',     val: s.carisma     },
    { key: 'ambicion',    val: s.ambicion    },
    { key: 'fisico',      val: s.fisico      },
    { key: 'emocional',   val: s.emocional   },
  ].sort((a, b) => b.val - a.val);

  const top = ranked[0].key;
  const map: Record<string, { profesion: string; ingreso: number }> = {
    logica:      { profesion: 'Investigador',    ingreso: 1400 },
    disciplina:  { profesion: 'Técnico',         ingreso: 1100 },
    creatividad: { profesion: 'Diseñador',       ingreso: 1000 },
    carisma:     { profesion: 'Comercial',       ingreso: 1200 },
    ambicion:    { profesion: 'Emprendedor',     ingreso: 900  },
    fisico:      { profesion: 'Trabajador manual', ingreso: 950 },
    emocional:   { profesion: 'Trabajador social', ingreso: 1050 },
  };
  const entry = map[top] ?? { profesion: 'Técnico', ingreso: 1000 };
  return { profesion: entry.profesion, nivel: 'junior', ingreso: entry.ingreso };
}

// ─── Category builder ─────────────────────────────────────────────────────────

function buildCategories(
  character: Character,
  economy:   Economy,
  career:    Career,
  time:      Time,
  actions: {
    buscarTrabajo:     () => void;
    irAlMedico:        () => void;
    llamarAmigo:       () => void;
    meditacion:        () => void;
    ejercicio:         () => void;
    networking:        () => void;
    diario:            () => void;
    chequeo:           () => void;
  },
): Category[] {
  const stats = character.stats;
  const sinTrabajo = !career.profesion;

  return [
    {
      id:    'personal',
      label: 'VIDA PERSONAL',
      icon:  '◈',
      items: [
        {
          id:          'meditacion',
          label:       'Práctica de meditación',
          description: '+Estabilidad, −Carga vital',
          effect:      '+0.4 Estabilidad',
          costLabel:   '3h/semana',
          locked:      time.asignacionSemanal.ocio < 3,
          lockReason:  'Requiere 3h de ocio disponibles',
          onActivate:  time.asignacionSemanal.ocio >= 3 ? actions.meditacion : null,
        },
        {
          id:          'diario',
          label:       'Llevar un diario',
          description: '+Emocional, +Creatividad',
          effect:      '+0.3 Emocional, +0.2 Creatividad',
          costLabel:   '1h/semana',
          locked:      false,
          onActivate:  actions.diario,
        },
        {
          id:          'terapia',
          label:       'Psicoterapia',
          description: '+Emocional, +Estabilidad',
          effect:      '+0.5 Emocional, +0.3 Estabilidad',
          costLabel:   '180€/mes',
          locked:      economy.liquidez < 180,
          lockReason:  'Liquidez insuficiente (necesitas 180€)',
          onActivate:  null, // complejidad mayor, se implementa como evento
        },
        {
          id:          'llamar_amigo',
          label:       'Llamar a un amigo',
          description: '+Emocional, +Estabilidad',
          effect:      '+0.5 Emocional, +0.2 Estabilidad',
          costLabel:   'Sin coste',
          locked:      false,
          onActivate:  actions.llamarAmigo,
        },
      ],
    },
    {
      id:    'carrera',
      label: 'CARRERA',
      icon:  '⬡',
      items: [
        {
          id:          'buscar_trabajo',
          label:       sinTrabajo ? 'Buscar trabajo' : 'Cambiar de trabajo',
          description: sinTrabajo ? 'Encuentra empleo según tus stats' : 'Busca una oportunidad mejor',
          effect:      `Profesión asignada según stats dominantes`,
          costLabel:   sinTrabajo ? 'Gratis' : 'Requiere Ambición ≥ 5',
          locked:      !sinTrabajo && stats.ambicion < 5,
          lockReason:  'Requiere Ambición ≥ 5 para cambiar de trabajo',
          onActivate:  (!sinTrabajo && stats.ambicion < 5) ? null : actions.buscarTrabajo,
        },
        {
          id:          'formacion_continua',
          label:       'Formación continua',
          description: '+Lógica, +Disciplina',
          effect:      '+0.3 Lógica, +0.2 Disciplina',
          costLabel:   '5h/semana',
          locked:      time.asignacionSemanal.formacion < 5,
          lockReason:  'Requiere 5h de formación semanales',
          onActivate:  null,
        },
        {
          id:          'networking',
          label:       'Red de contactos',
          description: '+Carisma, +Reputación',
          effect:      '+0.3 Carisma, +5 Reputación',
          costLabel:   '2h/semana',
          locked:      stats.carisma < 4,
          lockReason:  'Requiere Carisma ≥ 4',
          onActivate:  stats.carisma >= 4 ? actions.networking : null,
        },
        {
          id:          'mentoria',
          label:       'Buscar mentor',
          description: '+Lógica, +Disciplina',
          effect:      '+0.4 Lógica, +0.3 Disciplina',
          costLabel:   'Reputación ≥ 25',
          locked:      career.reputacion < 25,
          lockReason:  `Reputación actual: ${career.reputacion}/25`,
          onActivate:  null,
        },
      ],
    },
    {
      id:    'finanzas',
      label: 'FINANZAS',
      icon:  '◇',
      items: [
        {
          id:          'fondo_emergencia',
          label:       'Fondo de emergencia',
          description: '+Estabilidad financiera',
          effect:      '+0.3 Estabilidad',
          costLabel:   `${(economy.gastosMensuales * 3).toLocaleString('es')}€`,
          locked:      economy.liquidez < economy.gastosMensuales * 3,
          lockReason:  `Necesitas ${(economy.gastosMensuales * 3).toLocaleString('es')}€ (3 meses de gastos)`,
          onActivate:  null,
        },
        {
          id:          'inversion_indexada',
          label:       'Fondo indexado',
          description: 'Patrimonio crece pasivamente',
          effect:      'Ingresos pasivos mensuales',
          costLabel:   '50€/mes mínimo',
          locked:      economy.ingresosMensuales - economy.gastosMensuales < 50,
          lockReason:  'Necesitas margen mensual ≥ 50€',
          onActivate:  null,
        },
        {
          id:          'inmueble',
          label:       'Comprar inmueble',
          description: '+Patrimonio, +Ingreso pasivo',
          effect:      '+Patrimonio bruto, +Ingresos',
          costLabel:   '20.000€ entrada',
          locked:      economy.liquidez < 20000,
          lockReason:  `Necesitas 20.000€ (tienes ${economy.liquidez.toLocaleString('es')}€)`,
          onActivate:  null,
        },
        {
          id:          'negocio_propio',
          label:       'Negocio propio',
          description: '+Ingresos potenciales, alto riesgo',
          effect:      'Cambio de carrera: Emprendedor',
          costLabel:   '10.000€ + Ambición ≥ 7',
          locked:      stats.ambicion < 7 || economy.liquidez < 10000,
          lockReason:  stats.ambicion < 7 ? 'Requiere Ambición ≥ 7' : 'Capital insuficiente (10.000€)',
          onActivate:  null,
        },
      ],
    },
    {
      id:    'salud',
      label: 'SALUD',
      icon:  '♥',
      items: [
        {
          id:          'ejercicio_regular',
          label:       'Ejercicio regular',
          description: '+Físico, −Carga vital',
          effect:      '+0.4 Físico, −10% Carga vital',
          costLabel:   '5h/semana',
          locked:      false,
          onActivate:  actions.ejercicio,
        },
        {
          id:          'ir_medico',
          label:       'Ir al médico',
          description: 'Consulta general, reduce carga vital',
          effect:      '−15% Carga vital, −90€',
          costLabel:   '90€',
          locked:      economy.liquidez < 90,
          lockReason:  `Necesitas 90€ (tienes ${economy.liquidez.toLocaleString('es')}€)`,
          onActivate:  economy.liquidez >= 90 ? actions.irAlMedico : null,
        },
        {
          id:          'chequeo_medico',
          label:       'Chequeo anual completo',
          description: 'Análisis preventivo detallado',
          effect:      '−20% Carga vital, −200€',
          costLabel:   '200€',
          locked:      economy.liquidez < 200,
          lockReason:  `Necesitas 200€ (tienes ${economy.liquidez.toLocaleString('es')}€)`,
          onActivate:  economy.liquidez >= 200 ? actions.chequeo : null,
        },
        {
          id:          'deporte_extremo',
          label:       'Deporte de riesgo',
          description: '+Físico, +Riesgo, −Estabilidad',
          effect:      '+0.5 Físico, +0.4 Riesgo, −0.3 Estabilidad',
          costLabel:   'Físico ≥ 5',
          locked:      stats.fisico < 5,
          lockReason:  `Físico actual: ${stats.fisico.toFixed(1)}/5`,
          onActivate:  null,
        },
      ],
    },
    {
      id:    'social',
      label: 'SOCIAL',
      icon:  '◉',
      items: [
        {
          id:          'circulo_intimo',
          label:       'Cultivar círculo íntimo',
          description: '+Emocional, +Estabilidad',
          effect:      '+0.4 Emocional, +0.3 Estabilidad',
          costLabel:   '4h/semana',
          locked:      time.asignacionSemanal.familia < 2,
          lockReason:  'Requiere mínimo 2h semanales de familia',
          onActivate:  null,
        },
        {
          id:          'liderazgo_comunidad',
          label:       'Liderazgo comunitario',
          description: '+Carisma, +Ambición, +Reputación',
          effect:      '+0.4 Carisma, +0.3 Ambición, +8 Reputación',
          costLabel:   'Carisma ≥ 6',
          locked:      stats.carisma < 6,
          lockReason:  `Carisma actual: ${stats.carisma.toFixed(1)}/6`,
          onActivate:  null,
        },
        {
          id:          'pareja',
          label:       'Buscar pareja estable',
          description: '+Emocional, efecto en Estabilidad',
          effect:      '+0.5 Emocional',
          costLabel:   'Emocional ≥ 5',
          locked:      stats.emocional < 5,
          lockReason:  `Emocional actual: ${stats.emocional.toFixed(1)}/5`,
          onActivate:  null,
        },
        {
          id:          'mentoring_inverso',
          label:       'Mentorizar a otros',
          description: '+Carisma, +Reputación',
          effect:      '+0.3 Carisma, +10 Reputación',
          costLabel:   'Experiencia ≥ 5 años',
          locked:      career.experiencia < 5,
          lockReason:  `Experiencia: ${career.experiencia} años (necesitas 5)`,
          onActivate:  null,
        },
      ],
    },
  ];
}

// ─── Item component ───────────────────────────────────────────────────────────

function InitiativeItem({
  item,
  onDone,
}: {
  item: Initiative;
  onDone: (effect: string) => void;
}) {
  const canClick = !item.locked && item.onActivate !== null;

  const handleClick = () => {
    if (!canClick || !item.onActivate) return;
    item.onActivate();
    onDone(item.effect);
  };

  return (
    <button
      onClick={handleClick}
      disabled={item.locked || item.onActivate === null}
      title={item.locked ? item.lockReason : item.description}
      style={{
        width:         '100%',
        display:       'block',
        textAlign:     'left',
        padding:       '10px 10px',
        minHeight:     '44px',      // mobile touch target
        borderRadius:  '4px',
        background:    item.locked
          ? 'rgba(255,255,255,0.015)'
          : canClick
          ? 'rgba(201,168,76,0.04)'
          : 'rgba(201,168,76,0.02)',
        border:        `1px solid ${item.locked ? 'rgba(255,255,255,0.04)' : canClick ? 'rgba(201,168,76,0.14)' : 'rgba(201,168,76,0.07)'}`,
        marginBottom:  '4px',
        opacity:       item.locked ? 0.4 : 1,
        cursor:        canClick ? 'pointer' : item.locked ? 'not-allowed' : 'default',
        transition:    'background 0.15s ease, border-color 0.15s ease',
      }}
      onPointerEnter={e => {
        if (!canClick) return;
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.09)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.28)';
      }}
      onPointerLeave={e => {
        if (!canClick) return;
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.04)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.14)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <span style={{
          fontFamily:    '"Cinzel", serif',
          fontSize:      '8.5px',
          letterSpacing: '0.08em',
          color:         item.locked ? 'rgba(255,255,255,0.28)' : canClick ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.55)',
          lineHeight:    1.3,
        }}>
          {item.locked && <span style={{ marginRight: '4px' }}>⊘</span>}
          {!item.locked && item.onActivate !== null && <span style={{ marginRight: '4px', opacity: 0.6 }}>▶</span>}
          {item.label}
        </span>
        {item.costLabel && (
          <span style={{
            fontFamily: 'sans-serif',
            fontSize:   '7px',
            color:      item.locked ? 'rgba(255,255,255,0.18)' : 'rgba(201,168,76,0.38)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {item.costLabel}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: 'sans-serif',
        fontSize:   '7.5px',
        color:      item.locked ? 'rgba(255,255,255,0.16)' : 'rgba(201,168,76,0.42)',
        marginTop:  '3px',
        lineHeight: 1.4,
      }}>
        {item.locked && item.lockReason ? item.lockReason : item.description}
      </div>
    </button>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({
  category,
  open,
  onToggle,
  onItemDone,
}: {
  category:   Category;
  open:       boolean;
  onToggle:   () => void;
  onItemDone: (effect: string) => void;
}) {
  const unlockedCount = category.items.filter(i => !i.locked).length;

  return (
    <div style={{ marginBottom: '2px' }}>
      <button
        onClick={onToggle}
        style={{
          width:          '100%',
          minHeight:      '44px',    // mobile touch target
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 12px',
          background:     open ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
          border:         'none',
          borderLeft:     `2px solid ${open ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
          cursor:         'pointer',
          transition:     'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'rgba(201,168,76,0.6)', fontSize: '9px' }}>{category.icon}</span>
          <span style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      '7.5px',
            letterSpacing: '0.18em',
            color:         open ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.55)',
          }}>
            {category.label}
          </span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: '7px', color: 'rgba(201,168,76,0.35)' }}>
            {unlockedCount}/{category.items.length}
          </span>
          <span style={{
            color:      'rgba(201,168,76,0.4)',
            fontSize:   '9px',
            transform:  open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display:    'inline-block',
          }}>
            ›
          </span>
        </span>
      </button>

      {open && (
        <div style={{ padding: '4px 4px 2px 4px' }}>
          {category.items.map(item => (
            <InitiativeItem key={item.id} item={item} onDone={onItemDone} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  character:     Character;
  economy:       Economy;
  career:        Career;
  time:          Time;
  onUpdateStats: (deltas: Partial<CharacterStats>) => void;
}

export default function InitiativeMenu({ character, economy, career, time, onUpdateStats }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [openCats,  setOpenCats]  = useState<Set<string>>(new Set(['personal']));
  const [feedback,  setFeedback]  = useState<string | null>(null);
  const fbTimerRef = useState<ReturnType<typeof setTimeout> | null>(null)[0];

  // Store actions
  const updateCargaVital = useGameStore(s => s.updateCargaVital);
  const updateEconomy    = useGameStore(s => s.updateEconomy);
  const cambiarProfesion = useGameStore(s => s.cambiarProfesion);
  const updateCareer     = useGameStore(s => s.updateCareer);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2800);
  }, []);

  // ── Acciones reales ──────────────────────────────────────────────────────

  const buscarTrabajo = useCallback(() => {
    const suggestion = suggestProfession(character.stats);
    cambiarProfesion(suggestion.profesion, suggestion.nivel, suggestion.ingreso);
    updateEconomy({
      ingresosMensuales: economy.ingresosMensuales + suggestion.ingreso,
    });
    showFeedback(`Nuevo trabajo: ${suggestion.profesion} · ${suggestion.ingreso}€/mes`);
  }, [character.stats, cambiarProfesion, updateEconomy, economy.ingresosMensuales, showFeedback]);

  const irAlMedico = useCallback(() => {
    updateCargaVital(Math.max(0, time.cargaVital - 15));
    updateEconomy({ liquidez: economy.liquidez - 90 });
    showFeedback('Consulta médica realizada · −90€ · −15% carga vital');
  }, [updateCargaVital, updateEconomy, time.cargaVital, economy.liquidez, showFeedback]);

  const llamarAmigo = useCallback(() => {
    onUpdateStats({ emocional: 0.5, estabilidad: 0.2 });
    showFeedback('+0.5 Emocional · +0.2 Estabilidad');
  }, [onUpdateStats, showFeedback]);

  const meditacion = useCallback(() => {
    onUpdateStats({ estabilidad: 0.4 });
    updateCargaVital(Math.max(0, time.cargaVital - 8));
    showFeedback('+0.4 Estabilidad · −8% carga vital');
  }, [onUpdateStats, updateCargaVital, time.cargaVital, showFeedback]);

  const ejercicio = useCallback(() => {
    onUpdateStats({ fisico: 0.4 });
    updateCargaVital(Math.max(0, time.cargaVital - 10));
    showFeedback('+0.4 Físico · −10% carga vital');
  }, [onUpdateStats, updateCargaVital, time.cargaVital, showFeedback]);

  const networking = useCallback(() => {
    onUpdateStats({ carisma: 0.3 });
    updateCareer({ reputacion: Math.min(100, career.reputacion + 5) });
    showFeedback('+0.3 Carisma · +5 Reputación');
  }, [onUpdateStats, updateCareer, career.reputacion, showFeedback]);

  const diario = useCallback(() => {
    onUpdateStats({ emocional: 0.3, creatividad: 0.2 });
    showFeedback('+0.3 Emocional · +0.2 Creatividad');
  }, [onUpdateStats, showFeedback]);

  const chequeo = useCallback(() => {
    updateCargaVital(Math.max(0, time.cargaVital - 20));
    updateEconomy({ liquidez: economy.liquidez - 200 });
    showFeedback('Chequeo completo · −200€ · −20% carga vital');
  }, [updateCargaVital, updateEconomy, time.cargaVital, economy.liquidez, showFeedback]);

  void fbTimerRef; // suppress lint

  const actions = { buscarTrabajo, irAlMedico, llamarAmigo, meditacion, ejercicio, networking, diario, chequeo };
  const categories = buildCategories(character, economy, career, time, actions);

  const toggleCat = (id: string) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* ── Toggle button — 44×44 mobile touch target ── */}
      <button
        onClick={() => setPanelOpen(p => !p)}
        title="Iniciativas de vida"
        style={{
          position:       'fixed',
          bottom:         '46px',
          left:           '16px',
          zIndex:         10001,
          width:          '44px',
          height:         '44px',
          borderRadius:   '50%',
          border:         `1px solid ${panelOpen ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.22)'}`,
          background:     panelOpen ? 'rgba(20,16,10,0.94)' : 'rgba(13,11,8,0.72)',
          backdropFilter: 'blur(8px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
          transition:     'border-color 0.2s ease, background 0.2s ease',
          color:          panelOpen ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.5)',
          fontFamily:     '"Cinzel", serif',
          fontSize:       '14px',
        }}
      >
        ✦
      </button>

      {/* ── Side panel ── */}
      {panelOpen && (
        <div
          style={{
            position:       'fixed',
            bottom:         '98px',
            left:           '16px',
            zIndex:         10000,
            width:          'min(270px, calc(100vw - 32px))',
            maxHeight:      'calc(100vh - 140px)',
            overflowY:      'auto',
            overflowX:      'hidden',
            background:     'rgba(10,8,5,0.96)',
            backdropFilter: 'blur(14px)',
            border:         '1px solid rgba(201,168,76,0.14)',
            borderRadius:   '8px',
            paddingBottom:  '8px',
          }}
        >
          {/* Header */}
          <div style={{
            padding:      '10px 14px 8px',
            borderBottom: '1px solid rgba(201,168,76,0.09)',
            marginBottom: '2px',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '7.5px',
              letterSpacing: '0.28em',
              color:         'rgba(201,168,76,0.6)',
              textTransform: 'uppercase',
            }}>
              INICIATIVAS
            </span>
          </div>

          {/* Feedback toast */}
          {feedback && (
            <div style={{
              margin:        '0 8px 6px',
              padding:       '7px 10px',
              background:    'rgba(201,168,76,0.08)',
              border:        '1px solid rgba(201,168,76,0.2)',
              borderRadius:  '4px',
              fontFamily:    'sans-serif',
              fontSize:      '8px',
              color:         'rgba(201,168,76,0.85)',
              letterSpacing: '0.04em',
              lineHeight:    1.4,
            }}>
              ✓ {feedback}
            </div>
          )}

          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              open={openCats.has(cat.id)}
              onToggle={() => toggleCat(cat.id)}
              onItemDone={showFeedback}
            />
          ))}
        </div>
      )}
    </>
  );
}
