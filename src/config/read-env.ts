export interface AppEnv {
  /** Базовый URL API. Вшивается в бандл на этапе сборки. */
  readonly apiUrl: string;
}

type RawEnv = Readonly<Record<string, unknown>>;

const requireVar = (raw: RawEnv, name: string): string => {
  const value = raw[name];

  if (typeof value !== 'string' || value === '') {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
};

/**
 * Единственное место, где env превращается в типизированный объект.
 * Падает при старте, если обязательная переменная не задана: ошибка
 * конфигурации не должна прятаться за неработающими запросами.
 */
export const readEnv = (raw: RawEnv): AppEnv => ({
  apiUrl: requireVar(raw, 'VITE_API_URL'),
});
