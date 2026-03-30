export interface Stat {
  name: string;
  value: number;
}

export interface Archetype {
  id: string;
  name: string;
  symbol: string;
  description: string;
  accentColor: string;
  stats: Stat[];
}

export type Gender = 'abuelo' | 'abuela';

export interface Selection {
  archetypeId: string;
  gender: Gender;
}
