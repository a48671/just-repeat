export const NATIVE_LANGUAGE_OPTIONS = ['Russian', 'Spanish', 'German'] as const;

export type NativeLanguage = (typeof NATIVE_LANGUAGE_OPTIONS)[number];

export type AppSettings = {
  nativeLanguage: NativeLanguage;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  nativeLanguage: 'Russian',
};