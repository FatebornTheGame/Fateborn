import { useState } from 'react';
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

type Screen = 'ancestors' | 'birth' | 'childhood' | 'adolescence' | 'youth' | 'adulthood' | 'maturity' | 'oldage' | 'death';

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

  if (screen === 'adolescence' && character) {
    return (
      <AdolescenceScreen
        character={character}
        onComplete={handleAdolescenceComplete}
      />
    );
  }

  if (screen === 'youth' && character) {
    return (
      <YouthScreen
        character={character}
        onComplete={handleYouthComplete}
      />
    );
  }

  if (screen === 'adulthood' && character) {
    return (
      <AdulthoodScreen
        character={character}
        onComplete={handleAdulthoodComplete}
      />
    );
  }

  if (screen === 'maturity' && character) {
    return (
      <MaturityScreen
        character={character}
        onComplete={handleMaturityComplete}
      />
    );
  }

  if (screen === 'oldage' && character) {
    return (
      <OldAgeScreen
        character={character}
        onComplete={handleOldAgeComplete}
      />
    );
  }

  if (screen === 'death' && character) {
    return (
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

  return null;
}

export default App;
