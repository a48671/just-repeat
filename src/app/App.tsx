import { startTransition, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { SetDetails, SetId, SetSummary } from '../domain/entities';
import type { PersistedSetUserState } from '../domain/user-state';
import { HomeScreen } from '../features/home/home-screen';
import { SetDetailsScreen } from '../features/set-details/set-details-screen';
import { SetsListScreen } from '../features/sets-list/sets-list-screen';
import { staticSetsDataSource } from '../infrastructure/data/static-sets-data-source';
import {
  createDefaultPersistedSetUserState,
  loadPersistedSetUserStates,
  savePersistedSetUserStates,
} from '../infrastructure/persistence/local-user-state-storage';

function formatLastInteractionLabel(isoTimestamp: string | null): string | null {
  if (!isoTimestamp) {
    return null;
  }

  const timestamp = new Date(isoTimestamp).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  const elapsedMinutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));

  if (elapsedMinutes < 60) {
    return `Last interaction ${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `Last interaction ${elapsedHours} h ago`;
  }

  const elapsedDays = Math.round(elapsedHours / 24);
  return `Last interaction ${elapsedDays} d ago`;
}

export function App() {
  const navigate = useNavigate();
  const [setSummaries, setSetSummaries] = useState<SetSummary[]>([]);
  const [selectedSetDetails, setSelectedSetDetails] = useState<SetDetails | null>(null);
  const [isLoadingSets, setIsLoadingSets] = useState(true);
  const [isLoadingSetDetails, setIsLoadingSetDetails] = useState(false);
  const [setsError, setSetsError] = useState<string | null>(null);
  const [setDetailsError, setSetDetailsError] = useState<string | null>(null);
  const [persistedSetStates, setPersistedSetStates] = useState<Record<string, PersistedSetUserState>>(() => loadPersistedSetUserStates());
  const [selectedSetId, setSelectedSetId] = useState<SetId | null>(null);

  useEffect(() => {
    savePersistedSetUserStates(persistedSetStates);
  }, [persistedSetStates]);

  useEffect(() => {
    let isCancelled = false;

    async function loadSetSummaries() {
      setIsLoadingSets(true);
      setSetsError(null);

      try {
        const summaries = await staticSetsDataSource.getSetSummaries();

        if (!isCancelled) {
          setSetSummaries(summaries);
        }
      } catch (error) {
        if (!isCancelled) {
          setSetsError(error instanceof Error ? error.message : 'Unknown error while loading sets.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSets(false);
        }
      }
    }

    void loadSetSummaries();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSetId) {
      setSelectedSetDetails(null);
      setSetDetailsError(null);
      setIsLoadingSetDetails(false);
      return;
    }

    const setId = selectedSetId;

    let isCancelled = false;

    async function loadSetDetails() {
      setIsLoadingSetDetails(true);
      setSetDetailsError(null);

      try {
        const details = await staticSetsDataSource.getSetDetails(setId);

        if (!isCancelled) {
          setSelectedSetDetails(details);
        }
      } catch (error) {
        if (!isCancelled) {
          setSetDetailsError(error instanceof Error ? error.message : 'Unknown error while loading set details.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSetDetails(false);
        }
      }
    }

    void loadSetDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedSetId]);

  function handleOpenSet(setId: SetId) {
    startTransition(() => {
      setSelectedSetId(setId);
      setSetDetailsError(null);
      navigate(`/practice/${setId}`);
    });
  }

  function handleBackToSets() {
    startTransition(() => {
      navigate('/sets');
      setSelectedSetId(null);
      setSelectedSetDetails(null);
      setSetDetailsError(null);
      setIsLoadingSetDetails(false);
    });
  }

  function updatePersistedSetState(setId: SetId, updater: (currentState: PersistedSetUserState) => PersistedSetUserState) {
    setPersistedSetStates((currentStates) => {
      const currentSetState = currentStates[setId] ?? createDefaultPersistedSetUserState(setId);

      return {
        ...currentStates,
        [setId]: updater(currentSetState),
      };
    });
  }

  function handleManualPlayStarted() {
    if (!selectedSetId) {
      return;
    }

    updatePersistedSetState(selectedSetId, (currentState) => ({
      ...currentState,
      lastInteractedAt: new Date().toISOString(),
    }));
  }

  function handleManualPlayCompleted(phraseId: string) {
    if (!selectedSetId) {
      return;
    }

    updatePersistedSetState(selectedSetId, (currentState) => ({
      ...currentState,
      lastActivePhraseId: phraseId,
    }));
  }

  function handlePlayAllStarted() {
    if (!selectedSetId) {
      return;
    }

    updatePersistedSetState(selectedSetId, (currentState) => ({
      ...currentState,
      lastInteractedAt: new Date().toISOString(),
    }));
  }

  function handleToggleFavorite(phraseId: string) {
    if (!selectedSetId) {
      return;
    }

    updatePersistedSetState(selectedSetId, (currentState) => {
      const favoritePhraseIds = currentState.favoritePhraseIds.includes(phraseId)
        ? currentState.favoritePhraseIds.filter((currentPhraseId) => currentPhraseId !== phraseId)
        : [...currentState.favoritePhraseIds, phraseId];

      return {
        ...currentState,
        favoritePhraseIds,
        lastInteractedAt: new Date().toISOString(),
      };
    });
  }

  const lastInteractionBySetId = Object.fromEntries(
    setSummaries.map((summary) => [summary.id, formatLastInteractionLabel(persistedSetStates[summary.id]?.lastInteractedAt ?? null)]),
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="app-shell">
            <section className="app-stage" aria-label="Just Repeat home">
              <HomeScreen onPractice={() => navigate('/sets')} />
            </section>
          </main>
        }
      />
      <Route
        path="/sets"
        element={
          <main className="app-shell">
            <section className="app-stage" aria-label="Practice sets">
              <SetsListScreen
                errorMessage={setsError}
                isLoading={isLoadingSets}
                lastInteractionBySetId={lastInteractionBySetId}
                onOpenSet={handleOpenSet}
                setSummaries={setSummaries}
              />
            </section>
          </main>
        }
      />
      <Route
        path="/practice/:setId"
        element={
          <PracticeRouteSync
            onResolveSetId={setSelectedSetId}
            render={(routeSetId) => {
              const effectiveSetId = routeSetId ?? selectedSetId;
              const effectiveSetTitle = selectedSetDetails?.title ?? setSummaries.find((item) => item.id === effectiveSetId)?.title ?? null;
              const effectivePersistedState = effectiveSetId
                ? persistedSetStates[effectiveSetId] ?? createDefaultPersistedSetUserState(effectiveSetId)
                : null;

              return (
                <main className="app-shell">
                  <section className="app-stage" aria-label={`Set details for ${effectiveSetTitle ?? 'selected set'}`}>
                    <SetDetailsScreen
                      errorMessage={setDetailsError}
                      isLoading={isLoadingSetDetails}
                      onBack={handleBackToSets}
                      onManualPlayCompleted={handleManualPlayCompleted}
                      onManualPlayStarted={handleManualPlayStarted}
                      onPlayAllStarted={handlePlayAllStarted}
                      onToggleFavorite={handleToggleFavorite}
                      persistedState={effectivePersistedState}
                      setDetails={selectedSetDetails}
                    />
                  </section>
                </main>
              );
            }}
          />
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

type PracticeRouteSyncProps = {
  onResolveSetId: (setId: SetId | null) => void;
  render: (setId: SetId | null) => React.ReactNode;
};

function PracticeRouteSync({ onResolveSetId, render }: PracticeRouteSyncProps) {
  const { setId } = useParams<{ setId: string }>();

  useEffect(() => {
    onResolveSetId(setId ?? null);
  }, [onResolveSetId, setId]);

  return <>{render(setId ?? null)}</>;
}
