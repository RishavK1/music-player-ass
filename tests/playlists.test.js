import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistNameError,
  renamePlaylist,
  validatePlaylists,
} from '../src/utils/playlists.js';
import {
  PLAYLIST_STORAGE_KEY,
  readPlaylists,
  writePlaylists,
} from '../src/utils/playlistStorage.js';

const seed = [
  { id: 'focus', name: 'Focus', songIds: ['song-001', 'song-002'] },
  { id: 'weekend', name: 'Weekend', songIds: [] },
];

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
