import { configureStore } from '@reduxjs/toolkit';

jest.mock('@/content', () => ({
  COURSES: [
    { id: 'a', title: 'A', description: 'Курс A', scenarioIds: ['s1'] },
    { id: 'b', title: 'B', description: 'Курс B', scenarioIds: ['s2', 's3'] },
  ],
}));

import { COURSES } from '@/content';

import { api } from '../../api';
import { coursesApi } from '../courses-api';

const createStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('coursesApi', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    store.dispatch(api.util.resetApiState());
  });

  test('getCourses returns the bundled course list', async () => {
    const result = await store.dispatch(
      coursesApi.endpoints.getCourses.initiate()
    );

    expect(result.data).toEqual(COURSES);
  });

  test('getCourse returns a course by id', async () => {
    const result = await store.dispatch(
      coursesApi.endpoints.getCourse.initiate('b')
    );

    expect(result.data).toEqual(COURSES[1]);
  });

  test('getCourse returns a NotFound error for an unknown id', async () => {
    const result = await store.dispatch(
      coursesApi.endpoints.getCourse.initiate('ghost')
    );

    expect(result.error).toEqual({
      status: 'CUSTOM_ERROR',
      error: 'not-found',
    });
  });
});
