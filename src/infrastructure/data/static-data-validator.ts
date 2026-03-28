import type { DataValidator, IntegrationErrorCode } from '../../domain/contracts';
import type { SetId } from '../../domain/entities';
import type { SourcePhrase, SourceSetDetails, SourceSetList, SourceSetListItem } from '../../domain/source-types';

type IntegrationException = Error & {
  code: IntegrationErrorCode;
  context?: {
    setId?: string;
    phraseId?: string;
    sourcePath?: string;
  };
};

function createIntegrationException(
  code: IntegrationErrorCode,
  message: string,
  context?: IntegrationException['context'],
): IntegrationException {
  return Object.assign(new Error(message), { code, context });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export class StaticDataValidator implements DataValidator {
  constructor(private readonly knownSetFiles: Set<string>) {}

  validateSetList(source: unknown): void {
    if (!Array.isArray(source)) {
      throw createIntegrationException('INVALID_SET_SCHEMA', 'Set list source is not an array.');
    }

    const ids = new Set<string>();

    source.forEach((item, index) => {
      this.assertSetListItem(item, index);

      if (ids.has(item.id)) {
        throw createIntegrationException('INVALID_SET_SCHEMA', `Duplicate set id: ${item.id}`, {
          setId: item.id,
          sourcePath: item.file,
        });
      }

      if (!this.knownSetFiles.has(item.file)) {
        throw createIntegrationException('SET_LIST_LOAD_FAILED', `Set file missing from bundled data: ${item.file}`, {
          setId: item.id,
          sourcePath: item.file,
        });
      }

      ids.add(item.id);
    });
  }

  validateSetDetails(source: unknown, expectedSetId: SetId): void {
    if (!isRecord(source)) {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Set details for ${expectedSetId} are not an object.`, {
        setId: expectedSetId,
      });
    }

    const candidate = source as Partial<SourceSetDetails>;

    if (candidate.id !== expectedSetId) {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Set details id mismatch for ${expectedSetId}.`, {
        setId: expectedSetId,
      });
    }

    if (typeof candidate.title !== 'string' || typeof candidate.description !== 'string') {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Set details are missing title or description for ${expectedSetId}.`, {
        setId: expectedSetId,
      });
    }

    if (!Array.isArray(candidate.phrases)) {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Phrases collection is invalid for ${expectedSetId}.`, {
        setId: expectedSetId,
      });
    }

    const phraseIds = new Set<string>();

    candidate.phrases.forEach((phrase, index) => {
      this.assertPhrase(phrase, expectedSetId, index);

      if (phraseIds.has(phrase.id)) {
        throw createIntegrationException('INVALID_PHRASE_SCHEMA', `Duplicate phrase id: ${phrase.id}`, {
          setId: expectedSetId,
          phraseId: phrase.id,
        });
      }

      phraseIds.add(phrase.id);
    });
  }

  private assertSetListItem(item: unknown, index: number): asserts item is SourceSetListItem {
    if (!isRecord(item)) {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Set list item at index ${index} is not an object.`);
    }

    const { id, title, description, phraseCount, file } = item as Partial<SourceSetListItem>;

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof phraseCount !== 'number' ||
      typeof file !== 'string'
    ) {
      throw createIntegrationException('INVALID_SET_SCHEMA', `Set list item at index ${index} has invalid fields.`, {
        sourcePath: typeof file === 'string' ? file : undefined,
      });
    }
  }

  private assertPhrase(phrase: unknown, setId: SetId, index: number): asserts phrase is SourcePhrase {
    if (!isRecord(phrase)) {
      throw createIntegrationException('INVALID_PHRASE_SCHEMA', `Phrase at index ${index} is not an object.`, {
        setId,
      });
    }

    const { id, text, audio } = phrase as Partial<SourcePhrase>;

    if (typeof id !== 'string' || typeof text !== 'string' || typeof audio !== 'string') {
      throw createIntegrationException('INVALID_PHRASE_SCHEMA', `Phrase at index ${index} has invalid fields.`, {
        setId,
        phraseId: typeof id === 'string' ? id : undefined,
        sourcePath: typeof audio === 'string' ? audio : undefined,
      });
    }
  }
}

export function validateBundledSetList(source: SourceSetList, validator: DataValidator) {
  validator.validateSetList(source);
}
