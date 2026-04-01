import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import type { CharacterStats } from '../types';

const GOLD   = '#c9a84c';
const GARNET = '#8b1a2a';

const STAT_LABELS: { key: keyof CharacterStats; label: string; group: string }[] = [
  { key: 'logica',       label: 'Lógica',       group: 'Cognitivo' },
  { key: 'creatividad',  label: 'Creatividad',  group: 'Cognitivo' },
  { key: 'disciplina',   label: 'Disciplina',   group: 'Cognitivo' },
  { key: 'carisma',      label: 'Carisma',      group: 'Social'    },
  { key: 'emocional',    label: 'Emocional',    group: 'Social'    },
  { key: 'ambicion',     label: 'Ambición',     group: 'Social'    },
  { key: 'fisico',       label: 'Físico',       group: 'Vital'     },
  { key: 'riesgo',       label: 'Riesgo',       group: 'Vital'     },
  { key: 'estabilidad',  label: 'Estabilidad',  group: 'Vital'     },
];

interface Props {
  stats: CharacterStats;
  /** key → 'pos' | 'neg' — stats que deben flashear ahora */
  flashMap: Record<string, 'pos' | 'neg'>;
  name: string;
}

export default function StatsPanel({ stats, flashMap, name }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Toggle button — fixed bottom-left ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title={open ? 'Cerrar perfil' : 'Ver perfil'}
        style={{
          position:       'fixed',
          bottom:         '44px',
          left:           '16px',
          zIndex:         9999,
          width:          '36px',
          height:         '36px',
          borderRadius:   '50%',
          border:         `1px solid ${open ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)'}`,
          background:     open ? 'rgba(201,168,76,0.12)' : 'rgba(13,11,8,0.72)',
          backdropFilter: 'blur(8px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
          transition:     'all 0.2s ease',
          color:          open ? GOLD : 'rgba(201,168,76,0.45)',
          fontFamily:     '"Cinzel", serif',
          fontSize:       '13px',
          fontWeight:     700,
          letterSpacing:  '0.02em',
        }}
      >
        Σ
      </button>

      {/* ── Panel overlay ── */}
      {open && (
        <div
          style={{
            position:        'fixed',
            bottom:          '88px',
            left:            isMobile ? '8px' : '16px',
            right:           isMobile ? '8px' : 'auto',
            zIndex:          9999,
            background:      'rgba(10,8,6,0.94)',
            border:          '1px solid rgba(201,168,76,0.2)',
            borderRadius:    '10px',
            padding:         '18px 20px',
            backdropFilter:  'blur(12px)',
            minWidth:        isMobile ? 'unset' : '220px',
            boxShadow:       '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      '9px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.4)',
            marginBottom:  '14px',
            textAlign:     'center',
          }}>
            {name}
          </div>

          {/* Stats por grupo */}
          {(['Cognitivo', 'Social', 'Vital'] as const).map(group => (
            <div key={group} style={{ marginBottom: '12px' }}>
              <div style={{
                fontFamily:    '"Cinzel", serif',
                fontSize:      '8px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'rgba(201,168,76,0.25)',
                marginBottom:  '6px',
              }}>
                {group}
              </div>
              {STAT_LABELS.filter(s => s.group === group).map(({ key, label }) => {
                const val = stats[key];
                const flash = flashMap[key];
                return (
                  <div key={key} style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '8px',
                    marginBottom:   '4px',
                  }}>
                    {/* Label */}
                    <span style={{
                      fontFamily:    'sans-serif',
                      fontSize:      '10px',
                      color:         'rgba(201,168,76,0.35)',
                      width:         '76px',
                      flexShrink:    0,
                    }}>
                      {label}
                    </span>

                    {/* Bar */}
                    <div style={{
                      flex:           1,
                      height:         '3px',
                      background:     'rgba(255,255,255,0.05)',
                      borderRadius:   '99px',
                      overflow:       'hidden',
                    }}>
                      <div style={{
                        width:        `${val * 10}%`,
                        height:       '100%',
                        background:   flash === 'neg'
                          ? `linear-gradient(90deg, ${GARNET}80, ${GARNET})`
                          : `linear-gradient(90deg, ${GOLD}60, ${GOLD})`,
                        borderRadius: '99px',
                        transition:   'width 0.5s ease, background 0.3s ease',
                      }} />
                    </div>

                    {/* Value */}
                    <span
                      key={`${key}-${flash}`}           // key change triggers re-mount → re-animation
                      className={flash ? `stat-flash-${flash}` : undefined}
                      style={{
                        fontFamily:  '"Cinzel", serif',
                        fontSize:    '11px',
                        fontWeight:  700,
                        width:       '28px',
                        textAlign:   'right',
                        flexShrink:  0,
                        color:       'rgba(201,168,76,0.45)',
                        transition:  flash ? 'none' : 'color 0.3s ease',
                      }}
                    >
                      {val.toFixed(1)}
                    </span>

                    {/* Delta badge */}
                    {flash && (
                      <span style={{
                        fontFamily:  'sans-serif',
                        fontSize:    '9px',
                        fontWeight:  700,
                        color:       flash === 'pos' ? GOLD : '#c06070',
                        width:       '18px',
                        flexShrink:  0,
                        textAlign:   'left',
                      }}>
                        {flash === 'pos' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
