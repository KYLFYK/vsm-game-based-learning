# ВСМ — Платформа обучения сотрудников

ВСМ («Высокоскоростная магистраль») — концессионер проекта строительства
высокоскоростной железнодорожной магистрали. Платформа — игровое обучение
для сотрудников компании, в первую очередь проводников: они проходят
обучение в игровой форме, получают достижения, сравнивают результаты с
коллегами и весело проводят время за обучением.

Фронтенд: пустое React-приложение с настроенным тулчейном, Docker-сборкой,
версионированием, CI и документацией, которая служит контекстом для
ИИ-агентов.

Продукт — [docs/product/](docs/product/README.md).

---

## Стек

| Технология | Версия | Роль |
|------------|--------|------|
| React + react-dom | 19 | UI |
| Vite + @vitejs/plugin-react | 8 | Dev-сервер и сборка |
| TypeScript | 7 | Типы; нативный компилятор |
| react-router | 8 | Маршрутизация (декларативный режим) |
| Redux Toolkit + RTK Query, react-redux | 2 / 9 | Состояние и HTTP |
| styled-components | 6 | Стили, тема |
| Oxlint + oxlint-tsgolint, oxfmt | 1 / 7, 0.70 | Линт с type-aware правилами, форматирование |
| Jest + @swc/jest, Testing Library | 30 | Unit-тесты |
| changesets | 3 | Версия и changelog |

Версии, обоснования и список того, что намеренно **не** установлено —
[docs/stack.md](docs/stack.md). Архитектура — [docs/architecture.md](docs/architecture.md).

## Требования к окружению

| Инструмент | Версия |
|------------|--------|
| Node.js | `>=24.9` (зафиксировано в [package.json](package.json)) |
| Yarn | `4.18.0` — закоммичен в `.yarn/releases`, отдельно ставить не нужно |
| Docker | актуальный, с `docker compose` (только для запуска образа) |

---

## Локальная разработка

```bash
yarn install --immutable
cp .env.example .env        # VITE_API_URL — адрес API
yarn dev                    # http://localhost:3000
```

Порт переопределяется флагом: `yarn dev --port 3100`. Conductor делает это
сам через `CONDUCTOR_PORT`.

### Переменные окружения

Единственный env-файл — корневой `.env` ([.env.example](.env.example)): его
читают Vite (`VITE_*`) и docker compose. Назначение переменных —
[docs/architecture.md](docs/architecture.md#переменные-окружения).

---

## Запуск в Docker

```bash
cp .env.example .env
docker compose up --build -d     # http://localhost:${CLIENT_PORT:-3000}
curl localhost:3000/health       # ok
docker compose down
```

Образ: `node:24-alpine` собирает `dist/`, `nginx-unprivileged` отдаёт
статику на 8080 ([Dockerfile](Dockerfile), [nginx.conf](nginx.conf)).
`VITE_API_URL` вшивается в бандл при сборке — после смены нужен
`docker compose build`. Детали — [docs/architecture.md](docs/architecture.md#docker),
прод — [docs/deploy.md](docs/deploy.md).

---

## Команды

| Команда | Что делает |
|---------|------------|
| `yarn dev` | Vite dev-сервер на `:3000` |
| `yarn build` | `tsc -b && vite build` → `dist/` |
| `yarn preview` | Превью production-сборки |
| `yarn lint` | Oxlint с автофиксом, `--max-warnings 0` |
| `yarn format` / `yarn format:check` | oxfmt: записать / проверить |
| `yarn test` | Jest (unit) |
| `yarn changeset` | Changeset для PR — [docs/versioning.md](docs/versioning.md) |

`yarn lint`, `yarn format:check`, `yarn test`, `yarn build` обязательны перед
завершением любой задачи ([docs/requirements/general.md](docs/requirements/general.md)).

---

## Документация

Вся документация живёт в [docs/](docs/README.md) и поддерживается синхронно
с кодом. Точка входа — [docs/README.md](docs/README.md).

| Раздел | О чём |
|--------|-------|
| [docs/product/](docs/product/README.md) | Продукт: концепция, термины, роли, флоу |
| [docs/requirements/](docs/requirements/README.md) | Обязательные конвенции: общие, git, типы, client |
| [docs/git-flow.md](docs/git-flow.md) | Ветвление, коммиты, релиз, хотфикс |
| [docs/ci.md](docs/ci.md) | CI: проверки на PR, версия при merge в `main` |
| [docs/versioning.md](docs/versioning.md) | Changeset, автоверсия, тег, CHANGELOG |
| [docs/deploy.md](docs/deploy.md) | Docker, reverse-proxy, откат |
| [docs/architecture.md](docs/architecture.md) | Структура, потоки данных, env, Docker |
| [docs/stack.md](docs/stack.md) | Версии и что не установлено |
| [docs/client/](docs/client/README.md) | Карта `src/`, роутинг, состояние, API, стили, фичи |
| [docs/plans/](docs/plans/README.md) | Многозадачные планы фич |
| [docs/specs/](docs/specs/README.md) | Спецификации подсистем до реализации |
| [docs/ai.md](docs/ai.md) | Что настроено для ИИ-агентов |

---

## Работа с ИИ-агентами

Правила, документация и настройки инструментов лежат в репозитории и
версионируются с кодом.

| Что | Где | Зачем |
|-----|-----|-------|
| Правила для любого агента | [AGENTS.md](AGENTS.md) | Первый файл, который читает агент: docs-first, requirements-first, docs синхронны с кодом |
| Документация как контекст | [docs/](docs/README.md) | Ответ находится без `grep` по `src/` |
| Обязательные конвенции | [docs/requirements/](docs/requirements/README.md) | Нарушение — баг |
| Настройки Claude Code | [.claude/settings.json](.claude/settings.json) | Разрешённые команды, плагины, без подписи в коммитах |
| Настройки Conductor | [.conductor/settings.toml](.conductor/settings.toml) | Setup/run воркспейса, порт из `CONDUCTOR_PORT`, копируемые файлы |

Детали — [docs/ai.md](docs/ai.md).

---

## Как поддерживать этот файл

README — витрина, а не дубль документации. Когда и что здесь менять —
[docs/README.md](docs/README.md#когда-обновлять-корневой-readmemd). Факт из
README подтверждается ссылкой на файл репозитория или `docs/`.
