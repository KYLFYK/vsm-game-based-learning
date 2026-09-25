# Client

React 19 SPA на Vite 8. Точка входа — [src/index.tsx](../../src/index.tsx),
корневой компонент — [src/app.tsx](../../src/app.tsx).

## Разделы

- [Архитектура](architecture.md) — слои, назначение папок, как расширять.
- [Маршрутизация](routing.md) — `ROUTES`, дерево маршрутов, как добавить.
- [Состояние](state.md) — `configureStore`, типизированные хуки, барель.
- [API-слой](api.md) — RTK Query, `injectEndpoints`, теги, `VITE_API_URL`.
- [Стилизация](styling.md) — тема, `GlobalStyle`, паттерны styled-components.
- [Фичи и флоу](features/README.md) — пошаговые описания (пока пусто).

## Карта `src/`

```
src/
├── index.tsx                  # bootstrap: createRoot + StrictMode + Provider + App
├── app.tsx                    # ThemeProvider + GlobalStyle + BrowserRouter + Routes
├── vite-env.d.ts              # типы Vite, __APP_VERSION__, ImportMetaEnv
├── styled.d.ts                # DefaultTheme styled-components = AppTheme
├── config/
│   ├── env.ts                 # env = readEnv(import.meta.env) — единственная точка чтения env
│   ├── read-env.ts            # readEnv: типизация и проверка обязательных переменных
│   ├── __mocks__/env.ts       # подстановка для Jest (moduleNameMapper)
│   └── __tests__/             # read-env.spec.ts
├── constants/
│   ├── routes.ts              # ROUTES — единственный источник путей (routing.md)
│   ├── app.ts                 # APP_NAME
│   ├── characters.ts          # CHARACTERS — реестр персонажей сценариев
│   ├── backgrounds.ts         # BACKGROUNDS — реестр фонов сцены
│   └── topics.ts              # TOPICS — реестр тем сценариев
├── content/
│   ├── scenarios/smoke-next-car.json  # первый сценарий по format.md
│   ├── courses.json            # курсы: { id, title, description, scenarioIds }
│   ├── load-scenarios.ts       # loadScenarios — validateScenario на импорте, throw при ошибке
│   ├── assert-courses.ts       # assertCourses — courses ссылаются только на загруженные сценарии
│   ├── to-summary.ts           # toSummary — Definition → Scenario.Summary
│   ├── index.ts                # барель: SCENARIOS, COURSES, CONTENT_WARNINGS, toSummary
│   └── __tests__/               # index.spec.ts — загрузка, ошибки, snapshot предупреждений
├── containers/
│   └── layout/app-layout.tsx  # AppLayout — Header (имя + версия) + Main с <Outlet/>
├── hooks/
│   ├── index.ts               # барель
│   ├── use-document-title.ts  # useDocumentTitle — заголовок вкладки на время жизни компонента
│   └── __tests__/             # use-document-title.spec.ts — пример теста хука
├── pages/
│   └── home/                  # HomePage — единственная страница, маршрут /
├── store/
│   ├── api.ts                 # createApi + fetchBaseQuery(env.apiUrl), endpoints пустые (api.md)
│   ├── store.ts               # configureStore, RootState, AppDispatch, useAppDispatch/Selector (state.md)
│   ├── index.ts               # барель: store, api, хуки, типы, экшены scenarioRun
│   ├── slices/
│   │   └── scenario-run/      # слайс scenarioRun (state.md, specs/…/engine.md)
│   │       ├── slice.ts       # ScenarioRunState, initialState, createSlice, экшены с prepare(now)
│   │       ├── reducers.ts    # шаги runStarted, advanced, optionChosen, expired; проверка дедлайнов
│   │       ├── enter-node.ts  # enterNode — слияние stage, таймер узла, финал; finish
│   │       ├── result.ts      # evaluateEnd, computeScore (specs/…/report.md)
│   │       ├── conditions.ts  # holds, resolveNext
│   │       ├── effects.ts     # applyEffect(s), meterBounds — границы шкалы по умолчанию
│   │       ├── index.ts       # барель папки: reducer и экшены
│   │       └── __tests__/     # fixture.ts + reducers*.spec.ts, result, conditions, effects
│   └── __tests__/             # store.spec.ts
├── styles/
│   ├── theme.ts               # токены: colors, spacing, fontSizes, fontFamily, radii; тип AppTheme
│   └── global-style.ts        # GlobalStyle — reset и стили body
├── types/
│   ├── index.ts                # барель: re-export всех namespace
│   ├── character.ts             # namespace Character — персонажи сценариев
│   ├── scenario.ts               # namespace Scenario — формат сценария
│   ├── course.ts                  # namespace Course — курс из сценариев
│   ├── attempt.ts                  # namespace Attempt — сохранённая попытка
│   ├── scenario-run.ts              # namespace ScenarioRun — состояние прохождения
│   ├── api.ts                        # namespace Api — коды ошибок RTK Query
│   └── validation.ts                  # namespace Validation — Code, Issue, Result, Registries
└── utils/
    ├── index.ts                # барель: re-export из scenario-engine
    └── scenario-engine/
        ├── index.ts             # барель: validateScenario
        ├── validate.ts          # validateScenario — фаза 1, фаза 2, предупреждения (specs/…/validation.md)
        ├── validate-shape.ts    # фаза 1: схема Scenario.Definition, коды shape.*
        ├── shape-schema.ts      # декларативные проверки формы: objectOf, arrayOf, recordOf, variantBy
        ├── validate-graph.ts    # фаза 2: коды graph.* (старт, ссылки, переходы, варианты, достижимость)
        ├── validate-refs.ts     # фаза 2: коды ref.* (реестры, characters, шкалы)
        ├── validate-limits.ts   # фаза 2: meter.range, outcome.*, time.nodeOverScenario
        ├── validate-warnings.ts # предупреждения: review.*, flag.*, самопетля, вариант без review
        ├── walk.ts              # обход сценария: узлы, варианты, next, условия, эффекты, персонажи с путями
        ├── issue.ts             # issue(), построение путей, дефолты min/max шкалы
        └── __tests__/           # fixtures.ts + validate*.spec.ts по файлу-источнику кодов
```

Папка `components/` создаётся при появлении первого файла; назначение
папок — [architecture.md](architecture.md#папки-и-их-назначение).
Статика вне `src/` — `public/`, отдаётся от корня сайта: `favicon.svg`,
`characters/*.svg` (заглушки портретов, один SVG на персонажа, кроме
автора) и `backgrounds/*.svg` (заглушки фонов), пути на них — в
`CHARACTERS` и `BACKGROUNDS`.

## Конвенции (короткая выжимка)

- Импорты между папками — через `@/`; внутри папки — относительные.
- Стили — styled-components с токенами из `theme`; глобальное — только
  `global-style.ts`.
- Store и RTK Query хуки — только из `@/store`.
- Маршруты — только `ROUTES`.
- Env — только `env` из `@/config/env`.
- Полные правила — [requirements/client.md](../requirements/client.md).

## Команды

| Команда | Что делает |
|---------|------------|
| `yarn dev` | Vite dev-сервер на `:3000` (`--port` переопределяет) |
| `yarn build` | `tsc -b` (app + node + test) и `vite build` → `dist/` |
| `yarn preview` | Превью production-сборки на `:3000` |
| `yarn lint` | Oxlint с автофиксом, type-aware правила, `--max-warnings 0` |
| `yarn format` / `yarn format:check` | oxfmt |
| `yarn test` | Jest: `src/**/__tests__/*.spec.ts(x)` |

## Тесты

- Jest 30, env jsdom, трансформер `@swc/jest` (TS → CommonJS без участия
  TypeScript). Типы тестов проверяет `yarn build` через `tsconfig.test.json`.
- `@/config/env` в тестах подменён `src/config/__mocks__/env.ts`; глобал
  `__APP_VERSION__` = `0.0.0-test` ([jest.config.js](../../jest.config.js)).
- ESM-only зависимости (react-router) загружаются через `require(esm)` Jest
  на Node ≥ 24.9 с флагом `--experimental-vm-modules` (его выставляет скрипт
  `test`); `transformIgnorePatterns` не нужен.
- Конвенции — [requirements/general.md](../requirements/general.md#тесты).
