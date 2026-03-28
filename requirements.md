MVP Specification

English Phrase Practice App

⸻

1. Product Overview

1.1. Purpose

The application is designed for practicing and memorizing English phrases organized into sets. The user selects a set from a list, opens it, and interacts with the phrases by reading them, listening to audio, marking them as favorites, and playing them sequentially.

1.2. MVP Goal

The goal of the MVP is to give the user a simple and fast way to:
	•	open a relevant phrase set;
	•	listen to individual phrases;
	•	start sequential playback of the entire list;
	•	mark important phrases as favorites;
	•	filter the list by favorites;
	•	return to the last phrase that was manually started;
	•	see the current progress of phrase completion within the open set screen.

1.3. Supported Platforms

The application is designed as a mobile-first product and must work correctly:
	•	on mobile devices;
	•	on desktop screens.

For the MVP, two interface width modes are supported:
	•	mobile layout;
	•	desktop layout.

On desktop, the content must not stretch to the full window width. It should be displayed inside a fixed-width container with a comfortable width close to the mobile layout.

1.4. Main User Flow

The main user flow is:
	1.	The user opens the sets list screen.
	2.	The user selects a set.
	3.	The user navigates to the set screen.
	4.	The user reviews the list of phrases.
	5.	The user starts audio for an individual phrase or sequential playback of all phrases.
	6.	The user adds phrases to favorites when needed.
	7.	The user may enable the favorites-only filter.
	8.	When the user reopens the set, the application returns them to the last phrase that was manually started.

⸻

2. Definitions

2.1. Set

A collection of phrases intended for study.

2.2. Phrase

An individual English phrase associated with a single audio file.

2.3. Current List

The list of phrases currently displayed on the screen, taking the active filter into account:
	•	either all phrases in the set;
	•	or only the favorite phrases in the set.

2.4. Active Phrase

A phrase that:
	•	is currently being played, or
	•	was the last phrase manually started by the user via the Play button.

2.5. Completed Phrase

A phrase whose audio has been played to completion at least once during the current session of the set screen.

2.6. Last Interaction with Set

The last interaction with a set is any of the following user actions within that set:
	•	starting Play for an individual phrase;
	•	starting Play All;
	•	changing the favorite state of a phrase.

Simply opening a set does not count as an interaction.

2.7. Play All Cursor

An internal pointer representing the current position in the active sequential playback queue.

⸻

3. Functional Requirements

3.1. Layout and Responsiveness

FR-1. Mobile-first interface

The system must be optimized primarily for mobile devices.

FR-2. Two width modes

The system must support two visual modes:
	•	mobile;
	•	desktop.

FR-3. Desktop container behavior

On desktop, the interface must not occupy the full screen width. Content must be displayed inside a width-constrained container.

⸻

3.2. Sets List Screen

FR-4. Sets list screen

The system must display a screen with a list of available sets.

FR-5. Set card content

Each set card in the list must contain:
	•	the title;
	•	a short description;
	•	the number of phrases in the set.

FR-6. Last interaction display

For each set, the system must be able to display information about the user’s last interaction with that set, if such data is available.

FR-7. Navigate to set

When the user taps a set card, the system must navigate to the selected set screen.

FR-8. Empty state for no sets

If no sets are available, the sets list screen must display an empty state with a clear message.

⸻

3.3. Set Screen Structure

FR-9. Set screen composition

The set screen must contain:
	•	a header area;
	•	a phrase list;
	•	a fixed bottom control panel.

FR-10. Set header content

The top section of the screen must display:
	•	the set title;
	•	the set description.

FR-11. Empty state for set without phrases

If a set contains no phrases, the set screen must display an empty state with a clear message.

⸻

3.4. Bottom Control Panel

FR-12. Fixed bottom panel

The control panel must be fixed to the bottom of the screen and remain visible at all times.

FR-13. Back button

The panel must include a button for returning to the sets list.

FR-14. Favorites filter button

The panel must include a button for enabling and disabling the favorites-only filter.

FR-15. Disabled favorites filter

If the current set has no favorite phrases, the favorites filter button must be disabled.

FR-16. Progress bar

The panel must display a progress bar for the current phrase completion progress.

FR-17. Progress for full list

If the favorites filter is disabled, the progress bar must be calculated based on all phrases in the set.

FR-18. Progress for favorites list

If the favorites filter is enabled, the progress bar must be calculated only for the favorite phrases included in the current list.

FR-19. Play All button

The panel must include a button to start sequential playback of the current list of phrases.

FR-20. Play All states

The Play All button must have at least two states:
	•	Play All;
	•	Stop.

FR-21. Restart from beginning button

The panel must include a separate button for returning to the beginning of the current playback list.

⸻

3.5. Phrase List and Phrase Card

FR-22. Phrase list rendering

Phrases must be displayed as a vertical list of cards.

FR-23. Phrase language

The phrase text must always be displayed in English.

FR-24. Phrase text visibility

The text of each phrase must always be visible without expandable sections.

FR-25. Play button on phrase

Each phrase must have a Play button.

FR-26. Favorite toggle on phrase

Each phrase must have a button for toggling its favorite status.

FR-27. Active phrase highlighting

The active phrase must be visually distinguishable from the other cards.

FR-28. Phrase playback progress

A playback progress bar must be displayed on the phrase card while its audio is playing.

⸻

3.6. Single Phrase Playback

FR-29. Loading state on play

After the user presses Play, while the audio file is loading, the button must display a loading state.

FR-30. Playing state on play

When the audio file begins playback, the button must display a playing state.

FR-31. Disable repeated click on current phrase

During loading and playback, the Play button for the current phrase must be disabled to prevent repeated clicks.

FR-32. Only one audio at a time

At any given moment, the user must not be able to initiate simultaneous playback of more than one audio file.

FR-33. Manual playback updates active phrase

When the user manually starts playback for a phrase, that phrase must become the active phrase.

FR-34. Manual playback updates last active phrase

When the user manually starts playback for a phrase, the system must save it as the last active phrase for that set.

FR-35. Audio playback error feedback

If an audio file cannot be loaded or played, the system must show the user a short and clear error message.

FR-36. Retry after error

After an audio playback error, the user must be able to retry playback.

⸻

3.7. Favorites

FR-37. Add to favorites

The user must be able to add a phrase to favorites.

FR-38. Remove from favorites

The user must be able to remove a phrase from favorites.

FR-39. Favorites persistence

The list of favorite phrases must be stored locally for each set.

FR-40. Favorites filter affects current list

When the favorites filter is enabled, the current list must display only the favorite phrases of the current set.

FR-41. Empty state for no favorites

If the favorites filter is enabled but no matching phrases exist, the interface must display an empty state.

⸻

3.8. Play All

FR-42. Play All uses current list

Play All must use the current displayed list:
	•	all phrases if the favorites filter is disabled;
	•	only favorite phrases if the favorites filter is enabled.

FR-43. Sequential playback

After Play All starts, the system must play phrases sequentially from top to bottom.

FR-44. Stop behavior

During Play All, the button must switch to the Stop state and stop sequential playback when pressed.

FR-45. Resume after Stop

After Play All is stopped, the system must preserve the internal playback position in the queue. When Play All is started again, playback must resume from that position unless the user has explicitly reset the queue.

FR-46. Restart button behavior

The return-to-beginning button must reset the Play All cursor to the first phrase in the current list.

FR-47. Restart while playing

If Play All is active when the return-to-beginning button is pressed, the system must:
	1.	stop the current playback;
	2.	reset the Play All cursor to the first phrase;
	3.	keep the system in the stopped state.

FR-48. Auto-scroll during Play All

During Play All, the system must automatically scroll the list so that the currently playing phrase is brought into the visible area of the screen if it is not visible.

FR-49. Smooth auto-scroll

Auto-scrolling during Play All must be smooth.

FR-50. Manual phrase playback during Play All

While Play All is active, manual playback of an individual phrase must be prohibited.

FR-51. Play All does not update persisted last active phrase

Sequential playback of all phrases must not update the persisted last active phrase stored in localStorage.

⸻

3.9. Restoring Last Active Phrase

FR-52. Persist last active phrase per set

For each set, the system must save the identifier of the last active phrase that was manually started by the user via Play.

FR-53. Restore scroll position on reopen

When the user reopens a set, the system must scroll the list to the last saved active phrase.

FR-54. Scroll only when needed

Auto-scroll to the last saved active phrase must occur only if that phrase is not currently visible in the viewport.

⸻

3.10. Local Persistence

FR-55. Persist per-set user state

The system must store user state separately for each set.

FR-56. Persisted data structure

For each set, localStorage must contain:
	•	the timestamp of the last interaction;
	•	the identifier of the last active phrase;
	•	the list of favorite phrase identifiers.

FR-57. Restore local state on app load

When the application loads, the system must read the saved data from localStorage and restore the user state without requiring user authentication.

⸻

4. Business Rules

4.1. Progress Model

BR-1. Completed phrase rule

A phrase is considered completed if its audio has been played to the end at least once during the current session of the set screen.

BR-2. Progress scope

Progress is calculated only within the current session of the set screen and is not preserved when the screen is reopened.

BR-3. Completion condition

Pressing Play, loading audio, or partially playing audio does not count as completing a phrase. A phrase is considered completed only after playback finishes completely.

BR-4. No double counting

Repeating full playback of a phrase that has already been completed must not increase progress again.

BR-5. Progress in filtered mode

If the favorites filter is enabled, progress must be calculated based on the current filtered selection, taking into account the phrases already completed within that selection.

BR-6. Play All and progress

In Play All mode, a phrase must be considered completed according to the same rules as in manual playback.

4.2. Active Phrase

BR-7. Active phrase definition

A phrase is considered active if it:
	•	is currently being played; or
	•	was the last phrase manually started by the user via Play.

BR-8. Stop behavior and active phrase

After Play All is stopped, the last phrase at which playback was stopped may remain the active phrase, but this must not update the persisted last active phrase.

4.3. Last Interaction with Set

BR-9. Last interaction rule

The last interaction with a set is any of the following actions:
	•	starting Play for an individual phrase;
	•	starting Play All;
	•	toggling the favorite state of a phrase.

BR-10. Opening set is not interaction

Simply opening a set without taking any action does not update the last interaction timestamp.

4.4. Current List

BR-11. Current list definition

The current list is the set of phrases currently displayed on the screen after applying the active filter.

BR-12. Play All and current list

Play All always operates relative to the current list.

BR-13. Restart and current list

The return-to-beginning button always operates relative to the current list.

⸻

5. Non-Functional Requirements

5.1. UX and Usability

NFR-1. Minimal and understandable UI

The interface must be minimalistic and understandable without requiring user training.

NFR-2. Persistent access to main actions

Key actions on the set screen must be accessible without requiring the user to scroll to the top or bottom of the screen.

NFR-3. Clear control states

All interactive elements must have clearly distinguishable states:
	•	normal;
	•	loading;
	•	active;
	•	disabled.

NFR-4. No visual overload

Phrase cards must not be overloaded with secondary UI elements.

5.2. Performance

NFR-5. Fast initial interactivity

The sets list screen and the set screen must become interactive without noticeable delay.

NFR-6. Smooth scrolling

Scrolling through the phrase list must remain smooth.

NFR-7. Non-blocking audio handling

Audio loading and playback must not block the interface.

5.3. Reliability

NFR-8. Single audio guarantee

The system must guarantee that no more than one audio playback is active at a time.

NFR-9. Consistent UI state

The interface must not enter contradictory states, such as:
	•	loading and playing simultaneously for the same element;
	•	Play All being active when no playback queue exists;
	•	the favorites filter being active with no valid selection and without a proper empty state.

NFR-10. Safe localStorage failure handling

If localStorage is unavailable, the application must continue working without critical errors, but without restoring user state.

NFR-11. Safe audio failure handling

An audio loading or playback error must not cause the interface to hang or block retry actions.

5.4. Compatibility

NFR-12. Modern mobile browser support

The application must work correctly in current mobile browsers.

NFR-13. Desktop readability

On desktop, the application must preserve readability, proper spacing, and stable container width.

5.5. Accessibility

NFR-14. Touch target size

All interactive elements must have a sufficiently large tap area for mobile devices. The recommended minimum touch target size is 44 × 44 px.

NFR-15. Icon accessibility labels

Icons without visible text labels must have proper aria-label attributes.

Examples:
	•	aria-label="Back to sets"
	•	aria-label="Play phrase"
	•	aria-label="Add to favorites"
	•	aria-label="Show favorites only"

NFR-16. Active phrase contrast

The active phrase must have visually noticeable contrast relative to other cards.

NFR-17. Semantic interactive elements

Interactive actions must use semantically correct HTML elements, primarily button.

5.6. Architecture Constraints

NFR-18. No mandatory backend

The MVP must work without a mandatory backend.

NFR-19. No authentication required

The MVP must not require user authentication.

NFR-20. Local-first user state

User state in the MVP must be stored locally in the browser.

NFR-21. Extensible architecture

The architecture must allow the following features to be added later without major refactoring:
	•	phrase translation;
	•	repeat mode;
	•	backend synchronization;
	•	user accounts;
	•	progress analytics.

⸻

6. Data Model

6.1. Set Model

The minimum set model must include:
	•	id
	•	title
	•	description

6.2. Phrase Model

The minimum phrase model must include:
	•	id
	•	setId
	•	text
	•	audioSrc

6.3. Persisted User State Per Set

The minimum locally stored state model for a single set must include:
	•	lastInteractedAt
	•	lastActivePhraseId
	•	favoritePhraseIds: string[]

⸻

7. Empty States and Error States

7.1. No Sets State

If the sets list is empty, the user must see a clear message indicating that no sets are available.

7.2. No Phrases in Set State

If the selected set contains no phrases, the user must see a clear message indicating that the set is currently empty.

7.3. No Favorites State

If the favorites filter is enabled but no favorite phrases exist, the user must see a dedicated empty state.

7.4. Audio Error State

If audio cannot be loaded or played, the user must receive a short and clear error message, and the interface must return to a correct and controllable state.

⸻

8. Out of Scope for MVP

The following are out of scope for the MVP:
	•	backend and server-side data storage;
	•	authentication and user accounts;
	•	synchronization between devices;
	•	long-term learning analytics;
	•	phrase translation;
	•	playback speed control;
	•	shuffle mode;
	•	spaced repetition;
	•	user voice recording;
	•	pronunciation assessment.

⸻

9. Implementation Notes

9.1. Recommended UI labels

For a compact interface, the following labels may be used:
	•	Back — back arrow icon;
	•	Favorites Filter — star icon;
	•	Play All — Play icon + All;
	•	Stop — Stop icon;
	•	Restart from Beginning — skip-back icon.

9.2. Desktop simplification

For the desktop version, it is recommended to avoid designing a separate complex responsive grid and instead use a centered fixed-width container.

9.3. Scope control

Any features that do not directly support the core scenario of “open a set → listen to phrases → mark favorites → continue later” must be treated as post-MVP.

⸻

10. Data Integration Interfaces (Existing Files)

10.1. Purpose

The application must include explicit data integration interfaces to connect already existing local content stored in:
	•	`data/sets.json`
	•	`data/sets/*.json`
	•	`audio/*.mp3`

These interfaces define how static files are read, normalized, validated, and transformed into the internal app models from section 6.

10.2. Source Schemas (as-is)

The data source contracts are:

`data/sets.json` (set index):

```ts
type SourceSetListItem = {
  id: string;
  title: string;
  description: string;
  phraseCount: number;
  file: string; // e.g. "sets/the_universal_self_introduction_script.json"
};

type SourceSetList = SourceSetListItem[];
```

`data/sets/<set>.json` (set details):

```ts
type SourcePhrase = {
  id: string;
  text: string;
  audio: string; // current files use "audios/001.mp3"
};

type SourceSetDetails = {
  id: string;
  title: string;
  description: string;
  phrases: SourcePhrase[];
};
```

10.3. Required Integration Interfaces

The MVP implementation must define the following interfaces (or equivalent abstractions with the same responsibility boundaries):

```ts
type SetSummary = {
  id: string;
  title: string;
  description: string;
  phraseCount: number;
  sourceFile: string;
};

type Phrase = {
  id: string;
  setId: string;
  text: string;
  audioSrc: string;
};

type SetDetails = {
  id: string;
  title: string;
  description: string;
  phrases: Phrase[];
};

interface SetsDataSource {
  getSetSummaries(): Promise<SetSummary[]>;
  getSetDetails(setId: string): Promise<SetDetails>;
}

interface AudioPathResolver {
  resolveAudioSrc(inputAudioPath: string): string;
}

interface DataValidator {
  validateSetList(source: unknown): void;
  validateSetDetails(source: unknown, expectedSetId: string): void;
}
```

10.4. Mapping Rules

When converting source data to internal models, the system must apply these rules:
	1.	`SetSummary.sourceFile` is taken from `data/sets.json[file]`.
	2.	`SetDetails.id` must match the requested `setId`.
	3.	`Phrase.setId` is derived from the parent set id.
	4.	`Phrase.audioSrc` is produced only via `AudioPathResolver`.
	5.	`phraseCount` from set index is treated as metadata and must not replace actual phrase array length at runtime.

10.5. Audio Path Compatibility Rule

Current source files reference audio with prefix `audios/`, while actual files are stored in `audio/`.

`AudioPathResolver` must support this compatibility behavior:
	•	If `audio` starts with `audios/`, transform to `audio/` + remainder.
	•	If `audio` already starts with `audio/`, keep as-is.
	•	For any other prefix, treat as invalid input and return a controlled error.

Example:
	•	`audios/001.mp3` -> `audio/001.mp3`

10.6. Validation Requirements

Before data is used by UI, `DataValidator` must enforce:
	•	required fields are present and are strings/numbers of expected type;
	•	set ids are unique in `data/sets.json`;
	•	phrase ids are unique within a set;
	•	each set index `file` points to an existing JSON file under `data/sets/`;
	•	each phrase audio path resolves to an existing file under `audio/`;
	•	`phraseCount` mismatch versus real phrase count is reported as a non-fatal warning.

10.7. Error Contract for Integration Layer

The integration layer must return structured errors that can be mapped to the user-facing states from section 7.

Minimum error categories:
	•	`SET_LIST_LOAD_FAILED`
	•	`SET_DETAILS_LOAD_FAILED`
	•	`SET_NOT_FOUND`
	•	`INVALID_SET_SCHEMA`
	•	`INVALID_PHRASE_SCHEMA`
	•	`AUDIO_FILE_MISSING`

Each error must include:
	•	`code` (category)
	•	`message` (debug-readable)
	•	`context` (optional object with `setId`, `phraseId`, `sourcePath`).

10.8. Caching Contract

To keep screens responsive, the integration layer may cache loaded set index and set details in memory for the app session.

Cache rules for MVP:
	•	set list cache key: `sets.json`;
	•	set details cache key: `setId`;
	•	cache invalidation is not required for MVP because source files are static at runtime.

10.9. Testability Requirements for Interfaces

The integration interfaces must be testable independently from UI. At minimum, integration tests must cover:
	•	successful load of set list from `data/sets.json`;
	•	successful load of each set from `data/sets/*.json`;
	•	audio path transformation from `audios/*` to `audio/*`;
	•	handling of missing set file;
	•	handling of missing audio file;
	•	handling of invalid JSON schema.