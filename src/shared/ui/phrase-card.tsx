import { Pause, Play, Star } from 'lucide-react';
import { Button } from './button';
import { ProgressBar } from './progress-bar';

type PhraseCardState = 'idle' | 'active' | 'loading' | 'playing' | 'completed' | 'error';

type PhraseCardProps = {
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

  return (
    <article aria-busy={state === 'loading'} aria-current={isCurrent ? 'true' : undefined} className={classes}>
      <div className="phrase-card-layout">
        <div className="phrase-card-copy">
          <div className="phrase-card-copy-stack">
            <p className="phrase-card-text">{text}</p>
            {translatedText ? <p className="phrase-card-text-translation">{translatedText}</p> : null}
          </div>
        </div>

        <div className="phrase-card-actions-rail">
          <Button aria-label={playButtonAriaLabel} className={playButtonClassName} disabled={playDisabled || state === 'loading'} onClick={onPlay} variant="icon">
            <PlayIcon aria-hidden="true" className="phrase-card-action-icon" size={16} strokeWidth={2} />
          </Button>
          <Button
            aria-label={favorite ? 'Remove phrase from favorites' : 'Add phrase to favorites'}
            aria-pressed={favorite}
            className={favoriteButtonClassName}
            disabled={favoriteDisabled}
            onClick={onToggleFavorite}
            variant="icon"
          >
            <Star aria-hidden="true" className="phrase-card-action-icon phrase-card-action-icon-star" size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {typeof playbackProgress === 'number' ? <ProgressBar label={`Phrase playback progress for ${text}`} tone="success" value={playbackProgress} /> : null}
    </article>
  );
}
