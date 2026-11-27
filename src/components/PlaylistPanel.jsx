import EmptyState from './EmptyState.jsx';
import Button from './ui/Button.jsx';

export default function PlaylistPanel({
  active,
  playlist,
  playlists,
  onSelect,
  onRename,
  onDelete,
  onCreate,
}) {
  return (
    <section
      id="playlist"
      aria-labelledby="playlist-heading"
      data-active={active}
      className="playlist-panel min-w-0"
    >
      <h2
        id="playlist-heading"
        className="mb-4 text-lg font-semibold tracking-display"
      >
        Your playlist
      </h2>

      {playlists.length > 0 && (
        <div className="field mb-6 xl:hidden">
          <label htmlFor="selected-playlist" className="text-sm font-medium">
            Selected playlist
          </label>
          <div className="field-control">
            <select
              id="selected-playlist"
              className="field-input"
              value={playlist?.id ?? ''}
              onChange={(event) => onSelect(event.target.value)}
            >
              <option value="" disabled>
                Choose a playlist
              </option>
              {playlists.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {playlist ? (
        <div className="flex min-w-0 flex-col gap-6">
          <header className="flex min-w-0 flex-col gap-2">
            <h3 className="text-xl font-semibold tracking-display">
              {playlist.name}
            </h3>
            <p className="text-sm tabular-nums text-muted-foreground">
              {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}
            </p>
          </header>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Playlist actions">
            <Button variant="secondary" onClick={() => onRename(playlist)}>
              Rename
            </Button>
            <Button variant="destructive" onClick={() => onDelete(playlist)}>
              Delete
            </Button>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-sm font-medium">
              {playlist.songIds.length === 0 ? 'This playlist is empty.' : 'Your songs are saved.'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Adding and organising songs is the next step.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No playlist selected"
          action={
            <Button variant="secondary" onClick={onCreate}>New playlist</Button>
          }
          artwork={
            <div className="sleeve sleeve--compact" aria-hidden="true">
              <div className="sleeve-record">
                <div className="sleeve-label">
                  <span className="sleeve-spindle" />
                </div>
              </div>
            </div>
          }
        >
          Select a playlist to see its songs.
        </EmptyState>
      )}
    </section>
  );
}
