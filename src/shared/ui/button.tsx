import { useEffect, useRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { HintKey } from './hint-texts';
import { registerHint, unregisterHint } from './hint-registry';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  hintId?: string;
  hintKey?: HintKey;
  hintWrapperClassName?: string;
};

export function Button({ children, className = '', variant = 'primary', hintId, hintKey, hintWrapperClassName = '', ...props }: ButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const registrationRef = useRef<any>(null);

  useEffect(() => {
    if (!hintId || !hintKey) return;

    const registration = {
      hintId,
      hintKey,
      element: containerRef.current,
      isMounted: true,
    };

    registrationRef.current = registration;
    registerHint(registration);

    return () => {
      registration.isMounted = false;
      unregisterHint(registration);
    };
  }, [hintId, hintKey]);

  const classes = ['ui-button', `ui-button-${variant}`, className].filter(Boolean).join(' ');
  const wrapperClasses = ['button-with-hint', hintWrapperClassName].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={wrapperClasses}>
      <button {...props} className={classes} type={props.type ?? 'button'}>
        {children}
      </button>
    </div>
  );
}
