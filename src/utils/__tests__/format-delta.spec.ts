import { formatDelta } from '../format-delta';

describe(formatDelta.name, () => {
  test('prefixes positive amounts with a plus', () => {
    expect(formatDelta(10)).toBe('+10');
  });

  test('prefixes negative amounts with a typographic minus', () => {
    expect(formatDelta(-20)).toBe('−20');
  });

  test('prints zero without a sign', () => {
    expect(formatDelta(0)).toBe('0');
  });
});
