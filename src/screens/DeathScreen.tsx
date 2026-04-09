import { useGameStore } from '../store/gameStore';

export default function DeathScreen() {
  const resetGame = useGameStore(s => s.resetGame);

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
      <h2 style={{ fontFamily: 'Cinzel, serif', color: '#8B1A2A', margin: 0 }}>
        El Final
      </h2>
      <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.2em' }}>
        DeathScreen — placeholder
      </p>
      <button
        onClick={() => resetGame()}
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
        Nueva vida →
      </button>
    </div>
  );
}
