import { meterBounds } from '../meter-bounds';

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
