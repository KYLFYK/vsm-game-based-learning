# Игровой движок сценариев

Механизм прохождения игрового сценария: домен, слайс `scenarioRun` и
чистые помощники вокруг него. Схема формата сценария — в спецификации
[../specs/scenario-engine/types.md](../specs/scenario-engine/types.md);
аннотированный пример JSON — в плане
[../plans/scenario-engine/format.md](../plans/scenario-engine/format.md).

## Назначение

Сценарий — граф узлов (реплика, выбор, финал) с шкалами и флагами.
Игрок проходит его в реальном времени: движок хранит текущий узел,
накопленную сцену, значения шкал и журнал решений, считает результат и
балл по завершении. UI (этап 4) только читает состояние через селекторы
и диспатчит экшены — граф и правила перехода он не разбирает сам.

## Где что лежит

| Папка | Содержимое |
|-------|------------|
| `types/` | `Scenario`, `Course`, `Character`, `Attempt`, `ScenarioRun` — домен и состояние прохождения |
| `constants/` | Реестры `CHARACTERS`, `BACKGROUNDS`, `TOPICS` — типизированные `id`, на них ссылается контент |
| `content/` | JSON сценариев и курсов; `load-scenarios.ts` валидирует каждый сценарий через `validateScenario` (вызывается из `index.ts` при импорте бандла) и бросает исключение при ошибке — несовместимый контент не должен запускать dev-сервер или тесты |
| `store/slices/scenario-run/` | Слайс `scenarioRun`: состояние попытки, редьюсеры, селекторы |
| `utils/scenario-engine/` | Чистые функции без React и без состояния попытки: `validateScenario`, `compareAttempts` |

Роль каждого файла `store/slices/scenario-run/` — карта `src/` в
[README.md](README.md). Полное состояние, алгоритмы узла и разрешения
`next` — спецификация
[../specs/scenario-engine/engine.md](../specs/scenario-engine/engine.md).

## Жизненный цикл попытки

```
runStarted → (advanced | optionChosen | expired)* → finished → runLeft
```

- `runStarted({ scenario, courseId? })` — берёт снимок сценария,
  заполняет шкалы начальными значениями, ставит дедлайн сценария,
  входит в стартовый узел.
- `advanced()` — реплика узла `line`, переход по `next`.
- `optionChosen(optionId)` — выбор варианта узла `choice`: применяет
  эффекты, пишет запись в `log`, проверяет истощение шкалы, переходит
  по `next`.
- `expired()` — диспатчит хук `useRunTimers`, когда дедлайн истёк вне
  клика игрока; завершает попытку `timeout`, если дедлайн правда
  прошёл, иначе не меняет состояние.
- Любой из четырёх экшенов может перевести `status` в `finished`
  (переход в узел `end`, истечение времени, истощение шкалы) —
  подробный порядок проверок в
  [../specs/scenario-engine/engine.md](../specs/scenario-engine/engine.md).
- После `finished` UI берёт `selectAttemptDraft` и сохраняет попытку через
  `useSaveAttemptMutation` из [api.md](api.md#реестр-endpoints) — вызов из
  экрана сценария появится на этапе 4.
- `runLeft()` сбрасывает слайс в `idle`; диспатчится при уходе с
  сохранённым или потерянным результатом.

Экшен, пришедший при невыполненном предусловии, состояние не меняет —
правило и таблица предусловий каждого экшена в
[../specs/scenario-engine/engine.md](../specs/scenario-engine/engine.md).

## Чистота редьюсеров

Редьюсеры не вызывают `Date.now()`: время приходит в payload. Action
creators подставляют его через `prepare` (по умолчанию `Date.now()`),
`attemptId` для `runStarted` — `crypto.randomUUID()` там же. Тесты
передают `now` явным аргументом, поэтому детерминированы.

## Таймеры

В состоянии слайса хранятся только дедлайны — `scenarioDeadlineAt` и
`nodeDeadlineAt`, миллисекунды. Остаток времени считает хук
[`useRunTimers`](../../src/containers/scenario-player/use-run-timers.ts)
в контейнере сцены: собственный `now` с интервалом 250 мс, диспатч
`expired()`, когда остаток ушёл в ноль. Это единственное место, где
время живёт вне store, и оно производное от дедлайнов. Таймер узла
заводится при входе в узел и снимается при выходе; возврат в тот же
узел заводит его заново. Паузы нет. Алгоритм хука и активность —
[../specs/scenario-engine/engine.md](../specs/scenario-engine/engine.md#хук-таймеров).

## Результат и балл

По входу в узел `end`, по истечении времени или истощении шкалы
редьюсер вызывает `evaluateEnd` и `computeScore` из `result.ts` и
переводит попытку в `finished`. Порядок правил результата (таймаут,
истощение шкалы, принудительный исход узла, критерии, иначе —
пройдено) и формула балла — таблицы в
[../specs/scenario-engine/report.md](../specs/scenario-engine/report.md).

## Лучшая попытка

`compareAttempts(a, b): number` в
[`utils/scenario-engine/compare-attempts.ts`](../../src/utils/scenario-engine/compare-attempts.ts)
— компаратор для `Array.prototype.sort`, лучшая попытка первой; порядок
правил сравнения — [../specs/scenario-engine/report.md](../specs/scenario-engine/report.md#лучшая-попытка).

Выбор лучшей попытки среди списка (`bestAttempt`) и статус сценария по
списку попыток — селектор этапа 6.1, ещё не реализован.

## См. также

- [state.md](state.md) — регистрация слайса в store, барель, хуки.
- [../specs/scenario-engine/engine.md](../specs/scenario-engine/engine.md) —
  полная спецификация состояния и алгоритмов слайса.
- [../specs/scenario-engine/report.md](../specs/scenario-engine/report.md) —
  таблицы результата, балла и сравнения попыток.
- [../specs/scenario-engine/types.md](../specs/scenario-engine/types.md) —
  схема `Scenario`, `Course`, `Character`, `Attempt`, `ScenarioRun`.
- [../plans/scenario-engine/format.md](../plans/scenario-engine/format.md) —
  аннотированный пример JSON сценария.
- [../specs/scenario-engine/validation.md](../specs/scenario-engine/validation.md) —
  проверки `validateScenario`.
