import { useGameStore } from '../store/gameStore';

/**
 * "El precio de la victoria" — contador 0-100 visible cuando el arco SG está activo.
 * Se posiciona debajo del BreakingBadHUD si ambos están activos, o en su lugar si solo
 * está el arco SG.
 */
export default function SaulGoodmanHUD() {
  const sgState  = useGameStore(s => s.health.sgState);
  const bbActive = useGameStore(s => s.health.bbState.active);

  if (!sgState.active) return null;

  const pct = sgState.precioVictoria;

  // Color: dorado → cobre → granate oscuro conforme sube el precio
  const color =
    pct < 35  ? '#C9A84C' :
    pct < 65  ? '#b8892a' :
                '#7d2033';

  // Si BB también está activo, apilamos debajo de él (BB ocupa top:108px + ~56px)
  const topOffset = bbActive ? '172px' : '108px';

  return (
    <div
      title={`El precio de la victoria: ${pct}/100`}
      style={{
        position:       'fixed',
        top:            topOffset,
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
        EL PRECIO
      </span>

      {/* Vertical bar track */}
      <div style={{
        width:        '4px',
        height:       '36px',
        background:   'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        overflow:     'hidden',
        position:     'relative',
        transform:    'rotate(180deg)',
      }}>
        <div style={{
          position:     'absolute',
          bottom:       0,
          left:         0,
          width:        '100%',
          height:       `${pct}%`,
          background:   color,
          borderRadius: '2px',
          transition:   'height 0.8s ease, background 0.5s ease',
          filter:       `drop-shadow(0 0 3px ${color})`,
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
