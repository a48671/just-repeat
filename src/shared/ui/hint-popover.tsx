import { useCallback, useEffect, useMemo, useState } from 'react';
import { getHintText } from './hint-texts';
import type { NativeLanguage } from '../../domain/app-settings';
import { Button } from './button';

type HintPopoverProps = {
  hintKey: Parameters<typeof getHintText>[1];
  language: NativeLanguage;
  onClose?: () => void;
};

export function HintPopover({ hintKey, language, onClose }: HintPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = useMemo(() => getHintText(language, hintKey), [language, hintKey]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  return (
    <div className={`hint-popover ${isVisible ? 'hint-popover-visible' : ''}`} role="dialog" aria-live="polite">
      <div className="hint-popover-content">
        <p className="hint-popover-text">{content}</p>
        <Button className="hint-popover-button" onClick={handleClose} variant="secondary">
          {getHintText(language, 'generic.gotIt')}
        </Button>
      </div>
    </div>
  );
}
