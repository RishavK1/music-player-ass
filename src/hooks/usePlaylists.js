import { useEffect, useState } from 'react';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistNameError,
  renamePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  movePlaylistSong,
} from '../utils/playlists.js';
import { readPlaylists, writePlaylists } from '../utils/playlistStorage.js';

export default function usePlaylists() {
  const [initial] = useState(readPlaylists);
  const [collection, setCollection] = useState({
    playlists: initial.playlists,
    revision: 0,
  });
  const [selectedId, setSelectedId] = useState(initial.playlists[0]?.id ?? '');
  const [storageIssue, setStorageIssue] = useState(initial.issue);
  const [announcement, setAnnouncement] = useState('');
  const { playlists, revision } = collection;
  const selectedPlaylist =
    playlists.find((playlist) => playlist.id === selectedId) ?? null;

  useEffect(() => {
    if (revision === 0 || initial.issue === 'invalid') return;
    setStorageIssue(writePlaylists(playlists) ? null : 'unavailable');
  }, [playlists, revision, initial.issue]);

  function create(name) {
    const error = getPlaylistNameError(name, playlists);
    if (error) return error;
    const id = crypto.randomUUID();

    setCollection((previous) => ({
      playlists: createPlaylist(previous.playlists, name, id),
      revision: previous.revision + 1,
    }));
    setSelectedId(id);
    setAnnouncement(`Created “${name.trim()}”.`);
    return '';
  }

  function rename(id, name) {
    const error = getPlaylistNameError(name, playlists, id);
    if (error) return error;
    if (!playlists.some((playlist) => playlist.id === id)) {
      return 'This playlist no longer exists.';
    }

    setCollection((previous) => ({
      playlists: renamePlaylist(previous.playlists, id, name),
      revision: previous.revision + 1,
    }));
    setAnnouncement(`Renamed playlist to “${name.trim()}”.`);
    return '';
  }

  function remove(id) {
    const playlist = playlists.find((item) => item.id === id);
    if (!playlist) return;
    setCollection((previous) => ({
      playlists: deletePlaylist(previous.playlists, id),
      revision: previous.revision + 1,
    }));
    if (selectedId === id) {
      setSelectedId(playlists.find((item) => item.id !== id)?.id ?? '');
    }
    setAnnouncement(`Deleted “${playlist.name}”.`);
  }

  function retrySave() {
    if (initial.issue !== 'invalid') {
      setStorageIssue(writePlaylists(playlists) ? null : 'unavailable');
    }
  }

  function updateSongs(operation, playlistId, songId, announcementText) {
    setCollection((previous) => {
      const next = operation(previous.playlists, playlistId, songId);
      if (next.every((playlist, index) => playlist === previous.playlists[index])) {
        return previous;
      }
      return { playlists: next, revision: previous.revision + 1 };
    });
    setAnnouncement(announcementText);
  }

  function addSong(playlistId, song) {
    updateSongs(addSongToPlaylist, playlistId, song.id, `Added “${song.title}”.`);
  }

  function removeSong(playlistId, songId, title) {
    updateSongs(removeSongFromPlaylist, playlistId, songId, `Removed “${title}”.`);
  }

  function moveSong(playlistId, songId, direction, title) {
    const playlist = playlists.find((item) => item.id === playlistId);
    const index = playlist?.songIds.indexOf(songId) ?? -1;
    const target = index + direction;
    if (index < 0 || target < 0 || target >= playlist.songIds.length) return;
    updateSongs(
      (items, id, trackId) => movePlaylistSong(items, id, trackId, direction),
      playlistId,
      songId,
      `Moved “${title}” to position ${target + 1}.`,
    );
  }

  return {
    playlists,
    selectedPlaylist,
    select: setSelectedId,
    create,
    rename,
    remove,
    storageIssue,
    retrySave,
    announcement,
    addSong,
    removeSong,
    moveSong,
  };
}
