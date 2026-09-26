# Работа с git

Модель ветвления — классический **git-flow**. Правила ниже обязательны для
любого изменения. Развёрнуто — [../git-flow.md](../git-flow.md).

## Ветки

- Долгоживущих веток две: `main` (production, теги `vX.Y.Z`) и `develop`
  (интеграция). Прямые коммиты и `push` в них запрещены.
- Любая работа — во временной ветке с префиксом:

  | Префикс | От | В |
  |---------|-----|---|
  | `feature/*` | `develop` | `develop` |
  | `fix/*` | `develop` | `develop` |
  | `release/*` | `develop` | `main` + `develop` |
  | `hotfix/*` | `main` | `main` + `develop` |

- Имя: `<префикс>/<kebab-case>`, латиница нижним регистром, ≤ 5 слов,
  описывает результат. `release/*` и `hotfix/*` — версией без `v`.
- Воркспейс Conductor получает служебное имя ветки — переименовать под
  git-flow **до первого коммита**: `git branch -m feature/<название>`.
- Один воркспейс = одна ветка = один PR.

## Коммиты

- Формат — Conventional Commits: `<type>(<scope>): <subject>`.
- `type`: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`,
  `chore`.
- `scope` обязателен везде, кроме `docs:` и общего `chore:`: доменный модуль
  либо `app`, `deps`, `docker`, `ci`, `lint`, `ai`, `changeset`.
- `subject`: английский, повелительное наклонение, с маленькой буквы, без
  точки, ≤ 72 символов.
- Обновление `docs/` идёт в той же ветке, что и код; допустим отдельный
  коммит `docs: …`, но не отдельный PR.

## Changeset

- **Перед коммитом и push** изменений в коде приложения (`src/`, `public/`,
  `index.html`, `Dockerfile`, `nginx.conf`, `package.json`) — `yarn changeset`: тип
  (`patch` / `minor` / `major`), описание **на русском**. Файл
  `.changeset/*.md` коммитится вместе с кодом.
- Без changeset PR-check `Changeset` красный. Только `docs/`, `.github/`,
  конфиги тулчейна — changeset не требуют.
- Версию в `package.json` и теги руками не трогать — это делает CI:
  [../versioning.md](../versioning.md).

## Merge

- Только через PR и только `--no-ff`. Squash-merge и rebase-merge запрещены.
- Force-push в опубликованную ветку запрещён.
- Перед `push` локально зелёные `yarn lint`, `yarn format:check`,
  `yarn test`, `yarn build`.
- После релиза коммит `chore(release)` из `main` back-merge'ится в
  `develop` ([../versioning.md](../versioning.md#после-релиза-back-merge-в-develop));
  выпущенные changeset-файлы не редактируются.
- `release/*` и `hotfix/*` после merge в `main` back-merge'атся в `develop`
  в той же задаче.
- Ветка удаляется после merge — локально и в `origin`.

## См. также

- [../git-flow.md](../git-flow.md) — модель, релиз, хотфикс.
- [../versioning.md](../versioning.md) — changeset, автоверсия, changelog.
- [general.md](general.md) — контур проверки перед коммитом.
