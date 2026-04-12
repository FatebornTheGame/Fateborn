# FATEBORN — Documento de Proyecto

> "DE SU SANGRE NACES. DE TUS DECISIONES TE FORJAS."

El mejor simulador de vida jamás creado. RPG narrativo estratégico donde el jugador hereda genética de 4 ancestros y navega una vida completa con decisiones de consecuencias reales y diferidas. Al morir, el legado persiste (Modo Dinastía).

---

## 1. STACK TÉCNICO

| Capa | Tecnología |
|------|-----------|
| UI | React 19 + TypeScript 5.9 |
| Estado | Zustand 5 |
| Estilos | Tailwind CSS v4 (@tailwindcss/vite) |
| Build | Vite 8 |
| Deploy | Vercel — fateborn.vercel.app |
| Runtime | ESM (`"type": "module"`) |

**tsconfig estricto:**
- `verbatimModuleSyntax: true` → todos los imports de tipo usan `import type`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- `strict: true`, `erasableSyntaxOnly: true`
- Sin `any` en ningún archivo

---

## 2. PATHS IMPORTANTES

```
Proyecto local:  C:\Users\F O R T Y W A N\fateborn
GitHub:          FatebornTheGame/Fateborn
Deploy:          fateborn.vercel.app
Assets:          public/
Música:          public/music/
```

---

## 3. ARQUITECTURA DE CARPETAS

```
src/
  constants/        → game.constants.ts (sin magic numbers)
  types/            → game.types.ts, archetype.types.ts
  data/
    archetypes.ts   → 17 arquetipos con stats
    countries.ts    → 14 países agrupados por región
    events/
      childhoodEvents.ts      → 5 eventos ages 6-12
      adolescenceEvents.ts    → 7 eventos ages 13-18
    npcs/
      npcProfiles.ts          → name pools + BEST_FRIEND_PARALLEL_ARC
  systems/          → motor puro (sin UI)
    engineCore.ts   → processGameTurn(), prepareQuarter(), commitEventChoice()
    epitaphSystem.ts
    memorySystem.ts
    npcLifeSystem.ts
    lifestyleSystem.ts
  store/
    gameStore.ts    → Zustand store central
  hooks/
    useGameEngine.ts
    useNarrativeFeed.ts
    useLifestyle.ts
    useTypingAnimation.ts
  components/       → componentes reutilizables con responsabilidad única
  screens/          → pantallas completas
  utils/
    audio.ts        → playMusic(), stopMusic() con fade
  test/
    engineTest.ts   → simulación 25 años en consola
```

---

## 4. MOTOR INVISIBLE (src/systems/)

El motor es **funcional puro**: `f(state, input) = newState`. Sin efectos secundarios. Validado con `npx tsx src/test/engineTest.ts`.

### engineCore.ts — API pública

```typescript
// Flujo UI: preparar trimestre (sin evento) → mostrar evento → confirmar opción
prepareQuarter(state, allocation): QuarterPrep
commitEventChoice(state, event, optionId): GameState

// Flujo test/batch:
processGameTurn(state, allocation, resolveEvent?): TurnResult
processMultipleQuarters(state, allocation, count): GameState
```

### Sistemas activos

| Sistema | Responsabilidad |
|---------|----------------|
| `engineCore` | Orquesta turno completo: asignación → consecuencias → NPCs → evento |
| `epitaphSystem` | Genera texto de epitafio dinámico desde seeds acumuladas |
| `memorySystem` | Memorias involuntarias que resurgen por contexto compartido |
| `npcLifeSystem` | Avanza arcos paralelos de NPCs, gestiona muerte estocástica |
| `lifestyleSystem` | 7 estilos de vida con allocations y efectos pasivos por trimestre |

### Flujo de un trimestre

1. Avanzar `totalQuarters + 1`, recalcular `ageYears`
2. Aplicar efectos de `TimeAllocation` sobre stats
3. Procesar `pendingConsequences` (por edad, flag, o triggerYearsAfter)
4. Avanzar vidas paralelas de NPCs
5. Buscar evento elegible para la edad actual
6. Si hay evento → pausar y esperar opción del jugador
7. Al confirmar → aplicar opción: stats, flags, NPC generado, nueva consecuencia diferida, memoria, epitafio

---

## 5. TIPOS FUNDAMENTALES (src/types/game.types.ts)

### Stats (9, escala 0-10, agrupados 3×3)

| Cognitivo | Social | Vital |
|-----------|--------|-------|
| Lógica | Carisma | Físico |
| Creatividad | Emocional | Riesgo |
| Disciplina | Ambición | Estabilidad |

### GameState

```typescript
interface GameState {
  character:           Character          // nombre, género, birthYear, país
  ageYears:            number
  totalQuarters:       number             // totalQuarters / 4 = ageYears
  stats:               Stats
  flags:               string[]           // flags narrativos acumulados
  friends:             Friend[]           // NPCs vivos con arco propio
  pendingConsequences: PendingConsequence[]
  memories:            Memory[]
  epitaph:             EpitaphState
  firedEvents:         string[]
  feed:                NarrativeEntry[]   // historial cronológico
  economy:             Economy
  career:              Career | null
  vitalLoad:           number             // 0-100
  legacyScore:         number
  sexualOrientation:   SexualOrientation  // heterosexual | homosexual | bisexual
  orientationRevealed: boolean
}
```

### StatDeltaResolver

```typescript
// Los statDeltas pueden ser estáticos o dinámicos (función del estado)
type StatDeltaResolver = Partial<Stats> | ((state: GameState) => Partial<Stats>)
```

---

## 6. DATOS

### 17 Arquetipos de ancestros
Atleta, Académico, Artista, Líder, Obrero, Emprendedor, Cuidador, Explorador, Filósofo, Médico, Militar, Político, Criminal, Marinero, Sacerdote, Mercader, Abogado.

Cada uno tiene: `id`, `name`, `description`, `lore` (frase evocadora), `stats: Stats`.

### Herencia genética
```
Stats heredados = promedio(4 ancestros) × (1 ± random 10%)
Genes ocultos = potencial máximo de ancestros que no se expresó
```

### Slots de ancestros
- Slot 0 (abuelo paterno) + Slot 1 (abuela paterna) → forjan al padre
- Slot 2 (abuelo materno) + Slot 3 (abuela materna) → forjan a la madre

### Eventos implementados

**Infancia (ages 6-12):**
| ID | Edad | Descripción |
|----|------|-------------|
| `first_friend` | 6 | Conocer al primer amigo — genera NPC con arco paralelo |
| `hobby_discovery` | 8 | Descubrir un hobby según stat dominante |
| `school_conflict` | 10 | Conflicto escolar — opciones condicionales por flags |
| `family_dynamic` | 11 | Dinámica familiar según economía del personaje |
| `talent_discovered` | 12 | Talento según top stat — statDeltas funcionales |

**Adolescencia (ages 13-18):**
| ID | Edad | Descripción |
|----|------|-------------|
| `first_love` | 13 | Primer amor — consciente de orientación sexual |
| `academic_decision` | 14 | Ciencias / humanidades / tecnología |
| `pressure_moment` | 15 | Esfuerzo / equilibrio / sacrificar algo |
| `identity_reflection` | 15 | weight 0.6 — reflexión sobre stat dominante/débil |
| `first_job_direction` | 16 | Contexto país+stat — trabajo/estudios/balance |
| `final_exam_pressure` | 17 | triggerFlags condicional, weight 0.8 |
| `adulthood_threshold` | 18 | Mentalidad adulta: ambicioso/cauto/libre |

### NPCs
El primer amigo tiene `BEST_FRIEND_PARALLEL_ARC`: 8 pasos vitales (ages 8→77) con narrativa visible al jugador. Los NPCs mueren estocásticamente a los ~77 años según su `fisico` stat.

Name pools por país: España, Portugal, Nigeria, India, México, Brasil, Francia, Alemania.

---

## 7. STORE (src/store/gameStore.ts)

Zustand store con las acciones principales:

```typescript
// Navegación
setScreen(screen: Screen): void           // 'start'|'ancestors'|'birth'|'game'|'death'
setDifficulty(difficulty: Difficulty): void  // 'historia'|'fateborn'|'ironman'|'legado'

// Selección de ancestros
selectAncestor(ancestor, slot)
removeAncestor(slot)
setCountry(country)
confirmAncestors()   // calcula inheritedStats + hiddenGenes, va a 'birth'

// Juego
startNewGame(name, gender)  // crea GameState inicial, va a 'game'
setLifestyle(lifestyle)
advanceQuarter()     // llama prepareQuarter(), si hay evento → pendingEvent
resolveEvent(optionId)  // llama commitEventChoice(), limpia pendingEvent
```

**Flujo de evento en UI:**
1. `advanceQuarter()` → `prepareQuarter()` → si `pendingEvent` → store guarda `pendingEvent` + `preEventState`
2. `NarrativeFeed` muestra opciones del evento
3. Jugador elige → `resolveEvent(optionId)` → `commitEventChoice()` → actualiza `gameState`

---

## 8. PANTALLAS

### StartScreen
- Logo `fateborn_title.png` + tagline animado letra a letra
- Secuencia: LINE_1 → pausa 1.5s → LINE_2 → botón visible
- `useTypingAnimation` con `onComplete` callback (evita race condition stale isDone)
- Fallback: botón visible a los 9s si animación falla
- Selector dificultad con 4 opciones — `fateborn` preseleccionado
- Música `opening.mp3` con fade in

### AncestorSelection
- 17 arquetipos en grid, 4 slots superiores
- Cada arquetipo seleccionable como abuelo (dorado) o abuela (granate)
- Selector de país — 14 países agrupados por región
- Confirmar activo solo con 4 slots llenos

### BirthScreen
- Herencia genética calculada con `StatsRadarChart` SVG hexagonal
- Genes ocultos mostrados tenues
- Narrativa ancestral generada del linaje
- Inputs: nombre (min 2 chars) + selector hombre/mujer

### GameScreen
- **Desktop:** StatusBar fijo arriba + columna izquierda `LifestylePanel` (40%) + columna derecha `NarrativeFeed` (60%) + `LifeTimeline` fijo abajo
- **Mobile:** StatusBar + `TabBar` (INICIATIVA | HISTORIA) + `LifeTimeline`
- Eventos aparecen inline en `NarrativeFeed` con 3 opciones

### DeathScreen
- Epitafio generado dinámicamente desde seeds acumuladas
- Stats radar final, puntuación de legado
- Resumen: años vividos, memorias, amigos, hitos de epitafio

---

## 9. DISEÑO VISUAL

| Token | Valor | Uso |
|-------|-------|-----|
| `#0d0b08` | Cuero oscuro | Fondo universal |
| `#C9A84C` | Dorado | Abuelos, bordes activos, texto principal |
| `#8B1A2A` | Granate | Abuelas, acentos negativos, versión footer |
| `Cinzel` | Serif elegante | Títulos, labels, botones |
| `sans-serif` | Limpia | Texto narrativo, descripciones |

**Assets disponibles en `/public/`:**
- `fateborn_title.png` — solo el texto FATEBORN (usar en StartScreen)
- `fateborn_banner_nobg.png` — logo con árbol sin fondo
- `fateborn_banner.png` — logo con fondo
- `fateborn_logo.png` — isotipo

**Música disponible en `/public/music/`** (Serat - Piano Textures, CC BY):
`opening.mp3`, `dark-decision.mp3`, `timelapse.mp3`, `young-filmmaker.mp3`, `trails.mp3`, `winter-quarters.mp3`, `cast-vejez.mp3`, `old-chantry.mp3`, `viewpoint.mp3`

---

## 10. SISTEMA DE ESTILOS DE VIDA

7 estilos implementados en `lifestyleSystem.ts`:

| Tipo | Label | Allocation dominante |
|------|-------|---------------------|
| `ambitious` | Ambicioso | trabajo 5, estudios 4 |
| `balanced` | Equilibrado | todo 2-3 |
| `social` | Social | social 5 |
| `athletic` | Atlético | salud 6 |
| `hedonist` | Hedonista | ocio 6 |
| `family` | Familiar | familia 6 |
| `spiritual` | Contemplativo | ocio 4, salud 3 |

Cada estilo aplica efectos pasivos por trimestre sobre stats según proporciones de allocation.

---

## 11. ORIENTACIÓN SEXUAL

Asignada al nacer con probabilidades:
- Heterosexual: 85%
- Homosexual: 7%
- Bisexual: 8%

El jugador **no la ve** hasta que emerge naturalmente en eventos de adolescencia (especialmente `first_love` a los 13). `orientationRevealed: false` hasta ese momento.

---

## 12. ETAPAS VITALES

| Etapa | Rango | Música sugerida |
|-------|-------|----------------|
| Infancia | 0-12 | `young-filmmaker.mp3` |
| Adolescencia | 13-18 | `trails.mp3` |
| Juventud | 19-30 | `timelapse.mp3` |
| Adultez | 31-50 | `dark-decision.mp3` |
| Madurez | 51-70 | `winter-quarters.mp3` |
| Vejez | 71+ | `cast-vejez.mp3` |

---

## 13. MONETIZACIÓN (OBJETIVO)

| Versión | Precio | Notas |
|---------|--------|-------|
| Web free | Gratis | Hasta 30 años o 40 decisiones |
| Móvil | 12.99€ | Pago único, sin suscripción |
| Steam | 19.99€ | 16.99€ en lanzamiento |
| Expansiones | TBD | Cada 6-9 meses — sin pay-to-win |

---

## 14. ARCOS NARRATIVOS ESPECIALES (DISEÑADOS, NO IMPLEMENTADOS)

### Arco "Breaking Bad"
Desbloqueo: científico/médico nivel ≥ 3 + diagnóstico terminal + deudas + Ambición > 6.
6 fases. Contador "La línea que cruzaste" (0-100) en HUD.

### Arco "Saul Goodman"
Desbloqueo: Abogado nivel ≥ 3 + flag `contacto_criminal` + Ambición > 7 + flag `cliente_antecedentes`.
6 fases. Contador "El precio de la victoria" (0-100).

### Carrera: Abogado (10 niveles)
Estudiante → Junior → Abogado → Socio junior → Socio senior → Élite → Bufete propio → Referente nacional → Referente internacional → Leyenda del derecho.

---

## 15. REGLAS DE CÓDIGO

1. **Sin `any` en TypeScript** — usar tipos explícitos o `unknown`
2. **`import type`** para todos los imports de tipo (verbatimModuleSyntax)
3. **Componentes = solo presentación** — sin lógica de negocio
4. **Motor inmutable** — `f(state, input) = newState`, sin mutaciones
5. **Un hook por sistema complejo** — `useGameEngine`, `useNarrativeFeed`, `useLifestyle`
6. **`ErrorBoundary` en cada pantalla** — nunca un crash limpia toda la UI
7. **Sin magic numbers** — todo en `src/constants/game.constants.ts`
8. **Sin abstracciones especulativas** — código para el caso actual, no hipotético
9. **Tono narrativo** — siempre serio y realista, nunca absurdo ni casual
10. **Consecuencias diferidas** — las decisiones no tienen efecto inmediato obvio

---

## 16. REGLAS DE DISEÑO

- Nunca game over seco — siempre hay reflexión narrativa
- El juego recuerda todo mediante flags narrativos
- Cada evento tiene exactamente 3 opciones que revelan carácter diferente
- Las consecuencias operan en 4 capas: inmediata, corto plazo (1-5 años), medio (5-20 años), largo (20+ años)
- El epitafio se construye desde el primer evento hasta la muerte
- Mismo estilo visual en todas las pantallas — nunca romper la inmersión

---

## 17. ESTADO ACTUAL Y PRÓXIMOS PASOS

### Implementado y validado
- [x] Motor completo con test de 25 años (`npx tsx src/test/engineTest.ts`)
- [x] 12 eventos narrativos (infancia + adolescencia) con NPCs y consecuencias diferidas
- [x] 5 pantallas con navegación funcional
- [x] Sistema de estilos de vida
- [x] Herencia genética + genes ocultos
- [x] Epitafio dinámico con seeds acumuladas
- [x] Sistema de memorias con contextos cruzados

### Próximos pasos por prioridad
1. Verificar flujo completo StartScreen → AncestorSelection → Birth → Game
2. Eventos de Juventud (ages 19-30) con lógica laboral y relaciones
3. StatusBar con flash de stats al resolver eventos
4. Sistema de carrera y economía conectado al motor
5. Contenido narrativo profundo para cada etapa vital restante
6. Modo Dinastía (herencia generacional entre partidas)
