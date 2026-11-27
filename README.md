# Music Playlist Manager

A React application for browsing a song library and organising personal playlists.

## Current status

The song library loads 12 mock songs with Axios from `public/songs.json`. Search
by title or artist and combine it with a genre filter. Song rows show titles,
artists, genres, and durations, with responsive layouts for small screens.

Loading, empty catalogue, no-results, and recoverable error states are included.
On smaller screens, the Library and Playlist buttons switch between panels
without resetting the search.

Create, select, rename, and delete playlists with confirmation. Names are required
and case-insensitively unique. Playlists persist in localStorage across refreshes.
Add or remove songs, prevent duplicates, and change playlist order with Up/Down
buttons. Counts and total durations update immediately. Membership and order
persist across refreshes. Simulated playback follows in the next stage.

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

Uses Node's built-in test runner. Tests cover catalogue validation, title/artist
search, combined filtering, genre derivation, duration formatting, playlist
validation, membership, ordering, computed summaries, immutable operations, and
storage failures.

## Tech stack

- React
- Vite
- Tailwind CSS
- Axios
- Browser localStorage for playlist persistence

## Structure

```text
public/
  favicon.svg
  songs.json
  fonts/
    Manrope-Variable.ttf
    OFL.txt
src/
  components/
    ui/
      Button.jsx
      Icon.jsx
      Input.jsx
      Modal.jsx
    AppShell.jsx
    EmptyState.jsx
    PlayerBar.jsx
    PlaylistPanel.jsx
    PlaylistCard.jsx
    PlaylistDialog.jsx
    SongLibrary.jsx
    SongRow.jsx
  hooks/
    useSongs.js
    usePlaylists.js
  utils/
    formatDuration.js
    songs.js
    playlists.js
    playlistStorage.js
  styles/
    index.css
  App.jsx
  main.jsx
index.html
vite.config.js
tests/
  songs.test.js
  playlists.test.js
```

## Implementation stages

1. Project setup.
2. Responsive interface foundation and reusable controls.
3. Song catalogue, loading states, search, and genre filtering.
4. Playlist creation, renaming, deletion, and local persistence.
5. Song membership, ordering, and playlist summaries.
6. Simulated playback controls.
7. Responsive polish, accessibility checks, and deployment.

## Assumptions

- Song metadata is loaded from `public/songs.json` using Axios.
- Songs and artists in the mock catalogue are fictional. IDs are unique strings,
  and durations are non-negative whole seconds. Invalid catalogues show an error.
- Search is case-insensitive, matches titles or artists, and trims surrounding
  spaces. Search and genre filters are combined with AND.
- Playback will be simulated; no audio files or external music API are needed.
- Playlist names are trimmed, limited to 120 characters and compared
  case-insensitively. Renaming to the current name is allowed.
- Playlists are saved under `music-playlist-manager:v1` in the current browser.
  This does not sync between devices. Invalid saved data is preserved rather
  than overwritten; the app then works in session-only mode with a warning.
- Blocked storage or quota errors display a warning and a Retry save action.
- A saved song missing from the current catalogue remains visible as unavailable
  and can be removed or reordered. Duration totals cover available songs only.

## Development notes

Dependency versions are pinned and `package-lock.json` is committed. Dependency
lifecycle scripts are disabled through `.npmrc`. The current build uses published
precompiled tooling and does not require enabling install scripts.

The Manrope variable font is self-hosted with its SIL Open Font License in
`public/fonts/OFL.txt`. Icons and the record-sleeve illustration are authored
locally. The application makes no font-service requests at runtime.

## Future improvements

After the core functionality is complete, potential improvements include automated
interaction tests, drag-and-drop ordering, and real audio playback.
