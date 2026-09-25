import { configureStore } from '@reduxjs/toolkit';

jest.mock('@/content', () => ({
  SCENARIOS: {
    a: {
      id: 'a',
      version: 1,
      title: 'A',
      description: 'Сценарий A',
      topics: ['calm'],
      estimatedMinutes: 3,
      characters: [],
      startNodeId: 'n',
      nodes: {},
    },
    b: {
      id: 'b',
      version: 2,
      title: 'B',
      description: 'Сценарий B',
      topics: ['calm'],
      estimatedMinutes: 5,
      meters: { trust: { label: 'Доверие', initial: 50 } },
      characters: [],
      startNodeId: 'n',
      nodes: {},
    },
  },
  toSummary: (definition: { id: string; meters?: unknown }) => ({
    id: definition.id,
    hasMeters: definition.meters !== undefined,
  }),
}));

import { SCENARIOS } from '@/content';

import { api } from '../../api';
import { scenariosApi } from '../scenarios-api';

const createStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('scenariosApi', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    store.dispatch(api.util.resetApiState());
  });

  test('getScenarios maps every bundled scenario through toSummary', async () => {
    const result = await store.dispatch(
      scenariosApi.endpoints.getScenarios.initiate()
    );

    expect(result.data).toMatchSnapshot();
  });

  test('getScenario returns the definition for a known id', async () => {
    const result = await store.dispatch(
      scenariosApi.endpoints.getScenario.initiate('a')
    );

    expect(result.data).toEqual(SCENARIOS.a);
  });

  test('getScenario returns a NotFound error for an unknown id', async () => {
    const result = await store.dispatch(
      scenariosApi.endpoints.getScenario.initiate('ghost')
    );

    expect(result.error).toEqual({
      status: 'CUSTOM_ERROR',
      error: 'not-found',
    });
  });
});
