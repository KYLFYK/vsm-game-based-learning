import type { Attempt } from './attempt';
import type { Scenario } from './scenario';

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
