import type { Course } from './course';
import type { Scenario } from './scenario';

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
