import { useRef, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import PlaylistPanel from './components/PlaylistPanel.jsx';
import SongLibrary from './components/SongLibrary.jsx';
import PlaylistDialog from './components/PlaylistDialog.jsx';
import usePlaylists from './hooks/usePlaylists.js';
import useSongs from './hooks/useSongs.js';
import Button from './components/ui/Button.jsx';
import Icon from './components/ui/Icon.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('library');
  const [dialog, setDialog] = useState(null);
  const createButtonRef = useRef(null);
  const collection = usePlaylists();
  const catalogue = useSongs();

  function selectPlaylist(id) {
    collection.select(id);
    setActiveView('playlist');
  }

  function openCreate() {
    setDialog({ mode: 'create' });
  }

  function savePlaylist(name) {
    if (dialog.mode === 'rename') {
      return collection.rename(dialog.playlist.id, name);
    }
    const error = collection.create(name);
    if (!error) setActiveView('playlist');
    return error;
  }

  return (
    <>
    <AppShell
      player={<PlayerBar />}
      playlists={collection.playlists}
      selectedId={collection.selectedPlaylist?.id}
      onSelectPlaylist={selectPlaylist}
      onCreatePlaylist={openCreate}
      createButtonRef={createButtonRef}
    >
      <header className="collection-header">
        <h1 className="text-2xl font-semibold tracking-display">
          Your collection
        </h1>
        <p className="sr-only" role="status" aria-atomic="true">
          {collection.announcement}
        </p>
        {collection.storageIssue && (
          <div className="storage-notice" role="alert">
            <p className="text-sm text-warning">
              {collection.storageIssue === 'invalid'
                ? 'Saved playlists are invalid. Changes will stay in this tab to avoid overwriting your saved data.'
                : 'Playlists couldn’t be saved. Changes may be lost when you leave this page.'}
            </p>
            {collection.storageIssue !== 'invalid' && (
              <Button variant="secondary" onClick={collection.retrySave}>
                Retry save
              </Button>
            )}
          </div>
        )}
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
        <SongLibrary
          active={activeView === 'library'}
          {...catalogue}
          playlists={collection.playlists}
          playlist={collection.selectedPlaylist}
          onSelect={collection.select}
          onAdd={collection.addSong}
          onCreate={openCreate}
        />
        <PlaylistPanel
          active={activeView === 'playlist'}
          playlist={collection.selectedPlaylist}
          playlists={collection.playlists}
          onSelect={selectPlaylist}
          onRename={(playlist) => setDialog({ mode: 'rename', playlist })}
          onDelete={(playlist) => setDialog({ mode: 'delete', playlist })}
          onCreate={openCreate}
          {...catalogue}
          onRemove={collection.removeSong}
          onMove={collection.moveSong}
          onBrowse={() => setActiveView('library')}
        />
      </div>

    </AppShell>
    {dialog && (
      <PlaylistDialog
        key={`${dialog.mode}-${dialog.playlist?.id ?? 'new'}`}
        mode={dialog.mode}
        playlist={dialog.playlist}
        onSave={savePlaylist}
        onDelete={collection.remove}
        onClose={() => setDialog(null)}
        fallbackFocusRef={createButtonRef}
      />
    )}
    </>
  );
}
