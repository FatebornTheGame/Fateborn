import type { Friend } from '../types/game.types'
import { colors, fonts } from '../styles/tokens'

const ROLE_LABEL: Record<Friend['role'], string> = {
  friend:   'Amigo/a',
  rival:    'Rival',
  mentor:   'Mentor',
  romantic: 'Pareja',
}

const STATUS_COLOR: Record<string, string> = {
  cercano:  colors.gold,
  leal:     '#4a9e6e',
  distante: colors.text.muted,
}

interface Props {
  friends: Friend[]
}

export function NPCCards({ friends }: Props) {
  if (friends.length === 0) return null

  return (
    <div style={{ padding: '16px 16px 0' }}>
      <div style={{
        fontFamily:    fonts.display,
        fontSize:      '0.45rem',
        letterSpacing: '0.25em',
        color:         colors.text.muted,
        marginBottom:  10,
        textTransform: 'uppercase',
      }}>
        Personas en tu vida
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {friends.map(f => <NPCCard key={f.id} friend={f} />)}
      </div>
    </div>
  )
}

function NPCCard({ friend }: { friend: Friend }) {
  const isAlive     = friend.alive
  const statusColor = friend.status ? (STATUS_COLOR[friend.status] ?? colors.text.muted) : colors.text.muted
  const relPct      = Math.max(0, Math.min(100, friend.relationship))

  return (
    <div style={{
      padding:      '8px 10px',
      border:       `1px solid ${isAlive ? colors.border.default : colors.bg.tertiary}`,
      background:   colors.bg.card,
      opacity:      isAlive ? 1 : 0.45,
      borderRadius: 2,
    }}>
      {/* Name + role row */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!isAlive && (
            <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>🕯</span>
          )}
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.62rem',
            letterSpacing: '0.08em',
            color:         isAlive ? colors.text.primary : colors.text.muted,
          }}>
            {friend.name}
          </span>
        </div>
        <span style={{
          fontFamily:    fonts.display,
          fontSize:      '0.42rem',
          letterSpacing: '0.15em',
          color:         colors.text.muted,
          textTransform: 'uppercase',
        }}>
          {ROLE_LABEL[friend.role]}
        </span>
      </div>

      {/* Relationship bar + status label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex:         1,
          height:       2,
          background:   colors.bg.tertiary,
          borderRadius: 1,
          overflow:     'hidden',
        }}>
          <div style={{
            height:       '100%',
            width:        `${relPct}%`,
            background:   isAlive ? statusColor : colors.text.muted,
            borderRadius: 1,
            transition:   'width 0.8s ease',
          }} />
        </div>
        {friend.status && (
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.4rem',
            letterSpacing: '0.12em',
            color:         statusColor,
            textTransform: 'uppercase',
            minWidth:      40,
            textAlign:     'right',
          }}>
            {friend.status}
          </span>
        )}
      </div>
    </div>
  )
}
