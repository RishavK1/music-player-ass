import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

export default function PlaybackButton({ song, player, source }) {
  const playing = player.song?.id === song.id && player.playing;
  const label = `${playing ? 'Pause' : 'Play'} ${song.title}`;

  return (
    <Button
      variant="ghost"
      iconOnly
      className="song-play"
      aria-label={label}
      title={label}
      onClick={() => player.playSong(song.id, source)}
    >
      <Icon name={playing ? 'pause' : 'play'} size="small" />
    </Button>
  );
}
