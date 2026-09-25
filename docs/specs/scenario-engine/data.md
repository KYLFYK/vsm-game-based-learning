# Данные

## Контент в бандле

```
src/content/
├── scenarios/
│   ├── smoke-next-car.json
│   └── …
├── courses.json
└── index.ts
```

- `tsconfig.app.json` и `tsconfig.test.json` получают
  `"resolveJsonModule": true`.
- `index.ts` импортирует каждый JSON, приводит к `unknown` и прогоняет
  через `validateScenario(json, registries)`
  ([validation.md](validation.md)). Любая ошибка → `throw new Error` с
  перечнем `code path message`, чтобы dev-сервер и тесты падали сразу.
- Экспорт: `SCENARIOS: Record<Scenario.Id, Scenario.Definition>`,
  `COURSES: Course.Definition[]`, `toSummary(definition): Scenario.Summary`.
- Тест `__tests__/index.spec.ts`: модуль загружается без исключения,
  предупреждения валидатора выводятся в snapshot, чтобы их рост был виден
  в ревью.
- Курс ссылается только на существующие сценарии: проверяется там же.

## RTK Query

`tagTypes` в `store/api.ts`: `['Scenarios', 'Courses', 'Attempts']`.
Все endpoints на `queryFn`; сигнатуры не меняются при переезде на HTTP.

### `store/apis/scenarios-api.ts`

| Хук | Аргумент | Результат | Теги | Источник в MVP0 |
|-----|----------|-----------|------|-----------------|
| `useGetScenariosQuery` | `void` | `Scenario.Summary[]` | `Scenarios` | `Object.values(SCENARIOS).map(toSummary)` |
| `useGetScenarioQuery` | `Scenario.Id` | `Scenario.Definition` | `{ type: 'Scenarios', id }` | `SCENARIOS[id]`; нет → `{ error: Api.Error }` с `ErrorCode.NotFound` |

### `store/apis/courses-api.ts`

| Хук | Аргумент | Результат | Теги |
|-----|----------|-----------|------|
| `useGetCoursesQuery` | `void` | `Course.Definition[]` | `Courses` |
| `useGetCourseQuery` | `Course.Id` | `Course.Definition` | `{ type: 'Courses', id }`; нет → `ErrorCode.NotFound` |

### `store/apis/attempts-api.ts`

| Хук | Аргумент | Результат | Теги |
|-----|----------|-----------|------|
| `useGetAttemptsQuery` | `{ scenarioId?: Scenario.Id }` | `Attempt.Item[]`, новые первыми | `Attempts` |
| `useGetAttemptQuery` | `Attempt.Id` | `Attempt.Item` | `{ type: 'Attempts', id }`; нет → `ErrorCode.NotFound` |
| `useSaveAttemptMutation` | `Attempt.Item` | тот же `Attempt.Item` | инвалидирует `Attempts` |

Хранилище — `localStorage`, ключ `vsm.attempts.v1`, значение — JSON-массив
`Attempt.Item`. Правила:

- Чтение: отсутствие ключа или ошибка парсинга → пустой массив; сломанное
  значение не перезаписывается до первой успешной записи.
- Запись: попытка с тем же `id` заменяется, иначе добавляется в конец.
- `localStorage` недоступен или переполнен → `queryFn` возвращает
  `Api.Error` с `ErrorCode.Storage`; UI показывает текст и
  кнопку «Повторить» ([ui.md](ui.md#финал)).
- Доступ к `localStorage` только внутри `attempts-api.ts` через
  приватные `readAttempts` и `writeAttempts`; в тестах мокается.

Ре-экспорт всех хуков из `store/index.ts`; реестр endpoints в
[../../client/api.md](../../client/api.md) заполняется при реализации.

## Переезд на сервер

Контракт для будущего API совпадает с таблицами выше:

| Метод | Путь | Ответ |
|-------|------|-------|
| `GET` | `scenarios` | `Scenario.Summary[]` |
| `GET` | `scenarios/:id` | `Scenario.Definition` |
| `GET` | `courses`, `courses/:id` | `Course.Definition[]`, `Course.Definition` |
| `GET` | `attempts?scenarioId=` | `Attempt.Item[]` |
| `GET` | `attempts/:id` | `Attempt.Item` |
| `POST` | `attempts` | `Attempt.Item` |

При переезде `queryFn` заменяется на `query`, `validateScenario` остаётся
на клиенте как защита от несовместимого контента: ошибка валидации
превращается в `Api.Error` с `ErrorCode.InvalidScenario`.

## См. также

- [types-runtime.md](types-runtime.md) — реестры, `Attempt.Item`, `Api.Error`.
- [../../client/api.md](../../client/api.md) — правила `injectEndpoints` и тегов.
