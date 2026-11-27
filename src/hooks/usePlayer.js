import { useEffect, useState } from 'react';
import {
  IDLE_PLAYBACK,
  getPlaybackQueue,
  reconcilePlayback,
  selectPlayback,
  stepPlayback,
} from '../utils/playback.js';

export default function usePlayer(songs, playlists) {
  const [stored, setStored] = useState(IDLE_PLAYBACK);
  const state = reconcilePlayback(stored, songs, playlists);
  const queue = getPlaybackQueue(state.source, songs, playlists);
  const index = queue.findIndex((song) => song.id === state.currentId);
  const song = queue[index] ?? null;

  useEffect(() => {
    setStored((previous) => reconcilePlayback(previous, songs, playlists));
  }, [songs, playlists]);

  function playSong(songId, source) {
    setStored((previous) => selectPlayback(
      reconcilePlayback(previous, songs, playlists), source, songId, songs, playlists,
    ));
  }

  function toggle() {
    setStored((previous) => {
      const current = reconcilePlayback(previous, songs, playlists);
      return current.currentId ? { ...current, playing: !current.playing } : current;
    });
  }

  function step(direction) {
    setStored((previous) => stepPlayback(
      reconcilePlayback(previous, songs, playlists), direction, songs, playlists,
    ));
  }

  return {
    song,
    playing: Boolean(song && state.playing),
    canPrevious: index > 0,
    canNext: index >= 0 && index < queue.length - 1,
    playSong,
    toggle,
    previous: () => step(-1),
    next: () => step(1),
  };
}
