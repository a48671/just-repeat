import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DEFAULT_APP_SETTINGS, NATIVE_LANGUAGE_OPTIONS, type NativeLanguage } from '../../domain/app-settings';
import { loadAppSettings, saveAppSettings } from '../../infrastructure/persistence/local-app-settings-storage';
import { Button } from '../../shared/ui/button';

type SettingsScreenProps = {
  onBack: () => void;
  onApply: () => void;
};

export function SettingsScreen({ onBack, onApply }: SettingsScreenProps) {
  const [{ nativeLanguage: initialLanguage }] = useState(() => loadAppSettings());
  const [draftLanguage, setDraftLanguage] = useState<NativeLanguage>(initialLanguage ?? DEFAULT_APP_SETTINGS.nativeLanguage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  function handleApply() {
    saveAppSettings({ nativeLanguage: draftLanguage });
    onApply();
  }

  function handleSelectLanguage(language: NativeLanguage) {
    setDraftLanguage(language);
    setIsDropdownOpen(false);
  }

  return (
    <section className="settings-screen" aria-label="Settings screen">
      <div className="screen-content screen-content-settings">
        <header className="settings-screen-header">
          <h1 className="settings-screen-title">Settings</h1>
          <p className="settings-screen-subtitle">Configure app language preferences.</p>
        </header>

        <div className="settings-field" ref={dropdownRef}>
          <label className="settings-field-label" htmlFor="native-language-button">
            Native language
          </label>

          <button
            aria-controls="native-language-menu"
            aria-expanded={isDropdownOpen}
            className={`settings-select ${isDropdownOpen ? 'settings-select-open' : ''}`}
            id="native-language-button"
            onClick={() => setIsDropdownOpen((current) => !current)}
            type="button"
          >
            <span className="settings-select-value">{draftLanguage}</span>
            {isDropdownOpen ? <ChevronUp aria-hidden="true" className="settings-select-icon settings-select-icon-open" size={18} strokeWidth={2} /> : <ChevronDown aria-hidden="true" className="settings-select-icon" size={18} strokeWidth={2} />}
          </button>

          {isDropdownOpen ? (
            <div className="settings-dropdown-menu" id="native-language-menu" role="listbox" aria-label="Native language options">
              {NATIVE_LANGUAGE_OPTIONS.map((language) => {
                const selected = draftLanguage === language;

                return (
                  <button
                    aria-selected={selected}
                    className={`settings-dropdown-option ${selected ? 'settings-dropdown-option-selected' : ''}`}
                    key={language}
                    onClick={() => handleSelectLanguage(language)}
                    role="option"
                    type="button"
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="settings-spacer" aria-hidden="true" />
      </div>

      <div className="settings-bottom-panel">
        <div className="settings-bottom-panel-row">
          <Button aria-label="Back to sets" className="settings-bottom-button settings-bottom-button-secondary" onClick={onBack} variant="secondary">
            <ArrowLeft aria-hidden="true" className="settings-bottom-button-icon" size={18} strokeWidth={2} />
            <span>Back</span>
          </Button>
          <Button aria-label="Apply settings" className="settings-bottom-button settings-bottom-button-primary" onClick={handleApply}>
            <Check aria-hidden="true" className="settings-bottom-button-icon" size={18} strokeWidth={2} />
            <span>Apply</span>
          </Button>
        </div>
      </div>
    </section>
  );
}