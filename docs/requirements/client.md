# Client-конвенции

## Маршруты

- Все пути — **только через `ROUTES`** из
  [src/constants/routes.ts](../../src/constants/routes.ts). Строковые
  литералы путей в компонентах (`navigate('/login')`) — ошибка.
- Добавление маршрута: `ROUTES` → `app.tsx` → [../client/routing.md](../client/routing.md).
- Импорты — из `'react-router'` (`BrowserRouter`, `Routes`, `Route`,
  `Outlet`, `Link`, хуки). Пакета `react-router-dom` нет.

## Store

- Импортировать **только из барреля** `@/store`
  ([src/store/index.ts](../../src/store/index.ts)), не из `store/apis/…`
  или `store/slices/…`.
- Новый slice или API-хук → экспорт из `store/index.ts`.
- Прямой `useDispatch` / `useSelector` из `react-redux` в компонентах
  запрещён — только `useAppDispatch` / `useAppSelector`.

## HTTP / API

- **Только RTK Query.** Никаких `fetch` / `axios` в компонентах и слайсах.
- Единый экземпляр `api` — [src/store/api.ts](../../src/store/api.ts).
  Endpoints добавляются через `api.injectEndpoints(...)` в `store/apis/`.
- Базовый URL — `env.apiUrl`, не литерал.
- Типы запроса/ответа — из `src/types` ([types.md](types.md)).

## Стили

- **styled-components** для компонентных стилей. Styled-компоненты
  объявляются **до** React-компонента в том же файле или в
  `<name>.styles.ts` рядом (для крупных компонентов).
- Токены — только из темы через проп `theme`:
  `${({ theme }) => theme.colors.primary}`. Литералы цветов, размеров и
  шрифтов в styled-компонентах запрещены; нужен новый токен — добавь его в
  [src/styles/theme.ts](../../src/styles/theme.ts).
- Глобальные стили (reset, `body`) — только в
  [src/styles/global-style.ts](../../src/styles/global-style.ts).
- Inline-стили (`style={{ … }}`), CSS Modules и модификатор `&&` запрещены.
- Детали — [../client/styling.md](../client/styling.md).

## Компонентная архитектура

Слои — строго по ответственности:

| Слой | Папка | Правило |
|------|-------|---------|
| Общий UI | `components/` | Чистые переиспользуемые компоненты без данных и store. Папка на компонент `components/<name>/`: `<name>.tsx`, рядом `*.enums.ts` и `*.styles.ts`, барель `index.ts`. Импорт — `@/components/<name>`; корневого бареля нет |
| Общий хук | `hooks/` | Хуки, нужные нескольким разделам (`useDocumentTitle`). Хук одного раздела — рядом с ним: `containers/<name>/use-*.ts`. Ре-экспорт через `hooks/index.ts` |
| Контейнер | `containers/<name>/` | Бизнес-логика: RTK Query хуки, redux, side-effects, layout |
| Страница | `pages/<name>/` | Только компоновка контейнеров, без вызовов данных. Одна папка = одна страница с `index.ts` |
| Утилиты | `utils/` | Чистые функции без React. Ре-экспорт через `utils/index.ts` |
| Константы | `constants/` | `ROUTES`, `APP_NAME`, перечисления, лимиты |
| Конфиг | `config/` | Только чтение env |
| Контент | `content/` | JSON-контент в бандле, валидируется при импорте; только данные, без логики |

Нарушение границ — такой же баг, как сломанная логика. Form-библиотеки
пока нет: слой `forms/` появляется вместе с ней.

## Тесты

Общие правила — [general.md](general.md#тесты). Для клиента: unit-тестами
покрываются чистые функции и хуки; store, роутер и utils мокаются через
`jest.mock`. Хуки, зависящие от роутера, оборачиваются в `MemoryRouter`:

```tsx
renderHook(() => useMyHook(), {
  wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
});
```

## См. также

- [general.md](general.md) — общие конвенции.
- [../client/README.md](../client/README.md) — карта `src/`.
- [../client/api.md](../client/api.md), [../client/state.md](../client/state.md),
  [../client/routing.md](../client/routing.md), [../client/styling.md](../client/styling.md).
