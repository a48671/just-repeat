type SetCardProps = {
  title: string;
  description: string;
  phraseCount: number;
  lastInteraction?: string;
  onOpen?: () => void;
};

export function SetCard({ title, description, phraseCount, lastInteraction, onOpen }: SetCardProps) {
  const content = (
    <>
      <div className="set-card-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="set-card-meta">
        <span className="set-card-count">{phraseCount} phrases</span>
        {lastInteraction ? <span className="set-card-last">{lastInteraction}</span> : null}
      </div>
    </>
  );

  if (!onOpen) {
    return <article className="set-card">{content}</article>;
  }

  return (
    <button className="set-card set-card-button" onClick={onOpen} type="button">
      {content}
    </button>
  );
}
