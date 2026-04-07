// Countries — Fateborn
// 20 países jugables con tier y modificadores económicos/sociales.

import type { Country } from '../store/gameStore';

export const COUNTRIES: Country[] = [
  // ── Tier 1 — Países desarrollados ────────────────────────────────────────
  { nombre: 'Alemania',      tier: 1, modificadores: { costovida: 1.2, oportunidad: 1.3, estabilidad: 1.4, sanidad: 1.5, educacion: 1.4 } },
  { nombre: 'Canadá',        tier: 1, modificadores: { costovida: 1.1, oportunidad: 1.3, estabilidad: 1.4, sanidad: 1.4, educacion: 1.4 } },
  { nombre: 'Estados Unidos', tier: 1, modificadores: { costovida: 1.3, oportunidad: 1.5, estabilidad: 1.2, sanidad: 1.0, educacion: 1.3 } },
  { nombre: 'Japón',         tier: 1, modificadores: { costovida: 1.2, oportunidad: 1.2, estabilidad: 1.5, sanidad: 1.5, educacion: 1.5 } },
  { nombre: 'Noruega',       tier: 1, modificadores: { costovida: 1.4, oportunidad: 1.2, estabilidad: 1.5, sanidad: 1.5, educacion: 1.5 } },
  { nombre: 'Australia',     tier: 1, modificadores: { costovida: 1.2, oportunidad: 1.3, estabilidad: 1.4, sanidad: 1.4, educacion: 1.4 } },
  // ── Tier 2 — Países emergentes ────────────────────────────────────────────
  { nombre: 'España',        tier: 2, modificadores: { costovida: 1.0, oportunidad: 1.0, estabilidad: 1.2, sanidad: 1.4, educacion: 1.1 } },
  { nombre: 'Italia',        tier: 2, modificadores: { costovida: 1.0, oportunidad: 0.9, estabilidad: 1.1, sanidad: 1.3, educacion: 1.1 } },
  { nombre: 'Brasil',        tier: 2, modificadores: { costovida: 0.7, oportunidad: 0.9, estabilidad: 0.9, sanidad: 0.8, educacion: 0.9 } },
  { nombre: 'México',        tier: 2, modificadores: { costovida: 0.6, oportunidad: 0.9, estabilidad: 0.8, sanidad: 0.8, educacion: 0.9 } },
  { nombre: 'Argentina',     tier: 2, modificadores: { costovida: 0.5, oportunidad: 0.8, estabilidad: 0.7, sanidad: 0.9, educacion: 1.0 } },
  { nombre: 'Corea del Sur', tier: 2, modificadores: { costovida: 1.0, oportunidad: 1.2, estabilidad: 1.3, sanidad: 1.3, educacion: 1.4 } },
  // ── Tier 3 — Países en desarrollo ────────────────────────────────────────
  { nombre: 'India',         tier: 3, modificadores: { costovida: 0.3, oportunidad: 0.7, estabilidad: 0.7, sanidad: 0.6, educacion: 0.7 } },
  { nombre: 'Egipto',        tier: 3, modificadores: { costovida: 0.3, oportunidad: 0.5, estabilidad: 0.6, sanidad: 0.5, educacion: 0.6 } },
  { nombre: 'Colombia',      tier: 3, modificadores: { costovida: 0.4, oportunidad: 0.6, estabilidad: 0.6, sanidad: 0.6, educacion: 0.7 } },
  { nombre: 'Marruecos',     tier: 3, modificadores: { costovida: 0.3, oportunidad: 0.5, estabilidad: 0.7, sanidad: 0.5, educacion: 0.6 } },
  { nombre: 'Rusia',         tier: 3, modificadores: { costovida: 0.5, oportunidad: 0.7, estabilidad: 0.5, sanidad: 0.7, educacion: 0.8 } },
  // ── Tier 4 — Países frágiles ──────────────────────────────────────────────
  { nombre: 'Venezuela',     tier: 4, modificadores: { costovida: 0.2, oportunidad: 0.3, estabilidad: 0.2, sanidad: 0.3, educacion: 0.4 } },
  { nombre: 'Nigeria',       tier: 4, modificadores: { costovida: 0.2, oportunidad: 0.4, estabilidad: 0.3, sanidad: 0.2, educacion: 0.3 } },
  { nombre: 'Sudán',         tier: 4, modificadores: { costovida: 0.1, oportunidad: 0.2, estabilidad: 0.2, sanidad: 0.2, educacion: 0.2 } },
];

export const TIER_LABELS: Record<number, string> = {
  1: 'Desarrollado',
  2: 'Emergente',
  3: 'En desarrollo',
  4: 'Frágil',
};

export const TIER_COLORS: Record<number, string> = {
  1: '#c9a84c',
  2: '#7eb8f7',
  3: '#6ee7a0',
  4: '#8b1a2a',
};
