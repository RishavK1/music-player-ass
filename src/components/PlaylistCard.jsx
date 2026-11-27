export default function PlaylistCard({ playlist, selected, onSelect }) {
  return (
    <button
      type="button"
      className="playlist-card"
      aria-pressed={selected}
      onClick={() => onSelect(playlist.id)}
    >
      <span className="min-w-0 text-sm font-semibold">{playlist.name}</span>
      <span className="text-xs text-muted-foreground">
        {selected ? 'Selected' : `${playlist.songIds.length} songs`}
      </span>
    </button>
  );
}
