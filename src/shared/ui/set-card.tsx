import type { NativeLanguage } from '../../domain/app-settings';
import { loadAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { Button } from './button';

type SetCardProps = {
  title: string;
  description: string;
  phraseCount: number;
  lastInteraction?: string;
  onOpen?: () => void;
};

const PHRASE_COUNT_LABEL: Record<NativeLanguage, string> = {
  Russian: 'фраз',
  Spanish: 'frases',
  German: 'Sätze',
};

export function SetCard({ title, description, phraseCount, lastInteraction, onOpen }: SetCardProps) {
  const { nativeLanguage } = loadAppSettings();
  const phraseCountLabel = PHRASE_COUNT_LABEL[nativeLanguage];
  const content = (
    <>
      <div className="set-card-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="set-card-meta">
        <span className="set-card-count">
          {phraseCount} {phraseCountLabel}
        </span>
        {lastInteraction ? <span className="set-card-last">{lastInteraction}</span> : null}
      </div>
    </>
  );

  if (!onOpen) {
    return <article className="set-card">{content}</article>;
  }

  return (
    <Button
      className="set-card set-card-button"
      onClick={onOpen}
      hintId="sets.open"
      hintKey="set.open"
      hintWrapperClassName="set-card-hint-wrapper"
      variant="ghost"
    >
      {content}
    </Button>
  );
}
