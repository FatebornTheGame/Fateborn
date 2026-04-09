import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

const GOLD   = '#c9a84c';
const GARNET = '#8b1a2a';

function VitalArc({ value }: { value: number }) {
  const r    = 18;
  const cx   = 22;
  const cy   = 22;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(100, Math.max(0, value)) / 100;
  const dash = pct * circ;
  const color = value <= 40 ? '#6ee7a0' : value <= 70 ? '#facc15' : '#f87171';

  return (
    <svg width="44" height="44" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.4s ease' }}
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: '9px', fill: color, fontFamily: 'sans-serif', fontWeight: 700 }}>
        {value}%
      </text>
    </svg>
  );
}

export default function StatusBar() {
  const character = useGameStore(s => s.character);
  const economy   = useGameStore(s => s.economy);
  const career    = useGameStore(s => s.career);
  const time      = useGameStore(s => s.time);
  const country   = useGameStore(s => s.country);
  const legacy    = useGameStore(s => s.legacy);

  const patrimonioNeto = useMemo(() =>
    economy.patrimonioBruto + economy.liquidez - economy.deudaTotal
  , [economy]);

  const año = character ? character.birthYear + time.añoActual : time.añoActual;
  const age = time.narrativeAge || time.añoActual;

  if (!character) return null;

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M€`
    : n >= 1_000   ? `${(n / 1_000).toFixed(0)}K€`
    : `${n}€`;

  const nivelLabel: Record<string, string> = {
    junior:       'Jr',
    mid:          'Mid',
    senior:       'Sr',
    director:     'Dir',
    ejecutivo:    'Ejec',
    independiente: 'Ind',
  };

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(13,11,8,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      minHeight: '56px',
    }}>
      {/* Name + age + country */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: '1 1 auto' }}>
        <div className="cinzel" style={{
          fontSize: '13px', fontWeight: 700,
          color: GOLD, letterSpacing: '0.08em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {character.name}
        </div>
        <div style={{
          fontSize: '10px', color: 'rgba(201,168,76,0.5)',
          letterSpacing: '0.06em', fontFamily: 'sans-serif',
        }}>
          {age} años · {country.nombre} · {año}
        </div>
      </div>

      {/* Carga vital arc */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <VitalArc value={time.cargaVital} />
        <span style={{ fontSize: '7px', color: 'rgba(201,168,76,0.35)', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>CARGA</span>
      </div>

      {/* Patrimonio */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '64px' }}>
        <div className="cinzel" style={{
          fontSize: '14px', fontWeight: 700,
          color: patrimonioNeto >= 0 ? '#6ee7a0' : GARNET,
        }}>
          {fmt(patrimonioNeto)}
        </div>
        <span style={{ fontSize: '7px', color: 'rgba(201,168,76,0.35)', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>PATRIMONIO</span>
      </div>

      {/* Profesión */}
      {career.profesion && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '64px' }}>
          <div style={{
            fontSize: '10px', color: 'rgba(201,168,76,0.75)', fontFamily: 'sans-serif',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px',
            textAlign: 'center',
          }}>
            {career.profesion}
          </div>
          <span style={{
            fontSize: '7px', padding: '1px 5px', borderRadius: '3px',
            background: 'rgba(201,168,76,0.12)', color: GOLD,
            letterSpacing: '0.08em', fontFamily: 'sans-serif',
          }}>
            {nivelLabel[career.nivel] ?? career.nivel}
          </span>
        </div>
      )}

      {/* Legado */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span className="cinzel" style={{ fontSize: '14px', fontWeight: 700, color: GOLD }}>{legacy}</span>
          <span style={{ fontSize: '8px', color: 'rgba(201,168,76,0.4)', fontFamily: 'sans-serif' }}>/100</span>
        </div>
        <span style={{ fontSize: '7px', color: 'rgba(201,168,76,0.35)', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>LEGADO</span>
      </div>
    </div>
  );
}
