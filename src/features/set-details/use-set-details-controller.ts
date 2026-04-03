import { useEffect, useMemo, useRef, useState } from 'react';
import type { PhrasePlaybackVisualState, SetDetails } from '../../domain/entities';
import type { PersistedSetUserState } from '../../domain/user-state';
import { usePlaybackService } from './use-playback-service';

type UseSetDetailsControllerParams = {
  setDetails: SetDetails | null;
  persistedState: PersistedSetUserState | null;
  onManualPlayCompleted: (phraseId: string) => void;
  onManualPlayStarted: () => void;
  onPlayAllStarted: () => void;
};

const SCROLL_VISIBILITY_GAP = 12;

function getBottomControlPanelHeight() {
  const panel = document.querySelector<HTMLElement>('.bottom-control-panel');
  return panel?.getBoundingClientRect().height ?? 0;
}

function isScrollable(element: HTMLDivElement) {
  const styles = window.getComputedStyle(element);
  return (styles.overflowY === 'auto' || styles.overflowY === 'scroll') && element.scrollHeight > element.clientHeight;
}

function getVisibleBounds(container: HTMLDivElement | null) {
  const panelHeight = getBottomControlPanelHeight();
  const viewportTop = SCROLL_VISIBILITY_GAP;
  const viewportBottom = window.innerHeight - panelHeight - SCROLL_VISIBILITY_GAP;

  if (!container || !isScrollable(container)) {
    return {
      top: viewportTop,
      bottom: viewportBottom,
      target: 'window' as const,
    };
  }

  const containerRect = container.getBoundingClientRect();

  return {
    top: Math.max(containerRect.top, viewportTop),
    bottom: Math.min(containerRect.bottom, viewportBottom),
    target: 'container' as const,
  };
}

function isNodeVisibleWithinView(container: HTMLDivElement | null, node: HTMLDivElement) {
  const nodeRect = node.getBoundingClientRect();
  const visibleBounds = getVisibleBounds(container);

  return nodeRect.top >= visibleBounds.top && nodeRect.bottom <= visibleBounds.bottom;
}

function scrollNodeIntoView(container: HTMLDivElement | null, node: HTMLDivElement, behavior: ScrollBehavior) {
  const nodeRect = node.getBoundingClientRect();
  const visibleBounds = getVisibleBounds(container);

  if (nodeRect.top >= visibleBounds.top && nodeRect.bottom <= visibleBounds.bottom) {
    return;
  }

  let offset = 0;

  if (nodeRect.top < visibleBounds.top) {
    offset = nodeRect.top - visibleBounds.top - SCROLL_VISIBILITY_GAP;
  } else if (nodeRect.bottom > visibleBounds.bottom) {
    offset = nodeRect.bottom - visibleBounds.bottom + SCROLL_VISIBILITY_GAP;
  }

  if (offset === 0) {
    return;
  }

  if (visibleBounds.target === 'container' && container) {
    container.scrollBy({ top: offset, behavior });
    return;
  }

  window.scrollBy({ top: offset, behavior });
}

function hasAudioSrc(phrase: SetDetails['phrases'][number]): phrase is SetDetails['phrases'][number] & { audioSrc: string } {
  return phrase.audioSrc !== null;
}

export function useSetDetailsController({
  setDetails,
  persistedState,
  onManualPlayCompleted,
  onManualPlayStarted,
  onPlayAllStarted,
}: UseSetDetailsControllerParams) {
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const phraseElementMapRef = useRef<Record<string, HTMLDivElement | null>>({});

  const phraseList = setDetails?.phrases ?? [];
  const favoritePhraseIds = persistedState?.favoritePhraseIds ?? [];
  const favoritePhraseIdSet = useMemo(() => new Set(favoritePhraseIds), [favoritePhraseIds]);
  const favoritesFilterDisabled = favoritePhraseIds.length === 0;
  const listMode = favoritesOnly ? 'favorites' : 'all';
  const visiblePhrases = useMemo(
    () => (favoritesOnly ? phraseList.filter((phrase) => favoritePhraseIdSet.has(phrase.id)) : phraseList),
    [favoritePhraseIdSet, favoritesOnly, phraseList],
  );
  const playableVisiblePhrases = useMemo(
    () => visiblePhrases.filter(hasAudioSrc),
    [visiblePhrases],
  );
  const playback = usePlaybackService({
    listMode,
    onManualPlayCompleted,
    onManualPlayStarted,
    onPlayAllStarted,
    scopeKey: setDetails?.id ?? null,
    visiblePhrases: playableVisiblePhrases,
  });
  const completedPhraseIdSet = useMemo(() => new Set(playback.completedPhraseIds), [playback.completedPhraseIds]);
  const progress = playback.queueProgress;
  const progressLabel = playback.queueProgressLabel;
  const progressCompleted = playback.queueCompletedCount;
  const progressTotal = playableVisiblePhrases.length;

  useEffect(() => {
    setFavoritesOnly(false);
  }, [setDetails?.id]);

  useEffect(() => {
    if (!setDetails || !persistedState?.lastActivePhraseId) {
      return;
    }

    const targetNode = phraseElementMapRef.current[persistedState.lastActivePhraseId];
    const container = listContainerRef.current;

    if (!targetNode || !container) {
      return;
    }

    if (!isNodeVisibleWithinView(container, targetNode)) {
      scrollNodeIntoView(container, targetNode, 'auto');
    }
  }, [persistedState?.lastActivePhraseId, setDetails]);

  useEffect(() => {
    if (!playback.playAllActive || !playback.activePhraseId) {
      return;
    }

    const targetNode = phraseElementMapRef.current[playback.activePhraseId];
    const container = listContainerRef.current;

    if (!targetNode || !container) {
      return;
    }

    if (!isNodeVisibleWithinView(container, targetNode)) {
      scrollNodeIntoView(container, targetNode, 'smooth');
    }
  }, [playback.activePhraseId, playback.playAllActive]);

  function handleToggleFavorites() {
    setFavoritesOnly((currentValue) => {
      const nextFavoritesOnly = !currentValue;

      if (playback.playAllActive) {
        playback.stopPlayback();
      }

      return nextFavoritesOnly;
    });
  }

  function getVisualState(phraseId: string, playbackState: PhrasePlaybackVisualState | undefined) {
    const isLastInteracted = persistedState?.lastActivePhraseId === phraseId;

    if (playbackState === 'loading' || playbackState === 'playing' || playbackState === 'error') {
      return playbackState;
    }

    if (isLastInteracted) {
      return 'active';
    }

    if (playbackState === 'completed' || completedPhraseIdSet.has(phraseId)) {
      return 'completed';
    }

    return 'idle';
  }

  return {
    favoritePhraseIdSet,
    favoritesFilterDisabled,
    favoritesOnly,
    getVisualState,
    handleManualPlay: playback.handleManualPlay,
    handleRestart: playback.handleRestart,
    handleToggleFavorites,
    handleTogglePlayAll: playback.handleTogglePlayAll,
    listContainerRef,
    playbackErrorMessage: playback.errorMessage,
    playbackProgressByPhraseId: playback.playbackProgressByPhraseId,
    playbackStateByPhraseId: playback.playbackStateByPhraseId,
    playAllLabel: playback.playAllLabel,
    phraseElementMapRef,
    playAllActive: playback.playAllActive,
    playableVisiblePhraseCount: playableVisiblePhrases.length,
    progress,
    progressCompleted,
    progressLabel,
    progressTotal,
    restartReady: progress >= 100 && playableVisiblePhrases.length > 0,
    visiblePhrases,
  };
}
