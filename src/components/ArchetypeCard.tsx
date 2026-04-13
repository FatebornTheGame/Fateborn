import { useState } from 'react'
import type { Archetype } from '../types/archetype.types'

interface Props {
  archetype:             Archetype
  selectedAs:            'grandfather' | 'grandmother' | null
  selectionCount:        number
  onSelectAsGrandfather: () => void
  onSelectAsGrandmother: () => void
}

const STAT_KEYS = ['logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad'] as const
const STAT_SHORT: Record<string, string> = {
  logica: 'LÓG', creatividad: 'CRE', disciplina: 'DIS',
  carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
  fisico: 'FÍS', riesgo: 'RIE', estabilidad: 'EST',
}

const GLYPH: Record<string, string> = {
  academico:   '✦',
  lider:       '⚜',
  atleta:      '◈',
  artista:     '✧',
  filosofo:    '◎',
  emprendedor: '◆',
  cuidador:    '♾',
  explorador:  '✺',
  medico:      '✙',
  militar:     '⚔',
  politico:    '⚑',
  criminal:    '◉',
  marinero:    '⛵',
  sacerdote:   '☩',
  mercader:    '⬡',
  abogado:     '⚖',
  obrero:      '⚙',
}

export function ArchetypeCard({
  archetype,
  selectedAs,
  selectionCount,
  onSelectAsGrandfather,
  onSelectAsGrandmother,
}: Props) {
  const [hovered, setHovered] = useState(false)

  const isSelected  = selectedAs !== null
  const accentColor = selectedAs === 'grandmother' ? '#8B1A2A' : '#C9A84C'
  const glyph       = GLYPH[archetype.id] ?? '◆'

  const topStats = STAT_KEYS
    .map(k => ({ key: k, value: archetype.stats[k] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

  return (
    <div
      style={{
        position:      'relative',
        display:       'flex',
        flexDirection: 'column',
        padding:       '12px',
        background:    isSelected ? `${accentColor}08` : '#0f0d0a',
        border:        `1px solid ${isSelected ? accentColor + 'cc' : hovered ? '#C9A84C' : '#2a2620'}`,
        borderRadius:  4,
        minHeight:     200,
        opacity:       isSelected ? 0.45 : 1,
        transform:     !isSelected && hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:     !isSelected && hovered ? '0 8px 32px #C9A84C22' : 'none',
        transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow:      'hidden',
        cursor:        isSelected ? 'default' : 'default',
      }}
      onMouseEnter={() => { if (!isSelected) setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line — appears on hover */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     1,
        background: isSelected
          ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          : hovered
            ? 'linear-gradient(90deg, transparent, #C9A84C, transparent)'
            : 'transparent',
        transition: 'background 0.25s ease',
      }} />

      {/* ✓ ELEGIDO overlay */}
      {isSelected && (
        <div style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     `${accentColor}11`,
          zIndex:         2,
        }}>
          <span style={{
            fontFamily:    'Cinzel, serif',
            fontSize:      '0.6rem',
            letterSpacing: '0.2em',
            color:         accentColor,
            fontWeight:    700,
          }}>
            ✓ ELEGIDO
          </span>
        </div>
      )}

      {/* Glyph — glows on hover */}
      <span style={{
        fontFamily:   'serif',
        fontSize:     '1.8rem',
        color:        '#C9A84C',
        opacity:      hovered ? 1 : 0.5,
        lineHeight:   1,
        marginBottom: 6,
        display:      'block',
        textShadow:   hovered ? '0 0 20px #C9A84C66' : 'none',
        transition:   'opacity 0.2s ease, text-shadow 0.2s ease',
      }}>
        {glyph}
      </span>

      {/* Name */}
      <span style={{
        fontFamily:    'Cinzel, serif',
        fontSize:      '0.65rem',
        letterSpacing: '0.18em',
        color:         hovered ? '#C9A84C' : '#C9A84C',
        fontWeight:    700,
        display:       'block',
        marginBottom:  4,
        transition:    'color 0.2s ease',
      }}>
        {archetype.name}
      </span>

      {/* Lore */}
      <span style={{
        fontFamily:   'Georgia, serif',
        fontStyle:    'italic',
        fontSize:     '0.55rem',
        color:        '#4a4035',
        lineHeight:   1.4,
        display:      'block',
        marginBottom: 10,
      }}>
        "{archetype.lore}"
      </span>

      {/* Top 3 stat bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
        {topStats.map(({ key, value }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize:   '0.5rem',
              color:      '#6b6045',
              width:      24,
              flexShrink: 0,
            }}>
              {STAT_SHORT[key]}
            </span>
            <div style={{ flex: 1, height: 2, background: '#2a2620', borderRadius: 1 }}>
              <div style={{
                height:       '100%',
                width:        `${(value / 10) * 100}%`,
                background:   hovered
                  ? 'linear-gradient(90deg, #C9A84C88, #C9A84C)'
                  : 'linear-gradient(90deg, #C9A84C55, #C9A84C88)',
                borderRadius: 1,
                transition:   'background 0.25s ease',
              }} />
            </div>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize:   '0.55rem',
              color:      '#C9A84C',
              width:      14,
              textAlign:  'right',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {!isSelected && selectionCount < 4 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          <button
            onClick={onSelectAsGrandfather}
            style={{
              flex:          1,
              padding:       '5px 0',
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              letterSpacing: '0.1em',
              color:         '#C9A84C',
              background:    'transparent',
              border:        '1px solid #C9A84C55',
              cursor:        'pointer',
              transition:    'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C22' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Abuelo
          </button>
          <button
            onClick={onSelectAsGrandmother}
            style={{
              flex:          1,
              padding:       '5px 0',
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              letterSpacing: '0.1em',
              color:         '#8B1A2A',
              background:    'transparent',
              border:        '1px solid #8B1A2A55',
              cursor:        'pointer',
              transition:    'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#8B1A2A22' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Abuela
          </button>
        </div>
      )}
    </div>
  )
}
