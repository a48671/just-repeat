import { DEFAULT_APP_SETTINGS, type AppSettings, type NativeLanguage, NATIVE_LANGUAGE_OPTIONS } from '../../domain/app-settings';

const STORAGE_KEY = 'just-repeat-mvp:app-settings';

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

function isNativeLanguage(value: unknown): value is NativeLanguage {
  return typeof value === 'string' && NATIVE_LANGUAGE_OPTIONS.includes(value as NativeLanguage);
}

function isAppSettings(value: unknown): value is AppSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<AppSettings>;
  return isNativeLanguage(candidate.nativeLanguage);
}

export function loadAppSettings(): AppSettings {
  const storage = getStorage();

  if (!storage) {
    return DEFAULT_APP_SETTINGS;
  }

  const rawValue = storage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_APP_SETTINGS;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return isAppSettings(parsed) ? parsed : DEFAULT_APP_SETTINGS;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(value: AppSettings): void {
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