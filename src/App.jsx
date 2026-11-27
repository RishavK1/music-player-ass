import { useState } from 'react';
import AppShell from './components/AppShell.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import PlaylistPanel from './components/PlaylistPanel.jsx';
import SongLibrary from './components/SongLibrary.jsx';
import Button from './components/ui/Button.jsx';
import Icon from './components/ui/Icon.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('library');

  return (
    <AppShell player={<PlayerBar />}>
      <header className="flex flex-col gap-3 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-display md:text-4xl">
          Your collection
        </h1>
        <p className="max-w-copy text-sm text-muted-foreground">
          The songs you love. The order you choose.
        </p>
      </header>

      <div className="view-switcher" role="group" aria-label="Collection view">
        <Button
          variant="ghost"
          aria-pressed={activeView === 'library'}
          aria-controls="song-library"
          onClick={() => setActiveView('library')}
        >
          <Icon name="library" size="small" />
          Library
        </Button>
        <Button
          variant="ghost"
          aria-pressed={activeView === 'playlist'}
          aria-controls="playlist"
          onClick={() => setActiveView('playlist')}
        >
          <Icon name="playlist" size="small" />
          Playlist
        </Button>
      </div>

      <div className="workspace-panels">
        <SongLibrary active={activeView === 'library'} />
        <PlaylistPanel active={activeView === 'playlist'} />
      </div>

      <p
        id="foundation-note"
        className="mt-auto max-w-copy pt-4 text-xs leading-body text-muted-foreground"
      >
        Interface preview. Song loading, playlist editing, and playback controls
        are not connected yet.
      </p>
    </AppShell>
  );
}
