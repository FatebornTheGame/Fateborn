import { colors } from './tokens'

interface Props {
  /** 'death' uses a darker, redder top gradient */
  variant?: 'default' | 'death'
}

export function AtmosphericBackground({ variant = 'default' }: Props) {
  const topColor = variant === 'death' ? '#100a08' : '#221608'
  return (
    <>
      <div style={{
        position:       'fixed',
        inset:          0,
        zIndex:         0,
        pointerEvents:  'none',
        background:     `radial-gradient(ellipse 80% 60% at 50% 0%, ${topColor} 0%, ${colors.bg.primary} 60%, #080604 100%)`,
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
