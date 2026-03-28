import logoUrl from '../../assets/logo.svg';
import { Button } from '../../shared/ui/button';

type HomeScreenProps = {
  onPractice: () => void;
};

export function HomeScreen({ onPractice }: HomeScreenProps) {
  return (
    <section className="home-screen" aria-label="Just Repeat home screen">
      <div className="home-screen-content">
        <div className="home-logo" aria-hidden="true">
          <img alt="" className="home-logo-image" src={logoUrl} />
        </div>

        <h1 className="home-screen-title">Just Repeat</h1>

        <Button className="home-screen-cta" onClick={onPractice}>
          Practice
        </Button>
      </div>
    </section>
  );
}