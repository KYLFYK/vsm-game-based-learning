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

- Роль каждого файла папки — карта `src/` в [README.md](README.md).
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

[src/store/index.ts](../../src/store/index.ts) реэкспортирует `api`,
`store`, типизированные хуки, экшены и селекторы `scenarioRun`, а также
через `export * from './apis/<entity>-api'` — хуки RTK Query каждого
файла `store/apis/`.

Компоненты импортируют всё из `@/store`, не из подпапок. Новый slice или
API-хук добавляется сюда же.

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
