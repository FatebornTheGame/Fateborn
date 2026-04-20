export type CountryTier = 'A' | 'B' | 'C' | 'D'

export interface Country {
  name:      string
  birthYear: number   // typical birth year for generation — 1970-1990 range
  region:    string
  tier:      CountryTier  // economic tier: A=rich, B=developed, C=emerging, D=developing
}

export const COUNTRIES: Country[] = [
  { name: 'España',    birthYear: 1980, region: 'Europa',          tier: 'B' },
  { name: 'Portugal',  birthYear: 1980, region: 'Europa',          tier: 'B' },
  { name: 'Francia',   birthYear: 1980, region: 'Europa',          tier: 'A' },
  { name: 'Alemania',  birthYear: 1980, region: 'Europa',          tier: 'A' },
  { name: 'Italia',    birthYear: 1980, region: 'Europa',          tier: 'B' },
  { name: 'México',    birthYear: 1982, region: 'América Latina',  tier: 'C' },
  { name: 'Brasil',    birthYear: 1982, region: 'América Latina',  tier: 'C' },
  { name: 'Argentina', birthYear: 1982, region: 'América Latina',  tier: 'C' },
  { name: 'Colombia',  birthYear: 1982, region: 'América Latina',  tier: 'C' },
  { name: 'Nigeria',   birthYear: 1985, region: 'África',          tier: 'D' },
  { name: 'Sudáfrica', birthYear: 1984, region: 'África',          tier: 'C' },
  { name: 'India',     birthYear: 1983, region: 'Asia',            tier: 'D' },
  { name: 'Japón',     birthYear: 1980, region: 'Asia',            tier: 'A' },
  { name: 'China',     birthYear: 1982, region: 'Asia',            tier: 'C' },
]

export const DEFAULT_COUNTRY = 'España'

export function getCountryBirthYear(countryName: string): number {
  return COUNTRIES.find(c => c.name === countryName)?.birthYear ?? 1980
}

export function getCountryTier(countryName: string): CountryTier {
  return COUNTRIES.find(c => c.name === countryName)?.tier ?? 'B'
}
