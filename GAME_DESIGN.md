# FATEBORN — GAME DESIGN DOCUMENT

Documento de diseño completo: sistemas, narrativa, mecánicas y contenido.
Para contexto técnico operativo ver CLAUDE.md.

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
| Text secondary | #8a7050 | Texto narrativo secundario |
| Text narrative | #b09060 | Texto narrativo principal en feed |

### Tipografía
- Cinzel (Google Fonts) — títulos, labels, botones, UI narrativa
- Georgia italic — lore, narrativa larga, eventos
- sans-serif — texto de sistema únicamente

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

### Design system centralizado
Todos los tokens de color, fuente, espaciado y transición en src/styles/tokens.ts.
Ningún componente hardcodea colores — todos importan desde tokens.ts.
Transiciones estándar: 0.25s cubic-bezier(0.4,0,0.2,1) para interacciones, 0.6s ease para entradas de pantalla.

### Fondo atmosférico
Componente reutilizable en src/styles/AtmosphericBackground.tsx.
Tres capas position:fixed, inset:0, zIndex:0, pointerEvents:none:
- Capa 1: radial-gradient(ellipse 80% 60% at 50% 0%, #221608 0%, #0d0b08 55%, #080604 100%)
- Capa 2: noise SVG opacity:0.03
- Capa 3: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #000000cc 100%)
Tint cambia por etapa vital (ver sección 47).

---

## 9. PANTALLAS

### StartScreen
- Logo fateborn_title.png + tagline animado letra a letra (Cinzel, dorado)
- Secuencia: LINE_1 → pausa 1.5s → LINE_2 → botón NUEVA VIDA visible
- useTypingAnimation con onComplete callback (evita race condition stale isDone)
- Fallback: botón visible a los 9s si animación falla o tab inactiva
- Selector de dificultad con 4 cards — fateborn preseleccionado
- Selector de idioma top-right (10 idiomas)
- Música opening.mp3 con fade in 2s
- overflow-y: auto en root

### AncestorSelection
- 8 arquetipos en grid 4 columnas desktop, 2 columnas mobile
- 4 slots sticky superiores — dorado para abuelos (slots 0,2), granate para abuelas (slots 1,3)
- El mismo arquetipo puede asignarse a más de un slot (4 abuelos iguales permitido)
- Confirmar activo solo con 4 slots llenos + país elegido
- confirmAncestors() calcula inheritedStats + hiddenGenes

### BirthScreen
- Layout dos columnas desktop: izquierda radar chart + genes latentes, derecha narrativa + formulario
- StatsRadarChart SVG hexagonal 9 stats, size 320px desktop
- HiddenGenesDisplay con valores en escala 0-10, toFixed(1) — nunca mostrar "99" cuando debe ser "9.9"
- AncestralNarrative con género correcto: slots 0,2 usan archetype.name, slots 1,3 usan archetype.nameFeminine
- Form: nombre (mínimo 2 chars, capitalizado al mostrarse) + selector hombre/mujer + botón COMENZAR VIDA
- Mobile: una columna

### GameScreen
- Desktop: StatusBar (56px fijo) | LifestylePanel (300px) | NarrativeFeed (flex-1) | LifeTimeline (48px fijo)
- Mobile: StatusBar | TabBar (INICIATIVA | HISTORIA) | contenido tab | LifeTimeline
- Panel izquierdo: LifestylePanel + cards NPCs vivos (sección 30) + gráfica stats (sección 31)
- Narrativa pasiva por trimestre cuando no hay evento activo (ver sección 64)
- overflow-hidden en root, paneles internos con scroll independiente

### DeathScreen
- Epitafio como lápida SVG con textura de piedra
- StatsRadarChart perfil final
- Grid legado: años vividos, memorias, amigos, hitos
- "Nueva vida" → setScreen('start')

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
| school_conflict | 10 | 3 variantes por flags: testigo/víctima/agresor |
| family_dynamic | 11 | Variante por economía y flags: tensión/divorcio/estable |
| talent_discovered | 12 | statDeltas funcional: detecta top stat y genera opción específica |

### Adolescencia (ages 13-18)

| ID | Edad | Flags/Weight | Descripción |
|----|------|-------------|-------------|
| first_love | 13 | — | Coherente con sexualOrientation; usa NPC existente si hay |
| academic_decision | 14 | — | ciencias / humanidades / tecnología; variante por país |
| pressure_moment | 15 | — | esfuerzo / equilibrio / sacrificar hobby |
| identity_reflection | 15 | weight 0.6 | Solo narrativa; muestra stat dominante y débil |
| first_job_direction | 16 | — | Solo si direccion_practica o Ambición > 7 |
| final_exam_pressure | 17 | triggerFlags: ciencias o humanidades, weight 0.8 | Noche antes del examen |
| adulthood_threshold | 18 | — | Mentalidad: ambicioso / cauto / libre; consecuencias hasta los 30 |

### NPC Parallel Arc (amigo de infancia)
8 pasos vitales: ages 8, 14, 16, 22, 30, 45, 60, 77. Cada uno con narrativeToPlayer y {{name}} interpolado. Muerte estocástica a los ~77 según fisico stat del NPC.

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
- Emerge naturalmente en first_love (edad 13) — la narrativa es coherente
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

Edad máxima absoluta: 95 años (ampliable con sistema de longevidad extendida, sección 58).

---

## 16. DIFICULTAD

| Modo | Descripción | Multiplicador |
|------|-------------|---------------|
| Historia | Consecuencias suaves. Sugerencias activas de salud mental. La narrativa primero. | 0.5x |
| Fateborn | Experiencia diseñada. Consecuencias reales. Modo por defecto. | 1x |
| Ironman | Sin red de seguridad. Muerte prematura posible. | 1.5x |
| Legado | Modo más difícil. Transferencia Dynastía obligatoria a los 25. | 2x |

---

## 17. SISTEMA DE PAREJA COMPLETO (DISEÑADO, NO IMPLEMENTADO)

No es un botón. Es un proceso emergente.

Cómo emerge el amor según dónde inviertes tiempo:
- Tiempo en SOCIAL: personas en entornos sociales, fiestas, grupos
- Tiempo en DEPORTE: alguien en equipo o gimnasio
- Tiempo en TRABAJO: compañero o compañera
- Tiempo en OCIO: alguien en concierto o hobby compartido
- Tiempo en ESTUDIOS: alguien en biblioteca o clase
La orientación sexual determina quién puede aparecer. Nunca es un botón "buscar pareja".

5 fases de evolución de pareja:
1. Enamoramiento (0-2 años): todo perfecto, sin fricción. La narrativa es optimista.
2. Realidad (2-5 años): los defectos aparecen, primera crisis. El jugador elige cómo responder.
3. Construcción (5-15 años): construís algo juntos. Hijos, hipoteca, proyecto común.
4. Crisis de los 20 años: quién eres ahora, quién soy yo. La más difícil del arco.
5. Vejez juntos: la pareja como familia, no como romance. El amor cambia de forma.

Perfil económico heredado de ancestros de la pareja:
- Hijo/a de Académico: ahorrador, planificador, inversión a largo plazo
- Hijo/a de Artista: gastador en experiencias, dinero como herramienta no como fin
- Hijo/a de Emprendedor: inversor, aliado estratégico, entiende el riesgo
- Hijo/a de Cuidador: equilibrado, seguridad familiar primero
- Hijo/a de Superviviente: pragmático, busca estabilidad sobre todo

Mecánicas adicionales:
Infidelidad posible con consecuencias en 4 capas temporales.
Divorcio con proceso legal y económico real. Custodia como la decisión más dura del arco.
Ventana de oportunidad que puede cerrarse si no actúas. La pareja puede conocer a alguien más.

---

## 18. EMANCIPACIÓN (DISEÑADO, NO IMPLEMENTADO)

Proceso obligatorio entre 18-30 años. 4 vías:
1. Padres pagan (capital heredado disponible)
2. Alquiler — fianza + amueblado + averías aleatorias
3. Compra — necesitas 20% entrada + gastos notariales
4. Forzada — piso compartido de emergencia

Hipoteca fija vs variable (Euribor). El juego muestra que alquiler = dinero perdido. Compra siempre más eficiente a largo plazo si el jugador puede permitírsela.

---

## 19. SISTEMA ECONÓMICO (DISEÑADO, NO IMPLEMENTADO)

economy: {
  liquidez, ingresos, gastos, patrimonio
  cartera: [ETFs, acciones, bonos, oro, crypto, REITs]
  inmuebles: []
  hipoteca: { tipo: fija|variable|mixta, euribor, cuota }
  negocio: BusinessState | null
}

Inversiones disponibles: MSCI World, S&P500, EuroStoxx50, Nikkei, acciones individuales, oro, crypto, REITs.
Casino y apuestas con riesgo de adicción activado por Riesgo alto.
Interés compuesto visible y proyectado a 10/20/30 años.
Newsletter trimestral con ciclos económicos aleatorios (no años reales para evitar meta-gaming).
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

Se activan por condiciones específicas de flags + stats + carrera:

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
- Cartas y mensajes guardados (ver sección 54)
- Momentos irrepetibles (ver sección 50)
- La decisión arrepentida (ver sección 51)
- Reputación local (ver sección 55)
- Longevidad extendida (ver sección 58)

---

## 28. ESTADO ACTUAL

### Implementado y validado
- Motor completo con simulación 25 años: npx tsx src/test/engineTest.ts (0 errores)
- 12 eventos narrativos (infancia + adolescencia) con NPCs y consecuencias diferidas
- 5 pantallas con navegación funcional
- Sistema de estilos de vida (7 tipos) con efectos pasivos por trimestre
- Herencia genética + genes ocultos en escala correcta 0-10 (toFixed(1))
- Epitafio dinámico con seeds acumuladas
- Memorias con contextos cruzados
- useTypingAnimation con onComplete callback (race condition resuelta)
- prepareQuarter / commitEventChoice para flujo UI correcto
- Design system centralizado en src/styles/tokens.ts
- AtmosphericBackground.tsx componente reutilizable
- i18n con react-i18next, 10 idiomas, archivos .json por idioma
- Narrativa pasiva por trimestre con anti-repetición (src/data/passiveNarrative.ts)
- MuteButton en todas las pantallas (bottom-right, posición fija)
- Género femenino correcto en AncestralNarrative (nameFeminine para slots 1,3)
- AncestorSelection con slots sticky, 8 arquetipos, arquetipos repetibles
- BirthScreen layout dos columnas desktop
- Nombre del personaje capitalizado en narrativa

### Problemas visuales pendientes de resolver
- GameScreen: panel izquierdo (INICIATIVA) con textos demasiado oscuros
- GameScreen: opciones de evento con poco contraste
- GameScreen: botón AVANZAR TRIMESTRE deshabilitado casi invisible
- StatusBar: barras de stats (FÍS, EMO, EST) demasiado finas para ser útiles
- Fondo atmosférico no cambia con etapa vital todavía

### Próximos pasos por prioridad
1. Flash visual de stats al resolver eventos (+0.3 verde / -0.5 rojo, fadeOut 1.5s)
2. Fondo atmosférico cambia con etapa vital (tints sección 47)
3. Cards de NPCs vivos en panel izquierdo GameScreen (sección 30)
4. Barra de progreso de etapa: INFANCIA 8/12 años con hitos
5. Transición cinematográfica entre etapas (sección 47)
6. Eventos de Juventud (ages 19-30) con lógica laboral y relaciones
7. Sistema de carrera y economía conectado al motor
8. Sistema de pareja emergente (sección 17)
9. Newsletter trimestral con diseño de periódico (sección 47)
10. Modo Dynastía (sección 22)

---

## 29. CONTENIDO NARRATIVO DETALLADO

Toda la narrativa es específica a este personaje, no genérica.
El nombre del personaje aparece siempre en momentos de tensión y siempre capitalizado.
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

Variante B (economy baja o flag tension_economica): tensión económica en casa.
  Opción A ignoras y sigues con tu vida: sin cambio de stats, flag desconexion_familiar.
  Opción B intentas ayudar: +0.3 Emocional -0.2 Creatividad, flag responsabilidad_prematura. Consecuencia diferida edad 18: dificultad con emancipación.
  Opción C preguntas directamente qué pasa: +0.3 Emocional +0.2 Carisma, flag comunicacion_directa.

Variante C (flag divorcio o separacion): padres se separan.
  Opción A te culpas: -0.3 Estabilidad, flag culpa_divorcio. Consecuencia diferida edad 25: dificultad en relaciones propias.
  Opción B aceptas y te adaptas: +0.2 Estabilidad, flag adaptabilidad.
  Opción C tomas partido: +0.2 Carisma -0.3 Emocional, flag lealtad_dividida. Consecuencia diferida edad 30: relación complicada con un progenitor.

### Evento talent_discovered (edad 12)
Detecta automáticamente el stat más alto y genera opción específica para ese stat.
  Si Físico dominante: un entrenador te nota en educación física.
  Si Lógica dominante: un profesor te propone una olimpiada de matemáticas.
  Si Creatividad dominante: un trabajo tuyo es seleccionado para una exposición.
  Si Carisma dominante: te eligen para representar al colegio en un acto público.
  Si Emocional dominante: un adulto te dice que tienes una madurez inusual.
  Opción A aceptas y te comprometes: +0.3 al stat dominante +0.2 Disciplina, flag talento_reconocido.
  Opción B aceptas pero sin convicción: +0.1 al stat dominante, sin flag.
  Opción C rechazas por vergüenza o miedo: +0.2 Estabilidad, flag talento_suprimido. Consecuencia diferida edad 35: redescubres ese talento y te preguntas qué hubiera pasado.

### Evento first_love (edad 13)
Coherente con sexualOrientation. Si hay NPC generado previamente puede ser esa persona.
  Heterosexual: aparece persona del sexo opuesto en el entorno más frecuentado.
  Homosexual: aparece persona del mismo sexo. Si orientationRevealed es false, el evento la revela.
  Bisexual: puede ser cualquier género, emerge del contexto.
  Opción A te acercas directamente: +0.3 Carisma, flag primer_amor_activo.
  Opción B lo observas desde lejos durante semanas: +0.2 Emocional, flag primer_amor_contemplativo. Consecuencia diferida edad 14: la persona conoce a alguien más.
  Opción C lo ignoras activamente: +0.2 Estabilidad, flag primer_amor_suprimido. Consecuencia diferida edad 16: reaparece en tu círculo social.

### Evento academic_decision (edad 14)
Variante por país Tier S/A: tres opciones de bachillerato o equivalente con consecuencias reales.
Variante por país Tier B: ciencias, humanidades, o formación profesional.
Variante por país Tier D/E: continuar estudiando o empezar a trabajar.
  Opción A ciencias/técnico: +0.3 Lógica +0.2 Disciplina, flag direccion_ciencias. Desbloquea universidad técnica y carreras STEM.
  Opción B humanidades/social: +0.3 Creatividad +0.2 Emocional, flag direccion_humanidades. Desbloquea escritura, periodismo, psicología.
  Opción C vocacional/trabajar: +0.3 Ambición +0.2 Físico, flag direccion_practica. Desbloquea primer_trabajo_temprano a los 16.

### Evento pressure_moment (edad 15)
Contexto: exámenes importantes o competición relevante según hobby y dirección académica.
  Opción A todo al estudio/entrenamiento: +0.4 Disciplina -0.2 Emocional, flag sacrificio_adolescente. Consecuencia diferida edad 17: resultado superior a la media.
  Opción B equilibrio consciente: +0.2 Disciplina +0.2 Emocional, flag equilibrio_adolescente. Resultado bueno pero no excepcional.
  Opción C priorizas vida social: +0.3 Carisma -0.2 Disciplina, flag social_adolescente. Consecuencia diferida edad 17: resultado por debajo del esperado.

### Evento identity_reflection (edad 15, weight 0.6)
Solo narrativa, sin opciones de decisión. Muestra stat dominante y el más bajo del personaje.
Texto dinámico según stats: "A los 15 años, [nombre] empieza a entender quién es."
No modifica stats. Contribuye al epitafio con una seed de identidad adolescente.

### Evento first_job_direction (edad 16)
Solo disponible si flag direccion_practica o si Ambición > 7.
  Opción A trabajo a tiempo parcial compatible con estudios: +0.2 Ambición +0.2 Disciplina, flag trabajo_temprano. Ingresos mensuales: 300-500 euros.
  Opción B prácticas no remuneradas en sector de interés: +0.3 en stat relacionado con dirección académica, flag practicas_tempranas.
  Opción C seguir solo con estudios por ahora: +0.2 Lógica. Consecuencia diferida edad 22: mejor preparación académica pero sin experiencia laboral.

### Evento final_exam_pressure (edad 17, solo si flag ciencias o humanidades)
  Opción A estudias toda la noche: +0.2 Lógica -0.3 Físico, flag noche_estudio. Probabilidad resultado alto: 70%.
  Opción B te acuestas a hora normal confiando en la preparación: sin cambio. Probabilidad resultado medio-alto: 60%.
  Opción C sales con amigos y estudias poco: +0.2 Carisma -0.2 Disciplina, flag noche_social. Probabilidad resultado bajo: 65%. Consecuencia diferida edad 18: decisión universitaria condicionada.

### Evento adulthood_threshold (edad 18)
  Opción A ambicioso: quiero llegar lejos, cueste lo que cueste: +0.4 Ambición +0.2 Riesgo, flag mentalidad_ambiciosa. Consecuencia diferida edad 25: primera oportunidad grande con riesgo alto.
  Opción B cauto: quiero construir algo sólido paso a paso: +0.3 Estabilidad +0.2 Disciplina, flag mentalidad_cautelosa. Consecuencia diferida edad 30: base económica más sólida que la media.
  Opción C libre: quiero explorar antes de comprometerme: +0.3 Creatividad +0.2 Riesgo, flag mentalidad_libre. Consecuencia diferida edad 22: viaje o experiencia transformadora disponible.

---

## 30. PANEL PERSONAS EN TU VIDA (DISEÑADO, NO IMPLEMENTADO)

Ubicación: panel izquierdo de GameScreen, debajo del LifestylePanel.
Cards pequeñas por cada NPC conocido: nombre, relación, edad actual, estado (vivo / distanciado / cercano).
Cuando un NPC muere: card en gris con icono de vela. El jugador puede releer su historia.
Estado de relación actualizado por flags narrativos y consecuencias diferidas.

---

## 31. GRÁFICA DE EVOLUCIÓN DE STATS (DISEÑADO, NO IMPLEMENTADO)

SVG pequeño en panel izquierdo de GameScreen, debajo de las cards de NPCs.
Muestra evolución de los 3 stats principales en los últimos 8 trimestres.
Los 3 stats mostrados son los de mayor valor actual en el GameState.
Líneas coloreadas por grupo: cognitivo (azul), social (dorado), vital (granate).

---

## 32. VEHÍCULOS COMPLETO (DISEÑADO, NO IMPLEMENTADO)

### Marcas ficticias confirmadas
Económico: Auros (equivalente Dacia/Seat), Civeo (Toyota/Honda), Nordian (VW/Skoda)
Premium: Meridian (BMW), Stellan (Mercedes), Vanto (Audi)
Deportivo: Ferrano (Ferrari), Veloce (Lamborghini), Weybridge (Bentley/Rolls-Royce), Strato (Porsche)
Americano: Bison (Ford/Chevrolet), Luminar (Rivian)
Eléctrico: Voltex (Tesla)
Off-road: Terrain (Land Rover)

### Categorías completas con rangos de precio
Coches:
  Utilitario: 8.000-20.000 euros
  Compacto familiar: 15.000-35.000 euros
  SUV: 30.000-60.000 euros
  Berlina de lujo: 60.000-200.000 euros
  Superdeportivo: 150.000-500.000 euros
  Hypercar: 500.000-5.000.000 euros
  Clásico/coleccionable: precio variable, revalorizable

Motos:
  Scooter: 1.500-5.000 euros
  Estándar: 5.000-15.000 euros
  Deportiva: 10.000-30.000 euros
  Custom: 15.000-80.000 euros

Náutica:
  Lancha: 15.000-80.000 euros
  Velero: 20.000-200.000 euros
  Yate: 200.000-5.000.000 euros
  Superyate: 5.000.000-200.000.000 euros
  Submarino privado: 500.000-20.000.000 euros

Aviación:
  Ultraligero: 30.000-80.000 euros
  Helicóptero privado: 200.000-2.000.000 euros
  Jet privado ligero: 1.500.000-5.000.000 euros
  Jet privado grande: 5.000.000-50.000.000 euros
  747 ejecutivo: 50.000.000+ euros

### Sistema de costes mensuales reales
Calculado automáticamente: seguro + ITV + gasolina/combustible + parking + mantenimiento.
Un Auros utilitario: ~280 euros/mes total.
Un Meridian berlina: ~750 euros/mes total.
Un Ferrano deportivo: ~3.500 euros/mes total.

Modalidades de adquisición: compra, leasing, renting. Cada una con impacto diferente en liquidez y patrimonio.
Carné de conducir obligatorio antes de primer vehículo (800-1.500 euros, 2-3 meses de proceso).

---

## 33. VIVIENDA Y MERCADO INMOBILIARIO (DISEÑADO, NO IMPLEMENTADO)

### 8 tipos de vivienda con precios de compra
Estudio (25-45m2): 80.000-280.000 euros
Piso pequeño (45-70m2): 120.000-450.000 euros
Piso familiar (80-120m2): 200.000-700.000 euros
Casa con jardín: 250.000-1.200.000 euros
Ático/Penthouse: 500.000-3.000.000 euros
Villa/Finca: 800.000-10.000.000 euros
Mansión: 5.000.000-50.000.000 euros
Isla privada: 20.000.000-200.000.000 euros (hito imposible)

### Precios de alquiler mensual por ciudad
Londres/París/Zürich: 2.200 euros/mes
Madrid/Barcelona centro: 1.400 euros/mes
Bilbao/Valencia: 900 euros/mes
Sabadell/Terrassa: 650 euros/mes
Ciudad media española: 550 euros/mes
Pueblo/rural: 350 euros/mes

### Trade-off vivienda vs tiempo vital
Vivir en Sabadell trabajando en Barcelona: -2h/día = -1 día efectivo/semana.
Esto reduce la productividad y afecta stats de forma pasiva cada trimestre.
El jugador puede optimizar entre coste de vivienda y tiempo disponible.

### Mercado inmobiliario dinámico
Ciclo alcista (6-12 años en el juego): +5-15%/año en valor.
Ciclo bajista (2-5 años): -10-40% en valor.
Burbuja: rara pero posible, -50% cuando explota.
La newsletter avisa de señales del mercado, no de certezas — el jugador debe interpretar.

### Inversión inmobiliaria disponible
Piso de alquiler con gestión propia o por agencia.
Local comercial, oficinas, nave industrial, edificio completo, hotel/apartamentos turísticos.

### Problemas reales del alquiler como propietario
Inquilino que no paga (proceso de desahucio: 6-18 meses).
Inquilino que destroza el inmueble.
Derrama de comunidad inesperada.
Nueva ley de alquileres que cambia las reglas.

---

## 34. SISTEMA DE SALUD COMPLETO (DISEÑADO, NO IMPLEMENTADO)

### Enfermedades agudas
Gripe: -2 semanas de productividad, coste básico.
Accidente: lesión con recuperación variable según gravedad (1 semana a 6 meses).
Operación inesperada: coste económico + tiempo de recuperación + riesgo de complicaciones.

### Enfermedades crónicas
Diabetes tipo 2: prevenible con estilo de vida atlético o balanced. Si no se previene: gasto mensual permanente y reducción de stats.
Hipertensión: el asesino silencioso. Sin síntomas hasta el evento de crisis.
Dolor crónico post-accidente: reduce opciones en el panel de iniciativa.

### Enfermedades terminales
Cáncer estadios 1-4 con probabilidades reales de supervivencia. Diagnóstico temprano (con chequeos) vs tardío (sin chequeos).
ELA: progresión inevitable. El arco narrativo más duro del juego.
Alzheimer: perder quién eres gradualmente. El personaje ve cómo cambia su propio feed.

### Predisposición genética desde genes ocultos
Algunas predisposiciones se revelan a los 20, otras no hasta los 50.
Sin chequeos anuales: diagnósticos tardíos con peores opciones de tratamiento.
Con chequeos anuales: detección temprana, más tiempo, más opciones.

### Burnout
No es estrés. Es vacío. La distinción es importante y el juego la narra así.
Señales progresivas en el feed antes del evento de crisis explícito.
Recuperación: meses, no semanas. No se puede "curar" con unas vacaciones.
Mecánica específica para la profesión de médico (ver sección 56).

---

## 35. SISTEMA DE ADICCIONES (DISEÑADO, NO IMPLEMENTADO)

### Tipos
Alcohol: la más común y socialmente aceptada. Progresión muy lenta.
Trabajo (workholism): sin estigma social. El jugador puede no verla como problema durante años.
Juego/casino: activada por Riesgo alto + acceso a casino. Progresión rápida.
Drogas: diferentes sustancias con perfiles de progresión distintos.
Pantallas/redes sociales: disponible desde los 2000s en el juego.

### Mecánica de progresión — SIEMPRE oculta
El jugador no sabe que está dentro hasta que ya lo está.
Señales sutiles en el feed primero: "Últimamente necesitas esa copa para relajarte."
Sin alarmas explícitas. El juego no avisa.
Solo en fase avanzada: evento de crisis explícito con consecuencias graves.

### Mecánica de recuperación
No hay cura. Hay gestión.
Recaídas estadísticamente reales — el juego las implementa con probabilidades reales.
El sponsor como relación especial con su propio arco narrativo.
La recaída después de 5 años limpio: el evento más duro del arco de adicción.

---

## 36. PSICOLOGÍA PROFUNDA (DISEÑADO, NO IMPLEMENTADO)

### Miedos que emergen de experiencias
Miedo al abandono: si relación termina sin cierre emocional real.
Miedo al fracaso: padres con expectativas altas no procesadas (flag expectativas_paternas).
Miedo a la soledad: tiempo sin conexión real acumulado durante trimestres.
Miedo a la muerte: después de diagnóstico grave propio o de alguien cercano.
Los miedos limitan opciones visiblemente en el panel de iniciativa — el jugador ve qué opciones no están disponibles y por qué.

### Sistema de propósito y sentido
Cuatro tipos de propósito: familia, legado profesional, impacto social, experiencia pura.
Crisis de propósito a los 35-50 años: "¿Para qué estoy haciendo todo esto?"
No tiene respuesta fácil. Puede destruir al personaje o transformarlo completamente.
La segunda vida que empieza después de la crisis: uno de los arcos más interesantes del juego.

### Corrupción moral gradual (0-100)
Almacenada en GameState.moralCorruption.
Cada decisión oscura sube el contador en función de su peso moral.
Sin alarma. Es gradual. El personaje no lo percibe como deterioro.
Solo visible en el epitafio final — el jugador descubre al morir quién se volvió su personaje.

---

## 37. MUNDO E HISTORIA (DISEÑADO, NO IMPLEMENTADO)

### Eventos históricos generados aleatoriamente
Crisis económica global (cada 15-25 años en el juego): afecta inversiones, empleo, inmuebles.
Pandemia (rara pero devastadora): impacto en todas las profesiones, lockdown como mecánica.
Revolución tecnológica (cada 20-30 años): nuevas profesiones, algunas desaparecen.
Guerra (según tier del país): desde conflicto regional hasta guerra total.
Movimiento social global: impacta en política, reputación, relaciones.
Cambio climático: efectos visibles en partidas largas (desde los 2030s en el juego).

### Cambio tecnológico como mecánica narrativa
Internet aparece (~1995 en el juego): nuevas oportunidades de negocio y carrera.
Smartphones (2007+): reputación digital disponible, redes sociales.
IA (2020s+): ciertas profesiones se transforman o desaparecen.
Viajes espaciales comerciales (2040s+): disponibles para el 1% más rico.
Profesiones que desaparecen y aparecen con cada revolución: el jugador debe adaptarse.

### El periódico del mundo
Titulares generados dinámicamente cada trimestre según eventos activos.
Publicidad falsa de época que ambienta el momento histórico.
Sección de necrológicas donde aparecerá el personaje algún día.

---

## 38. SISTEMA DE FAMA (DISEÑADO, NO IMPLEMENTADO)

### Niveles 0-100 con mecánicas específicas
0-10: Anónimo. Privacidad total. Sin consecuencias de fama.
11-25: Reconocimiento local. Algunas puertas se abren en el entorno inmediato.
26-50: Figura pública menor. Apareces en medios locales. Primeros haters.
51-75: Celebridad nacional. Perdes anonimato. Equipo de PR necesario.
76-90: Fama internacional. Imposible ir a ciertos lugares sin ser reconocido.
91-100: Leyenda viva. El tipo de fama que no se elige, se sufre.

### Gestión de fama
Equipo de PR: 5.000-50.000 euros/mes según nivel de fama.
El escándalo que puedes sobrevivir vs el que no — depende del nivel de fama y el tipo de escándalo.
Cancelación como mecánica real con timeline específico.
Rehabilitación: proceso largo, no automático, con recaídas posibles.

### La fama como trampa
¿Quién te quiere a ti o a tu fama? — El juego distingue ambas cosas.
La soledad de los muy famosos: nivel 80+ genera penalización en Emocional.
La imposibilidad de la normalidad a partir de nivel 70: ciertas opciones desaparecen del panel.

---

## 39. SECRETOS Y CHANTAJE (DISEÑADO, NO IMPLEMENTADO)

### Tipos de secretos con peso emocional
La aventura que nadie sabe (peso 5-7).
El origen del dinero inicial (peso 6-8).
El error que cometiste y ocultaste (peso 7-9).
La identidad que escondiste (peso 8-10).

Peso emocional 1-10. Peso 8+: afecta Estabilidad crónicamente como carga pasiva.
Los secretos con peso bajo pueden mantenerse indefinidamente.
Los de peso alto eventualmente generan un evento de crisis.

### Mecánica del chantaje
El chantajista tiene perfil, motivaciones e intenciones propias.
Opciones del jugador: pagar (problema persiste), amenazar (escala), confesar (consecuencias inmediatas pero liberación), eliminar evidencias (riesgo alto), aceptar consecuencias (dignidad pero coste).

### Secretos en Modo Dynastía
El escándalo póstumo que descubre tu hijo en generación 2.
Los secretos no mueren con el personaje — viven en los objetos y documentos que deja.

---

## 40. OBJETOS, LUGARES Y MEMORIAS (DISEÑADO, NO IMPLEMENTADO)

### Objetos con historia emocional (MemoryObject[])
El reloj del abuelo heredado. La guitarra del primer concierto. El coche del primer trabajo.
Cada objeto tiene su historia y el momento en que llegó a la vida del personaje.
Se transmiten en Modo Dynastía con su historia completa.
Los más importantes del personaje aparecen en el epitafio final.

### Lugares con peso emocional (MemoryPlace[])
La casa de la infancia. El bar del primer amor. El lugar del peor momento de tu vida.
Volver genera memoria involuntaria automática en el feed.
Lugares que desaparecen (el bar cerrado, la casa demolida) generan duelo real.

### Memorias involuntarias en el feed
Formato: cursiva más tenue que la narrativa normal, fondo ligeramente diferente.
Estímulos que las activan: olor a comida específica, canción en la radio, letra reconocida de alguien del pasado.
No se pueden controlar ni planificar. Aparecen cuando el motor detecta el estímulo correcto.

---

## 41. SISTEMA EDUCATIVO DE HIJOS (DISEÑADO, NO IMPLEMENTADO)

Guardería: quién para la carrera para cuidar al hijo tiene impacto real en stats del hijo.
Colegio: público, concertado, privado o internacional — cada uno con impacto diferente en stats.
El barrio donde vives determina el colegio público que toca. Vivir en barrio mejor = mejor colegio.
Eventos posibles: bullying (el jugador decide cómo intervenir), superdotado descubierto, quiere estudiar algo "inútil" según los padres.
Universidad en el país o en el extranjero (coste vs red de contactos internacional).
La educación determina stats iniciales del descendiente en Modo Dynastía.
Es la inversión más rentable del juego a largo plazo en términos de legado.

---

## 42. HERENCIAS Y TESTAMENTOS (DISEÑADO, NO IMPLEMENTADO)

### Recibir herencia
Herencia positiva: dinero líquido, inmuebles, acciones, objetos con valor emocional.
Herencia negativa: deudas que heredas automáticamente si no las rechazas.
Impuestos de sucesiones reales por país (en España hasta el 34%).
Conflictos entre hermanos por la herencia: uno de los eventos familiares más destructivos.
La segunda familia que no sabías que existía: uno de los eventos más impactantes del juego.

### Hacer testamento
Sin testamento: el estado decide según la ley. La legítima no puede eliminarse.
Fondos fiduciarios con condiciones temporales (solo si cumples 30 años, solo si te gradúas).
Desheredar a alguien: emocionalmente satisfactorio, legalmente complejo, narrativamente poderoso.

### Herencia emocional en Modo Dynastía
Los traumas que transmites sin querer (flags reducidos al 50% pero presentes).
Los valores que intentas transmitir (pueden no llegar como quieres).
Las creencias limitantes heredadas sin saberlo.

---

## 43. INGENIERÍA PSICOLÓGICA (PRINCIPIOS DE DISEÑO, NO IMPLEMENTACIÓN TÉCNICA)

Estos 12 principios deben guiar cada decisión de diseño de UI y narrativa. No son sistemas de código sino criterios de evaluación: antes de añadir cualquier elemento nuevo, verificar que cumple al menos uno de estos principios.

1. Efecto IKEA: nunca mostrar la decisión correcta. El jugador construye su historia y se apega a ella por haberla construido.
2. Variable Ratio Reinforcement: resultados variables. No siempre la misma recompensa por la misma acción. Como las máquinas tragaperras pero con narrativa.
3. Loss Aversion: ventanas de oportunidad visibles con tiempo que se cierra. El jugador actúa por miedo a perder más que por deseo de ganar.
4. Progress Visibility: barra de profesión, legado y etapa siempre visibles. El jugador siempre sabe cuánto ha construido y cuánto le queda.
5. Social Proof: "solo el 0.3% de jugadores llegó al Nobel." Los logros raros tienen más valor percibido.
6. Endowment Effect: nombre del personaje desde el minuto 1, historia desde el primer evento. El jugador no abandona algo suyo.
7. Curiosity Gap: genes ocultos que emergen tarde. La orientación que no se revela hasta los 13. El jugador siempre espera algo que aún no ha visto.
8. Sunk Cost: el árbol genealógico, el epitafio en construcción, siempre visibles. Ya invertiste demasiado para parar.
9. Autonomy Bias: el panel de iniciativa da sensación de control real sobre el tiempo del personaje. El jugador siente que decide, aunque las consecuencias lleguen solas.
10. Narrative Transportation: el nombre del personaje en cada momento de tensión. El jugador no lee sobre alguien, es alguien.
11. Temporal Landmarks: cada etapa vital se presenta como un nuevo inicio. "La adolescencia empieza. Las reglas cambian." El jugador se resetea emocionalmente.
12. Zeigarnik Effect: siempre algo casi listo. La profesión al 80%. La consecuencia diferida que viene. La orientación que aún no se reveló. El jugador no puede cerrar la app en un momento redondo.

---

## 44. EPITAFIO VIVO DETALLADO

Visible en cualquier momento durante la partida (panel colapsable en GameScreen).
Cambia desde el primer evento. A los 6 años ya existe una versión mínima.
Los objetos más importantes del personaje aparecen en él.
La corrupción moral (GameState.moralCorruption) solo es visible aquí.
Cada decisión importante contribuye con una seed al sistema de epitafio.

### Pantalla de muerte
15 segundos de preparación visual antes de mostrar el epitafio.
Texto preparatorio: "Llevas X años. Tomaste X decisiones. X personas te recordarán."
La última línea del epitafio siempre es la más poderosa — generada por las seeds más recientes.
Renderizado como lápida SVG con textura de piedra simulada en CSS.
Animación sutil al actualizarse tras decisión importante durante la partida.

---

## 45. FEEDBACK UX PENDIENTE DE IMPLEMENTAR

Por orden de prioridad:

1. Scroll al inicio automático al cambiar de pantalla (window.scrollTo(0,0) en cada setScreen)
2. Tutorial/onboarding para jugador nuevo (3 pasos máximo, no intrusivo, una sola vez, guardado en localStorage)
3. Flash visual de stats al resolver evento: +0.3 en verde / -0.5 en rojo, fadeOut en 1.5s, posición sobre StatusBar
4. Barra de progreso de etapa con hitos: "INFANCIA ████░░░░ 8/12 años" con marcadores de eventos pasados
5. Fondo atmosférico cambia con etapa vital (tints definidos en sección 47)
6. Transición cinematográfica entre etapas (pantalla negra + nombre etapa + frase del GDD + música nueva)
7. Cards de NPCs vivos en panel izquierdo (sección 30)
8. Gráfica de evolución de stats (SVG últimos 8 trimestres, sección 31)
9. Newsletter trimestral con diseño de periódico de época (sección 47)
10. Epitafio como lápida SVG en panel colapsable (sección 44)
11. "Analizar antes de decidir" muestra información útil real del estado del personaje, no texto genérico
12. Tiempo invertido en una actividad debe generar eventos coherentes con esa inversión a largo plazo

---

## 46. TRANSPORTE COTIDIANO (DISEÑADO, NO IMPLEMENTADO)

Sin vehículo en ciudad con metro: 80 euros/mes abono, tiempo de desplazamiento limitado pero manejable.
Sin vehículo en ciudad sin metro: trabajo limitado por distancia a pie o en bicicleta.
Trabajo en polígono industrial o afueras: coche prácticamente obligatorio.
Vivir en pueblo y trabajar en ciudad: 2h/día de desplazamiento = -1 día efectivo/semana en stats de productividad.
Carné de conducir: 800-1.500 euros, 2-3 meses de proceso. Requisito previo obligatorio para cualquier vehículo.

---

## 47. SISTEMAS DE ADICCIÓN Y RETENCIÓN

### El Rival
Generado al nacer con los mismos ancestros pero diferente país, orientación sexual y suerte inicial.
Vive en paralelo durante toda la partida con su propio motor de vida simplificado.
Aparece en la newsletter cada 4 trimestres: "Mientras tú estudiabas, Miguel montó su primera empresa."
Crea tensión comparativa constante sin ser intrusivo ni obligatorio interactuar.
RivalState ya existe en GameState. Expandir con vida paralela similar a npcLifeSystem.

### Newsletter Trimestral Expandida
Aparece cada 4 trimestres como modal con diseño de periódico de época.
Tres secciones obligatorias:
  MUNDO: evento histórico ficticio que afecta a tu país y época.
  TU ENTORNO: algo que afecta a tus NPCs o al rival directamente.
  ECONOMÍA: ciclo económico actual, Euribor, tendencia de mercados.
No usar años reales para evitar meta-gaming y permitir partidas en cualquier época.
Diseño: tipografía de época, columnas periodísticas, titular grande, publicidad falsa de época.

### Fondo atmosférico por etapa vital
| Etapa | Tint hex | Sensación |
|-------|----------|-----------|
| Infancia | #221608 | Cálido dorado, luz de tarde |
| Adolescencia | #0a0d14 | Azul frío, inquietud |
| Juventud | #1a1408 | Ámbar vibrante, energía |
| Adultez | #100d08 | Marrón oscuro, peso |
| Madurez | #0f0e0d | Gris cálido, serenidad |
| Vejez | #080807 | Casi negro, quietud |

### Transición cinematográfica entre etapas
Pantalla negra completa + nombre de etapa apareciendo letra a letra (useTypingAnimation) + edad actual + frase del GDD para esa etapa + música nueva que hace fade in. Duración 4 segundos, skip con cualquier tecla o clic. Es el momento memorable que los jugadores compartirán en redes.

### Mascotas
Vínculo emocional 0-10, no solo gasto mensual. Coste económico secundario al vínculo.
La muerte de la mascota es uno de los eventos más frecuentes e impactantes del juego.
El duelo dura semanas en el juego — la narrativa lo trata con el mismo peso que una pérdida humana.

Razas con personalidades reales:
Border Collie: necesita trabajo mental constante o destruye la casa. Alta demanda de tiempo.
Golden Retriever: familiar, ideal con niños, facilita relaciones sociales.
Rottweiler: requiere entrenamiento serio. Sin él, es un problema legal y social.
Chihuahua: ciudad, soltero, alta demanda emocional, vínculo muy intenso.

Eventos únicos de mascotas:
La operación cara inesperada (3.200 euros sin seguro): decisión económica vs vínculo emocional.
El perro que detecta el infarto o la enfermedad antes que los médicos.
La decisión de eutanasia: una de las decisiones más duras del juego.
El hijo que desarrolla alergia al perro: conflicto entre vínculos.
La ex/ex que quiere quedarse con el perro tras el divorcio: el perro como campo de batalla emocional.

En Modo Dynastía: la tortuga que tiene 40 años y sigue en la familia en la generación 3.

---

## 48. IDIOMAS SOPORTADOS

| Tier | Idiomas |
|------|---------|
| Tier 1 — Lanzamiento | ES (español, fuente de verdad), EN (inglés), FR (francés), DE (alemán), PT-BR (portugués Brasil) |
| Tier 2 — Post-lanzamiento | RU (ruso), PL (polaco), IT (italiano), TR (turco), ZH (chino simplificado) |

Arquitectura: react-i18next instalado. Archivos JSON en src/i18n/locales/.
Todos los strings de UI en componentes via t('clave') — nunca hardcodeados.
Comentarios en el código en inglés. UI en el idioma del jugador.
La narrativa de eventos está en español como fuente de verdad y se traduce en los JSONs.
Razón de elección: ES y PT-BR cubren todo el mercado hispanohablante y brasileño. RU y PL son enormes en Steam y se subestiman. ZH para el mayor mercado potencial del mundo.

---

## 49. LOS 80 ARQUETIPOS LEGENDARIOS (DISEÑADO, NO IMPLEMENTADO)

No son skins cosméticos. Son condiciones de partida especiales con herencia genética inspirada en la figura histórica, país y época relevante como punto de partida, y el arco narrativo de su vida real como posibilidad, no como obligación. El jugador puede desviarse completamente.

AVISO LEGAL IMPORTANTE: Las figuras vivas o fallecidas recientemente requieren nombres ficcionalizados o licencia explícita antes del lanzamiento comercial en Steam. Las figuras históricas fallecidas hace más de 70 años son generalmente de dominio público. Revisar con asesor legal antes de implementar esta feature.

Figuras que requieren ficcionalización (vivas o fallecidas recientemente):
Musk, Gates, Bezos, Buffett, Jack Ma, Jordan, Federer, Bolt, Simone Biles, Tiger Woods, Bowie, Bob Dylan, Miyazaki, Banksy, Castro, Thatcher.

10 categorías x 8 figuras:
Ciencia: Einstein, Curie, Tesla, Hawking, Sagan, Armstrong, Gagarin, Darwin
Tecnología: Jobs, Gates, Buffett, Rockefeller, Carnegie, Jack Ma (ficcionalizar los vivos)
Deporte: Jordan, Ali, Pelé, Senna, Bolt, Federer, Tiger Woods, Simone Biles (ficcionalizar los vivos)
Arte: Picasso, Mozart, Bowie, Frida Kahlo, Beethoven, Bob Dylan, Miyazaki, Banksy (ficcionalizar los vivos)
Poder: Napoleon, Mandela, Churchill, Gandhi, Lincoln, Castro, Thatcher, Julio César
Crimen: Escobar, Capone, El Chapo, Jesse James, Griselda Blanco, Frank Lucas, D.B. Cooper, Victor Lustig
Exploradores: Colón, Shackleton, Amelia Earhart, Hillary, Messner, Cousteau, Marco Polo, Amundsen
Filosofía: Buda, Sócrates, Confucio, MLK, Marco Aurelio, Simón Bolívar, Osho, Hubbard

---

## 50. SISTEMA DE MOMENTOS IRREPETIBLES (DISEÑADO, NO IMPLEMENTADO)

Algunos momentos solo ocurren una vez en toda la partida.
No hay aviso previo. No se pueden preparar. No se pueden repetir.

Ejemplos de momentos irrepetibles:
La primera vez que tu hijo dice papá o mamá.
El día que tu padre te pide perdón — puede no llegar nunca.
La última conversación antes de que alguien muriera sin saber que era la última.
El momento exacto en que decides que ya no amas a tu pareja.
El instante en que ves el resultado de 30 años de trabajo.

Mecánica: aparecen en el feed sin aviso, en cualquier momento.
El jugador solo puede elegir cómo responder, no si ocurre.
Los más importantes aparecen en el epitafio.
La memoria selectiva: el personaje recuerda los momentos más cargados emocionalmente, no los estratégicamente importantes.

---

## 51. LA DECISIÓN ARREPENTIDA (DISEÑADO, NO IMPLEMENTADO)

Una vez por partida, el jugador puede ver qué habría pasado con la decisión que no tomó.
No puede cambiarla. Solo puede verla.
La respuesta no siempre es obvia: a veces el camino no tomado era peor.
A veces era mejor. La ambigüedad es intencional — no hay respuestas correctas en Fateborn.

---

## 52. ENVEJECIMIENTO FÍSICO POR DÉCADAS (DISEÑADO, NO IMPLEMENTADO)

El cuerpo no es estático. Es el activo más importante y el que más se deteriora con el tiempo.

20s: Físico en su pico máximo. Recuperación rápida de cualquier daño. Las malas decisiones de salud no tienen consecuencias visibles todavía. Sensación de invulnerabilidad — que es una trampa narrativa.
30s: Primer declive measurable. El metabolismo ya no perdona los excesos. Las lesiones tardan más en sanar. El cuerpo empieza a reflejar las decisiones de los 20.
40s: El cuerpo empieza a hablar en voz alta. Las decisiones de salud de los 30 dan sus frutos, buenos o malos.
50s: Los resultados de décadas de decisiones acumuladas son ya irreversibles en gran parte.
60s-70s: La autonomía física como recurso que se agota trimestre a trimestre.

El cuerpo como narrador — descripciones narrativas específicas en el feed:
  Físico 9 a los 16 con hobby deportivo activo: "Tu cuerpo responde antes de que pienses."
  Físico 4 a los 45 sin actividad desde los 25: "Hay una pereza física que se ha instalado. No es enfermedad. Es abandono gradual."
  Físico 9 a los 45 con estilo atlético mantenido: "A los 45 sigues siendo quien eras a los 25. No todo el mundo puede decir eso."

---

## 53. EL TIEMPO COMO PERSONAJE (DISEÑADO, NO IMPLEMENTADO)

El tiempo no es solo el contador de semanas. Es algo que el jugador debe sentir pasar.

Marcadores relacionales en lugar de fechas frías:
No: "Semana 43 · Año 2003"
Sino: "Han pasado 3 años desde que decidiste no defender a Carlos. Te preguntas si él lo recuerda."

Aceleración temporal narrativa en períodos sin eventos importantes:
"Los siguientes dos años son la versión abreviada de crecer. El colegio. Los amigos de siempre. La rutina que parece eterna y que un día termina sin avisar."

Ralentización en momentos de máximo peso emocional:
El primer sueldo de tu vida: "280 euros. Lo miras varias veces antes de creer que es tuyo. No es mucho. No lo es. Pero es completamente tuyo."

---

## 54. CARTAS Y MENSAJES GUARDADOS (DISEÑADO, NO IMPLEMENTADO)

Las palabras que decidiste no decir. Y las que llegaron demasiado tarde.

Tipos: cartas escritas a mano, emails, mensajes de texto, voicemails guardados durante años.

Ejemplos narrativos:
El mensaje de voz de tu padre guardado aunque su teléfono lleva 10 años sin existir.
La carta que escribiste y nunca enviaste porque no era el momento — y el momento nunca llegó.
La última llamada antes del accidente. El número que sigues sin borrar del teléfono.

Mecánica: escribir carta disponible en panel de iniciativa.
El jugador elige: enviar ahora, guardar, o no enviar.
Las cartas no enviadas pesan como carga emocional acumulada.
La carta final antes de morir: si el jugador la escribe, aparece en el Modo Dynastía. El descendiente la encuentra y la lee. Puede cambiar su trayectoria.

---

## 55. REPUTACIÓN LOCAL (DISEÑADO, NO IMPLEMENTADO)

Diferente de la reputación global (sección 38). Es la memoria específica de cada entorno social.
Cada colegio, barrio, empresa y ciudad tiene su propia memoria de lo que hiciste ahí.

Ejemplos de cómo funciona:
Si defendiste a Carlos en el patio del colegio a los 10 años: a los 25 en una entrevista de trabajo, el entrevistador fue al mismo colegio y te reconoce. La conversación cambia.
Si ganaste el concurso literario del colegio a los 12: a los 20 alguien del barrio te para por la calle y te pregunta si eras tú el que escribía.
Si fuiste el agresor en el colegio: eso también se sabe. Puede aparecer en el momento más inoportuno — una cena, una entrevista, una aplicación de trabajo.

---

## 56. MECÁNICAS DETALLADAS DE PROFESIONES CLAVE (DISEÑADO, NO IMPLEMENTADO)

### Científico
Sistema de proyectos de investigación con financiación limitada y fecha límite.
El dilema central: publicar antes de estar seguro (riesgo de retractación) vs esperar (riesgo de que alguien llegue primero).
El colega que te roba la idea: uno de los eventos más traumáticos de la carrera científica.
La empresa farmacéutica que financia con condiciones: el inicio del arco de corrupción moral.
El descubrimiento accidental que cambia completamente tu campo: no siempre es lo que buscabas.

### Médico
Sistema de pacientes activos con historia propia y seguimiento a lo largo del tiempo.
Burnout médico como mecánica específica: señales progresivas durante meses antes del colapso.
El protocolo vs el juicio clínico: la tensión central de la profesión.
El error que cometiste y nadie sabe que fue tuyo: peso moral permanente.
Especialidades con mecánica diferente: cirugía (precisión, sin margen), psiquiatría (empatía, largo plazo), urgencias (velocidad, vida o muerte), médico de familia (continuidad, relación humana).

### Político
Capital político como recurso principal (0-100). Se gasta en cada decisión importante.
La corrupción gradual en fases numeradas y narrativamente distintas:
  Nivel 1: el sobre en el desayuno. "No es gran cosa. Todo el mundo lo hace."
  Nivel 5: la ley que modificas a cambio de financiación de campaña.
  Nivel 9: ya no recuerdas cuándo dejaste de ser quien eras cuando empezaste.
El escándalo que puedes tapar o dejar salir: decisión con consecuencias en 4 capas.

### Futbolista
Sistema de vestuario con 22 jugadores con dinámicas propias entre ellos.
El veterano que te enseña cuando llegas y luego compite contigo por tu puesto.
El joven que llega a reemplazarte y tú debes decidir cómo tratarle.
Post-carrera como segundo juego obligatorio:
  Depresión post-retirada (estadísticamente documentada en el 35% de futbolistas profesionales).
  Pérdida de estructura diaria y propósito tras años de rutina total.
  Decisión de qué ser ahora: entrenador, comentarista, empresario, o nada.

### Criminal
Sistema de exposición 0-100 siempre visible en pantalla.
1-40: nadie sospecha. 41-80: algunas personas saben. 81-99: te están cerrando el cerco. 100: arrestado.
Blanqueo de dinero como mecánica propia con opciones: empresa fantasma, inmuebles, casino, arte, crypto.
Especialidades con arcos distintos: estafador (cerebro, largo plazo), traficante (dinero rápido, exposición alta), crimen organizado (poder, lealtades, traiciones).

### Empresario
4 fases con mecánicas y riesgos completamente distintos:
  Fase 0: validar la idea vs lanzar sin validar. El error más común y más caro.
  Fase 1: el primer empleado. Casi siempre un amigo, más barato, más comprometido, más complicado.
  Fase 2: supervivencia. El 70% de las empresas muere aquí. En Fateborn, también.
  Fase 3: crecimiento. Puede matar igual que la fase 2 si creces demasiado rápido.
  Fase 4: madurez. La pregunta más difícil: ¿qué haces cuando ya funciona solo y no te necesita?

---

## 57. VIAJES CON MECÁNICAS ÚNICAS (DISEÑADO, NO IMPLEMENTADO)

### Tipos de viaje con coste y duración
Escapada de fin de semana: 200-800 euros, impacto menor pero positivo en Emocional.
Vacaciones anuales: 800-5.000 euros, recuperación de burnout, +Físico si son activas.
Mochilero 3-6 meses: requiere dejar trabajo o tomarse excedencia. Impacto transformador.
Viaje de trabajo: sin coste personal, red de contactos internacionales.
Vuelta al mundo: 20.000-50.000 euros, 1 año. Solo posible con estabilidad económica alta.

### Destinos con mecánicas específicas
Japón: +Disciplina 0.5 permanente por exposición a cultura de la disciplina y el detalle.
Silicon Valley (solo con perfil tecnológico activo): red de contactos que puede cambiar la trayectoria de carrera completamente.
Dubai: oportunidades de negocio específicas disponibles solo en este destino.
Zona de conflicto activo (periodista o cooperante): riesgo real de no volver. El motor lo calcula.

### Viaje espacial (disponible desde 2040s en el juego)
Coste: 500.000-5.000.000 euros según la era tecnológica del juego.
El overview effect: cambio filosófico permanente e irreversible en el personaje.
Efectos: +0.5 Perspectiva, +0.3 Emocional, +0.3 Estabilidad permanentes.
Narrativa: "Después de ver el planeta completo desde arriba, los problemas de abajo parecen diferentes. No menores. Solo... diferentes."
Aparece en el epitafio de forma única — pocos personajes lo logran.

---

## 58. LONGEVIDAD EXTENDIDA (DISEÑADO, NO IMPLEMENTADO)

En partidas que alcanzan el futuro en el juego, la ciencia avanza y cambia las reglas.

Era actual (hasta 2030 en el juego): esperanza de vida estándar ~80 años.
Era de intervención (2030-2050 en el juego): terapias genéticas y celulares que extienden 10-15 años. Solo accesibles para ricos (500.000 euros+). La brecha de longevidad como mecánica social y narrativa.
Era de extensión (2050+ en el juego): esperanza de vida 110-120 años para clase media alta. Nuevos problemas narrativos: jubilación a los 70 con 50 años por delante, relaciones de 80 años, 3-4 carreras en una sola vida.
Era especulativa (2080+ en el juego): mortalidad casi vencida para los más ricos. El personaje que elige morir cuando siente que su historia terminó: el acto más libre del juego.

---

## 59. LEGADO CULTURAL VIVO (DISEÑADO, NO IMPLEMENTADO)

Lo que creas existe en el mundo del juego y el mundo lo recuerda o lo olvida.

Músico: tus álbumes existen en la narrativa del mundo del juego. En Modo Dynastía tu nieto escucha tu música en la radio. "Reconoce el apellido en los créditos."
Escritor: tus libros están en las bibliotecas del juego. Otros personajes pueden leerlos y cambiar su trayectoria vital gracias a ellos.
Arquitecto: los edificios que diseñaste siguen en pie décadas después. El descendiente pasa por delante. "El nombre en la placa de inauguración es el tuyo."
Político: las leyes que promulgaste siguen vigentes o han sido derogadas por quien vino después.

El legado olvidado (estadísticamente, el 80% de las personas):
"Vivió. Amó. Fue olvidado. Como casi todos. Eso no hace su vida menos real ni menos suya."
El epitafio lo reconoce sin juicio ni condescendencia.

---

## 60. GASTRONOMÍA DETALLADA (DISEÑADO, NO IMPLEMENTADO)

### La receta de tu madre o abuela
Cuando la cocinas por primera vez solo: memoria involuntaria automática en el feed.
Cuando la enseñas a tu hijo: transmisión cultural explícita, acto de amor narrativo.
Si el familiar que la sabía muere: solo tú sabes hacerla ahora. La responsabilidad pesa.
Si la pierdes (no la aprendiste a tiempo): se pierde para siempre en el juego.
En Modo Dynastía: aparece generaciones después, quizás modificada, quizás perfecta.

### Cocinar como acto narrativo
Cocinar para alguien es un acto de amor measurable en el sistema de relaciones.
La cena familiar del domingo: tradición que une o que evidencia que algo se rompió.
El restaurante de la primera cita: guardado como MemoryPlace con memoria emocional permanente.

### Hábitos alimentarios como mecánica económica y de salud
Cocinar en casa: 250-400 euros/mes, requiere tiempo (-1h/día), beneficio en Físico.
Comer fuera con regularidad: 600-1.500 euros/mes, +social, neutro en salud.
Delivery sistemático: 800-1.800 euros/mes, -tiempo de preparación, síntoma narrativo de desconexión.
Diferencia económica acumulada entre cocinar y delivery en 20 años: 120.000 euros.

---

## 61. SISTEMA DE PENSIONES Y FIRE (DISEÑADO, NO IMPLEMENTADO)

### FIRE (Financial Independence, Retire Early)
La regla del 4%: si tienes 25 veces tus gastos anuales invertidos, puedes vivir de los rendimientos indefinidamente.
Con 2.000 euros/mes de gastos: necesitas 600.000 euros invertidos.
Con 5.000 euros/mes de gastos: necesitas 1.500.000 euros invertidos.
Con 10.000 euros/mes: necesitas 3.000.000 euros.

El jugador que alcanza FIRE a los 40: uno de los momentos más complejos del juego.
¿Qué hace con el resto de su vida? La libertad que esperabas puede sentirse vacía o puede ser exactamente la vida que siempre quisiste. El juego no juzga ninguna de las dos respuestas.

### Sistema público de pensiones
Puede no existir cuando el personaje llegue a la edad de jubilación: evento histórico posible (reforma estructural, quiebra del sistema, cambio político radical).
El jugador que confió solo en el sistema público sin ahorrar: uno de los eventos más duros de la vejez.

---

## 62. LIBROS Y CULTURA DETALLADO (DISEÑADO, NO IMPLEMENTADO)

Los libros moldean quién eres. No como variable abstracta sino como eventos específicos con consecuencias reales.

### El libro correcto en el momento correcto
Un libro de estoicismo durante una crisis de propósito puede ser el evento que salva al personaje y evita una decisión irreversible.
Una autobiografía de empresario a los 20 puede ser el detonante de una vocación que cambia toda la trayectoria.
Un libro de psicología durante un divorcio puede cambiar cómo el personaje procesa el dolor.

### El libro de tu abuelo con sus notas marginales
En Modo Dynastía el descendiente encuentra el libro entre las pertenencias heredadas.
"Alguien había subrayado esta frase: 'La libertad no se regala. Se construye.'"
Y debajo, con letra apretada: "Ojalá hubiera entendido esto antes."
Ese momento puede cambiar al descendiente más que cualquier herencia económica.

### Biblioteca personal como activo narrativo
Crece durante toda la vida. La conexión entre libros leídos y decisiones tomadas es visible en retrospectiva, nunca en el momento. El epitafio puede mencionar los libros más importantes.

---

## 63. SUEÑOS DETALLADOS (DISEÑADO, NO IMPLEMENTADO)

### Tipos de sueños
Procesamiento: aparecen la noche después de un evento importante. El subconsciente ordena lo que pasó.
Recurrentes: relacionados directamente con el miedo central del personaje.
Pesadillas: carga vital alta + traumas no procesados. Se vuelven más frecuentes e intensas.
Lúcidos: raros, solo con Emocional muy alto. Las respuestas son simbólicas y ambiguas.

### Formato en el feed
Cursiva más tenue que la narrativa normal. Fondo ligeramente diferente del resto del feed.
Los sueños recurrentes están narrativamente conectados con el miedo central del personaje.
Si el miedo se trabaja con terapia o eventos de resolución: el sueño cambia gradualmente.
Si no se trabaja: el sueño se vuelve pesadilla progresivamente durante trimestres.

### El momento de catarsis
La pesadilla recurrente que desaparece completamente el día que resuelves lo que la provocó: uno de los momentos de catarsis más poderosos de todo el juego. El feed simplemente lo registra: "Esa noche, por primera vez en años, no hubo sueños."

---

## 64. SISTEMA DE NARRATIVA PASIVA (IMPLEMENTADO)

Sistema implementado en src/data/passiveNarrative.ts.
Activo y funcionando. Este documento describe su arquitectura para evitar regresiones.

### Por qué existe
Sin narrativa pasiva, avanzar trimestres sin evento activo dejaba el feed vacío.
El jugador no sentía que el tiempo pasaba — solo que hacía clic en un botón.
La narrativa pasiva genera sensación de vida continua entre decisiones importantes.

### Estructura de PassiveEntry
interface PassiveEntry {
  stage: 'infancia' | 'adolescencia' | 'juventud' | 'adultez' | 'madurez' | 'vejez'
  lifestyle?: string   // opcional: si aplica solo a un estilo de vida específico
  texts: string[]      // pool de textos, se elige uno aleatoriamente
}

### Función getPassiveNarrative
Recibe: stage (etapa vital), lifestyle (estilo de vida actual), characterName (nombre real del personaje).
Primero busca entradas específicas del estilo de vida para esa etapa.
Si no hay específicas, usa las genéricas de la etapa.
El texto elegido reemplaza {{name}} por el nombre capitalizado del personaje.

### Sistema anti-repetición
El sistema recuerda el índice del último texto usado por etapa.
Nunca repite el mismo texto dos trimestres consecutivos.
Si el pool tiene solo 1 texto: lo muestra igualmente (no hay alternativa).
Pool mínimo recomendado: 5 textos por etapa para variedad natural.

### Visual en NarrativeFeed
Las entradas de tipo 'passive' se muestran con:
  color: #7a6040 (ligeramente más tenue que las entradas de evento real)
  fontStyle: italic
  fontSize: 0.8rem, fontFamily: Georgia
  sin border-left dorado (reservado para eventos de decisión)
  sin label "DECISIÓN"

---

## 65. DECISIONES DE DISEÑO DESCARTADAS Y POR QUÉ

Esta sección existe para evitar que propuestas ya evaluadas y descartadas vuelvan a aparecer sin contexto.

### Multijugador — DESCARTADO
Razón: rompe la intimidad del juego. Fateborn funciona porque el jugador está solo con su personaje. La comparación social en tiempo real destruye la introspección que hace el juego especial. El rival (sección 47) satisface la necesidad de comparación sin sacrificar la intimidad.

### Narrador con voz — DESCARTADO (por ahora)
Razón: coste de producción prohibitivo para el estado actual del proyecto. Requeriría actores de voz en 10 idiomas y grabación de miles de líneas. Puede revisarse para versiones post-lanzamiento con presupuesto específico.

### Años reales en la newsletter — DESCARTADO
Razón: genera meta-gaming. Si el jugador sabe que "en 1929 habrá una crisis", optimizará su cartera antes. La narrativa histórica debe ser sorpresiva para ser impactante. Los eventos históricos en el juego son ficticios pero verosímiles.

### Modo speedrun — DESCARTADO
Razón: contradice el tono y la filosofía del juego. Fateborn es sobre sentir el peso de una vida, no sobre completarla rápido. Un modo speedrun trivializaría exactamente lo que hace especial al juego.

### Respuesta correcta en eventos — DESCARTADO (principio de diseño)
Razón: si existe una respuesta correcta, el juego se convierte en un puzzle. Fateborn no es un puzzle. Es una exploración de carácter. Las tres opciones de cada evento deben revelar algo diferente del jugador, no señalar una respuesta inteligente y dos respuestas tontas.

---

## 66. HISTORIAL DE VERSIONES DEL DOCUMENTO

| Fecha | Cambios principales |
|-------|---------------------|
| Abril 2026 | Versión inicial: secciones 1-28, motor validado, 5 pantallas funcionales |
| Abril 2026 | Añadidas secciones 29-48: contenido narrativo detallado, sistemas diseñados completos, idiomas |
| Abril 2026 | Añadidas secciones 49-63: arquetipos legendarios, momentos irrepetibles, envejecimiento físico, tiempo como personaje, cartas, reputación local, mecánicas de profesiones, viajes, longevidad, legado cultural, gastronomía, FIRE, libros, sueños |
| Abril 2026 | Añadidas secciones 64-66: narrativa pasiva documentada, decisiones descartadas, historial de versiones. Correcciones: sección 28 actualizada con estado real, sección 32 y 33 con profundidad completa, sección 49 con aviso legal, reglas de diseño con legibilidad mínima |
| Abril 2026 | Reorganización: contenido de diseño movido a GAME_DESIGN.md, CLAUDE.md reducido a contexto operativo (secciones 1-3, 5-8, 26-27) |
