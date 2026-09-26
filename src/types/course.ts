import type { Scenario } from './scenario';

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
