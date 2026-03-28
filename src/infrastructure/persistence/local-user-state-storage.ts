import type { PersistedSetUserState } from '../../domain/user-state';

const STORAGE_KEY = 'just-repeat-mvp:set-user-state';

type StoredSetUserStateRecord = Record<string, PersistedSetUserState>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isPersistedSetUserState(value: unknown): value is PersistedSetUserState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<PersistedSetUserState>;

  return (
    typeof candidate.setId === 'string' &&
    (typeof candidate.lastInteractedAt === 'string' || candidate.lastInteractedAt === null) &&
    (typeof candidate.lastActivePhraseId === 'string' || candidate.lastActivePhraseId === null) &&
    isStringArray(candidate.favoritePhraseIds)
  );
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createDefaultPersistedSetUserState(setId: string): PersistedSetUserState {
  return {
    setId,
    lastInteractedAt: null,
    lastActivePhraseId: null,
    favoritePhraseIds: [],
  };
}

export function loadPersistedSetUserStates(): StoredSetUserStateRecord {
  const storage = getStorage();

  if (!storage) {
    return {};
  }

  const rawValue = storage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, PersistedSetUserState] => isPersistedSetUserState(entry[1])),
    );
  } catch {
    return {};
  }
}

export function savePersistedSetUserStates(value: StoredSetUserStateRecord): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures to keep the app usable without persistence.
  }
}
