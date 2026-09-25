# ВСМ — Платформа обучения сотрудников — инструкция для агентов

Этот файл — **первое, что читает любой ИИ-агент** (Claude Code, Codex, Cursor
и другие) в начале работы. Он задаёт правила работы с проектом и направляет
на [docs/](docs/README.md).

---

## 0. Что это за проект

`vsm-game-based-learning` — платформа игрового обучения для сотрудников
компании ВСМ («Высокоскоростная магистраль»), в первую очередь проводников:
курсы и ситуации в игровой форме, достижения, сравнение результатов с
коллегами в разрезе компании, депо и бригады.

Фронтенд: React 19 SPA на Vite 8, состояние — Redux Toolkit + RTK Query,
стили — styled-components, маршруты — react-router 8, TypeScript 7. Один
плоский пакет без монорепо. Серверной части нет: API подключается через
`VITE_API_URL`.

Подробности — [docs/architecture.md](docs/architecture.md) и
[docs/stack.md](docs/stack.md). Продукт — [docs/product/](docs/product/README.md).

---

## 1. Главное правило: requirements-first

> **При каждом запросе на доработку кода — открой
> [docs/requirements/README.md](docs/requirements/README.md) и следуй
> применимым требованиям.**

Нарушение требований — такой же баг, как сломанная логика.

---

## 2. Главное правило: docs-first

> **Получил задачу — сначала иди в [docs/](docs/README.md), потом в код.**

Алгоритм:
1. Открой [docs/README.md](docs/README.md) — карту документации.
2. Спустись к нужному разделу: карта `src/` — [docs/client/README.md](docs/client/README.md),
   слой или механизм — `docs/client/<тема>.md`, пользовательский флоу —
   [docs/client/features/](docs/client/features/README.md).
3. Только после этого читай код по ссылкам из docs.

В код напрямую — только если docs ссылаются на файл и нужны детали, docs
отстали от кода (тогда см. §3), или задача точечная в известном файле.
Не запускай `grep` по всему `src/`, если ответ уже есть в docs.

---

## 3. Главное правило: docs синхронны с кодом

> **Любое изменение кода влечёт обновление docs/ в той же задаче.**

| Тип изменения | Что обновить в docs/ |
|---------------|----------------------|
| Новая страница / маршрут | [docs/client/routing.md](docs/client/routing.md), карта в [docs/client/README.md](docs/client/README.md), при необходимости — [docs/client/features/](docs/client/features/README.md) |
| Новый slice / логика store | [docs/client/state.md](docs/client/state.md) |
| Новый RTK Query endpoint | [docs/client/api.md](docs/client/api.md) + файл фичи |
| Новый компонент, контейнер, хук, util | Карта `src/` в [docs/client/README.md](docs/client/README.md) |
| Новая зависимость | [docs/stack.md](docs/stack.md) (таблица и «что НЕ установлено») |
| Новая env-переменная | [docs/architecture.md](docs/architecture.md#переменные-окружения) + порядок из [requirements/general.md](docs/requirements/general.md#переменные-окружения) |
| Тема / глобальные стили | [docs/client/styling.md](docs/client/styling.md) |
| Git-процесс | [docs/git-flow.md](docs/git-flow.md) + [requirements/git.md](docs/requirements/git.md) |
| AI-обвязка (`AGENTS.md`, `.claude/`, `.conductor/`) | [docs/ai.md](docs/ai.md) + раздел «Работа с ИИ-агентами» в [README.md](README.md) |
| npm-скрипт, порт, `.env`, Docker, CI | Соответствующий файл docs/ **и** [README.md](README.md) — триггеры в [docs/README.md](docs/README.md#когда-обновлять-корневой-readmemd) |

Если подходящего файла нет — создай его и зарегистрируй в ближайшем
`README.md` docs. Не оставляй изменение недокументированным.

---

## 4. Размер файлов docs/

- Порог одного файла docs/ — **200 строк**.
- Файл вырос за порог — разбей его в той же задаче: выдели части, создай
  подпапку с `README.md`-индексом или несколько файлов, оставь в исходном
  сводку и ссылки, обнови обратные ссылки и родительский `README.md`.

---

## 5. Стиль docs/

- Пояснения — на русском. Имена файлов, типов, команд — на английском.
- Ссылки относительные: `[label](path/to/file.md)`. На код — без номеров
  строк (они быстро устаревают).
- В нетривиальном файле — раздел «См. также».
- Без эмодзи и многословия. Таблицы и списки лучше абзацев.
- Факт живёт в одном месте; в остальных — ссылка.

---

## 6. Конвенции кода

| Раздел | Файл |
|--------|------|
| Общие (TypeScript, лимит файла, env, линт, тесты) | [requirements/general.md](docs/requirements/general.md) |
| Git (git-flow, ветки, коммиты, changeset) | [requirements/git.md](docs/requirements/git.md) |
| Типы (`src/types`, namespace на сущность) | [requirements/types.md](docs/requirements/types.md) |
| Client (маршруты, store, RTK Query, стили, слои) | [requirements/client.md](docs/requirements/client.md) |

---

## 7. Git

Модель — классический git-flow: [docs/git-flow.md](docs/git-flow.md).
Минимум:

- `main` и `develop` — долгоживущие, прямые коммиты и push запрещены.
  Работа — в `feature/<kebab-case>` или `fix/<kebab-case>` от `develop`.
- Conductor заводит ветку со служебным именем — её переименовывают под
  git-flow до первого коммита. Агент переименовывает ветку только по
  явной просьбе.
- Коммиты — Conventional Commits: `<type>(<scope>): <subject>`, английский,
  повелительное наклонение, без точки.
- Merge — только через PR и только `--no-ff`.
- Перед коммитом изменений в коде приложения — `yarn changeset`
  (описание на русском). Версию и тег ставит CI:
  [docs/versioning.md](docs/versioning.md).

---

## 8. Команды

| Команда | Эффект |
|---------|--------|
| `yarn dev` | Vite dev-сервер на `:3000` |
| `yarn build` | `tsc -b` (приложение, конфиги, тесты) + `vite build` → `dist/` |
| `yarn lint` | Oxlint с автофиксом и type-aware правилами, `--max-warnings 0` |
| `yarn format` / `yarn format:check` | oxfmt: записать / проверить |
| `yarn test` | Jest, unit-тесты `src/**/__tests__/*.spec.ts(x)` |
| `yarn changeset` | Changeset для PR |

Задача не завершена, пока не зелены `yarn lint`, `yarn format:check`,
`yarn test`, `yarn build` и пока в PR нет changeset для изменений кода.

---

## 9. Что не делать

- Не коммитить в `main` и `develop`; не заводить ветки без префикса;
  не делать squash-merge.
- Не вводить зависимости без явного запроса — сначала обсуждать.
- Не делать попутный рефакторинг: изменение узкое, как задача.
- Не писать комментарии «что делает строка»; только «почему», и только
  если неочевидно.
- Не оставлять docs/ в рассинхроне с кодом (§3) и не превышать порог
  размера (§4).
- Не дублировать факты между файлами docs/.
- Не писать пути строками — только `ROUTES`; не ходить в HTTP мимо RTK
  Query; не импортировать из подпапок `store/` мимо барреля.
