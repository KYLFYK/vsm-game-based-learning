import { meterPercent } from '../meter-percent';

describe(meterPercent.name, () => {
  test('maps value within default bounds', () => {
    expect(meterPercent(40, 0, 100)).toBe(40);
  });

  test('maps value within custom bounds', () => {
    expect(meterPercent(6, 2, 10)).toBe(50);
  });

  test('clamps values outside bounds', () => {
    expect(meterPercent(-5, 0, 100)).toBe(0);
    expect(meterPercent(150, 0, 100)).toBe(100);
  });

  test('returns zero for an empty range', () => {
    expect(meterPercent(5, 5, 5)).toBe(0);
  });
});
