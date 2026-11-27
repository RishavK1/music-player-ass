import assert from 'node:assert/strict';
import test from 'node:test';
import {
  IDLE_PLAYBACK,
  getPlaybackQueue,
  reconcilePlayback,
  selectPlayback,
  stepPlayback,
} from '../src/utils/playback.js';

const songs = [
  { id: 'a', title: 'First', duration: 10 },
  { id: 'b', title: 'Second', duration: 20 },
  { id: 'c', title: 'Third', duration: 30 },
];
const playlists = [{ id: 'list', songIds: ['c', 'missing', 'a', 'b'] }];
const library = { type: 'library' };
const source = { type: 'playlist', id: 'list' };

test('idle playback has no source or current song', () => {
  assert.deepEqual(getPlaybackQueue(null, songs, playlists), []);
  assert.equal(reconcilePlayback(IDLE_PLAYBACK, songs, playlists), IDLE_PLAYBACK);
});

test('library queue is catalogue order and playlist queue uses saved order, skipping missing IDs', () => {
  assert.equal(getPlaybackQueue(library, songs, playlists), songs);
  assert.deepEqual(getPlaybackQueue(source, songs, playlists).map((song) => song.id), ['c', 'a', 'b']);
  assert.deepEqual(getPlaybackQueue({ type: 'playlist', id: 'gone' }, songs, playlists), []);
});

test('selecting song starts playback and current song toggles pause/resume', () => {
  const playing = selectPlayback(IDLE_PLAYBACK, library, 'a', songs, playlists);
  assert.equal(playing.playing, true);
  assert.equal(playing.currentId, 'a');
  const paused = selectPlayback(playing, library, 'a', songs, playlists);
  assert.equal(paused.playing, false);
  assert.equal(selectPlayback(paused, library, 'a', songs, playlists).playing, true);
});

test('selecting another song starts it and switches source without mutating prior state', () => {
  const old = { source: library, currentId: 'a', playing: false };
  const next = selectPlayback(old, source, 'c', songs, playlists);
  assert.deepEqual(next, { source, currentId: 'c', playing: true });
  assert.equal(old.currentId, 'a');
  assert.equal(old.playing, false);
});

test('selecting current song from another source toggles and changes queue source', () => {
  const old = { source: library, currentId: 'a', playing: true };
  assert.deepEqual(selectPlayback(old, source, 'a', songs, playlists), {
    source, currentId: 'a', playing: false,
  });
});

test('invalid selection is ignored', () => {
  assert.equal(selectPlayback(IDLE_PLAYBACK, library, 'missing', songs, playlists), IDLE_PLAYBACK);
  assert.equal(selectPlayback(IDLE_PLAYBACK, { type: 'playlist', id: 'gone' }, 'a', songs, playlists), IDLE_PLAYBACK);
});

test('next and previous follow queue order and preserve playing/paused state', () => {
  const playing = { source, currentId: 'c', playing: true };
  assert.deepEqual(stepPlayback(playing, 1, songs, playlists), { source, currentId: 'a', playing: true });
  const paused = { source, currentId: 'a', playing: false };
  assert.deepEqual(stepPlayback(paused, -1, songs, playlists), { source, currentId: 'c', playing: false });
});

test('boundaries, single-song queues, idle and invalid directions do not wrap', () => {
  const first = { source: library, currentId: 'a', playing: true };
  const last = { source: library, currentId: 'c', playing: false };
  assert.equal(stepPlayback(first, -1, songs, playlists), first);
  assert.equal(stepPlayback(last, 1, songs, playlists), last);
  assert.equal(stepPlayback(first, 2, songs, playlists), first);
  assert.equal(stepPlayback(IDLE_PLAYBACK, 1, songs, playlists), IDLE_PLAYBACK);
  assert.equal(stepPlayback(first, 1, songs.slice(0, 1), playlists), first);
});

test('reordering source changes the next song while keeping current song', () => {
  const state = { source, currentId: 'c', playing: true };
  const reordered = [{ id: 'list', songIds: ['c', 'b', 'a'] }];
  assert.equal(reconcilePlayback(state, songs, reordered), state);
  assert.equal(stepPlayback(state, 1, songs, reordered).currentId, 'b');
});

test('current-song removal, source deletion, or catalogue loss clears playback', () => {
  const state = { source, currentId: 'c', playing: true };
  assert.equal(reconcilePlayback(state, songs, []), IDLE_PLAYBACK);
  assert.equal(reconcilePlayback(state, songs, [{ id: 'list', songIds: ['a'] }]), IDLE_PLAYBACK);
  assert.equal(reconcilePlayback(state, songs.slice(0, 2), playlists), IDLE_PLAYBACK);
});

test('unrelated playlist changes and source rename do not stop playback', () => {
  const state = { source, currentId: 'c', playing: false };
  const renamed = [{ ...playlists[0], name: 'Renamed' }, { id: 'other', songIds: [] }];
  assert.equal(reconcilePlayback(state, songs, renamed), state);
});
