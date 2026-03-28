import bundledSetIndex from '../../../data/sets.json';
import type { SetsDataSource, IntegrationErrorCode } from '../../domain/contracts';
import type { SetDetails, SetId, SetSummary } from '../../domain/entities';
import type { SourceSetDetails, SourceSetList } from '../../domain/source-types';
import { StaticAudioPathResolver } from './static-audio-path-resolver';
import { StaticDataValidator, validateBundledSetList } from './static-data-validator';

type IntegrationException = Error & {
  code: IntegrationErrorCode;
  context?: {
    setId?: string;
    phraseId?: string;
    sourcePath?: string;
  };
};

type JsonModule<T> = {
  default: T;
};

function createIntegrationException(
  code: IntegrationErrorCode,
  message: string,
  context?: IntegrationException['context'],
): IntegrationException {
  return Object.assign(new Error(message), { code, context });
}

function normalizeSetModulePath(modulePath: string): string {
  const marker = '/data/';
  const markerIndex = modulePath.lastIndexOf(marker);

  return markerIndex >= 0 ? modulePath.slice(markerIndex + marker.length) : modulePath;
}

const setModules = import.meta.glob('../../../data/sets/*.json', { eager: true }) as Record<string, JsonModule<SourceSetDetails>>;
const audioModules = import.meta.glob('../../../audio/**/*.mp3', { eager: true, import: 'default' }) as Record<string, string>;

const bundledSetList = bundledSetIndex as SourceSetList;
const setEntries = Object.entries(setModules).map(([modulePath, moduleValue]) => [normalizeSetModulePath(modulePath), moduleValue.default] as const);
const setDetailsBySourceFile = new Map<string, SourceSetDetails>(setEntries);
const validator = new StaticDataValidator(new Set(setDetailsBySourceFile.keys()));
const audioPathResolver = new StaticAudioPathResolver(audioModules);

export class StaticSetsDataSource implements SetsDataSource {
  async getSetSummaries(): Promise<SetSummary[]> {
    try {
      validateBundledSetList(bundledSetList, validator);

      return bundledSetList.map((setItem) => ({
        id: setItem.id,
        title: setItem.title,
        description: setItem.description,
        phraseCount: setItem.phraseCount,
        sourceFile: setItem.file,
      }));
    } catch (error) {
      throw this.wrapError(error, 'SET_LIST_LOAD_FAILED', 'Unable to load set summaries.');
    }
  }

  async getSetDetails(setId: SetId): Promise<SetDetails> {
    try {
      const setSummary = bundledSetList.find((item) => item.id === setId);

      if (!setSummary) {
        throw createIntegrationException('SET_NOT_FOUND', `Set not found: ${setId}`, { setId });
      }

      const sourceSet = setDetailsBySourceFile.get(setSummary.file);

      if (!sourceSet) {
        throw createIntegrationException('SET_DETAILS_LOAD_FAILED', `Bundled set details missing for ${setSummary.file}`, {
          setId,
          sourcePath: setSummary.file,
        });
      }

      validator.validateSetDetails(sourceSet, setId);

      return {
        id: sourceSet.id,
        title: sourceSet.title,
        description: sourceSet.description,
        phrases: sourceSet.phrases.map((phrase) => ({
          id: phrase.id,
          setId: sourceSet.id,
          text: phrase.text,
          translatedText: phrase.ru,
          audioSrc: audioPathResolver.resolveAudioSrc(phrase.audio),
        })),
      };
    } catch (error) {
      throw this.wrapError(error, 'SET_DETAILS_LOAD_FAILED', `Unable to load set details for ${setId}.`, { setId });
    }
  }

  private wrapError(
    error: unknown,
    fallbackCode: IntegrationErrorCode,
    fallbackMessage: string,
    context?: IntegrationException['context'],
  ): IntegrationException {
    if (this.isIntegrationException(error)) {
      return error;
    }

    return createIntegrationException(fallbackCode, fallbackMessage, context);
  }

  private isIntegrationException(error: unknown): error is IntegrationException {
    return error instanceof Error && 'code' in error;
  }
}

export const staticSetsDataSource = new StaticSetsDataSource();
