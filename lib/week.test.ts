import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dayKey, mondayOf, weekDates, dayIndex, weekIndex } from './week.ts';

test('dayKey uses the local calendar day with padding', () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
});

test('monday of a Sunday is the Monday six days earlier', () => {
  const m = mondayOf(new Date(2026, 10, 22));
  assert.equal(dayKey(m), '2026-11-16');
});

test('monday of a Monday is itself, and the week has 7 days Mon to Sun', () => {
  const days = weekDates(new Date(2026, 10, 16));
  assert.equal(days.length, 7);
  assert.equal(dayKey(days[0]), '2026-11-16');
  assert.equal(dayKey(days[6]), '2026-11-22');
  assert.equal(dayIndex(days[0]), 0);
  assert.equal(dayIndex(days[6]), 6);
});

test('weekIndex is 0 without a start and in the first week', () => {
  assert.equal(weekIndex(null, 4, new Date(2026, 10, 24)), 0);
  assert.equal(weekIndex('2026-11-18', 4, new Date(2026, 10, 22)), 0);
});

test('weekIndex advances each Monday and repeats after 4 weeks', () => {
  const start = '2026-11-18';
  assert.equal(weekIndex(start, 4, new Date(2026, 10, 23)), 1);
  assert.equal(weekIndex(start, 4, new Date(2026, 10, 30)), 2);
  assert.equal(weekIndex(start, 4, new Date(2026, 11, 7)), 3);
  assert.equal(weekIndex(start, 4, new Date(2026, 11, 14)), 0);
});

test('weekIndex never goes negative when the start is in the future', () => {
  assert.equal(weekIndex('2027-01-01', 4, new Date(2026, 10, 24)), 0);
});
