import { Scenario, ScenarioRun } from '@/types';

import { computeScore, evaluateEnd } from './result';

import type { ScenarioRunState } from './slice';

export const lineOf = (node: Scenario.Node): Scenario.Line => ({
  speaker: node.speaker,
  text: node.text,
});

export const finish = (
  state: ScenarioRunState,
  ending: ScenarioRun.Ending,
  now: number
): void => {
  state.status = ScenarioRun.Status.Finished;
  state.ending = ending;
  state.finishedAt = now;
  state.scenarioDeadlineAt = null;
  state.nodeDeadlineAt = null;
  state.score =
    state.scenario === null ? null : computeScore(state.log, state.scenario);
};

const mergeStage = (
  stage: ScenarioRun.Stage,
  patch: Scenario.StagePatch | undefined
): void => {
  if (patch === undefined) return;
  if (patch.background !== undefined) stage.background = patch.background;
  if (patch.left !== undefined) stage.left = patch.left;
  if (patch.right !== undefined) stage.right = patch.right;
  if (patch.metersVisible !== undefined) {
    stage.metersVisible = patch.metersVisible;
  }
};

export const enterNode = (
  state: ScenarioRunState,
  nodeId: Scenario.NodeId,
  now: number
): void => {
  state.currentNodeId = nodeId;
  const node: Scenario.Node | undefined = state.scenario?.nodes[nodeId];
  if (node === undefined) return;
  mergeStage(state.stage, node.stage);
  state.nodeDeadlineAt =
    node.type === Scenario.NodeType.Choice && node.timeLimitSec !== undefined
      ? now + node.timeLimitSec * 1000
      : null;
  if (node.type === Scenario.NodeType.End) {
    finish(
      state,
      {
        kind: ScenarioRun.EndingKind.End,
        line: lineOf(node),
        ...evaluateEnd(state, node.result),
      },
      now
    );
  }
};
