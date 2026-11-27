# Music Playlist Manager

A React application for browsing a song library and organising personal playlists.

## Current status

Initial project setup. React, Vite, and Tailwind CSS are configured. Axios is
installed for loading the song catalogue in the next stage. Playlist management
and playback controls are not implemented yet.

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
src/
  styles/
    index.css
  App.jsx
  main.jsx
index.html
vite.config.js
```

## Implementation stages

1. Project setup.
2. Song catalogue, loading states, search, and genre filtering.
3. Playlist creation, renaming, deletion, and local persistence.
4. Song membership, ordering, and playlist summaries.
5. Simulated playback controls.
6. Responsive polish, accessibility checks, and deployment.

## Assumptions

- Song metadata will be loaded from `public/songs.json` using Axios.
- Playback will be simulated; no audio files or external music API are needed.
- Playlists will be saved in the current browser using localStorage.

## Development notes

Dependency versions are pinned and `package-lock.json` is committed. Dependency
lifecycle scripts are disabled through `.npmrc`. The current build uses published
precompiled tooling and does not require enabling install scripts.

## Future improvements

After the core functionality is complete, potential improvements include automated
interaction tests, drag-and-drop ordering, and real audio playback.
