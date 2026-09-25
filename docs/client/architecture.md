# Архитектура client

## Слои

```
index.tsx → <Provider store> → <App>
                                 ├─ ThemeProvider + GlobalStyle   (styles/)
                                 └─ BrowserRouter → Routes        (constants/routes.ts)
                                       └─ AppLayout               (containers/layout)
                                            └─ HomePage           (pages/home)
                                                 └─ hooks, store  (hooks/, store/)
                                                        └─ HTTP → env.apiUrl
```

## Принципы

1. **Тонкие страницы.** `pages/` только компонуют контейнеры; данные и
   side-effects — в `containers/`.
2. **Единый барель store.** Наружу всё уходит через `@/store`; структура
   `apis/`, `slices/` — деталь реализации.
3. **Тема централизована.** Все токены в `styles/theme.ts`, компоненты
   читают их через проп `theme`.
4. **Маршруты из констант.** Никаких строковых путей в компонентах.
5. **Env в одном месте.** `config/env.ts`; остальной код не знает про
   `import.meta.env`.

## Папки и их назначение

| Папка | Назначение | Что класть |
|-------|------------|------------|
| `config/` | Чтение env | `env.ts`, `read-env.ts` |
| `constants/` | Константы, не привязанные к фиче | `ROUTES`, `APP_NAME`, перечисления, лимиты |
| `content/` | JSON-сценарии и курсы в бандле, будущий контракт API | `scenarios/*.json`, `courses.json`, загрузчик с валидацией на импорте |
| `components/` | Общий чистый UI без данных | Кнопки, поля, карточки. Ре-экспорт через `index.ts` |
| `containers/` | Бизнес-логика и layout | `AppLayout`, контейнеры разделов, их хуки `use-*.ts` |
| `hooks/` | Хуки для нескольких разделов | `useDocumentTitle`. Ре-экспорт через `index.ts` |
| `pages/` | Страницы, на которые ссылается роутер | Одна папка = одна страница с `index.ts` |
| `store/` | Redux-слой | `api.ts`, `store.ts`, `apis/`, `slices/`, барель |
| `styles/` | Тема и глобальные стили | `theme.ts`, `global-style.ts` |
| `types/` | Сущности и контракты API | Namespace на сущность ([requirements/types.md](../requirements/types.md)) |
| `utils/` | Чистые функции без React | Форматирование, вычисления. Ре-экспорт через `index.ts` |

## Расширение

- Новая страница → папка в `pages/`, ключ в `ROUTES`, маршрут в `app.tsx`;
  обновить [routing.md](routing.md) и карту в [README.md](README.md).
- Новый endpoint → файл в `store/apis/`, ре-экспорт из `store/index.ts`;
  обновить [api.md](api.md).
- Новый slice → файл в `store/slices/`, регистрация в `store.ts`; обновить
  [state.md](state.md).
- Новый токен темы → `styles/theme.ts`; обновить [styling.md](styling.md).

## См. также

- [requirements/client.md](../requirements/client.md) — слои как требование.
- [README.md](README.md) — карта `src/`.
