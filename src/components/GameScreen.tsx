import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateWorldInit } from '../systems/worldSystem';
import StatusBar from './StatusBar';
import InitiativePanel from './InitiativePanel';
import NarrativeFeed from './NarrativeFeed';
import LifeTimeline from './LifeTimeline';

const GOLD = '#c9a84c';

export default function GameScreen() {
  const character       = useGameStore(s => s.character);
  const country         = useGameStore(s => s.country);
  const addFeedEntry    = useGameStore(s => s.addFeedEntry);
  const updateEconomy   = useGameStore(s => s.updateEconomy);
  const setRival        = useGameStore(s => s.setRival);
  const addFlag         = useGameStore(s => s.addFlag);
  const setNarrativeAge = useGameStore(s => s.setNarrativeAge);
  const narrativeFeed   = useGameStore(s => s.narrativeFeed);
  const time            = useGameStore(s => s.time);

  const initialized = useRef(false);

  // Auto-events on first load
  useEffect(() => {
    if (!character) return;
    if (initialized.current) return;
    if (character.flags?.gamescreen_initialized) return;
    initialized.current = true;

    // Set starting age to 18 if not set
    if (time.narrativeAge === 0) {
      setNarrativeAge(18);
    }

    const { feedEntries, economyPatch, rival } = generateWorldInit(character, country);

    updateEconomy(economyPatch);
    setRival(rival);
    addFlag('gamescreen_initialized', true);
    addFlag('rival_conocido', true);

    // Add feed entries with slight delay for effect
    feedEntries.forEach((entry, i) => {
      setTimeout(() => addFeedEntry(entry), i * 120);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.name]);

  // Tab state for mobile
  const [activeTab, setActiveTab] = useState<'initiative' | 'feed'>('initiative');

  if (!character) return null;

  const pendingCount = narrativeFeed.filter(e => !e.answered && e.responseOptions?.length).length;

  return (
    <div
      className="leather-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,3,2,0.75) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Status Bar */}
        <StatusBar />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <div className="desktop-layout" style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
            {/* Left: Initiative Panel 55% */}
            <div style={{
              width: '55%',
              borderRight: '1px solid rgba(201,168,76,0.1)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <InitiativePanel />
            </div>

            {/* Right: Narrative Feed 45% */}
            <div style={{
              width: '45%',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 14px 8px',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
                flexShrink: 0,
              }}>
                <p className="cinzel" style={{
                  fontSize: '9px', letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.35)',
                  margin: 0,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  Feed Narrativo
                  {pendingCount > 0 && (
                    <span style={{
                      fontSize: '8px', padding: '1px 5px', borderRadius: '10px',
                      background: 'rgba(201,168,76,0.18)', color: GOLD,
                    }}>
                      {pendingCount} pendiente
                    </span>
                  )}
                </p>
              </div>
              <NarrativeFeed />
            </div>
          </div>
        </div>

        {/* Mobile tab CSS injected via style tag */}
        <style>{`
          @media (max-width: 767px) {
            .desktop-layout > div:nth-child(1) {
              display: ${activeTab === 'initiative' ? 'flex' : 'none'} !important;
              width: 100% !important;
              border-right: none !important;
            }
            .desktop-layout > div:nth-child(2) {
              display: ${activeTab === 'feed' ? 'flex' : 'none'} !important;
              width: 100% !important;
            }
            .mobile-tabs { display: flex !important; }
          }
          @media (min-width: 768px) {
            .mobile-tabs { display: none !important; }
          }
          @keyframes critica-pulse {
            0%, 100% { box-shadow: 0 0 0 rgba(201,168,76,0); border-color: rgba(201,168,76,0.6); }
            50%       { box-shadow: 0 0 18px rgba(201,168,76,0.25); border-color: rgba(201,168,76,0.9); }
          }
          @keyframes urgent-pulse {
            0%, 100% { box-shadow: none; }
            50%       { box-shadow: 0 0 12px rgba(201,168,76,0.18); }
          }
        `}</style>

        {/* Mobile tab bar */}
        <div
          className="mobile-tabs"
          style={{
            display: 'none',
            borderTop: '1px solid rgba(201,168,76,0.15)',
            background: 'rgba(13,11,8,0.96)',
            backdropFilter: 'blur(12px)',
            flexShrink: 0,
          }}
        >
          {([
            { id: 'initiative' as const, label: 'Iniciativas', icon: '◈' },
            { id: 'feed'       as const, label: 'Feed',        icon: '◉' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 8px',
                background: 'transparent', border: 'none',
                borderTop: `2px solid ${activeTab === tab.id ? GOLD : 'transparent'}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '3px',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{tab.icon}</span>
              <span className="cinzel" style={{
                fontSize: '8px', letterSpacing: '0.12em',
                color: activeTab === tab.id ? GOLD : 'rgba(201,168,76,0.35)',
                textTransform: 'uppercase',
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Life Timeline */}
        <LifeTimeline />
      </div>
    </div>
  );
}
