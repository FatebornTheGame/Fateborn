import type { Country } from '../data/countries'
import { COLOR_GOLD } from '../constants/game.constants'

interface Props {
  countries:       Country[]
  selectedCountry: string
  onChange:        (country: string) => void
}

export function CountrySelector({ countries, selectedCountry, onChange }: Props) {
  // Group by region
  const byRegion = countries.reduce<Record<string, Country[]>>((acc, c) => {
    const list = acc[c.region] ?? []
    return { ...acc, [c.region]: [...list, c] }
  }, {})

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[10px] font-cinzel uppercase tracking-widest mb-1 block opacity-50"
        style={{ color: COLOR_GOLD }}
      >
        País de nacimiento
      </label>
      <select
        value={selectedCountry}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 text-sm font-cinzel bg-transparent outline-none cursor-pointer"
        style={{
          border: `1px solid ${COLOR_GOLD}55`,
          color:  COLOR_GOLD,
          // Custom arrow
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A84C' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight:       '30px',
        }}
      >
        {Object.entries(byRegion).map(([region, countries]) => (
          <optgroup key={region} label={region} style={{ background: '#0d0b08', color: '#C9A84C' }}>
            {countries.map(c => (
              <option key={c.name} value={c.name} style={{ background: '#141210' }}>
                {c.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
