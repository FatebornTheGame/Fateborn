import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { StatsRadarChart }    from '../components/StatsRadarChart'
import { HiddenGenesDisplay } from '../components/HiddenGenesDisplay'
import { AncestralNarrative } from '../components/AncestralNarrative'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

export function BirthScreen() {
  const inheritedStats    = useGameStore(s => s.inheritedStats)
  const hiddenGenes       = useGameStore(s => s.hiddenGenes)
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const startNewGame      = useGameStore(s => s.startNewGame)
  const setScreen         = useGameStore(s => s.setScreen)

  const [name,   setName]   = useState('')
  const [gender, setGender] = useState<'hombre' | 'mujer'>('hombre')

  if (!inheritedStats) {
    // Should never happen — confirmAncestors sets this
    return null
  }

  const canConfirm = name.trim().length >= 2

  function handleStart() {
    if (!canConfirm) return
    startNewGame(name.trim(), gender)
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen px-4 py-8 gap-6 overflow-y-auto"
      style={{ background: '#0d0b08' }}
    >
      {/* Back button */}
      <div className="w-full max-w-xl flex justify-start">
        <button
          onClick={() => setScreen('ancestors')}
          className="text-xs opacity-30 hover:opacity-60 transition-opacity"
          style={{ color: COLOR_GOLD }}
        >
          ← linaje
        </button>
      </div>

      {/* Section title */}
      <h1 className="font-cinzel uppercase tracking-[0.3em] text-sm" style={{ color: COLOR_GOLD, opacity: 0.6 }}>
        Nacimiento
      </h1>

      {/* Ancestral narrative */}
      <AncestralNarrative ancestors={selectedAncestors} country={selectedCountry} />

      {/* Stats radar */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-cinzel uppercase tracking-widest opacity-40" style={{ color: COLOR_GOLD }}>
          Stats heredados
        </p>
        <StatsRadarChart stats={inheritedStats} size={280} />
      </div>

      {/* Hidden genes */}
      <div className="w-full max-w-sm">
        <HiddenGenesDisplay hiddenGenes={hiddenGenes} />
      </div>

      {/* Character creation form */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Name input */}
        <div className="flex flex-col gap-1">
          <label
            className="text-[10px] font-cinzel uppercase tracking-widest opacity-50"
            style={{ color: COLOR_GOLD }}
          >
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="El nombre de tu personaje"
            maxLength={32}
            className="px-3 py-2 text-sm bg-transparent outline-none"
            style={{
              border:  `1px solid ${COLOR_GOLD}55`,
              color:   COLOR_GOLD,
            }}
            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = `${COLOR_GOLD}cc` }}
            onBlur={e  => { (e.currentTarget as HTMLInputElement).style.borderColor = `${COLOR_GOLD}55` }}
          />
        </div>

        {/* Gender selector */}
        <div className="flex flex-col gap-1">
          <label
            className="text-[10px] font-cinzel uppercase tracking-widest opacity-50"
            style={{ color: COLOR_GOLD }}
          >
            Género
          </label>
          <div className="flex gap-2">
            {(['hombre', 'mujer'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className="flex-1 py-2 text-xs font-cinzel uppercase tracking-widest transition-all"
                style={{
                  border:     `1px solid ${gender === g ? COLOR_GOLD + 'cc' : COLOR_GOLD + '33'}`,
                  color:      gender === g ? COLOR_GOLD : COLOR_GOLD + '66',
                  background: gender === g ? `${COLOR_GOLD}0d` : 'transparent',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={canConfirm ? handleStart : undefined}
        disabled={!canConfirm}
        className="w-full max-w-sm py-4 font-cinzel uppercase tracking-widest text-sm transition-all"
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
        Comenzar vida
      </button>

      {/* Flavor */}
      <p
        className="text-[10px] text-center opacity-20 max-w-xs font-cinzel uppercase tracking-widest"
        style={{ color: COLOR_GARNET }}
      >
        Lo que heredas no define lo que serás
      </p>
    </div>
  )
}
