# Слайс `scenarioRun`

Папка `src/store/slices/scenario-run/`: `slice.ts` (состояние, экшены),
`reducers.ts` (алгоритмы), `conditions.ts`, `effects.ts`, `enter-node.ts`,
`result.ts`, `selectors.ts`, `index.ts`. `finish` живёт в
`enter-node.ts`, `checkDeadlines` — в `reducers.ts` (так нет циклов
импорта). Регистрация в `store.ts` под ключом `scenarioRun`, публичный
экспорт через `@/store`.

## Состояние

`Stage`, `Ending`, `Status`, `EndingKind` — из namespace `ScenarioRun`
([types-runtime.md](types-runtime.md)).

```ts
interface ScenarioRunState {
  status: ScenarioRun.Status;
  attemptId: Attempt.Id | null;
  scenario: Scenario.Definition | null;
  courseId: Course.Id | null;
  currentNodeId: Scenario.NodeId | null;
  stage: ScenarioRun.Stage;
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
  startedAt: number | null;
  finishedAt: number | null;
  scenarioDeadlineAt: number | null;
  nodeDeadlineAt: number | null;
  log: Attempt.Decision[];
  ending: ScenarioRun.Ending | null;
  score: number | null;
}
```

`initialState`: `status: ScenarioRun.Status.Idle`, все ссылки `null`, `stage` пустая с
`metersVisible: true`, `meters` и `flags` пустые, `log` пустой.

## Экшены

Action creators с `prepare`: второй аргумент `now` необязателен и нужен
тестам, по умолчанию `Date.now()`.

| Creator | Payload |
|---------|---------|
| `runStarted({ scenario, courseId? }, now?)` | `{ scenario, courseId, now, attemptId }`, `courseId` без значения — `null`, `attemptId` из `crypto.randomUUID()` |
| `advanced(now?)` | `{ now }` |
| `optionChosen(optionId, now?)` | `{ optionId, now }` |
| `expired(now?)` | `{ now }` |
| `runLeft()` | нет |

## Алгоритмы редьюсеров

Общие помощники:

- `holds(condition, state)`: для `FlagCondition` —
  `(flags[flag] ?? false) === (is ?? true)`; для `MeterCondition` — все
  заданные сравнения истинны для `meters[meter]`; массив — все элементы;
  `undefined` — истина.
- `resolveNext(next, state)`: строка → она; массив → `to` первого
  элемента с истинным `if`; если ни один не подошёл — `to` последнего
  (валидатор гарантирует, что последний без `if`).
- `applyEffect(effect, state)`: шкала —
  `clamp(meters[id] + delta, min ?? 0, max ?? 100)`; флаг — присвоить.
  Шкала, которой нет в `scenario.meters`, игнорируется. Границы по
  умолчанию даёт `meterBounds(meter)` из `effects.ts` — единственное
  место с 0 и 100 в слайсе; его же использует проверка истощения.
- `checkDeadlines(state, node, now)` (`node` — текущий узел, нужен для
  запасной реплики): истёк, если `scenarioDeadlineAt !== null
  && now >= scenarioDeadlineAt` или то же для `nodeDeadlineAt`. При
  истечении — `finish(state, timeoutEnding, now)` и `true`.
- `finish(state, ending, now)`: `status = ScenarioRun.Status.Finished`, `ending`,
  `finishedAt = now`, оба дедлайна `null`, `score = computeScore(log,
  scenario)` ([report.md](report.md)).
- `evaluateEnd(state, forced?)` → `{ status, reason, unmetCriteria? }`:
  правила [report.md](report.md#результат-попытки).
- `enterNode(state, nodeId, now)`:
  1. `currentNodeId = nodeId`.
  2. `stage` узла сливается: ключ отсутствует — поле не меняется; `null`
     в `left`/`right` очищает слот.
  3. `nodeDeadlineAt = now + timeLimitSec * 1000` для `choice` с
     `timeLimitSec`, иначе `null`.
  4. Узел `NodeType.End` → `finish` с `kind: EndingKind.End`, `line` из узла,
     остальное из `evaluateEnd(state, node.result)`.

| Экшен | Предусловие | Шаги |
|-------|-------------|------|
| `runStarted` | `status` любой | Состояние = `initialState`; `attemptId`, `scenario`, `courseId`, `startedAt = now`; `meters[id] = initial` для каждой шкалы; `scenarioDeadlineAt = now + timeLimitSec * 1000` или `null`; `status = Running`; `enterNode(startNodeId)` |
| `advanced` | `Running`, узел `NodeType.Line` | `checkDeadlines` → выход; `enterNode(resolveNext(node.next))` |
| `optionChosen` | `Running`, узел `NodeType.Choice` | `checkDeadlines` → выход; вариант не найден или его `if` ложен → без изменений; применить `effects` по порядку; записать `Decision { nodeId, optionId, at: now, effects, metersAfter }`; первая шкала в порядке ключей `scenario.meters` со значением `<= min` → `finish` с `kind: EndingKind.MeterDepleted`, `line = outcomes.meterDepleted[id]`, `status: Failed`, `reason: Reason.MeterDepleted`, `failedMeterId`; иначе `enterNode(resolveNext(option.next))` |
| `expired` | `Running` | `checkDeadlines` |
| `runLeft` | любой | `initialState` |

Экшены с невыполненным предусловием возвращают то же состояние (та же
ссылка). Таймаутный `Ending`: `kind: EndingKind.Timeout`,
`line = outcomes.timeout`, `status: Failed`, `reason: Reason.Timeout`.
Если `outcomes.timeout` или `outcomes.meterDepleted[id]` нет (валидатор
это запрещает, но типы допускают), `line` — реплика текущего узла.

## Селекторы

Все принимают `RootState`. Производные мемоизируются `createSelector`.

| Селектор | Тип результата | Правило |
|----------|----------------|---------|
| `selectRunStatus` | `ScenarioRun.Status` | |
| `selectRunScenario` | `Scenario.Definition \| null` | |
| `selectCurrentNode` | `Scenario.Node \| null` | `scenario.nodes[currentNodeId]` |
| `selectVisibleOptions` | `Scenario.Option[]` | Узел `NodeType.Choice` → варианты с `holds(if)` в порядке сценария; иначе `[]` |
| `selectStage` | `ScenarioRun.Stage` | |
| `selectMeterViews` | `MeterView[]` | По порядку ключей `scenario.meters`: `{ id, label, value, min, max, threshold?: passCriteria.meters[id] }`; `[]` без шкал |
| `selectMetersVisible` | `boolean` | Есть шкалы и `stage.metersVisible` |
| `selectDeadlines` | `{ scenarioDeadlineAt, nodeDeadlineAt }` | |
| `selectEnding` | `ScenarioRun.Ending \| null` | |
| `selectAttemptDraft` | `Attempt.Item \| null` | `null`, пока не `Finished`; иначе поля из состояния, `courseId` только если не `null` |

## Хук таймеров

`containers/scenario-player/use-run-timers.ts`:

```ts
useRunTimers(): { scenarioRemainingMs: number | null; nodeRemainingMs: number | null }
```

- Активен, когда `status === ScenarioRun.Status.Running` и хотя бы один дедлайн не `null`.
- `setInterval` 250 мс пересчитывает остатки как `deadline - Date.now()`,
  не ниже нуля; при нуле диспатчит `expired()`.
- Смена дедлайнов (вход в другой узел) перезапускает расчёт без
  перезапуска интервала. Размонтирование очищает интервал.
- Тест: `renderHook` с `jest.useFakeTimers` и моком `useAppDispatch`.

## Тесты редьюсера

Файлы `__tests__/reducers.spec.ts` (`runStarted`, `advanced`,
`expired`, `runLeft`, предусловия), `reducers-option.spec.ts`
(`optionChosen`), `reducers-ending.spec.ts` (финалы) с общей
фикстурой-сценарием `__tests__/fixture.ts`, покрывающей все типы узлов,
условия, эффекты, таймеры и `outcomes`. Обязательные кейсы:

- `runStarted`: шкалы из `initial`, дедлайн сценария, `stage` первого
  узла, `attemptId` присвоен.
- `advanced` по строке и по условному `next` с флагом и со шкалой.
- `optionChosen`: обрезка по `min`/`max`, запись журнала, скрытый вариант
  игнорируется, истощение шкалы завершает без перехода, повторный вход в
  узел заводит таймер заново.
- `expired`: до дедлайна без изменений, после — `timeout`; клик после
  дедлайна тоже `timeout` без применения эффектов.
- Финалы: `result: Failed`, `result: Passed`, пороги выполнены и не
  выполнены, сценарий без `passCriteria`.
- Любой экшен на `Finished` и `Idle` (кроме `runStarted`, `runLeft`) не
  меняет состояние.

## См. также

- [report.md](report.md) — `evaluateEnd`, `computeScore`.
- [ui.md](ui.md) — кто диспатчит экшены и читает селекторы.
