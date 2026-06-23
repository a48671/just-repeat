const STORAGE_KEY = 'just-repeat-mvp:button-hints-shown';

type HintStatusRecord = Record<string, boolean>;

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

function loadHintStatusRecord(): HintStatusRecord {
  const storage = getStorage();

  if (!storage) {
    return {};
  }

  const rawValue = storage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[0] === 'string' && typeof entry[1] === 'boolean'),
    );
  } catch {
    return {};
  }
}

function saveHintStatusRecord(value: HintStatusRecord): void {
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

export function hasHintBeenShown(hintId: string): boolean {
  return loadHintStatusRecord()[hintId] === true;
}

export function markHintAsShown(hintId: string): void {
  const currentStatus = loadHintStatusRecord();
  saveHintStatusRecord({
    ...currentStatus,
    [hintId]: true,
  });
}
