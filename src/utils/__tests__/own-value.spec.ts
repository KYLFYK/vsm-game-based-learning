import { ownValue } from '../own-value';

describe(ownValue.name, () => {
  test('returns the value of an own key', () => {
    expect(ownValue({ smoke: 1 }, 'smoke')).toBe(1);
  });

  test('returns undefined for a missing key', () => {
    expect(ownValue<number>({ smoke: 1 }, 'fire')).toBeUndefined();
  });

  test('ignores keys inherited from the prototype', () => {
    expect(ownValue<unknown>({}, 'constructor')).toBeUndefined();
  });
});
