import { formatDuration } from '../utils/formatDuration.js';

export default function SongRow({ song, actions }) {
  return (
    <li className="song-row">
      <p className="song-title min-w-0 text-sm font-semibold">{song.title}</p>
      <p className="song-artist min-w-0 text-sm text-muted-foreground">
        <span className="sr-only">Artist: </span>
        {song.artist}
      </p>
      <p className="song-genre min-w-0 text-sm text-muted-foreground">
        <span className="sr-only">Genre: </span>
        {song.genre}
      </p>
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
