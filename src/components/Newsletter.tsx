import { useEffect }        from 'react'
import { useNewsletter }    from '../hooks/useNewsletter'
import type { Newspaper }   from '../systems/newsletterSystem'
import { fonts }            from '../styles/tokens'

// ─── Container ────────────────────────────────────────────────────────────────
export function Newsletter() {
  const { pending, dismiss } = useNewsletter()
  if (!pending) return null

  return <NewspaperOverlay key={pending.year} paper={pending} onDismiss={dismiss} />
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
interface Props {
  paper:     Newspaper
  onDismiss: () => void
}

function NewspaperOverlay({ paper, onDismiss }: Props) {
  const main      = paper.headlines.find(h => h.size === 'main')
  const secondary = paper.headlines.find(h => h.size === 'secondary')
  const brief     = paper.headlines.find(h => h.size === 'brief')

  // Auto-dismiss 5s; any key or click dismisses
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    const onKey = () => onDismiss()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [onDismiss])

  return (
    <div
      onClick={onDismiss}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         200,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'rgba(0,0,0,0.75)',
        cursor:         'pointer',
        userSelect:     'none',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   '#f0ead6',
          maxWidth:     560,
          width:        '90vw',
          padding:      '0 0 20px',
          boxShadow:    '0 8px 40px rgba(0,0,0,0.7)',
          cursor:       'default',
          fontFamily:   fonts.body,
          color:        '#1a1612',
          position:     'relative',
        }}
      >
        {/* Masthead */}
        <div style={{
          borderBottom: '3px solid #1a1612',
          borderTop:    '6px solid #1a1612',
          padding:      '10px 20px 8px',
          textAlign:    'center',
        }}>
          <div style={{
            fontFamily:    fonts.display,
            fontSize:      'clamp(1.1rem, 4vw, 1.6rem)',
            letterSpacing: '0.12em',
            fontWeight:    700,
            lineHeight:    1.1,
            color:         '#1a1612',
          }}>
            {paper.masthead}
          </div>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginTop:      6,
            fontSize:       '0.58rem',
            letterSpacing:  '0.08em',
            color:          '#5a4a30',
            textTransform:  'uppercase',
          }}>
            <span>Edición anual</span>
            <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>
              Fundado en {paper.year - 80}
            </span>
            <span>{paper.year}</span>
          </div>
        </div>

        {/* Thin rule */}
        <div style={{ height: 1, background: '#1a1612', margin: '0 20px' }} />

        {/* Main headline */}
        {main && (
          <div style={{
            padding:    '14px 20px 10px',
            borderBottom: '1px solid #c0b090',
          }}>
            <div style={{
              fontFamily:  fonts.display,
              fontSize:    'clamp(0.9rem, 3vw, 1.15rem)',
              fontWeight:  700,
              lineHeight:  1.35,
              color:       '#1a1612',
              textAlign:   'center',
            }}>
              {main.text}
            </div>
          </div>
        )}

        {/* Two-column secondary area */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 0,
          margin:              '0 20px',
          borderBottom:        '1px solid #c0b090',
        }}>
          {/* Left col: age indicator */}
          <div style={{
            padding:     '10px 12px 10px 0',
            borderRight: '1px solid #c0b090',
          }}>
            <div style={{
              fontFamily:    fonts.display,
              fontSize:      '0.48rem',
              letterSpacing: '0.18em',
              color:         '#8a7050',
              textTransform: 'uppercase',
              marginBottom:  5,
            }}>
              Crónica local
            </div>
            <div style={{
              fontSize:   '0.72rem',
              lineHeight: 1.55,
              color:      '#2a2010',
            }}>
              {secondary?.text ?? ''}
            </div>
          </div>

          {/* Right col: year/age context */}
          <div style={{ padding: '10px 0 10px 12px' }}>
            <div style={{
              fontFamily:    fonts.display,
              fontSize:      '0.48rem',
              letterSpacing: '0.18em',
              color:         '#8a7050',
              textTransform: 'uppercase',
              marginBottom:  5,
            }}>
              Tiempo presente
            </div>
            <div style={{
              fontFamily:  fonts.display,
              fontSize:    'clamp(1.6rem, 8vw, 2.8rem)',
              fontWeight:  700,
              color:       '#1a1612',
              lineHeight:  1,
            }}>
              {paper.year}
            </div>
            <div style={{
              fontSize:      '0.62rem',
              color:         '#8a7050',
              marginTop:     4,
              letterSpacing: '0.04em',
            }}>
              {paper.age} años
            </div>
          </div>
        </div>

        {/* Brief note footer */}
        {brief && (
          <div style={{
            padding:   '8px 20px 0',
            fontSize:  '0.62rem',
            color:     '#7a6040',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            {brief.text}
          </div>
        )}

        {/* Dismiss hint */}
        <div style={{
          textAlign:     'center',
          marginTop:     14,
          fontFamily:    fonts.display,
          fontSize:      '0.42rem',
          letterSpacing: '0.22em',
          color:         '#a09070',
          textTransform: 'uppercase',
        }}>
          Clic para continuar
        </div>

        {/* Watermark diagonal */}
        <div style={{
          position:      'absolute',
          top:           '50%',
          left:          '50%',
          transform:     'translate(-50%, -50%) rotate(-20deg)',
          fontFamily:    fonts.display,
          fontSize:      'clamp(3rem, 12vw, 6rem)',
          fontWeight:    900,
          color:         'rgba(26,22,18,0.04)',
          whiteSpace:    'nowrap',
          pointerEvents: 'none',
          letterSpacing: '0.05em',
          userSelect:    'none',
        }}>
          {paper.year}
        </div>
      </div>
    </div>
  )
}
