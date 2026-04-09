import { useGameStore } from '../store/gameStore';

export default function StartScreen() {
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
      <h1 style={{ fontFamily: 'Cinzel, serif', color: '#c9a84c', fontSize: '3rem', margin: 0 }}>
        FATEBORN
      </h1>
      <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.2em' }}>
        StartScreen — placeholder
      </p>
      <button
        onClick={() => setScreen('ancestors')}
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
        Comenzar →
      </button>
    </div>
  );
}
