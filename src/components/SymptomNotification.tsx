import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { DiseaseCategory } from '../systems/diseaseSystem';

const DISPLAY_MS  = 5000;
const FADE_OUT_MS = 600;

// ── Category accent colors ────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<DiseaseCategory, string> = {
  acute:    '#d4a84c',  // amber — temporal, manejable
  chronic:  '#c47a3a',  // naranja apagado — permanente
  terminal: '#8B1A2A',  // granate — punto de inflexión
};

const CATEGORY_LABEL: Record<DiseaseCategory, string> = {
  acute:    'SÍNTOMA AGUDO',
  chronic:  'DIAGNÓSTICO CRÓNICO',
  terminal: 'DIAGNÓSTICO TERMINAL',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function SymptomNotification() {
  const { health, shiftSymptom } = useGameStore(s => ({
    health:       s.health,
    shiftSymptom: s.shiftSymptom,
  }));

  const [visible, setVisible]   = useState(false);
  const [fading,  setFading]    = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = health.symptomQueue[0] ?? null;

  const dismiss = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (fadeRef.current)  { clearTimeout(fadeRef.current);  fadeRef.current  = null; }
    setFading(true);
    fadeRef.current = setTimeout(() => {
      setVisible(false);
      setFading(false);
      shiftSymptom();
    }, FADE_OUT_MS);
  };

  useEffect(() => {
    if (!current) { setVisible(false); return; }
    setVisible(true);
    setFading(false);
    timerRef.current = setTimeout(dismiss, DISPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeRef.current)  clearTimeout(fadeRef.current);
    };
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current || !visible) return null;

  const color = CATEGORY_COLOR[current.category];
  const isTerminal = current.category === 'terminal';

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position:       'fixed',
        bottom:         '32px',
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         10002,
        width:          'min(360px, calc(100vw - 32px))',
        minWidth:       '280px',

        background:     'rgba(10,8,5,0.93)',
        backdropFilter: 'blur(14px)',
        border:         `1px solid ${color}44`,
        borderLeft:     `3px solid ${color}`,
        borderRadius:   '6px',
        padding:        '0',

        opacity:        fading ? 0 : 1,
        transition:     `opacity ${FADE_OUT_MS}ms ease`,

        // Subtle slide-in on mount
        animation:      fading ? undefined : 'symptom-slide-in 0.35s ease',

        boxShadow:      isTerminal
          ? `0 0 24px ${color}33, 0 4px 20px rgba(0,0,0,0.7)`
          : `0 4px 16px rgba(0,0,0,0.55)`,
      }}
    >
      {/* Inner layout */}
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '44px' }}>

        {/* Text block */}
        <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      '7px',
            letterSpacing: '0.22em',
            color:         color,
            opacity:       0.75,
            textTransform: 'uppercase',
          }}>
            {CATEGORY_LABEL[current.category]}
          </span>
          <span style={{
            fontFamily:  'sans-serif',
            fontSize:    '12px',
            lineHeight:  1.45,
            color:       'rgba(255,255,255,0.75)',
          }}>
            {current.text}
          </span>
          {isTerminal && (
            <span style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '8px',
              letterSpacing: '0.1em',
              color:         color,
              marginTop:     '2px',
              opacity:       0.9,
            }}>
              {current.disease}
            </span>
          )}
        </div>

        {/* Dismiss button — 44×44 minimum touch target */}
        <button
          onClick={dismiss}
          aria-label="Cerrar notificación"
          style={{
            flexShrink:     0,
            width:          '44px',
            minHeight:      '44px',
            background:     'transparent',
            border:         'none',
            borderLeft:     `1px solid ${color}22`,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          'rgba(255,255,255,0.3)',
            fontSize:       '14px',
            transition:     'color 0.15s ease, background 0.15s ease',
          }}
          onPointerEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color      = 'rgba(255,255,255,0.7)';
            (e.currentTarget as HTMLButtonElement).style.background = `${color}14`;
          }}
          onPointerLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color      = 'rgba(255,255,255,0.3)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
