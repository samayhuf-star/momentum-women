import assert from 'node:assert/strict';
import { test } from 'node:test';
import { APPLE_SUBSCRIPTIONS_URL, openManageSubscriptions } from './manageSubscriptions.ts';

test('iOS opens the store sheet and does not fall back', async () => {
  const calls: string[] = [];
  const result = await openManageSubscriptions({
    platform: 'ios',
    showManage: async () => { calls.push('sheet'); },
    deepLink: async () => { calls.push('link'); },
    openURL: async (url) => { calls.push(url); },
  });
  assert.equal(result, 'store-sheet');
  assert.deepEqual(calls, ['sheet']);
});

test('a failed store sheet falls back to the Apple subscriptions page', async () => {
  const calls: string[] = [];
  const result = await openManageSubscriptions({
    platform: 'ios',
    showManage: async () => { throw new Error('no sheet'); },
    deepLink: async () => { throw new Error('no link'); },
    openURL: async (url) => { calls.push(url); },
  });
  assert.equal(result, 'apple-account');
  assert.deepEqual(calls, [APPLE_SUBSCRIPTIONS_URL]);
});

test('a failed sheet can still use the deep link', async () => {
  const calls: string[] = [];
  const result = await openManageSubscriptions({
    platform: 'ios',
    showManage: async () => { throw new Error('no sheet'); },
    deepLink: async () => { calls.push('link'); },
    openURL: async () => { calls.push('url'); },
  });
  assert.equal(result, 'deep-link');
  assert.deepEqual(calls, ['link']);
});

test('other platforms skip the iOS sheet', async () => {
  let sheet = 0;
  const result = await openManageSubscriptions({
    platform: 'web',
    showManage: async () => { sheet += 1; },
    deepLink: async () => { throw new Error('unsupported'); },
    openURL: async () => undefined,
  });
  assert.equal(sheet, 0);
  assert.equal(result, 'apple-account');
});
