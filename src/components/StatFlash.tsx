import { useEffect, useRef, useState } from 'react'
import type { Stats }                  from '../types/game.types'
import type { StatFlash as FlashDir }  from '../store/gameStore'
import { useGameStore }                from '../store/gameStore'
import { colors, fonts }               from '../styles/tokens'

const STAT_LABELS: Record<keyof Stats, string> = {
  logica:      'LÓG',
  creatividad: 'CRE',
  disciplina:  'DIS',
  carisma:     'CAR',
  emocional:   'EMO',
  ambicion:    'AMB',
  fisico:      'FÍS',
  riesgo:      'RIE',
  estabilidad: 'EST',
}

interface FlashItem {
  id:        string
  stat:      keyof Stats
  direction: FlashDir
}

export function StatFlash() {
  const lastStatChanges                       = useGameStore(s => s.lastStatChanges)
  const [flashes, setFlashes]                 = useState<FlashItem[]>([])
  const timersRef                             = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const entries = Object.entries(lastStatChanges) as [keyof Stats, FlashDir][]
    if (entries.length === 0) return

    const newFlashes: FlashItem[] = entries.map(([stat, direction]) => ({
      id: `${stat}-${Date.now()}-${Math.random()}`,
      stat,
      direction,
    }))

    setFlashes(prev => [...prev, ...newFlashes])

    for (const flash of newFlashes) {
      const timer = setTimeout(() => {
        setFlashes(prev => prev.filter(f => f.id !== flash.id))
        timersRef.current.delete(flash.id)
      }, 1500)
      timersRef.current.set(flash.id, timer)
    }
  }, [lastStatChanges])

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => { for (const t of timers.values()) clearTimeout(t) }
  }, [])

  if (flashes.length === 0) return null

  return (
    <div style={{
      position:       'absolute',
      top:            56,
      left:           0,
      right:          0,
      zIndex:         40,
      pointerEvents:  'none',
      display:        'flex',
      flexWrap:       'wrap',
      gap:            6,
      padding:        '10px 20px',
      justifyContent: 'flex-end',
    }}>
      {flashes.map(flash => {
        const isPos = flash.direction === 'pos'
        return (
          <span
            key={flash.id}
            className="animate-stat-badge font-cinzel"
            style={{
              fontSize:      '0.6rem',
              letterSpacing: '0.12em',
              fontWeight:    700,
              padding:       '3px 8px',
              borderRadius:  2,
              background:    isPos ? `${colors.gold}1a` : `${colors.crimson}1a`,
              color:         isPos ? colors.gold : '#e05060',
              border:        `1px solid ${isPos ? colors.gold + '55' : colors.crimson + '55'}`,
            }}
          >
            {isPos ? '+' : '−'}{STAT_LABELS[flash.stat]}
          </span>
        )
      })}
    </div>
  )
}
