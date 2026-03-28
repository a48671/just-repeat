type AppHeroProps = {
  activeScreen: 'sets' | 'details';
  selectedSetTitle: string | null;
  setCount: number;
};

export function AppHero({ activeScreen, selectedSetTitle, setCount }: AppHeroProps) {
  return (
    <section className="hero-card">
      <p className="eyebrow">Project Scaffold</p>
      <h1>English Phrase Practice App</h1>
      <p className="lead">
        UI foundation, real data adapter, and basic screen flow are ready. Playback and user-state logic are still intentionally deferred.
      </p>
      <div className="hero-meta-row">
        <span className="meta-chip">{setCount} sets connected</span>
        <span className="meta-text">Current screen: {activeScreen === 'sets' ? 'Sets List' : 'Set Details'}</span>
        {selectedSetTitle ? <span className="meta-text">Open set: {selectedSetTitle}</span> : null}
      </div>
    </section>
  );
}
