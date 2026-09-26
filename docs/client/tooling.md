# Команды и тесты client

## Команды

| Команда | Что делает |
|---------|------------|
| `yarn dev` | Vite dev-сервер на `:3000` (`--port` переопределяет) |
| `yarn build` | `tsc -b` (app + node + test) и `vite build` → `dist/` |
| `yarn preview` | Превью production-сборки на `:3000` |
| `yarn lint` | Oxlint с автофиксом, type-aware правила, `--max-warnings 0` |
| `yarn format` / `yarn format:check` | oxfmt |
| `yarn test` | Jest: `src/**/__tests__/*.spec.ts(x)` |

## Тесты

- Jest 30, env jsdom, трансформер `@swc/jest` (TS → CommonJS без участия
  TypeScript). Типы тестов проверяет `yarn build` через `tsconfig.test.json`.
- `@/config/env` в тестах подменён `src/config/__mocks__/env.ts`; глобал
  `__APP_VERSION__` = `0.0.0-test` ([jest.config.js](../../jest.config.js)).
- ESM-only зависимости (react-router) загружаются через `require(esm)` Jest
  на Node ≥ 24.9 с флагом `--experimental-vm-modules` (его выставляет скрипт
  `test`); `transformIgnorePatterns` не нужен.
- Конвенции — [requirements/general.md](../requirements/general.md#тесты).

## См. также

- [README.md](README.md) — карта `src/`.
- [../../README.md](../../README.md) — запуск и команды репозитория.
