import { api, store } from '@/store';

describe('store', () => {
  test('registers rtk query reducer under api.reducerPath', () => {
    expect(store.getState()).toHaveProperty(api.reducerPath);
  });

  test('has no endpoints until injected', () => {
    expect(Object.keys(api.endpoints)).toHaveLength(0);
  });
});
