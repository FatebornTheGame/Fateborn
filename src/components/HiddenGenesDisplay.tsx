import type { Stats } from '../types/game.types'
import { COLOR_GOLD } from '../constants/game.constants'

interface Props {
  hiddenGenes: Partial<Stats>
}

const STAT_LABELS: Record<string, string> = {
  logica: 'Lógica', creatividad: 'Creatividad', disciplina: 'Disciplina',
  carisma: 'Carisma', emocional: 'Emocional', ambicion: 'Ambición',
  fisico: 'Físico', riesgo: 'Riesgo', estabilidad: 'Estabilidad',
}

export function HiddenGenesDisplay({ hiddenGenes }: Props) {
  const entries = Object.entries(hiddenGenes).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-1">
      <p
        className="text-[10px] font-cinzel uppercase tracking-widest opacity-40 mb-1"
        style={{ color: COLOR_GOLD }}
      >
        Genes ocultos
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entries.map(([key, value]) => (
          <span
            key={key}
            className="text-[11px]"
            style={{ color: COLOR_GOLD, opacity: 0.25 }}
          >
            {STAT_LABELS[key] ?? key} {(value as number).toFixed(1)}
          </span>
        ))}
      </div>
      <p className="text-[10px] opacity-20 mt-1" style={{ color: COLOR_GOLD }}>
        Potencial genético latente. Puede emerger en circunstancias extremas.
      </p>
    </div>
  )
}
