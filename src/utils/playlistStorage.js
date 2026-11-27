import { validatePlaylists } from './playlists.js';

export const PLAYLIST_STORAGE_KEY = 'music-playlist-manager:v1';

export function readPlaylists(storage) {
  let raw;

  try {
    raw = (storage ?? window.localStorage).getItem(PLAYLIST_STORAGE_KEY);
  } catch {
    return { playlists: [], issue: 'unavailable' };
  }

  if (raw === null) return { playlists: [], issue: null };

  try {
    return { playlists: validatePlaylists(JSON.parse(raw)), issue: null };
  } catch {
    return { playlists: [], issue: 'invalid' };
  }
}

export function writePlaylists(playlists, storage) {
  try {
    (storage ?? window.localStorage).setItem(
      PLAYLIST_STORAGE_KEY,
      JSON.stringify({ version: 1, playlists }),
    );
    return true;
  } catch {
    return false;
  }
}
