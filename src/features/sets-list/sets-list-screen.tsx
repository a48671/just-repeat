import type { SetId, SetSummary } from '../../domain/entities';
import { EmptyState } from '../../shared/ui/empty-state';
import { SetCard } from '../../shared/ui/set-card';

type SetsListScreenProps = {
  setSummaries: SetSummary[];
  isLoading: boolean;
  errorMessage: string | null;
  onOpenSet: (setId: SetId) => void;
  lastInteractionBySetId: Record<string, string | null>;
};

export function SetsListScreen({ setSummaries, isLoading, errorMessage, onOpenSet, lastInteractionBySetId }: SetsListScreenProps) {
  let content = null;

  if (isLoading) {
    content = <EmptyState title="Loading sets" description="The app is resolving the bundled phrase sets." />;
  } else if (errorMessage) {
    content = <EmptyState title="Unable to load sets" description={errorMessage} />;
  } else if (setSummaries.length === 0) {
    content = <EmptyState title="No sets available" description="Add set definitions to the local data source to populate this screen." />;
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
          <h1 className="screen-title">Practice Sets</h1>
          <p className="screen-subtitle">Choose a set to review your English phrases.</p>
        </header>

        {content}
      </div>
    </section>
  );
}
