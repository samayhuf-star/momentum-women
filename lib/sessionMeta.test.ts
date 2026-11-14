import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatClock,
  formatSessionLength,
  planEquipment,
  planLevel,
  recentDayKeys,
  sessionSeconds,
} from './sessionMeta.ts';

test('a six-move session is four minutes at 40 seconds each', () => {
  assert.equal(sessionSeconds(6), 240);
  assert.equal(formatSessionLength(6), '4 min');
  assert.equal(formatSessionLength(8), '5 min');
});

test('the clock shows minutes and seconds left', () => {
  assert.equal(formatClock(240), '4:00');
  assert.equal(formatClock(65), '1:05');
  assert.equal(formatClock(0), '0:00');
});

test('level and equipment come from the moves in the plan', () => {
  assert.equal(planLevel(['Beginner', 'Beginner']), 'Beginner');
  assert.equal(planLevel(['Beginner', 'Advanced']), 'Mixed');
  assert.equal(planEquipment(['None', 'Dumbbells', 'None']), 'None · Dumbbells');
});

test('the 30-day strip ends on the given day', () => {
  const keys = recentDayKeys(30, new Date('2026-11-14T12:00:00Z'));
  assert.equal(keys.length, 30);
  assert.equal(keys[keys.length - 1], '2026-11-14');
});
