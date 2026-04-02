import type { SetDetails } from '../../domain/entities';
import type { PersistedSetUserState } from '../../domain/user-state';
import { useSetDetailsController } from './use-set-details-controller';
import { BottomControlPanel } from '../../shared/ui/bottom-control-panel';
import { EmptyState } from '../../shared/ui/empty-state';
import { InlineMessage } from '../../shared/ui/inline-message';
import { PhraseCard } from '../../shared/ui/phrase-card';

type SetDetailsScreenProps = {
  setDetails: SetDetails | null;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  persistedState: PersistedSetUserState | null;
  onManualPlayCompleted: (phraseId: string) => void;
  onManualPlayStarted: () => void;
  onPlayAllStarted: () => void;
  onToggleFavorite: (phraseId: string) => void;
};

export function SetDetailsScreen({
  setDetails,
  isLoading,
  errorMessage,
  onBack,
  persistedState,
  onManualPlayCompleted,
  onManualPlayStarted,
  onPlayAllStarted,
  onToggleFavorite,
}: SetDetailsScreenProps) {
  const {
    favoritePhraseIdSet,
    favoritesFilterDisabled,
    favoritesOnly,
    getVisualState,
    handleManualPlay,
    handleRestart,
    handleToggleFavorites,
    handleTogglePlayAll,
    listContainerRef,
    playbackErrorMessage,
    playbackProgressByPhraseId,
    playbackStateByPhraseId,
    playAllLabel,
    phraseElementMapRef,
    playAllActive,
    playableVisiblePhraseCount,
    progress,
    progressLabel,
    visiblePhrases,
  } = useSetDetailsController({
    onManualPlayCompleted,
    onManualPlayStarted,
    onPlayAllStarted,
    persistedState,
    setDetails,
  });

  if (isLoading) {
    return (
      <section className="details-screen" aria-label="Set details loading screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="Loading phrases" description="The app is resolving phrases and audio asset URLs for this set." />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="details-screen" aria-label="Set details error screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="Unable to load set" description={errorMessage} />
        </div>
      </section>
    );
  }

  if (!setDetails) {
    return (
      <section className="details-screen" aria-label="No set selected screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="No set selected" description="Choose a set to open its phrase list and playback controls." />
        </div>
      </section>
    );
  }

  return (
    <section className="details-screen" aria-label={`Set details for ${setDetails.title}`}>
      <div className="screen-content screen-content-detail">
        <header className="detail-screen-header">
          <h1 className="detail-screen-title">{setDetails.title}</h1>
          <p className="detail-screen-subtitle">{setDetails.description}</p>
          <div className="detail-screen-meta">
            <span>{setDetails.phrases.length} phrases</span>
            <span>{setDetails.phrases.filter((phrase) => phrase.audioSrc !== null).length} with audio</span>
            <span>{favoritePhraseIdSet.size} favorites</span>
            {favoritesOnly ? <span>Favorites only</span> : null}
          </div>
        </header>

        {playbackErrorMessage ? <InlineMessage message={playbackErrorMessage} tone="error" /> : null}

        {setDetails.phrases.length === 0 ? (
          <EmptyState title="No phrases in this set" description="This set exists, but it does not contain any phrases yet." />
        ) : favoritesOnly && visiblePhrases.length === 0 ? (
          <EmptyState title="No favorite phrases" description="Mark a phrase as favorite to populate this filtered view." />
        ) : (
          <div className="phrase-list-region" ref={listContainerRef}>
            <div className="stack stack-tight" role="list">
              {visiblePhrases.map((phrase) => {
                const isFavorite = favoritePhraseIdSet.has(phrase.id);
                const playbackState = playbackStateByPhraseId[phrase.id];
                const visualState = getVisualState(phrase.id, playbackState);
                const audioSrc = phrase.audioSrc;

                return (
                  <div
                    aria-label={`${phrase.text}. State: ${visualState}.`}
                    key={phrase.id}
                    ref={(element) => {
                      phraseElementMapRef.current[phrase.id] = element;
                    }}
                    role="listitem"
                  >
                    <PhraseCard
                      favorite={isFavorite}
                      favoriteDisabled={playAllActive}
                      imageSrc={phrase.imageSrc}
                      onPlay={audioSrc ? () => handleManualPlay(phrase.id, audioSrc) : undefined}
                      onToggleFavorite={() => onToggleFavorite(phrase.id)}
                      playDisabled={playAllActive || visualState === 'loading' || visualState === 'playing' || !audioSrc}
                      playbackProgress={playbackProgressByPhraseId[phrase.id]}
                      state={visualState}
                      text={phrase.text}
                      translatedText={phrase.translatedText}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomControlPanel
        favoritesDisabled={favoritesFilterDisabled || playAllActive}
        favoritesEnabled={favoritesOnly}
        onBack={onBack}
        onToggleFavorites={handleToggleFavorites}
        onTogglePlayAll={handleTogglePlayAll}
        onRestart={handleRestart}
        playAllActive={playAllActive}
        playAllDisabled={playableVisiblePhraseCount === 0}
        playAllLabel={playAllLabel}
        progress={progress}
        progressLabel={progressLabel}
        restartDisabled={playableVisiblePhraseCount === 0}
      />
    </section>
  );
}
