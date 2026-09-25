# Требования к разработке

Обязательная точка проверки перед любой доработкой кода. Читай применимые
разделы до того, как писать или менять код.

## Разделы

| Категория | Файл | Ключевые правила |
|-----------|------|-----------------|
| Общие конвенции | [general.md](general.md) | TypeScript strict, лимит файла, env, линт, тесты, комментарии |
| Работа с git | [git.md](git.md) | git-flow, имена веток, Conventional Commits, changeset |
| Типовая система | [types.md](types.md) | `src/types`, namespace на сущность, где живут локальные типы |
| Client | [client.md](client.md) | Маршруты, store, RTK Query, стили, слои, импорты |

## Коротко о главном

- **Ветвление — git-flow.** Работа только в `feature/*`, `fix/*`,
  `release/*`, `hotfix/*`; `main` и `develop` — только через PR с `--no-ff`.
- **Коммиты — Conventional Commits** на английском.
- **TypeScript strict везде.** Никаких `any` без объяснения.
- **Маршруты — только через `ROUTES`** ([src/constants/routes.ts](../../src/constants/routes.ts)).
- **HTTP — только через RTK Query** ([src/store/api.ts](../../src/store/api.ts)).
- **Store — только из барреля** `@/store`.
- **Env — только через `env`** из [src/config/env.ts](../../src/config/env.ts).
- **Токены стилей — только из темы** ([src/styles/theme.ts](../../src/styles/theme.ts)).

## См. также

- [../git-flow.md](../git-flow.md) — модель ветвления целиком.
- [../README.md](../README.md) — карта документации.
- [../../AGENTS.md](../../AGENTS.md) — правила работы с проектом.
