import type { NativeLanguage } from '../../domain/app-settings';

type LocalizableSourceContent = {
  title: string;
  titleRu?: string;
  titleEs?: string;
  titleDe?: string;
  description: string;
  descriptionRu?: string;
  descriptionEs?: string;
  descriptionDe?: string;
};

const LANGUAGE_TO_FIELDS: Record<NativeLanguage, { title: keyof LocalizableSourceContent; description: keyof LocalizableSourceContent }> = {
  Russian: { title: 'titleRu', description: 'descriptionRu' },
  Spanish: { title: 'titleEs', description: 'descriptionEs' },
  German: { title: 'titleDe', description: 'descriptionDe' },
};

export function getLocalizedSourceContent(source: LocalizableSourceContent, nativeLanguage: NativeLanguage) {
  const fields = LANGUAGE_TO_FIELDS[nativeLanguage];
  const localizedTitle = source[fields.title];
  const localizedDescription = source[fields.description];

  return {
    title: typeof localizedTitle === 'string' && localizedTitle.length > 0 ? localizedTitle : source.title,
    description: typeof localizedDescription === 'string' && localizedDescription.length > 0 ? localizedDescription : source.description,
  };
}
