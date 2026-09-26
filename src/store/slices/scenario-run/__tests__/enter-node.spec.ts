import { deadlineAt } from '../enter-node';

describe(deadlineAt.name, () => {
  test('adds the limit in seconds to now', () => {
    expect(deadlineAt(1000, 30)).toBe(31_000);
  });

  test('is null without a limit', () => {
    expect(deadlineAt(1000, undefined)).toBeNull();
  });
});
