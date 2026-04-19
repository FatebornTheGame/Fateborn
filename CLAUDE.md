# FATEBORN — DOCUMENTO MAESTRO

> "DE SU SANGRE NACES. DE TUS DECISIONES TE FORJAS."

Simulador de vida RPG narrativo estratégico. El mejor simulador de vida RPG jamás creado.
Desarrollado por Dan (DJ en Barcelona/Sabadell, sin conocimientos de código).

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
| UI | React 19 | JSX con `react-jsx` |
| Lenguaje | TypeScript 5.9 | Estricto, sin `any` |
| Estado | Zustand 5 | Store central en `src/store/gameStore.ts` |
| Estilos | Tailwind CSS v4 | Vía `@tailwindcss/vite`, config en `index.css` |
| Build | Vite 8 | ESM, `"type": "module"` |
| Deploy | Vercel | fateborn.vercel.app |
| Persistencia | Dexie.js | IndexedDB para saves locales (pendiente) |

**`tsconfig.app.json` — restricciones críticas:**
- `verbatimModuleSyntax: true` → **todos los imports de tipo deben ser `import type`**
- `noUnusedLocals: true` y `noUnusedParameters: true` → sin variables sin usar
- `strict: true` y `erasableSyntaxOnly: true`
- `moduleResolution: "bundler"`

---

## 3. RUTAS IMPORTANTES

```
Proyecto:     C:\Users\F O R T Y W A N\fateborn
Música local: C:\Users\F O R T Y W A N\Desktop\fateborn-music\
Assets local: C:\Users\F O R T Y W A N\Desktop\FATEBORN\
GitHub:       FatebornTheGame/Fateborn
Deploy:       fateborn.vercel.app
```

---

## 4. DISEÑO VISUAL

### Paleta de color

| Token | Hex | Uso |
|-------|-----|-----|
| Cuero oscuro | `#0d0b08` | Fondo universal |
| Dorado | `#C9A84C` | Abuelos, bordes activos, texto principal, botones |
| Granate | `#8B1A2A` | Abuelas, stats negativos, acentos de alerta |
| Felt-2 | `#141210` | Fondos secundarios |
| Felt-3 | `#1c1915` | Cards, paneles |
| Muted | `#6b6045` | Texto secundario, labels |

### Tipografía
- **Cinzel** (Google Fonts) — títulos, labels, botones, UI narrativa
- **sans-serif** — texto de narrativa, descripciones largas

### Assets en `/public/`

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| `fateborn_title.png` | Solo el texto FATEBORN | StartScreen logo |
| `fateborn_banner_nobg.png` | Logo árbol sin fondo | Splash alternativo |
| `fateborn_banner.png` | Logo árbol con fondo | OG image |
| `fateborn_logo.png` | Isotipo cuadrado | Favicon alternativo |

### Música en `/public/music/` — Serat · Piano Textures (CC BY)
Créditos obligatorios en la app: **"Música: Serat — Piano Textures (CC BY)"**

| Archivo | Pantalla / Etapa |
|---------|-----------------|
| `opening.mp3` | StartScreen → AncestorSelection |
| `trails.mp3` | BirthScreen |
| `young-filmmaker.mp3` | Infancia (0-12) |
| `timelapse.mp3` | Adolescencia (13-18) |
| `viewpoint.mp3` | Juventud (19-30) |
| `dark-decision.mp3` | Adultez (31-50) y DeathScreen |
| `old-chantry.mp3` | Madurez (51-70) |
| `cast-vejez.mp3` | Vejez (71+) |
| `winter-quarters.mp3` | Momentos de crisis grave |

---

## 5. ARQUITECTURA DE CARPETAS

```
src/
  constants/
    game.constants.ts     → sin magic numbers (colores, tiempos, probabilidades)
  types/
    game.types.ts         → todos los tipos del juego + helpers
    archetype.types.ts    → Archetype, AncestorSlot
  data/
    archetypes.ts         → 8 arquetipos con stats completos
    countries.ts          → 20 países con tier y modificadores
    events/
      childhoodEvents.ts  → 5 eventos ages 6-12
      adolescenceEvents.ts → 7 eventos ages 13-18
    npcs/
      npcProfiles.ts      → name pools por país + BEST_FRIEND_PARALLEL_ARC
  systems/               → motor puro, sin UI, funciones puras
    engineCore.ts         → processGameTurn(), prepareQuarter(), commitEventChoice()
    epitaphSystem.ts      → epitafio vivo con seeds acumuladas
    memorySystem.ts       → memorias involuntarias con contextos cruzados
    npcLifeSystem.ts      → arcos paralelos de NPCs, muerte estocástica
    lifestyleSystem.ts    → 7 estilos de vida con allocations y efectos
  store/
    gameStore.ts          → Zustand: navegación, selección, motor, UI state
  hooks/
    useGameEngine.ts      → wraps prepareQuarter/commitEventChoice
    useNarrativeFeed.ts   → feed agrupado por edad
    useLifestyle.ts       → estado y cambio de estilo de vida
    useTypingAnimation.ts → animación letra a letra con onComplete callback
  components/            → componentes con responsabilidad única
    ErrorBoundary.tsx
    StatsRadarChart.tsx   → SVG hexagonal de 9 stats
    StatusBar.tsx         → barra fija superior
    LifestylePanel.tsx    → panel de estilo de vida + avanzar trimestre
    NarrativeFeed.tsx     → feed cronológico con eventos inline
    LifeTimeline.tsx      → línea SVG de vida en footer
    TabBar.tsx            → tabs mobile (INICIATIVA | HISTORIA)
    AncestorSlots.tsx     → 4 slots de selección
    ArchetypeCard.tsx     → carta de arquetipo
    CountrySelector.tsx   → selector de país
    HiddenGenesDisplay.tsx
    AncestralNarrative.tsx
  screens/               → pantallas completas, cada una con ErrorBoundary
    StartScreen.tsx
    AncestorSelection.tsx
    BirthScreen.tsx
    GameScreen.tsx
    DeathScreen.tsx
  utils/
    audio.ts              → playMusic(), stopMusic() con fade in/out
  test/
    engineTest.ts         → simulación 25 años en consola (npx tsx)
```

---

## 6. TIPOS FUNDAMENTALES (game.types.ts)

### Stats — 9, escala 0-10, agrupados 3×3

| Cognitivo | Social | Vital |
|-----------|--------|-------|
| Lógica | Carisma | Físico |
| Creatividad | Emocional | Riesgo |
| Disciplina | Ambición | Estabilidad |

### GameState

```typescript
interface GameState {
  character:           Character           // nombre, género, birthYear, país
  ageYears:            number
  totalQuarters:       number              // ageYears = floor(totalQuarters / 4)
  stats:               Stats
  flags:               string[]            // flags narrativos acumulados
  friends:             Friend[]            // NPCs vivos con arco propio
  pendingConsequences: PendingConsequence[]
  memories:            Memory[]
  epitaph:             EpitaphState
  firedEvents:         string[]
  feed:                NarrativeEntry[]    // historial cronológico
  economy:             Economy
  career:              Career | null
  vitalLoad:           number              // 0-100
  legacyScore:         number
  sexualOrientation:   SexualOrientation   // heterosexual | homosexual | bisexual
  orientationRevealed: boolean
}
```

### StatDeltaResolver — patrón clave del motor

```typescript
// Permite statDeltas estáticos o dinámicos (función del estado)
type StatDeltaResolver = Partial<Stats> | ((state: GameState) => Partial<Stats>)

// Resolución en engineCore:
function resolveDeltas(d: StatDeltaResolver, state: GameState): Partial<Stats> {
  return typeof d === 'function' ? d(state) : d
}
```

### EventOption — estructura de cada opción de evento

```typescript
interface EventOption {
  id:       string
  text:     (state: GameState) => string
  immediate: {
    narrative:    (state: GameState) => string
    statDeltas:   StatDeltaResolver        // puede ser función
    flags:        string[]
    removeFlags?: string[]
    generateNPC?: NPCTemplate
  }
  delayed:      DelayedConsequence[]       // consecuencias diferidas
  memory?:      { id: string; text: (state: GameState) => string }
  epitaphSeed?: string                     // contribuye al epitafio vivo
}
```

---

## 7. MOTOR (src/systems/engineCore.ts)

**Principio: inmutable. `f(state, input) = newState`. Sin efectos secundarios.**

### API pública

```typescript
// Para la UI — split en dos pasos para esperar input del jugador:
prepareQuarter(state, allocation): QuarterPrep
  // → intermediateState (ya procesado), pendingEvent (si hay)

commitEventChoice(state, event, optionId): GameState
  // → aplica la opción elegida, incluye memory triggers

// Para tests/batch:
processGameTurn(state, allocation, resolveEvent?): TurnResult
processMultipleQuarters(state, allocation, count): GameState
```

### Flujo de un trimestre (en orden)

1. `totalQuarters + 1` → recalcular `ageYears`
2. Efectos de `TimeAllocation` sobre stats (estudios→lógica, social→carisma, etc.)
3. Procesar `pendingConsequences` — por `triggerAge`, `triggerFlag`, o `triggerYearsAfter + sourceAge`
4. Avanzar vidas paralelas de NPCs (`advanceNPCLives`)
5. Buscar evento elegible: `triggerAge === age` + flags (OR logic) + antiFlags + weight < 1 → probabilístico
6. Si hay evento → `QuarterPrep.pendingEvent`, store lo guarda y espera input del jugador
7. `commitEventChoice(state, event, optionId)` → aplicar stats, flags, NPC, consecuencias, memoria, epitafio

### Validación del motor

Ejecutar: `npx tsx src/test/engineTest.ts`
Resultado confirmado: 12 eventos disparados, 11 consecuencias diferidas, NPC Gonzalo vivo a los 31, epitafio con 12 seeds, stats finales coherentes (Lógica 8.3, Emocional 8.1).

---

## 8. STORE (src/store/gameStore.ts)

```typescript
type Screen     = 'start' | 'ancestors' | 'birth' | 'game' | 'death'
type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado'

// Acciones principales:
setScreen(screen)
setDifficulty(difficulty)            // default: 'fateborn'
selectAncestor(ancestor, slot 0-3)
removeAncestor(slot)
setCountry(country)
confirmAncestors()    // calcula inheritedStats + hiddenGenes → screen 'birth'
startNewGame(name, gender)           // crea GameState + asigna sexualOrientation → screen 'game'
setLifestyle(lifestyle)
advanceQuarter()      // prepareQuarter() → si pendingEvent → guarda en store
resolveEvent(optionId) // commitEventChoice() → actualiza gameState
```

### Flujo de evento en UI
1. `advanceQuarter()` → `prepareQuarter()` → `pendingEvent` + `preEventState` en store
2. `NarrativeFeed` muestra contexto + 3 opciones del evento
3. Jugador elige → `resolveEvent(optionId)` → `commitEventChoice()` → nuevo `gameState`

---

## 9. PANTALLAS

### StartScreen
- Logo `fateborn_title.png` + tagline animado letra a letra (Cinzel, dorado)
- Secuencia: LINE_1 → pausa 1.5s → LINE_2 → botón "NUEVA VIDA" visible
- `useTypingAnimation` con `onComplete` callback desde el interval (evita race condition stale `isDone`)
- Fallback: botón visible a los 9s si animación falla o tab inactiva
- Selector de dificultad con 4 cards — `fateborn` preseleccionado
- Música `opening.mp3` con fade in 2s
- **`overflow-y: auto`** en root — permite scroll en pantallas pequeñas

### AncestorSelection
- 17 arquetipos en grid auto-fill (160px min)
- 4 slots superiores — dorado para abuelos (slots 0,2), granate para abuelas (slots 1,3)
- Confirmar activo solo con 4 slots llenos + país elegido
- `confirmAncestors()` calcula herencia genética y genes ocultos

### BirthScreen
- `StatsRadarChart` SVG hexagonal con los 9 stats heredados
- `HiddenGenesDisplay` muestra genes ocultos en texto tenue con opacidad 0.25
- `AncestralNarrative` genera texto del linaje con nombres de arquetipos
- Form: nombre (mínimo 2 chars) + selector hombre/mujer

### GameScreen
- **Desktop (≥md):** StatusBar (56px, fijo top) | LifestylePanel (40%, scroll) | NarrativeFeed (60%, scroll) | LifeTimeline (48px, fijo bottom)
- **Mobile (<md):** StatusBar | TabBar (INICIATIVA | HISTORIA) | contenido tab activo | LifeTimeline
- `overflow-hidden` en el root div (layout fijo, los paneles internos scrollean)
- Eventos aparecen inline en `NarrativeFeed` con 3 opciones como botones

### DeathScreen
- Epitafio generado desde seeds acumuladas + addendum por stat dominante
- `StatsRadarChart` de perfil final
- Grid de stats de legado: años, memorias, amigos, hitos
- "Nueva vida" → `setScreen('start')`

---

## 10. LOS 8 ARQUETIPOS (src/data/archetypes.ts)

| Arquetipo | Stats destacados | Lore |
|-----------|-----------------|------|
| Académico | Lógica 9, Disciplina 8 | "Entender el mundo antes de intentar cambiarlo." |
| Líder | Carisma 9, Ambición 8 | "El poder no se toma. Se ejerce hasta que los demás lo reconocen." |
| Atleta | Físico 9, Disciplina 8 | "El dolor es información. La victoria, consecuencia." |
| Artista | Creatividad 9, Emocional 8 | "No hace el arte porque puede. Lo hace porque no puede no hacerlo." |
| Filósofo | Lógica 8, Creatividad 7 | "Las preguntas que no tienen respuesta son las únicas que merecen hacerse." |
| Emprendedor | Ambición 9, Riesgo 8 | "El primer negocio quebró. El segundo también. El tercero cambió todo." |
| Cuidador | Emocional 9, Estabilidad 9 | "La mayor fortaleza es aquella que sostiene a los demás." |
| Explorador | Riesgo 9, Físico 8 | "Los mapas mienten. La realidad hay que ir a verla." |

*(Implementados 17 en código — los 8 de diseño objetivo son los sin redundancia)*

### Herencia genética
```
inheritedStats[stat] = mean(4 ancestors[stat]) × (1 ± random × 0.10)
hiddenGenes[stat]    = max(ancestors[stat]) × 1.10   si > inherited + 0.5
sexualOrientation    = random: 85% hetero / 7% homo / 8% bisexual
```

---

## 11. LOS 20 PAÍSES (src/data/countries.ts)

| Tier | Países |
|------|--------|
| S | Noruega, Suecia |
| A | Alemania, Japón, Canadá, Australia |
| B | España, EEUU, Francia, Reino Unido |
| C | Brasil, México, China, Argentina |
| D | India, Colombia, Nigeria |
| E | Afganistán, Yemen, Haití |

Cada país: `incomeMultiplier`, `taxRate`, `statsBonus`, idioma, sistema político, eventos históricos propios, name pools de NPCs.

---

## 12. EVENTOS IMPLEMENTADOS

### Infancia (ages 6-12)

| ID | Edad | Descripción |
|----|------|-------------|
| `first_friend` | 6 | Genera NPC con `BEST_FRIEND_PARALLEL_ARC` (8 hitos hasta los 77) |
| `hobby_discovery` | 8 | Opciones por stat dominante: físico→deporte, lógica→ajedrez, creatividad→arte |
| `school_conflict` | 10 | 3 variantes por flags: defiendes/eres víctima/eres agresor |
| `family_dynamic` | 11 | Variante por economía y flags: tensión/divorcio/estable |
| `talent_discovered` | 12 | `statDeltas` funcional: detecta top stat y refuerza con +0.3 específico |

### Adolescencia (ages 13-18)

| ID | Edad | Flags/Weight | Descripción |
|----|------|-------------|-------------|
| `first_love` | 13 | — | Coherente con `sexualOrientation`; usa NPC existente si hay |
| `academic_decision` | 14 | — | ciencias / humanidades / tecnología; variante por país |
| `pressure_moment` | 15 | — | esfuerzo / equilibrio / sacrificar hobby |
| `identity_reflection` | 15 | weight 0.6 | Solo narrativa; muestra stat dominante y débil |
| `first_job_direction` | 16 | — | Contexto país+stat; trabajo / estudios / balance |
| `final_exam_pressure` | 17 | triggerFlags: ciencias ∣ humanidades, weight 0.8 | Noche antes del examen |
| `adulthood_threshold` | 18 | — | Mentalidad: ambicioso / cauto / libre; consecuencias hasta los 30 |

### NPC Parallel Arc (amigo de infancia)
8 pasos vitales: ages 8, 14, 16, 22, 30, 45, 60, 77. Cada uno con `narrativeToPlayer` y `{{name}}` interpolado. Muerte estocástica a los ~77 según `fisico` stat del NPC.

---

## 13. SISTEMA DE ESTILOS DE VIDA (lifestyleSystem.ts)

| Tipo | Label | Trabajo | Estudios | Familia | Social | Salud | Ocio |
|------|-------|---------|----------|---------|--------|-------|------|
| `ambitious` | Ambicioso | 5 | 4 | 1 | 1 | 1 | 1 |
| `balanced` | Equilibrado | 2 | 3 | 2 | 2 | 2 | 2 |
| `social` | Social | 2 | 2 | 2 | 5 | 1 | 1 |
| `athletic` | Atlético | 2 | 2 | 1 | 1 | 6 | 1 |
| `hedonist` | Hedonista | 1 | 1 | 1 | 3 | 1 | 6 |
| `family` | Familiar | 2 | 1 | 6 | 2 | 1 | 1 |
| `spiritual` | Contemplativo | 1 | 3 | 1 | 1 | 3 | 4 |

Suma siempre 13 semanas. Efectos pasivos por trimestre sobre stats según proporciones.

---

## 14. ORIENTACIÓN SEXUAL

- Asignada en `startNewGame()` con `rollSexualOrientation()`
- `orientationRevealed: false` al nacer
- Emerge naturalmente en `first_love` (edad 13) — la narrativa es coherente
- La supresión activa tiene consecuencias diferidas (emocional, estabilidad)
- Impacta el sistema de pareja emergente y el Modo Dynastía

---

## 15. ETAPAS VITALES

| Etapa | Rango | Probabilidad muerte/año |
|-------|-------|------------------------|
| Infancia | 0-12 | ~0% |
| Adolescencia | 13-18 | 0.1% |
| Juventud | 19-30 | 0.1% |
| Adultez | 31-50 | 0.3% |
| Madurez | 51-70 | 1.5% |
| Vejez | 71-80 | 2.5% |
| Vejez tardía | 81-90 | 6% |
| Centenario | 91+ | 15% |

Edad máxima absoluta: 95 años.

---

## 16. DIFICULTAD

| Modo | Descripción |
|------|-------------|
| Historia | Consecuencias suaves. Sugerencias activas de salud mental. La narrativa primero. |
| Fateborn | Experiencia diseñada. Consecuencias reales. Modo por defecto. |
| Ironman | Sin red de seguridad. Muerte prematura posible. |
| Legado | Modo más difícil. Transferencia Dynastía obligatoria a los 25. |

Multiplicador de consecuencias: Historia 0.5×, Fateborn 1×, Ironman 1.5×, Legado 2×.

---

## 17. SISTEMA DE PAREJA (DISEÑADO, NO IMPLEMENTADO)

No es un botón. Es un proceso emergente:
- Las personas aparecen según **dónde inviertes tiempo**, no según "buscar pareja"
- La orientación sexual determina quién puede aparecer
- La pareja tiene perfil económico heredado de sus propios ancestros
- La ventana de oportunidad puede cerrarse si no actúas
- El matrimonio tiene consecuencias en economía, herencia y Modo Dynastía

---

## 18. EMANCIPACIÓN (DISEÑADO, NO IMPLEMENTADO)

Proceso obligatorio entre 18-30 años. 4 vías:
1. Padres pagan (capital heredado disponible)
2. Alquiler — fianza + amueblado + averías aleatorias
3. Compra — necesitas 20% entrada + gastos notariales
4. Forzada — piso compartido de emergencia

Hipoteca fija vs variable (Euribor). El juego muestra que **alquiler = dinero perdido**. Compra siempre más eficiente a largo plazo.

---

## 19. SISTEMA ECONÓMICO (DISEÑADO, NO IMPLEMENTADO)

```
economy: {
  liquidez, ingresos, gastos, patrimonio
  cartera: [ETFs, acciones, bonos, oro, crypto, REITs]
  inmuebles: []
  hipoteca: { tipo: 'fija'|'variable'|'mixta', euribor, cuota }
  negocio: BusinessState | null
}
```

Inversiones disponibles: MSCI World, S&P500, EuroStoxx50, Nikkei, acciones individuales, oro, crypto, REITs.
Casino y apuestas con riesgo de adicción.
Interés compuesto visible y proyectado.
Newsletter trimestral con ciclos económicos aleatorios.
Impuestos reales por país.

---

## 20. LAS 20 PROFESIONES (DISEÑADAS, NO IMPLEMENTADAS)

Cada una: 10 niveles · mecánica única · obra maestra final · transiciones con sentido.

| Profesión | Mecánica única |
|-----------|---------------|
| Científico | Descubrimientos, patentes, Nobel |
| Médico | Casos, diagnósticos, reputación |
| Profesor | Alumnos que vuelven, legado académico |
| Empresario | Empresa como personaje secundario |
| Inversor | Cartera, timing, ciclos |
| Banquero | Leverage, riesgo sistémico |
| Político | Votos, coaliciones, escándalos |
| Abogado | Casos, Saul Goodman arc |
| Juez | Veredictos con consecuencias morales |
| Músico/DJ | Discografía, tours, legado cultural |
| Escritor | Novelas, premios, crítica |
| Futbolista | Rendimiento físico, carrera corta |
| Piloto F1 | Temporadas, equipo, Armstrong arc |
| Director F1 | Gestión de equipo, presupuesto |
| Alpinista | 14 ochomiles, riesgo de muerte |
| Agente antidrogas | Mike Ehrmantraut arc |
| Criminal | Karma diferido, El Padrino arc |
| Arquitecto | Obras icónicas, legado visual |
| Chef | Restaurante, estrellas, reputación |
| Streamer | Audiencia, plataformas, viralidad |

---

## 21. ARCOS NARRATIVOS EMERGENTES (DISEÑADOS)

Se activan por condiciones específicas de flags + stats + carrera:

| Arco | Condición de desbloqueo |
|------|------------------------|
| Breaking Bad | Científico/médico nivel 3+ + diagnóstico terminal + deudas + Ambición > 6 |
| Mike Ehrmantraut | Policía nivel 3+ + traición o amenaza a familia |
| El Padrino | Familia atacada + poder suficiente |
| Saul Goodman | Abogado nivel 3+ + `contacto_criminal` + Ambición > 7 |
| Mandela | País Tier D/E/F + Carisma 7+ + Ambición 8+ |
| Jordan Belfort | Financiero nivel 2+ + vacío legal + Riesgo > 7 |
| Armstrong | Piloto militar + programa espacial disponible |
| Icarus | Deportista + doping accesible + Ambición > 8 |
| El Infiltrado | Agente + infiltración + años de doble vida |
| Citizen Kane | Billonario + vacío existencial + Emocional < 4 |

Cada arco: condiciones exactas · 3-6 fases · puntos de salida · finales múltiples.

---

## 22. MODO DYNASTÍA (DISEÑADO, NO IMPLEMENTADO)

- Transferir al descendiente en cualquier momento (no solo al morir)
- Herencia completa: genética + material + social + psicológica + cultural + emocional
- El amigo de infancia puede ser amigo del hijo en la siguiente generación
- Los traumas se transmiten parcialmente (flags heredados con peso reducido)
- El apellido tiene peso en el mundo (reputación heredada)
- Árbol genealógico visual que crece entre generaciones

---

## 23. HITOS IMPOSIBLES

Nobel · Presidente de país · Luna · Billonario · Campeón mundial · 14 ochomiles · Director CIA/Europol · Leyenda musical · Empresa que dura 100 años.

---

## 24. MONETIZACIÓN

| Versión | Precio | Notas |
|---------|--------|-------|
| Web free | Gratis | Hasta 30 años O 40 decisiones |
| Móvil | 12.99€ | Pago único, sin suscripción |
| Steam | 19.99€ | 16.99€ en lanzamiento |
| Founder Edition | 27.99€ | Steam, acceso anticipado |
| Expansiones | 9.99-12.99€ | Cada 6-9 meses |

Sin suscripción. Sin pay-to-win. Sin anuncios en versión premium.
Paywall emocional (no cruel): el jugador ya está invertido cuando llega al muro.

---

## 25. SISTEMAS ADICIONALES DISEÑADOS (pendientes)

- Mascotas con vínculo emocional real y muerte natural
- Sistema de viajes con impacto narrativo y cultural
- Sistema de idiomas (ventajas por país)
- Seguros completos (vida, hogar, salud)
- Sistema legal y judicial (demandas, herencias)
- Sistema de pensiones y FIRE
- Reputación digital desde los 2000s
- Objetos con historia emocional (`MemoryObject[]`)
- Cartas y mensajes guardados (`Communication[]`)
- Lugares con peso emocional (`MemoryPlace[]`)
- Sueños y memorias involuntarias
- Fotos y álbum familiar
- Legado cultural vivo (`CulturalLegacy`)
- Clima y estaciones
- Gastronomía como mecánica
- Libros y cultura en `psychology.creencias[]`
- Vehículos (marcas ficticias: Auros, Meridian, Ferrano...)
- Mercado inmobiliario dinámico con ciclos
- Redes sociales desde los 2000s

---

## 26. REGLAS DE CÓDIGO (inamovibles)

1. **Sin `any`** — tipos explícitos o `unknown`
2. **`import type`** para todos los imports de tipo (verbatimModuleSyntax)
3. **Componentes = solo presentación** — sin lógica de negocio, usan store o hooks
4. **Motor inmutable** — `f(state, input) = newState`, sin mutaciones, sin efectos secundarios
5. **Un hook por sistema complejo** — `useGameEngine`, `useNarrativeFeed`, `useLifestyle`
6. **`ErrorBoundary`** en cada pantalla — crash aislado, no global
7. **Sin magic numbers** — todo en `src/constants/game.constants.ts`
8. **Sin abstracciones especulativas** — código para el caso actual, no hipotético
9. **`noUnusedLocals`** — sin variables sin usar, no usar `_` prefixes como hack
10. **Código auditable por developers senior** — si no es obvio, añadir comentario del *porqué*

---

## 27. REGLAS DE DISEÑO (inamovibles)

- Nunca hay game over seco — siempre hay reflexión narrativa
- **El nombre del personaje aparece siempre** en momentos narrativos importantes
- Exactamente **3 opciones por evento** que revelan carácter diferente
- Las decisiones tienen consecuencias en **4 capas temporales**: inmediata · 6 meses · 2 años · 10 años
- El epitafio se construye desde el primer evento hasta la muerte
- **Mobile-first**: mínimo 375px, botones mínimo 44px de altura
- El juego **no explica sus mecánicas** — las muestra con consecuencias
- Tono siempre **serio y realista**, nunca absurdo ni casual
- El mundo recuerda lo que hiciste — los flags nunca se borran sin razón narrativa
- Mismo estilo visual en todas las pantallas — nunca romper la inmersión

---

## 28. ESTADO ACTUAL

### Implementado y validado
- Motor completo con simulación 25 años: `npx tsx src/test/engineTest.ts`
- 12 eventos narrativos (infancia + adolescencia) con NPCs y consecuencias diferidas
- 5 pantallas con navegación funcional
- Sistema de estilos de vida (7 tipos)
- Herencia genética + genes ocultos
- Epitafio dinámico con seeds acumuladas
- Memorias con contextos cruzados
- `useTypingAnimation` con `onComplete` callback (race condition resuelta)
- `prepareQuarter` / `commitEventChoice` para flujo UI correcto

### Próximos pasos por prioridad
1. Verificar flujo completo StartScreen → AncestorSelection → BirthScreen → GameScreen
2. Flash visual de stats al resolver eventos (stat-flash-pos / stat-flash-neg)
3. Eventos de Juventud (ages 19-30) con lógica laboral y relaciones
4. Sistema de carrera y economía conectado al motor
5. Sistema de pareja emergente
6. Emancipación como proceso real (ages 18-30)
7. Sistema económico jugable (inversiones, hipoteca)
8. Profesiones con mecánica propia
9. Modo Dynastía

---

## 29. CONTENIDO NARRATIVO DETALLADO

- Toda la narrativa (eventos, opciones, consecuencias, memorias, epitafio) está escrita en inglés.
- La UI (labels, botones, pantallas, mensajes de sistema) se muestra en el idioma del jugador.

---

## 30. PANEL "PERSONAS EN TU VIDA" (DISEÑADO, NO IMPLEMENTADO)

Ubicación: panel izquierdo de GameScreen, debajo del LifestylePanel.
Cards pequeñas por cada NPC conocido: nombre, relación, edad actual, estado (vivo / distanciado / cercano).
Cuando un NPC muere: card en gris con icono de vela.
Estado de relación actualizado por flags narrativos y consecuencias diferidas.

---

## 31. GRÁFICA DE EVOLUCIÓN DE STATS (DISEÑADO, NO IMPLEMENTADO)

SVG pequeño en panel izquierdo de GameScreen.
Muestra la evolución de los 3 stats principales del personaje en los últimos 8 trimestres.
Los 3 stats mostrados son los de mayor valor en el GameState actual.
Líneas coloreadas por grupo: cognitivo (azul), social (dorado), vital (granate).

---

## 32. VEHÍCULOS COMPLETO (DISEÑADO, NO IMPLEMENTADO)

Marcas ficticias confirmadas:
- **Económico:** Auros (Dacia/Seat), Civeo (Toyota/Honda), Nordian (VW/Skoda)
- **Premium:** Meridian (BMW), Stellan (Mercedes/Audi)
- *(resto de marcas pendiente de completar)*

---

## 33. [PENDIENTE DE CONTENIDO]

---

## 34. [PENDIENTE DE CONTENIDO]

---

## 35. [PENDIENTE DE CONTENIDO]

---

## 36. PSICOLOGÍA PROFUNDA (DISEÑADO, NO IMPLEMENTADO)

Miedos emergentes:
- Miedo al abandono (relación sin cierre)
- Miedo al fracaso (padres con expectativas)
- Miedo a la soledad (sin conexión... *(contenido pendiente de completar)*)

---

## 37. [PENDIENTE DE CONTENIDO]

---

## 38. [PENDIENTE DE CONTENIDO]

---

## 39. [PENDIENTE DE CONTENIDO]

---

## 40. OBJETOS, LUGARES Y MEMORIAS (DISEÑADO, NO IMPLEMENTADO)

**Objetos con historia emocional:** reloj del abuelo, guitarra del primer concierto, coche del primer trabajo. Se transmiten en Modo Dynastía. Los más importantes aparecen en el epitafio.

**Lugares con peso emocional:** casa de la infancia, bar del primer amor, lugar del peor momento. Volver genera memoria involuntaria automática. Lugares que desaparecen generan duelo real.

**Memorias involuntarias en feed:** formato cursiva más tenue. Estímulos: olor a comida, canción en radio, letra reconocida de alguien del pasado.

---

## 41. SISTEMA EDUCATIVO DE HIJOS (DISEÑADO, NO IMPLEMENTADO)

- Guardería: quién cuida al hijo impacta en sus stats tempranos.
- Colegio: público, concertado, privado o internacional.
- El barrio donde crece el hijo tiene impacto real en sus estadísticas. *(contenido pendiente de completar)*

---

## 42. [PENDIENTE DE CONTENIDO]

---

## 43. [PENDIENTE DE CONTENIDO]

---

## 44. [PENDIENTE DE CONTENIDO]

---

## 45. [PENDIENTE DE CONTENIDO]

---

## 46. [PENDIENTE DE CONTENIDO]

---

## 47. TRANSICIONES CINEMATOGRÁFICAS Y ATMÓSFERA VISUAL (DISEÑADO, NO IMPLEMENTADO)

**Fondo atmosférico por etapa vital:**

| Etapa | Tint | Hex |
|-------|------|-----|
| Infancia | Cálido dorado | `#221608` |
| Adolescencia | Azul frío | `#0a0d14` |
| Juventud | Ámbar | `#1a1408` |
| Adultez | Marrón oscuro | `#100d08` |
| Madurez | Gris cálido | `#0f0e0d` |
| Vejez | Casi negro | `#080807` |

**Transición cinematográfica entre etapas:** pantalla negra + nombre de etapa letra a letra + edad + frase del GDD + música nueva. Duración 4 segundos, skip con cualquier tecla. Es el momento memorable que los jugadores compartirán.

---

## 48. IDIOMAS SOPORTADOS

| Tier | Idiomas |
|------|---------|
| Tier 1 — Lanzamiento | ES (español, fuente de verdad), EN (inglés), FR (francés), DE (alemán), PT-BR (portugués Brasil) |
| Tier 2 — Post-lanzamiento | RU (ruso), PL (polaco), IT (italiano), TR (turco), ZH (chino simplificado) |

**Arquitectura:**
- `react-i18next` instalado. Archivos en `src/i18n/locales/`.
- Todos los strings en componentes deben usar `t('clave')`, nunca hardcodeados.
- Comentarios en el código en inglés. UI en el idioma del jugador.
