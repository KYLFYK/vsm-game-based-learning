import { Api } from '@/types';

import { apiError, orNotFound } from '../api-error';

describe(apiError.name, () => {
  test('wraps the code into a custom RTK Query error', () => {
    expect(apiError(Api.ErrorCode.Storage)).toEqual({
      status: 'CUSTOM_ERROR',
      error: Api.ErrorCode.Storage,
    });
  });
});

describe(orNotFound.name, () => {
  test('returns a found value as data', () => {
    expect(orNotFound({ id: 'smoke' })).toEqual({ data: { id: 'smoke' } });
  });

  test('returns NotFound for a missing value', () => {
    expect(orNotFound(undefined)).toEqual({
      error: { status: 'CUSTOM_ERROR', error: Api.ErrorCode.NotFound },
    });
  });
});
