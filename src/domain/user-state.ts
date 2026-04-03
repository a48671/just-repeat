import type { PhraseId, SetId } from './entities';

export type PersistedSetUserState = {
  setId: SetId;
  lastInteractedAt: string | null;
  lastActivePhraseId: PhraseId | null;
  favoritePhraseIds: PhraseId[];
};

export type SessionProgressState = {
  completedPhraseIds: PhraseId[];
};

export type PlayAllQueueState = {
  isActive: boolean;
  cursorPhraseId: PhraseId | null;
  listMode: 'all' | 'favorites';
  phraseStatus: 'idle' | 'loading' | 'playing' | 'completed' | 'error';
  completedCount: number;
};

export type SetScreenState = {
  setId: SetId;
  activePhraseId: PhraseId | null;
  lastManualPhraseId: PhraseId | null;
  playAllCursorPhraseId: PhraseId | null;
  favoritesOnly: boolean;
};
