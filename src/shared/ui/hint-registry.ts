import { hasHintBeenShown, markHintAsShown } from '../../infrastructure/persistence/local-hint-storage';
import type { HintKey } from './hint-texts';

export type HintRegistration = {
  hintId: string;
  hintKey: HintKey;
  element: HTMLElement | null;
  isMounted: boolean;
};

type Listener = () => void;

type Registry = {
  registrations: HintRegistration[];
  activeHintId: string | null;
  listeners: Listener[];
};

function getGlobalRegistry(): Registry {
  const key = '__jr_hint_registry_global_v1__';
  const g = globalThis as any;

  if (!g[key]) {
    g[key] = { registrations: [], activeHintId: null, listeners: [] } as Registry;
  }

  return g[key] as Registry;
}

function notifyListeners() {
  const reg = getGlobalRegistry();
  for (const l of reg.listeners.slice()) {
    try {
      l();
    } catch {}
  }
}

export function subscribe(listener: Listener) {
  const reg = getGlobalRegistry();
  reg.listeners.push(listener);

  return () => {
    const idx = reg.listeners.indexOf(listener);
    if (idx >= 0) reg.listeners.splice(idx, 1);
  };
}

export function registerHint(registration: HintRegistration) {
  const reg = getGlobalRegistry();

  // ignore if already shown
  if (hasHintBeenShown(registration.hintId)) return;

  if (reg.registrations.some((r) => r.hintId === registration.hintId)) return;

  reg.registrations.push(registration);
  processQueue();
  notifyListeners();
}

export function unregisterHint(registration: HintRegistration) {
  const reg = getGlobalRegistry();
  const idx = reg.registrations.indexOf(registration);
  if (idx >= 0) reg.registrations.splice(idx, 1);

  if (reg.activeHintId === registration.hintId) {
    reg.activeHintId = null;
    processQueue();
  }

  notifyListeners();
}

export function getActiveRegistration(): HintRegistration | null {
  const reg = getGlobalRegistry();
  if (!reg.activeHintId) return null;
  return reg.registrations.find((r) => r.hintId === reg.activeHintId) ?? null;
}

export function closeActiveHint() {
  const reg = getGlobalRegistry();
  if (!reg.activeHintId) return;

  const closingId = reg.activeHintId;
  reg.activeHintId = null;
  markHintAsShown(closingId);
  processQueue();
  notifyListeners();
}

function processQueue() {
  const reg = getGlobalRegistry();

  if (reg.activeHintId) return;

  for (const candidate of reg.registrations) {
    if (!candidate.isMounted) continue;
    if (hasHintBeenShown(candidate.hintId)) continue;

    reg.activeHintId = candidate.hintId;
    break;
  }
}

export function getQueueHintIds(): string[] {
  const reg = getGlobalRegistry();
  return reg.registrations.map((r) => r.hintId);
}
