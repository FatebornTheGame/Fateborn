import { useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import type { FeedEntry } from '../types/game.types'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'

const OPT_COLOR: Record<string, string> = {
  gold: GOLD, garnet: GARNET, muted: '#666',
}

function Entry({ entry }: { entry: FeedEntry }) {
  const answerFeedEntry = useGameStore(s => s.answerFeedEntry)
  const isAnswered = entry.answered

  const importanceBadge = entry.importance === 'critica'
    ? <span className="badge-critica">CRÍTICO</span>
    : entry.importance === 'alta'
    ? <span className="badge-alta">IMPORTANTE</span>
    : null

  return (
    <div style={{
      padding: '0.85rem 1rem',
      borderBottom: '1px solid #1a1510',
      opacity: isAnswered && entry.options ? 0.55 : 1,
      transition: 'opacity 0.3s',
      position: 'relative',
    }}>
      {/* Fecha */}
      <div style={{ fontSize: '0.58rem', color: '#444', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
        SEMANA {entry.week} · AÑO {entry.year}
        {importanceBadge}
      </div>

      {/* Texto — preservar saltos de línea */}
      <p style={{
        margin: '0 0 0.6rem',
        fontSize: '0.82rem',
        color: '#d4c5a0',
        lineHeight: 1.65,
        whiteSpace: 'pre-line',
      }}>
        {entry.text}
      </p>

      {/* Opciones */}
      {entry.options && !isAnswered && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
          {entry.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => answerFeedEntry(entry.id, opt.id)}
              style={{
                background: 'transparent',
                border: `1px solid ${OPT_COLOR[opt.color ?? 'muted']}`,
                color: OPT_COLOR[opt.color ?? 'muted'],
                fontSize: '0.7rem',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.08em',
                padding: '0.4rem 0.9rem',
                minHeight: 36,
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => {
                const c = OPT_COLOR[opt.color ?? 'muted']
                e.currentTarget.style.background = `${c}22`
              }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Respuesta elegida */}
      {entry.options && isAnswered && entry.selectedOptionId && (
        <div style={{ fontSize: '0.65rem', color: '#444', fontStyle: 'italic', marginTop: '0.3rem' }}>
          ↳ {entry.options.find(o => o.id === entry.selectedOptionId)?.label}
        </div>
      )}

      {/* Indicador lateral para entradas críticas */}
      {entry.importance === 'critica' && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 3, background: GARNET, borderRadius: '0 2px 2px 0',
        }} />
      )}
      {entry.importance === 'alta' && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 3, background: GOLD, borderRadius: '0 2px 2px 0',
        }} />
      )}
    </div>
  )
}

export default function NarrativeFeed() {
  const feed    = useGameStore(s => s.feed)
  const topRef  = useRef<HTMLDivElement>(null)
  const prevLen = useRef(feed.length)

  // Scroll al tope cuando llega entrada nueva
  useEffect(() => {
    if (feed.length > prevLen.current && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    prevLen.current = feed.length
  }, [feed.length])

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: '#0a0907',
    }}>
      <style>{`
        .badge-critica {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.1rem 0.4rem;
          background: ${GARNET};
          color: #d4c5a0;
          font-size: 0.5rem;
          font-family: Cinzel, serif;
          letter-spacing: 0.12em;
          border-radius: 2px;
          animation: pulseBadge 1.5s ease-in-out infinite;
          vertical-align: middle;
        }
        .badge-alta {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.1rem 0.4rem;
          background: ${GOLD}22;
          color: ${GOLD};
          border: 1px solid ${GOLD}55;
          font-size: 0.5rem;
          font-family: Cinzel, serif;
          letter-spacing: 0.12em;
          border-radius: 2px;
          vertical-align: middle;
        }
        @keyframes pulseBadge {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      {/* Header del panel */}
      <div style={{
        padding: '0.6rem 1rem',
        borderBottom: '1px solid #1a1510',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        position: 'sticky', top: 0, background: '#0a0907', zIndex: 10,
      }}>
        <span style={{ fontSize: '0.9rem' }}>📖</span>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.62rem',
          color: '#555', letterSpacing: '0.18em',
        }}>
          HISTORIA
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: '0.58rem',
          color: '#333', fontVariantNumeric: 'tabular-nums',
        }}>
          {feed.length} entradas
        </span>
      </div>

      <div ref={topRef} />

      {feed.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#333', fontSize: '0.75rem' }}>
          Tu historia comienza aquí…
        </div>
      ) : (
        feed.map(entry => <Entry key={entry.id} entry={entry} />)
      )}
    </div>
  )
}
