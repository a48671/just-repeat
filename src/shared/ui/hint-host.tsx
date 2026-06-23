import { useEffect, useRef, useState } from 'react';
import { getHintText } from './hint-texts';
import type { NativeLanguage } from '../../domain/app-settings';
import { getActiveRegistration, subscribe, closeActiveHint } from './hint-registry';
import { Button } from './button';

export function HintHost() {
  const [tick, setTick] = useState(0);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number; arrowLeft: number } | null>(null);

  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const active = getActiveRegistration();

  useEffect(() => {
    // Highlight target element when active changes
    const el = active?.element ?? null;
    if (el) {
      el.classList.add('hint-target-highlight');
    }
    return () => {
      if (el) el.classList.remove('hint-target-highlight');
    };
  }, [active?.hintId, active?.element]);

  useEffect(() => {
    if (!active) return;
    const el = active.element;
    if (!el) return;

    function compute() {
      const rect = el.getBoundingClientRect();
      const pop = popRef.current;
      const viewportPadding = 8;

      // Default size estimate
      const popWidth = pop ? pop.getBoundingClientRect().width : Math.min(360, window.innerWidth - 32);
      const popHeight = pop ? pop.getBoundingClientRect().height : 120;

      let left = Math.round(rect.left + rect.width / 2 - popWidth / 2);
      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - popWidth - viewportPadding));

      let top = Math.round(rect.top - popHeight - 8);
      let arrowLeft = Math.round(rect.left + rect.width / 2 - left);

      // If not enough space above, place below
      if (top < viewportPadding) {
        top = Math.round(rect.bottom + 8);
        // arrow position stays the same relative to pop left
      }

      setPosition({ left, top, arrowLeft });
    }

    compute();
    window.addEventListener('resize', compute, { passive: true });
    window.addEventListener('scroll', compute, { passive: true });

    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute);
    };
  }, [active?.hintId, active?.element, tick]);

  if (!active) return null;

  const content = getHintText((window as any).__jr_language_override ?? 'Russian', active.hintKey);

  function handleClose() {
    closeActiveHint();
  }

  return (
    <div
      ref={popRef}
      className="hint-popover hint-popover-visible"
      role="dialog"
      aria-live="polite"
      style={
        position && {
          position: 'fixed',
          left: `${position.left}px`,
          top: `${position.top}px`,
          right: 'auto',
          zIndex: 9999,
          // expose arrow position to CSS
          ['--hint-arrow-left' as any]: `${position.arrowLeft}px`,
        }
      }
    >
      <div className="hint-popover-content">
        <p className="hint-popover-text">{content}</p>
        <Button className="hint-popover-button" onClick={handleClose} variant="secondary">
          {getHintText((window as any).__jr_language_override ?? 'Russian', 'generic.gotIt')}
        </Button>
      </div>
    </div>
  );
}
