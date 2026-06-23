import { Settings, UserRound } from 'lucide-react';
import { Button } from './button';

type SetsUtilityPanelProps = {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
};

const SHOW_PROFILE_BUTTON = false; // Toggle to true to re-enable profile button

export function SetsUtilityPanel({ onProfileClick, onSettingsClick }: SetsUtilityPanelProps) {
  return (
    <div className="sets-utility-panel" aria-label="Bottom utility panel">
      <div className="sets-utility-panel-row">
        {SHOW_PROFILE_BUTTON ? (
          <Button aria-label="Open profile" className="sets-utility-panel-button" onClick={onProfileClick} variant="secondary">
            <UserRound aria-hidden="true" className="sets-utility-panel-icon" size={18} strokeWidth={2} />
            <span className="sets-utility-panel-label">Profile</span>
          </Button>
        ) : null}
        <Button aria-label="Open settings" className="sets-utility-panel-button" onClick={onSettingsClick} variant="secondary">
          <Settings aria-hidden="true" className="sets-utility-panel-icon" size={18} strokeWidth={2} />
          <span className="sets-utility-panel-label">Settings</span>
        </Button>
      </div>
    </div>
  );
}