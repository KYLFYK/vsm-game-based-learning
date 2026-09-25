import { readEnv } from '../read-env';

describe(readEnv.name, () => {
  test('returns typed env when VITE_API_URL is set', () => {
    expect(readEnv({ VITE_API_URL: 'http://api.local/' })).toEqual({
      apiUrl: 'http://api.local/',
    });
  });

  test('throws a clear error when VITE_API_URL is missing', () => {
    expect(() => readEnv({})).toThrow(
      'Environment variable VITE_API_URL is not set'
    );
  });

  test('treats empty string as missing', () => {
    expect(() => readEnv({ VITE_API_URL: '' })).toThrow('VITE_API_URL');
  });

  test('ignores non-string values', () => {
    expect(() => readEnv({ VITE_API_URL: true })).toThrow('VITE_API_URL');
  });
});
