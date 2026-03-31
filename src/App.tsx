import { useState } from 'react';
import './App.css';
import GrandparentSelection from './components/GrandparentSelection';
import BirthScreen from './components/BirthScreen';
import ChildhoodScreen from './components/ChildhoodScreen';
import type { Character } from './types';

type Screen = 'ancestors' | 'birth' | 'childhood' | 'game';

function App() {
  const [screen, setScreen]       = useState<Screen>('ancestors');
  const [ancestorIds, setAncestorIds] = useState<string[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);

  const handleAncestorsConfirmed = (ids: string[]) => {
    setAncestorIds(ids);
    setScreen('birth');
  };

  const handleBirthConfirmed = (char: Character) => {
    setCharacter(char);
    setScreen('childhood');
  };

  const handleChildhoodComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('game');
  };

  if (screen === 'ancestors') {
    return <GrandparentSelection onConfirm={handleAncestorsConfirmed} />;
  }

  if (screen === 'birth') {
    return (
      <BirthScreen
        ancestorIds={ancestorIds}
        onConfirm={handleBirthConfirmed}
      />
    );
  }

  if (screen === 'childhood' && character) {
    return (
      <ChildhoodScreen
        character={character}
        onComplete={handleChildhoodComplete}
      />
    );
  }

  // Placeholder — Adolescencia en construcción
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0b08',
      color: '#e8d08a',
      fontFamily: "'Cinzel', serif",
      gap: '20px',
      textAlign: 'center',
      padding: '40px',
    }}>
      <img
        src="/fateborn_title.png"
        alt="FATEBORN"
        style={{ width: '320px', mixBlendMode: 'screen', marginBottom: '8px' }}
      />
      <h2 style={{ fontSize: '14px', letterSpacing: '0.3em', color: '#c9a84c', margin: 0 }}>
        {character?.name}
      </h2>
      <p style={{ fontSize: '12px', letterSpacing: '0.15em', color: '#3a2a18', margin: 0 }}>
        La adolescencia está en construcción...
      </p>
      <button
        onClick={() => setScreen('ancestors')}
        style={{
          marginTop: '24px',
          padding: '10px 28px',
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'rgba(201,168,76,0.06)',
          color: '#c9a84c',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          letterSpacing: '0.15em',
        }}
      >
        ← Nueva Partida
      </button>
    </div>
  );
}

export default App;
