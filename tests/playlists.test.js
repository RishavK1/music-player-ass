import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistNameError,
  renamePlaylist,
  validatePlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  movePlaylistSong,
  getPlaylistDetails,
} from '../src/utils/playlists.js';
import { formatTotalDuration } from '../src/utils/formatDuration.js';
import {
  PLAYLIST_STORAGE_KEY,
  readPlaylists,
  writePlaylists,
} from '../src/utils/playlistStorage.js';

const seed = [
  { id: 'focus', name: 'Focus', songIds: ['song-001', 'song-002'] },
  { id: 'weekend', name: 'Weekend', songIds: [] },
];

test('add appends once and preserves other playlists', () => {
  const added = addSongToPlaylist(seed, 'focus', 'song-003');
  assert.deepEqual(added[0].songIds, ['song-001', 'song-002', 'song-003']);
  assert.equal(added[1], seed[1]);
  assert.equal(seed[0].songIds.length, 2);
  const duplicate = addSongToPlaylist(added, 'focus', 'song-003');
  assert.equal(duplicate[0], added[0]);
});

test('membership is independent between playlists', () => {
  const added = addSongToPlaylist(seed, 'weekend', 'song-001');
  const removed = removeSongFromPlaylist(added, 'focus', 'song-001');
  assert.deepEqual(removed[0].songIds, ['song-002']);
  assert.deepEqual(removed[1].songIds, ['song-001']);
  assert.equal(removed[1], added[1]);
});

test('missing song and playlist removal are no-ops', () => {
  assert.equal(removeSongFromPlaylist(seed, 'focus', 'missing')[0], seed[0]);
  assert.deepEqual(removeSongFromPlaylist(seed, 'missing', 'song-001'), seed);
  assert.deepEqual(addSongToPlaylist(seed, 'missing', 'song-001'), seed);
});

test('move swaps neighbours immutably in either direction', () => {
  const down = movePlaylistSong(seed, 'focus', 'song-001', 1);
  assert.deepEqual(down[0].songIds, ['song-002', 'song-001']);
  assert.equal(down[1], seed[1]);
  assert.deepEqual(movePlaylistSong(down, 'focus', 'song-001', -1), seed);
  assert.deepEqual(seed[0].songIds, ['song-001', 'song-002']);
});

test('boundary moves, missing IDs, and invalid directions are no-ops', () => {
  for (const [id, direction] of [['song-001', -1], ['song-002', 1], ['missing', 1], ['song-001', 2]]) {
    assert.equal(movePlaylistSong(seed, 'focus', id, direction)[0], seed[0]);
  }
  assert.deepEqual(movePlaylistSong(seed, 'missing', 'song-001', 1), seed);
  const single = [{ id: 'one', name: 'One', songIds: ['a'] }];
  assert.equal(movePlaylistSong(single, 'one', 'a', 1)[0], single[0]);
});

test('summary resolves playlist order and sums exact seconds', () => {
  const songs = [{ id: 'song-002', duration: 91 }, { id: 'song-001', duration: 120 }];
  const result = getPlaylistDetails(seed[0], songs);
  assert.deepEqual(result.songs.map((song) => song.id), ['song-001', 'song-002']);
  assert.equal(result.totalSeconds, 211);
  assert.deepEqual(result.missingIds, []);
  assert.deepEqual(getPlaylistDetails(seed[1], songs), { songs: [], missingIds: [], totalSeconds: 0 });
});

test('missing catalogue songs are reported without changing saved memberships', () => {
  const result = getPlaylistDetails(seed[0], [{ id: 'song-002', duration: 91 }]);
  assert.deepEqual(result.missingIds, ['song-001']);
  assert.equal(result.totalSeconds, 91);
  assert.equal(seed[0].songIds.length, 2);
});

test('total duration supports empty, minute boundaries and hour-long playlists', () => {
  assert.equal(formatTotalDuration(0), '0 min');
  assert.equal(formatTotalDuration(60), '1 min');
  assert.equal(formatTotalDuration(211), '3 min 31 sec');
  assert.equal(formatTotalDuration(3661), '61 min 1 sec');
});

test('membership and reorder changes survive a storage round trip', () => {
  const storage = memoryStorage();
  const added = addSongToPlaylist(seed, 'focus', 'song-003');
  const reordered = movePlaylistSong(added, 'focus', 'song-003', -1);
  const removed = removeSongFromPlaylist(reordered, 'focus', 'song-001');
  assert.equal(writePlaylists(removed, storage), true);
  assert.deepEqual(readPlaylists(storage).playlists[0].songIds, ['song-003', 'song-002']);
});

function memoryStorage(initial) {
  const values = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('playlist name is required, including whitespace-only input', () => {
  assert.equal(getPlaylistNameError('', seed), 'Enter a playlist name.');
  assert.equal(getPlaylistNameError('   ', seed), 'Enter a playlist name.');
});

test('playlist names are unique after trim and case normalisation', () => {
  assert.ok(getPlaylistNameError('  fOcUs  ', seed));
  assert.throws(() => createPlaylist(seed, 'FOCUS', 'new'));
});

test('playlist name length is bounded at 120 characters', () => {
  assert.equal(getPlaylistNameError('a'.repeat(120), []), '');
  assert.ok(getPlaylistNameError('a'.repeat(121), []));
});

test('create uses a stable ID, trims name and starts with an empty song list', () => {
  const result = createPlaylist(seed, ' Evening ', 'evening');
  assert.deepEqual(result[2], { id: 'evening', name: 'Evening', songIds: [] });
  assert.equal(seed.length, 2);
  assert.notEqual(result, seed);
});

test('cannot create duplicate or empty IDs', () => {
  assert.throws(() => createPlaylist(seed, 'Other', 'focus'));
  assert.throws(() => createPlaylist(seed, 'Other', ''));
});

test('rename permits unchanged name or case change for the same playlist', () => {
  assert.equal(getPlaylistNameError('Focus', seed, 'focus'), '');
  const result = renamePlaylist(seed, 'focus', ' FOCUS ');
  assert.equal(result[0].name, 'FOCUS');
  assert.deepEqual(result[0].songIds, seed[0].songIds);
  assert.equal(seed[0].name, 'Focus');
  assert.equal(result[1], seed[1]);
});

test('rename rejects another playlist name and missing playlist IDs', () => {
  assert.throws(() => renamePlaylist(seed, 'focus', 'Weekend'));
  assert.throws(() => renamePlaylist(seed, 'missing', 'Other'));
});

test('delete removes only the target and does not mutate other playlists', () => {
  const result = deletePlaylist(seed, 'weekend');
  assert.deepEqual(result, [seed[0]]);
  assert.equal(seed.length, 2);
  assert.deepEqual(result[0].songIds, ['song-001', 'song-002']);
});

test('empty saved playlists and valid song order are restored', () => {
  assert.deepEqual(validatePlaylists({ version: 1, playlists: [] }), []);
  const restored = validatePlaylists({ version: 1, playlists: seed });
  assert.deepEqual(restored, seed);
  assert.notEqual(restored[0].songIds, seed[0].songIds);
});

test('rejects unsupported versions and invalid saved structures', () => {
  for (const data of [null, [], {}, { version: 2, playlists: seed }, { version: 1, playlists: {} }]) {
    assert.throws(() => validatePlaylists(data));
  }
});

test('rejects duplicate IDs, duplicate names and invalid memberships in saved data', () => {
  const invalid = [
    [...seed, { ...seed[0], name: 'Other' }],
    [...seed, { id: 'new', name: ' focus ', songIds: [] }],
    [{ id: 'id', name: 'Name', songIds: ['a', 'a'] }],
    [{ id: 'id', name: 'Name', songIds: [42] }],
    [{ id: 'id', name: 'Name', songIds: [''] }],
    [{ id: '', name: 'Name', songIds: [] }],
    [{ id: 'id', name: ' ', songIds: [] }],
    [null],
  ];
  for (const playlists of invalid) {
    assert.throws(() => validatePlaylists({ version: 1, playlists }));
  }
});

test('storage starts empty without writing anything', () => {
  const storage = memoryStorage();
  assert.deepEqual(readPlaylists(storage), { playlists: [], issue: null });
  assert.equal(storage.getItem(PLAYLIST_STORAGE_KEY), null);
});

test('storage round trip preserves names, membership and order', () => {
  const storage = memoryStorage({ unrelated: 'keep me' });
  assert.equal(writePlaylists(seed, storage), true);
  assert.deepEqual(readPlaylists(storage), { playlists: seed, issue: null });
  assert.equal(storage.getItem('unrelated'), 'keep me');
});

test('corrupt saved data is reported and left untouched', () => {
  const storage = memoryStorage({ [PLAYLIST_STORAGE_KEY]: '{broken' });
  assert.deepEqual(readPlaylists(storage), { playlists: [], issue: 'invalid' });
  assert.equal(storage.getItem(PLAYLIST_STORAGE_KEY), '{broken');
});

test('blocked reads and quota failures are handled without throwing', () => {
  const storage = {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceededError'); },
  };
  assert.deepEqual(readPlaylists(storage), { playlists: [], issue: 'unavailable' });
  assert.equal(writePlaylists(seed, storage), false);
});
