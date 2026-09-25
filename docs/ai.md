# Работа с ИИ-агентами

Проект рассчитан на разработку с ИИ-агентами. Всё, что нужно агенту —
правила, документация, настройки инструментов — лежит в репозитории и
версионируется с кодом. Новый агент или воркспейс получает одинаковый
контекст без ручной настройки.

## Слои контекста

| Слой | Файл / папка | Роль |
|------|--------------|------|
| Правила проекта | [AGENTS.md](../AGENTS.md) | Первое, что читает агент: docs-first, requirements-first, docs-sync, лимиты, «что не делать» |
| Карта документации | [README.md](README.md) | Точка входа: агент идёт по дереву docs вместо `grep` по `src/` |
| Обязательные конвенции | [requirements/](requirements/README.md) | Нарушение — такой же баг, как сломанная логика |
| Продуктовый контекст | [product/](product/README.md) | Термины, роли, флоу — чтобы агент не выдумывал бизнес-правила |
| Планы фич | [plans/](plans/README.md) | Многошаговые фичи переживают смену сессии |

## AGENTS.md вместо CLAUDE.md

Файл правил один и агентонезависимый: `AGENTS.md` читают Codex, Cursor и
другие инструменты, Claude Code — с версии 2.1.277, если рядом нет
`CLAUDE.md` или `CLAUDE.local.md`. Проверка в Claude Code: `/context` →
список memory files содержит `AGENTS.md`.

Если сессия не читает `AGENTS.md` (старая версия, отключён встроенный
плагин `agents-md`), обходной путь — локальный `CLAUDE.md` из одной строки
`@AGENTS.md`. В репозиторий он не добавляется.

## Скиллы

Скиллов в проекте нет. Новый кладётся в `.agents/skills/<name>/SKILL.md`
и регистрируется здесь.

Документация библиотек берётся через context7, процесс задачи описан в
`AGENTS.md`.

## Настройки инструментов

### Claude Code — [.claude/settings.json](../.claude/settings.json)

- `permissions.allow` — команды без подтверждения: `yarn lint`, `yarn test`,
  `yarn build`, `yarn format*`, `yarn changeset*`. Остальное — по запросу.
- `enabledPlugins` — `typescript-lsp` (навигация по типам), `playwright`
  (браузерные проверки), `context7` (документация библиотек).
- `attribution` — пустые строки: агент не подписывает коммиты и PR.
- Hooks не настроены намеренно.

### Conductor — [.conductor/settings.toml](../.conductor/settings.toml)

- `scripts.setup = "yarn install --immutable"` при создании воркспейса.
- `scripts.run.dev` — `yarn dev --port $CONDUCTOR_PORT --strictPort`:
  у каждого воркспейса свой порт, `run_mode = "concurrent"`.
- `scripts.run.test` — `yarn test --watch`.
- `file_include_globs` — `.env*` и `.claude` копируются в новый воркспейс,
  поэтому он сразу рабочий.

### Git

Агент работает в `feature/*` или `fix/*` от `develop`, пишет Conventional
Commits и кладёт changeset перед коммитом изменений кода —
[git-flow.md](git-flow.md), [versioning.md](versioning.md).
[.gitignore](../.gitignore) исключает `.claude/*`, кроме `settings.json`, и
папку `.context` Conductor.

## Обязательный контур проверки

Задача не завершена, пока не зелены:

```bash
yarn lint && yarn format:check && yarn test && yarn build
```

и пока для изменений кода приложения нет changeset
(`git add .changeset && yarn changeset status --since=origin/main`).

## Правила, которые агент не нарушает

Полный список — [AGENTS.md](../AGENTS.md#9-что-не-делать): без новых
зависимостей и попутного рефакторинга, docs синхронны с кодом, файлы docs
≤ 200 строк, без коммитов в `main`/`develop`.

## См. также

- [AGENTS.md](../AGENTS.md) — правила проекта
- [requirements/README.md](requirements/README.md) — конвенции кода
- [../README.md](../README.md) — раздел «Работа с ИИ-агентами»
