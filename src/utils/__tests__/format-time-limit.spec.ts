import { formatRemaining } from '../format-remaining';
import { formatTimeLimit } from '../format-time-limit';

jest.mock('../format-remaining', () => ({
  formatRemaining: jest.fn(() => '01:30'),
}));

describe(formatTimeLimit.name, () => {
  test('formats the limit in seconds as milliseconds', () => {
    expect(formatTimeLimit(90)).toBe('01:30');
    expect(formatRemaining).toHaveBeenCalledWith(90_000);
  });
});
