# API-слой client

HTTP-слой — **RTK Query**. Единственный экземпляр `api` создаётся в
[src/store/api.ts](../../src/store/api.ts) и расширяется через
`injectEndpoints` в `store/apis/`.

## Базовый запрос

```ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiUrl }),
  tagTypes: ['Scenarios', 'Courses', 'Attempts', 'Achievements'],
  endpoints: () => ({}),
});
```

`env.apiUrl` — это `VITE_API_URL` ([architecture.md](../architecture.md#переменные-окружения)).
Значение может быть относительным (`/api/`, фронт и API на одном домене)
или абсолютным (dev, отдельный домен API).

Авторизации пока нет. При появлении API заголовки добавляются через
`prepareHeaders` в `fetchBaseQuery`, а refresh-логика — обёрткой над
`baseQuery` (`baseQueryWithReauth`); документируется здесь.

## Теги кеша

Тег добавляется вместе с первой сущностью: списочный запрос ставит тег
целиком (`providesTags: ['Orders']`), карточка — точечно
(`{ type: 'Orders', id }`), мутация инвалидирует оба вида, если меняет и
элемент, и выдачу. Текущие теги — `Scenarios`, `Courses`, `Attempts`,
`Achievements`, по одному на каждый файл `store/apis/`.

## `queryFn` вместо `query`

Все endpoint-файлы (MVP0) читают данные не по сети, а из бандла
(`@/content`) или `localStorage`, поэтому вместо `query:`
используют `queryFn:` — функцию, которая сама возвращает `{ data }` или
`{ error }` без похода в `fetchBaseQuery`. Сигнатуры хуков не меняются при
переезде на HTTP: `queryFn` заменяется на `query`. Источники данных,
формат ошибок и правила `localStorage` — таблицы и правила в
[specs/scenario-engine/data.md](../specs/scenario-engine/data.md#rtk-query).

## Как добавить endpoint

1. Тип запроса/ответа — в `src/types` ([requirements/types.md](../requirements/types.md)).
2. Файл `store/apis/<entity>-api.ts`:

   ```ts
   import type { Order } from '@/types';

   import { api } from '../api';

   export const ordersApi = api.injectEndpoints({
     endpoints: (builder) => ({
       getOrders: builder.query<Order.Item[], void>({
         query: () => 'orders',
         providesTags: ['Orders'],
       }),
     }),
   });

   export const { useGetOrdersQuery } = ordersApi;
   ```

3. Тег — в `tagTypes` в `api.ts`.
4. Хуки — ре-экспорт из `store/index.ts` (`export * from './apis/orders-api'`).
5. Endpoint — в таблицу ниже и в файл фичи ([features/](features/README.md)).

## Реестр endpoints

MVP0 — источник `queryFn` (бандл или `localStorage`); HTTP-метод и путь —
контракт будущего сервера из
[data.md](../specs/scenario-engine/data.md#переезд-на-сервер).

| Хук | MVP0 | HTTP | Путь | Теги | Фича |
|-----|------|------|------|------|------|
| `useGetScenariosQuery` | `queryFn` (бандл) | `GET` | `scenarios` | `Scenarios` | [scenario-engine.md](scenario-engine.md) |
| `useGetScenarioQuery` | `queryFn` (бандл) | `GET` | `scenarios/:id` | `{ type: 'Scenarios', id }` | [scenario-engine.md](scenario-engine.md) |
| `useGetCoursesQuery` | `queryFn` (бандл) | `GET` | `courses` | `Courses` | [courses.md](features/courses.md) |
| `useGetCourseQuery` | `queryFn` (бандл) | `GET` | `courses/:id` | `{ type: 'Courses', id }` | [courses.md](features/courses.md) |
| `useGetAttemptsQuery` | `queryFn` (`localStorage`) | `GET` | `attempts?scenarioId=` | `Attempts` | [scenario-engine.md](scenario-engine.md) |
| `useGetAttemptQuery` | `queryFn` (`localStorage`) | `GET` | `attempts/:id` | `{ type: 'Attempts', id }` | [scenario-engine.md](scenario-engine.md) |
| `useSaveAttemptMutation` | `queryFn` (`localStorage`) | `POST` | `attempts` | инвалидирует `Attempts` | [scenario-engine.md](scenario-engine.md) |
| `useGetAchievementsQuery` | `queryFn` (бандл) | не определён | не определён | `Achievements` | [achievements.md](features/achievements.md) |
| `useGetMyAchievementsQuery` | `queryFn` (заглушка) | не определён | не определён | `Achievements` | [achievements.md](features/achievements.md) |

## См. также

- [state.md](state.md) — подключение `api` к store.
- [requirements/client.md](../requirements/client.md#http--api) — правило «только RTK Query».
