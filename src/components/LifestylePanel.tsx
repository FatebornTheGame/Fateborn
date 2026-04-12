import { useState } from 'react'
import type { Lifestyle, LifestyleType } from '../systems/lifestyleSystem'
import type { GameState } from '../types/game.types'
import { COLOR_GOLD, COLOR_GARNET } from '../constants/game.constants'

interface Props {
  gameState:     GameState
  lifestyle:     Lifestyle | null
  allLifestyles: Lifestyle[]
  canAdvance:    boolean
  hasPending:    boolean
  onSetLifestyle: (type: LifestyleType) => void
  onAdvance:      () => void
}

function AllocationBar({ label, value, max = 13 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 opacity-50 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-[3px] rounded-full" style={{ background: `${COLOR_GOLD}22` }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: COLOR_GOLD, opacity: 0.7 }}
        />
      </div>
      <span className="w-4 text-right opacity-60">{value}</span>
    </div>
  )
}

export function LifestylePanel({
  gameState,
  lifestyle,
  allLifestyles,
  canAdvance,
  hasPending,
  onSetLifestyle,
  onAdvance,
}: Props) {
  const [showSelector, setShowSelector] = useState(!lifestyle)

  const ageText = gameState.ageYears < 13
    ? 'Infancia'
    : gameState.ageYears < 19
      ? 'Adolescencia'
      : gameState.ageYears < 31
        ? 'Juventud'
        : gameState.ageYears < 51
          ? 'Adultez'
          : gameState.ageYears < 71
            ? 'Madurez'
            : 'Vejez'

  return (
    <div className="h-full flex flex-col px-4 py-4 gap-4 overflow-y-auto">
      {/* Stage label */}
      <div className="flex items-baseline gap-2">
        <span className="font-cinzel text-xs opacity-40 uppercase tracking-widest">{ageText}</span>
        <span className="text-xs opacity-30">·</span>
        <span className="text-xs opacity-30">{gameState.totalQuarters} trimestres</span>
      </div>

      {/* Lifestyle selector / current */}
      {showSelector || !lifestyle ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs opacity-50 uppercase tracking-wider mb-1">
            {lifestyle ? 'Cambiar estilo de vida' : 'Elige tu estilo de vida'}
          </p>
          {allLifestyles.map(ls => (
            <button
              key={ls.type}
              onClick={() => {
                onSetLifestyle(ls.type)
                setShowSelector(false)
              }}
              className="text-left px-3 py-2 text-sm transition-all"
              style={{
                border:  `1px solid ${lifestyle?.type === ls.type ? COLOR_GOLD + '99' : COLOR_GOLD + '33'}`,
                color:   COLOR_GOLD,
                opacity: lifestyle?.type === ls.type ? 1 : 0.65,
                background: lifestyle?.type === ls.type ? `${COLOR_GOLD}0d` : 'transparent',
              }}
            >
              <span className="font-cinzel text-xs uppercase tracking-widest block mb-0.5">
                {ls.label}
              </span>
              <span className="text-xs opacity-60">{ls.description}</span>
            </button>
          ))}
          {lifestyle && (
            <button
              onClick={() => setShowSelector(false)}
              className="text-xs opacity-40 hover:opacity-70 transition-opacity mt-1"
              style={{ color: COLOR_GOLD }}
            >
              cancelar
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Current lifestyle */}
          <div
            className="px-3 py-2"
            style={{ border: `1px solid ${COLOR_GOLD}44` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-cinzel text-xs uppercase tracking-widest" style={{ color: COLOR_GOLD }}>
                {lifestyle.label}
              </span>
              <button
                onClick={() => setShowSelector(true)}
                className="text-[10px] opacity-40 hover:opacity-70 transition-opacity"
                style={{ color: COLOR_GOLD }}
              >
                cambiar
              </button>
            </div>
            <p className="text-xs opacity-50">{lifestyle.description}</p>
          </div>

          {/* Allocation breakdown */}
          <div className="flex flex-col gap-1.5">
            <AllocationBar label="Trabajo"   value={lifestyle.allocation.trabajo}  />
            <AllocationBar label="Estudios"  value={lifestyle.allocation.estudios} />
            <AllocationBar label="Familia"   value={lifestyle.allocation.familia}  />
            <AllocationBar label="Social"    value={lifestyle.allocation.social}   />
            <AllocationBar label="Salud"     value={lifestyle.allocation.salud}    />
            <AllocationBar label="Ocio"      value={lifestyle.allocation.ocio}     />
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Advance button */}
      {hasPending ? (
        <p
          className="text-xs text-center font-cinzel uppercase tracking-wider opacity-50"
          style={{ color: COLOR_GARNET }}
        >
          Toma una decisión
        </p>
      ) : (
        <button
          onClick={canAdvance ? onAdvance : undefined}
          disabled={!canAdvance}
          className="w-full py-3 font-cinzel text-sm uppercase tracking-widest transition-all"
          style={{
            border:     `1px solid ${canAdvance ? COLOR_GOLD + 'aa' : COLOR_GOLD + '22'}`,
            color:      canAdvance ? COLOR_GOLD : COLOR_GOLD + '44',
            background: 'transparent',
            cursor:     canAdvance ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => {
            if (canAdvance)
              (e.currentTarget as HTMLButtonElement).style.background = `${COLOR_GOLD}11`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          Vivir trimestre
        </button>
      )}
    </div>
  )
}
