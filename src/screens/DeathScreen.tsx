import { useGameStore } from '../store/gameStore'
import { StatsRadarChart } from '../components/StatsRadarChart'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

export function DeathScreen() {
  const gameState = useGameStore(s => s.gameState)
  const setScreen = useGameStore(s => s.setScreen)

  if (!gameState) return null

  const { epitaph, character, stats, legacyScore, ageYears, friends, memories } = gameState
  const deathYear = character.birthYear + ageYears
  const aliveNpcs = friends.filter(f => f.alive).length

  return (
    <div
      className="flex flex-col items-center min-h-screen px-4 py-12 gap-8 overflow-y-auto"
      style={{ background: '#0d0b08' }}
    >
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-[10px] font-cinzel uppercase tracking-[0.4em] opacity-40"
          style={{ color: COLOR_GARNET }}
        >
          {character.birthYear} — {deathYear}
        </p>
        <h1
          className="font-cinzel text-2xl uppercase tracking-widest"
          style={{ color: COLOR_GOLD }}
        >
          {character.name}
        </h1>
        <p className="text-xs opacity-30 uppercase tracking-widest font-cinzel">
          {character.country}
        </p>
      </div>

      {/* Epitaph */}
      {epitaph.currentText && (
        <div
          className="max-w-lg text-center px-6 py-5"
          style={{ border: `1px solid ${COLOR_GOLD}33` }}
        >
          <p
            className="text-sm leading-loose italic animate-fade-in"
            style={{ color: COLOR_GOLD, opacity: 0.75 }}
          >
            {epitaph.currentText}
          </p>
        </div>
      )}

      {/* Stats radar */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-cinzel uppercase tracking-widest opacity-30" style={{ color: COLOR_GOLD }}>
          Perfil final
        </p>
        <StatsRadarChart stats={stats} size={260} />
      </div>

      {/* Legacy stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {[
          { label: 'Legado',    value: legacyScore },
          { label: 'Años',      value: ageYears    },
          { label: 'Memorias',  value: memories.length },
          { label: 'Amigos',    value: friends.length  },
          { label: 'Viven',     value: aliveNpcs       },
          { label: 'Hitos',     value: epitaph.seeds.length },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex flex-col items-center py-3 gap-1"
            style={{ border: `1px solid ${COLOR_GOLD}22` }}
          >
            <span className="font-cinzel text-xl font-bold" style={{ color: COLOR_GOLD }}>
              {stat.value}
            </span>
            <span className="text-[10px] opacity-40 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <button
          onClick={() => setScreen('start')}
          className="w-full py-4 font-cinzel text-sm uppercase tracking-widest transition-all"
          style={{
            border:     `1px solid ${COLOR_GOLD}`,
            color:      COLOR_GOLD,
            background: 'transparent',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}11` }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          Nueva vida
        </button>

        <p
          className="text-[10px] font-cinzel uppercase tracking-widest opacity-20 text-center"
          style={{ color: COLOR_GARNET }}
        >
          Modo Dinastía — próximamente
        </p>
      </div>
    </div>
  )
}
