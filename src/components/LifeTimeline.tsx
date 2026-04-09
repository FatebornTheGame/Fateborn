import { useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const GOLD   = '#c9a84c';
const GARNET = '#8b1a2a';

export default function LifeTimeline() {
  const timeline  = useGameStore(s => s.timeline);
  const time      = useGameStore(s => s.time);
  const character = useGameStore(s => s.character);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentYear = character ? character.birthYear + time.añoActual : time.añoActual;
  const startYear   = character ? character.birthYear + 18 : currentYear;
  const endYear     = startYear + 70;
  const totalYears  = endYear - startYear;
  const pctNow      = Math.min(1, Math.max(0, (currentYear - startYear) / totalYears));

  const SVG_W   = Math.max(600, timeline.length * 80 + 200);
  const SVG_H   = 60;
  const LINE_Y  = 30;
  const LINE_X1 = 20;
  const LINE_X2 = SVG_W - 20;
  const LINE_LEN = LINE_X2 - LINE_X1;

  const now_x = LINE_X1 + pctNow * LINE_LEN;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      borderTop: '1px solid rgba(201,168,76,0.1)',
      padding: '8px 0 4px',
    }}>
      <div style={{
        fontSize: '7px', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.3)', fontFamily: 'sans-serif',
        padding: '0 16px', marginBottom: '4px',
      }}>
        Línea vital
      </div>

      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', cursor: 'grab',
        }}
      >
        <svg width={SVG_W} height={SVG_H} style={{ display: 'block', minWidth: '100%' }}>
          {/* Background line */}
          <line x1={LINE_X1} y1={LINE_Y} x2={LINE_X2} y2={LINE_Y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

          {/* Progress line */}
          <line x1={LINE_X1} y1={LINE_Y} x2={now_x} y2={LINE_Y}
            stroke={`${GOLD}55`} strokeWidth="2" />

          {/* Year labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(pct => {
            const x  = LINE_X1 + pct * LINE_LEN;
            const yr = Math.round(startYear + pct * totalYears);
            return (
              <g key={pct}>
                <line x1={x} y1={LINE_Y - 4} x2={x} y2={LINE_Y + 4}
                  stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                <text x={x} y={LINE_Y + 15} textAnchor="middle"
                  style={{ fontSize: '7px', fill: 'rgba(201,168,76,0.28)', fontFamily: 'sans-serif' }}>
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Timeline events */}
          {timeline.map(evt => {
            const evtPct = Math.min(1, Math.max(0, (evt.año - startYear) / totalYears));
            const x = LINE_X1 + evtPct * LINE_LEN;
            const color = evt.type === 'logro' ? GOLD : evt.type === 'perdida' ? GARNET : 'rgba(126,184,247,0.8)';
            return (
              <g key={evt.id}>
                <polygon
                  points={`${x},${LINE_Y - 7} ${x + 5},${LINE_Y} ${x},${LINE_Y + 7} ${x - 5},${LINE_Y}`}
                  fill={color} opacity="0.85"
                />
                <text x={x} y={LINE_Y - 12} textAnchor="middle"
                  style={{ fontSize: '7px', fill: color, fontFamily: 'sans-serif' }}>
                  {evt.label.slice(0, 12)}
                </text>
              </g>
            );
          })}

          {/* Current position diamond */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polygon
            points={`${now_x},${LINE_Y - 8} ${now_x + 6},${LINE_Y} ${now_x},${LINE_Y + 8} ${now_x - 6},${LINE_Y}`}
            fill={GOLD}
            filter="url(#glow)"
          />
        </svg>
      </div>
    </div>
  );
}
