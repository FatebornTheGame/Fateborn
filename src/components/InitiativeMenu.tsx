import { useState } from 'react';
import type { Character } from '../types';
import type { Economy, Career, Time } from '../store/gameStore';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Initiative {
  id:          string;
  label:       string;
  description: string;
  costLabel?:  string;
  locked:      boolean;
  lockReason?: string;
  onActivate?: () => void;
}

interface Category {
  id:    string;
  label: string;
  icon:  string;
  items: Initiative[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCategories(
  character: Character,
  economy: Economy,
  career: Career,
  time: Time,
): Category[] {
  const stats = character.stats;

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
          costLabel:   '3h/semana',
          locked:      time.asignacionSemanal.ocio < 3,
          lockReason:  'Requiere 3h de ocio disponibles',
        },
        {
          id:          'diario',
          label:       'Llevar un diario',
          description: '+Emocional, +Creatividad',
          costLabel:   '1h/semana',
          locked:      false,
        },
        {
          id:          'terapia',
          label:       'Psicoterapia',
          description: '+Emocional, +Estabilidad',
          costLabel:   '180€/mes',
          locked:      economy.liquidez < 180,
          lockReason:  'Liquidez insuficiente',
        },
        {
          id:          'voluntariado',
          label:       'Voluntariado',
          description: '+Carisma, +Emocional',
          costLabel:   '4h/semana',
          locked:      time.asignacionSemanal.ocio < 4,
          lockReason:  'Requiere 4h de ocio disponibles',
        },
      ],
    },
    {
      id:    'carrera',
      label: 'CARRERA',
      icon:  '⬡',
      items: [
        {
          id:          'formacion_continua',
          label:       'Formación continua',
          description: '+Experiencia, +Lógica',
          costLabel:   '5h/semana',
          locked:      time.asignacionSemanal.formacion < 5,
          lockReason:  'Requiere 5h de formación',
        },
        {
          id:          'networking',
          label:       'Red de contactos',
          description: '+Carisma, +Reputación',
          costLabel:   '2h/semana',
          locked:      stats.carisma < 4,
          lockReason:  'Requiere Carisma ≥ 4',
        },
        {
          id:          'emprendimiento',
          label:       'Proyecto paralelo',
          description: '+Ambición, riesgo de −Estabilidad',
          costLabel:   '10h/semana + capital',
          locked:      stats.ambicion < 6 || economy.liquidez < 500,
          lockReason:  stats.ambicion < 6 ? 'Requiere Ambición ≥ 6' : 'Capital insuficiente (500€)',
        },
        {
          id:          'mentoria',
          label:       'Buscar mentor',
          description: '+Lógica, +Disciplina, +Reputación',
          costLabel:   'Conexiones requeridas',
          locked:      career.reputacion < 25,
          lockReason:  'Reputación insuficiente (≥ 25)',
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
          costLabel:   '3 meses de gastos',
          locked:      economy.liquidez < economy.gastosMensuales * 3,
          lockReason:  `Requiere ${(economy.gastosMensuales * 3).toLocaleString('es')}€`,
        },
        {
          id:          'inversion_indexada',
          label:       'Fondo indexado',
          description: 'Patrimonio crece pasivamente',
          costLabel:   '50€/mes mínimo',
          locked:      economy.ingresosMensuales - economy.gastosMensuales < 50,
          lockReason:  'Requiere margen mensual ≥ 50€',
        },
        {
          id:          'inmueble',
          label:       'Comprar inmueble',
          description: '+Patrimonio, +Ingreso pasivo',
          costLabel:   '20% entrada + hipoteca',
          locked:      economy.liquidez < 20000,
          lockReason:  'Requiere ≥ 20.000€ de liquidez',
        },
        {
          id:          'negocio_propio',
          label:       'Negocio propio',
          description: '+Ingresos potenciales, alto riesgo',
          costLabel:   '10.000€ + Ambición ≥ 7',
          locked:      stats.ambicion < 7 || economy.liquidez < 10000,
          lockReason:  stats.ambicion < 7 ? 'Requiere Ambición ≥ 7' : 'Capital insuficiente',
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
          costLabel:   '5h/semana',
          locked:      false,
        },
        {
          id:          'alimentacion',
          label:       'Dieta saludable',
          description: '+Físico, +Estabilidad',
          costLabel:   '+15% gasto alimentario',
          locked:      economy.ingresosMensuales < economy.gastosMensuales * 1.15,
          lockReason:  'Margen económico insuficiente',
        },
        {
          id:          'chequeo_medico',
          label:       'Chequeo anual',
          description: 'Detección temprana de riesgos',
          costLabel:   '90€/año',
          locked:      economy.liquidez < 90,
          lockReason:  'Liquidez insuficiente',
        },
        {
          id:          'deporte_extremo',
          label:       'Deporte de riesgo',
          description: '+Físico, +Riesgo, −Estabilidad',
          costLabel:   '8h/semana',
          locked:      stats.fisico < 5,
          lockReason:  'Requiere Físico ≥ 5',
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
          costLabel:   '4h/semana',
          locked:      false,
        },
        {
          id:          'liderazgo_comunidad',
          label:       'Liderazgo comunitario',
          description: '+Carisma, +Ambición, +Reputación',
          costLabel:   'Carisma ≥ 6',
          locked:      stats.carisma < 6,
          lockReason:  'Requiere Carisma ≥ 6',
        },
        {
          id:          'pareja',
          label:       'Buscar pareja estable',
          description: '+Emocional, efecto en Estabilidad',
          costLabel:   'Tiempo + Emocional ≥ 5',
          locked:      stats.emocional < 5,
          lockReason:  'Requiere Emocional ≥ 5',
        },
        {
          id:          'mentoring_inverso',
          label:       'Mentorizar a otros',
          description: '+Carisma, +Reputación',
          costLabel:   'Experiencia ≥ 5 años',
          locked:      career.experiencia < 5,
          lockReason:  'Requiere ≥ 5 años de experiencia',
        },
      ],
    },
  ];
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function InitiativeItem({ item }: { item: Initiative }) {
  return (
    <div
      title={item.locked ? item.lockReason : item.description}
      style={{
        padding:       '8px 10px',
        borderRadius:  '4px',
        background:    item.locked ? 'rgba(255,255,255,0.02)' : 'rgba(201,168,76,0.04)',
        border:        `1px solid ${item.locked ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.12)'}`,
        marginBottom:  '5px',
        opacity:       item.locked ? 0.45 : 1,
        cursor:        item.locked ? 'not-allowed' : 'default',
        transition:    'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <span style={{
          fontFamily:    '"Cinzel", serif',
          fontSize:      '8.5px',
          letterSpacing: '0.08em',
          color:         item.locked ? 'rgba(255,255,255,0.3)' : 'rgba(201,168,76,0.85)',
          lineHeight:    1.3,
        }}>
          {item.locked && <span style={{ marginRight: '4px', opacity: 0.6 }}>⊘</span>}
          {item.label}
        </span>
        {item.costLabel && (
          <span style={{
            fontFamily:  'sans-serif',
            fontSize:    '7px',
            color:       item.locked ? 'rgba(255,255,255,0.2)' : 'rgba(201,168,76,0.4)',
            whiteSpace:  'nowrap',
            flexShrink:  0,
          }}>
            {item.costLabel}
          </span>
        )}
      </div>
      <div style={{
        fontFamily:  'sans-serif',
        fontSize:    '7.5px',
        color:       item.locked ? 'rgba(255,255,255,0.18)' : 'rgba(201,168,76,0.45)',
        marginTop:   '3px',
        lineHeight:  1.4,
      }}>
        {item.locked && item.lockReason ? item.lockReason : item.description}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  open,
  onToggle,
}: {
  category: Category;
  open: boolean;
  onToggle: () => void;
}) {
  const unlockedCount = category.items.filter(i => !i.locked).length;

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width:         '100%',
          display:       'flex',
          alignItems:    'center',
          justifyContent: 'space-between',
          padding:       '6px 10px',
          background:    open ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
          border:        'none',
          borderLeft:    `2px solid ${open ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
          cursor:        'pointer',
          transition:    'background 0.2s ease, border-color 0.2s ease',
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
          <span style={{
            fontFamily: 'sans-serif',
            fontSize:   '7px',
            color:      'rgba(201,168,76,0.35)',
          }}>
            {unlockedCount}/{category.items.length}
          </span>
          <span style={{
            color:     'rgba(201,168,76,0.4)',
            fontSize:  '8px',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display:   'inline-block',
          }}>
            ›
          </span>
        </span>
      </button>

      {/* Items */}
      {open && (
        <div style={{ padding: '6px 4px 2px 4px' }}>
          {category.items.map(item => (
            <InitiativeItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  character: Character;
  economy:   Economy;
  career:    Career;
  time:      Time;
}

export default function InitiativeMenu({ character, economy, career, time }: Props) {
  const [panelOpen, setPanelOpen]    = useState(false);
  const [openCats,  setOpenCats]     = useState<Set<string>>(new Set(['personal']));

  const categories = buildCategories(character, economy, career, time);

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
      {/* ── Toggle button ── */}
      <button
        onClick={() => setPanelOpen(p => !p)}
        title="Iniciativas de vida"
        style={{
          position:       'fixed',
          bottom:         '52px',
          left:           '16px',
          zIndex:         10001,
          width:          '36px',
          height:         '36px',
          borderRadius:   '50%',
          border:         `1px solid ${panelOpen ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
          background:     panelOpen ? 'rgba(20,16,10,0.92)' : 'rgba(13,11,8,0.72)',
          backdropFilter: 'blur(8px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
          transition:     'border-color 0.2s ease, background 0.2s ease',
          color:          panelOpen ? 'rgba(201,168,76,0.85)' : 'rgba(201,168,76,0.5)',
          fontFamily:     '"Cinzel", serif',
          fontSize:       '13px',
        }}
      >
        ✦
      </button>

      {/* ── Side panel ── */}
      {panelOpen && (
        <div
          style={{
            position:       'fixed',
            bottom:         '96px',
            left:           '16px',
            zIndex:         10000,
            width:          '220px',
            maxHeight:      'calc(100vh - 130px)',
            overflowY:      'auto',
            background:     'rgba(10,8,5,0.94)',
            backdropFilter: 'blur(12px)',
            border:         '1px solid rgba(201,168,76,0.15)',
            borderRadius:   '6px',
            paddingBottom:  '6px',
          }}
        >
          {/* Panel header */}
          <div style={{
            padding:       '10px 12px 8px',
            borderBottom:  '1px solid rgba(201,168,76,0.1)',
            marginBottom:  '4px',
          }}>
            <span style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '8px',
              letterSpacing: '0.28em',
              color:         'rgba(201,168,76,0.6)',
              textTransform: 'uppercase',
            }}>
              INICIATIVAS
            </span>
          </div>

          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              open={openCats.has(cat.id)}
              onToggle={() => toggleCat(cat.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
