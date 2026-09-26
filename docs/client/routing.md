# Маршрутизация client

Используется **react-router 8** в декларативном режиме. Все импорты — из
`'react-router'`; пакета `react-router-dom` больше нет, `react-router/dom`
нужен только data-режиму (`RouterProvider`).

## Дерево маршрутов

Определяется в [src/app.tsx](../../src/app.tsx):

```
BrowserRouter
└── Routes
    ├── /                            → AppLayout (Header + Main)
    │   ├── index                    → HomePage
    │   ├── /courses                 → CoursesPage
    │   ├── /courses/:courseId       → CoursePage
    │   ├── /scenarios/:scenarioId/attempts/:attemptId → ScenarioAttemptPage
    │   └── /achievements            → AchievementsPage
    └── /scenarios/:scenarioId       → ScenarioPage (без AppLayout, во всё окно)
```

`AppLayout` ([containers/layout/app-layout.tsx](../../src/containers/layout/app-layout.tsx))
— шапка с `APP_NAME` (ссылка на главную), навигацией `NavLink` «Главная»,
«Курсы» и «Достижения» (активный пункт — `aria-current="page"`) и версией
`__APP_VERSION__`, под ней `<Outlet />`.

## ROUTES — единственный источник истины

[src/constants/routes.ts](../../src/constants/routes.ts):

```ts
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE: '/courses/:courseId',
  SCENARIO: '/scenarios/:scenarioId',
  SCENARIO_ATTEMPT: '/scenarios/:scenarioId/attempts/:attemptId',
  ACHIEVEMENTS: '/achievements',
} as const;
```

Никогда не пиши пути строками в компонентах — только `ROUTES.XXX`. Для
параметризованных путей (`COURSE`, `SCENARIO`, `SCENARIO_ATTEMPT`) подставляй
значения через `generatePath` из `react-router`, а не шаблонной строкой.
Ссылки с контекстом курса собирают `scenarioLink`, `attemptLink` и
`courseLink` из [utils/route-links.ts](../../src/utils/route-links.ts):
курс едет search-параметром `course` (`COURSE_SEARCH_PARAM` из
`constants/routes.ts`) из курса в сценарий и из сценария в отчёт.
Читает его хук `useCourseParam` (`@/hooks`); кнопку «назад» — «К курсу»
или «К сценариям» — даёт `backLink(courseId)`.

Активный таб страницы достижений едет search-параметром `tab`
(`ACHIEVEMENT_TAB_SEARCH_PARAM`): `?tab=all` — «Все», без параметра —
«Мои». Читает и пишет его `useAchievementTab`
([features/achievements.md](features/achievements.md)).

## Маршруты вне лейаута

Экрану во весь экран (например, сценарию) не нужна шапка `AppLayout`:
такой маршрут описывается соседним `<Route>` на верхнем уровне `Routes`,
а не вложенным в `AppLayout`. Пример — `ROUTES.SCENARIO` → `ScenarioPage`
в [app.tsx](../../src/app.tsx).

## Как добавить маршрут

1. Ключ в `ROUTES`: `ORDERS: '/orders'`.
2. Папка страницы в `pages/<name>/` с `index.ts`.
3. Маршрут в `app.tsx` внутри `<Route path={ROUTES.HOME} element={<AppLayout />}>`,
   `<Route path={ROUTES.ORDERS} element={<OrdersPage />} />`, или рядом с
   ним, если экрану не нужна шапка.
4. Пункт навигации в `AppLayout`, если он нужен.
5. Обновить этот файл, карту в [README.md](README.md) и
   [features/](features/README.md), если фича пользовательская.

Приватная зона (guard по авторизации) пока не реализована: при
появлении API она добавляется контейнером-обёрткой между `AppLayout` и
страницами, по образцу `<Route element={<AuthGuard />}>`.

## См. также

- [architecture.md](architecture.md) — слои.
- [requirements/client.md](../requirements/client.md#маршруты) — правило `ROUTES`.
