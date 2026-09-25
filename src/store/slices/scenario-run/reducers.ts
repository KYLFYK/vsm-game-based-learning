import { Attempt, Scenario, ScenarioRun } from '@/types';
import type { Course } from '@/types';

import { holds, resolveNext } from './conditions';
import { applyEffects, meterBounds } from './effects';
import { enterNode, finish, lineOf } from './enter-node';

import type { ScenarioRunState } from './slice';

export interface RunStartedPayload {
  scenario: Scenario.Definition;
  courseId: Course.Id | null;
  now: number;
  attemptId: Attempt.Id;
}

export interface NowPayload {
  now: number;
}

export interface OptionChosenPayload extends NowPayload {
  optionId: Scenario.OptionId;
}

interface CurrentNode {
  nodeId: Scenario.NodeId;
  node: Scenario.Node;
}

const runningNode = (state: ScenarioRunState): CurrentNode | null => {
  if (
    state.status !== ScenarioRun.Status.Running ||
    state.scenario === null ||
    state.currentNodeId === null
  ) {
    return null;
  }
  const node: Scenario.Node | undefined =
    state.scenario.nodes[state.currentNodeId];
  return node === undefined ? null : { nodeId: state.currentNodeId, node };
};

const isPast = (deadline: number | null, now: number): boolean =>
  deadline !== null && now >= deadline;

/** `node` is the current node: its line stands in for a missing `outcomes.timeout` */
const checkDeadlines = (
  state: ScenarioRunState,
  node: Scenario.Node,
  now: number
): boolean => {
  if (
    !isPast(state.scenarioDeadlineAt, now) &&
    !isPast(state.nodeDeadlineAt, now)
  ) {
    return false;
  }
  finish(
    state,
    {
      kind: ScenarioRun.EndingKind.Timeout,
      line: state.scenario?.outcomes?.timeout ?? lineOf(node),
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.Timeout,
    },
    now
  );
  return true;
};

const findDepletedMeter = (
  state: ScenarioRunState
): Scenario.MeterId | undefined =>
  Object.entries(state.scenario?.meters ?? {}).find(
    ([id, meter]) => state.meters[id] <= meterBounds(meter).min
  )?.[0];

export const startRun = (
  initial: ScenarioRunState,
  { scenario, courseId, now, attemptId }: RunStartedPayload
): ScenarioRunState => {
  const state: ScenarioRunState = {
    ...initial,
    status: ScenarioRun.Status.Running,
    attemptId,
    scenario,
    courseId,
    stage: { ...initial.stage },
    meters: Object.fromEntries(
      Object.entries(scenario.meters ?? {}).map(([id, meter]) => [
        id,
        meter.initial,
      ])
    ),
    flags: {},
    log: [],
    startedAt: now,
    scenarioDeadlineAt:
      scenario.timeLimitSec === undefined
        ? null
        : now + scenario.timeLimitSec * 1000,
  };
  enterNode(state, scenario.startNodeId, now);
  return state;
};

export const advance = (state: ScenarioRunState, { now }: NowPayload): void => {
  const current = runningNode(state);
  if (current?.node.type !== Scenario.NodeType.Line) return;
  if (checkDeadlines(state, current.node, now)) return;
  enterNode(state, resolveNext(current.node.next, state), now);
};

export const chooseOption = (
  state: ScenarioRunState,
  { optionId, now }: OptionChosenPayload
): void => {
  const current = runningNode(state);
  if (current?.node.type !== Scenario.NodeType.Choice) return;
  const node = current.node;
  if (checkDeadlines(state, node, now)) return;
  const option = node.options.find((item) => item.id === optionId);
  if (option === undefined || !holds(option.if, state)) return;

  const effects = option.effects ?? [];
  applyEffects(effects, state);
  state.log.push({
    nodeId: current.nodeId,
    optionId,
    at: now,
    effects,
    metersAfter: { ...state.meters },
  });

  const depletedId = findDepletedMeter(state);
  if (depletedId === undefined) {
    enterNode(state, resolveNext(option.next, state), now);
    return;
  }
  finish(
    state,
    {
      kind: ScenarioRun.EndingKind.MeterDepleted,
      line:
        state.scenario?.outcomes?.meterDepleted?.[depletedId] ?? lineOf(node),
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.MeterDepleted,
      failedMeterId: depletedId,
    },
    now
  );
};

export const expire = (state: ScenarioRunState, { now }: NowPayload): void => {
  const current = runningNode(state);
  if (current === null) return;
  checkDeadlines(state, current.node, now);
};
