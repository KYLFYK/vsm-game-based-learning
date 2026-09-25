# Архитектура

## Обзор

Один плоский пакет `vsm-game-based-learning`: React 19 SPA на Vite 8.
Серверной части в репозитории нет — приложение ходит в API по `VITE_API_URL`.

```
vsm-game-based-learning/
├── src/                    → приложение (карта — client/README.md)
├── public/                 → статика, отдаётся от корня сайта
├── docs/                   → документация (этот раздел)
├── .github/                → CI (ci.md)
├── .changeset/             → changesets (versioning.md)
├── .claude/, .conductor/   → настройки агентов (ai.md)
├── Dockerfile, nginx.conf  → образ со статикой (см. Docker ниже)
├── docker-compose.yml      → запуск образа локально
├── vite.config.ts          → сборка, алиас @/, __APP_VERSION__, порт 3000
├── tsconfig*.json          → app / node / test проекты (stack.md)
├── jest.config.js          → unit-тесты (client/README.md)
└── .oxlintrc.json, .oxfmtrc.json → линт и форматирование (stack.md)
```

## Потоки данных

```
[Browser]
   │  HTTP, JSON
   ▼
[SPA] RTK Query (src/store/api.ts), baseUrl = env.apiUrl
   ▼
[API] внешний сервер по VITE_API_URL
```

Слои приложения и их границы — [client/architecture.md](client/architecture.md).
Аутентификации пока нет: заголовки и refresh-логика добавляются в
`baseQuery` при появлении API ([client/api.md](client/api.md)).

## Переменные окружения

Единственный env-файл — корневой `.env` (пример — [.env.example](../.env.example)).
Его читают Vite (`VITE_*` через `import.meta.env`) и docker compose
(подстановка `${...}`).

| Переменная | Кто читает | Назначение |
|------------|------------|------------|
| `VITE_API_URL` | Vite, Docker build arg | Базовый URL API. Вшивается в бандл на этапе `vite build`; в dev — из `.env` |
| `CLIENT_PORT` | docker compose | Порт хоста для контейнера (внутри nginx слушает 8080). По умолчанию 3000 |

Правила:

- Код читает env только через `src/config/env.ts` (`env.apiUrl`). Объект
  собирает `readEnv` из `src/config/read-env.ts`: отсутствие обязательной
  переменной — ошибка при старте, а не тихий `undefined`.
- В Jest модуль `@/config/env` подменён `src/config/__mocks__/env.ts`
  (`moduleNameMapper` в `jest.config.js`): в CommonJS нет `import.meta`.
- Порт dev-сервера не env: он задан в `vite.config.ts` (3000) и
  переопределяется флагом `--port` (так делает Conductor).
- Порядок добавления новой переменной — [requirements/general.md](requirements/general.md#переменные-окружения).

## Docker

[Dockerfile](../Dockerfile) — две стадии:

| Стадия | Образ | Что делает |
|--------|-------|-----------|
| `builder` | `node:24-alpine` | `install --immutable` через закоммиченный `.yarn/releases/yarn-4.18.0.cjs`, затем `yarn build` с `ARG VITE_API_URL` |
| `runner` | `nginxinc/nginx-unprivileged:1.29-alpine` | `nginx.conf` + `dist/` → `/usr/share/nginx/html`, порт 8080, без root |

[nginx.conf](../nginx.conf): `/assets/` с `Cache-Control: immutable` (имена
файлов хешированы), `/health` → `200 ok`, остальное → `try_files $uri
/index.html` с `no-cache` (SPA-fallback). Версия nginx скрыта
(`server_tokens off`), все ответы идут с `X-Content-Type-Options: nosniff`.

[docker-compose.yml](../docker-compose.yml): один сервис `client`,
`build.args.VITE_API_URL`, `ports: ${CLIENT_PORT:-3000}:8080`. Смена
`VITE_API_URL` требует `docker compose build`.

Новая `VITE_*`-переменная: `read-env.ts` → `vite-env.d.ts` → `.env.example`
→ `ARG`/`ENV` в стадии `builder` → `build.args` в compose → эта таблица.

## Где искать дальше

- [client/architecture.md](client/architecture.md) — слои приложения.
- [stack.md](stack.md) — версии и конфиги инструментов.
- [deploy.md](deploy.md) — запуск в Docker и reverse-proxy.
