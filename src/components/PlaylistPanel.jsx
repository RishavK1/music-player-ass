import EmptyState from './EmptyState.jsx';
import Button from './ui/Button.jsx';
import SongRow from './SongRow.jsx';
import Icon from './ui/Icon.jsx';
import { getPlaylistDetails } from '../utils/playlists.js';
import { formatTotalDuration } from '../utils/formatDuration.js';

export default function PlaylistPanel({
  active,
  playlist,
  playlists,
  onSelect,
  onRename,
  onDelete,
  onCreate,
  songs, status, retry, onRemove, onMove, onBrowse,
}) {
  const details = playlist ? getPlaylistDetails(playlist, songs) : null;
  const movedControl = useRef(null);

  useLayoutEffect(() => {
    const control = movedControl.current;
    if (!control) return;
    const target = control.disabled
      ? control.closest('li')?.querySelector('button:not(:disabled)')
      : control;
    target?.focus();
    movedControl.current = null;
  }, [playlist?.songIds]);

  function move(event, id, direction, title) {
    movedControl.current = event.currentTarget;
    onMove(playlist.id, id, direction, title);
  }

  function remove(event, songId, title) {
    const row = event.currentTarget.closest('li');
    const neighbour = row.nextElementSibling ?? row.previousElementSibling;
    const target = neighbour?.querySelector('button:not(:disabled)')
      ?? document.getElementById('selected-playlist-name');
    target?.focus();
    onRemove(playlist.id, songId, title);
  }

  return (
    <section
      id="playlist"
      aria-labelledby="playlist-heading"
      data-active={active}
      className="playlist-panel min-w-0"
    >
      <div className="playlist-heading-row">
        <h2
        id="playlist-heading"
        className="text-lg font-semibold tracking-display"
      >
        Playlist
      </h2>
        {playlist && (
          <div className="playlist-tools" role="group" aria-label="Playlist actions">
            <Button variant="ghost" iconOnly title="Rename playlist" aria-label="Rename playlist" onClick={() => onRename(playlist)}>
              <Icon name="edit" />
            </Button>
            <Button variant="ghost" iconOnly title="Delete playlist" aria-label="Delete playlist" onClick={() => onDelete(playlist)}>
              <Icon name="trash" />
            </Button>
          </div>
        )}
      </div>

      {playlists.length > 0 && (
        <div className="field mb-4 xl:hidden">
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
        <div className="playlist-content">
          <header className="playlist-summary">
            <h3 id="selected-playlist-name" tabIndex={-1} className="text-xl font-semibold tracking-display">
              {playlist.name}
            </h3>
            <p className="text-sm tabular-nums text-muted-foreground">
              {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'},{' '}
              {status === 'success'
                ? `${formatTotalDuration(details.totalSeconds)}${details.missingIds.length ? ' available' : ' total'}`
                : 'Duration unavailable'}
            </p>
          </header>
          <Button variant="ghost" className="browse-songs xl:hidden" onClick={onBrowse}>
            <Icon name="plus" size="small" /> Add songs
          </Button>
          <div className="playlist-results" tabIndex={0} aria-label="Playlist songs">
            {status === 'loading' ? (
              <p className="text-sm text-muted-foreground" role="status">Loading playlist songs...</p>
            ) : status === 'error' ? (
              <EmptyState title="Couldn’t load playlist songs" action={<Button onClick={retry}>Retry</Button>}>
                Your saved playlist is unchanged.
              </EmptyState>
            ) : playlist.songIds.length === 0 ? (
              <EmptyState title="This playlist is empty." action={
                <Button variant="secondary" className="browse-songs" onClick={onBrowse}>Browse songs</Button>
              }>
                Add songs from the library to build your playlist.
              </EmptyState>
            ) : (
              <ul aria-label="Ordered playlist songs">
                {playlist.songIds.map((id, index) => {
                  const song = details.songs.find((item) => item.id === id);
                  const title = song?.title ?? `Unavailable song (${id})`;
                  const actions = (
                    <>
                      <Button
                        variant="ghost"
                        iconOnly
                        title="Move up"
                        aria-label={`Move ${title} up`}
                        disabled={index === 0}
                        onClick={(event) => move(event, id, -1, title)}
                      ><Icon name="up" /></Button>
                      <Button
                        variant="ghost"
                        iconOnly
                        title="Move down"
                        aria-label={`Move ${title} down`}
                        disabled={index === playlist.songIds.length - 1}
                        onClick={(event) => move(event, id, 1, title)}
                      ><Icon name="down" /></Button>
                      <Button
                        variant="ghost"
                        iconOnly
                        title="Remove song"
                        aria-label={`Remove ${title}`}
                        onClick={(event) => remove(event, id, title)}
                      ><Icon name="close" size="small" /></Button>
                    </>
                  );
                  return song ? (
                    <SongRow key={id} song={song} compact position={index + 1} actions={actions} />
                  ) : (
                    <li key={id} className="song-row song-row--compact">
                      <p className="song-title text-sm">{index + 1}. {title}</p>
                      <p className="song-artist text-sm text-muted-foreground">Not in the current catalogue.</p>
                      <div className="song-actions">{actions}</div>
                    </li>
                  );
                })}
              </ul>
            )}
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
import { useLayoutEffect, useRef } from 'react';
