import { colorRoles, spacingScale, typeScale, uiComponentInventory } from '../design/tokens';
import { domainNotes } from '../domain/domain-notes';

export function FoundationPanel() {
  return (
    <section className="notes-card foundation-grid">
      <div>
        <h2>Domain Notes</h2>
        <ul className="notes-list notes-list-compact">
          {domainNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Color Roles</h2>
        <ul className="notes-list notes-list-compact">
          {colorRoles.map(([name, value]) => (
            <li key={name}>
              <strong>{name}</strong>: {value}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Type Scale</h2>
        <ul className="notes-list notes-list-compact">
          {typeScale.map(([name, value]) => (
            <li key={name}>
              <strong>{name}</strong>: {value}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Spacing Scale</h2>
        <ul className="notes-list notes-list-compact">
          {spacingScale.map((step) => (
            <li key={step}>{step}px</li>
          ))}
        </ul>
      </div>

      <div className="foundation-grid-span">
        <h2>UI Inventory</h2>
        <ul className="notes-list notes-list-compact">
          {uiComponentInventory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
