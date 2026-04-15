import type { Archetype } from '../types/archetype.types'
import { colors, fonts }  from '../styles/tokens'

interface Props {
  ancestors: [Archetype | null, Archetype | null, Archetype | null, Archetype | null]
  country:   string
}

// Slots 1 y 3 son abuelas — convertir nombre de arquetipo a forma femenina
const FEMININE_MAP: Record<string, string> = {
  'Académico':   'Académica',
  'Filósofo':    'Filósofa',
  'Emprendedor': 'Emprendedora',
  'Cuidador':    'Cuidadora',
  'Explorador':  'Exploradora',
  // Atleta, Artista, Líder son invariables en español
}

function femininize(name: string): string {
  return FEMININE_MAP[name] ?? name
}

function buildNarrative(
  ancestors: [Archetype | null, Archetype | null, Archetype | null, Archetype | null],
  country:   string
): string {
  const [gp, gm, mg, mm] = ancestors
  if (!gp && !gm && !mg && !mm) return ''

  // gm = slot 1 (abuela paterna), mm = slot 3 (abuela materna)
  const gmName = gm ? femininize(gm.name).toLowerCase() : ''
  const mmName = mm ? femininize(mm.name).toLowerCase() : ''

  const paternalLine = gp && gm
    ? `Tu padre nació de la unión de ${gp.name.toLowerCase()} y ${gmName}.`
    : gp
      ? `Tu padre lleva la herencia del ${gp.name.toLowerCase()}.`
      : gm
        ? `Tu padre lleva la herencia de la ${gmName}.`
        : ''

  const maternalLine = mg && mm
    ? `Tu madre nació de la unión de ${mg.name.toLowerCase()} y ${mmName}.`
    : mg
      ? `Tu madre lleva la herencia del ${mg.name.toLowerCase()}.`
      : mm
        ? `Tu madre lleva la herencia de la ${mmName}.`
        : ''

  const lines = [paternalLine, maternalLine].filter(Boolean)
  if (lines.length === 0) return ''

  return `${lines.join(' ')} En ${country}, esta es la historia que precede la tuya.`
}

export function AncestralNarrative({ ancestors, country }: Props) {
  const narrative = buildNarrative(ancestors, country)
  if (!narrative) return null

  return (
    <p style={{
      fontFamily: fonts.body,
      fontStyle:  'italic',
      fontSize:   '0.95rem',
      color:      colors.text.narrative,
      lineHeight: 1.9,
      margin:     0,
    }}>
      {narrative}
    </p>
  )
}
