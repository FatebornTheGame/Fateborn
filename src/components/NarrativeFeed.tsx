import { useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import type { FeedEntry } from '../types/game.types'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'

// Verde → positivo (gold), Rojo → negativo (garnet)
const OPT_COLOR: Record<string, string> = {
  gold:   '#4aff8a',
  garnet: '#ff5a5a',
  muted:  '#888',
}

function Entry({ entry }: { entry: FeedEntry }) {
  const answerFeedEntry = useGameStore(s => s.answerFeedEntry)
  const isAnswered = entry.answered

  const badge = entry.importance === 'critica'
    ? <span className="badge-critica">CRÍTICO</span>
    : entry.importance === 'alta'
    ? <span className="badge-alta">IMPORTANTE</span>
    : null

  return (
    <div className="feed-entry" style={{
      padding: '16px',
      borderBottom: '1px solid #1a1510',
      opacity: isAnswered && entry.options ? 0.6 : 1,
      transition: 'opacity 0.3s, background 0.15s',
      position: 'relative',
    }}>
      {/* Fecha */}
      <div style={{
        fontSize: '10px', color: '#666',
        letterSpacing: '0.12em', marginBottom: '0.45rem',
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap',
      }}>
        <span>Semana {entry.week} · Año {entry.year}</span>
        {badge}
      </div>

      {/* Texto */}
      <p style={{
        margin: '0 0 0.5rem',
        fontSize: '14px',
        color: '#d4c4a0',
        lineHeight: 1.6,
        whiteSpace: 'pre-line',
      }}>
        {entry.text}
      </p>

      {/* Opciones sin responder */}
      {entry.options && !isAnswered && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
          {entry.options.map(opt => {
            const c = OPT_COLOR[opt.color ?? 'muted']
            return (
              <button
                key={opt.id}
                onClick={() => answerFeedEntry(entry.id, opt.id)}
                style={{
                  background: `${c}14`,
                  border: `1px solid ${c}55`,
                  color: c,
                  fontSize: '0.72rem',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.08em',
                  padding: '0.5rem 1rem',
                  minHeight: 38,
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${c}2a`
                  e.currentTarget.style.borderColor = c
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${c}14`
                  e.currentTarget.style.borderColor = `${c}55`
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Respuesta seleccionada */}
      {entry.options && isAnswered && entry.selectedOptionId && (
        <div style={{ fontSize: '0.65rem', color: '#444', fontStyle: 'italic', marginTop: '0.3rem' }}>
          ↳ {entry.options.find(o => o.id === entry.selectedOptionId)?.label}
        </div>
      )}

      {/* Borde lateral de importancia */}
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

  useEffect(() => {
    if (feed.length > prevLen.current && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    prevLen.current = feed.length
  }, [feed.length])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0a0806' }}>
      <style>{`
        .badge-critica {
          display: inline-block;
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
          padding: 0.1rem 0.4rem;
          background: ${GOLD};
          color: #0d0b08;
          font-size: 0.5rem;
          font-family: Cinzel, serif;
          letter-spacing: 0.12em;
          border-radius: 2px;
          vertical-align: middle;
        }
        @keyframes pulseBadge {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.65; }
        }
        .feed-entry:hover {
          background: #110e0a !important;
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '0.6rem 1rem',
        borderBottom: '1px solid #1a1510',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        position: 'sticky', top: 0, background: '#0a0806', zIndex: 10,
      }}>
        <span style={{ fontSize: '0.9rem' }}>📖</span>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.62rem',
          color: '#555', letterSpacing: '0.18em',
        }}>
          HISTORIA
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.58rem', color: '#333' }}>
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
