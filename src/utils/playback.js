export const IDLE_PLAYBACK = { source: null, currentId: null, playing: false };

export function getPlaybackQueue(source, songs, playlists) {
  if (source?.type === 'library') return songs;
  if (source?.type !== 'playlist') return [];
  const playlist = playlists.find((item) => item.id === source.id);
  if (!playlist) return [];
  const byId = new Map(songs.map((song) => [song.id, song]));
  return playlist.songIds.map((id) => byId.get(id)).filter(Boolean);
}

export function reconcilePlayback(state, songs, playlists) {
  if (!state.currentId) return state;
  const queue = getPlaybackQueue(state.source, songs, playlists);
  return queue.some((song) => song.id === state.currentId) ? state : IDLE_PLAYBACK;
}

export function selectPlayback(state, source, songId, songs, playlists) {
  const queue = getPlaybackQueue(source, songs, playlists);
  if (!queue.some((song) => song.id === songId)) return state;
  return {
    source,
    currentId: songId,
    playing: state.currentId === songId ? !state.playing : true,
  };
}

export function stepPlayback(state, direction, songs, playlists) {
  if (direction !== -1 && direction !== 1) return state;
  const queue = getPlaybackQueue(state.source, songs, playlists);
  const index = queue.findIndex((song) => song.id === state.currentId);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= queue.length) return state;
  return { ...state, currentId: queue[next].id };
}
