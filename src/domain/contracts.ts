import type { SetDetails, SetId, SetSummary } from './entities';

export type IntegrationErrorCode =
  | 'SET_LIST_LOAD_FAILED'
  | 'SET_DETAILS_LOAD_FAILED'
  | 'SET_NOT_FOUND'
  | 'INVALID_SET_SCHEMA'
  | 'INVALID_PHRASE_SCHEMA'
  | 'AUDIO_FILE_MISSING';

export type IntegrationError = {
  code: IntegrationErrorCode;
  message: string;
  context?: {
    setId?: string;
    phraseId?: string;
    sourcePath?: string;
  };
};

export interface SetsDataSource {
  getSetSummaries(): Promise<SetSummary[]>;
  getSetDetails(setId: SetId): Promise<SetDetails>;
}

export interface AudioPathResolver {
  resolveAudioSrc(inputAudioPath: string): string | null;
}

export interface DataValidator {
  validateSetList(source: unknown): void;
  validateSetDetails(source: unknown, expectedSetId: SetId): void;
}

export interface IntegrationWarning {
  code: 'PHRASE_COUNT_MISMATCH';
  message: string;
  context?: {
    setId?: string;
    sourcePath?: string;
  };
}
