import type { NativeLanguage } from '../../domain/app-settings';
import type { SetId, SetSummary } from '../../domain/entities';
import { loadAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { EmptyState } from '../../shared/ui/empty-state';
import { SetCard } from '../../shared/ui/set-card';
import { SetsUtilityPanel } from '../../shared/ui/sets-utility-panel';

type DilogsListScreenProps = {
  dilogSummaries: SetSummary[];
  isLoading: boolean;
  errorMessage: string | null;
  onOpenDilog: (dilogId: SetId) => void;
  onOpenHome?: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  lastInteractionByDilogId: Record<string, string | null>;
};

const DILOGS_SCREEN_COPY: Record<NativeLanguage, {
  title: string;
  subtitle: string;
  loadingTitle: string;
  loadingDescription: string;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
}> = {
  Russian: {
    title: 'Диалоги',
    subtitle: 'Выбери диалог, чтобы слушать реплики по ролям и практиковать английский в контексте.',
    loadingTitle: 'Загружаем диалоги',
    loadingDescription: 'Приложение подготавливает встроенные диалоги.',
    errorTitle: 'Не удалось загрузить диалоги',
    emptyTitle: 'Диалоги пока недоступны',
    emptyDescription: 'Добавь описания диалогов в локальный источник данных, чтобы они появились на этой странице.',
  },
  Spanish: {
    title: 'Diálogos',
    subtitle: 'Elige un diálogo para escuchar líneas por roles y practicar inglés en contexto.',
    loadingTitle: 'Cargando diálogos',
    loadingDescription: 'La aplicación está preparando los diálogos incluidos.',
    errorTitle: 'No se pudieron cargar los diálogos',
    emptyTitle: 'No hay diálogos disponibles',
    emptyDescription: 'Añade definiciones de diálogos a la fuente de datos local para mostrarlos en esta pantalla.',
  },
  German: {
    title: 'Dialoge',
    subtitle: 'Wähle einen Dialog aus, um Rollen anzuhören und Englisch im Kontext zu üben.',
    loadingTitle: 'Dialoge werden geladen',
    loadingDescription: 'Die App bereitet die eingebauten Dialoge vor.',
    errorTitle: 'Dialoge konnten nicht geladen werden',
    emptyTitle: 'Keine Dialoge verfügbar',
    emptyDescription: 'Füge Dialog-Definitionen zur lokalen Datenquelle hinzu, damit sie auf dieser Seite erscheinen.',
  },
};

export function DilogsListScreen({
  dilogSummaries,
  isLoading,
  errorMessage,
  onOpenDilog,
  onOpenHome,
  onOpenProfile,
  onOpenSettings,
  lastInteractionByDilogId,
}: DilogsListScreenProps) {
  const { nativeLanguage } = loadAppSettings();
  const copy = DILOGS_SCREEN_COPY[nativeLanguage];
  let content = null;

  if (isLoading) {
    content = <EmptyState title={copy.loadingTitle} description={copy.loadingDescription} />;
  } else if (errorMessage) {
    content = <EmptyState title={copy.errorTitle} description={errorMessage} />;
  } else if (dilogSummaries.length === 0) {
    content = <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />;
  } else {
    content = (
      <div className="stack" role="list">
        {dilogSummaries.map((dilogCard) => (
          <div key={dilogCard.id} role="listitem">
            <SetCard
              description={dilogCard.description}
              lastInteraction={lastInteractionByDilogId[dilogCard.id] ?? undefined}
              onOpen={() => onOpenDilog(dilogCard.id)}
              phraseCount={dilogCard.phraseCount}
              title={dilogCard.title}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="sets-screen" aria-label="Practice dilogs screen">
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
