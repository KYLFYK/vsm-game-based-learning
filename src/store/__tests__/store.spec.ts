import { api, store } from '@/store';

describe('store', () => {
  test('registers rtk query reducer under api.reducerPath', () => {
    expect(store.getState()).toHaveProperty(api.reducerPath);
  });

  test('registers the scenario run reducer under scenarioRun', () => {
    expect(store.getState()).toHaveProperty('scenarioRun');
  });

  test('registers exactly the endpoints injected by store/apis', () => {
    expect(Object.keys(api.endpoints).sort()).toEqual([
      'getAttempt',
      'getAttempts',
      'getCourse',
      'getCourses',
      'getScenario',
      'getScenarios',
      'saveAttempt',
    ]);
  });
});
