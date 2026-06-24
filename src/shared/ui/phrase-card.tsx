import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Star } from 'lucide-react';
import { Button } from './button';
import { ProgressBar } from './progress-bar';
import { registerHint, unregisterHint } from './hint-registry';
import type { HintRegistration } from './hint-registry';

type PhraseCardState = 'idle' | 'active' | 'loading' | 'playing' | 'completed' | 'error';

type PhraseCardProps = {
  imageSrc?: string | null;
  text: string;
  translatedText?: string;
  state?: PhraseCardState;
  favorite?: boolean;
  playbackProgress?: number;
  playDisabled?: boolean;
  favoriteDisabled?: boolean;
  onPlay?: () => void;
  onToggleFavorite?: () => void;
};

export function PhraseCard({
  imageSrc,
  text,
  translatedText,
  state = 'idle',
  favorite = false,
  playbackProgress,
  playDisabled = false,
  favoriteDisabled = false,
  onPlay,
  onToggleFavorite,
}: PhraseCardProps) {
  const [textRevealed, setTextRevealed] = useState(false);
  const textButtonRef = useRef<HTMLButtonElement | null>(null);
  const isCurrent = state === 'active' || state === 'loading' || state === 'playing';
  const playButtonAriaLabel =
    state === 'loading'
      ? 'Audio is loading'
      : state === 'playing'
        ? 'Phrase is currently playing'
        : state === 'error'
          ? 'Retry phrase audio'
          : 'Play phrase audio';
  const classes = ['phrase-card', `phrase-card-${state}`].join(' ');
  const playButtonClassName = ['phrase-card-action-button', 'phrase-card-play-button', `phrase-card-play-button-${state}`].join(' ');
  const favoriteButtonClassName = [
    'phrase-card-action-button',
    'phrase-card-favorite-button',
    favorite ? 'phrase-card-favorite-button-active' : '',
    favoriteDisabled ? 'phrase-card-favorite-button-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const PlayIcon = state === 'playing' ? Pause : Play;
  const phraseTextClassName = ['phrase-card-text', textRevealed ? 'phrase-card-text-revealed' : 'phrase-card-text-hidden'].join(' ');

  useEffect(() => {
    setTextRevealed(false);
  }, [text]);

  useEffect(() => {
    if (textRevealed) return;

    const registration: HintRegistration = {
      hintId: 'phrase.revealText',
      hintKey: 'phrase.revealText',
      element: textButtonRef.current,
      isMounted: true,
    };

    registerHint(registration);

    return () => {
      registration.isMounted = false;
      unregisterHint(registration);
    };
  }, [textRevealed]);

  return (
    <article aria-busy={state === 'loading'} aria-current={isCurrent ? 'true' : undefined} className={classes}>
      {imageSrc ? (
        <div className="phrase-card-media">
          <img alt="" className="phrase-card-image" loading="lazy" src={imageSrc} />
        </div>
      ) : null}

      <div className="phrase-card-layout">
        <div className="phrase-card-copy">
          <div className="phrase-card-copy-stack">
            <button
              aria-label={textRevealed ? 'Phrase text is visible' : 'Reveal phrase text'}
              aria-pressed={textRevealed}
              className={phraseTextClassName}
              onClick={() => setTextRevealed(true)}
              ref={textButtonRef}
              type="button"
            >
              {text}
            </button>
            {translatedText ? <p className="phrase-card-text-translation">{translatedText}</p> : null}
          </div>
        </div>

        <div className="phrase-card-actions-rail">
          <Button
            aria-label={favorite ? 'Remove phrase from favorites' : 'Add phrase to favorites'}
            aria-pressed={favorite}
            className={favoriteButtonClassName}
            disabled={favoriteDisabled}
            onClick={onToggleFavorite}
            variant="icon"
            hintId="phrase.favorite"
            hintKey="phrase.favorite"
          >
            <Star aria-hidden="true" className="phrase-card-action-icon phrase-card-action-icon-star" size={16} strokeWidth={2} />
          </Button>
          <Button
            aria-label={playButtonAriaLabel}
            className={playButtonClassName}
            disabled={playDisabled || state === 'loading'}
            onClick={onPlay}
            variant="icon"
            hintId="phrase.play"
            hintKey="phrase.play"
          >
            <PlayIcon aria-hidden="true" className="phrase-card-action-icon" size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>

      <ProgressBar label={`Phrase playback progress for ${text}`} tone="success" value={playbackProgress ?? 0} />
    </article>
  );
}
