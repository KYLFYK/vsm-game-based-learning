# Результат, балл, отчёт

Функции результата и балла живут в `store/slices/scenario-run/result.ts`
(их вызывают редьюсеры). `compareAttempts` и `buildReport` — в
`src/utils/scenario-engine/`, они работают с сохранёнными попытками.

## Результат попытки

`evaluateEnd(state, forced?: Attempt.Status)` для узла `end`; таймаут и
истощение обрабатываются редьюсером до вызова.

| Порядок | Условие | `status` | `reason` |
|---------|---------|----------|----------|
| 1 | таймер истёк | `Failed` | `Timeout` |
| 2 | шкала `<= min` после эффектов | `Failed` | `MeterDepleted`, `failedMeterId` |
| 3 | `forced` задан | `forced` | `EndNode` |
| 4 | `passCriteria` есть и не выполнены | `Failed` | `Criteria`, `unmetCriteria` |
| 5 | иначе | `Passed` | `Completed` |

Значения — члены `Attempt.Status` и `Attempt.Reason`.

Критерии: `meters[id] >= passCriteria.meters[id]` для каждой шкалы,
`flags[f] === true` для каждого флага. Невыполненные собираются в
`unmetCriteria` полностью, не только первый.

## Балл

`computeScore(log, scenario): number | null`:

- Для каждой записи `log` берётся `review` выбранного варианта; записи
  без `review` пропускаются.
- Вес: `Verdict.Best` 1, `Ok` 0.5, `Bad` 0. Балл = `Math.round(sum / count * 100)`.
- `count === 0` → `null`.

Повторное прохождение узла даёт отдельную запись и учитывается.

## Лучшая попытка

`compareAttempts(a, b): number` для `Array.prototype.sort`, лучшая
первой:

1. `Status.Passed` раньше `Failed`.
2. Больший `score`; `null` ниже любого числа, два `null` равны.
3. Меньшая `finishedAt - startedAt`.
4. Более поздний `finishedAt` (стабильность).

`bestAttempt(attempts) = [...attempts].sort(compareAttempts)[0] ?? null`.
`scenarioStatus(attempts): Course.ScenarioStatus`: нет попыток —
`NotStarted`, лучшая `Passed` — `Passed`, иначе `Failed`.

## `buildReport`

```ts
buildReport(input: {
  scenario: Scenario.Definition;
  attempt: Attempt.Item;
  catalog: Scenario.Summary[];
  attempts: Attempt.Item[];
  course?: Course.Definition;
}): Report
```

```ts
interface Report {
  versionMismatch: boolean;
  outcome: { status: Attempt.Status; reason: Attempt.Reason; text: string };
  score: number | null;
  meters: MeterReport[];
  decisions: DecisionReport[];
  topics: TopicReport[];
  recommendations: Recommendation[];
  nextScenarioId: Scenario.Id | null;
}
```

| Часть | Правило |
|-------|---------|
| `versionMismatch` | `attempt.scenarioVersion !== scenario.version`. При `true` — `decisions` и `topics` пустые, остальное считается |
| `outcome.text` | По `reason`: `Completed` — «Сценарий пройден»; `EndNode` + `Passed` — «Сценарий пройден»; `EndNode` + `Failed` — «Сценарий завершён неудачно»; `Criteria` — «Не выполнены условия: <подписи шкал и флагов через запятую>»; `Timeout` — «Время вышло»; `MeterDepleted` — «<label шкалы> упала до нуля» |
| `MeterReport` | `{ id, label, final, threshold?, met: boolean, series: number[] }`; `series` — `initial`, затем `metersAfter[id]` по каждой записи `log` |
| `DecisionReport` | На каждую запись `log` с `review`: `{ index, question: node.text, speaker, chosen: option.text, verdict, explanation, topic?, effects, better?: { text, explanation } }`; `better` для `Ok` и `Bad` — вариант того же узла с `Verdict.Best`, если есть |
| `TopicReport` | По `topic` из решений: `{ id, label, best, ok, bad, weak: boolean }`; `weak = bad > 0 \|\| best / (best + ok + bad) < 0.5`; порядок — слабые первыми, затем по `label` |
| `recommendations` | См. ниже, не больше трёх |
| `nextScenarioId` | `course` задан, `status === Status.Passed`, в `course.scenarioIds` есть элемент после текущего → он; иначе `null` |

## Рекомендации

1. `weakTopics` — `id` тем с `weak: true`. Пусто → рекомендаций нет.
2. Кандидаты — элементы `catalog` с `id !== scenario.id` и непустым
   пересечением `topics` с `weakTopics`.
3. Сортировка: больше пересечение; затем сценарии без попытки `Passed`
   среди `attempts`; затем меньше `estimatedMinutes`; затем `title`.
4. Первые три → `Recommendation { scenarioId, title, topics: пересечение }`.

## Тесты

- `result.spec.ts`: каждая строка таблицы результата, доступная
  `evaluateEnd` (3–5; строки 1–2 — в тестах редьюсера), `unmetCriteria` с
  несколькими шкалами и флагами, `computeScore` на пустом журнале, на
  повторном узле, округление.
- `compare-attempts.spec.ts`: каждый уровень сравнения, `null` балл.
- `build-report.spec.ts`: `versionMismatch`, `better` есть и нет, `series`,
  слабые темы на границе 0.5, лимит рекомендаций, сортировка кандидатов,
  `nextScenarioId` для последнего сценария курса. Для `Report` целиком —
  snapshot на фикстуре.

## См. также

- [engine.md](engine.md) — где вызываются `evaluateEnd` и `computeScore`.
- [ui.md](ui.md) — экран отчёта.
- [../../plans/scenario-engine/feedback.md](../../plans/scenario-engine/feedback.md) — обоснование правил.
