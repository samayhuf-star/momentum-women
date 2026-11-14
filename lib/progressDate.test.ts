import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatProgressDay } from './progressDate.ts';

const now = new Date(2026, 10, 14);

test('current year uses a short month and a numeric day', () => {
  assert.equal(formatProgressDay('2026-11-14', now, 'en-US'), 'Nov 14');
});

test('a different year includes the year', () => {
  assert.equal(formatProgressDay('2025-03-02', now, 'en-US'), 'Mar 2, 2025');
});

test('the label follows the locale', () => {
  const label = formatProgressDay('2026-11-14', now, 'fr-FR');
  assert.match(label, /14/);
  assert.match(label, /nov/i);
  assert.equal(label.includes('2026'), false);
});

test('a value that is not a calendar day is left unchanged', () => {
  assert.equal(formatProgressDay('2026-13-40', now, 'en-US'), '2026-13-40');
});
