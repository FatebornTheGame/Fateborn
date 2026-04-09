import { useGameStore } from '../store/gameStore';

export default function BirthScreen() {
  const setScreen = useGameStore(s => s.setScreen);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      color: '#d4c5a0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c9a84c', margin: 0 }}>
        Nacimiento
      </h2>
      <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.2em' }}>
        BirthScreen — placeholder
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setScreen('ancestors')}
          style={{
            background: 'transparent',
            color: '#888',
            border: '1px solid #444',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
          }}
        >
          ← Atrás
        </button>
        <button
          onClick={() => setScreen('game')}
          style={{
            background: '#c9a84c',
            color: '#0d0b08',
            border: 'none',
            padding: '0.75rem 2rem',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Vivir →
        </button>
      </div>
    </div>
  );
}
