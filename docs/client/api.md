# API-слой client

HTTP-слой — **RTK Query**. Единственный экземпляр `api` создаётся в
[src/store/api.ts](../../src/store/api.ts) и расширяется через
`injectEndpoints` в `store/apis/`.

## Базовый запрос

```ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiUrl }),
  tagTypes: [],
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

`tagTypes` пуст. Тег добавляется вместе с первой сущностью: списочный
запрос ставит тег целиком (`providesTags: ['Orders']`), карточка — точечно
(`{ type: 'Orders', id }`), мутация инвалидирует оба вида, если меняет и
элемент, и выдачу.

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

| Хук | HTTP | Путь | Теги | Фича |
|-----|------|------|------|------|
| — | — | — | — | Endpoints пока нет |

## См. также

- [state.md](state.md) — подключение `api` к store.
- [requirements/client.md](../requirements/client.md#http--api) — правило «только RTK Query».
