import type { UserProfile } from '../../domain/user-profile';

const STORAGE_KEY = 'just-repeat-mvp:user-profile';

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

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<UserProfile>;
  return typeof candidate.email === 'string' && typeof candidate.login === 'string' && typeof candidate.password === 'string';
}

export function loadUserProfile(): UserProfile | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isUserProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function removeUserProfile(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
}
