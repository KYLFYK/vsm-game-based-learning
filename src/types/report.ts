import type { Attempt } from './attempt';
import type { Character } from './character';
import type { Scenario } from './scenario';

/** Отчёт о попытке: строится из попытки и сценария, а не из UI-состояния */
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
