import { Api } from '@/types';
import type { Attempt, Scenario } from '@/types';

import { api } from '../api';
import { apiError } from './api-error';

const STORAGE_KEY = 'vsm.attempts.v1';

type Outcome<T> = { data: T } | { error: Api.Error };

// без своего предиката пришлось бы сужать через `as`: Array.isArray() из
// lib.es5 даёт `arg is any[]`, а `any[] as Attempt.Item[]` — небезопасное
// сужение; форма попадающих в хранилище записей гарантируется writeAttempts
const isAttemptItemArray = (value: unknown): value is Attempt.Item[] =>
  Array.isArray(value);

/**
 * Приватно для этого файла: доступ к localStorage только здесь, чтобы
 * ключ и формат хранения не расползались по store.
 */
const readAttempts = (): Outcome<Attempt.Item[]> => {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { error: apiError(Api.ErrorCode.Storage) };
  }
  if (raw === null) return { data: [] };
  try {
    const parsed: unknown = JSON.parse(raw);
    // сломанное значение не перезаписывается здесь — только следующей успешной записью
    return { data: isAttemptItemArray(parsed) ? parsed : [] };
  } catch {
    return { data: [] };
  }
};

const writeAttempts = (attempts: Attempt.Item[]): Outcome<null> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    return { data: null };
  } catch {
    return { error: apiError(Api.ErrorCode.Storage) };
  }
};

export const attemptsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttempts: builder.query<Attempt.Item[], { scenarioId?: Scenario.Id }>({
      queryFn: ({ scenarioId }) => {
        const attempts = readAttempts();
        if ('error' in attempts) return attempts;
        const filtered = scenarioId
          ? attempts.data.filter((item) => item.scenarioId === scenarioId)
          : attempts.data;
        return {
          data: [...filtered].sort((a, b) => b.finishedAt - a.finishedAt),
        };
      },
      providesTags: ['Attempts'],
    }),
    getAttempt: builder.query<Attempt.Item, Attempt.Id>({
      queryFn: (id) => {
        const attempts = readAttempts();
        if ('error' in attempts) return attempts;
        const attempt = attempts.data.find((item) => item.id === id);
        return attempt
          ? { data: attempt }
          : { error: apiError(Api.ErrorCode.NotFound) };
      },
      providesTags: (_result, _error, id) => [{ type: 'Attempts', id }],
    }),
    saveAttempt: builder.mutation<Attempt.Item, Attempt.Item>({
      queryFn: (attempt) => {
        const attempts = readAttempts();
        if ('error' in attempts) return attempts;
        const index = attempts.data.findIndex((item) => item.id === attempt.id);
        const next = [...attempts.data];
        if (index === -1) {
          next.push(attempt);
        } else {
          next[index] = attempt;
        }
        const written = writeAttempts(next);
        if ('error' in written) return written;
        return { data: attempt };
      },
      invalidatesTags: ['Attempts'],
    }),
  }),
});

export const {
  useGetAttemptsQuery,
  useGetAttemptQuery,
  useSaveAttemptMutation,
} = attemptsApi;
