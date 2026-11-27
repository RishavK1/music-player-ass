# Music Playlist Manager

A React application for browsing a song library and organising personal playlists.

## Current status

The responsive interface foundation is in place: a collection sidebar, library
and playlist panels, shared controls, and an idle player bar. On smaller screens,
the Library and Playlist buttons switch between panels.

Search, genre filtering, playlist creation, and playback are intentionally
disabled until their functionality is implemented. No songs or playlists are
fabricated for the interface preview. Axios is installed for the next stage.

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

## Tech stack

- React
- Vite
- Tailwind CSS
- Axios
- Browser localStorage for playlist persistence in a later stage

## Structure

```text
public/
  favicon.svg
  fonts/
    Manrope-Variable.ttf
    OFL.txt
src/
  components/
    ui/
      Button.jsx
      Icon.jsx
      Input.jsx
    AppShell.jsx
    EmptyState.jsx
    PlayerBar.jsx
    PlaylistPanel.jsx
    SongLibrary.jsx
  styles/
    index.css
  App.jsx
  main.jsx
index.html
vite.config.js
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

- Song metadata will be loaded from `public/songs.json` using Axios.
- Playback will be simulated; no audio files or external music API are needed.
- Playlists will be saved in the current browser using localStorage.

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
