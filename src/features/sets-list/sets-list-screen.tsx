import type { NativeLanguage } from '../../domain/app-settings';
import type { SetId, SetSummary } from '../../domain/entities';
import { loadAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { EmptyState } from '../../shared/ui/empty-state';
import { SetCard } from '../../shared/ui/set-card';
import { SetsUtilityPanel } from '../../shared/ui/sets-utility-panel';

type SetsListScreenProps = {
  setSummaries: SetSummary[];
  isLoading: boolean;
  errorMessage: string | null;
  onOpenSet: (setId: SetId) => void;
  onOpenHome?: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  lastInteractionBySetId: Record<string, string | null>;
};

const SETS_SCREEN_COPY: Record<NativeLanguage, {
  title: string;
  subtitle: string;
  loadingTitle: string;
  loadingDescription: string;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
}> = {
  Russian: {
    title: 'Наборы фраз',
    subtitle: 'Выбери набор, чтобы повторять английские фразы, слушать аудио и тренировать произношение.',
    loadingTitle: 'Загружаем наборы',
    loadingDescription: 'Приложение подготавливает встроенные наборы фраз.',
    errorTitle: 'Не удалось загрузить наборы',
    emptyTitle: 'Наборы пока недоступны',
    emptyDescription: 'Добавь описания наборов в локальный источник данных, чтобы они появились на этой странице.',
  },
  Spanish: {
    title: 'Conjuntos de frases',
    subtitle: 'Elige un conjunto para repetir frases en inglés, escuchar audio y practicar la pronunciación.',
    loadingTitle: 'Cargando conjuntos',
    loadingDescription: 'La aplicación está preparando los conjuntos de frases incluidos.',
    errorTitle: 'No se pudieron cargar los conjuntos',
    emptyTitle: 'No hay conjuntos disponibles',
    emptyDescription: 'Añade definiciones de conjuntos a la fuente de datos local para mostrarlos en esta pantalla.',
  },
  German: {
    title: 'Phrasensets',
    subtitle: 'Wähle ein Set aus, um englische Sätze zu wiederholen, Audio zu hören und die Aussprache zu üben.',
    loadingTitle: 'Sets werden geladen',
    loadingDescription: 'Die App bereitet die eingebauten Phrasensets vor.',
    errorTitle: 'Sets konnten nicht geladen werden',
    emptyTitle: 'Keine Sets verfügbar',
    emptyDescription: 'Füge Set-Definitionen zur lokalen Datenquelle hinzu, damit sie auf dieser Seite erscheinen.',
  },
};

export function SetsListScreen({ setSummaries, isLoading, errorMessage, onOpenSet, onOpenHome, onOpenProfile, onOpenSettings, lastInteractionBySetId }: SetsListScreenProps) {
  const { nativeLanguage } = loadAppSettings();
  const copy = SETS_SCREEN_COPY[nativeLanguage];
  let content = null;

  if (isLoading) {
    content = <EmptyState title={copy.loadingTitle} description={copy.loadingDescription} />;
  } else if (errorMessage) {
    content = <EmptyState title={copy.errorTitle} description={errorMessage} />;
  } else if (setSummaries.length === 0) {
    content = <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />;
  } else {
    content = (
      <div className="stack" role="list">
        {setSummaries.map((setCard) => (
          <div key={setCard.id} role="listitem">
            <SetCard
              description={setCard.description}
              lastInteraction={lastInteractionBySetId[setCard.id] ?? undefined}
              onOpen={() => onOpenSet(setCard.id)}
              phraseCount={setCard.phraseCount}
              title={setCard.title}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="sets-screen" aria-label="Practice sets screen">
      <div className="screen-content">
        <header className="screen-header">
          <h1 className="screen-title">{copy.title}</h1>
          <p className="screen-subtitle">{copy.subtitle}</p>
        </header>

        {content}
      </div>

      <SetsUtilityPanel onHomeClick={onOpenHome} onProfileClick={onOpenProfile} onSettingsClick={onOpenSettings} />
    </section>
  );
}
