import { ArrowLeft, RotateCcw, Star } from 'lucide-react';
import { Button } from './button';

type BottomControlPanelProps = {
  favoritesEnabled?: boolean;
  favoritesDisabled?: boolean;
  playAllActive?: boolean;
  playAllDisabled?: boolean;
  playAllLabel?: string;
  progressCompleted?: number;
  progressLabel?: string;
  progressTotal?: number;
  restartDisabled?: boolean;
  restartReady?: boolean;
  onBack?: () => void;
  onToggleFavorites?: () => void;
  onTogglePlayAll?: () => void;
  onRestart?: () => void;
};

export function BottomControlPanel({
  favoritesEnabled = false,
  favoritesDisabled = false,
  playAllActive = false,
  playAllDisabled = false,
  playAllLabel = 'Play All',
  progressCompleted = 0,
  progressLabel = '0/0 in current list',
  progressTotal = 0,
  restartDisabled = false,
  restartReady = false,
  onBack,
  onToggleFavorites,
  onTogglePlayAll,
  onRestart,
}: BottomControlPanelProps) {
  return (
    <div className="bottom-control-panel">
      <div aria-live="polite" className="bottom-control-progress" role="status">
        <p className="bottom-control-progress-label">{progressLabel}</p>
        <div
          aria-label="Set progress"
          aria-valuemax={progressTotal}
          aria-valuemin={0}
          aria-valuenow={progressCompleted}
          className="segmented-progress-track"
          role="progressbar"
        >
          {Array.from({ length: progressTotal }, (_, i) => (
            <div
              className={`segmented-progress-dot ${i < progressCompleted ? 'segmented-progress-dot-filled' : ''}`}
              key={i}
            />
          ))}
        </div>
      </div>

      <div className="bottom-control-row">
        <Button aria-label="Back to sets" className="bottom-control-icon bottom-control-icon-back" onClick={onBack} variant="secondary">
          <ArrowLeft aria-hidden="true" className="bottom-control-icon-svg" size={18} strokeWidth={2} />
        </Button>
        <Button
          aria-label={favoritesEnabled ? 'Disable favorites filter' : 'Enable favorites filter'}
          aria-pressed={favoritesEnabled}
          className={`bottom-control-icon bottom-control-icon-favorites ${favoritesEnabled ? 'bottom-control-icon-active' : ''} ${favoritesDisabled ? 'bottom-control-icon-disabled' : ''}`}
          disabled={favoritesDisabled}
          onClick={onToggleFavorites}
          variant="secondary"
        >
          <Star aria-hidden="true" className="bottom-control-icon-svg" size={16} strokeWidth={2} />
        </Button>
        <Button className={`bottom-control-main ${playAllActive ? 'bottom-control-main-active' : ''}`} disabled={playAllDisabled} onClick={onTogglePlayAll}>
          {playAllActive ? 'Stop' : playAllLabel}
        </Button>
        <Button
          aria-label="Restart from beginning"
          className={`bottom-control-secondary ${restartReady ? 'bottom-control-secondary-ready' : ''}`}
          disabled={restartDisabled}
          onClick={onRestart}
          variant="secondary"
        >
          <RotateCcw aria-hidden="true" className="bottom-control-icon-svg" size={16} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
