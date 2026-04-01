import { useGameStore } from '../store/gameStore';

/**
 * "La línea que cruzaste" — contador 0-100 visible cuando el arco BB está activo.
 * Posición: esquina superior derecha, debajo del VitalLoadIndicator.
 * No interrumpe el juego.
 */
export default function BreakingBadHUD() {
  const bbState = useGameStore(s => s.health.bbState);

  if (!bbState.active) return null;

  const pct = bbState.lineaCruzada;

  // Color: gold → amber → garnet conforme aumenta
  const color =
    pct < 35  ? '#C9A84C' :
    pct < 65  ? '#c47a3a' :
                '#8B1A2A';

  const barWidth = `${pct}%`;

  return (
    <div
      title={`La línea que cruzaste: ${pct}/100`}
      style={{
        position:       'fixed',
        top:            '108px',       // debajo del VitalLoadIndicator (64px + ~44px)
        right:          '12px',
        zIndex:         10001,
        width:          '44px',
        pointerEvents:  'none',
        userSelect:     'none',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '3px',
      }}
    >
      {/* Label */}
      <span style={{
        fontFamily:    '"Cinzel", serif',
        fontSize:      '5.5px',
        letterSpacing: '0.1em',
        color:         color,
        opacity:       0.65,
        textAlign:     'center',
        lineHeight:    1.2,
        textTransform: 'uppercase',
      }}>
        LA LÍNEA
      </span>

      {/* Vertical bar track */}
      <div style={{
        width:        '4px',
        height:       '36px',
        background:   'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        overflow:     'hidden',
        position:     'relative',
        transform:    'rotate(180deg)',   // fill from bottom
      }}>
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          width:      '100%',
          height:     barWidth,
          background: color,
          borderRadius: '2px',
          transition: 'height 0.8s ease, background 0.5s ease',
          filter:     `drop-shadow(0 0 3px ${color})`,
        }} />
      </div>

      {/* Numeric value */}
      <span style={{
        fontFamily:    '"Cinzel", serif',
        fontSize:      '7px',
        letterSpacing: '0.04em',
        color:         color,
        opacity:       0.75,
      }}>
        {pct}
      </span>
    </div>
  );
}
