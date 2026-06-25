import { ArrowLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import femalePersonPhotoUrl from '../../assets/dilogs/person-female.png';
import argumentsMalePersonPhotoUrl from '../../assets/dilogs/person-male-arguments.png';
import malePersonPhotoUrl from '../../assets/dilogs/person-male.png';
import type { NativeLanguage } from '../../domain/app-settings';
import type { Phrase, SetDetails } from '../../domain/entities';
import type { PersistedSetUserState } from '../../domain/user-state';
import { loadAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { BottomControlPanel } from '../../shared/ui/bottom-control-panel';
import { Button } from '../../shared/ui/button';
import { EmptyState } from '../../shared/ui/empty-state';
import { InlineMessage } from '../../shared/ui/inline-message';
import { PhraseCard } from '../../shared/ui/phrase-card';
import { useSetDetailsController } from '../set-details/use-set-details-controller';

type DilogPracticeStage = 'listen' | 'speaker-one' | 'speaker-two' | 'practice';

type DilogPracticeScreenProps = {
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

type PlaybackState = 'idle' | 'loading' | 'playing' | 'error';

const STAGES: Array<{ id: DilogPracticeStage; label: string }> = [
  { id: 'listen', label: '1. Listen' },
  { id: 'speaker-one', label: '2. Speaker 1' },
  { id: 'speaker-two', label: '3. Speaker 2' },
  { id: 'practice', label: '4. Practice' },
];

const TWO_MALE_SPEAKER_SET_IDS = new Set(['arguments', 'error', 'memory_management', 'oop', 'soft_skills_part_1', 'soft_skills_part_2']);

const STAGE_PREVIEW_COPY: Record<NativeLanguage, { previewLabel: string; stages: Record<DilogPracticeStage, { title: string; description: string }> }> = {
  Russian: {
    previewLabel: 'Превью этапа',
    stages: {
      listen: {
        title: 'Сначала прослушай весь диалог',
        description: 'На этом этапе ты просто слушаешь реплики по порядку. Нажимай Start, затем Next, чтобы переходить к следующей фразе и сразу слышать её аудио.',
      },
      'speaker-one': {
        title: 'Теперь ты первый собеседник',
        description: 'В этом раунде твоя роль — первый собеседник. Слушай партнёра и произноси свои реплики вслух, когда видишь пометку Your line.',
      },
      'speaker-two': {
        title: 'Теперь ты второй собеседник',
        description: 'В этом раунде твоя роль — второй собеседник. Слушай первую реплику партнёра и отвечай вслух за второго участника диалога.',
      },
      practice: {
        title: 'Закрепи фразы отдельно',
        description: 'На последнем этапе ты практикуешь те же самые фразы из диалога, но в случайном порядке. Повторяй их как обычный набор и проверяй, насколько хорошо помнишь каждую реплику.',
      },
    },
  },
  Spanish: {
    previewLabel: 'Vista previa',
    stages: {
      listen: {
        title: 'Primero escucha todo el diálogo',
        description: 'En esta etapa solo escuchas las frases en orden. Pulsa Start y luego Next para pasar a la siguiente frase y escuchar su audio automáticamente.',
      },
      'speaker-one': {
        title: 'Ahora eres el primer hablante',
        description: 'En esta ronda tu papel es el primer hablante. Escucha a tu compañero y di tus líneas en voz alta cuando veas Your line.',
      },
      'speaker-two': {
        title: 'Ahora eres el segundo hablante',
        description: 'En esta ronda tu papel es el segundo hablante. Escucha la primera línea de tu compañero y responde en voz alta como el segundo participante.',
      },
      practice: {
        title: 'Practica las frases por separado',
        description: 'En la última etapa practicas las mismas frases del diálogo, pero en orden aleatorio. Repítelas como un set normal y comprueba qué tan bien recuerdas cada línea.',
      },
    },
  },
  German: {
    previewLabel: 'Vorschau',
    stages: {
      listen: {
        title: 'Höre zuerst den ganzen Dialog',
        description: 'In diesem Schritt hörst du die Sätze der Reihe nach. Tippe auf Start und dann auf Next, um zur nächsten Phrase zu gehen und sie automatisch abzuspielen.',
      },
      'speaker-one': {
        title: 'Jetzt bist du Sprecher 1',
        description: 'In dieser Runde übernimmst du die Rolle des ersten Sprechers. Höre deinem Partner zu und sprich deine Zeilen laut, wenn du Your line siehst.',
      },
      'speaker-two': {
        title: 'Jetzt bist du Sprecher 2',
        description: 'In dieser Runde übernimmst du die Rolle des zweiten Sprechers. Höre die erste Zeile des Partners und antworte laut als zweiter Dialogteilnehmer.',
      },
      practice: {
        title: 'Übe die Sätze einzeln',
        description: 'Im letzten Schritt übst du dieselben Sätze aus dem Dialog, aber in zufälliger Reihenfolge. Wiederhole sie wie ein normales Set und prüfe, wie gut du jede Zeile beherrschst.',
      },
    },
  },
};

function createPracticeDetails(setDetails: SetDetails): SetDetails {
  const shuffledPhrases = [...setDetails.phrases];

  for (let index = shuffledPhrases.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentPhrase = shuffledPhrases[index]!;
    shuffledPhrases[index] = shuffledPhrases[randomIndex]!;
    shuffledPhrases[randomIndex] = currentPhrase;
  }

  return {
    ...setDetails,
    title: `${setDetails.title}: Random Practice`,
    description: 'Practice the same dialogue phrases in random order.',
    phrases: shuffledPhrases,
  };
}

function getRoleLabel(stage: DilogPracticeStage, phraseIndex: number) {
  if (stage === 'listen') {
    return phraseIndex % 2 === 0 ? 'Speaker 1' : 'Speaker 2';
  }

  return isUserLine(stage, phraseIndex) ? 'Your line' : 'Partner line';
}

function isUserLine(stage: DilogPracticeStage, phraseIndex: number) {
  if (stage !== 'speaker-one' && stage !== 'speaker-two') {
    return false;
  }

  const userSpeakerIndex = stage === 'speaker-one' ? 0 : 1;
  return phraseIndex % 2 === userSpeakerIndex;
}

function getPersonPhotoUrl(person: Phrase['person'], setId: string | null, phraseIndex: number) {
  if (setId && TWO_MALE_SPEAKER_SET_IDS.has(setId) && phraseIndex % 2 === 0) {
    return argumentsMalePersonPhotoUrl;
  }

  return person === 'male' ? malePersonPhotoUrl : femalePersonPhotoUrl;
}

function getPreviewSpeakerOnePhotoUrl(setId: string) {
  return TWO_MALE_SPEAKER_SET_IDS.has(setId) ? argumentsMalePersonPhotoUrl : femalePersonPhotoUrl;
}

export function DilogPracticeScreen({
  setDetails,
  isLoading,
  errorMessage,
  onBack,
  persistedState,
  onManualPlayCompleted,
  onManualPlayStarted,
  onPlayAllStarted,
  onToggleFavorite,
}: DilogPracticeScreenProps) {
  const [stage, setStage] = useState<DilogPracticeStage>('listen');
  const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null);
  const [revealedPhraseId, setRevealedPhraseId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [playbackErrorMessage, setPlaybackErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const phraseList = setDetails?.phrases ?? [];
  const isPreviewVisible = activePhraseIndex === null;
  const effectivePhraseIndex = activePhraseIndex ?? 0;
  const activePhrase = activePhraseIndex === null ? null : phraseList[activePhraseIndex] ?? null;
  const { nativeLanguage } = loadAppSettings();
  const previewCopy = STAGE_PREVIEW_COPY[nativeLanguage];
  const stagePreviewCopy = previewCopy.stages[stage];
  const practiceDetails = useMemo(() => (setDetails ? createPracticeDetails(setDetails) : null), [setDetails]);
  const practiceController = useSetDetailsController({
    onManualPlayCompleted,
    onManualPlayStarted,
    onPlayAllStarted,
    persistedState,
    setDetails: practiceDetails,
  });

  useEffect(() => {
    setActivePhraseIndex(null);
    setRevealedPhraseId(null);
    setPlaybackState('idle');
    setPlaybackErrorMessage(null);
    audioRef.current?.pause();
    audioRef.current = null;
  }, [setDetails?.id, stage]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  if (isLoading) {
    return (
      <section className="details-screen dilog-practice-screen" aria-label="Dilog practice loading screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="Loading dilog" description="The app is resolving the bundled dialogue phrases." />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="details-screen dilog-practice-screen" aria-label="Dilog practice error screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="Unable to load dilog" description={errorMessage} />
        </div>
      </section>
    );
  }

  if (!setDetails) {
    return (
      <section className="details-screen dilog-practice-screen" aria-label="No dilog selected screen">
        <div className="screen-content screen-content-detail">
          <EmptyState title="No dilog selected" description="Choose a dilog to open its practice flow." />
        </div>
      </section>
    );
  }

  function handleStageChange(nextStage: DilogPracticeStage) {
    setStage(nextStage);
  }

  function handleRestart() {
    audioRef.current?.pause();
    audioRef.current = null;
    setActivePhraseIndex(null);
    setRevealedPhraseId(null);
    setPlaybackState('idle');
    setPlaybackErrorMessage(null);
  }

  function handleNext() {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaybackState('idle');
    setPlaybackErrorMessage(null);

    if (isPreviewVisible) {
      const firstPhrase = phraseList[0];
      setActivePhraseIndex(0);
      setRevealedPhraseId(null);
      if (stage !== 'practice' && firstPhrase && !isUserLine(stage, 0)) {
        playPhrase(firstPhrase);
      }
      return;
    }

    if (effectivePhraseIndex < phraseList.length - 1) {
      const nextPhraseIndex = effectivePhraseIndex + 1;
      const nextPhrase = phraseList[effectivePhraseIndex + 1];
      setActivePhraseIndex(nextPhraseIndex);
      setRevealedPhraseId(null);
      if (nextPhrase && !isUserLine(stage, nextPhraseIndex)) {
        playPhrase(nextPhrase);
      }
      return;
    }

    const currentStageIndex = STAGES.findIndex((item) => item.id === stage);
    const nextStage = STAGES[currentStageIndex + 1]?.id;

    if (nextStage) {
      setStage(nextStage);
    }
  }

  function handlePlay() {
    if (!activePhrase) {
      setPlaybackErrorMessage('Audio is not available for this phrase.');
      return;
    }

    playPhrase(activePhrase);
  }

  function playPhrase(phrase: Phrase) {
    if (!phrase.audioSrc) {
      setPlaybackErrorMessage('Audio is not available for this phrase.');
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(phrase.audioSrc);
    audioRef.current = audio;
    setPlaybackState('loading');
    setPlaybackErrorMessage(null);

    audio.addEventListener('canplay', () => {
      setPlaybackState('playing');
    });
    audio.addEventListener('ended', () => {
      setPlaybackState('idle');
      onManualPlayCompleted(phrase.id);
    });
    audio.addEventListener('error', () => {
      setPlaybackState('error');
      setPlaybackErrorMessage('Unable to play phrase audio.');
    });

    onManualPlayStarted();
    void audio.play().catch(() => {
      setPlaybackState('error');
      setPlaybackErrorMessage('Unable to play phrase audio.');
    });
  }

  const progressCompleted = isPreviewVisible ? 0 : Math.min(effectivePhraseIndex + 1, phraseList.length);
  const isLastPhrase = !isPreviewVisible && effectivePhraseIndex >= phraseList.length - 1;
  const nextLabel = isPreviewVisible ? 'Start' : isLastPhrase ? 'Next Stage' : 'Next';
  const roleLabel = getRoleLabel(stage, effectivePhraseIndex);
  const activePhraseIsUserLine = !isPreviewVisible && isUserLine(stage, effectivePhraseIndex);
  const shouldBlurActivePhraseText = activePhraseIsUserLine && activePhrase?.id !== revealedPhraseId;
  const phraseControlDisabled = playbackState === 'loading' || playbackState === 'playing' || !activePhrase?.audioSrc;
  const PhrasePlayIcon = playbackState === 'playing' ? Pause : Play;
  const progressLabel = `${STAGES.find((item) => item.id === stage)?.label} · ${isPreviewVisible ? 'Preview' : `${progressCompleted}/${phraseList.length}`}`;
  const practiceVisiblePhrases = practiceController.visiblePhrases;
  const practicePlaybackErrorMessage = stage === 'practice' && !isPreviewVisible ? practiceController.playbackErrorMessage : null;

  return (
    <section className="details-screen dilog-practice-screen" aria-label={`Dilog practice for ${setDetails.title}`}>
      <div className="screen-content screen-content-detail">
        <header className="detail-screen-header">
          <h1 className="detail-screen-title">{setDetails.title}</h1>
          <p className="detail-screen-subtitle">{setDetails.description}</p>
          <div className="dilog-stage-tabs" role="tablist" aria-label="Dilog practice stages">
            {STAGES.map((stageItem) => (
              <Button
                aria-selected={stage === stageItem.id}
                className={`dilog-stage-tab ${stage === stageItem.id ? 'dilog-stage-tab-active' : ''}`}
                key={stageItem.id}
                onClick={() => handleStageChange(stageItem.id)}
                role="tab"
                variant="secondary"
              >
                {stageItem.label}
              </Button>
            ))}
          </div>
        </header>

        {playbackErrorMessage ? <InlineMessage message={playbackErrorMessage} tone="error" /> : null}
        {practicePlaybackErrorMessage ? <InlineMessage message={practicePlaybackErrorMessage} tone="error" /> : null}

        {isPreviewVisible ? (
          <div className="dilog-preview-card">
            <div className="dilog-preview-photos" aria-hidden="true">
              <img alt="" className="dilog-preview-photo dilog-preview-photo-front" src={getPreviewSpeakerOnePhotoUrl(setDetails.id)} />
              <img alt="" className="dilog-preview-photo dilog-preview-photo-back" src={malePersonPhotoUrl} />
            </div>
            <div className="dilog-preview-copy">
              <span className="dilog-phrase-kicker">{previewCopy.previewLabel}</span>
              <h2 className="dilog-preview-title">{stagePreviewCopy.title}</h2>
              <p className="dilog-preview-description">{stagePreviewCopy.description}</p>
              <p className="dilog-preview-meta">
                {setDetails.title} · {phraseList.length} phrases · 2 speakers
              </p>
            </div>
          </div>
        ) : stage === 'practice' ? (
          practiceDetails?.phrases.length === 0 ? (
            <EmptyState title="No phrases in this dilog" description="This dilog exists, but it does not contain any phrases yet." />
          ) : practiceController.favoritesOnly && practiceVisiblePhrases.length === 0 ? (
            <EmptyState title="No favorite phrases" description="Mark a phrase as favorite to populate this filtered view." />
          ) : (
            <div className="phrase-list-region" ref={practiceController.listContainerRef}>
              <div className="stack stack-tight" role="list">
                {practiceVisiblePhrases.map((phrase) => {
                  const isFavorite = practiceController.favoritePhraseIdSet.has(phrase.id);
                  const playbackStateForPhrase = practiceController.playbackStateByPhraseId[phrase.id];
                  const visualState = practiceController.getVisualState(phrase.id, playbackStateForPhrase);
                  const audioSrc = phrase.audioSrc;

                  return (
                    <div
                      aria-label={`${phrase.text}. State: ${visualState}.`}
                      key={phrase.id}
                      ref={(element) => {
                        practiceController.phraseElementMapRef.current[phrase.id] = element;
                      }}
                      role="listitem"
                    >
                      <PhraseCard
                        favorite={isFavorite}
                        favoriteDisabled={practiceController.playAllActive}
                        imageSrc={phrase.imageSrc}
                        onPlay={audioSrc ? () => practiceController.handleManualPlay(phrase.id, audioSrc) : undefined}
                        onToggleFavorite={() => onToggleFavorite(phrase.id)}
                        playDisabled={practiceController.playAllActive || visualState === 'loading' || visualState === 'playing' || !audioSrc}
                        playbackProgress={practiceController.playbackProgressByPhraseId[phrase.id]}
                        state={visualState}
                        text={phrase.text}
                        translatedText={phrase.translatedText}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : activePhrase ? (
          <div className="dilog-single-phrase">
            <div className="dilog-person-card">
              <img alt="" className="dilog-person-photo" src={getPersonPhotoUrl(activePhrase.person, setDetails.id, effectivePhraseIndex)} />
              <div className="dilog-person-copy">
                <span className="dilog-phrase-kicker">{roleLabel}</span>
                <button
                  aria-label={shouldBlurActivePhraseText ? 'Reveal phrase text' : 'Phrase text is visible'}
                  aria-pressed={!shouldBlurActivePhraseText}
                  className={`dilog-phrase-text dilog-phrase-text-button ${shouldBlurActivePhraseText ? 'dilog-phrase-text-hidden' : ''}`}
                  onClick={() => setRevealedPhraseId(activePhrase.id)}
                  type="button"
                >
                  {activePhrase.text}
                </button>
                {activePhrase.translatedText ? <p className="dilog-phrase-translation">{activePhrase.translatedText}</p> : null}
              </div>
              <Button
                aria-label={playbackState === 'playing' ? 'Phrase is currently playing' : 'Play phrase audio'}
                className={`dilog-phrase-play-button ${playbackState === 'playing' ? 'dilog-phrase-play-button-active' : ''}`}
                disabled={phraseControlDisabled}
                onClick={handlePlay}
                variant="icon"
              >
                <PhrasePlayIcon aria-hidden="true" className="bottom-control-icon-svg" size={18} strokeWidth={2} />
              </Button>
              {playbackState === 'loading' ? (
                <span className="dilog-phrase-status" role="status">
                  Loading audio
                </span>
              ) : null}
              {playbackState === 'error' ? (
                <span className="dilog-phrase-status dilog-phrase-status-error" role="status">
                  Audio error
                </span>
              ) : null}
              </div>
          </div>
        ) : (
          <EmptyState title="No phrases in this dilog" description="This dilog exists, but it does not contain any phrases yet." />
        )}
      </div>

      {stage === 'practice' && !isPreviewVisible ? (
        <BottomControlPanel
          favoritesDisabled={practiceController.favoritesFilterDisabled || practiceController.playAllActive}
          favoritesEnabled={practiceController.favoritesOnly}
          onBack={onBack}
          onRestart={practiceController.handleRestart}
          onToggleFavorites={practiceController.handleToggleFavorites}
          onTogglePlayAll={practiceController.handleTogglePlayAll}
          playAllActive={practiceController.playAllActive}
          playAllDisabled={practiceController.playableVisiblePhraseCount === 0}
          playAllLabel={practiceController.playAllLabel}
          progressCompleted={practiceController.progressCompleted}
          progressLabel={practiceController.progressLabel}
          progressTotal={practiceController.progressTotal}
          restartDisabled={practiceController.playableVisiblePhraseCount === 0}
          restartReady={practiceController.restartReady}
        />
      ) : (
      <div className="bottom-control-panel dilog-bottom-panel">
        <div aria-live="polite" className="bottom-control-progress" role="status">
          <p className="bottom-control-progress-label">{progressLabel}</p>
          <div
            aria-label="Dilog stage progress"
            aria-valuemax={phraseList.length}
            aria-valuemin={0}
            aria-valuenow={progressCompleted}
            className="segmented-progress-track"
            role="progressbar"
          >
            {phraseList.map((phrase, index) => (
              <div className={`segmented-progress-dot ${!isPreviewVisible && index < progressCompleted ? 'segmented-progress-dot-filled' : ''}`} key={phrase.id} />
            ))}
          </div>
        </div>

        <div className="bottom-control-row">
          <Button aria-label="Back to dilogs" className="bottom-control-icon bottom-control-icon-back" onClick={onBack} variant="secondary">
            <ArrowLeft aria-hidden="true" className="bottom-control-icon-svg" size={18} strokeWidth={2} />
          </Button>
          <Button aria-label="Restart stage" className="bottom-control-secondary" disabled={phraseList.length === 0} onClick={handleRestart} variant="secondary">
            <RotateCcw aria-hidden="true" className="bottom-control-icon-svg" size={16} strokeWidth={2} />
          </Button>
          <Button
            className="bottom-control-secondary"
            disabled={isPreviewVisible || !activePhrase?.audioSrc || playbackState === 'loading' || playbackState === 'playing'}
            onClick={handlePlay}
            variant="secondary"
          >
            <Play aria-hidden="true" className="bottom-control-icon-svg" size={16} strokeWidth={2} />
          </Button>
          <Button className="bottom-control-main" disabled={phraseList.length === 0} onClick={handleNext}>
            {nextLabel}
            <ChevronRight aria-hidden="true" className="bottom-control-icon-svg" size={18} strokeWidth={2} />
          </Button>
        </div>
      </div>
      )}
    </section>
  );
}
