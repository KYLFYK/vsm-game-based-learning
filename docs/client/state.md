# Состояние client

Используется **Redux Toolkit** + **RTK Query**.

## Store

[src/store/store.ts](../../src/store/store.ts):

```ts
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // 'api'
    scenarioRun: scenarioRunReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Подключается в [src/index.tsx](../../src/index.tsx) через
`<Provider store={store}>`.

## Слайсы

| Ключ | Папка | Назначение |
|------|-------|------------|
| `scenarioRun` | `store/slices/scenario-run/` | Прохождение одного сценария: узел, сцена, шкалы, флаги, таймеры, журнал решений, финал |

Новый slice:

1. Папка `store/slices/<name>/`: `slice.ts` с `createSlice`, логика — в
   соседних файлах, `index.ts` — барель папки.
2. Регистрация в `reducer` в `store.ts`.
3. Публичные экшены и селекторы — в барель `store/index.ts`.
4. Описание здесь.

### scenarioRun

- `slice.ts` — `ScenarioRunState`, `initialState`, `createSlice`;
  `reducers.ts` — шаги экшенов; `enter-node.ts` — вход в узел и
  `finish`; `result.ts` — `evaluateEnd`, `computeScore`;
  `conditions.ts`, `effects.ts` — условия, эффекты, `meterBounds`;
  `selectors.ts` — селекторы.
- Экшены (из `@/store`): `runStarted({ scenario, courseId? }, now?)`,
  `advanced(now?)`, `optionChosen(optionId, now?)`, `expired(now?)`,
  `runLeft()`.
- Селекторы (из `@/store`): `selectRunStatus`, `selectRunScenario`,
  `selectCurrentNode`, `selectVisibleOptions`, `selectStage`,
  `selectMeterViews`, `selectMetersVisible`, `selectDeadlines`,
  `selectEnding`, `selectAttemptDraft` — правило каждого в таблице
  [engine.md](../specs/scenario-engine/engine.md#селекторы). Производные
  селекторы — через `createSelector`, стабильны по ссылке при одном и том
  же состоянии; пустые списки — общая константа-ссылка.
- Жизненный цикл попытки, чистота редьюсеров (`now` из `prepare`) и
  поведение экшена с невыполненным предусловием —
  [scenario-engine.md](scenario-engine.md).
- Состояние, алгоритмы и обязательные тесты — спецификация
  [engine.md](../specs/scenario-engine/engine.md); результат и балл —
  [report.md](../specs/scenario-engine/report.md).

## Барель: store/index.ts

[src/store/index.ts](../../src/store/index.ts):

```ts
export { api } from './api';
export {
  advanced,
  expired,
  optionChosen,
  runLeft,
  runStarted,
  selectAttemptDraft,
  selectCurrentNode,
  selectDeadlines,
  selectEnding,
  selectMeterViews,
  selectMetersVisible,
  selectRunScenario,
  selectRunStatus,
  selectStage,
  selectVisibleOptions,
} from './slices/scenario-run';
export type { Deadlines } from './slices/scenario-run';
export { store, useAppDispatch, useAppSelector } from './store';
export type { AppDispatch, RootState } from './store';
```

Компоненты импортируют всё из `@/store`, не из подпапок. Хуки RTK Query
новых endpoints тоже ре-экспортируются отсюда.

## Селекторы и dispatch

```ts
const dispatch = useAppDispatch();
const status = useAppSelector(selectRunStatus);
```

Прямой `useDispatch` / `useSelector` из `react-redux` в компонентах
запрещён.

## См. также

- [api.md](api.md) — RTK Query и endpoints.
- [scenario-engine.md](scenario-engine.md) — механизм слайса `scenarioRun`.
- [requirements/client.md](../requirements/client.md#store) — правило барреля.
