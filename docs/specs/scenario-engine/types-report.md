# Типы: отчёт о попытке

Продолжение [types-runtime.md](types-runtime.md). Отчёт — производная
сущность: `buildReport` строит его из попытки и сценария
([report.md](report.md#buildreport)), в хранилище он не пишется.
Namespace содержит только интерфейсы, поэтому реэкспорт из
`src/types/index.ts` — `export type`.

## `src/types/report.ts`

```ts
export namespace Report {
  export interface Outcome {
    status: Attempt.Status;
    reason: Attempt.Reason;
    text: string;
  }

  export interface Meter {
    id: Scenario.MeterId;
    label: string;
    min: number;
    max: number;
    final: number;
    threshold?: number;
    met: boolean;
    /** initial, затем значение после каждой записи log */
    series: number[];
  }

  export interface Better {
    text: string;
    explanation: string;
  }

  export interface Decision {
    /** Позиция записи в attempt.log */
    index: number;
    question: string;
    speaker: Character.Id;
    chosen: string;
    verdict: Scenario.Verdict;
    explanation: string;
    topic?: Scenario.TopicId;
    effects: Scenario.Effect[];
    better?: Better;
  }

  export interface Topic {
    id: Scenario.TopicId;
    label: string;
    best: number;
    ok: number;
    bad: number;
    weak: boolean;
  }

  export interface Recommendation {
    scenarioId: Scenario.Id;
    title: string;
    /** Пересечение тем сценария со слабыми темами попытки */
    topics: Scenario.TopicId[];
  }

  export interface Item {
    versionMismatch: boolean;
    outcome: Outcome;
    score: number | null;
    meters: Meter[];
    decisions: Decision[];
    topics: Topic[];
    recommendations: Recommendation[];
    nextScenarioId: Scenario.Id | null;
  }
}
```

`min` и `max` шкалы нужны графику на экране отчёта
([ui-report.md](ui-report.md)); правила заполнения полей — таблица в
[report.md](report.md#buildreport).

## См. также

- [types-runtime.md](types-runtime.md) — `Attempt`, из которой строится отчёт.
- [report.md](report.md) — `buildReport` и рекомендации.
