import type { Validation } from '@/types';

export const DEFAULT_METER_MIN = 0;
export const DEFAULT_METER_MAX = 100;

export const issue = (
  code: Validation.Code,
  path: string,
  message: string
): Validation.Issue => ({ code, path, message });

export const key = (path: string, name: string): string =>
  path === '' ? name : `${path}.${name}`;

export const index = (path: string, position: number): string =>
  `${path}[${position}]`;

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// JSON-ключи вроде `constructor` не должны находиться через прототип
export const has = (record: object | undefined, name: string): boolean =>
  record !== undefined && Object.hasOwn(record, name);
