# FATEBORN — Game Design Document

## Concepto
Simulador de vida RPG / Roguelike narrativo. El jugador elige 4 ancestros arquetipos, hereda su genética combinada y navega una vida completa con decisiones de consecuencias reales y diferidas. Al morir el legado persiste en generaciones futuras (Modo Dinastía).

## Stack técnico
React + TypeScript + Zustand + Tailwind CSS + Vite + Vercel

## Estructura del proyecto
- /src/components — componentes React
- /src/data — arquetipos y eventos en JSON
- /src/types — tipos TypeScript
- /public — assets estáticos (logo, banner)

## Los 9 stats (escala 0-10, agrupados en 3x3)
COGNITIVO: Lógica, Creatividad, Disciplina
SOCIAL: Carisma, Emocional, Ambición
VITAL: Físico, Riesgo, Estabilidad

## Estructura de ancestros
- Slots 1 y 3: abuelos masculinos
- Slots 2 y 4: abuelas femeninas
- Slots 1+2: línea paterna (forjan al padre)
- Slots 3+4: línea materna (forjan a la madre)

## Herencia genética
Stats del personaje = promedio de los 4 ancestros + mutación aleatoria ±10%

## Identidad visual
- Fondo: cuero oscuro #0d0b08
- Dorado: #C9A84C (abuelos, elementos principales)
- Granate: #8B1A2A (abuelas, acentos)
- Tipografía narrativa: Cinzel (serif elegante)
- Tipografía UI: sin serif limpia

## Etapas vitales
Infancia (0-12) → Adolescencia (13-18) → Juventud (19-30) → Adultez (31-50) → Madurez (51-70) → Vejez (71+)

## Pantallas construidas
1. GrandparentSelection — selección de 4 ancestros
2. BirthScreen — narrativa de nacimiento + stats heredados + genes ocultos
3. ChildhoodScreen — Infancia con eventos narrativos
4. AdolescenceScreen — Adolescencia con eventos narrativos
5. YouthScreen — Juventud con eventos narrativos
6. AdulthoodScreen — Adultez con eventos narrativos
7. MaturityScreen — Madurez con eventos narrativos
8. OldAgeScreen — Vejez con eventos narrativos
9. DeathScreen — Resumen de vida, epitafio dinámico, puntuación de legado

## Sistema de stats dinámicos
- Cada decisión del jugador modifica los 9 stats vía `statDeltas` en cada EventOption
- La función `applyDeltas` aplica los cambios con clamp 0-10 y 1 decimal
- Al confirmar una decisión se dispara un flash visual en el `StatsPanel`:
  - Positivo: número parpadea en dorado (stat-flash-pos, 1s)
  - Negativo: número parpadea en granate (stat-flash-neg, 1s)
- El `StatsPanel` (botón Σ, esquina inferior izquierda) muestra los 9 stats en tiempo real agrupados en Cognitivo / Social / Vital, accesible desde cualquier pantalla de vida
- El epitafio final de DeathScreen usa el `dominantStat` del personaje como capa primaria de identidad si los flags no proveen un match

## Los 17 arquetipos de ancestros
Atleta, Académico, Artista, Líder, Obrero, Emprendedor, Cuidador, Explorador,
Filósofo, Médico, Militar, Político, Criminal, Marinero, Sacerdote, Mercader, Abogado

## Carrera: El Abogado (10 niveles)
1. Estudiante de derecho
2. Abogado junior
3. Abogado
4. Socio junior
5. Socio senior
6. Abogado de élite
7. Bufete propio
8. Referente nacional
9. Referente internacional
10. Leyenda del derecho

## Arcos narrativos especiales
### Arco "Breaking Bad"
Se desbloquea si: profesión científico/médico nivel ≥ 3 + diagnóstico terminal + deudas/familia dependiente + Ambición > 6.
Seis fases: Contacto → Primer Laboratorio → La Producción → La Escalada → El Punto de No Retorno → El Final (múltiple).
Contador "La línea que cruzaste" (0-100) visible en HUD.

### Arco "Saul Goodman" (pendiente de implementar)
Se desbloquea si: profesión Abogado nivel ≥ 3 + contacto con el mundo criminal + Ambición > 7 + al menos 1 cliente con antecedentes penales.
Fases previstas: El Caso Comprometido → Los Métodos Cuestionables → La Red Criminal → El Bufete en la Sombra → Blanqueo y Cárteles → El Final (huida / cárcel / leyenda oscura).
Mechanic clave: el contador "El precio de la victoria" (0-100) mide cuánto ha comprometido el personaje su ética profesional.
Conexión: puede cruzarse con el arco Breaking Bad si hay un personaje científico/médico en la misma familia.

## Próximas pantallas a construir
- Modo Dinastía (herencia generacional)

## Reglas de diseño
- Nunca hay game over seco — siempre hay reflexión narrativa
- Las decisiones tienen consecuencias diferidas, no inmediatas
- El juego recuerda todo mediante flags narrativos
- Tono siempre serio y realista, nunca absurdo
- Mismo estilo visual en todas las pantallas
