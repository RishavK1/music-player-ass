import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

export default function PlayerBar() {
  return (
    <footer className="player-bar" aria-label="Music player">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-control shrink-0 items-center justify-center rounded-control border border-border text-muted-foreground">
          <Icon name="record" size="large" />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-semibold">Nothing playing</p>
          <p className="text-xs text-muted-foreground">
            Choose a song to begin.
          </p>
        </div>
      </div>

      <div
        role="group"
        aria-label="Playback controls"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <Button
          variant="ghost"
          iconOnly
          disabled
          aria-label="Previous song"
          title="Playback is not connected yet"
        >
          <Icon name="previous" />
        </Button>
        <Button
          variant="primary"
          iconOnly
          disabled
          aria-label="Play"
          title="Playback is not connected yet"
          className="transport-play"
        >
          <Icon name="play" size="large" />
        </Button>
        <Button
          variant="ghost"
          iconOnly
          disabled
          aria-label="Next song"
          title="Playback is not connected yet"
        >
          <Icon name="next" />
        </Button>
      </div>

      <p className="hidden text-right text-xs text-muted-foreground md:block">
        Simulated playback
      </p>
    </footer>
  );
}
