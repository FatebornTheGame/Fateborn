import React, { useState, useEffect } from 'react';
import './App.css';
import GrandparentSelection from './components/GrandparentSelection';
import BirthScreen from './components/BirthScreen';
import ChildhoodScreen from './components/ChildhoodScreen';
import AdolescenceScreen from './components/AdolescenceScreen';
import YouthScreen from './components/YouthScreen';
import AdulthoodScreen from './components/AdulthoodScreen';
import MaturityScreen from './components/MaturityScreen';
import OldAgeScreen from './components/OldAgeScreen';
import DeathScreen from './components/DeathScreen';
import type { Character } from './types';
import { useAmbientMusic, FADE_MS_SLOW } from './hooks/useAmbientMusic';

const TRACK: Record<string, string | null> = {
  ancestors:   '/music/opening.mp3',
  birth:       '/music/opening.mp3',
  childhood:   '/music/young-filmmaker.mp3',
  adolescence: '/music/timelapse.mp3',
  youth:       '/music/viewpoint.mp3',
  adulthood:   '/music/dark-decision.mp3',
  maturity:    '/music/old-chantry.mp3',
  oldage:      '/music/cast-vejez.mp3',
  death:       '/music/cast-vejez.mp3',
};

type Screen = 'ancestors' | 'birth' | 'childhood' | 'adolescence' | 'youth' | 'adulthood' | 'maturity' | 'oldage' | 'death';

function App() {
  const [screen, setScreen]       = useState<Screen>('ancestors');
  const [ancestorIds, setAncestorIds] = useState<string[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const { play, muted, toggleMute } = useAmbientMusic();

  useEffect(() => {
    play(TRACK[screen] ?? null, screen === 'death' ? FADE_MS_SLOW : undefined);
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setScreen('adolescence');
  };

  const handleAdolescenceComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('youth');
  };

  const handleYouthComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('adulthood');
  };

  const handleAdulthoodComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('maturity');
  };

  const handleMaturityComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('oldage');
  };

  const handleOldAgeComplete = (updated: Character) => {
    setCharacter(updated);
    setScreen('death');
  };

  let content: React.ReactNode = null;

  if (screen === 'ancestors') {
    content = <GrandparentSelection onConfirm={handleAncestorsConfirmed} />;
  } else if (screen === 'birth') {
    content = (
      <BirthScreen
        ancestorIds={ancestorIds}
        onConfirm={handleBirthConfirmed}
      />
    );
  } else if (screen === 'childhood' && character) {
    content = (
      <ChildhoodScreen
        character={character}
        onComplete={handleChildhoodComplete}
      />
    );
  } else if (screen === 'adolescence' && character) {
    content = (
      <AdolescenceScreen
        character={character}
        onComplete={handleAdolescenceComplete}
      />
    );
  } else if (screen === 'youth' && character) {
    content = (
      <YouthScreen
        character={character}
        onComplete={handleYouthComplete}
      />
    );
  } else if (screen === 'adulthood' && character) {
    content = (
      <AdulthoodScreen
        character={character}
        onComplete={handleAdulthoodComplete}
      />
    );
  } else if (screen === 'maturity' && character) {
    content = (
      <MaturityScreen
        character={character}
        onComplete={handleMaturityComplete}
      />
    );
  } else if (screen === 'oldage' && character) {
    content = (
      <OldAgeScreen
        character={character}
        onComplete={handleOldAgeComplete}
      />
    );
  } else if (screen === 'death' && character) {
    content = (
      <DeathScreen
        character={character}
        onRestart={() => {
          setCharacter(null);
          setAncestorIds([]);
          setScreen('ancestors');
        }}
      />
    );
  }

  return (
    <>
      {content}

      {/* Mute button — fixed top-right, visible on all screens */}
      <button
        onClick={toggleMute}
        title={muted ? 'Activar música' : 'Silenciar música'}
        style={{
          position: 'fixed',
          top: '18px',
          right: '20px',
          zIndex: 9999,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.25)',
          background: 'rgba(13,11,8,0.72)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20,16,10,0.88)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.25)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,11,8,0.72)';
        }}
      >
        {muted ? (
          /* Speaker muted icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Speaker on icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}

export default App;
