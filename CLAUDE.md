# FATEBORN — DOCUMENTO MAESTRO

> "DE SU SANGRE NACES. DE TUS DECISIONES TE FORJAS."

Simulador de vida RPG narrativo estratégico. El mejor simulador de vida RPG jamás creado.
Desarrollado por Dan (DJ en Barcelona/Sabadell, sin conocimientos de código).

Ver GAME_DESIGN.md para diseño completo de sistemas, narrativa y mecánicas.

---

## 1. IDENTIDAD

| Campo | Valor |
|-------|-------|
| Nombre | Fateborn |
| Género | Simulador de vida RPG narrativo estratégico |
| Tagline | "DE SU SANGRE NACES. DE TUS DECISIONES TE FORJAS." |
| Plataformas | Web · iOS · Android · Steam |
| URL | fateborn.vercel.app |
| GitHub | FatebornTheGame/Fateborn |
| Redes | @fatebornthegame (TikTok, Instagram, YouTube, Twitter/X) |

---

## 2. STACK TÉCNICO

| Capa | Tecnología | Notas |
|------|-----------|-------|
| UI | React 19 | JSX con react-jsx |
| Lenguaje | TypeScript 5.9 | Estricto, sin any |
| Estado | Zustand 5 | Store central en src/store/gameStore.ts |
| Estilos | Tailwind CSS v4 | Via @tailwindcss/vite, config en index.css |
| Build | Vite 8 | ESM, "type": "module" |
| Deploy | Vercel | fateborn.vercel.app |
| Persistencia | Dexie.js | IndexedDB para saves locales (pendiente) |
| i18n | react-i18next | 10 idiomas, archivos en src/i18n/locales/ |

tsconfig.app.json restricciones críticas:
- verbatimModuleSyntax: true — todos los imports de tipo deben ser import type
- noUnusedLocals: true y noUnusedParameters: true — sin variables sin usar
- strict: true y erasableSyntaxOnly: true
- moduleResolution: "bundler"

---

## 3. RUTAS IMPORTANTES

Proyecto:     C:\Users\F O R T Y W A N\fateborn
Música local: C:\Users\F O R T Y W A N\Desktop\fateborn-music\
Assets local: C:\Users\F O R T Y W A N\Desktop\FATEBORN\
GitHub:       FatebornTheGame/Fateborn
Deploy:       fateborn.vercel.app

---

## 5. ARQUITECTURA DE CARPETAS

src/
  constants/
    game.constants.ts     — sin magic numbers (colores, tiempos, probabilidades)
  types/
    game.types.ts         — todos los tipos del juego + helpers
    archetype.types.ts    — Archetype, AncestorSlot
  data/
    archetypes.ts         — 8 arquetipos con stats completos y nameFeminine
    countries.ts          — 20 países con tier y modificadores
    passiveNarrative.ts   — textos pasivos por etapa y estilo de vida (ver GDD §64)
    events/
      childhoodEvents.ts  — 5 eventos ages 6-12
      adolescenceEvents.ts — 7 eventos ages 13-18
    npcs/
      npcProfiles.ts      — name pools por país + BEST_FRIEND_PARALLEL_ARC
  systems/
    engineCore.ts         — processGameTurn(), prepareQuarter(), commitEventChoice()
    epitaphSystem.ts      — epitafio vivo con seeds acumuladas
    memorySystem.ts       — memorias involuntarias con contextos cruzados
    npcLifeSystem.ts      — arcos paralelos de NPCs, muerte estocástica
    lifestyleSystem.ts    — 7 estilos de vida con allocations y efectos
  store/
    gameStore.ts          — Zustand: navegación, selección, motor, UI state
  styles/
    tokens.ts             — design system centralizado (colores, fuentes, transiciones)
    AtmosphericBackground.tsx — fondo atmosférico reutilizable en todas las pantallas
  i18n/
    index.ts              — inicialización react-i18next
    locales/              — es.json en.json fr.json de.json pt-BR.json ru.json pl.json it.json tr.json zh.json
  hooks/
    useGameEngine.ts      — wraps prepareQuarter/commitEventChoice
    useNarrativeFeed.ts   — feed agrupado por edad
    useLifestyle.ts       — estado y cambio de estilo de vida
    useTypingAnimation.ts — animación letra a letra con onComplete callback
  components/
    ErrorBoundary.tsx
    StatsRadarChart.tsx   — SVG hexagonal de 9 stats
    StatusBar.tsx         — barra fija superior con barras de stats reactivas
    LifestylePanel.tsx    — panel de estilo de vida + avanzar trimestre
    NarrativeFeed.tsx     — feed cronológico con eventos inline
    LifeTimeline.tsx      — línea SVG de vida en footer
    TabBar.tsx            — tabs mobile (INICIATIVA | HISTORIA)
    AncestorSlots.tsx     — 4 slots de selección sticky
    ArchetypeCard.tsx     — carta de arquetipo
    CountrySelector.tsx   — selector de país
    HiddenGenesDisplay.tsx
    AncestralNarrative.tsx — con género correcto via nameFeminine
    MuteButton.tsx        — botón silenciar música, posición fija bottom-right
  screens/
    StartScreen.tsx
    AncestorSelection.tsx
    BirthScreen.tsx
    GameScreen.tsx
    DeathScreen.tsx
  utils/
    audio.ts              — playMusic(), stopMusic() con fade in/out
  test/
    engineTest.ts         — simulación 25 años en consola (npx tsx)

---

## 6. TIPOS FUNDAMENTALES (game.types.ts)

### Stats — 9, escala 0-10, agrupados 3x3

| Cognitivo | Social | Vital |
|-----------|--------|-------|
| Lógica | Carisma | Físico |
| Creatividad | Emocional | Riesgo |
| Disciplina | Ambición | Estabilidad |

### GameState

interface GameState {
  character:           Character           // nombre, género, birthYear, país
  ageYears:            number
  totalQuarters:       number              // ageYears = floor(totalQuarters / 4)
  stats:               Stats
  flags:               string[]            // flags narrativos acumulados, nunca se borran sin razón
  friends:             Friend[]            // NPCs vivos con arco propio
  pendingConsequences: PendingConsequence[]
  memories:            Memory[]
  epitaph:             EpitaphState
  firedEvents:         string[]
  feed:                NarrativeEntry[]    // historial cronológico completo
  economy:             Economy
  career:              Career | null
  vitalLoad:           number              // 0-100
  legacyScore:         number
  sexualOrientation:   SexualOrientation   // heterosexual | homosexual | bisexual
  orientationRevealed: boolean
  language:            Language
  rival:               RivalState
  moralCorruption:     number              // 0-100, solo visible en epitafio
}

### StatDeltaResolver — patrón clave del motor

type StatDeltaResolver = Partial<Stats> | ((state: GameState) => Partial<Stats>)

function resolveDeltas(d: StatDeltaResolver, state: GameState): Partial<Stats> {
  return typeof d === 'function' ? d(state) : d
}

### EventOption — estructura de cada opción de evento

interface EventOption {
  id:       string
  text:     (state: GameState) => string
  immediate: {
    narrative:    (state: GameState) => string
    statDeltas:   StatDeltaResolver
    flags:        string[]
    removeFlags?: string[]
    generateNPC?: NPCTemplate
  }
  delayed:      DelayedConsequence[]
  memory?:      { id: string; text: (state: GameState) => string }
  epitaphSeed?: string
}

---

## 7. MOTOR (src/systems/engineCore.ts)

Principio: inmutable. f(state, input) = newState. Sin efectos secundarios.

### API pública

prepareQuarter(state, allocation): QuarterPrep
  — intermediateState ya procesado, pendingEvent si hay

commitEventChoice(state, event, optionId): GameState
  — aplica la opción elegida, incluye memory triggers

processGameTurn(state, allocation, resolveEvent?): TurnResult
processMultipleQuarters(state, allocation, count): GameState

### Flujo de un trimestre (en orden)

1. totalQuarters + 1 — recalcular ageYears
2. Efectos de TimeAllocation sobre stats (trabajo→ambición, estudios→lógica, social→carisma, salud→físico, familia→emocional, ocio→creatividad/riesgo)
3. Procesar pendingConsequences — por triggerAge, triggerFlag, o triggerYearsAfter + sourceAge
4. Avanzar vidas paralelas de NPCs (advanceNPCLives)
5. Avanzar vida paralela del rival (advanceRivalLife)
6. Buscar evento elegible: triggerAge === age + flags (OR logic) + antiFlags + weight probabilístico
7. Si hay evento → QuarterPrep.pendingEvent, store lo guarda y espera input del jugador
8. commitEventChoice → aplicar stats, flags, NPC, consecuencias, memoria, epitafio, moralCorruption

### Validación del motor

Ejecutar: npx tsx src/test/engineTest.ts
Resultado confirmado: 12 eventos disparados, 11 consecuencias diferidas, NPC Gonzalo vivo a los 31, epitafio con 12 seeds, stats finales coherentes (Lógica 8.3, Emocional 8.1). Build: 0 errores.

---

## 8. STORE (src/store/gameStore.ts)

type Screen     = 'start' | 'ancestors' | 'birth' | 'game' | 'death'
type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado'
type Language   = 'es' | 'en' | 'fr' | 'de' | 'pt-BR' | 'ru' | 'pl' | 'it' | 'tr' | 'zh'

Acciones principales:
setScreen(screen)
setDifficulty(difficulty)            — default: 'fateborn'
selectAncestor(ancestor, slot 0-3)  — mismo arquetipo permitido en varios slots
removeAncestor(slot)
setCountry(country)
confirmAncestors()                   — calcula inheritedStats + hiddenGenes → screen 'birth'
startNewGame(name, gender)           — crea GameState + asigna sexualOrientation → screen 'game'
setLifestyle(lifestyle)
setLanguage(language)
advanceQuarter()                     — prepareQuarter() → si pendingEvent → guarda en store
resolveEvent(optionId)               — commitEventChoice() → actualiza gameState

### Flujo de evento en UI
1. advanceQuarter() → prepareQuarter() → pendingEvent + preEventState en store
2. NarrativeFeed muestra contexto + 3 opciones del evento
3. Jugador elige → resolveEvent(optionId) → commitEventChoice() → nuevo gameState

---

## 26. REGLAS DE CÓDIGO (inamovibles)

1. Sin any — tipos explícitos o unknown
2. import type para todos los imports de tipo (verbatimModuleSyntax)
3. Componentes = solo presentación — sin lógica de negocio, usan store o hooks
4. Motor inmutable — f(state, input) = newState, sin mutaciones, sin efectos secundarios
5. Un hook por sistema complejo — useGameEngine, useNarrativeFeed, useLifestyle
6. ErrorBoundary en cada pantalla — crash aislado, no global
7. Sin magic numbers — todo en src/constants/game.constants.ts
8. Sin abstracciones especulativas — código para el caso actual, no hipotético
9. noUnusedLocals — sin variables sin usar, no usar _ prefixes como hack
10. Código auditable por developers senior — si no es obvio, comentar el porqué
11. Todos los strings de UI en i18n — nunca hardcodeados en componentes
12. Comentarios en el código en inglés
13. **REGLA DE DESPLIEGUE:** Al final de cada prompt ejecutar siempre:
    `git add . && git commit -m '[descripción del cambio]' && git push`
    Vercel despliega automáticamente desde main. No se necesita ninguna acción adicional en Vercel.

---

## 27. REGLAS DE DISEÑO (inamovibles)

- Nunca hay game over seco — siempre hay reflexión narrativa
- El nombre del personaje aparece siempre en momentos narrativos importantes
- Exactamente 3 opciones por evento que revelan carácter diferente
- Las opciones de eventos nunca tienen respuesta correcta — revelan carácter, no inteligencia
- Las decisiones tienen consecuencias en 4 capas temporales: inmediata, 6 meses, 2 años, 10 años
- El epitafio se construye desde el primer evento hasta la muerte
- Mobile-first: mínimo 375px, botones mínimo 44px de altura
- El juego no explica sus mecánicas — las muestra con consecuencias
- Tono siempre serio y realista, nunca absurdo ni casual
- El mundo recuerda lo que hiciste — los flags nunca se borran sin razón narrativa
- Mismo estilo visual en todas las pantallas — nunca romper la inmersión
- Ningún texto debe ser ilegible — opacity mínima 0.4, color mínimo #4a3828
