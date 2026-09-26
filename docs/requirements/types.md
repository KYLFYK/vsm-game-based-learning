# Типовая система

## Принцип

Типы, которые описывают сущности домена и контракты API, живут в
`src/types/` — один файл на сущность, внутри `namespace`. Список файлов —
в карте `src/` в [../client/README.md](../client/README.md).

```
src/types/
  user.ts    → namespace User  { Profile, Role, CreateDto }
  order.ts   → namespace Order { Item, Status, ListQuery }
  index.ts   → re-export всего
```

Внутри namespace: interfaces (`User.Profile`), enums (`User.Role`), DTO
(`User.CreateDto`).

## Правила

0. **Фиксированный набор строк — всегда string-enum**, не union литералов.
   Это касается любых перечислений: статусов, типов узлов, ролей, кодов
   ошибок, вариантов пропсов, даже из двух значений. Значения enum —
   строки, совпадающие с тем, что лежит в JSON и приходит из API:

   ```ts
   export enum Status {
     Passed = 'passed',
     Failed = 'failed',
   }
   ```

   Enum сущности живёт в её namespace в `src/types`; enum пропсов
   компонента экспортируется из файла компонента. `const enum` запрещён:
   не работает с `verbatimModuleSyntax` и изолированной трансформацией.

1. **Импортируй напрямую в месте использования** из `@/types`:

   ```ts
   import type { User } from '@/types';

   getUser: builder.query<User.Profile, string>({ ... })
   ```

2. **Не создавай файлы-переходники.** Нужен тип в нескольких местах —
   всё равно импорт из `@/types`.
3. **Локальные типы** (пропсы компонента, состояние формы) живут рядом с
   компонентом. Если тип описывает запрос или ответ API — его место в
   `src/types`.
4. **Появился сервер с shared-типами** — `src/types` переезжает в общий
   пакет, правило импорта «напрямую» сохраняется.

## Добавление нового типа

1. Определить: локальный или сущность/контракт?
2. Сущность → нужный namespace в `src/types/<entity>.ts`; нет namespace —
   создать файл и re-export в `index.ts`.
3. Обновить карту `src/` в [../client/README.md](../client/README.md).

## См. также

- [client.md](client.md) — как типы используются в RTK Query.
- [general.md](general.md) — TypeScript strict, `import type`.
