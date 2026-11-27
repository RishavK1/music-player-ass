import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { filterSongs, getGenres, validateSongs } from '../src/utils/songs.js';
import { formatDuration } from '../src/utils/formatDuration.js';

const data = JSON.parse(
  await readFile(new URL('../public/songs.json', import.meta.url), 'utf8'),
);
const songs = validateSongs(data);

test('catalogue contains at least ten valid songs with unique IDs', () => {
  assert.ok(songs.length >= 10);
  assert.equal(new Set(songs.map((song) => song.id)).size, songs.length);
});

test('validation trims text without mutating the source', () => {
  const original = { ...data[0], title: '  Midnight Drive  ' };
  assert.equal(validateSongs([original])[0].title, 'Midnight Drive');
  assert.equal(original.title, '  Midnight Drive  ');
});

test('empty catalogue is valid', () => {
  assert.deepEqual(validateSongs([]), []);
});

test('rejects a non-array response, including an HTML fallback', () => {
  for (const value of [null, {}, 'not json', '<!doctype html>']) {
    assert.throws(() => validateSongs(value));
  }
});

test('rejects missing, empty, or incorrectly typed required text', () => {
  for (const key of ['id', 'title', 'artist', 'genre']) {
    for (const value of [undefined, '', '  ', 42, null]) {
      assert.throws(() => validateSongs([{ ...data[0], [key]: value }]));
    }
  }
  assert.throws(() => validateSongs([null]));
});

test('rejects invalid duration values but permits zero seconds', () => {
  for (const duration of [-1, 1.5, '215', NaN, Infinity, Number.MAX_VALUE]) {
    assert.throws(() => validateSongs([{ ...data[0], duration }]));
  }
  assert.equal(validateSongs([{ ...data[0], duration: 0 }])[0].duration, 0);
});

test('rejects duplicate IDs after trimming', () => {
  assert.throws(() =>
    validateSongs([data[0], { ...data[1], id: ` ${data[0].id} ` }]),
  );
});

test('search matches title, ignores case and trims surrounding spaces', () => {
  assert.deepEqual(
    filterSongs(songs, '  MIDNIGHT  ', '').map((song) => song.id),
    ['song-001'],
  );
});

test('search matches artist names', () => {
  assert.equal(filterSongs(songs, 'neon coast', '').length, 2);
});

test('search and genre combine with AND, not OR', () => {
  assert.equal(filterSongs(songs, 'neon coast', 'Electronic').length, 2);
  assert.equal(filterSongs(songs, 'neon coast', 'Jazz').length, 0);
});

test('clearing filters and whitespace-only searches restore the full library', () => {
  assert.deepEqual(filterSongs(songs, '', ''), songs);
  assert.deepEqual(filterSongs(songs, '   ', ''), songs);
});

test('unmatched query returns an empty result without mutating the catalogue', () => {
  const before = JSON.stringify(songs);
  assert.deepEqual(filterSongs(songs, 'no such song', ''), []);
  assert.equal(JSON.stringify(songs), before);
});

test('genres are unique, sorted and derived from the catalogue', () => {
  assert.deepEqual(getGenres(songs), [
    'Alternative',
    'Ambient',
    'Electronic',
    'Indie',
    'Jazz',
    'Soul',
  ]);
  assert.deepEqual(getGenres([]), []);
});

test('duration uses padded minutes and seconds, including boundaries', () => {
  for (const [seconds, formatted] of [
    [0, '00:00'],
    [9, '00:09'],
    [59, '00:59'],
    [60, '01:00'],
    [65, '01:05'],
    [215, '03:35'],
    [3599, '59:59'],
    [3600, '60:00'],
  ]) {
    assert.equal(formatDuration(seconds), formatted);
  }
});
