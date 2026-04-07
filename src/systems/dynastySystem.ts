// Dynasty System — Fateborn
// Gestiona transferencias generacionales, notificaciones de dinastía y triggers de legado.

import type { Character } from '../types';
import type { Economy } from '../store/gameStore';

// ─── Descendiente ─────────────────────────────────────────────────────────────

export interface Descendant {
  nombre:              string;
  genero:              'hombre' | 'mujer';
  edadActual:          number;
  statsHeredados:      Partial<import('../types').CharacterStats>;
  patrimonioHeredado:  number;
  edadNacimientoPadre: number; // edad del personaje cuando nació el descendiente
}

// ─── Tipos de notificación ────────────────────────────────────────────────────

export type DynastyNotifType =
  | 'hijo_vida_propia_40'
  | 'descendiente_cumple_18'
  | 'transferencia_disponible_55'
  | 'transferencia_obligatoria_legado'
  | 'death_preview';

export interface DynastyNotif {
  type:        DynastyNotifType;
  mensaje:     string;
  actionLabel: string;
  priority:    'normal' | 'destacado';
}

// ─── Evaluadores de notificación ─────────────────────────────────────────────

/**
 * PROBLEMA 2 — fix 1:
 * Entrada narrativa cuando el personaje tiene 40 años y tiene al menos 1 hijo.
 */
export function evalHijoVidaPropia(
  characterAge: number,
  descendant:   Descendant | null,
): DynastyNotif | null {
  if (characterAge < 40 || !descendant) return null;
  // Solo disparar una vez, cuando cumple 40
  if (characterAge > 41) return null;

  const pronombre = descendant.genero === 'mujer' ? 'hija' : 'hijo';
  const msg = `Tu ${pronombre} ${descendant.nombre} tiene ${descendant.edadActual} años. Empieza a tener su propia vida. Podrías tomar el control de su historia en cualquier momento desde el panel.`;

  return {
    type:        'hijo_vida_propia_40',
    mensaje:     msg,
    actionLabel: 'Ver perfil del descendiente',
    priority:    'normal',
  };
}

/**
 * PROBLEMA 2 — fix 2:
 * Notificación prominente cuando el descendiente cumple 18 años.
 */
export function evalDescendiente18(
  descendant: Descendant | null,
): DynastyNotif | null {
  if (!descendant || descendant.edadActual !== 18) return null;

  const pronombre = descendant.genero === 'mujer' ? 'Tu hija' : 'Tu hijo';

  return {
    type:        'descendiente_cumple_18',
    mensaje:     `${pronombre} acaba de cumplir 18 años. Su vida empieza ahora. ¿Quieres vivirla tú?`,
    actionLabel: 'Transferir control',
    priority:    'destacado',
  };
}

/**
 * PROBLEMA 2 — fix 3:
 * Panel de iniciativa muestra opción "TRANSFERIR" cuando el personaje tiene 55+ años.
 */
export function evalTransferenciaDisponible55(
  characterAge: number,
  descendant:   Descendant | null,
): DynastyNotif | null {
  if (characterAge < 55 || !descendant) return null;

  return {
    type:        'transferencia_disponible_55',
    mensaje:     'Tu historia continúa en quien viene después de ti.',
    actionLabel: 'TRANSFERIR A TU DESCENDIENTE',
    priority:    'normal',
  };
}

/**
 * PROBLEMA 2 — fix 4:
 * Modo Legado: transferencia obligatoria cuando el descendiente cumple 25 y el personaje sigue vivo.
 */
export function evalTransferenciaObligatoria(
  characterAge: number,
  descendant:   Descendant | null,
  modoLegado:   boolean,
): DynastyNotif | null {
  if (!modoLegado || !descendant) return null;
  if (descendant.edadActual !== 25) return null;
  // El personaje debe tener al menos ~45 años para tener un hijo de 25
  if (characterAge < 45) return null;

  const pronombre = descendant.genero === 'mujer' ? 'Tu hija' : 'Tu hijo';

  return {
    type:        'transferencia_obligatoria_legado',
    mensaje:     `${pronombre} ${descendant.nombre} ha cumplido 25 años. En Modo Legado, el control pasa a la siguiente generación.`,
    actionLabel: 'Transferir ahora',
    priority:    'destacado',
  };
}

/**
 * PROBLEMA 2 — fix 5:
 * Genera el preview del descendiente para mostrar en DeathScreen antes de los botones.
 */
export function buildDeathScreenPreview(
  descendant: Descendant | null,
  economy:    Economy,
): { visible: boolean; nombreDescendiente: string; edadDescendiente: number; preview: string } {
  if (!descendant) {
    return { visible: false, nombreDescendiente: '', edadDescendiente: 0, preview: '' };
  }

  const patrimonio = economy.patrimonioBruto > 0
    ? `${economy.patrimonioBruto.toLocaleString('es-ES')}€ en patrimonio`
    : 'sin patrimonio material';

  const statsTop = Object.entries(descendant.statsHeredados)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 2)
    .map(([k]) => k)
    .join(', ');

  const preview = `${descendant.nombre}, ${descendant.edadActual} años — hereda ${patrimonio}${statsTop ? `. Sus rasgos dominantes: ${statsTop}` : ''}. Su historia apenas comienza.`;

  return {
    visible:             true,
    nombreDescendiente:  descendant.nombre,
    edadDescendiente:    descendant.edadActual,
    preview,
  };
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Calcula la edad actual del descendiente dado la edad actual del personaje */
export function calcDescendantAge(
  characterAge:        number,
  characterAgeAtBirth: number,
): number {
  return Math.max(0, characterAge - characterAgeAtBirth);
}

/** Devuelve todas las notificaciones activas en este momento */
export function getDynastyNotifications(
  characterAge: number,
  descendant:   Descendant | null,
  modoLegado:   boolean,
): DynastyNotif[] {
  const notifs: DynastyNotif[] = [];

  const n1 = evalHijoVidaPropia(characterAge, descendant);
  if (n1) notifs.push(n1);

  const n2 = evalDescendiente18(descendant);
  if (n2) notifs.push(n2);

  const n3 = evalTransferenciaDisponible55(characterAge, descendant);
  if (n3) notifs.push(n3);

  const n4 = evalTransferenciaObligatoria(characterAge, descendant, modoLegado);
  if (n4) notifs.push(n4);

  return notifs;
}

/** Stats iniciales del descendiente (hereda promedio de los del personaje) */
export function inheritStats(
  parent: Character,
  mutacion: number = 0.1,
): Partial<import('../types').CharacterStats> {
  const s = parent.stats;
  const mutate = (v: number) => Math.min(10, Math.max(0,
    parseFloat((v + (Math.random() * 2 - 1) * mutacion * 10).toFixed(1))
  ));

  return {
    logica:      mutate(s.logica),
    creatividad: mutate(s.creatividad),
    disciplina:  mutate(s.disciplina),
    carisma:     mutate(s.carisma),
    emocional:   mutate(s.emocional),
    ambicion:    mutate(s.ambicion),
    fisico:      mutate(s.fisico),
    riesgo:      mutate(s.riesgo),
    estabilidad: mutate(s.estabilidad),
  };
}
