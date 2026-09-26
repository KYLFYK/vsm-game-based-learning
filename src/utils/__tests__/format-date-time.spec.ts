import { formatDateTime } from '../format-date-time';

describe(formatDateTime.name, () => {
  test('formats a timestamp as local date and time', () => {
    const timestamp = new Date(2026, 8, 6, 9, 5).getTime();
    expect(formatDateTime(timestamp)).toBe('06.09.2026, 09:05');
  });
});
