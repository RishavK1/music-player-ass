import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

export default function AppShell({ children, player }) {
  return (
    <div className="app-frame">
      <a href="#main-content" className="skip-link">
        Skip to collection
      </a>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Collection navigation">
          <div className="flex items-center justify-between gap-4 p-4 md:p-6 xl:flex-col xl:items-stretch xl:gap-8 xl:py-8">
            <a
              href="/"
              className="flex min-h-control min-w-0 items-center gap-3 rounded-control"
            >
              <Icon name="record" className="size-wordmark text-primary" />
              <span className="flex min-w-0 flex-col">
                <span className="text-xl font-bold tracking-display">Music</span>
                <span className="text-xs text-muted-foreground">
                  Playlist manager
                </span>
              </span>
            </a>

            <Button
              variant="secondary"
              disabled
              aria-describedby="foundation-note"
              title="Playlist creation is not connected yet"
            >
              <Icon name="plus" size="small" />
              New playlist
            </Button>
          </div>

          <div className="desktop-playlists flex-col gap-8 px-6 pb-8">
            <nav aria-label="Library">
              <a
                href="#song-library"
                aria-current="page"
                className="flex min-h-control items-center gap-3 rounded-control bg-accent px-4 py-3 text-sm font-semibold"
              >
                <Icon name="library" />
                Song library
              </a>
            </nav>

            <section aria-labelledby="sidebar-playlists" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 id="sidebar-playlists" className="text-sm font-semibold">
                  Your playlists
                </h2>
                <span className="text-sm tabular-nums text-muted-foreground">
                  0
                </span>
              </div>
              <p className="text-sm leading-body text-muted-foreground">
                A home for your favourite combinations. Your playlists will
                appear here.
              </p>
            </section>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="workspace flex flex-col gap-8 px-4 py-8 md:px-6 xl:px-8"
        >
          {children}
        </main>
      </div>

      {player}
    </div>
  );
}
