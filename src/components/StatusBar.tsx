import type { Character, Stats, Economy } from '../types/game.types'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  character:   Character
  stats:       Stats
  economy:     Economy
  ageYears:    number
  legacyScore: number
  vitalLoad:   number
}

// SVG arc helper: draws a partial circle arc
function arcPath(cx: number, cy: number, r: number, pct: number): string {
  const angle = pct * 2 * Math.PI - Math.PI / 2
  const x     = cx + r * Math.cos(angle)
  const y     = cy + r * Math.sin(angle)
  const large = pct > 0.5 ? 1 : 0
  const start = { x: cx, y: cy - r }
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${x.toFixed(2)} ${y.toFixed(2)}`
}

export function StatusBar({ character, stats: _stats, economy, ageYears, legacyScore, vitalLoad }: Props) {
  const currentYear = character.birthYear + ageYears
  const vitalPct    = Math.max(0, Math.min(1, vitalLoad / 100))

  // Vital load color: green when low, red when high
  const vitalColor = vitalLoad < 40
    ? '#4ade80'
    : vitalLoad < 70
      ? COLOR_GOLD
      : COLOR_GARNET

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-4"
      style={{ height: 56, background: '#0d0b08ee', borderBottom: `1px solid ${COLOR_GOLD}22` }}
    >
      {/* Name + location */}
      <div className="flex flex-col leading-none min-w-0">
        <span className="font-cinzel text-gold text-sm font-semibold truncate">
          {character.name}
        </span>
        <span className="text-xs opacity-50 truncate">
          {character.country} · {currentYear}
        </span>
      </div>

      {/* Age badge */}
      <div
        className="flex-shrink-0 flex flex-col items-center leading-none px-3 py-1"
        style={{ border: `1px solid ${COLOR_GOLD}33` }}
      >
        <span className="font-cinzel text-gold text-lg font-bold leading-none">{ageYears}</span>
        <span className="text-xs opacity-40 leading-none">años</span>
      </div>

      {/* Vital load arc */}
      <div className="flex-shrink-0 relative" style={{ width: 40, height: 40 }}>
        <svg width={40} height={40} viewBox="0 0 40 40">
          {/* Track */}
          <circle cx={20} cy={20} r={16} fill="none" stroke={COLOR_GOLD} strokeOpacity={0.1} strokeWidth={3} />
          {/* Arc */}
          {vitalPct > 0 && (
            <path
              d={arcPath(20, 20, 16, vitalPct)}
              fill="none"
              stroke={vitalColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
          style={{ color: vitalColor }}
        >
          {vitalLoad}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Economy */}
      <div className="hidden sm:flex flex-col items-end leading-none">
        <span className="text-xs opacity-50">patrimonio</span>
        <span className="font-cinzel text-gold text-sm">
          {economy.liquidez >= 1000
            ? `${(economy.liquidez / 1000).toFixed(0)}k`
            : economy.liquidez.toFixed(0)}
        </span>
      </div>

      {/* Legacy score */}
      <div
        className="flex-shrink-0 flex flex-col items-center leading-none px-3 py-1"
        style={{ border: `1px solid ${COLOR_GOLD}33` }}
      >
        <span className="font-cinzel text-gold text-sm font-bold leading-none">{legacyScore}</span>
        <span className="text-xs opacity-40 leading-none">legado</span>
      </div>
    </header>
  )
}
