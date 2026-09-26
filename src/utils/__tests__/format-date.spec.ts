import { formatDate } from '../format-date';

describe(formatDate.name, () => {
  test('formats a timestamp as local date', () => {
    const timestamp = new Date(2026, 8, 6, 23, 59).getTime();
    expect(formatDate(timestamp)).toBe('06.09.2026');
  });
});
