import type { Rival, Country } from '../store/gameStore';

const RIVAL_NAMES_M = ['Alejandro', 'Rodrigo', 'Marcos', 'Víctor', 'Sergio', 'Daniel', 'Pablo', 'Adrián'];
const RIVAL_NAMES_F = ['Laura', 'Sofía', 'Elena', 'Carmen', 'Lucía', 'Isabel', 'Valeria', 'Andrea'];
const RIVAL_ARCHETYPES = ['Académico', 'Emprendedor', 'Político', 'Artista', 'Atleta', 'Mercader', 'Abogado', 'Militar'];

export function generateRival(country: Country, gender: 'hombre' | 'mujer'): Rival {
  const names = gender === 'hombre' ? RIVAL_NAMES_F : RIVAL_NAMES_M;
  const name = names[Math.floor(Math.random() * names.length)];
  const archetype = RIVAL_ARCHETYPES[Math.floor(Math.random() * RIVAL_ARCHETYPES.length)];
  const threat = 20 + Math.floor(Math.random() * 40) + (country.tier === 1 ? 20 : 0);

  const descriptions: Record<string, string> = {
    'Académico': `${name} destaca en los mismos círculos intelectuales que tú. Su disciplina es admirable.`,
    'Emprendedor': `${name} ya ha lanzado su primer negocio. Su ambición iguala o supera a la tuya.`,
    'Político': `${name} tiene contactos que tú no tienes. Sabe cómo mover los hilos del poder.`,
    'Artista': `${name} ha ganado reconocimiento que tú aún no tienes. El público lo adora.`,
    'Atleta': `${name} encarna todo lo que la disciplina física puede lograr. Un rival temible.`,
    'Mercader': `${name} entiende el dinero de una forma que te resulta natural pero amenazante.`,
    'Abogado': `${name} conoce las leyes mejor que nadie. Peligroso tenerlo en contra.`,
    'Militar': `${name} tiene la disciplina y los contactos de una institución poderosa.`,
  };

  return {
    name,
    archetype,
    description: descriptions[archetype] ?? `${name} es alguien que compite en tu mismo campo.`,
    threat: Math.min(100, threat),
  };
}
