export interface Country {
  name:       string
  birthYear:  number   // typical birth year for generation — 1970-1990 range
  region:     string
}

export const COUNTRIES: Country[] = [
  { name: 'España',    birthYear: 1980, region: 'Europa' },
  { name: 'Portugal',  birthYear: 1980, region: 'Europa' },
  { name: 'Francia',   birthYear: 1980, region: 'Europa' },
  { name: 'Alemania',  birthYear: 1980, region: 'Europa' },
  { name: 'Italia',    birthYear: 1980, region: 'Europa' },
  { name: 'México',    birthYear: 1982, region: 'América Latina' },
  { name: 'Brasil',    birthYear: 1982, region: 'América Latina' },
  { name: 'Argentina', birthYear: 1982, region: 'América Latina' },
  { name: 'Colombia',  birthYear: 1982, region: 'América Latina' },
  { name: 'Nigeria',   birthYear: 1985, region: 'África' },
  { name: 'Sudáfrica', birthYear: 1984, region: 'África' },
  { name: 'India',     birthYear: 1983, region: 'Asia' },
  { name: 'Japón',     birthYear: 1980, region: 'Asia' },
  { name: 'China',     birthYear: 1982, region: 'Asia' },
]

export const DEFAULT_COUNTRY = 'España'

export function getCountryBirthYear(countryName: string): number {
  return COUNTRIES.find(c => c.name === countryName)?.birthYear ?? 1980
}
