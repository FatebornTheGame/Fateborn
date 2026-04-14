import { useTranslation }          from 'react-i18next'
import type { Stats }              from '../types/game.types'
import type { StatFlash }          from '../store/gameStore'
import { colors, fonts, zIndex }   from '../styles/tokens'

interface Props {
  stats:           Stats
  lastStatChanges: Partial<Record<keyof Stats, StatFlash>>
  onClose:         () => void
}

const GROUP_KEYS: { tKey: string; keys: (keyof Stats)[] }[] = [
  { tKey: 'game.statsPanel.groups.cognitivo', keys: ['logica', 'creatividad', 'disciplina'] },
  { tKey: 'game.statsPanel.groups.social',    keys: ['carisma', 'emocional', 'ambicion'] },
  { tKey: 'game.statsPanel.groups.vital',     keys: ['fisico', 'riesgo', 'estabilidad'] },
]

function StatRow({
  label,
  value,
  flash,
}: {
  label:   string
  value:   number
  flash:   StatFlash | undefined
}) {
  const barColor  = value >= 7 ? '#4ade80' : value >= 4 ? colors.gold : colors.crimson
  const flashClass = flash === 'pos' ? 'stat-flash-pos' : flash === 'neg' ? 'stat-flash-neg' : ''

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs opacity-60"
        style={{ width: 80, fontFamily: 'system-ui, sans-serif' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[3px] rounded-full"
        style={{ background: `${colors.gold}18` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / 10) * 100}%`, background: barColor, opacity: 0.8 }}
        />
      </div>
      <span
        className={`text-xs font-bold w-8 text-right font-cinzel ${flashClass}`}
        style={{ color: colors.gold }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  )
}

export function StatsPanel({ stats, lastStatChanges, onClose }: Props) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed bottom-14 left-2 z-50 animate-fade-in"
      style={{
        background:     `${colors.bg.primary}f0`,
        border:         `1px solid ${colors.gold}33`,
        padding:        '1rem',
        width:          260,
        backdropFilter: 'blur(4px)',
        zIndex:         zIndex.overlay,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ borderBottom: `1px solid ${colors.gold}22`, paddingBottom: 8 }}
      >
        <span className="font-cinzel text-xs uppercase tracking-widest" style={{ color: colors.gold, opacity: 0.6 }}>
          {t('game.statsPanel.title')}
        </span>
        <button
          onClick={onClose}
          className="text-xs opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: colors.gold }}
        >
          ✕
        </button>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {GROUP_KEYS.map(group => (
          <div key={group.tKey}>
            <p
              className="text-[10px] uppercase tracking-widest mb-1.5"
              style={{ fontFamily: fonts.display, color: colors.gold, opacity: 0.35 }}
            >
              {t(group.tKey)}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.keys.map(key => (
                <StatRow
                  key={key}
                  label={t(`statLabels.${key}`)}
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
