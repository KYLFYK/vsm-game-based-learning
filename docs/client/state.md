# Состояние client

Используется **Redux Toolkit** + **RTK Query**.

## Store

[src/store/store.ts](../../src/store/store.ts):

```ts
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // 'api'
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

Слайсов пока нет. Новый slice:

1. `store/slices/<name>-slice.ts` с `createSlice`.
2. Регистрация в `reducer` в `store.ts`.
3. Публичные экшены и селекторы — в барель `store/index.ts`.
4. Описание здесь.

## Барель: store/index.ts

[src/store/index.ts](../../src/store/index.ts):

```ts
export { api } from './api';
export { store, useAppDispatch, useAppSelector } from './store';
export type { AppDispatch, RootState } from './store';
```

Компоненты импортируют всё из `@/store`, не из подпапок. Хуки RTK Query
новых endpoints тоже ре-экспортируются отсюда.

## Селекторы и dispatch

```ts
const dispatch = useAppDispatch();
const value = useAppSelector((state) => state.api.queries);
```

Прямой `useDispatch` / `useSelector` из `react-redux` в компонентах
запрещён.

## См. также

- [api.md](api.md) — RTK Query и endpoints.
- [requirements/client.md](../requirements/client.md#store) — правило барреля.
