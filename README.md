# Music Playlist Manager

A React application for browsing a song library and organising personal playlists.

## Features

- Browse 12 songs loaded from `public/songs.json` using Axios.
- Search by title or artist and filter by genre.
- Create, rename, and delete playlists with name validation and delete confirmation.
- Add and remove songs, prevent duplicates, and reorder with Up/Down controls.
- View live song counts and total playlist durations.
- Save playlists and song order in localStorage.
- Use simulated Play/Pause and Next/Previous controls with visible playback states.
- Switch between Library and Playlist views on smaller screens without losing filters.
- Keyboard-accessible controls, labelled dialogs, and loading, empty, and error states.

Playback is simulated, as required by the assessment; the application does not
play audio.

## Requirements

- Node.js 22.12+ on the 22.x release line, or Node.js 24+
- npm

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Tests

```sh
npm test
```

Uses Node's built-in test runner with no additional test dependencies. Tests cover
catalogue validation, search and filtering, playlist validation and ordering,
duration calculations, storage failures, and playback state transitions.

### Manual checks

1. Create a playlist; check blank and duplicate names are rejected.
2. Search by title/artist, combine with genre, then clear filters.
3. Add three songs; check duplicate Add is disabled and summaries update.
4. Reorder songs and refresh; confirm membership and order persist.
5. Rename the playlist; cancel deletion, then confirm deletion of a test playlist.
6. Play from Library or a playlist. Pause, then use Next/Previous; confirm the
   paused state is retained and navigation stops at queue boundaries.
7. Remove the current song or delete its source playlist; confirm playback stops.
8. Check keyboard focus, dialog Escape/Cancel, and layouts at 375, 768, and
   1440 CSS px. The player should not cover the workspace's final content.

## Static deployment

Build command: `npm run build`. Publish directory: `dist`.

Deploy at the domain root with HTTPS. Serve `songs.json`, `fonts/`, and `assets/`
as static files; they must not be replaced with an HTML fallback. No backend,
environment variables, API keys, or external music service are required.

The current asset paths assume root hosting. Hosting under a URL subdirectory
requires updating Vite's base and the catalogue/font asset paths first.

## Tech stack

- React
- Vite
- Tailwind CSS
- Axios
- Browser localStorage for playlist persistence

## Project structure

```text
public/
  songs.json          # Song catalogue
  fonts/              # Self-hosted Manrope font and licence
src/
  components/         # Library, playlists, player, and shared UI controls
  hooks/              # Catalogue loading, playlist state, and playback
  utils/              # Validation, filtering, storage, and queue operations
  styles/             # Theme, layout, and control styles
  App.jsx             # Application composition
tests/                # Node test suites
```

## Behaviour and data

- Song metadata is loaded from `public/songs.json` using Axios.
- Songs and artists in the mock catalogue are fictional. IDs are unique strings,
  and durations are non-negative whole seconds. Invalid catalogues show an error.
- Search is case-insensitive, matches titles or artists, and trims surrounding
  spaces. Search and genre filters are combined with AND.
- Playback is simulated; no audio, elapsed timer, external music API, or streaming.
  Select a song using its play icon. Clicking the current song toggles pause.
- Next/Previous follow the full catalogue when started from Library, or live
  playlist order when started from a playlist. Search does not change that queue.
  Buttons stop at boundaries and preserve the playing/paused state.
- Removing the current song or deleting its source playlist clears playback.
  Playback is session-only and returns to idle after refresh; playlists persist.
- Playlist names are trimmed, limited to 120 characters and compared
  case-insensitively. Renaming to the current name is allowed.
- Playlists are saved under `music-playlist-manager:v1` in the current browser.
  This does not sync between devices. Invalid saved data is preserved rather
  than overwritten; the app then works in session-only mode with a warning.
- Blocked storage or quota errors display a warning and a Retry save action.
- A saved song missing from the current catalogue remains visible as unavailable
  and can be removed or reordered. Duration totals cover available songs only.

## Development notes

Dependency versions are pinned in `package.json` and `package-lock.json`.
Dependency lifecycle scripts are disabled through `.npmrc`.

The Manrope variable font is self-hosted with its SIL Open Font License in
`public/fonts/OFL.txt`. Icons and the record-sleeve illustration are authored
locally. The application makes no font-service requests at runtime.
