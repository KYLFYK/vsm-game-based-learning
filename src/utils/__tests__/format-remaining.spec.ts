import { formatRemaining } from '../format-remaining';

describe(formatRemaining.name, () => {
  test.each([
    [0, '00:00'],
    [1, '00:01'],
    [999, '00:01'],
    [1_000, '00:01'],
    [1_001, '00:02'],
    [9_750, '00:10'],
    [59_000, '00:59'],
    [60_000, '01:00'],
    [600_000, '10:00'],
    [6_000_000, '100:00'],
  ])('formats %i ms as %s, rounding seconds up', (ms, expected) => {
    expect(formatRemaining(ms)).toBe(expected);
  });

  test('clamps negative input to zero', () => {
    expect(formatRemaining(-500)).toBe('00:00');
  });
});
