import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { AncestorSlot } from '../types/archetype.types'
import type { Archetype }    from '../types/archetype.types'
import { AncestorSlots }   from '../components/AncestorSlots'
import { ArchetypeCard }   from '../components/ArchetypeCard'
import { CountrySelector } from '../components/CountrySelector'
import { ARCHETYPES }      from '../data/archetypes'
import { COUNTRIES }       from '../data/countries'

function Separator({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#4a4035' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
    </div>
  )
}

export function AncestorSelection() {
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const selectAncestor    = useGameStore(s => s.selectAncestor)
  const removeAncestor    = useGameStore(s => s.removeAncestor)
  const setCountry        = useGameStore(s => s.setCountry)
  const confirmAncestors  = useGameStore(s => s.confirmAncestors)
  const setScreen         = useGameStore(s => s.setScreen)

  // Active slot: click an empty slot to "target" it, then click a card to fill it
  const [activeSlot, setActiveSlot] = useState<AncestorSlot | null>(null)

  const filledCount = selectedAncestors.filter(Boolean).length
  const canConfirm  = filledCount === 4 && !!selectedCountry

  function nextGrandfatherSlot(): AncestorSlot | null {
    if (!selectedAncestors[0]) return 0
    if (!selectedAncestors[2]) return 2
    return null
  }

  function nextGrandmotherSlot(): AncestorSlot | null {
    if (!selectedAncestors[1]) return 1
    if (!selectedAncestors[3]) return 3
    return null
  }

  // Guard: never allow the same archetype in more than one slot
  function isAlreadySelected(archetype: Archetype): boolean {
    return selectedAncestors.some(a => a?.id === archetype.id)
  }

  // Assign archetype to active slot (if set) or fall back to type-based slot
  function handleSelectAsGrandfather(archetype: Archetype) {
    if (isAlreadySelected(archetype)) return
    if (activeSlot !== null && !selectedAncestors[activeSlot]) {
      selectAncestor(archetype, activeSlot)
      setActiveSlot(null)
    } else {
      const slot = nextGrandfatherSlot()
      if (slot !== null) selectAncestor(archetype, slot)
    }
  }

  function handleSelectAsGrandmother(archetype: Archetype) {
    if (isAlreadySelected(archetype)) return
    if (activeSlot !== null && !selectedAncestors[activeSlot]) {
      selectAncestor(archetype, activeSlot)
      setActiveSlot(null)
    } else {
      const slot = nextGrandmotherSlot()
      if (slot !== null) selectAncestor(archetype, slot)
    }
  }

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

  const slotDotColors = ['#C9A84C', '#8B1A2A', '#C9A84C', '#8B1A2A']

  return (
    <div
      className="animate-screen-enter flex flex-col h-screen overflow-hidden"
      style={{ background: '#0d0b08', position: 'relative' }}
    >
      {/* Atmospheric bg layers */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1408 0%, #0d0b08 60%, #080604 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #000000cc 100%)' }} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex flex-col items-center px-6 py-4 gap-1"
        style={{ borderBottom: '1px solid #2a2620', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 520 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C66, transparent)' }} />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.35em', color: '#C9A84C', textShadow: '0 0 40px #C9A84C44', fontWeight: 700 }}>
            ✦ LINAJE ✦
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C66, transparent)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#6b6045' }}>
            Elige los 4 ancestros que forjan tu herencia
          </p>
          <button
            onClick={() => setScreen('start')}
            style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3a3228', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b6045' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#3a3228' }}
          >
            ← volver
          </button>
        </div>
      </div>

      {/* ── Slots + country ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3 flex flex-col gap-3" style={{ position: 'relative', zIndex: 1 }}>
        <AncestorSlots
          slots={selectedAncestors}
          activeSlot={activeSlot}
          onRemoveSlot={slot => { removeAncestor(slot); setActiveSlot(null) }}
          onActivateSlot={slot => setActiveSlot(prev => prev === slot ? null : slot)}
        />

        {/* Country row + slot dots */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <CountrySelector
              countries={COUNTRIES}
              selectedCountry={selectedCountry}
              onChange={setCountry}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {slotDotColors.map((color, i) => {
                const filled = !!selectedAncestors[i]
                const active = activeSlot === i
                return (
                  <div key={i} style={{
                    width:        10,
                    height:       10,
                    borderRadius: '50%',
                    background:   filled ? color : 'transparent',
                    border:       `1px solid ${color}`,
                    boxShadow:    filled ? `0 0 6px ${color}88` : active ? `0 0 8px ${color}` : 'none',
                    transform:    active ? 'scale(1.3)' : 'scale(1)',
                    transition:   'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                )
              })}
            </div>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', color: '#4a4035', letterSpacing: '0.1em' }}>
              {filledCount} / 4
            </span>
          </div>
        </div>
      </div>

      {/* ── Archetype grid ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <Separator label={filledCount < 4 ? 'ELIGE TU LINAJE' : 'SELECCIÓN COMPLETA'} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {ARCHETYPES.map(archetype => {
            const info = selectionMap.get(archetype.id) ?? null
            return (
              <ArchetypeCard
                key={archetype.id}
                archetype={archetype}
                selectedAs={info?.as ?? null}
                selectionCount={filledCount}
                onSelectAsGrandfather={() => handleSelectAsGrandfather(archetype)}
                onSelectAsGrandmother={() => handleSelectAsGrandmother(archetype)}
              />
            )
          })}
        </div>
      </div>

      {/* ── Confirm footer ──────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-6 py-4 flex flex-col gap-2"
        style={{ borderTop: '1px solid #2a2620', position: 'relative', zIndex: 1 }}
      >
        {!selectedCountry && filledCount === 4 && (
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.62rem', color: '#4a4035', textAlign: 'center', letterSpacing: '0.1em' }}>
            Elige un país de nacimiento
          </p>
        )}
        {filledCount < 4 && (
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.62rem', color: '#4a4035', textAlign: 'center', letterSpacing: '0.1em' }}>
            {4 - filledCount} {4 - filledCount === 1 ? 'ancestro' : 'ancestros'} por elegir
          </p>
        )}
        <button
          onClick={canConfirm ? confirmAncestors : undefined}
          disabled={!canConfirm}
          style={{
            width:         '100%',
            padding:       '16px 48px',
            fontFamily:    'Cinzel, serif',
            fontSize:      '0.85rem',
            letterSpacing: '0.25em',
            border:        canConfirm ? '1px solid #C9A84C' : '1px solid #2a2620',
            color:         canConfirm ? '#0d0b08' : '#3a3228',
            background:    canConfirm ? '#C9A84C' : 'transparent',
            cursor:        canConfirm ? 'pointer' : 'not-allowed',
            boxShadow:     canConfirm ? '0 0 32px #C9A84C44' : 'none',
            transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            opacity:       canConfirm ? 1 : 0.35,
          }}
          onMouseEnter={e => {
            if (canConfirm) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 48px #C9A84C66'
          }}
          onMouseLeave={e => {
            if (canConfirm) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px #C9A84C44'
          }}
        >
          FORJAR MI HERENCIA
        </button>
      </div>
    </div>
  )
}
