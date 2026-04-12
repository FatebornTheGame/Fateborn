import type { Archetype, AncestorSlot } from '../types/archetype.types'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  slots:          [Archetype | null, Archetype | null, Archetype | null, Archetype | null]
  onRemoveSlot:   (slot: AncestorSlot) => void
}

const SLOT_CONFIG = [
  { label: 'Abuelo Paterno',  labelShort: 'A.P.',  color: COLOR_GOLD   },
  { label: 'Abuela Paterna',  labelShort: 'A.Pa.', color: COLOR_GARNET },
  { label: 'Abuelo Materno',  labelShort: 'A.M.',  color: COLOR_GOLD   },
  { label: 'Abuela Materna',  labelShort: 'A.Ma.', color: COLOR_GARNET },
] as const

export function AncestorSlots({ slots, onRemoveSlot }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SLOT_CONFIG.map((config, index) => {
        const slot      = index as AncestorSlot
        const archetype = slots[slot]
        return (
          <div
            key={slot}
            className="flex flex-col items-center p-2 text-center transition-all"
            style={{
              border:     `1px solid ${archetype ? config.color + 'aa' : config.color + '22'}`,
              minHeight:  80,
              background: archetype ? `${config.color}0a` : 'transparent',
            }}
          >
            {/* Slot label */}
            <span
              className="text-[9px] font-cinzel uppercase tracking-widest mb-1 block"
              style={{ color: config.color, opacity: 0.6 }}
            >
              {config.label}
            </span>

            {archetype ? (
              <>
                <span
                  className="font-cinzel text-xs font-semibold block leading-tight"
                  style={{ color: config.color }}
                >
                  {archetype.name}
                </span>
                <button
                  onClick={() => onRemoveSlot(slot)}
                  className="text-[9px] mt-2 opacity-30 hover:opacity-70 transition-opacity block"
                  style={{ color: config.color }}
                >
                  quitar
                </button>
              </>
            ) : (
              <span
                className="text-[9px] opacity-20 mt-2"
                style={{ color: config.color }}
              >
                vacío
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
