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
  phraseStatus: 'idle',
  completedCount: 0,
};

export function usePlaybackService({ scopeKey, visiblePhrases, listMode, onManualPlayCompleted, onManualPlayStarted, onPlayAllStarted }: PlaybackServiceParams) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activePhraseIdRef = useRef<PhraseId | null>(null);
  const activePlaybackSourceRef = useRef<'manual' | 'queue' | null>(null);
  const cleanupAudioListenersRef = useRef<(() => void) | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
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

  const allQueueCompleted = queueState.completedCount > 0 && queueState.completedCount >= visiblePhrases.length;
  const canContinuePlayAll = !queueState.isActive && !allQueueCompleted && playerState.errorMessage === null && queueState.completedCount > 0;

  const queueProgressLabel = visiblePhrases.length === 0
    ? 'No audio available'
    : playerState.errorMessage
      ? `Playback failed at phrase ${Math.max(activePhraseIndex + 1, 1)}`
      : allQueueCompleted
        ? 'Restart available'
        : queueState.isActive
          ? `${queueState.completedCount}/${visiblePhrases.length} in current list`
          : queueState.completedCount > 0
            ? `Queue paused at phrase ${queueState.completedCount + 1}`
            : `${queueState.completedCount}/${visiblePhrases.length} in current list`;

  const queueProgress = visiblePhrases.length === 0
    ? 0
    : (queueState.completedCount / visiblePhrases.length) * 100;

  useEffect(() => {
    return () => {
      releaseWakeLock();
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
    releaseWakeLock();
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
          phraseStatus: 'idle' as const,
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
        phraseStatus: 'idle' as const,
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
        phraseStatus: 'idle' as const,
      }));
      releaseWakeLock();
      return;
    }

    if (!queuePhrase) {
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
        phraseStatus: 'idle' as const,
      }));
      releaseWakeLock();
      return;
    }

    if (queueState.phraseStatus === 'loading' || queueState.phraseStatus === 'playing') {
      return;
    }

    if (queueState.phraseStatus === 'error') {
      setQueueState((currentQueue) => ({
        ...currentQueue,
        isActive: false,
      }));
      releaseWakeLock();
      return;
    }

    if (queueState.phraseStatus === 'completed') {
      const nextQueuePhraseId = visiblePhrases[queueCursorIndex + 1]?.id ?? null;

      if (queueCursorIndex >= 0 && nextQueuePhraseId) {
        setQueueState((currentQueue) => ({
          ...currentQueue,
          cursorPhraseId: nextQueuePhraseId,
          phraseStatus: 'idle' as const,
        }));
      } else {
        setQueueState((currentQueue) => ({
          ...currentQueue,
          isActive: false,
          cursorPhraseId: visiblePhrases[0]?.id ?? null,
          phraseStatus: 'idle' as const,
        }));
        releaseWakeLock();
      }
      return;
    }

    void playPhraseInternal(queuePhrase.id, queuePhrase.audioSrc, false);
  }, [queueState.phraseStatus, queueState.isActive, queueCursorIndex, queuePhrase, visiblePhrases]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && queueState.isActive) {
        void acquireWakeLock();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queueState.isActive]);

  async function acquireWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch {
      // Wake lock request failed (e.g. low battery)
    }
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  }

  async function playPhraseInternal(phraseId: PhraseId, audioSrc: string, trackManualPlay: boolean) {
    resetExistingAudio();

    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    activePhraseIdRef.current = phraseId;
    activePlaybackSourceRef.current = trackManualPlay ? 'manual' : 'queue';

    if (trackManualPlay) {
      onManualPlayStarted();

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
    } else {
      setPlayerState((currentState) => ({
        ...currentState,
        activePhraseId: phraseId,
        errorMessage: null,
      }));

      setQueueState((currentQueue) => ({
        ...currentQueue,
        cursorPhraseId: phraseId,
        phraseStatus: 'loading' as const,
      }));
    }

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

      if (activePlaybackSourceRef.current === 'manual') {
        const progress = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));

        setPlayerState((currentState) => ({
          ...currentState,
          playbackProgressByPhraseId: {
            ...currentState.playbackProgressByPhraseId,
            [phraseId]: progress,
          },
        }));
      }
    }

    function handlePlaying() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      if (activePlaybackSourceRef.current === 'manual') {
        setPlayerState((currentState) => ({
          ...currentState,
          activePhraseId: phraseId,
          errorMessage: null,
          playbackStateByPhraseId: {
            ...currentState.playbackStateByPhraseId,
            [phraseId]: 'playing',
          },
        }));
      } else {
        setQueueState((currentQueue) => ({
          ...currentQueue,
          phraseStatus: 'playing' as const,
        }));
      }
    }

    function handleEnded() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      const playbackSource = activePlaybackSourceRef.current;
      activePhraseIdRef.current = phraseId;
      activePlaybackSourceRef.current = null;

      if (playbackSource === 'manual') {
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

        onManualPlayCompleted(phraseId);
      } else {
        setPlayerState((currentState) => ({
          ...currentState,
          activePhraseId: phraseId,
        }));

        setQueueState((currentQueue) => ({
          ...currentQueue,
          phraseStatus: 'completed' as const,
          completedCount: currentQueue.completedCount + 1,
        }));
      }
    }

    function handleError() {
      if (activePhraseIdRef.current !== phraseId) {
        return;
      }

      if (activePlaybackSourceRef.current === 'manual') {
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
      } else {
        setPlayerState((currentState) => ({
          ...currentState,
          activePhraseId: phraseId,
          errorMessage: 'Audio could not be loaded or played. Try again.',
        }));

        setQueueState((currentQueue) => ({
          ...currentQueue,
          isActive: false,
          cursorPhraseId: phraseId,
          phraseStatus: 'error' as const,
        }));

        releaseWakeLock();
      }
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
        phraseStatus: 'idle' as const,
      }));
      releaseWakeLock();
      return;
    }

    setPlayerState((currentState) => ({
      ...currentState,
      errorMessage: null,
    }));

    onPlayAllStarted();
    void acquireWakeLock();

    setQueueState((currentQueue) => ({
      ...currentQueue,
      isActive: true,
      cursorPhraseId: currentQueue.cursorPhraseId ?? visiblePhrases[0]?.id ?? null,
      phraseStatus: 'idle' as const,
    }));
  }

  function handleRestart() {
    if (queueState.isActive || audioRef.current) {
      stopPlayback();
    }

    releaseWakeLock();

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
      phraseStatus: 'idle',
      completedCount: 0,
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
    const wasManual = activePlaybackSourceRef.current === 'manual';
    activePhraseIdRef.current = null;
    activePlaybackSourceRef.current = null;
    currentAudio.pause();
    currentAudio.src = '';
    audioRef.current = null;

    if (wasManual) {
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
    } else {
      setPlayerState((currentState) => ({
        ...currentState,
        activePhraseId: null,
      }));
    }
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
    queueCompletedCount: queueState.completedCount,
    queueCursorPhraseId,
    queueProgress,
    queueProgressLabel,
    stopPlayback,
  };
}
