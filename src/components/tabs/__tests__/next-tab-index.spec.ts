import { nextTabIndex } from '../next-tab-index';

describe(nextTabIndex.name, () => {
  test.each([
    ['ArrowRight', 0, 1],
    ['ArrowRight', 2, 0],
    ['ArrowLeft', 1, 0],
    ['ArrowLeft', 0, 2],
    ['Home', 2, 0],
    ['End', 0, 2],
  ])('%s from %i moves to %i of three tabs', (key, index, expected) => {
    expect(nextTabIndex(key, index, 3)).toBe(expected);
  });

  test('returns null for a non-navigation key', () => {
    expect(nextTabIndex('Enter', 1, 3)).toBeNull();
  });
});
