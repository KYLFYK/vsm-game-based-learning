# CI/CD

Единственный workflow — [.github/workflows/ci.yml](../.github/workflows/ci.yml).
Проверки бегут на каждый PR; версия и тег — только при push в `main`
(merge в `main` = релиз по [git-flow.md](git-flow.md)).

## Схема

```
PR:          Changeset   Lint   Test   Build

push main:   Lint ─┐
             Test ─┼─> Version (bump, коммит chore(release): vX.Y.Z, тег vX.Y.Z)
             Build ┘
```

| Job | Когда | Что делает |
|-----|-------|-----------|
| `Changeset` | только PR | `yarn changeset status --since=origin/<base>` — красный, если код изменён без changeset ([versioning.md](versioning.md)) |
| `Lint` | PR + push `main` | `yarn lint` и `yarn format:check` |
| `Test` | PR + push `main` | `yarn test` |
| `Build` | PR + push `main` | `yarn build` (включая `tsc -b` для тестов) |
| `Version` | push `main`, после зелёных проверок | `yarn changeset version`, коммит, тег `vX.Y.Z`, push |

`Lint`/`Test`/`Build` независимы и бегут параллельно.

## Job `Version`

- Checkout с `fetch-depth: 0`: генератор changelog ищет коммит и PR каждого
  changeset-файла.
- `GITHUB_TOKEN` передаётся в `changeset version` для запросов к GitHub API.
- Push bump-коммита по `GITHUB_TOKEN` не запускает workflow повторно.
- Без changeset-файлов `changeset version` не запускается (changesets v3
  завершается с кодом 1). Если есть только пустые (`--empty`) и версия не
  изменилась, коммит и тег пропускаются (`changed=false`).
- Прогоны на `main` не отменяются (`cancel-in-progress: false`). Если за
  время прогона `main` уехал вперёд, `push` отклонится; следующий прогон
  поднимет версию за оба merge.

## Общий setup

Composite action [.github/actions/setup/action.yml](../.github/actions/setup/action.yml):
Node 24 с кешем yarn, `yarn install --immutable`, без corepack.
Yarn берётся из [.yarnrc.yml](../.yarnrc.yml) (`yarnPath`).

## Настройка репозитория GitHub

Secrets не нужны: `GITHUB_TOKEN` встроенный. По умолчанию workflow получает
`contents: read`; `contents: write` выдан только job `Version`.

Рекомендуемые настройки:

- Branch protection на `main` и `develop`: required checks `Changeset`,
  `Lint`, `Test`, `Build`; запрет прямого push. Для `github-actions[bot]`
  нужно исключение на push в `main`, иначе `Version` не закоммитит bump.
- «Require approval for all external contributors» в Settings → Actions.
- `repo` в [.changeset/config.json](../.changeset/config.json) должен совпадать
  с репозиторием (сейчас — `KYLFYK/vsm-game-based-learning`), иначе
  `Version` упадёт на генерации changelog.

## Как расширять

- **Образ в registry** — job после `Version`: `docker/build-push-action` с
  `build-args: VITE_API_URL=${{ vars.VITE_API_URL }}`, теги `latest`,
  `X.Y.Z`, `sha-<commit>`. Значение `VITE_API_URL` — в Variables
  репозитория, потому что вшивается в бандл.
- **Деплой** — job на self-hosted runner: `docker compose pull && up -d`
  ([deploy.md](deploy.md)).
- **E2E** — отдельный job после сборки образа: поднять контейнер и
  прогнать Playwright.

## См. также

- [versioning.md](versioning.md) — changeset и типы изменений.
- [deploy.md](deploy.md) — запуск в Docker и откат.
- [requirements/git.md](requirements/git.md) — локальный контур до push.
