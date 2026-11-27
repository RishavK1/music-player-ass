export default function PlaylistCard({ playlist, selected, onSelect }) {
  return (
    <button
      type="button"
      className="playlist-card"
      aria-pressed={selected}
      onClick={() => onSelect(playlist.id)}
    >
      <span className="min-w-0 text-sm font-medium">{playlist.name}</span>
      <span className="playlist-card-meta text-xs tabular-nums text-muted-foreground">
        <span>{playlist.songIds.length}<span className="sr-only"> songs</span></span>
        {selected && <><Icon name="check" size="small" /><span className="sr-only">Selected</span></>}
      </span>
    </button>
  );
}
import Icon from './ui/Icon.jsx';
