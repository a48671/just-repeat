export type SetId = string;
export type PhraseId = string;

export type SetSummary = {
  id: SetId;
  title: string;
  description: string;
  phraseCount: number;
  sourceFile: string;
};

export type Phrase = {
  id: PhraseId;
  setId: SetId;
  text: string;
  translatedText?: string;
  audioSrc: string | null;
};

export type SetDetails = {
  id: SetId;
  title: string;
  description: string;
  phrases: Phrase[];
};

export type CurrentListMode = 'all' | 'favorites';

export type PlaybackMode = 'idle' | 'single' | 'queue';

export type PhrasePlaybackVisualState = 'idle' | 'loading' | 'playing' | 'completed' | 'error';
