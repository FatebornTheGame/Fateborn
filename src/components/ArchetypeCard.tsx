import type { Archetype } from '../types/archetype.types'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  archetype:            Archetype
  selectedAs:           'grandfather' | 'grandmother' | null
  selectionCount:       number
  onSelectAsGrandfather: () => void
  onSelectAsGrandmother: () => void
}

const STAT_KEYS = ['logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad'] as const
const STAT_SHORT: Record<string, string> = {
  logica: 'LÓG', creatividad: 'CRE', disciplina: 'DIS',
  carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
  fisico: 'FÍS', riesgo: 'RIE', estabilidad: 'EST',
}

export function ArchetypeCard({
  archetype,
  selectedAs,
  selectionCount,
  onSelectAsGrandfather,
  onSelectAsGrandmother,
}: Props) {
  const isSelected = selectedAs !== null

  const topStats = STAT_KEYS
    .map(k => ({ key: k, value: archetype.stats[k] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

  return (
    <div
      className="flex flex-col p-3 transition-all cursor-default"
      style={{
        border:     `1px solid ${isSelected ? (selectedAs === 'grandfather' ? COLOR_GOLD + 'cc' : COLOR_GARNET + 'cc') : COLOR_GOLD + '33'}`,
        background: isSelected ? `${selectedAs === 'grandfather' ? COLOR_GOLD : COLOR_GARNET}09` : 'transparent',
        minWidth:   160,
      }}
    >
      {/* Name + lore */}
      <div className="mb-2">
        <span className="font-cinzel text-sm font-semibold block" style={{ color: COLOR_GOLD }}>
          {archetype.name}
        </span>
        <span className="text-[11px] opacity-40 block leading-snug mt-0.5">
          {archetype.lore}
        </span>
      </div>

      {/* Top 3 stats */}
      <div className="flex gap-2 mb-3">
        {topStats.map(({ key, value }) => (
          <div key={key} className="flex flex-col items-center leading-none">
            <span className="text-[9px] opacity-40 uppercase">{STAT_SHORT[key]}</span>
            <span className="text-xs font-bold" style={{ color: COLOR_GOLD }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="text-[10px] font-cinzel uppercase tracking-widest mb-2 text-center py-0.5"
          style={{
            background: selectedAs === 'grandfather' ? `${COLOR_GOLD}22` : `${COLOR_GARNET}22`,
            color:      selectedAs === 'grandfather' ? COLOR_GOLD : COLOR_GARNET,
          }}
        >
          {selectedAs === 'grandfather' ? 'Abuelo' : 'Abuela'}
        </div>
      )}

      {/* Action buttons */}
      {!isSelected && selectionCount < 4 && (
        <div className="flex gap-1 mt-auto">
          <button
            onClick={onSelectAsGrandfather}
            className="flex-1 py-1 text-[10px] font-cinzel uppercase tracking-widest transition-colors"
            style={{ border: `1px solid ${COLOR_GOLD}55`, color: COLOR_GOLD, background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}22` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Abuelo
          </button>
          <button
            onClick={onSelectAsGrandmother}
            className="flex-1 py-1 text-[10px] font-cinzel uppercase tracking-widest transition-colors"
            style={{ border: `1px solid ${COLOR_GARNET}55`, color: COLOR_GARNET, background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GARNET}22` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Abuela
          </button>
        </div>
      )}
    </div>
  )
}
