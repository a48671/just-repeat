import type { NativeLanguage } from '../../domain/app-settings';

export type HintKey =
  | 'home.practice'
  | 'sets.open'
  | 'sets.profile'
  | 'sets.settings'
  | 'settings.back'
  | 'settings.apply'
  | 'settings.language'
  | 'profile.back'
  | 'profile.edit'
  | 'profile.logout'
  | 'profile.signIn'
  | 'profile.signUp'
  | 'profile.submit'
  | 'bottom.back'
  | 'bottom.favorites'
  | 'bottom.playAll'
  | 'bottom.restart'
  | 'phrase.favorite'
  | 'phrase.play'
  | 'set.open'
  | 'generic.gotIt';

type HintTexts = Record<HintKey, string>;

const RUSSIAN_HINTS: HintTexts = {
  'home.practice': 'Начните с практики — нажмите, чтобы открыть список упражнений.',
  'sets.open': 'Выберите набор, чтобы прослушивать фразы и отрабатывать произношение.',
  'sets.profile': 'Перейдите в профиль, чтобы управлять учётной записью и прогрессом.',
  'sets.settings': 'Откройте настройки, чтобы выбрать родной язык.',
  'settings.back': 'Вернуться к списку наборов без сохранения изменений.',
  'settings.apply': 'Сохраните выбранный язык, чтобы перевод фраз отображался на нём.',
  'settings.language': 'Выберите свой родной язык, и приложение адаптирует тексты.',
  'profile.back': 'Вернуться к списку наборов.',
  'profile.edit': 'Данные профиля можно изменить после входа в систему.',
  'profile.logout': 'Выйти из аккаунта и удалить локальные данные пользователя.',
  'profile.signIn': 'Войдите, чтобы сохранить прогресс и избранные фразы.',
  'profile.signUp': 'Создайте аккаунт, чтобы синхронизировать прогресс на всех устройствах.',
  'profile.submit': 'Отправьте данные, чтобы войти в свой аккаунт.',
  'bottom.back': 'Вернуться к списку наборов.',
  'bottom.favorites': 'Показать или скрыть только избранные фразы.',
  'bottom.playAll': 'Воспроизвести все доступные фразы подряд.',
  'bottom.restart': 'Перезапустить текущий набор с начала.',
  'phrase.favorite': 'Добавьте фразу в избранное, чтобы быстрее её найти.',
  'phrase.play': 'Воспроизведите аудио фразы, чтобы потренировать произношение.',
  'set.open': 'Откройте набор, чтобы увидеть фразы и элементы управления аудио.',
  'generic.gotIt': 'Понятно',
};

const SPANISH_HINTS: HintTexts = {
  'home.practice': 'Empieza con la práctica: toca para abrir la lista de ejercicios.',
  'sets.open': 'Elige un conjunto para escuchar frases y practicar la pronunciación.',
  'sets.profile': 'Ve al perfil para gestionar tu cuenta y tu progreso.',
  'sets.settings': 'Abre la configuración para elegir tu idioma nativo.',
  'settings.back': 'Volver a la lista de conjuntos sin guardar los cambios.',
  'settings.apply': 'Guarda el idioma seleccionado para que la traducción de las frases esté en ese idioma.',
  'settings.language': 'Elige tu idioma nativo y la aplicación adaptará los textos.',
  'profile.back': 'Volver a la lista de conjuntos.',
  'profile.edit': 'Puedes cambiar los datos del perfil después de iniciar sesión.',
  'profile.logout': 'Cerrar sesión y eliminar los datos locales del usuario.',
  'profile.signIn': 'Inicia sesión para guardar tu progreso y tus frases favoritas.',
  'profile.signUp': 'Crea una cuenta para sincronizar tu progreso en todos tus dispositivos.',
  'profile.submit': 'Envía los datos para iniciar sesión en tu cuenta.',
  'bottom.back': 'Volver a la lista de conjuntos.',
  'bottom.favorites': 'Mostrar u ocultar solo las frases favoritas.',
  'bottom.playAll': 'Reproducir todas las frases disponibles una tras otra.',
  'bottom.restart': 'Reiniciar el conjunto actual desde el principio.',
  'phrase.favorite': 'Añade la frase a favoritos para encontrarla más rápido.',
  'phrase.play': 'Reproduce el audio de la frase para practicar la pronunciación.',
  'set.open': 'Abre el conjunto para ver las frases y los controles de audio.',
  'generic.gotIt': 'Entendido',
};

const GERMAN_HINTS: HintTexts = {
  'home.practice': 'Beginne mit der Übung – tippe, um die Liste der Übungen zu öffnen.',
  'sets.open': 'Wähle ein Set aus, um Sätze anzuhören und die Aussprache zu üben.',
  'sets.profile': 'Gehe zum Profil, um dein Konto und deinen Fortschritt zu verwalten.',
  'sets.settings': 'Öffne die Einstellungen, um deine Muttersprache auszuwählen.',
  'settings.back': 'Zurück zur Liste der Sets, ohne Änderungen zu speichern.',
  'settings.apply': 'Speichere die ausgewählte Sprache, damit die Übersetzung der Sätze in dieser Sprache angezeigt wird.',
  'settings.language': 'Wähle deine Muttersprache aus, und die App passt die Texte an.',
  'profile.back': 'Zurück zur Liste der Sets.',
  'profile.edit': 'Du kannst die Profildaten nach der Anmeldung ändern.',
  'profile.logout': 'Melde dich vom Konto ab und lösche die lokalen Benutzerdaten.',
  'profile.signIn': 'Melde dich an, um deinen Fortschritt und deine Lieblingssätze zu speichern.',
  'profile.signUp': 'Erstelle ein Konto, um deinen Fortschritt auf allen Geräten zu synchronisieren.',
  'profile.submit': 'Sende die Daten ab, um dich bei deinem Konto anzumelden.',
  'bottom.back': 'Zurück zur Liste der Sets.',
  'bottom.favorites': 'Nur Lieblingssätze anzeigen oder ausblenden.',
  'bottom.playAll': 'Alle verfügbaren Sätze nacheinander abspielen.',
  'bottom.restart': 'Das aktuelle Set von Anfang an neu starten.',
  'phrase.favorite': 'Füge den Satz zu den Favoriten hinzu, um ihn schneller zu finden.',
  'phrase.play': 'Spiele das Audio des Satzes ab, um die Aussprache zu üben.',
  'set.open': 'Öffne das Set, um die Sätze und die Audiosteuerung zu sehen.',
  'generic.gotIt': 'Verstanden',
};

const HINT_TRANSLATIONS: Record<NativeLanguage, HintTexts> = {
  Russian: RUSSIAN_HINTS,
  Spanish: SPANISH_HINTS,
  German: GERMAN_HINTS,
};

export function getHintText(language: NativeLanguage, hintKey: HintKey): string {
  return HINT_TRANSLATIONS[language][hintKey] ?? HINT_TRANSLATIONS.Russian[hintKey];
}
