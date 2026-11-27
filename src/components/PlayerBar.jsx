import { useLayoutEffect, useRef } from 'react';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';

export default function PlayerBar({ player }) {
  const { song, playing } = player;
  const stateLabel = song ? (playing ? 'Playing' : 'Paused') : 'Idle';
  const playRef = useRef(null);
  const movedControl = useRef(null);

  useLayoutEffect(() => {
    const control = movedControl.current;
    if (control?.disabled) playRef.current?.focus();
    movedControl.current = null;
  }, [song?.id]);

  function move(event, action) {
    movedControl.current = event.currentTarget;
    action();
  }
  return (
    <footer className="player-bar" aria-label="Music player">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-control shrink-0 items-center justify-center rounded-control border border-border text-muted-foreground">
          <Icon name="record" size="large" />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-semibold">{song?.title ?? 'Nothing playing'}</p>
          <p className="text-xs text-muted-foreground">
            {song?.artist ?? 'Choose a song to begin.'}
          </p>
          <p className="text-xs text-muted-foreground md:hidden">
            {stateLabel}. Simulated playback.
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
          disabled={!player.canPrevious}
          aria-label="Previous song"
          title="Previous song"
          onClick={(event) => move(event, player.previous)}
        >
          <Icon name="previous" />
        </Button>
        <Button
          variant="primary"
          ref={playRef}
          iconOnly
          disabled={!song}
          aria-label={playing ? 'Pause' : 'Play'}
          title={playing ? 'Pause' : 'Play'}
          onClick={player.toggle}
          className="transport-play"
        >
          <Icon name={playing ? 'pause' : 'play'} size="large" />
        </Button>
        <Button
          variant="ghost"
          iconOnly
          disabled={!player.canNext}
          aria-label="Next song"
          title="Next song"
          onClick={(event) => move(event, player.next)}
        >
          <Icon name="next" />
        </Button>
      </div>

      <p className="hidden text-right text-xs text-muted-foreground md:block">
        {stateLabel}. Simulated playback.
      </p>
      <p className="sr-only" role="status" aria-atomic="true">
        {song ? `${stateLabel}: ${song.title} by ${song.artist}. Simulated playback.` : 'No song selected.'}
      </p>
    </footer>
  );
}
