import { Api } from '@/types';

/** Единая сборка Api.Error, чтобы форма ошибки не расходилась между endpoints */
export const apiError = (code: Api.ErrorCode): Api.Error => ({
  status: 'CUSTOM_ERROR',
  error: code,
});

/** Результат `queryFn`: данные или ошибка */
export type Outcome<T> = { data: T } | { error: Api.Error };

/** Ответ `queryFn` по найденной сущности: нет её — `NotFound` */
export const orNotFound = <T>(value: T | undefined): Outcome<T> =>
  value === undefined
    ? { error: apiError(Api.ErrorCode.NotFound) }
    : { data: value };
