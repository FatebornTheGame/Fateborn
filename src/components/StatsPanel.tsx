import type { Stats } from '../types/game.types'
import type { StatFlash } from '../store/gameStore'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  stats:           Stats
  lastStatChanges: Partial<Record<keyof Stats, StatFlash>>
  onClose:         () => void
}

const GROUPS: { label: string; keys: (keyof Stats)[] }[] = [
  { label: 'Cognitivo', keys: ['logica', 'creatividad', 'disciplina'] },
  { label: 'Social',    keys: ['carisma', 'emocional', 'ambicion'] },
  { label: 'Vital',     keys: ['fisico', 'riesgo', 'estabilidad'] },
]

const STAT_LABELS: Record<keyof Stats, string> = {
  logica:       'Lógica',
  creatividad:  'Creatividad',
  disciplina:   'Disciplina',
  carisma:      'Carisma',
  emocional:    'Emocional',
  ambicion:     'Ambición',
  fisico:       'Físico',
  riesgo:       'Riesgo',
  estabilidad:  'Estabilidad',
}

function StatRow({
  statKey,
  value,
  flash,
}: {
  statKey: keyof Stats
  value:   number
  flash:   StatFlash | undefined
}) {
  const barColor = value >= 7 ? '#4ade80' : value >= 4 ? COLOR_GOLD : COLOR_GARNET
  const flashClass = flash === 'pos' ? 'stat-flash-pos' : flash === 'neg' ? 'stat-flash-neg' : ''

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs opacity-60"
        style={{ width: 80, fontFamily: 'system-ui, sans-serif' }}
      >
        {STAT_LABELS[statKey]}
      </span>
      <div
        className="flex-1 h-[3px] rounded-full"
        style={{ background: `${COLOR_GOLD}18` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / 10) * 100}%`, background: barColor, opacity: 0.8 }}
        />
      </div>
      <span
        className={`text-xs font-bold w-8 text-right font-cinzel ${flashClass}`}
        style={{ color: COLOR_GOLD }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  )
}

export function StatsPanel({ stats, lastStatChanges, onClose }: Props) {
  return (
    <div
      className="fixed bottom-14 left-2 z-50 animate-fade-in"
      style={{
        background:   '#0d0b08f0',
        border:       `1px solid ${COLOR_GOLD}33`,
        padding:      '1rem',
        width:        260,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ borderBottom: `1px solid ${COLOR_GOLD}22`, paddingBottom: 8 }}
      >
        <span className="font-cinzel text-xs uppercase tracking-widest" style={{ color: COLOR_GOLD, opacity: 0.6 }}>
          Atributos
        </span>
        <button
          onClick={onClose}
          className="text-xs opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: COLOR_GOLD }}
        >
          ✕
        </button>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {GROUPS.map(group => (
          <div key={group.label}>
            <p
              className="text-[10px] uppercase tracking-widest mb-1.5"
              style={{ color: COLOR_GOLD, opacity: 0.35 }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.keys.map(key => (
                <StatRow
                  key={key}
                  statKey={key}
                  value={stats[key]}
                  flash={lastStatChanges[key]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
