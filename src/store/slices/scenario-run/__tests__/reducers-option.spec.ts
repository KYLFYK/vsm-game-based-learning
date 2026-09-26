import { Attempt, ScenarioRun } from '@/types';

import {
  advanced,
  optionChosen,
  runStarted,
  scenarioRunReducer,
} from '../slice';
import { createFixture, NODE_LIMIT_MS, reduce, T0 } from './fixture';

const atAsk = () =>
  reduce([runStarted({ scenario: createFixture() }, T0), advanced(T0)]);

describe(optionChosen.type, () => {
  test('applies effects, logs the decision and follows next', () => {
    const state = reduce([optionChosen('calm-down', T0 + 5)], atAsk());
    expect(state.meters).toEqual({ trust: 70, calm: 10 });
    expect(state.flags).toEqual({ helped: true });
    expect(state.log).toEqual([
      {
        nodeId: 'ask',
        optionId: 'calm-down',
        at: T0 + 5,
        effects: [
          { meter: 'calm', delta: 5 },
          { meter: 'trust', delta: 20 },
          { flag: 'helped', value: true },
        ],
        metersAfter: { trust: 70, calm: 10 },
      },
    ]);
    expect(state.currentNodeId).toBe('branch');
  });

  test('clamps a meter by its max', () => {
    const state = reduce([optionChosen('calm-down', T0 + 1)], atAsk());
    expect(state.meters.calm).toBe(10);
  });

  test('clamps a meter by its min', () => {
    const state = reduce([optionChosen('panic', T0 + 1)], atAsk());
    expect(state.meters).toEqual({ trust: 0, calm: 2 });
    expect(state.log[0].metersAfter).toEqual({ trust: 0, calm: 2 });
  });

  test('logs an option without effects with an empty effects list', () => {
    const state = reduce([optionChosen('wait', T0 + 1)], atAsk());
    expect(state.log).toEqual([
      {
        nodeId: 'ask',
        optionId: 'wait',
        at: T0 + 1,
        effects: [],
        metersAfter: { trust: 50, calm: 8 },
      },
    ]);
  });

  test('ignores a hidden option', () => {
    const state = atAsk();
    expect(scenarioRunReducer(state, optionChosen('secret', T0 + 1))).toBe(
      state
    );
  });

  test('ignores an unknown option', () => {
    const state = atAsk();
    expect(scenarioRunReducer(state, optionChosen('missing', T0 + 1))).toBe(
      state
    );
  });

  test('on a line node does nothing', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(scenarioRunReducer(state, optionChosen('calm-down', T0))).toBe(
      state
    );
  });

  test('meter depletion finishes without a transition', () => {
    const state = reduce([optionChosen('ignore', T0 + 3)], atAsk());
    expect(state).toMatchObject({
      status: ScenarioRun.Status.Finished,
      currentNodeId: 'ask',
      finishedAt: T0 + 3,
      scenarioDeadlineAt: null,
      nodeDeadlineAt: null,
      score: 0,
      ending: {
        kind: ScenarioRun.EndingKind.MeterDepleted,
        line: { speaker: 'oleg', text: 'Доверие потеряно' },
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.MeterDepleted,
        failedMeterId: 'trust',
      },
    });
    expect(state.log).toHaveLength(1);
  });

  test('reports the first depleted meter in scenario.meters order', () => {
    const state = reduce([optionChosen('panic', T0 + 1)], atAsk());
    expect(state.ending?.failedMeterId).toBe('trust');
  });

  test('depletion by a meter at a custom min', () => {
    const scenario = createFixture();
    const trust = scenario.meters?.trust;
    if (trust !== undefined) trust.initial = 90;
    const state = reduce([
      runStarted({ scenario }, T0),
      advanced(T0),
      optionChosen('panic', T0 + 1),
    ]);
    expect(state.meters).toEqual({ trust: 30, calm: 2 });
    expect(state.ending).toMatchObject({
      line: { speaker: 'oleg', text: 'Паника' },
      failedMeterId: 'calm',
    });
  });

  test('re-entering a node re-arms its timer', () => {
    const state = reduce([optionChosen('retry', T0 + 20_000)], atAsk());
    expect(state.currentNodeId).toBe('ask');
    expect(state.nodeDeadlineAt).toBe(T0 + 20_000 + NODE_LIMIT_MS);

    const later = T0 + NODE_LIMIT_MS + 1_000;
    const again = reduce([optionChosen('calm-down', later)], state);
    expect(again.currentNodeId).toBe('branch');
    expect(again.log.map((decision) => decision.optionId)).toEqual([
      'retry',
      'calm-down',
    ]);
  });
});
