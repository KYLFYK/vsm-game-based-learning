import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';

import { Attempt } from '@/types';

import { api } from '../../api';
import { attemptsApi } from '../attempts-api';

const STORAGE_KEY = 'vsm.attempts.v1';

const attempt = (patch: Partial<Attempt.Item> = {}): Attempt.Item => ({
  id: 'a',
  scenarioId: 'scenario',
  scenarioVersion: 1,
  startedAt: 0,
  finishedAt: 1000,
  status: Attempt.Status.Passed,
  reason: Attempt.Reason.Completed,
  score: 100,
  meters: {},
  flags: {},
  log: [],
  ...patch,
});

const createStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('attemptsApi', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    localStorage.clear();
    store = createStore();
  });

  afterEach(() => {
    store.dispatch(api.util.resetApiState());
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test('getAttempts returns an empty list when storage is empty', async () => {
    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({})
    );

    expect(result.data).toEqual([]);
  });

  test('getAttempts returns [] and leaves broken JSON untouched', async () => {
    localStorage.setItem(STORAGE_KEY, 'not-json{');

    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({})
    );

    expect(result.data).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('not-json{');
  });

  test('getAttempts filters by scenarioId', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        attempt({ id: '1', scenarioId: 'one', finishedAt: 100 }),
        attempt({ id: '2', scenarioId: 'two', finishedAt: 200 }),
      ])
    );

    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({ scenarioId: 'two' })
    );

    expect(result.data?.map((item) => item.id)).toEqual(['2']);
  });

  test('getAttempts sorts newest finishedAt first', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        attempt({ id: 'older', finishedAt: 100 }),
        attempt({ id: 'newer', finishedAt: 200 }),
      ])
    );

    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({})
    );

    expect(result.data?.map((item) => item.id)).toEqual(['newer', 'older']);
  });

  test('getAttempts returns a Storage error when getItem throws', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('unavailable');
    });

    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({})
    );

    expect(result.error).toEqual({ status: 'CUSTOM_ERROR', error: 'storage' });
  });

  test('getAttempt returns the matching item', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([attempt({ id: 'x' })]));

    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempt.initiate('x')
    );

    expect(result.data?.id).toBe('x');
  });

  test('getAttempt returns a NotFound error for an unknown id', async () => {
    const result = await store.dispatch(
      attemptsApi.endpoints.getAttempt.initiate('ghost')
    );

    expect(result.error).toEqual({
      status: 'CUSTOM_ERROR',
      error: 'not-found',
    });
  });

  test('saveAttempt appends a new item', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([attempt({ id: '1' })]));

    await store.dispatch(
      attemptsApi.endpoints.saveAttempt.initiate(attempt({ id: '2' }))
    );

    const stored: Attempt.Item[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]'
    );
    expect(stored.map((item) => item.id)).toEqual(['1', '2']);
  });

  test('saveAttempt replaces an item with the same id in place', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        attempt({ id: '1', score: 10 }),
        attempt({ id: '2', score: 20 }),
      ])
    );

    await store.dispatch(
      attemptsApi.endpoints.saveAttempt.initiate(
        attempt({ id: '1', score: 99 })
      )
    );

    const stored: Attempt.Item[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]'
    );
    expect(stored.map((item) => [item.id, item.score])).toEqual([
      ['1', 99],
      ['2', 20],
    ]);
  });

  test('saveAttempt returns a Storage error when setItem throws (quota)', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    const result = await store.dispatch(
      attemptsApi.endpoints.saveAttempt.initiate(attempt())
    );

    expect(result.error).toEqual({ status: 'CUSTOM_ERROR', error: 'storage' });
  });

  test('saveAttempt invalidates Attempts, so a subscribed list refetches', async () => {
    const subscription = store.dispatch(
      attemptsApi.endpoints.getAttempts.initiate({})
    );
    await subscription;

    const created = attempt({ id: 'fresh' });
    await store.dispatch(attemptsApi.endpoints.saveAttempt.initiate(created));

    await waitFor(() => {
      const cached = attemptsApi.endpoints.getAttempts.select({})(
        store.getState()
      );
      expect(cached.data).toContainEqual(created);
    });

    subscription.unsubscribe();
  });
});
