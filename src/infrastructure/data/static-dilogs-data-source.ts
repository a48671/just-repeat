import bundledDilogIndex from '../../../data/dilogs.json';
import type { SetSummary } from '../../domain/entities';
import type { SourceSetDetails, SourceSetList } from '../../domain/source-types';
import { loadAppSettings } from '../persistence/local-app-settings-storage';
import { StaticDataValidator, validateBundledSetList } from './static-data-validator';
import { getLocalizedSourceContent } from './source-content-localization';

type JsonModule<T> = {
  default: T;
};

function normalizeSetModulePath(modulePath: string): string {
  const marker = '/data/';
  const markerIndex = modulePath.lastIndexOf(marker);

  return markerIndex >= 0 ? modulePath.slice(markerIndex + marker.length) : modulePath;
}

const setModules = import.meta.glob('../../../data/sets/*.json', { eager: true }) as Record<string, JsonModule<SourceSetDetails>>;
const setFiles = new Set(Object.keys(setModules).map(normalizeSetModulePath));
const bundledDilogList = bundledDilogIndex as SourceSetList;
const validator = new StaticDataValidator(setFiles);

export class StaticDilogsDataSource {
  async getDilogSummaries(): Promise<SetSummary[]> {
    validateBundledSetList(bundledDilogList, validator);
    const { nativeLanguage } = loadAppSettings();

    return bundledDilogList.map((dilogItem) => {
      const localizedContent = getLocalizedSourceContent(dilogItem, nativeLanguage);

      return {
        id: dilogItem.id,
        title: localizedContent.title,
        description: localizedContent.description,
        phraseCount: dilogItem.phraseCount,
        sourceFile: dilogItem.file,
      };
    });
  }
}

export const staticDilogsDataSource = new StaticDilogsDataSource();
