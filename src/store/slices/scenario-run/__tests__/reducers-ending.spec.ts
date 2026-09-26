import { Attempt, ScenarioRun } from '@/types';
import type { Scenario } from '@/types';

import { enterNode } from '../enter-node';
import { advanced, optionChosen, runStarted } from '../slice';
import { createFixture, reduce, SCENARIO_LIMIT_MS, T0 } from './fixture';

const atAsk = (scenario: Scenario.Definition = createFixture()) =>
  reduce([runStarted({ scenario }, T0), advanced(T0)]);

describe(enterNode.name, () => {
  test('result: Failed ends as failed by the end node', () => {
    const state = reduce(
      [optionChosen('wait', T0 + 1), advanced(T0 + 2)],
      atAsk()
    );
    expect(state).toMatchObject({
      status: ScenarioRun.Status.Finished,
      currentNodeId: 'forced-fail',
      finishedAt: T0 + 2,
      scenarioDeadlineAt: null,
      nodeDeadlineAt: null,
      score: null,
    });
    expect(state.ending).toEqual({
      kind: ScenarioRun.EndingKind.End,
      line: { speaker: 'anna', text: 'Провал' },
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.EndNode,
    });
  });

  test('result: Passed ends as passed by the end node', () => {
    const state = reduce(
      [
        optionChosen('retry', T0 + 1),
        optionChosen('calm-down', T0 + 2),
        advanced(T0 + 3),
        advanced(T0 + 4),
      ],
      atAsk()
    );
    expect(state.currentNodeId).toBe('forced-pass');
    expect(state.score).toBe(75);
    expect(state.ending).toEqual({
      kind: ScenarioRun.EndingKind.End,
      line: { speaker: 'anna', text: 'Отлично' },
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.EndNode,
    });
  });

  test('criteria met end as passed and completed', () => {
    const state = reduce(
      [optionChosen('calm-down', T0 + 1), advanced(T0 + 2), advanced(T0 + 3)],
      atAsk()
    );
    expect(state.currentNodeId).toBe('finale');
    expect(state.stage.background).toBe('platform');
    expect(state.score).toBe(100);
    expect(state.ending).toEqual({
      kind: ScenarioRun.EndingKind.End,
      line: { speaker: 'anna', text: 'Конец' },
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.Completed,
    });
  });

  test('criteria unmet end as failed with every unmet criterion', () => {
    const state = reduce(
      [optionChosen('hesitate', T0 + 1), advanced(T0 + 2)],
      atAsk()
    );
    expect(state.currentNodeId).toBe('finale');
    expect(state.score).toBe(0);
    expect(state.ending).toEqual({
      kind: ScenarioRun.EndingKind.End,
      line: { speaker: 'anna', text: 'Конец' },
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.Criteria,
      unmetCriteria: { meters: ['trust'], flags: ['helped'] },
    });
  });

  test('scenario without passCriteria ends as passed and completed', () => {
    const { passCriteria: _criteria, ...scenario } = createFixture();
    const state = reduce(
      [optionChosen('hesitate', T0 + 1), advanced(T0 + 2)],
      atAsk(scenario)
    );
    expect(state.ending).toMatchObject({
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.Completed,
    });
  });

  test('a start node of type end finishes the run right away', () => {
    const scenario: Scenario.Definition = {
      ...createFixture(),
      startNodeId: 'forced-pass',
    };
    const state = reduce([runStarted({ scenario }, T0)]);
    expect(state).toMatchObject({
      status: ScenarioRun.Status.Finished,
      startedAt: T0,
      finishedAt: T0,
      scenarioDeadlineAt: null,
      ending: { reason: Attempt.Reason.EndNode },
    });
  });

  test('finishing clears the scenario deadline', () => {
    const running = atAsk();
    expect(running.scenarioDeadlineAt).toBe(T0 + SCENARIO_LIMIT_MS);
    const state = reduce(
      [optionChosen('hesitate', T0 + 1), advanced(T0 + 2)],
      running
    );
    expect(state.scenarioDeadlineAt).toBeNull();
  });
});
