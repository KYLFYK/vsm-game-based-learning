import { configureStore } from '@reduxjs/toolkit';

jest.mock('@/content', () => ({
  ACHIEVEMENTS: [
    {
      id: 'a',
      title: 'A',
      description: 'Достижение A',
      howTo: 'Сделать A',
      image: '/a.svg',
    },
  ],
  EARNED_ACHIEVEMENTS_MOCK: [{ achievementId: 'a', earnedAt: 1000 }],
}));

import { ACHIEVEMENTS, EARNED_ACHIEVEMENTS_MOCK } from '@/content';

import { api } from '../../api';
import { achievementsApi } from '../achievements-api';

const createStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('achievementsApi', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    store.dispatch(api.util.resetApiState());
  });

  test('getAchievements returns the bundled catalog', async () => {
    const result = await store.dispatch(
      achievementsApi.endpoints.getAchievements.initiate()
    );

    expect(result.data).toEqual(ACHIEVEMENTS);
  });

  test('getMyAchievements returns the earned achievements mock', async () => {
    const result = await store.dispatch(
      achievementsApi.endpoints.getMyAchievements.initiate()
    );

    expect(result.data).toEqual(EARNED_ACHIEVEMENTS_MOCK);
  });
});
