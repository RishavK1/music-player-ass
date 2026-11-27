import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import PlaylistCard from './PlaylistCard.jsx';

export default function AppShell({
  children,
  player,
  playlists,
  selectedId,
  onSelectPlaylist,
  onCreatePlaylist,
  createButtonRef,
}) {
  return (
    <div className="app-frame">
      <a href="#main-content" className="skip-link">
        Skip to collection
      </a>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Collection navigation">
          <div className="sidebar-header">
            <a
              href="/"
              className="flex min-h-control min-w-0 items-center gap-3 rounded-control"
            >
              <Icon name="record" size="large" className="text-primary" />
              <span className="flex min-w-0 flex-col">
                <span className="text-lg font-semibold tracking-display">Music</span>
                <span className="text-xs text-muted-foreground">
                  Playlist manager
                </span>
              </span>
            </a>

            <Button
              ref={createButtonRef}
              variant="ghost"
              className="sidebar-create"
              onClick={onCreatePlaylist}
            >
              <Icon name="plus" size="small" />
              New playlist
            </Button>
          </div>

          <div className="desktop-playlists flex-col gap-6 px-4 pb-4">
            <nav aria-label="Library">
              <a
                href="#song-library"
                className="sidebar-library"
              >
                <Icon name="library" size="small" />
                Library
              </a>
            </nav>

            <section aria-labelledby="sidebar-playlists" className="sidebar-collection">
              <div className="flex shrink-0 items-center justify-between gap-3">
                <h2 id="sidebar-playlists" className="text-sm font-medium text-muted-foreground">
                  Playlists
                </h2>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {playlists.length}
                </span>
              </div>
              {playlists.length === 0 ? (
                <p className="text-sm text-muted-foreground">No playlists yet.</p>
              ) : (
                <ul className="playlist-list" aria-label="Your playlists">
                  {playlists.map((playlist) => (
                    <li key={playlist.id}>
                      <PlaylistCard
                        playlist={playlist}
                        selected={playlist.id === selectedId}
                        onSelect={onSelectPlaylist}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="workspace"
        >
          {children}
        </main>
      </div>

      {player}
    </div>
  );
}
