import { meterThresholds } from '../meter-thresholds';

describe(meterThresholds.name, () => {
  test('returns nothing without pass criteria', () => {
    expect(
      meterThresholds({ meters: { trust: { label: 'Доверие', initial: 50 } } })
    ).toEqual([]);
  });

  test('pairs each threshold with its meter label', () => {
    expect(
      meterThresholds({
        meters: {
          loyalty: { label: 'Лояльность', initial: 60 },
          safety: { label: 'Безопасность', initial: 80 },
        },
        passCriteria: { meters: { loyalty: 40, safety: 60 }, flags: ['x'] },
      })
    ).toEqual([
      { id: 'loyalty', label: 'Лояльность', value: 40 },
      { id: 'safety', label: 'Безопасность', value: 60 },
    ]);
  });

  test('skips thresholds for unknown meters', () => {
    expect(
      meterThresholds({ passCriteria: { meters: { ghost: 10 } } })
    ).toEqual([]);
  });
});
