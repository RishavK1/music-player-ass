import { formatDuration } from '../utils/formatDuration.js';

export default function SongRow({ song, actions, compact = false, position, playbackState }) {
  return (
    <li className={`song-row${compact ? ' song-row--compact' : ''}`} data-current={Boolean(playbackState)}>
      <p className="song-title min-w-0 text-sm font-semibold">
        {position && <span className="text-muted-foreground">{position}. </span>}
        {song.title}
        {playbackState && <span className="song-playback-state">{playbackState}</span>}
      </p>
      {compact ? (
        <div className="song-metadata text-sm text-muted-foreground">
          <p><span className="sr-only">Artist: </span>{song.artist}</p>
          <p><span className="sr-only">Genre: </span>{song.genre}</p>
        </div>
      ) : (
        <>
          <p className="song-artist min-w-0 text-sm text-muted-foreground">
            <span className="sr-only">Artist: </span>
            {song.artist}
          </p>
          <p className="song-genre min-w-0 text-sm text-muted-foreground">
            <span className="sr-only">Genre: </span>
            {song.genre}
          </p>
        </>
      )}
      <time
        className="song-duration text-sm tabular-nums text-muted-foreground"
        dateTime={`PT${song.duration}S`}
      >
        <span className="sr-only">Duration: </span>
        {formatDuration(song.duration)}
      </time>
      {actions && <div className="song-actions">{actions}</div>}
    </li>
  );
}
