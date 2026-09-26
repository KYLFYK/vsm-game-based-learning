import { formatEstimate } from '../format-estimate';

describe(formatEstimate.name, () => {
  test('prints approximate minutes', () => {
    expect(formatEstimate(5)).toBe('~5 мин');
  });
});
