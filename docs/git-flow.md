# Git-flow

Модель ветвления — классический **git-flow** (Vincent Driessen) с CI/CD на
GitHub Actions ([ci.md](ci.md)) и разработкой в параллельных воркспейсах
Conductor. Чек-лист требований — [requirements/git.md](requirements/git.md).

## Долгоживущие ветки

| Ветка | Роль | Что в неё попадает |
|-------|------|--------------------|
| `main` | Production-состояние. Каждый merge — релиз; CI ставит тег `vX.Y.Z` | только merge из `release/*` и `hotfix/*` |
| `develop` | Интеграционная ветка, база для всей разработки | merge из `feature/*`, `fix/*`, back-merge из `release/*` и `hotfix/*` |

Прямые коммиты и `push` в `main` и `develop` запрещены — только PR.

## Временные ветки

| Префикс | От | В | Назначение |
|---------|-----|---|-----------|
| `feature/*` | `develop` | `develop` | Функциональность, доработка, рефакторинг, документация |
| `fix/*` | `develop` | `develop` | Дефект, найденный до релиза |
| `release/*` | `develop` | `main` + `develop` | Стабилизация: багфиксы и docs; версию ставит CI ([versioning.md](versioning.md)) |
| `hotfix/*` | `main` | `main` + `develop` | Срочное исправление продового дефекта |

Ветка удаляется сразу после merge — локально и в `origin`.

## Именование веток

- Формат `<префикс>/<kebab-case>`: латиница нижним регистром, слова через `-`.
- Имя описывает **результат**, не процесс: `feature/order-list-filters`.
- Не длиннее 5 слов. Номер задачи — в описании PR, не в имени.
- `release/*` и `hotfix/*` именуются версией без `v`: `release/0.3.0`,
  `hotfix/0.3.1`.

### Специфика Conductor

Conductor создаёт воркспейс со служебным именем ветки (`guangzhou`). До
первого коммита её переименовывают: `git branch -m feature/<название>`.
Один воркспейс = одна ветка = один PR. Агент переименовывает ветку только по
явной просьбе ([ai.md](ai.md)).

## Коммиты

Формат — **Conventional Commits**: `<type>(<scope>): <subject>`.

| type | Когда |
|------|-------|
| `feat` | Новая функциональность |
| `fix` | Исправление дефекта |
| `docs` | Только `docs/`, `README.md`, `AGENTS.md` |
| `refactor` | Изменение кода без изменения поведения |
| `test` | Только тесты |
| `perf` | Оптимизация без изменения контракта |
| `build` | Сборка, зависимости, Docker |
| `ci` | GitHub Actions |
| `chore` | Прочее служебное |

`subject`: английский, повелительное наклонение, с маленькой буквы, без
точки, ≤ 72 символов.

`scope` обязателен везде, кроме `docs:` и общего `chore:`. Значение —
доменный модуль (`orders`, `auth`, …) либо инфраструктурный: `app`, `deps`,
`docker`, `ci`, `lint`, `ai`, `changeset`. Доменный приоритетнее.

```
feat(orders): add status filter to orders list
fix(app): restore document title on page unmount
build(deps): bump vite to 8.3
docs: describe theme tokens
```

## Merge и PR

- Только через PR и только `--no-ff`. Squash-merge и rebase-merge запрещены:
  merge-коммиты показывают границы фич и точки релизов.
- Rebase допустим только в своей неопубликованной ветке. Force-push в
  опубликованную ветку запрещён.
- CI проверяет PR, но локальный контур обязателен до push:
  `yarn lint && yarn format:check && yarn test && yarn build`.

## Релиз

```bash
git checkout -b release/0.3.0 develop
# только багфиксы и docs
git checkout main && git merge --no-ff release/0.3.0
git checkout develop && git merge --no-ff release/0.3.0   # back-merge обязателен
```

Версию руками не поднимают: при merge в `main` CI применяет changeset-файлы,
коммитит bump и ставит тег `vX.Y.Z` ([versioning.md](versioning.md)).

## Хотфикс

```bash
git checkout -b hotfix/0.3.1 main
# фикс + changeset типа patch
git checkout main && git merge --no-ff hotfix/0.3.1
git checkout develop && git merge --no-ff hotfix/0.3.1   # back-merge обязателен
```

Back-merge в `develop` — часть той же задачи. Без него следующий релиз
откатит хотфикс.

## Что запрещено

- `push` в `main` и `develop`; force-push в опубликованную ветку.
- Squash-merge и rebase-merge PR.
- Ветки без префикса, с кириллицей или транслитом.
- Две несвязанные задачи в одной ветке.
- Коммиты `wip`, `fix`, `update` — без типа и scope.

## См. также

- [requirements/git.md](requirements/git.md) — чек-лист.
- [versioning.md](versioning.md) — changeset и автоверсия.
- [ci.md](ci.md) — что проверяет CI.
