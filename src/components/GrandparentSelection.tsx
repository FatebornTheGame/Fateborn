import { useState } from 'react';
import { archetypes } from '../data/archetypes';
import type { Archetype, Gender, Selection } from '../types';

const GENDER = {
  abuelo: {
    label: 'Abuelo',
    symbol: '♂',
    color: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.25)',
    bg: 'rgba(147, 197, 253, 0.07)',
    border: 'rgba(147, 197, 253, 0.35)',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
  },
  abuela: {
    label: 'Abuela',
    symbol: '♀',
    color: '#f9a8d4',
    glow: 'rgba(249, 168, 212, 0.25)',
    bg: 'rgba(249, 168, 212, 0.07)',
    border: 'rgba(249, 168, 212, 0.35)',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
  },
} as const;

function StatBar({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          color: '#6b7280',
          fontSize: '10px',
          width: '76px',
          textAlign: 'right',
          flexShrink: 0,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '99px',
          height: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value * 10}%`,
            height: '100%',
            background: color,
            borderRadius: '99px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <span
        style={{
          color: '#4b5563',
          fontSize: '10px',
          width: '14px',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ArchetypeCard({
  archetype,
  selection,
  onAssign,
  abuelosCount,
  abuelasCount,
}: {
  archetype: Archetype;
  selection: Selection | undefined;
  onAssign: (id: string, gender: Gender) => void;
  abuelosCount: number;
  abuelasCount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const selectedGender = selection?.gender;
  const isSelected = !!selectedGender;

  const accentColor = selectedGender
    ? GENDER[selectedGender].color
    : archetype.accentColor;

  const canAssign = (gender: Gender) => {
    if (selectedGender === gender) return true; // deselect
    if (selectedGender && selectedGender !== gender) {
      return gender === 'abuelo' ? abuelosCount < 2 : abuelasCount < 2;
    }
    return gender === 'abuelo' ? abuelosCount < 2 : abuelasCount < 2;
  };

  const borderColor = isSelected
    ? GENDER[selectedGender].border
    : hovered
    ? archetype.accentColor + '60'
    : archetype.accentColor + '22';

  const boxShadow = isSelected
    ? `0 0 24px ${GENDER[selectedGender].glow}, 0 0 80px ${GENDER[selectedGender].glow}`
    : hovered
    ? `0 0 16px ${archetype.accentColor}20`
    : 'none';

  const cardBg = isSelected
    ? GENDER[selectedGender].bg
    : hovered
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(10, 8, 18, 0.8)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        background: cardBg,
        boxShadow,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Gender badge */}
      {selectedGender && (
        <div
          style={{
            position: 'absolute',
            top: '-11px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '2px 12px',
            borderRadius: '99px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: GENDER[selectedGender].badgeBg,
            border: `1px solid ${GENDER[selectedGender].border}`,
            color: GENDER[selectedGender].color,
            whiteSpace: 'nowrap',
            fontFamily: "'Cinzel', serif",
          }}
        >
          {GENDER[selectedGender].symbol} {GENDER[selectedGender].label}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <span style={{ fontSize: '26px', lineHeight: 1 }}>{archetype.symbol}</span>
        <div>
          <div
            className="cinzel"
            style={{
              color: accentColor,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
          >
            {archetype.name}
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className="crimson"
        style={{
          color: '#6b7280',
          fontSize: '13px',
          lineHeight: '1.55',
          marginBottom: '14px',
          flexGrow: 0,
        }}
      >
        {archetype.description}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', flex: 1 }}>
        {archetype.stats.map((stat) => (
          <StatBar key={stat.name} name={stat.name} value={stat.value} color={accentColor} />
        ))}
      </div>

      {/* Gender buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['abuelo', 'abuela'] as Gender[]).map((gender) => {
          const cfg = GENDER[gender];
          const isActive = selectedGender === gender;
          const disabled = !canAssign(gender);

          return (
            <button
              key={gender}
              onClick={() => !disabled && onAssign(archetype.id, gender)}
              disabled={disabled}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '8px',
                border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? cfg.badgeBg : 'rgba(255,255,255,0.02)',
                color: isActive ? cfg.color : disabled ? '#2d3748' : '#4b5563',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Cinzel', serif",
              }}
            >
              {cfg.symbol} {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectionSlot({ archetype, gender }: { archetype?: Archetype; gender: Gender }) {
  const cfg = GENDER[gender];
  const filled = !!archetype;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '10px',
        border: `1px solid ${filled ? cfg.border : 'rgba(255,255,255,0.06)'}`,
        background: filled ? cfg.bg : 'rgba(255,255,255,0.02)',
        minWidth: '140px',
        transition: 'all 0.3s ease',
      }}
    >
      {filled ? (
        <>
          <span style={{ fontSize: '16px' }}>{archetype!.symbol}</span>
          <span
            className="cinzel"
            style={{ color: cfg.color, fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}
          >
            {archetype!.name}
          </span>
        </>
      ) : (
        <span
          className="crimson"
          style={{ color: '#2d3748', fontSize: '13px', fontStyle: 'italic' }}
        >
          — vacío —
        </span>
      )}
    </div>
  );
}

export default function GrandparentSelection({ onConfirm }: { onConfirm: (selections: Selection[]) => void }) {
  const [selections, setSelections] = useState<Selection[]>([]);

  const abuelosCount = selections.filter((s) => s.gender === 'abuelo').length;
  const abuelasCount = selections.filter((s) => s.gender === 'abuela').length;
  const isComplete = abuelosCount === 2 && abuelasCount === 2;

  const handleAssign = (archetypeId: string, gender: Gender) => {
    const existing = selections.find((s) => s.archetypeId === archetypeId);

    if (existing?.gender === gender) {
      setSelections(selections.filter((s) => s.archetypeId !== archetypeId));
      return;
    }

    if (existing) {
      const targetCount = gender === 'abuelo' ? abuelosCount : abuelasCount;
      if (targetCount < 2) {
        setSelections(selections.map((s) => (s.archetypeId === archetypeId ? { ...s, gender } : s)));
      }
      return;
    }

    const targetCount = gender === 'abuelo' ? abuelosCount : abuelasCount;
    if (targetCount < 2) {
      setSelections([...selections, { archetypeId, gender }]);
    }
  };

  const getSlotArchetype = (gender: Gender, index: number): Archetype | undefined => {
    const genderSelections = selections.filter((s) => s.gender === gender);
    if (!genderSelections[index]) return undefined;
    return archetypes.find((a) => a.id === genderSelections[index].archetypeId);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(ellipse at 50% 0%, #0e0820 0%, #04030a 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1
          className="cinzel shimmer-text"
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            letterSpacing: '0.25em',
            margin: 0,
            lineHeight: 1,
          }}
        >
          FATEBORN
        </h1>
        <p
          className="crimson"
          style={{
            color: '#4b5563',
            fontSize: '16px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: '10px',
            fontStyle: 'italic',
          }}
        >
          El linaje forja tu destino
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)',
          margin: '20px 0',
        }}
      />

      {/* Instruction */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <p
          className="cinzel"
          style={{
            color: '#9ca3af',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Elige 2 abuelos y 2 abuelas para forjar tu herencia
        </p>
      </div>

      {/* Selection summary */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '36px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Abuelos */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span
            className="cinzel"
            style={{ color: GENDER.abuelo.color, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            {GENDER.abuelo.symbol} Abuelos ({abuelosCount}/2)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SelectionSlot archetype={getSlotArchetype('abuelo', 0)} gender="abuelo" />
            <SelectionSlot archetype={getSlotArchetype('abuelo', 1)} gender="abuelo" />
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: '1px',
            background: 'rgba(255,255,255,0.06)',
            alignSelf: 'stretch',
          }}
        />

        {/* Abuelas */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span
            className="cinzel"
            style={{ color: GENDER.abuela.color, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            {GENDER.abuela.symbol} Abuelas ({abuelasCount}/2)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SelectionSlot archetype={getSlotArchetype('abuela', 0)} gender="abuela" />
            <SelectionSlot archetype={getSlotArchetype('abuela', 1)} gender="abuela" />
          </div>
        </div>
      </div>

      {/* Archetype grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '1100px',
          marginBottom: '40px',
        }}
      >
        {archetypes.map((archetype) => (
          <ArchetypeCard
            key={archetype.id}
            archetype={archetype}
            selection={selections.find((s) => s.archetypeId === archetype.id)}
            onAssign={handleAssign}
            abuelosCount={abuelosCount}
            abuelasCount={abuelasCount}
          />
        ))}
      </div>

      {/* Confirm button */}
      <button
        onClick={() => isComplete && onConfirm(selections)}
        disabled={!isComplete}
        style={{
          padding: '14px 48px',
          borderRadius: '10px',
          border: `1px solid ${isComplete ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.06)'}`,
          background: isComplete
            ? 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(79,70,229,0.3))'
            : 'rgba(255,255,255,0.02)',
          color: isComplete ? '#c4b5fd' : '#374151',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: isComplete ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          fontFamily: "'Cinzel', serif",
          boxShadow: isComplete ? '0 0 30px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.08)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (isComplete) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 40px rgba(139,92,246,0.35), 0 0 100px rgba(139,92,246,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (isComplete) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 30px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.08)';
          }
        }}
      >
        {isComplete ? 'Comenzar el Viaje →' : `Selecciona ${4 - selections.length} arquetipo${4 - selections.length !== 1 ? 's' : ''} más`}
      </button>
    </div>
  );
}
