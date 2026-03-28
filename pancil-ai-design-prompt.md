Create a complete UI/UX design package for a mobile-first MVP application called English Phrase Practice App.

The app helps users practice and memorize English phrases grouped into sets. The user opens a list of sets, selects a set, sees a list of English phrases, plays phrase audio one by one or sequentially, marks phrases as favorites, filters by favorites, and returns later to the last phrase they manually started.

Your task is to generate all necessary product design artifacts and screen mockups required for implementation of the MVP. Do not invent extra features outside the specification.

Design language and overall direction:
- Clean, minimal, calm, modern interface.
- Mobile-first.
- The UI must feel lightweight, focused, and easy to understand without training.
- No visual overload.
- Use clear states for controls: normal, active, loading, disabled, error.
- Desktop layout must remain narrow and centered, close to a mobile-width content column.
- The app is for focused language practice, so the tone should feel practical, quiet, and readable rather than playful or gamified.

Primary goal of the product:
- Open a phrase set quickly.
- Listen to individual phrases.
- Start sequential playback of the current list.
- Mark phrases as favorites.
- Filter phrases to favorites only.
- Show session progress for the currently displayed list.
- Restore the user to the last manually started phrase when the set is reopened.

Platforms and breakpoints:
- Create mobile layouts first.
- Create desktop adaptations for the same screens.
- Mobile frame: 390 x 844 or equivalent modern phone frame.
- Desktop frame: 1440 width with centered fixed-width content column around mobile/tablet reading width.

Important product constraints:
- No authentication.
- No backend-specific UI.
- No translation UI.
- No playback speed controls.
- No shuffle mode.
- No recording features.
- No analytics dashboards.
- No hidden phrase text. Phrase text is always fully visible.
- Only one audio can play at a time.
- During Play All, manual play on individual phrases must be unavailable.
- The bottom control panel on the set screen must be fixed and always visible.

Core screens that must be designed:

1. Sets list screen
Design the main screen that shows all available phrase sets.

Requirements for this screen:
- Title/header for the app or page.
- Vertical list of set cards.
- Each set card must contain:
  - set title
  - short description
  - phrase count
  - optional last interaction information if available
- Clear tap target for opening the set.
- Empty state design when there are no sets.

Create the following variants:
- Mobile default state with multiple set cards.
- Mobile empty state with no sets.
- Desktop default state.

Use realistic sample content from the existing data:
- Set 1 title: The Universal Self-Introduction Script
- Set 1 description: A simple English text to practice speaking about yourself. It helps you learn common sentence structures and use them in everyday conversations.
- Set 1 phrase count: 33
- Set 2 title: Everyday Phrases
- Set 2 description: Useful phrases for daily life
- Set 2 phrase count: 1

2. Set details screen
Design the main learning screen for a single set.

The screen structure must contain:
- Header area with set title and description.
- Scrollable vertical list of phrase cards.
- Fixed bottom control panel.

Phrase card requirements:
- Display phrase text in English.
- Phrase text must always be visible.
- Play button on each card.
- Favorite toggle button on each card.
- Distinct visual treatment for active phrase.
- Phrase-level playback progress bar visible while that phrase is playing.

Bottom control panel requirements:
- Back button.
- Favorites-only filter toggle.
- Progress bar for current list completion.
- Play All button.
- Stop state for Play All while active.
- Separate Restart from Beginning button.

Create the following variants for the set details screen:
- Mobile default state with phrase list visible and bottom control panel.
- Mobile state with one active phrase.
- Mobile state with one phrase loading.
- Mobile state with one phrase currently playing and phrase-level progress bar visible.
- Mobile state with favorites enabled.
- Mobile state with favorites filter button disabled because there are no favorites.
- Mobile state with Play All active.
- Mobile state after Play All stopped with retained queue position.
- Mobile state showing restart-from-beginning available.
- Mobile empty state for a set with no phrases.
- Mobile empty state for favorites filter with no matching favorite phrases.
- Mobile audio error state with short clear feedback and retry path visible.
- Desktop version of the set details screen.

Use realistic sample phrases taken from existing data, for example:
- Hello. My name is Andrey.
- Right now, I am focused on building a life that feels meaningful and balanced.
- I work in a field that requires creativity and logical thinking.
- I enjoy solving problems.
- I like improving systems.

3. Restored position behavior mockup
Create a dedicated screen or annotation view showing how the app restores the user to the last manually started phrase when reopening a set.

This design must show:
- The set screen reopened.
- The list scrolled to the last active phrase.
- The last active phrase clearly highlighted.
- A subtle but clear visual explanation of restored position behavior.

4. Playback flow states
Create focused state mockups or a mini flow for playback behavior.

This must include:
- Manual phrase play from idle.
- Loading state.
- Playing state.
- Completed phrase state within current session.
- Play All state with current phrase highlighted.
- Stop state during sequential playback.
- Restart from beginning state.
- Disabled manual play on phrase cards during Play All.

5. Favorites flow states
Create focused state mockups or annotated component states showing:
- Phrase not favorite.
- Phrase added to favorites.
- Favorites filter off.
- Favorites filter on.
- Favorites-only empty state.
- Disabled favorites filter when there are no favorites at all.

6. Error and empty states
Design all required empty and error states with consistent visual language:
- No sets available.
- Selected set has no phrases.
- Favorites filter returns no phrases.
- Audio failed to load or play.

These states must be minimal, calm, and clearly understandable.

7. Responsive behavior documentation
Provide responsive design guidance for developers:
- Mobile-first layout rules.
- Desktop container width behavior.
- Spacing behavior.
- How fixed bottom panel behaves on desktop and mobile.
- How long phrase text wraps.
- Minimum safe spacing above the fixed bottom panel so content is not obscured.

8. Component library / design system output
Provide a small implementation-ready design system section that includes:
- Color roles
- Typography scale
- Spacing scale
- Border radius usage
- Elevation/shadow rules if used
- Button styles and states
- Icon button styles and states
- Set card component
- Phrase card component
- Progress bar component
- Bottom control panel component
- Empty state component
- Error message component

Accessibility requirements that must be reflected in the design:
- Interactive controls must have touch targets at least 44 x 44 px.
- Icons without text must still have room for accessible labeling in implementation.
- Active phrase must have clear contrast against non-active cards.
- States must not rely on color alone.
- Text must remain readable on mobile and desktop.

Interaction and state rules that the design must respect:
- Current list can mean either all phrases or only favorite phrases.
- Progress bar in the bottom panel depends on the current list, not always the full set.
- A phrase becomes active when manually played, or when currently playing.
- Play All uses the currently displayed list.
- If Play All is stopped, the queue position is preserved.
- Restart from Beginning resets the queue to the first phrase in the current list.
- If Restart from Beginning is pressed during Play All, playback stops and the system stays stopped.
- Sequential playback must not overwrite the persisted last manually started phrase.
- Opening a set alone does not count as last interaction.

Deliverables expected from you:
- A complete set of high-fidelity screen mockups.
- Mobile and desktop versions where applicable.
- State variants for all critical interactions.
- A compact design system / UI kit.
- Developer-facing annotations for spacing, structure, states, and responsive behavior.
- A clear map of all screens and states included in the MVP.

Do not produce:
- Extra product features outside MVP.
- Marketing landing pages.
- Onboarding flows.
- Profile/account screens.
- Settings screens unless strictly necessary for the MVP, which they are not.
- Social, sharing, or community screens.

Visual style guidance:
- Prefer a neutral, editorial, high-legibility visual style.
- Keep the hierarchy strong and readable.
- Use restrained color accents for active, progress, favorite, and error states.
- Avoid noisy backgrounds.
- Avoid overly playful illustration-heavy style.
- Favor clarity, rhythm, whitespace, and strong typography.

Final output format:
- First provide a sitemap / screen inventory for the MVP.
- Then provide the design system.
- Then provide all screen mockups and state variants.
- Then provide responsive behavior notes.
- Then provide implementation annotations for developers.

The result must be sufficient for frontend implementation without needing major UX decisions to be invented later.