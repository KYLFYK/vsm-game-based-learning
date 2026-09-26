# Версия и changelog

Версия поднимается **автоматически в CI** при merge в `main` по
changeset-файлам из PR. Инструмент — [changesets](https://github.com/changesets/changesets),
конфиг — [.changeset/config.json](../.changeset/config.json).

## Что фиксировано

| Факт | Где |
|------|-----|
| Один пакет `vsm-game-based-learning`, версия в [package.json](../package.json) | `privatePackages: { version: true }` |
| Changelog — `CHANGELOG.md` в корне (создаёт CI при первом релизе) | генератор `@changesets/changelog-github` |
| Генератору нужен репозиторий: `repo` в `config.json` — `KYLFYK/vsm-game-based-learning` | [ci.md](ci.md#настройка-репозитория-github) |
| Тег на `main` — `vX.Y.Z` (ставит job `Version`, не `changeset tag`) | [ci.md](ci.md) |
| Версия в UI — шапка layout, `__APP_VERSION__` из `package.json` | [vite.config.ts](../vite.config.ts) |

## Обязанность разработчика: changeset в каждом PR

Перед коммитом и push изменений в коде приложения (`src/`, `public/`,
`index.html`, `Dockerfile`, `nginx.conf`, `package.json`) из корня:

```bash
yarn changeset
```

Команда спросит тип изменения и описание и создаст `.changeset/<name>.md`.
Файл коммитится вместе с кодом. Без него PR-check `Changeset` красный.

Формат файла:

```md
---
'vsm-game-based-learning': minor
---

Фильтр по статусу в списке заказов.
```

Правила:

- **Тип** — по влиянию на пользователя: `patch` — исправление, косметика;
  `minor` — новая функциональность; `major` — несовместимое изменение.
- **Описание** — на русском, одной-двумя фразами, для человека, читающего
  CHANGELOG. Имена сущностей и кода — на английском. Не дублирует subject
  коммита.
- Один PR — обычно один changeset.
- Только `docs/`, `.github/`, конфиги тулчейна — changeset **не требует**.
- Правка кода без изменения поведения (тесты, комментарии) —
  `yarn changeset --empty`. Если поведение изменилось, это `patch`.

Локальная проверка (файл должен быть в индексе):

```bash
git add .changeset
yarn changeset status --since=origin/main
```

`yarn changeset version` локально не запускать — это делает CI.

## Что делает CI при merge в `main`

Job `Version` ([ci.md](ci.md)) после зелёных `Lint`/`Test`/`Build`:

1. `yarn changeset version` — поднимает версию в `package.json`, дописывает
   `CHANGELOG.md`, удаляет changeset-файлы.
2. Коммит `chore(release): vX.Y.Z` от `github-actions[bot]`, тег `vX.Y.Z`,
   push в `main`. Push по `GITHUB_TOKEN` не запускает workflow повторно.

Если changeset-файлов нет, версия не меняется и коммита не будет.

## После релиза: back-merge в `develop`

Коммит `chore(release): vX.Y.Z` появляется только в `main`: он удаляет
выпущенные changeset-файлы и поднимает версию. Пока его нет в `develop`,
правка уже выпущенного changeset в `develop` даёт конфликт
«modify/delete» в следующем PR в `main`.

- После каждого релиза — ветка `fix/back-merge-release-vX-Y-Z` от
  `develop`, в неё `git merge --no-ff origin/main`, PR в `develop`.
- Выпущенный changeset не редактируют: новая работа — новый файл
  `.changeset/<name>.md`.

## Как «перескочить» версию

В обычном PR выставить нужную версию в `package.json` и добавить changeset —
CI продолжит от неё.

## См. также

- [ci.md](ci.md) — job `Version` и `Changeset`.
- [git-flow.md](git-flow.md#релиз) — версия в релизном процессе.
- [requirements/git.md](requirements/git.md) — чек-лист.
