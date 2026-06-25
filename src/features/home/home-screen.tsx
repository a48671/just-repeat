import { BookOpenText, MessagesSquare } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';
import type { NativeLanguage } from '../../domain/app-settings';
import { loadAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { Button } from '../../shared/ui/button';

type HomeScreenProps = {
  onPractice: () => void;
  onDilogs: () => void;
};

const HOME_CARD_COPY: Record<NativeLanguage, {
  hero: { tagline: string; description: string };
  sets: { title: string; description: string };
  dilogs: { title: string; description: string };
}> = {
  Russian: {
    hero: {
      tagline: 'Учи английский простым путём',
      description: 'Повторяй короткие фразы, слушай живые реплики и постепенно привыкай говорить увереннее.',
    },
    sets: {
      title: 'Наборы фраз',
      description: 'Короткие фразы для повторения, прослушивания и тренировки произношения.',
    },
    dilogs: {
      title: 'Диалоги',
      description: 'Практика реплик в контексте: слушай диалог и тренируй роли собеседников.',
    },
  },
  Spanish: {
    hero: {
      tagline: 'Aprende inglés de forma simple',
      description: 'Repite frases cortas, escucha líneas naturales y gana confianza al hablar paso a paso.',
    },
    sets: {
      title: 'Conjuntos de frases',
      description: 'Frases cortas para repetir, escuchar y practicar la pronunciación.',
    },
    dilogs: {
      title: 'Diálogos',
      description: 'Practica líneas en contexto: escucha el diálogo y entrena los roles de los hablantes.',
    },
  },
  German: {
    hero: {
      tagline: 'Lerne Englisch auf einfache Weise',
      description: 'Wiederhole kurze Sätze, höre natürliche Zeilen und gewinne Schritt für Schritt mehr Sicherheit beim Sprechen.',
    },
    sets: {
      title: 'Phrasensets',
      description: 'Kurze Sätze zum Wiederholen, Anhören und Üben der Aussprache.',
    },
    dilogs: {
      title: 'Dialoge',
      description: 'Übe Sätze im Kontext: höre den Dialog und trainiere die Rollen der Sprecher.',
    },
  },
};

export function HomeScreen({ onPractice, onDilogs }: HomeScreenProps) {
  const { nativeLanguage } = loadAppSettings();
  const copy = HOME_CARD_COPY[nativeLanguage];

  return (
    <section className="home-screen" aria-label="Just Repeat home screen">
      <div className="home-screen-content">
        <header className="home-hero">
          <div className="home-logo-panel" aria-hidden="true">
            <div className="home-logo">
              <img alt="" className="home-logo-image" src={logoUrl} />
            </div>
          </div>
          <div className="home-hero-copy">
            <h1 className="home-screen-title">Just Repeat</h1>
            <p className="home-screen-tagline">{copy.hero.tagline}</p>
            <p className="home-screen-description">{copy.hero.description}</p>
          </div>
        </header>

        <div className="home-mode-card-list">
          <Button className="home-mode-card" onClick={onPractice} hintId="home.sets" hintKey="home.sets">
            <span className="home-mode-card-icon" aria-hidden="true">
              <BookOpenText size={22} strokeWidth={2} />
            </span>
            <span className="home-mode-card-copy">
              <span className="home-mode-card-title">{copy.sets.title}</span>
              <span className="home-mode-card-description">{copy.sets.description}</span>
            </span>
          </Button>
          <Button className="home-mode-card" onClick={onDilogs} hintId="home.dilogs" hintKey="home.dilogs" variant="secondary">
            <span className="home-mode-card-icon" aria-hidden="true">
              <MessagesSquare size={22} strokeWidth={2} />
            </span>
            <span className="home-mode-card-copy">
              <span className="home-mode-card-title">{copy.dilogs.title}</span>
              <span className="home-mode-card-description">{copy.dilogs.description}</span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
