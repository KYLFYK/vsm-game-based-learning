import type { Api } from '@/types';

/** Единая сборка Api.Error, чтобы форма ошибки не расходилась между endpoints */
export const apiError = (code: Api.ErrorCode): Api.Error => ({
  status: 'CUSTOM_ERROR',
  error: code,
});
