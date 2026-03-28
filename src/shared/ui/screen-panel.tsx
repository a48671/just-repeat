import type { ReactNode } from 'react';

type ScreenPanelProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  detail?: boolean;
};

export function ScreenPanel({ eyebrow, title, description, children, detail = false }: ScreenPanelProps) {
  return (
    <section className={detail ? 'panel panel-detail' : 'panel'}>
      <div className="panel-header">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="panel-description">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
