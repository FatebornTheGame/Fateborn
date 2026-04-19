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
| UI | React 19 | JSX con react-jsx |
| Lenguaje | TypeScript 5.9 | Estricto, sin any |
| Estado | Zustand 5 | Store central en src/store/gameStore.ts |
| Estilos | Tailwind CSS v4 | Via @tailwindcss/vite, config en index.css |
| Build | Vite 8 | ESM, "type": "module" |
| Deploy | Vercel | fateborn.vercel.app |
| Persistencia | Dexie.js | IndexedDB para saves locales (pendiente) |

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

## 4. DISEÑO VISUAL

### Paleta de color

| Token | Hex | Uso |
|-------|-----|-----|
| Cuero oscuro | #0d0b08 | Fondo universal |
| Dorado | #C9A84C | Abuelos, bordes activos, texto principal, botones |
| Granate | #8B1A2A | Abuelas, stats negativos, acentos de alerta |
| Felt-2 | #141210 | Fondos secundarios |
| Felt-3 | #1c1915 | Cards, paneles |
| Muted | #6b6045 | Texto secundario, labels |

### Tipografía
- Cinzel (Google Fonts) — títulos, labels, botones, UI narrativa
- Georgia italic — lore, narrativa larga
- sans-serif — texto de sistema

### Assets en /public/

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| fateborn_title.png | Solo el texto FATEBORN | StartScreen logo |
| fateborn_banner_nobg.png | Logo árbol sin fondo | Splash alternativo |
| fateborn_banner.png | Logo árbol con fondo | OG image |
| fateborn_logo.png | Isotipo cuadrado | Favicon alternativo |

### Música en /public/music/ — Serat · Piano Textures (CC BY)
Créditos obligatorios en la app: "Música: Serat — Piano Textures (CC BY)"

| Archivo | Pantalla / Etapa |
|---------|-----------------|
| opening.mp3 | StartScreen → AncestorSelection |
| trails.mp3 | BirthScreen |
| young-filmmaker.mp3 | Infancia (0-12) |
| timelapse.mp3 | Adolescencia (13-18) |
| viewpoint.mp3 | Juventud (19-30) |
| dark-decision.mp3 | Adultez (31-50) y DeathScreen |
| old-chantry.mp3 | Madurez (51-70) |
| cast-vejez.mp3 | Vejez (71+) |
| winter-quarters.mp3 | Momentos de crisis grave |

---

## 5. ARQUITECTURA DE CARPETAS

src/
  constants/
    game.constants.ts     — sin magic numbers (colores, tiempos, probabilidades)
  types/
    game.types.ts         — todos los tipos del juego + helpers
    archetype.types.ts    — Archetype, AncestorSlot
  data/
    archetypes.ts         — 8 arquetipos con stats completos
    countries.ts          — 20 países con tier y modificadores
    passiveNarrative.ts   — textos pasivos por etapa y estilo de vida
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
    AtmosphericBackground.tsx — fondo atmosférico reutilizable
  i18n/
    index.ts              — inicialización react-i18next
    locales/              — es.json, en.json, fr.json, de.json, pt-BR.json, ru.json, pl.json, it.json, tr.json, zh.json
  hooks/
    useGameEngine.ts      — wraps prepareQuarter/commitEventChoice
    useNarrativeFeed.ts   — feed agrupado por edad
    useLifestyle.ts       — estado y cambio de estilo de vida
    useTypingAnimation.ts — animación letra a letra con onComplete callback
  components/
    ErrorBoundary.tsx
    StatsRadarChart.tsx   — SVG hexagonal de 9 stats
    StatusBar.tsx         — barra fija superior
    LifestylePanel.tsx    — panel de estilo de vida + avanzar trimestre
    NarrativeFeed.tsx     — feed cronológico con eventos inline
    LifeTimeline.tsx      — línea SVG de vida en footer
    TabBar.tsx            — tabs mobile (INICIATIVA | HISTORIA)
    AncestorSlots.tsx     — 4 slots de selección
    ArchetypeCard.tsx     — carta de arquetipo
    CountrySelector.tsx   — selector de país
    HiddenGenesDisplay.tsx
    AncestralNarrative.tsx
    MuteButton.tsx        — botón silenciar música, posición fija
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
  character:           Character
  ageYears:            number
  totalQuarters:       number
  stats:               Stats
  flags:               string[]
  friends:             Friend[]
  pendingConsequences: PendingConsequence[]
  memories:            Memory[]
  epitaph:             EpitaphState
  firedEvents:         string[]
  feed:                NarrativeEntry[]
  economy:             Economy
  career:              Career | null
  vitalLoad:           number
  legacyScore:         number
  sexualOrientation:   SexualOrientation
  orientationRevealed: boolean
  language:            Language
  rival:               RivalState
  moralCorruption:     number
}

### StatDeltaResolver

type StatDeltaResolver = Partial<Stats> | ((state: GameState) => Partial<Stats>)

function resolveDeltas(d: StatDeltaResolver, state: GameState): Partial<Stats> {
  return typeof d === 'function' ? d(state) : d
}

### EventOption

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
commitEventChoice(state, event, optionId): GameState
processGameTurn(state, allocation, resolveEvent?): TurnResult
processMultipleQuarters(state, allocation, count): GameState

### Flujo de un trimestre (en orden)

1. totalQuarters + 1 — recalcular ageYears
2. Efectos de TimeAllocation sobre stats
3. Procesar pendingConsequences
4. Avanzar vidas paralelas de NPCs (advanceNPCLives)
5. Avanzar vida paralela del rival (advanceRivalLife)
6. Buscar evento elegible por triggerAge + flags + weight
7. Si hay evento — QuarterPrep.pendingEvent, store espera input
8. commitEventChoice — aplicar stats, flags, NPC, consecuencias, memoria, epitafio, moralCorruption

### Validación del motor

Ejecutar: npx tsx src/test/engineTest.ts
Resultado confirmado: 12 eventos disparados, 11 consecuencias diferidas, NPC Gonzalo vivo a los 31, epitafio con 12 seeds, stats finales coherentes (Lógica 8.3, Emocional 8.1).

---

## 8. STORE (src/store/gameStore.ts)

type Screen     = 'start' | 'ancestors' | 'birth' | 'game' | 'death'
type Difficulty = 'historia' | 'fateborn' | 'ironman' | 'legado'
type Language   = 'es' | 'en' | 'fr' | 'de' | 'pt-BR' | 'ru' | 'pl' | 'it' | 'tr' | 'zh'

Acciones principales:
setScreen(screen)
setDifficulty(difficulty)
selectAncestor(ancestor, slot 0-3)
removeAncestor(slot)
setCountry(country)
confirmAncestors()
startNewGame(name, gender)
setLifestyle(lifestyle)
setLanguage(language)
advanceQuarter()
resolveEvent(optionId)

### Flujo de evento en UI
1. advanceQuarter() — prepareQuarter() — pendingEvent + preEventState en store
2. NarrativeFeed muestra contexto + 3 opciones
3. Jugador elige — resolveEvent(optionId) — commitEventChoice() — nuevo gameState

---

## 9. PANTALLAS

### StartScreen
- Logo fateborn_title.png + tagline animado letra a letra (Cinzel, dorado)
- Secuencia: LINE_1 — pausa 1.5s — LINE_2 — botón NUEVA VIDA visible
- useTypingAnimation con onComplete callback (evita race condition stale isDone)
- Fallback: botón visible a los 9s
- Selector de dificultad con 4 cards — fateborn preseleccionado
- Selector de idioma top-right (10 idiomas)
- Música opening.mp3 con fade in 2s
- overflow-y: auto en root

### AncestorSelection
- 8 arquetipos en grid 4 columnas desktop, 2 columnas mobile
- 4 slots sticky superiores — dorado para abuelos (slots 0,2), granate para abuelas (slots 1,3)
- El mismo arquetipo puede asignarse a más de un slot
- Confirmar activo solo con 4 slots llenos + país elegido
- confirmAncestors() calcula inheritedStats + hiddenGenes

### BirthScreen
- Layout dos columnas desktop: izquierda radar chart, derecha formulario
- StatsRadarChart SVG hexagonal 9 stats, size 320px desktop
- HiddenGenesDisplay con valores en escala 0-10, toFixed(1)
- AncestralNarrative con género correcto (nameFeminine para slots 1,3)
- Form: nombre + selector hombre/mujer + botón COMENZAR VIDA
- Mobile: una columna

### GameScreen
- Desktop: StatusBar (56px fijo) | LifestylePanel (300px) | NarrativeFeed (flex-1) | LifeTimeline (48px fijo)
- Mobile: StatusBar | TabBar (INICIATIVA | HISTORIA) | contenido tab | LifeTimeline
- Panel izquierdo: LifestylePanel + cards NPCs vivos + gráfica stats
- Narrativa pasiva por trimestre cuando no hay evento activo
- overflow-hidden en root, paneles internos con scroll

### DeathScreen
- Epitafio como lápida SVG
- StatsRadarChart perfil final
- Grid legado: años vividos, memorias, amigos, hitos
- Nueva vida — setScreen('start')

---

## 10. LOS 8 ARQUETIPOS (src/data/archetypes.ts)

| Arquetipo | nameFeminine | Stats destacados | Lore |
|-----------|-------------|-----------------|------|
| Académico | académica | Lógica 9, Disciplina 8 | "Entender el mundo antes de intentar cambiarlo." |
| Líder | líder | Carisma 9, Ambición 8 | "El poder no se toma. Se ejerce hasta que los demás lo reconocen." |
| Atleta | atleta | Físico 9, Disciplina 8 | "El dolor es información. La victoria, consecuencia." |
| Artista | artista | Creatividad 9, Emocional 8 | "No hace el arte porque puede. Lo hace porque no puede no hacerlo." |
| Filósofo | filósofa | Lógica 8, Creatividad 7 | "Las preguntas que no tienen respuesta son las únicas que merecen hacerse." |
| Emprendedor | emprendedora | Ambición 9, Riesgo 8 | "El primer negocio quebró. El segundo también. El tercero cambió todo." |
| Cuidador | cuidadora | Emocional 9, Estabilidad 9 | "La mayor fortaleza es aquella que sostiene a los demás." |
| Explorador | exploradora | Riesgo 9, Físico 8 | "Los mapas mienten. La realidad hay que ir a verla." |

### Herencia genética
inheritedStats[stat] = mean(4 ancestors[stat]) x (1 +/- random x 0.10)
hiddenGenes[stat]    = max(ancestors[stat]) x 1.10   si > inherited + 0.5
sexualOrientation    = random: 85% hetero / 7% homo / 8% bisexual

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

Cada país: incomeMultiplier, taxRate, statsBonus, idioma, sistema político, eventos históricos propios, name pools de NPCs.

---

## 12. EVENTOS IMPLEMENTADOS

### Infancia (ages 6-12)

| ID | Edad | Descripción |
|----|------|-------------|
| first_friend | 6 | Genera NPC con BEST_FRIEND_PARALLEL_ARC (8 hitos hasta los 77) |
| hobby_discovery | 8 | Opciones por stat dominante: físico→deporte, lógica→ajedrez, creatividad→arte |
| school_conflict | 10 | 3 variantes por flags: defiendes/eres víctima/eres agresor |
| family_dynamic | 11 | Variante por economía y flags: tensión/divorcio/estable |
| talent_discovered | 12 | statDeltas funcional: detecta top stat y refuerza con +0.3 específico |

### Adolescencia (ages 13-18)

| ID | Edad | Descripción |
|----|------|-------------|
| first_love | 13 | Coherente con sexualOrientation; usa NPC existente si hay |
| academic_decision | 14 | ciencias / humanidades / tecnología; variante por país |
| pressure_moment | 15 | esfuerzo / equilibrio / sacrificar hobby |
| identity_reflection | 15 | Solo narrativa; muestra stat dominante y débil (weight 0.6) |
| first_job_direction | 16 | Contexto país+stat; trabajo / estudios / balance |
| final_exam_pressure | 17 | Solo si flags ciencias o humanidades (weight 0.8) |
| adulthood_threshold | 18 | Mentalidad: ambicioso / cauto / libre; consecuencias hasta los 30 |

### NPC Parallel Arc (amigo de infancia)
8 pasos vitales: ages 8, 14, 16, 22, 30, 45, 60, 77. Muerte estocástica a los ~77 según fisico stat del NPC.

---

## 13. SISTEMA DE ESTILOS DE VIDA (lifestyleSystem.ts)

| Tipo | Label | Trabajo | Estudios | Familia | Social | Salud | Ocio |
|------|-------|---------|----------|---------|--------|-------|------|
| ambitious | Ambicioso | 5 | 4 | 1 | 1 | 1 | 1 |
| balanced | Equilibrado | 2 | 3 | 2 | 2 | 2 | 2 |
| social | Social | 2 | 2 | 2 | 5 | 1 | 1 |
| athletic | Atlético | 2 | 2 | 1 | 1 | 6 | 1 |
| hedonist | Hedonista | 1 | 1 | 1 | 3 | 1 | 6 |
| family | Familiar | 2 | 1 | 6 | 2 | 1 | 1 |
| spiritual | Contemplativo | 1 | 3 | 1 | 1 | 3 | 4 |

Suma siempre 13 semanas. Efectos pasivos por trimestre sobre stats según proporciones.

---

## 14. ORIENTACIÓN SEXUAL

- Asignada en startNewGame() con rollSexualOrientation()
- orientationRevealed: false al nacer
- Emerge naturalmente en first_love (edad 13)
- La supresión activa tiene consecuencias diferidas (emocional, estabilidad)
- Impacta sistema de pareja emergente y Modo Dynastía

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

Edad máxima absoluta: 95 años (ampliable con sistema de longevidad extendida, sección 58).

---

## 16. DIFICULTAD

| Modo | Descripción | Multiplicador |
|------|-------------|---------------|
| Historia | Consecuencias suaves. La narrativa primero. | 0.5x |
| Fateborn | Experiencia diseñada. Consecuencias reales. | 1x |
| Ironman | Sin red de seguridad. Muerte prematura posible. | 1.5x |
| Legado | Transferencia Dynastía obligatoria a los 25. | 2x |

---

## 17. SISTEMA DE PAREJA COMPLETO (DISEÑADO, NO IMPLEMENTADO)

No es un botón. Es un proceso emergente.

Cómo emerge el amor:
- Tiempo en SOCIAL: personas en entornos sociales
- Tiempo en DEPORTE: alguien en equipo o gimnasio
- Tiempo en TRABAJO: compañero o compañera
- Tiempo en OCIO: alguien en concierto o hobby compartido
- Tiempo en ESTUDIOS: alguien en biblioteca o clase

5 fases de evolución:
1. Enamoramiento (0-2 años): todo perfecto, sin fricción
2. Realidad (2-5 años): los defectos aparecen, primera crisis
3. Construcción (5-15 años): construís algo juntos
4. Crisis de los 20 años: quién eres ahora, quién soy yo
5. Vejez juntos: la pareja como familia, no como romance

Perfil económico heredado de ancestros:
- Hijo/a de Académico: ahorrador, planificador
- Hijo/a de Artista: gastador en experiencias
- Hijo/a de Emprendedor: inversor, aliado estratégico
- Hijo/a de Superviviente: pragmático, busca seguridad

Mecánicas adicionales:
Infidelidad posible con consecuencias en 4 capas temporales.
Divorcio con proceso legal y económico real.
Custodia como la decisión más dura del arco de pareja.
Ventana de oportunidad que puede cerrarse si no actúas.

---

## 18. EMANCIPACIÓN (DISEÑADO, NO IMPLEMENTADO)

Proceso obligatorio entre 18-30 años. 4 vías:
1. Padres pagan (capital heredado disponible)
2. Alquiler — fianza + amueblado + averías aleatorias
3. Compra — necesitas 20% entrada + gastos notariales
4. Forzada — piso compartido de emergencia

Hipoteca fija vs variable (Euribor). Compra siempre más eficiente a largo plazo.

---

## 19. SISTEMA ECONÓMICO (DISEÑADO, NO IMPLEMENTADO)

economy: {
  liquidez, ingresos, gastos, patrimonio
  cartera: [ETFs, acciones, bonos, oro, crypto, REITs]
  inmuebles: []
  hipoteca: { tipo: fija|variable|mixta, euribor, cuota }
  negocio: BusinessState | null
}

Inversiones: MSCI World, S&P500, EuroStoxx50, Nikkei, acciones individuales, oro, crypto, REITs.
Casino y apuestas con riesgo de adicción.
Interés compuesto visible y proyectado.
Newsletter trimestral con ciclos económicos aleatorios.
Impuestos reales por país.

---

## 20. LAS 20 PROFESIONES (DISEÑADAS, NO IMPLEMENTADAS)

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

Cada una: 10 niveles, mecánica única, obra maestra final, transiciones con sentido. Ver sección 56 para mecánicas detalladas de profesiones clave.

---

## 21. ARCOS NARRATIVOS EMERGENTES (DISEÑADOS)

| Arco | Condición de desbloqueo |
|------|------------------------|
| Breaking Bad | Científico/médico nivel 3+ + diagnóstico terminal + deudas + Ambición > 6 |
| Mike Ehrmantraut | Policía nivel 3+ + traición o amenaza a familia |
| El Padrino | Familia atacada + poder suficiente |
| Saul Goodman | Abogado nivel 3+ + contacto_criminal + Ambición > 7 |
| Mandela | País Tier D/E/F + Carisma 7+ + Ambición 8+ |
| Jordan Belfort | Financiero nivel 2+ + vacío legal + Riesgo > 7 |
| Armstrong | Piloto militar + programa espacial disponible |
| Icarus | Deportista + doping accesible + Ambición > 8 |
| El Infiltrado | Agente + infiltración + años de doble vida |
| Citizen Kane | Billonario + vacío existencial + Emocional < 4 |

Cada arco: condiciones exactas, 3-6 fases, puntos de salida, finales múltiples.

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

Nobel, Presidente de país, Luna, Billonario, Campeón mundial, 14 ochomiles, Director CIA/Europol, Leyenda musical, Empresa que dura 100 años.

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

## 25. SISTEMAS ADICIONALES DISEÑADOS (pendientes de implementar)

- Mascotas con vínculo emocional real y muerte natural
- Sistema de viajes con impacto narrativo y cultural (ver sección 57)
- Sistema de idiomas (ventajas por país)
- Seguros completos (vida, hogar, salud)
- Sistema legal y judicial (demandas, herencias)
- Sistema de pensiones y FIRE (ver sección 61)
- Reputación digital desde los 2000s
- Fotos y álbum familiar
- Legado cultural vivo (ver sección 59)
- Clima y estaciones
- Gastronomía como mecánica (ver sección 60)
- Libros y cultura (ver sección 62)
- Redes sociales desde los 2000s
- Sueños (ver sección 63)

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
9. noUnusedLocals — sin variables sin usar
10. Código auditable por developers senior — si no es obvio, comentar el porqué
11. Todos los strings de UI en i18n — nunca hardcodeados en componentes
12. Comentarios en el código en inglés

---

## 27. REGLAS DE DISEÑO (inamovibles)

- Nunca hay game over seco — siempre hay reflexión narrativa
- El nombre del personaje aparece siempre en momentos narrativos importantes
- Exactamente 3 opciones por evento que revelan carácter diferente
- Las decisiones tienen consecuencias en 4 capas temporales: inmediata, 6 meses, 2 años, 10 años
- El epitafio se construye desde el primer evento hasta la muerte
- Mobile-first: mínimo 375px, botones mínimo 44px de altura
- El juego no explica sus mecánicas — las muestra con consecuencias
- Tono siempre serio y realista, nunca absurdo ni casual
- El mundo recuerda lo que hiciste — los flags nunca se borran sin razón narrativa
- Mismo estilo visual en todas las pantallas — nunca romper la inmersión
- Las opciones de eventos nunca tienen respuesta correcta — revelan carácter, no inteligencia

---

## 28. ESTADO ACTUAL

### Implementado y validado
- Motor completo con simulación 25 años: npx tsx src/test/engineTest.ts
- 12 eventos narrativos (infancia + adolescencia) con NPCs y consecuencias diferidas
- 5 pantallas con navegación funcional y diseño visual consistente
- Sistema de estilos de vida (7 tipos) con narrativa pasiva por trimestre
- Herencia genética + genes ocultos con escala correcta (0-10, toFixed(1))
- Epitafio dinámico con seeds acumuladas
- Memorias con contextos cruzados
- useTypingAnimation con onComplete callback
- prepareQuarter / commitEventChoice para flujo UI correcto
- Design system centralizado en src/styles/tokens.ts
- AtmosphericBackground.tsx como componente reutilizable
- i18n con react-i18next, 10 idiomas, archivos en src/i18n/locales/
- Narrativa pasiva por trimestre con sistema anti-repetición (src/data/passiveNarrative.ts)
- MuteButton en todas las pantallas
- Género femenino correcto en AncestralNarrative (nameFeminine por slot)
- AncestorSelection con slots sticky, 8 arquetipos, arquetipos repetibles
- BirthScreen layout dos columnas desktop

### Próximos pasos por prioridad
1. Flash visual de stats al resolver eventos (+0.3 verde / -0.5 rojo, fadeOut 1.5s)
2. Fondo atmosférico cambia con etapa vital (tints sección 47)
3. Cards de NPCs vivos en panel izquierdo GameScreen
4. Barra de progreso de etapa: INFANCIA 8/12 años con hitos
5. Transición cinematográfica entre etapas
6. Eventos de Juventud (ages 19-30) con lógica laboral y relaciones
7. Sistema de carrera y economía conectado al motor
8. Sistema de pareja emergente
9. Newsletter trimestral con diseño de periódico
10. Modo Dynastía

---

## 29. CONTENIDO NARRATIVO DETALLADO

Toda la narrativa es específica a este personaje, no genérica.
El nombre del personaje aparece siempre en momentos de tensión.
La UI se muestra en el idioma del jugador via i18n.
La narrativa de eventos está en español como fuente de verdad y se traduce a los 10 idiomas.

### Evento first_friend (edad 6)
Contexto España: "Es el primer día de primaria. Las mochilas son casi más grandes que vosotros. En el patio hay uno que está solo."
Contexto Nigeria: "El colegio tiene techo de zinc que suena cuando llueve. 40 niños en tu clase. Uno siempre llega antes y se sienta en el mismo sitio."
Contexto EEUU: "El autobús escolar huele a plástico. Te sientas al lado de alguien por accidente."

Opción A extrovertido: +0.4 Carisma, afinidad NPC 8/10, flag extrovertido_infancia. Consecuencia diferida edad 13: primer amor más fácil.
Opción B observador: +0.4 Emocional, confianza NPC 9/10, flag observador_infancia. Este NPC será el más leal del juego.
Opción C introvertido: +0.3 Lógica +0.2 Estabilidad, no nace amistad, flag introvertido_infancia. Consecuencia diferida edad 13: primer amor más difícil. Consecuencia diferida edad 16: más independiente en decisiones de carrera.

### Evento hobby_discovery (edad 8)
Si Físico 7+: fútbol (+0.5 Físico +0.3 Carisma), natación (+0.5 Físico +0.4 Disciplina), artes marciales (+0.4 Físico +0.4 Disciplina).
Si Lógica 7+: ajedrez (+0.6 Lógica +0.3 Disciplina), construir/maker (+0.5 Lógica +0.4 Creatividad), lectura (+0.6 Lógica +0.3 Emocional).
Si Creatividad 7+: dibujo (+0.6 Creatividad), música (+0.6 Creatividad +0.2 Emocional), escritura (+0.5 Creatividad +0.4 Emocional).
Sin hobby a los 10: evento de vacío con consecuencia diferida a los 35-40.

### Evento school_conflict (edad 10)
Variante A (flag extrovertido_infancia o social_infancia): el jugador es testigo de bullying.
  Opción A defiendes: +0.4 Carisma +0.3 Emocional, flag protector. Consecuencia diferida edad 16: alguien te recuerda y te ayuda.
  Opción B observas sin actuar: +0.2 Estabilidad, flag observador_conflicto. Consecuencia diferida edad 25: culpa latente que emerge en crisis.
  Opción C buscas un adulto: +0.3 Disciplina, flag institucional. Sin consecuencias negativas inmediatas.

Variante B (flag introvertido_infancia): el jugador es la víctima.
  Opción A respondes con humor: +0.3 Carisma, flag resiliente. La situación se desescala.
  Opción B te aíslas: -0.2 Carisma +0.3 Lógica, flag introversion_reforzada. Consecuencia diferida edad 15: soledad adolescente.
  Opción C explota: +0.2 Riesgo -0.2 Estabilidad, flag temperamento. Consecuencia diferida edad 18: dificultad gestión emocional.

### Evento family_dynamic (edad 11)
Variante A (economy alta, sin flags negativos): familia estable.
  Opción A participas activamente: +0.3 Emocional +0.2 Estabilidad, flag familia_unida.
  Opción B te distancias: +0.2 Lógica, flag independencia_temprana.
  Opción C medias en conflictos pequeños: +0.4 Emocional, flag mediador_familiar.

Variante B (economy baja o flag tension_economica): tensión económica.
  Opción A ignoras y sigues con tu vida: sin cambio de stats, flag desconexion_familiar.
  Opción B intentas ayudar: +0.3 Emocional -0.2 Creatividad, flag responsabilidad_prematura. Consecuencia diferida edad 18: dificultad con emancipación.
  Opción C preguntas directamente qué pasa: +0.3 Emocional +0.2 Carisma, flag comunicacion_directa.

Variante C (flag divorcio o separacion): padres se separan.
  Opción A te culpas: -0.3 Estabilidad, flag culpa_divorcio. Consecuencia diferida edad 25: dificultad en relaciones propias.
  Opción B aceptas y te adaptas: +0.2 Estabilidad, flag adaptabilidad.
  Opción C tomas partido: +0.2 Carisma -0.3 Emocional, flag lealtad_dividida. Consecuencia diferida edad 30: relación complicada con un progenitor.

### Evento talent_discovered (edad 12)
Detecta automáticamente el stat más alto y genera opción específica.
  Si Físico dominante: un entrenador te nota en educación física.
  Si Lógica dominante: un profesor te propone una olimpiada de matemáticas.
  Si Creatividad dominante: un trabajo tuyo es seleccionado para una exposición.
  Si Carisma dominante: te eligen para representar al colegio en un acto público.
  Si Emocional dominante: un adulto te dice que tienes una madurez inusual.
  Opción A aceptas y te comprometes: +0.3 al stat dominante +0.2 Disciplina, flag talento_reconocido.
  Opción B aceptas pero sin convicción: +0.1 al stat dominante, sin flag.
  Opción C rechazas por vergüenza o miedo: +0.2 Estabilidad, flag talento_suprimido. Consecuencia diferida edad 35: redescubres ese talento.

### Evento first_love (edad 13)
Coherente con sexualOrientation. Si hay NPC generado previamente puede ser esa persona.
  Heterosexual: aparece persona del sexo opuesto en el entorno más frecuentado.
  Homosexual: aparece persona del mismo sexo. Si orientationRevealed es false, el evento la revela.
  Bisexual: puede ser cualquier género, emerge del contexto.
  Opción A te acercas directamente: +0.3 Carisma, flag primer_amor_activo.
  Opción B lo observas desde lejos semanas: +0.2 Emocional, flag primer_amor_contemplativo. Consecuencia diferida edad 14: la persona conoce a alguien más.
  Opción C lo ignoras activamente: +0.2 Estabilidad, flag primer_amor_suprimido. Consecuencia diferida edad 16: reaparece en tu círculo social.

### Evento academic_decision (edad 14)
Variante por país Tier S/A: tres opciones de bachillerato o equivalente.
Variante por país Tier B: ciencias, humanidades, o formación profesional.
Variante por país Tier D/E: continuar estudiando o empezar a trabajar.
  Opción A ciencias/técnico: +0.3 Lógica +0.2 Disciplina, flag direccion_ciencias.
  Opción B humanidades/social: +0.3 Creatividad +0.2 Emocional, flag direccion_humanidades.
  Opción C vocacional/trabajar: +0.3 Ambición +0.2 Físico, flag direccion_practica.

### Evento pressure_moment (edad 15)
  Opción A todo al estudio: +0.4 Disciplina -0.2 Emocional, flag sacrificio_adolescente.
  Opción B equilibrio: +0.2 Disciplina +0.2 Emocional, flag equilibrio_adolescente.
  Opción C vida social: +0.3 Carisma -0.2 Disciplina, flag social_adolescente.

### Evento identity_reflection (edad 15, weight 0.6)
Solo narrativa. Muestra stat dominante y el más bajo. No modifica stats. Seed al epitafio.

### Evento first_job_direction (edad 16)
Solo si flag direccion_practica o Ambición > 7.
  Opción A trabajo a tiempo parcial: +0.2 Ambición +0.2 Disciplina, flag trabajo_temprano.
  Opción B prácticas no remuneradas: +0.3 en stat de dirección académica, flag practicas_tempranas.
  Opción C solo estudios: +0.2 Lógica. Consecuencia diferida edad 22: sin experiencia laboral.

### Evento final_exam_pressure (edad 17, solo si flag ciencias o humanidades)
  Opción A estudias toda la noche: +0.2 Lógica -0.3 Físico. Resultado alto: 70%.
  Opción B hora normal: sin cambio. Resultado medio-alto: 60%.
  Opción C sales con amigos: +0.2 Carisma -0.2 Disciplina. Resultado bajo: 65%.

### Evento adulthood_threshold (edad 18)
  Opción A ambicioso: +0.4 Ambición +0.2 Riesgo, flag mentalidad_ambiciosa.
  Opción B cauto: +0.3 Estabilidad +0.2 Disciplina, flag mentalidad_cautelosa.
  Opción C libre: +0.3 Creatividad +0.2 Riesgo, flag mentalidad_libre.

---

## 30. PANEL PERSONAS EN TU VIDA (DISEÑADO, NO IMPLEMENTADO)

Ubicación: panel izquierdo de GameScreen, debajo del LifestylePanel.
Cards pequeñas: nombre, relación, edad actual, estado (vivo / distanciado / cercano).
Cuando un NPC muere: card en gris con icono de vela.

---

## 31. GRÁFICA DE EVOLUCIÓN DE STATS (DISEÑADO, NO IMPLEMENTADO)

SVG pequeño en panel izquierdo. Evolución de los 3 stats principales en los últimos 8 trimestres.
Líneas coloreadas: cognitivo (azul), social (dorado), vital (granate).

---

## 32. VEHÍCULOS COMPLETO (DISEÑADO, NO IMPLEMENTADO)

### Marcas ficticias
Económico: Auros, Civeo, Nordian. Premium: Meridian, Stellan, Vanto.
Deportivo: Ferrano, Veloce, Weybridge, Strato. Americano: Bison, Luminar.
Eléctrico: Voltex. Off-road: Terrain.

### Categorías
Coches: utilitario (8-20k) → hypercar (500k-5M) → clásico coleccionable.
Motos: scooter (1.5-5k) → custom (15-80k).
Náutica: lancha (15-80k) → submarino privado (500k-20M).
Aviación: ultraligero (30-80k) → 747 ejecutivo (50M+).
Costes calculados automáticamente. Carné obligatorio (800-1.500 euros, 2-3 meses).

---

## 33. VIVIENDA Y MERCADO INMOBILIARIO (DISEÑADO, NO IMPLEMENTADO)

8 tipos: Estudio → Isla privada (hito imposible).
Precios alquiler: Londres/París 2.200/mes → Pueblo 350/mes.
Mercado dinámico con ciclos alcistas y bajistas. Newsletter avisa señales, no certezas.
Inversión inmobiliaria disponible. Problemas reales del alquiler.

---

## 34. SISTEMA DE SALUD COMPLETO (DISEÑADO, NO IMPLEMENTADO)

Agudas, crónicas y terminales. Predisposición genética desde genes ocultos.
Burnout: no es estrés, es vacío. Recuperación meses, no semanas.

---

## 35. SISTEMA DE ADICCIONES (DISEÑADO, NO IMPLEMENTADO)

Progresión SIEMPRE oculta. Sin alarmas. Señales sutiles primero.
No hay cura, hay gestión. Recaídas reales. El sponsor con arco narrativo propio.

---

## 36. PSICOLOGÍA PROFUNDA (DISEÑADO, NO IMPLEMENTADO)

Miedos emergentes que limitan opciones visiblemente.
Crisis de propósito a los 35-50. Corrupción moral gradual (0-100) solo visible en epitafio.
Almacenado en GameState.moralCorruption.

---

## 37. MUNDO E HISTORIA (DISEÑADO, NO IMPLEMENTADO)

Eventos históricos aleatorios: crisis, pandemia, revolución tecnológica, guerra.
Cambio tecnológico: Internet (~1995), smartphones (2007+), IA (2020s+).
El periódico del mundo: titulares dinámicos, publicidad de época, necrológicas.

---

## 38. SISTEMA DE FAMA (DISEÑADO, NO IMPLEMENTADO)

Niveles 0-100. La fama como trampa: soledad, imposibilidad de normalidad a partir de nivel 70.
Cancelación como mecánica real. Rehabilitación: proceso largo.

---

## 39. SECRETOS Y CHANTAJE (DISEÑADO, NO IMPLEMENTADO)

Peso emocional 1-10. Peso 8+: afecta Estabilidad crónicamente.
En Modo Dynastía: el escándalo póstumo que descubre tu hijo.

---

## 40. OBJETOS, LUGARES Y MEMORIAS (DISEÑADO, NO IMPLEMENTADO)

Objetos con historia emocional se transmiten en Modo Dynastía y aparecen en el epitafio.
Lugares que desaparecen generan duelo. Memorias involuntarias: cursiva más tenue en el feed.

---

## 41. SISTEMA EDUCATIVO DE HIJOS (DISEÑADO, NO IMPLEMENTADO)

El barrio determina el colegio. La educación determina stats del descendiente en Modo Dynastía.
Es la inversión más rentable del juego a largo plazo.

---

## 42. HERENCIAS Y TESTAMENTOS (DISEÑADO, NO IMPLEMENTADO)

Herencia positiva y negativa. La segunda familia que no sabías que existía.
Herencia emocional en Modo Dynastía: traumas y valores transmitidos sin querer.

---

## 43. INGENIERÍA PSICOLÓGICA (PRINCIPIOS DE DISEÑO, NO IMPLEMENTACIÓN TÉCNICA)

Estos 12 principios deben guiar cada decisión de diseño de UI y narrativa. No son sistemas de código sino criterios de evaluación: antes de añadir cualquier elemento nuevo, verificar que cumple al menos uno.

1. Efecto IKEA: nunca mostrar la decisión correcta. El jugador construye su historia.
2. Variable Ratio Reinforcement: resultados variables. No siempre la misma recompensa.
3. Loss Aversion: ventanas de oportunidad con tiempo visible que se cierran.
4. Progress Visibility: barra de profesión y etapa siempre visible.
5. Social Proof: solo el 0.3% de jugadores llegó al Nobel.
6. Endowment Effect: nombre, historia y cara del personaje desde el minuto 1.
7. Curiosity Gap: genes ocultos que emergen tarde. El jugador siempre espera algo.
8. Sunk Cost: árbol genealógico siempre visible. Ya invertiste demasiado para parar.
9. Autonomy Bias: panel de iniciativa da sensación de control real.
10. Narrative Transportation: nombre del personaje en cada momento de tensión.
11. Temporal Landmarks: cada etapa vital se presenta como un nuevo inicio.
12. Zeigarnik Effect: siempre algo casi listo. La profesión al 80%, el evento que viene.

---

## 44. EPITAFIO VIVO DETALLADO

Visible en cualquier momento (panel colapsable en GameScreen). Cambia desde el primer evento.
Los objetos más importantes aparecen en él. La corrupción moral solo visible aquí.
Pantalla de muerte: 15 segundos de preparación. Lápida SVG con textura de piedra en CSS.

---

## 45. FEEDBACK UX PENDIENTE DE IMPLEMENTAR

1. Scroll al inicio automático al cambiar de pantalla
2. Tutorial/onboarding (3 pasos, una sola vez, localStorage)
3. Flash visual de stats: +0.3 verde / -0.5 rojo, fadeOut 1.5s
4. Barra de progreso de etapa: INFANCIA 8/12 años con hitos
5. Fondo atmosférico cambia con etapa vital
6. Transición cinematográfica entre etapas
7. Cards de NPCs vivos en panel izquierdo
8. Gráfica de evolución de stats (SVG 8 trimestres)
9. Newsletter trimestral con diseño de periódico
10. Epitafio como lápida SVG en panel colapsable
11. Analizar antes de decidir muestra información real
12. Tiempo invertido genera eventos coherentes

---

## 46. TRANSPORTE COTIDIANO (DISEÑADO, NO IMPLEMENTADO)

Sin metro: trabajo limitado. Polígono: coche obligatorio.
Pueblo + ciudad: 2h/día = -1 día efectivo/semana. Carné: requisito previo.

---

## 47. SISTEMAS DE ADICCIÓN Y RETENCIÓN

### El Rival
Mismos ancestros, diferente país, orientación y suerte. Vive en paralelo.
Aparece en newsletter: "Mientras tú estudiabas, Miguel montó su primera empresa."
RivalState ya existe en GameState.

### Newsletter Trimestral Expandida
Cada 4 trimestres. Tres secciones: MUNDO, TU ENTORNO, ECONOMÍA.
Sin años reales para evitar meta-gaming. Diseño de periódico de época.

### Fondo atmosférico por etapa vital
| Etapa | Hex |
|-------|-----|
| Infancia | #221608 |
| Adolescencia | #0a0d14 |
| Juventud | #1a1408 |
| Adultez | #100d08 |
| Madurez | #0f0e0d |
| Vejez | #080807 |

### Transición cinematográfica entre etapas
Pantalla negra + nombre de etapa letra a letra + edad + frase del GDD + música nueva. 4 segundos, skip con cualquier tecla.

### Mascotas
Vínculo emocional 0-10. La muerte es uno de los eventos más impactantes. El duelo dura semanas.
Razas: Border Collie, Golden Retriever, Rottweiler, Chihuahua.
Eventos: operación cara (3.200 euros), perro detecta infarto, eutanasia, alergia del hijo, ex quiere el perro.
En Modo Dynastía: la tortuga que tiene 40 años en generación 3.

---

## 48. IDIOMAS SOPORTADOS

| Tier | Idiomas |
|------|---------|
| Tier 1 — Lanzamiento | ES (español, fuente de verdad), EN, FR, DE, PT-BR |
| Tier 2 — Post-lanzamiento | RU, PL, IT, TR, ZH |

Arquitectura: react-i18next. Archivos en src/i18n/locales/. Todos los strings via t('clave'). Comentarios en inglés. UI en el idioma del jugador.

---

## 49. LOS 80 ARQUETIPOS LEGENDARIOS (DISEÑADO, NO IMPLEMENTADO)

No son skins. Son condiciones de partida especiales con herencia genética inspirada en la figura, país y época relevante, y el arco narrativo de su vida real como posibilidad, no como obligación. El jugador puede desviarse.

AVISO LEGAL: Las figuras vivas requieren nombres ficcionalizados o licencia antes del lanzamiento comercial. Las figuras históricas fallecidas son de dominio público.

10 categorías x 8 figuras:
Ciencia: Einstein, Curie, Tesla, Hawking, Sagan, Armstrong, Gagarin, Darwin
Tecnología: Jobs, Gates, Buffett, Rockefeller, Carnegie, Jack Ma (figuras vivas: ficcionalizar)
Deporte: Jordan, Ali, Pelé, Senna, Bolt, Federer (figuras vivas: ficcionalizar)
Arte: Picasso, Mozart, Bowie, Frida Kahlo, Beethoven, Bob Dylan, Miyazaki, Banksy
Poder: Napoleon, Mandela, Churchill, Gandhi, Lincoln, Castro, Thatcher, Julio César
Crimen: Escobar, Capone, El Chapo, Jesse James, Griselda Blanco, Frank Lucas, D.B. Cooper, Victor Lustig
Exploradores: Colón, Shackleton, Amelia Earhart, Hillary, Messner, Cousteau, Marco Polo, Amundsen
Filosofía: Buda, Sócrates, Confucio, MLK, Marco Aurelio, Simón Bolívar, Osho, Hubbard

---

## 50. SISTEMA DE MOMENTOS IRREPETIBLES (DISEÑADO, NO IMPLEMENTADO)

Algunos momentos solo ocurren una vez. Sin aviso previo. Sin preparación posible.

Ejemplos:
- La primera vez que tu hijo dice papá/mamá
- El día que tu padre te pide perdón
- La última conversación antes de que alguien muriera sin saber que era la última
- El momento en que decides que ya no amas a tu pareja
- El instante en que ves el resultado de 30 años de trabajo

Aparecen en el feed sin previo aviso. El jugador solo elige cómo responder.
Aparecen en el epitafio si son suficientemente importantes.
La memoria selectiva: el personaje recuerda los momentos más cargados emocionalmente, no los más importantes estratégicamente.

---

## 51. LA DECISIÓN ARREPENTIDA (DISEÑADO, NO IMPLEMENTADO)

Una vez por partida: el jugador puede ver qué habría pasado con la decisión que no tomó.
No puede cambiarla. Solo verla.
La respuesta no siempre es obvia. A veces el camino no tomado era peor. A veces era mejor.
La ambigüedad es intencional.

---

## 52. ENVEJECIMIENTO FÍSICO POR DÉCADAS (DISEÑADO, NO IMPLEMENTADO)

20s: Físico en su pico. Recuperación rápida. Sensación de invulnerabilidad (trampa).
30s: Primer declive. El metabolismo ya no perdona. Las lesiones tardan más.
40s: El cuerpo empieza a hablar. Las decisiones de salud de los 30 dan sus frutos.
50s: Los resultados de décadas de decisiones.
60s-70s: La autonomía como recurso que se agota.

El cuerpo como narrador — descripciones narrativas en el feed:
Físico 9 a los 16: "Tu cuerpo responde antes de que pienses."
Físico 4 a los 45 sin actividad: "Hay una pereza física que se ha instalado. No es enfermedad. Es abandono gradual."
Físico 9 a los 45 con abandono desde los 25: "El cuerpo que tuviste a los 20 es un recuerdo que duele un poco cada mañana al levantarte."

---

## 53. EL TIEMPO COMO PERSONAJE (DISEÑADO, NO IMPLEMENTADO)

Marcadores relacionales en lugar de fechas absolutas:
No: "Semana 43 · Año 2003"
Sino: "Han pasado 3 años desde que decidiste no defender a Carlos."

Aceleración temporal narrativa en períodos sin eventos:
"Los siguientes dos años son la versión abreviada de crecer. El colegio. Los amigos. La rutina que parece eterna y que un día termina."

Ralentización en momentos críticos:
El primer sueldo: "280 euros. Lo miras varias veces antes de creer que es tuyo. No es mucho. Pero es tuyo. Completamente tuyo."

---

## 54. CARTAS Y MENSAJES GUARDADOS (DISEÑADO, NO IMPLEMENTADO)

Las palabras que decidiste no decir. Y las que llegaron demasiado tarde.

Tipos: cartas escritas, emails, mensajes, voicemails guardados.
El mensaje de voz de tu padre guardado aunque su teléfono lleva 10 años sin existir.
La carta que escribiste y nunca enviaste. El número que sigues sin borrar.

Mecánica: el jugador elige enviar ahora, guardar, o no enviar.
Las cartas no enviadas pesan como carga emocional.
La carta final antes de morir: si la escribe, aparece en el Modo Dynastía.
El descendiente la encuentra y la lee.

---

## 55. REPUTACIÓN LOCAL (DISEÑADO, NO IMPLEMENTADO)

Diferente de la reputación global (sección 38). Es la memoria específica de cada entorno.
Cada colegio, barrio y empresa tiene su propia memoria de lo que hiciste ahí.

Si defendiste a Carlos en el patio: en el instituto se sabe. A los 25 en una entrevista el entrevistador fue al mismo colegio y te reconoce.
Si ganaste el concurso literario a los 12: a los 20 alguien del barrio te pregunta si eras tú el que escribía.
Si fuiste el agresor: eso también se sabe. Puede aparecer en el momento más inoportuno.

---

## 56. MECÁNICAS DETALLADAS DE PROFESIONES (DISEÑADO, NO IMPLEMENTADO)

### Científico
Sistema de proyectos con financiación y fecha límite. El dilema: publicar antes de estar seguro vs esperar.
Si estás equivocado: retractación pública. Si estás bien: eres el primero.
El colega que te roba la idea. La empresa que pone condiciones. El descubrimiento accidental.

### Médico
Sistema de pacientes activos con historia propia. Burnout médico con señales progresivas.
El protocolo vs el juicio clínico. El error que cometiste y nadie sabe.
Especialidades: cirugía, psiquiatría, urgencias, médico de familia. Cada una con mecánica diferente.

### Político
Capital político como recurso principal (0-100).
La corrupción gradual en fases numeradas:
  Nivel 1: el sobre en el desayuno.
  Nivel 5: la ley que modificas a cambio de financiación.
  Nivel 9: ya no recuerdas cuándo dejaste de ser quien eras.
El escándalo que puedes tapar o dejar salir.

### Futbolista
Sistema de vestuario con 22 jugadores y dinámicas. El veterano que te enseña y luego compite contigo.
Post-carrera obligatorio: depresión post-retirada (estadísticamente real), pérdida de estructura diaria, decisión de qué ser ahora.

### Criminal
Sistema de exposición 0-100 siempre visible. 81-99: te están cerrando el cerco. 100: arrestado.
Blanqueo de dinero: empresa fantasma, inmuebles, casino, arte, crypto.
Especialidades: estafador, traficante, crimen organizado.

### Empresario
4 fases: validar vs lanzar, primer empleado, supervivencia (70% muere aquí), crecimiento, madurez.
La fase 2 puede matar igual que la fase 1. La fase 4: qué haces cuando ya funciona solo.

---

## 57. VIAJES CON MECÁNICAS ÚNICAS (DISEÑADO, NO IMPLEMENTADO)

Tipos: escapada fin de semana (200-800 euros), vacaciones anuales (800-5.000 euros), mochilero 3-6 meses, viaje de trabajo, vuelta al mundo (20-50k euros, 1 año).

Destinos con mecánicas específicas:
Japón: +Disciplina 0.5 permanente.
Silicon Valley (solo con perfil tecnológico): red de contactos que puede cambiar la carrera.
Dubai: oportunidades de negocio específicas.
Zona de conflicto (periodista/cooperante): riesgo real de no volver.

Viaje espacial (disponible desde 2040s en el juego):
Coste 500k-5M euros según era tecnológica. El overview effect: cambio filosófico permanente.
+Perspectiva, +Emocional, +Estabilidad. Aparece en el epitafio de forma única.

---

## 58. LONGEVIDAD EXTENDIDA (DISEÑADO, NO IMPLEMENTADO)

Era actual: esperanza de vida 80 años.
Era intervención (2030-2050): terapias que extienden 10-15 años. Solo para ricos (500k euros+). La brecha de longevidad como mecánica social.
Era extensión (2050+): esperanza 110-120 años para clase media alta. Nuevos problemas: jubilación, relaciones de 80 años, múltiples carreras.
Era especulativa (2080+): mortalidad casi vencida para los más ricos. El personaje que elige morir cuando siente que su historia terminó: el acto más libre del juego.

---

## 59. LEGADO CULTURAL VIVO (DISEÑADO, NO IMPLEMENTADO)

Lo que creas existe en el mundo del juego y el mundo lo recuerda o lo olvida.

Músico: tus álbumes en la narrativa del mundo. En Modo Dynastía tu nieto escucha tu música.
Escritor: tus libros en las bibliotecas. Otros personajes pueden leerlos y cambiar su trayectoria.
Arquitecto: los edificios siguen en pie. El descendiente pasa por delante. "El nombre en la placa es el tuyo."
Político: las leyes que promulgaste siguen vigentes o han sido derogadas.

El legado olvidado (80% de las personas):
"Vivió. Amó. Fue olvidado. Como casi todos. Eso no hace su vida menos real."
El epitafio lo reconoce sin juicio.

---

## 60. GASTRONOMÍA DETALLADA (DISEÑADO, NO IMPLEMENTADO)

La receta de tu madre/abuela: cuando la cocinas genera memoria involuntaria. Si el familiar muere solo tú sabes hacerla. Si la pierdes se pierde para siempre. En Modo Dynastía aparece generaciones después.

Hábitos alimentarios como mecánica:
Cocinar en casa: 250-400 euros/mes, -tiempo, +salud.
Comer fuera: 600-1.500 euros/mes, +social.
Delivery sistemático: síntoma de desconexión.
Diferencia acumulada en 20 años: 120.000 euros.

---

## 61. SISTEMA DE PENSIONES Y FIRE (DISEÑADO, NO IMPLEMENTADO)

FIRE (Financial Independence, Retire Early): la regla del 4%.
Con 2.000 euros/mes de gastos: necesitas 600.000 euros invertidos.
Con 5.000 euros/mes: necesitas 1.500.000 euros.

El jugador que lo consigue a los 40: qué hace con el resto de su vida.
La libertad que esperabas puede sentirse vacía. O puede ser la vida que siempre quisiste.
El sistema público puede no existir cuando llegues (evento histórico posible).

---

## 62. LIBROS Y CULTURA DETALLADO (DISEÑADO, NO IMPLEMENTADO)

"El libro correcto en el momento correcto": puede ser el evento que salva o transforma al personaje.
Un libro de estoicismo durante una crisis. Una autobiografía de empresario a los 20 como detonante vocacional.

El libro de tu abuelo con sus notas marginales: en Modo Dynastía el descendiente lo encuentra.
"Alguien había subrayado esta frase: 'La libertad no se regala. Se construye.'"
Ese momento puede cambiar al descendiente más que cualquier herencia económica.

La conexión entre libros leídos y decisiones tomadas es visible en retrospectiva, no en el momento.

---

## 63. SUEÑOS DETALLADOS (DISEÑADO, NO IMPLEMENTADO)

Tipos: procesamiento (después de evento importante), recurrentes (relacionados con el miedo central), pesadillas (carga vital alta + traumas), lúcidos (raros, respuestas simbólicas ambiguas).

Formato en feed: cursiva más tenue, fondo diferente.
Los sueños recurrentes están relacionados con el miedo central del personaje.
Si el miedo se trabaja con terapia: el sueño cambia.
Si no: se vuelve pesadilla progresivamente.

La pesadilla recurrente que desaparece el día que resuelves lo que la provocó: uno de los momentos de catarsis más poderosos del juego.
