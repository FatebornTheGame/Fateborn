export const colors = {
  bg: {
    primary:   '#0d0b08',
    secondary: '#141210',
    tertiary:  '#1c1915',
    card:      '#0f0d0a',
    disabled:  '#3a2e1e',
    hover:     '#2a2218',
  },
  gold:    '#C9A84C',
  crimson: '#8B1A2A',
  text: {
    primary:   '#C9A84C',
    secondary: '#8a7050',
    muted:     '#a08060',   // raised from #6b6045 — minimum readable
    faint:     '#a08060',   // raised from #4a3a20 — below #6b6045 threshold
    narrative: '#b09060',
    passive:   '#8a7050',   // raised from #7a6040 — minimum readable
    dim:       '#a08060',   // raised from #5a4828 — below #6b6045 threshold
  },
  border: {
    default: '#2a2620',
    warm:    '#3a3228',
    active:  '#C9A84C',
    event:   '#2e2418',
  },
  stats: {
    cognitive: '#4a7fb5',
    social:    '#C9A84C',
    vital:     '#8B1A2A',
  },
} as const

export const fonts = {
  display: '"Cinzel", Georgia, serif',
  body:    'Georgia, serif',
} as const

export const transitions = {
  fast:   '0.2s ease',
  normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  slow:   '0.6s ease',
} as const

export const zIndex = {
  background: 0,
  content:    1,
  overlay:    10,
  statusBar:  50,
  muteBtn:    100,
} as const
