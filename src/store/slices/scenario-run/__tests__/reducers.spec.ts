import { Attempt, Character, ScenarioRun } from '@/types';

import {
  advanced,
  expired,
  initialState,
  optionChosen,
  runLeft,
  runStarted,
  scenarioRunReducer,
} from '../slice';
import {
  createFixture,
  NODE_LIMIT_MS,
  reduce,
  SCENARIO_LIMIT_MS,
  T0,
} from './fixture';

const start = () => reduce([runStarted({ scenario: createFixture() }, T0)]);

afterEach(() => {
  jest.restoreAllMocks();
});

describe(runStarted.type, () => {
  test('starts a run from the scenario definition', () => {
    const uuid = jest
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('00000000-0000-4000-8000-000000000001');
    const scenario = createFixture();

    const state = reduce([runStarted({ scenario, courseId: 'course-1' }, T0)]);

    expect(uuid).toHaveBeenCalledTimes(1);
    expect(state).toEqual({
      ...initialState,
      status: ScenarioRun.Status.Running,
      attemptId: '00000000-0000-4000-8000-000000000001',
      scenario,
      courseId: 'course-1',
      currentNodeId: 'intro',
      stage: {
        background: 'hall',
        left: { character: 'anna', mood: Character.Mood.Neutral },
        right: null,
        metersVisible: false,
      },
      meters: { trust: 50, calm: 8 },
      startedAt: T0,
      scenarioDeadlineAt: T0 + SCENARIO_LIMIT_MS,
    });
  });

  test('assigns a new attempt id on every start', () => {
    const first = runStarted({ scenario: createFixture() }, T0);
    const second = runStarted({ scenario: createFixture() }, T0);
    expect(typeof first.payload.attemptId).toBe('string');
    expect(first.payload.attemptId).not.toBe(second.payload.attemptId);
  });

  test('defaults now to Date.now() and courseId to null', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0 + 7);
    const { payload } = runStarted({ scenario: createFixture() });
    expect(payload.now).toBe(T0 + 7);
    expect(payload.courseId).toBeNull();
  });

  test('without timeLimitSec the scenario has no deadline', () => {
    const { timeLimitSec: _limit, ...scenario } = createFixture();
    const state = reduce([runStarted({ scenario }, T0)]);
    expect(state.scenarioDeadlineAt).toBeNull();
  });

  test('restarts from a finished run with a clean state', () => {
    const finished = reduce([expired(T0 + SCENARIO_LIMIT_MS)], start());
    expect(finished.status).toBe(ScenarioRun.Status.Finished);

    const restarted = reduce(
      [runStarted({ scenario: createFixture() }, T0 + 1)],
      finished
    );
    expect(restarted.status).toBe(ScenarioRun.Status.Running);
    expect(restarted.ending).toBeNull();
    expect(restarted.finishedAt).toBeNull();
    expect(restarted.log).toEqual([]);
    expect(restarted.currentNodeId).toBe('intro');
  });
});

describe(advanced.type, () => {
  test('follows a string next and enters the choice node', () => {
    const state = reduce([advanced(T0 + 100)], start());
    expect(state.currentNodeId).toBe('ask');
    expect(state.stage).toEqual({
      background: 'hall',
      left: { character: 'anna', mood: Character.Mood.Neutral },
      right: { character: 'oleg', mood: Character.Mood.Worried },
      metersVisible: true,
    });
    expect(state.nodeDeadlineAt).toBe(T0 + 100 + NODE_LIMIT_MS);
  });

  test('conditional next by flag: flag set', () => {
    const state = reduce(
      [advanced(T0), optionChosen('calm-down', T0 + 1)],
      start()
    );
    expect(state.currentNodeId).toBe('branch');
    expect(reduce([advanced(T0 + 2)], state).currentNodeId).toBe('check');
  });

  test('conditional next by flag: fallback when the flag is not set', () => {
    const state = reduce(
      [advanced(T0), optionChosen('wait', T0 + 1), advanced(T0 + 2)],
      start()
    );
    expect(state.currentNodeId).toBe('forced-fail');
  });

  test('conditional next by meter', () => {
    const high = reduce(
      [
        advanced(T0),
        optionChosen('retry', T0 + 1),
        optionChosen('calm-down', T0 + 2),
        advanced(T0 + 3),
      ],
      start()
    );
    expect(high.meters.trust).toBe(80);
    expect(reduce([advanced(T0 + 4)], high).currentNodeId).toBe('forced-pass');

    const low = reduce(
      [advanced(T0), optionChosen('calm-down', T0 + 1), advanced(T0 + 2)],
      start()
    );
    expect(low.meters.trust).toBe(70);
    expect(reduce([advanced(T0 + 3)], low).currentNodeId).toBe('finale');
  });

  test('entering a line node clears the node deadline', () => {
    const state = reduce(
      [advanced(T0), optionChosen('calm-down', T0 + 1)],
      start()
    );
    expect(state.nodeDeadlineAt).toBeNull();
  });

  test('null in a stage slot clears it, absent keys stay', () => {
    const state = reduce(
      [advanced(T0), optionChosen('hesitate', T0 + 1)],
      start()
    );
    expect(state.currentNodeId).toBe('check');
    expect(state.stage).toEqual({
      background: 'hall',
      left: null,
      right: { character: 'oleg', mood: Character.Mood.Worried },
      metersVisible: true,
    });
  });

  test('on a choice node does nothing', () => {
    const state = reduce([advanced(T0)], start());
    expect(scenarioRunReducer(state, advanced(T0 + 1))).toBe(state);
  });

  test('after the scenario deadline finishes with timeout', () => {
    const state = reduce([advanced(T0 + SCENARIO_LIMIT_MS)], start());
    expect(state.currentNodeId).toBe('intro');
    expect(state.ending?.kind).toBe(ScenarioRun.EndingKind.Timeout);
  });
});

describe(expired.type, () => {
  test('before any deadline changes nothing', () => {
    const state = reduce([advanced(T0)], start());
    expect(scenarioRunReducer(state, expired(T0 + NODE_LIMIT_MS - 1))).toBe(
      state
    );
  });

  test('after the node deadline finishes with timeout', () => {
    const state = reduce([advanced(T0), expired(T0 + NODE_LIMIT_MS)], start());
    expect(state).toMatchObject({
      status: ScenarioRun.Status.Finished,
      currentNodeId: 'ask',
      finishedAt: T0 + NODE_LIMIT_MS,
      scenarioDeadlineAt: null,
      nodeDeadlineAt: null,
      score: null,
      ending: {
        kind: ScenarioRun.EndingKind.Timeout,
        line: { speaker: 'anna', text: 'Время вышло' },
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.Timeout,
      },
    });
  });

  test('after the scenario deadline on a line node finishes with timeout', () => {
    const state = reduce([expired(T0 + SCENARIO_LIMIT_MS)], start());
    expect(state.ending?.reason).toBe(Attempt.Reason.Timeout);
    expect(state.finishedAt).toBe(T0 + SCENARIO_LIMIT_MS);
  });

  test('a click after the deadline is a timeout without effects', () => {
    const before = reduce([advanced(T0)], start());
    const state = reduce(
      [optionChosen('calm-down', T0 + NODE_LIMIT_MS)],
      before
    );
    expect(state.ending?.kind).toBe(ScenarioRun.EndingKind.Timeout);
    expect(state.meters).toEqual(before.meters);
    expect(state.flags).toEqual({});
    expect(state.log).toEqual([]);
    expect(state.currentNodeId).toBe('ask');
  });

  test('falls back to the current node line without outcomes.timeout', () => {
    const { outcomes: _outcomes, ...scenario } = createFixture();
    const state = reduce([
      runStarted({ scenario }, T0),
      expired(T0 + SCENARIO_LIMIT_MS),
    ]);
    expect(state.ending?.line).toEqual({
      speaker: 'author',
      text: 'Вагон, утро',
    });
  });
});

describe(runLeft.type, () => {
  test('resets a running run to the initial state', () => {
    expect(reduce([runLeft()], start())).toEqual(initialState);
  });

  test('resets a finished run to the initial state', () => {
    const finished = reduce([expired(T0 + SCENARIO_LIMIT_MS)], start());
    expect(reduce([runLeft()], finished)).toEqual(initialState);
  });
});

describe(scenarioRunReducer.name, () => {
  const idleActions = [
    advanced(T0),
    optionChosen('calm-down', T0),
    expired(T0 + SCENARIO_LIMIT_MS),
  ];

  test.each(idleActions)(
    '$type on Idle keeps the state reference',
    (action) => {
      expect(scenarioRunReducer(initialState, action)).toBe(initialState);
    }
  );

  test.each(idleActions)('$type on Finished keeps the state', (action) => {
    const finished = reduce(
      [advanced(T0), optionChosen('calm-down', T0 + 1), advanced(T0 + 2)],
      start()
    );
    const ended = reduce([advanced(T0 + 3)], finished);
    expect(ended.status).toBe(ScenarioRun.Status.Finished);
    expect(scenarioRunReducer(ended, action)).toBe(ended);
  });
});
