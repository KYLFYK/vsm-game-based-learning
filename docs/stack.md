# Технологический стек

## Глобально

| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | `>=24.9` | Runtime. С 24.9 Jest умеет `require(esm)` — нужно для ESM-only пакетов (react-router); флаг `--experimental-vm-modules` выставляет скрипт `test` |
| Yarn | `4.18.0` | Закоммичен в `.yarn/releases`, `yarnPath` в [.yarnrc.yml](../.yarnrc.yml); Docker и CI используют его же |
| TypeScript | `^7.0.2` | Нативный компилятор (Go). Только CLI `tsc`, программного API нет — поэтому в стеке нет typescript-eslint и ts-jest |
| @changesets/cli | `^3.0.3` | Changeset в PR, автоверсия в CI ([versioning.md](versioning.md)) |
| @changesets/changelog-github | `^1.0.1` | CHANGELOG со ссылкой на PR и автора |

## Приложение

| Технология | Версия | Назначение |
|------------|--------|------------|
| React / react-dom | `^19.3.0` | UI |
| Vite | `^8.3.1` | Dev-сервер и сборка (rolldown + oxc); `@vitejs/plugin-react` `^6.1.1` |
| react-router | `^8.4.0` | Маршрутизация, декларативный режим. ESM-only; `react-router-dom` больше нет: всё импортируется из `react-router` ([client/routing.md](client/routing.md)) |
| Redux Toolkit | `^2.12.0` | Состояние + RTK Query |
| react-redux | `^9.3.0` | Биндинги, типизированные хуки через `withTypes` |
| styled-components | `^6.5.3` | Стили, `ThemeProvider` ([client/styling.md](client/styling.md)) |

## Инструменты разработки

| Технология | Версия | Назначение |
|------------|--------|------------|
| Oxlint | `^1.85.0` | Линтер. Собственный парсер TS, плагины typescript / react / import. Конфиг — [.oxlintrc.json](../.oxlintrc.json) |
| oxlint-tsgolint | `^7.0.2003` | Type-aware правила Oxlint; построен на TypeScript 7.0.2, компилятор внутри пакета |
| oxfmt | `^0.70.0` | Форматтер, вывод совместим с Prettier; сортировка импортов. Конфиг — [.oxfmtrc.json](../.oxfmtrc.json) |
| Jest | `^30.5.2` | Unit-тесты, env jsdom. Конфиг — [jest.config.js](../jest.config.js) |
| @swc/jest | `^0.2.39` | Трансформация TS/TSX → CommonJS для Jest без участия TypeScript |
| @testing-library/react | `^16.3.3` | `renderHook` в тестах хуков |

## TypeScript

Три проекта, собираемые `tsc -b` из корневого [tsconfig.json](../tsconfig.json):

| Проект | Что проверяет | Особенности |
|--------|---------------|-------------|
| [tsconfig.app.json](../tsconfig.app.json) | `src/` без тестов и моков | `strict`, `bundler`, `paths: @/* → src/*`, `types: ["vite/client"]` |
| [tsconfig.node.json](../tsconfig.node.json) | `vite.config.ts` | `types: ["node"]` |
| [tsconfig.test.json](../tsconfig.test.json) | весь `src/` вместе с тестами | + `types: jest, node`; Jest типы не проверяет — это делает `yarn build` |

Учтённые изменения TS 7: `types` по умолчанию пустой (задан явно), `baseUrl`
и `moduleResolution: node10` удалены (используются `paths` и `bundler`),
`strict` включён по умолчанию.

Редактор: VS Code с TS 7 работает через расширение `TypeScriptTeam.native-preview`
(рекомендовано в [.vscode/extensions.json](../.vscode/extensions.json)).

## Линтинг и форматирование

- `yarn lint` = `oxlint --fix --max-warnings 0`: категории `correctness` и
  `suspicious` как ошибки, плюс явные правила из эталона (`max-lines: 300`,
  `consistent-type-imports`, `rules-of-hooks`, `only-export-components`,
  `no-cycle` и др.); `react/exhaustive-deps` выключен намеренно.
- `yarn format` = `oxfmt`, `yarn format:check` — для CI. Markdown не
  форматируется (`ignorePatterns`).
- Порядок импортов задаёт oxfmt: `react*` → внешние и builtin → `@/` →
  относительные. Плагин `import/order` не нужен.

## Что НЕ установлено

Список помогает не выдумывать зависимости. Нужно что-то из списка — обсуди и
добавь сюда.

- **UI-кит** — компоненты пишутся на styled-components.
- **Form-библиотека** — при появлении форм выбирается отдельно.
- **Авторизация** — нет slice, guard'ов и refresh-логики.
- **Дата-библиотека, иконки, i18n, анимации.**
- **E2E-тесты** — только unit на Jest.
- **ESLint, Prettier, typescript-eslint, ts-jest** — заменены Oxlint, oxfmt и
  @swc/jest (см. выше).

## См. также

- [architecture.md](architecture.md) — структура и env.
- [client/README.md](client/README.md) — команды и конвенции тестов.
