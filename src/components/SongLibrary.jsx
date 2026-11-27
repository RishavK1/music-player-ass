import { useRef, useState } from 'react';
import { filterSongs, getGenres } from '../utils/songs.js';
import EmptyState from './EmptyState.jsx';
import SongRow from './SongRow.jsx';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import Input from './ui/Input.jsx';

export default function SongLibrary({
  active, songs, status, retry, playlists, playlist, onSelect, onAdd, onCreate,
}) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const searchRef = useRef(null);
  const genres = getGenres(songs);
  const visibleSongs = filterSongs(songs, query, genre);
  const hasFilters = Boolean(query || genre);
  const isFiltered = Boolean(query.trim() || genre);
  const isReady = status === 'success';
  const songLabel = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`;
  const resultLabel =
    status === 'loading'
      ? 'Loading songs...'
      : status === 'error'
        ? 'Songs unavailable'
        : isFiltered
          ? `${visibleSongs.length} of ${songLabel}`
          : songLabel;

  function clearFilters() {
    setQuery('');
    setGenre('');
    searchRef.current?.focus();
  }

  return (
    <section
      id="song-library"
      aria-labelledby="library-heading"
      data-active={active}
      className="library-panel min-w-0"
    >
      <header className="library-heading">
        <h2 id="library-heading" className="text-xl font-semibold tracking-display">
          Song library
        </h2>
      </header>

      <div className="library-toolbar">
        <Input
          ref={searchRef}
          label="Search songs"
          type="search"
          placeholder="Song title or artist"
          icon={<Icon name="search" size="small" />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={!isReady}
        />
        <div className="field">
          <label htmlFor="genre" className="text-sm font-medium">
            Genre
          </label>
          <div className="field-control">
            <select
              id="genre"
              className="field-input"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              disabled={!isReady}
            >
              <option value="">All genres</option>
              {genres.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="playlist-destination">
        {playlists.length ? (
          <div className="field">
            <label htmlFor="add-destination" className="text-sm font-medium">
              Add songs to
            </label>
            <div className="field-control">
              <select
                id="add-destination"
                className="field-input"
                value={playlist?.id ?? ''}
                onChange={(event) => onSelect(event.target.value)}
              >
                {playlists.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">Create a playlist to add songs.</p>
            <Button variant="secondary" onClick={onCreate}>New playlist</Button>
          </div>
        )}
      </div>

      <div className="library-status">
        <p role="status" aria-atomic="true" className="text-sm text-muted-foreground">
          {resultLabel}
        </p>
        {hasFilters && (visibleSongs.length > 0 || !isReady) && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div
        className="library-results"
        aria-label="Song results"
        tabIndex={0}
        aria-busy={status === 'loading'}
      >
        <div
          aria-hidden="true"
          className="library-columns border-b border-border py-4 text-xs font-medium text-muted-foreground"
        >
          <span>Song</span>
          <span>Artist</span>
          <span>Genre</span>
          <span className="text-right">Duration</span>
          <span className="text-right">Add</span>
        </div>
        {status === 'loading' ? (
          <ul aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="song-row">
                <span className="song-title">
                  <span className="skeleton-line w-3/4" />
                </span>
                <span className="song-artist">
                  <span className="skeleton-line w-2/3" />
                </span>
                <span className="song-genre">
                  <span className="skeleton-line w-1/2" />
                </span>
                <span className="song-duration">
                  <span className="skeleton-line" />
                </span>
              </li>
            ))}
          </ul>
        ) : status === 'error' ? (
          <div className="flex min-h-empty items-center py-12">
            <EmptyState
              title="Couldn’t load your songs"
              action={<Button onClick={retry}>Retry</Button>}
            >
              The song catalogue couldn’t be read. Try loading it again.
            </EmptyState>
          </div>
        ) : songs.length === 0 ? (
          <div className="flex min-h-empty items-center py-12">
            <EmptyState title="No songs in the library">
              The catalogue is empty. Songs will appear here once they’ve been
              added to the collection.
            </EmptyState>
          </div>
        ) : visibleSongs.length === 0 ? (
          <div className="flex min-h-empty items-center py-12">
            <EmptyState
              title="No songs found"
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            >
              No songs match your search and genre selection. Try another
              artist, a shorter title, or clear your filters.
            </EmptyState>
          </div>
        ) : (
          <ul aria-label="Songs">
            {visibleSongs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                actions={
                  <Button
                    variant="ghost"
                    iconOnly
                    className="song-add"
                    disabled={!playlist || playlist.songIds.includes(song.id)}
                    aria-label={
                      playlist?.songIds.includes(song.id)
                        ? `Already added: ${song.title}`
                        : playlist
                          ? `Add ${song.title} to ${playlist.name}`
                          : `Create a playlist to add ${song.title}`
                    }
                    title={playlist?.songIds.includes(song.id) ? 'Added' : 'Add song'}
                    onClick={() => onAdd(playlist.id, song)}
                  >
                    {playlist?.songIds.includes(song.id)
                      ? <Icon name="check" size="small" />
                      : <Icon name="plus" size="small" />}
                  </Button>
                }
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
