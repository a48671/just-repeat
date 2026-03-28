type InlineMessageProps = {
  tone?: 'error' | 'neutral';
  message: string;
};

export function InlineMessage({ tone = 'neutral', message }: InlineMessageProps) {
  return (
    <div
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={`inline-message inline-message-${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {message}
    </div>
  );
}
