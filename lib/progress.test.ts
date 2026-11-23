import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY, applyCompletion, applySet } from './progress.ts';

test('first workout starts a streak of 1 and counts minutes', () => {
  const s = applyCompletion(EMPTY, '2026-11-24', 1500, { key: 'sculpt-1-0', moves: 8, sets: 20 });
  assert.equal(s.streak, 1);
  assert.equal(s.totalWorkouts, 1);
  assert.equal(s.minutes, 25);
  assert.deepEqual(s.completedDays, ['2026-11-24']);
  assert.deepEqual(s.completedSessions, ['sculpt-1-0']);
  assert.equal(s.last?.day, '2026-11-24');
});

test('a workout the next day extends the streak, also across a month end', () => {
  let s = applyCompletion(EMPTY, '2026-11-30', 600);
  s = applyCompletion(s, '2026-12-01', 600);
  assert.equal(s.streak, 2);
});

test('a missed day resets the streak to 1', () => {
  let s = applyCompletion(EMPTY, '2026-11-20', 600);
  s = applyCompletion(s, '2026-11-21', 600);
  s = applyCompletion(s, '2026-11-23', 600);
  assert.equal(s.streak, 1);
});

test('a second workout on the same day adds minutes but not the streak', () => {
  let s = applyCompletion(EMPTY, '2026-11-24', 600);
  s = applyCompletion(s, '2026-11-24', 300);
  assert.equal(s.streak, 1);
  assert.equal(s.totalWorkouts, 2);
  assert.equal(s.minutesByDay['2026-11-24'], 15);
  assert.equal(s.completedDays.length, 1);
});

test('a session is listed once even if finished twice', () => {
  const d = { key: 'x-1-0', moves: 1, sets: 1 };
  let s = applyCompletion(EMPTY, '2026-11-24', 60, d);
  s = applyCompletion(s, '2026-11-25', 60, d);
  assert.deepEqual(s.completedSessions, ['x-1-0']);
});

test('very short workouts count as at least one minute, none counts as zero', () => {
  assert.equal(applyCompletion(EMPTY, '2026-11-24', 10).minutes, 1);
  assert.equal(applyCompletion(EMPTY, '2026-11-24', 0).minutes, 0);
});

test('the journal keeps only the last 50 sets per exercise', () => {
  let s = EMPTY;
  for (let i = 0; i < 60; i += 1) s = applySet(s, 'squat', '2026-11-24', i, 10);
  assert.equal(s.journal.squat.length, 50);
  assert.equal(s.journal.squat[0].reps, 10);
  assert.equal(s.journal.squat[49].reps, 59);
});

test('applying a workout does not change the input state', () => {
  const before = JSON.stringify(EMPTY);
  applyCompletion(EMPTY, '2026-11-24', 600);
  assert.equal(JSON.stringify(EMPTY), before);
});
