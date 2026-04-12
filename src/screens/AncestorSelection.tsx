import { useGameStore } from '../store/gameStore'
import type { AncestorSlot } from '../types/archetype.types'
import { AncestorSlots }  from '../components/AncestorSlots'
import { ArchetypeCard }  from '../components/ArchetypeCard'
import { CountrySelector } from '../components/CountrySelector'
import { ARCHETYPES }     from '../data/archetypes'
import { COUNTRIES }      from '../data/countries'
import { COLOR_GOLD } from '../constants/game.constants'

export function AncestorSelection() {
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const selectAncestor    = useGameStore(s => s.selectAncestor)
  const removeAncestor    = useGameStore(s => s.removeAncestor)
  const setCountry        = useGameStore(s => s.setCountry)
  const confirmAncestors  = useGameStore(s => s.confirmAncestors)
  const setScreen         = useGameStore(s => s.setScreen)

  const filledCount = selectedAncestors.filter(Boolean).length
  const canConfirm  = filledCount === 4

  // Find the next available grandfather slot (0 or 2)
  function nextGrandfatherSlot(): AncestorSlot | null {
    if (!selectedAncestors[0]) return 0
    if (!selectedAncestors[2]) return 2
    return null
  }

  // Find the next available grandmother slot (1 or 3)
  function nextGrandmotherSlot(): AncestorSlot | null {
    if (!selectedAncestors[1]) return 1
    if (!selectedAncestors[3]) return 3
    return null
  }

  // Build a map: archetypeId → which slot (and as what)
  type SelectionInfo = { slot: AncestorSlot; as: 'grandfather' | 'grandmother' }
  const selectionMap = new Map<string, SelectionInfo>()
  selectedAncestors.forEach((a, i) => {
    if (a) {
      selectionMap.set(a.id, {
        slot: i as AncestorSlot,
        as:   (i === 0 || i === 2) ? 'grandfather' : 'grandmother',
      })
    }
  })

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: '#0d0b08' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: `1px solid ${COLOR_GOLD}22` }}
      >
        <div>
          <h1 className="font-cinzel text-base uppercase tracking-widest" style={{ color: COLOR_GOLD }}>
            Linaje
          </h1>
          <p className="text-xs opacity-40">Elige los 4 ancestros que forjan tu herencia</p>
        </div>
        <button
          onClick={() => setScreen('start')}
          className="text-xs opacity-30 hover:opacity-60 transition-opacity"
          style={{ color: COLOR_GOLD }}
        >
          ← volver
        </button>
      </div>

      {/* Slots + country */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3 flex flex-col gap-3">
        <AncestorSlots
          slots={selectedAncestors}
          onRemoveSlot={removeAncestor}
        />
        <CountrySelector
          countries={countries}
          selectedCountry={selectedCountry}
          onChange={setCountry}
        />
      </div>

      {/* Archetype grid — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <p className="text-[10px] font-cinzel uppercase tracking-widest opacity-30 mb-3">
          {filledCount < 4 ? `${4 - filledCount} por elegir` : 'Selección completa'}
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {ARCHETYPES.map(archetype => {
            const info = selectionMap.get(archetype.id) ?? null
            return (
              <ArchetypeCard
                key={archetype.id}
                archetype={archetype}
                selectedAs={info?.as ?? null}
                selectionCount={filledCount}
                onSelectAsGrandfather={() => {
                  const slot = nextGrandfatherSlot()
                  if (slot !== null) selectAncestor(archetype, slot)
                }}
                onSelectAsGrandmother={() => {
                  const slot = nextGrandmotherSlot()
                  if (slot !== null) selectAncestor(archetype, slot)
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Confirm footer */}
      <div
        className="flex-shrink-0 px-6 py-4"
        style={{ borderTop: `1px solid ${COLOR_GOLD}22` }}
      >
        <button
          onClick={canConfirm ? confirmAncestors : undefined}
          disabled={!canConfirm}
          className="w-full py-4 font-cinzel uppercase tracking-widest text-sm transition-all"
          style={{
            border:     `1px solid ${canConfirm ? COLOR_GOLD : COLOR_GOLD + '22'}`,
            color:      canConfirm ? COLOR_GOLD : COLOR_GOLD + '33',
            background: 'transparent',
            cursor:     canConfirm ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => {
            if (canConfirm)
              (e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}11`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          {canConfirm ? 'Confirmar linaje' : `${4 - filledCount} ancestros por elegir`}
        </button>
      </div>
    </div>
  )
}

// Alias to avoid name collision with import
const countries = COUNTRIES
