# Типы: курс, попытка, прохождение, служебные

Продолжение [types.md](types.md). Перечисления — string-enum по правилу
из [../../requirements/types.md](../../requirements/types.md#правила).

## `src/types/course.ts`

```ts
export namespace Course {
  export type Id = string;

  export interface Definition {
    id: Id;
    title: string;
    description: string;
    /** Порядок = порядок прохождения */
    scenarioIds: Scenario.Id[];
  }

  /** Статус сценария внутри курса по лучшей попытке */
  export enum ScenarioStatus {
    NotStarted = 'notStarted',
    Passed = 'passed',
    Failed = 'failed',
  }
}
```

## `src/types/attempt.ts`

```ts
export namespace Attempt {
  export type Id = string;

  export enum Status {
    Passed = 'passed',
    Failed = 'failed',
  }

  export enum Reason {
    Completed = 'completed',
    EndNode = 'endNode',
    Criteria = 'criteria',
    Timeout = 'timeout',
    MeterDepleted = 'meterDepleted',
  }

  export interface Decision {
    nodeId: Scenario.NodeId;
    optionId: Scenario.OptionId;
    at: number;
    effects: Scenario.Effect[];
    metersAfter: Record<Scenario.MeterId, number>;
  }

  export interface UnmetCriteria {
    meters: Scenario.MeterId[];
    flags: Scenario.FlagId[];
  }

  export interface Item {
    id: Id;
    scenarioId: Scenario.Id;
    scenarioVersion: number;
    courseId?: Course.Id;
    startedAt: number;
    finishedAt: number;
    status: Status;
    reason: Reason;
    failedMeterId?: Scenario.MeterId;
    unmetCriteria?: UnmetCriteria;
    /** null, если ни одно решение не имело review */
    score: number | null;
    meters: Record<Scenario.MeterId, number>;
    flags: Record<Scenario.FlagId, boolean>;
    log: Decision[];
  }
}
```

Все метки времени — `Date.now()` в миллисекундах.

## `src/types/scenario-run.ts`

Состояние текущего прохождения; используется слайсом и контейнерами
([engine.md](engine.md)).

```ts
export namespace ScenarioRun {
  export enum Status {
    Idle = 'idle',
    Running = 'running',
    Finished = 'finished',
  }

  export enum EndingKind {
    End = 'end',
    Timeout = 'timeout',
    MeterDepleted = 'meterDepleted',
  }

  export interface Stage {
    background: Scenario.BackgroundId | null;
    left: Scenario.Slot | null;
    right: Scenario.Slot | null;
    metersVisible: boolean;
  }

  export interface Ending {
    kind: EndingKind;
    line: Scenario.Line;
    status: Attempt.Status;
    reason: Attempt.Reason;
    failedMeterId?: Scenario.MeterId;
    unmetCriteria?: Attempt.UnmetCriteria;
  }
}
```

## `src/types/api.ts`

```ts
export namespace Api {
  export enum ErrorCode {
    NotFound = 'not-found',
    Storage = 'storage',
    InvalidScenario = 'invalid-scenario',
  }

  export interface Error {
    status: 'CUSTOM_ERROR';
    error: ErrorCode;
  }
}
```

`status: 'CUSTOM_ERROR'` — литерал из RTK Query, не наш enum.

## `src/types/validation.ts`

```ts
export namespace Validation {
  export enum Code { /* коды из validation.md */ }

  export interface Issue {
    code: Code;
    path: string;
    message: string;
  }

  export type Result =
    | { ok: true; scenario: Scenario.Definition; warnings: Issue[] }
    | { ok: false; errors: Issue[]; warnings: Issue[] };

  export interface Registries {
    characters: Record<Character.Id, Character.Definition>;
    backgrounds: Record<Scenario.BackgroundId, { label: string; asset: string }>;
    topics: Record<Scenario.TopicId, { label: string }>;
  }
}
```

Члены `Code` — коды из [validation.md](validation.md) в PascalCase:
`ShapeMissing = 'shape.missing'`, `GraphDanglingRef = 'graph.danglingRef'`
и так далее, по одному члену на строку таблиц.

## Реестры в `src/constants/`

| Файл | Экспорт | Форма |
|------|---------|-------|
| `characters.ts` | `CHARACTERS` | `Record<Character.Id, Character.Definition>`; обязателен `author` с `Character.Role.Author` |
| `backgrounds.ts` | `BACKGROUNDS` | `Record<Scenario.BackgroundId, { label: string; asset: string }>` |
| `topics.ts` | `TOPICS` | `Record<Scenario.TopicId, { label: string }>` |

`asset` и `portraits` — пути от корня сайта в `public/`. Тип для
валидатора — `Validation.Registries` в `src/types/validation.ts`:
`{ characters, backgrounds, topics }`, форма как у трёх реестров выше.

## См. также

- [types.md](types.md) — `Character`, `Scenario`.
- [data.md](data.md) — где реестры и попытки используются.
