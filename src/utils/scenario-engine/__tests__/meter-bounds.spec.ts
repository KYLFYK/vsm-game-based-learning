import { hasMeters, meterBounds } from '../meter-bounds';

describe(meterBounds.name, () => {
  test('defaults to 0 and 100', () => {
    expect(meterBounds({ label: 'Trust', initial: 50 })).toEqual({
      min: 0,
      max: 100,
    });
  });

  test('keeps custom bounds', () => {
    expect(
      meterBounds({ label: 'Trust', initial: 0, min: -10, max: 10 })
    ).toEqual({ min: -10, max: 10 });
  });
});

describe(hasMeters.name, () => {
  test('is true when the scenario declares a meter', () => {
    expect(
      hasMeters({ meters: { trust: { label: 'Trust', initial: 50 } } })
    ).toBe(true);
  });

  test.each([
    ['no scenario', null],
    ['no meters field', {}],
    ['an empty meters record', { meters: {} }],
  ])('is false for %s', (_case, scenario) => {
    expect(hasMeters(scenario)).toBe(false);
  });
});
