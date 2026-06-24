import { useGameStore } from '../store/gameStore'
import { colors }       from './tokens'

interface Props {
  variant?: 'default' | 'death'
}

function stageTint(age: number): string {
  if (age < 13) return '#2e1c04'  // infancia    — ámbar dorado cálido
  if (age < 19) return '#05091a'  // adolescencia — azul noche profundo
  if (age < 31) return '#1c1005'  // juventud     — ocre cálido
  if (age < 51) return '#170608'  // adultez      — carmesí oscuro
  if (age < 71) return '#070e0e'  // madurez      — verde-gris frío
  return '#090809'                 // vejez        — violeta casi negro
}

export function AtmosphericBackground({ variant = 'default' }: Props) {
  const age      = useGameStore(s => s.gameState?.ageYears ?? 6)
  const topColor = variant === 'death' ? '#100a08' : stageTint(age)

  return (
    <>
      <div style={{
        position:       'fixed',
        inset:          0,
        zIndex:         0,
        pointerEvents:  'none',
        background:     `radial-gradient(ellipse 80% 60% at 50% 0%, ${topColor} 0%, ${colors.bg.primary} 60%, #080604 100%)`,
        transition:     'background 3s ease',
      }} />
      <div style={{
        position:        'fixed',
        inset:           0,
        zIndex:          0,
        pointerEvents:   'none',
        opacity:         0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:  '200px',
      }} />
      <div style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        background:    'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #00000099 100%)',
      }} />
    </>
  )
}
