export const PLAYLIST_NAME_LIMIT = 120;

export function getPlaylistNameError(name, playlists, excludedId) {
  const trimmed = name.trim();

  if (!trimmed) return 'Enter a playlist name.';
  if (trimmed.length > PLAYLIST_NAME_LIMIT) {
    return `Use ${PLAYLIST_NAME_LIMIT} characters or fewer.`;
  }
  if (
    playlists.some(
      (playlist) =>
        playlist.id !== excludedId &&
        playlist.name.toLowerCase() === trimmed.toLowerCase(),
    )
  ) {
    return 'A playlist with this name already exists.';
  }

  return '';
}

export function validatePlaylists(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.playlists)) {
    throw new Error('Saved playlists have an unsupported format.');
  }

  const playlists = [];
  const ids = new Set();

  for (const playlist of value.playlists) {
    if (
      !playlist ||
      typeof playlist.id !== 'string' ||
      !playlist.id.trim() ||
      ids.has(playlist.id) ||
      typeof playlist.name !== 'string' ||
      getPlaylistNameError(playlist.name, playlists) ||
      !Array.isArray(playlist.songIds) ||
      !playlist.songIds.every((id) => typeof id === 'string' && id.trim()) ||
      new Set(playlist.songIds).size !== playlist.songIds.length
    ) {
      throw new Error('Saved playlists contain invalid data.');
    }

    ids.add(playlist.id);
    playlists.push({
      id: playlist.id,
      name: playlist.name.trim(),
      songIds: [...playlist.songIds],
    });
  }

  return playlists;
}

export function createPlaylist(playlists, name, id) {
  const error = getPlaylistNameError(name, playlists);
  if (error) throw new Error(error);
  if (!id || playlists.some((playlist) => playlist.id === id)) {
    throw new Error('Playlist ID must be unique.');
  }

  return [...playlists, { id, name: name.trim(), songIds: [] }];
}

export function renamePlaylist(playlists, id, name) {
  if (!playlists.some((playlist) => playlist.id === id)) {
    throw new Error('This playlist no longer exists.');
  }
  const error = getPlaylistNameError(name, playlists, id);
  if (error) throw new Error(error);

  return playlists.map((playlist) =>
    playlist.id === id ? { ...playlist, name: name.trim() } : playlist,
  );
}

export function deletePlaylist(playlists, id) {
  return playlists.filter((playlist) => playlist.id !== id);
}

export function addSongToPlaylist(playlists, playlistId, songId) {
  return playlists.map((playlist) =>
    playlist.id === playlistId && !playlist.songIds.includes(songId)
      ? { ...playlist, songIds: [...playlist.songIds, songId] }
      : playlist,
  );
}

export function removeSongFromPlaylist(playlists, playlistId, songId) {
  return playlists.map((playlist) =>
    playlist.id === playlistId && playlist.songIds.includes(songId)
      ? { ...playlist, songIds: playlist.songIds.filter((id) => id !== songId) }
      : playlist,
  );
}

export function movePlaylistSong(playlists, playlistId, songId, direction) {
  if (direction !== -1 && direction !== 1) return playlists;

  return playlists.map((playlist) => {
    if (playlist.id !== playlistId) return playlist;
    const index = playlist.songIds.indexOf(songId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= playlist.songIds.length) {
      return playlist;
    }
    const songIds = [...playlist.songIds];
    [songIds[index], songIds[nextIndex]] = [songIds[nextIndex], songIds[index]];
    return { ...playlist, songIds };
  });
}

export function getPlaylistDetails(playlist, songs) {
  const byId = new Map(songs.map((song) => [song.id, song]));
  const playlistSongs = playlist.songIds.map((id) => byId.get(id)).filter(Boolean);

  return {
    songs: playlistSongs,
    missingIds: playlist.songIds.filter((id) => !byId.has(id)),
    totalSeconds: playlistSongs.reduce((total, song) => total + song.duration, 0),
  };
}
