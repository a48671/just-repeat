import { useEffect, useMemo, useRef, useState } from 'react';
import type { CurrentListMode, Phrase, PhraseId, PhrasePlaybackVisualState } from '../../domain/entities';
import type { PlayAllQueueState } from '../../domain/user-state';

type PlayablePhrase = Phrase & {
  audioSrc: string;
};

type PlaybackServiceParams = {
  scopeKey: string | null;
  visiblePhrases: PlayablePhrase[];
  listMode: CurrentListMode;
  onManualPlayCompleted: (phraseId: PhraseId) => void;
  onManualPlayStarted: () => void;
  onPlayAllStarted: () => void;
};

type PlayerState = {
  activePhraseId: PhraseId | null;
  completedPhraseIds: PhraseId[];
  errorMessage: string | null;
  playbackProgressByPhraseId: Record<string, number>;
  playbackStateByPhraseId: Record<string, PhrasePlaybackVisualState>;
};

const INITIAL_PLAYER_STATE: PlayerState = {
  activePhraseId: null,
  completedPhraseIds: [],
  errorMessage: null,
  playbackProgressByPhraseId: {},
  playbackStateByPhraseId: {},
};

const INITIAL_QUEUE_STATE: PlayAllQueueState = {
  isActive: false,
  cursorPhraseId: null,
  listMode: 'all',
};

export function usePlaybackService({ scopeKey, visiblePhrases, listMode, onManualPlayCompleted, onManualPlayStarted, onPlayAllStarted }: PlaybackServiceParams) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activePhraseIdRef = useRef<PhraseId | null>(null);
  const activePlaybackSourceRef = useRef<'manual' | 'queue' | null>(null);
  const cleanupAudioListenersRef = useRef<(() => void) | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [queueState, setQueueState] = useState<PlayAllQueueState>(INITIAL_QUEUE_STATE);

  const queueCursorPhraseId = queueState.cursorPhraseId ?? visiblePhrases[0]?.id ?? null;
  const queuePhrase = useMemo(
    () => visiblePhrases.find((phrase) => phrase.id === queueCursorPhraseId) ?? null,
    [queueCursorPhraseId, visiblePhrases],
  );
  const queueCursorIndex = queuePhrase ? visiblePhrases.findIndex((phrase) => phrase.id === queuePhrase.id) : -1;
  const activePhraseIndex = playerState.activePhraseId
    ? visiblePhrases.findIndex((phrase) => phrase.id === playerState.activePhraseId)
    : -1;
  const queueStatusText = visiblePhrases.length === 0
    ? 'Queue unavailable'
    : playerState.errorMessage
      ? `Playback failed at ${Math.max(activePhraseIndex + 1, 1)} / ${visiblePhrases.length}. Retry the phrase or restart.`
      : queueState.isActive
        ? `Queue running ${Math.max(queueCursorIndex + 1, 1)} / ${visiblePhrases.length}`
        : queuePhrase
          ? `Queue paused at ${Math.max(queueCursorIndex + 1, 1)} / ${visiblePhrases.length}`
          : `Queue ready 1 / ${visiblePhrases.length}`;
  const canContinuePlayAll = !queueState.isActive && playerState.errorMessage === null && queueCursorIndex > 0;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        cleanupAudioListenersRef.current?.();
        cleanupAudioListenersRef.current = null;
        activePhraseIdRef.current = null;
        activePlaybackSourceRef.current = null;
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    stopPlayback();
    activePhraseIdRef.current = null;
    setPlayerState(INITIAL_PLAYER_STATE);
    setQueueState(INITIAL_QUEUE_STATE);
  }, [scopeKey]);

  useEffect(() => {
    setQueueState((currentQueue) => {
      if (visiblePhrases.length === 0) {
        if (!currentQueue.isActive && currentQueue.cursorPhraseId === null && currentQueue.listMode === listMode) {
          return currentQueue;
        }

        return {
          ...currentQueue,
          isActive: false,
          cursorPhraseId: null,
          listMode,
        };
      }

      const firstVisiblePhraseId = visiblePhrases[0]?.id ?? null;

      if (!currentQueue.cursorPhraseId) {
        if (currentQueue.cursorPhraseId === firstVisiblePhraseId && currentQueue.listMode === listMode) {
          return currentQueue;
        }

        return {
          ...currentQueue,
          cursorPhraseId: firstVisiblePhraseId,
          listMode,
        };
      }

      const cursorExistsInCurrentList = visiblePhrases.some((phrase) => phrase.id === currentQueue.cursorPhraseId);

      if (cursorExistsInCurrentList) {
        if (currentQueue.listMode === listMode) {
          return currentQueue;
        }

        return {
          ...currentQueue,
          listMode,
        };
      }

      if (!currentQueue.isActive && currentQueue.cursorPhraseId === firstVisiblePhraseId && currentQueue.listMode === listMode) {
        return currentQueue;
      }

      return {
        ...currentQueue,
        isActive: false,
        cursorPhraseId: firstVisiblePhraseId,
        listMode,
      };
    });
  }, [listMode, visiblePhrases]);

  useEffect(() => {
    if (!queueState.isActive) {
      return;
    }

    if (visiblePhrases.length === 0) {
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
        cursorPhraseId: null,
      }));
      return;
    }

    if (!queuePhrase) {
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
      }));
      return;
    }

    const queuePhrasePlaybackState = playerState.playbackStateByPhraseId[queuePhrase.id];

    if (queuePhrasePlaybackState === 'loading' || queuePhrasePlaybackState === 'playing') {
      return;
    }

    if (queuePhrasePlaybackState === 'error') {
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
      }));
      return;
    }

    if (queuePhrasePlaybackState === 'completed') {
      const nextQueuePhraseId = visiblePhrases[queueCursorIndex + 1]?.id ?? null;

      if (queueCursorIndex >= 0 && nextQueuePhraseId) {
        setQueueState((currentQueue) => ({
          ...currentQueue,
          cursorPhraseId: nextQueuePhraseId,
        }));
      } else {
        setQueueState((currentQueue) => ({
          ...currentQueue,
          isActive: false,
          cursorPhraseId: visiblePhrases[0]?.id ?? null,
        }));
      }
      return;
    }

    void playPhraseInternal(queuePhrase.id, queuePhrase.audioSrc, false);
  }, [playerState.playbackStateByPhraseId, queueCursorIndex, queuePhrase, queueState.isActive, visiblePhrases]);

  async function playPhraseInternal(phraseId: PhraseId, audioSrc: string, trackManualPlay: boolean) {
    resetExistingAudio();

    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    activePhraseIdRef.current = phraseId;
    activePlaybackSourceRef.current = trackManualPlay ? 'manual' : 'queue';

    if (trackManualPlay) {
      onManualPlayStarted();
    }

    setPlayerState((currentState) => ({
      ...currentState,
      activePhraseId: phraseId,
      errorMessage: null,
      playbackProgressByPhraseId: {
        ...currentState.playbackProgressByPhraseId,
        [phraseId]: 0,
      },
      playbackStateByPhraseId: {
        ...currentState.playbackStateByPhraseId,
        [phraseId]: 'loading',
      },
    }));

    setQueueState((currentQueue) => ({
      ...currentQueue,
      cursorPhraseId: phraseId,
    }));

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    cleanupAudioListenersRef.current = () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };

    try {
      await audio.play();
    } catch {
      handleError();
    }

    function handleTimeUpdate() {
      if (!audio.duration || activePhraseIdRef.current !== phraseId) {
        return;
      }

      const progress = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));

      setPlayerState((currentState) => ({
        ...currentState,
        playbackProgressByPhraseId: {
          ...currentState.playbackProgressByPhraseId,
          [phraseId]: progress,
        },
      }));
    }

    function handlePlaying() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      setPlayerState((currentState) => ({
        ...currentState,
        activePhraseId: phraseId,
        errorMessage: null,
        playbackStateByPhraseId: {
          ...currentState.playbackStateByPhraseId,
          [phraseId]: 'playing',
        },
      }));
    }

    function handleEnded() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      const playbackSource = activePlaybackSourceRef.current;

      activePhraseIdRef.current = phraseId;
      activePlaybackSourceRef.current = null;

      setPlayerState((currentState) => ({
        ...currentState,
        activePhraseId: phraseId,
        completedPhraseIds: currentState.completedPhraseIds.includes(phraseId)
          ? currentState.completedPhraseIds
          : [...currentState.completedPhraseIds, phraseId],
        playbackProgressByPhraseId: {
          ...currentState.playbackProgressByPhraseId,
          [phraseId]: 100,
        },
        playbackStateByPhraseId: {
          ...currentState.playbackStateByPhraseId,
          [phraseId]: 'completed',
        },
      }));

      if (playbackSource === 'manual') {
        onManualPlayCompleted(phraseId);
      }
    }

    function handleError() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
        cursorPhraseId: phraseId,
      }));

      setPlayerState((currentState) => ({
        ...currentState,
        activePhraseId: phraseId,
        errorMessage: 'Audio could not be loaded or played. Try again.',
        playbackProgressByPhraseId: {
          ...currentState.playbackProgressByPhraseId,
          [phraseId]: 0,
        },
        playbackStateByPhraseId: {
          ...currentState.playbackStateByPhraseId,
          [phraseId]: 'error',
        },
      }));
    }
  }

  function handleManualPlay(phraseId: PhraseId, audioSrc: string) {
    if (queueState.isActive) {
      return;
    }

    void playPhraseInternal(phraseId, audioSrc, true);
  }

  function handleTogglePlayAll() {
    if (queueState.isActive) {
      stopPlayback();
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
      }));
      return;
    }

    setPlayerState((currentState) => ({
      ...currentState,
      errorMessage: null,
    }));

    onPlayAllStarted();
    setQueueState((currentQueue) => ({
      isActive: true,
      cursorPhraseId: currentQueue.cursorPhraseId ?? visiblePhrases[0]?.id ?? null,
      listMode,
    }));
  }

  function handleRestart() {
    if (queueState.isActive || audioRef.current) {
      stopPlayback();
    }

    setPlayerState({
      activePhraseId: null,
      completedPhraseIds: [],
      errorMessage: null,
      playbackProgressByPhraseId: {},
      playbackStateByPhraseId: {},
    });

    setQueueState({
      isActive: false,
      cursorPhraseId: visiblePhrases[0]?.id ?? null,
      listMode,
    });
  }

  function stopPlayback() {
    setPlayerState((currentState) => ({
      ...currentState,
      errorMessage: null,
    }));

    resetExistingAudio();
  }

  function resetExistingAudio() {
    const currentAudio = audioRef.current;
    const currentPhraseId = activePhraseIdRef.current;

    if (!currentAudio || !currentPhraseId) {
      return;
    }

    cleanupAudioListenersRef.current?.();
    cleanupAudioListenersRef.current = null;
    activePhraseIdRef.current = null;
    activePlaybackSourceRef.current = null;
    currentAudio.pause();
    currentAudio.src = '';
    audioRef.current = null;

    setPlayerState((currentState) => {
      const previousState = currentState.playbackStateByPhraseId[currentPhraseId];
      const nextVisualState: PhrasePlaybackVisualState = previousState === 'completed' ? 'completed' : 'idle';

      return {
        ...currentState,
        activePhraseId: null,
        playbackProgressByPhraseId: {
          ...currentState.playbackProgressByPhraseId,
          [currentPhraseId]: nextVisualState === 'completed' ? 100 : 0,
        },
        playbackStateByPhraseId: {
          ...currentState.playbackStateByPhraseId,
          [currentPhraseId]: nextVisualState,
        },
      };
    });
  }

  return {
    activePhraseId: playerState.activePhraseId,
    completedPhraseIds: playerState.completedPhraseIds,
    errorMessage: playerState.errorMessage,
    handleManualPlay,
    handleRestart,
    handleTogglePlayAll,
    playbackProgressByPhraseId: playerState.playbackProgressByPhraseId,
    playbackStateByPhraseId: playerState.playbackStateByPhraseId,
    playAllActive: queueState.isActive,
    playAllLabel: canContinuePlayAll ? 'Continue' : 'Play All',
    queueCursorPhraseId,
    queueStatusText,
    stopPlayback,
  };
}
