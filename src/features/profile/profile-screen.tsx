import { useState } from 'react';
import type { UserProfile } from '../../domain/user-profile';
import { loadUserProfile, removeUserProfile, saveUserProfile } from '../../infrastructure/persistence/local-user-profile-storage';
import { Button } from '../../shared/ui/button';

type ProfileScreenProps = {
  onBack: () => void;
};

type ViewState = 'logged-in' | 'logged-out' | 'sign-in-form';

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadUserProfile());
  const [viewState, setViewState] = useState<ViewState>(profile ? 'logged-in' : 'logged-out');

  function handleSignIn(newProfile: UserProfile) {
    saveUserProfile(newProfile);
    setProfile(newProfile);
    setViewState('logged-in');
  }

  function handleLogOut() {
    removeUserProfile();
    setProfile(null);
    setViewState('logged-out');
  }

  if (viewState === 'sign-in-form') {
    return <SignInForm onBack={() => setViewState('logged-out')} onSignIn={handleSignIn} />;
  }

  if (viewState === 'logged-in' && profile) {
    return <LoggedInView profile={profile} onBack={onBack} onLogOut={handleLogOut} />;
  }

  return <LoggedOutView onBack={onBack} onSignIn={() => setViewState('sign-in-form')} />;
}

function LoggedInView({ profile, onBack, onLogOut }: { profile: UserProfile; onBack: () => void; onLogOut: () => void }) {
  return (
    <section className="profile-screen" aria-label="Profile screen">
      <div className="screen-content screen-content-profile">
        <header className="profile-screen-header">
          <h1 className="profile-screen-title">Profile</h1>
          <p className="profile-screen-subtitle">Manage your account details.</p>
        </header>

        <div className="profile-form">
          <div className="profile-field">
            <span className="profile-field-label">Email</span>
            <span className="profile-field-value">{profile.email}</span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">Login</span>
            <span className="profile-field-value">{profile.login}</span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">Password</span>
            <span className="profile-field-value">{'•'.repeat(10)}</span>
          </div>
        </div>

        <div className="profile-spacer" aria-hidden="true" />
      </div>

      <div className="profile-bottom-panel">
        <div className="profile-bottom-panel-actions">
          <Button className="profile-bottom-button profile-bottom-button-secondary" onClick={onBack}>
            <span>Back</span>
          </Button>
          <Button className="profile-bottom-button profile-bottom-button-primary" onClick={() => {}}>
            <span>Edit Profile</span>
          </Button>
          <Button className="profile-bottom-button profile-bottom-button-logout" onClick={onLogOut}>
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LoggedOutView({ onBack, onSignIn }: { onBack: () => void; onSignIn: () => void }) {
  return (
    <section className="profile-screen" aria-label="Profile screen">
      <div className="screen-content screen-content-profile">
        <header className="profile-screen-header">
          <h1 className="profile-screen-title">Profile</h1>
          <p className="profile-screen-subtitle">Sign in to sync your phrase sets and preferences.</p>
        </header>

        <div className="profile-logged-out-state">
          <div className="profile-status-card">
            <span className="profile-status-title">You are not signed in</span>
            <p className="profile-status-body">Sign in to save progress, manage favorites, and keep your learning history across devices.</p>
          </div>

          <div className="profile-benefits-card">
            <span className="profile-benefit-item">• Sync sets and phrase history</span>
            <span className="profile-benefit-item">• Keep favorites in one account</span>
            <span className="profile-benefit-item">• Restore access on any device</span>
          </div>
        </div>

        <div className="profile-spacer" aria-hidden="true" />
      </div>

      <div className="profile-bottom-panel">
        <div className="profile-bottom-panel-actions">
          <Button className="profile-bottom-button profile-bottom-button-primary" onClick={onSignIn}>
            <span>Sign In</span>
          </Button>
          <Button className="profile-bottom-button profile-bottom-button-outlined" onClick={onSignIn}>
            <span>Create Account</span>
          </Button>
          <Button className="profile-bottom-button profile-bottom-button-secondary" onClick={onBack}>
            <span>Back</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SignInForm({ onBack, onSignIn }: { onBack: () => void; onSignIn: (profile: UserProfile) => void }) {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email.trim() || !login.trim() || !password.trim()) {
      return;
    }

    onSignIn({ email: email.trim(), login: login.trim(), password: password.trim() });
  }

  const isValid = email.trim().length > 0 && login.trim().length > 0 && password.trim().length > 0;

  return (
    <section className="profile-screen" aria-label="Sign in screen">
      <form className="screen-content screen-content-profile" onSubmit={handleSubmit}>
        <header className="profile-screen-header">
          <h1 className="profile-screen-title">Sign In</h1>
          <p className="profile-screen-subtitle">Enter your account details.</p>
        </header>

        <div className="profile-form">
          <label className="profile-input-field">
            <span className="profile-field-label">Email</span>
            <input
              autoComplete="email"
              className="profile-input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              type="email"
              value={email}
            />
          </label>

          <label className="profile-input-field">
            <span className="profile-field-label">Login</span>
            <input
              autoComplete="username"
              className="profile-input"
              onChange={(e) => setLogin(e.target.value)}
              placeholder="repeat_user"
              type="text"
              value={login}
            />
          </label>

          <label className="profile-input-field">
            <span className="profile-field-label">Password</span>
            <input
              autoComplete="current-password"
              className="profile-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              type="password"
              value={password}
            />
          </label>
        </div>

        <div className="profile-spacer" aria-hidden="true" />
      </form>

      <div className="profile-bottom-panel">
        <div className="profile-bottom-panel-actions">
          <Button className="profile-bottom-button profile-bottom-button-secondary" onClick={onBack} type="button">
            <span>Back</span>
          </Button>
          <Button className="profile-bottom-button profile-bottom-button-primary" disabled={!isValid} onClick={handleSubmit} type="button">
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
