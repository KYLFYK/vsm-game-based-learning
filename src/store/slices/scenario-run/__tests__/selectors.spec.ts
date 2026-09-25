import { store } from '@/store';
import type { RootState } from '@/store';
import { Attempt, Scenario, ScenarioRun } from '@/types';

import {
  selectAttemptDraft,
  selectCurrentNode,
  selectDeadlines,
  selectEnding,
  selectMeterViews,
  selectMetersVisible,
  selectRunScenario,
  selectRunStatus,
  selectStage,
  selectVisibleOptions,
} from '../selectors';
import {
  advanced,
  expired,
  initialState,
  optionChosen,
  runStarted,
} from '../slice';
import { createFixture, reduce, SCENARIO_LIMIT_MS, T0 } from './fixture';

import type { ScenarioRunState } from '../slice';

const rootState = (scenarioRun: ScenarioRunState): RootState => ({
  ...store.getState(),
  scenarioRun,
});

const idle = rootState(initialState);
const atAsk = () =>
  reduce([runStarted({ scenario: createFixture() }, T0), advanced(T0)]);

// A minimal choice screen just to exercise visibility rules in isolation
// from the shared fixture, which has no meter-gated option.
const gatedScenario: Scenario.Definition = {
  id: 'gated',
  version: 1,
  title: 'Gated',
  description: 'Gated choice for visibility tests',
  topics: [],
  estimatedMinutes: 1,
  characters: ['author'],
  startNodeId: 'ask',
  nodes: {
    ask: {
      type: Scenario.NodeType.Choice,
      speaker: 'author',
      text: 'Pick one',
      options: [
        { id: 'always', text: 'Always', next: 'end' },
        { id: 'by-flag', text: 'By flag', if: { flag: 'seen' }, next: 'end' },
        {
          id: 'by-meter',
          text: 'By meter',
          if: { meter: 'trust', gte: 50 },
          next: 'end',
        },
        { id: 'last', text: 'Last', next: 'end' },
      ],
    },
    end: { type: Scenario.NodeType.End, speaker: 'author', text: 'End' },
  },
};

const gatedState = (
  meters: Record<Scenario.MeterId, number>,
  flags: Record<Scenario.FlagId, boolean>
): ScenarioRunState => ({
  ...initialState,
  scenario: gatedScenario,
  currentNodeId: 'ask',
  meters,
  flags,
});

describe(selectRunStatus.name, () => {
  test('reads the status field', () => {
    expect(selectRunStatus(idle)).toBe(ScenarioRun.Status.Idle);
    expect(selectRunStatus(rootState(atAsk()))).toBe(
      ScenarioRun.Status.Running
    );
  });
});

describe(selectRunScenario.name, () => {
  test('is null before a run starts', () => {
    expect(selectRunScenario(idle)).toBeNull();
  });

  test('returns the running scenario', () => {
    const scenario = createFixture();
    const state = reduce([runStarted({ scenario }, T0)]);
    expect(selectRunScenario(rootState(state))).toBe(scenario);
  });
});

describe(selectStage.name, () => {
  test('reads the stage field', () => {
    expect(selectStage(rootState(atAsk())).metersVisible).toBe(true);
  });
});

describe(selectEnding.name, () => {
  test('is null while running', () => {
    expect(selectEnding(rootState(atAsk()))).toBeNull();
  });

  test('is the ending once finished', () => {
    const state = reduce([expired(T0 + SCENARIO_LIMIT_MS)], atAsk());
    expect(selectEnding(rootState(state))?.kind).toBe(
      ScenarioRun.EndingKind.Timeout
    );
  });
});

// `createSelector` output is a function literally named `memoized`, so
// `describe(fn.name)` below would print the same title for every one of
// them; the exported identifier is used as a string instead.
describe('selectCurrentNode', () => {
  test('is null before a run starts', () => {
    expect(selectCurrentNode(idle)).toBeNull();
  });

  test('looks up the node by id', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(selectCurrentNode(rootState(state))).toBe(
      state.scenario?.nodes.intro
    );
  });
});

describe('selectVisibleOptions', () => {
  test('a non-choice node has no visible options', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(selectVisibleOptions(rootState(state))).toEqual([]);
  });

  test('options without a condition are always visible, order preserved', () => {
    const state = gatedState({ trust: 0 }, {});
    expect(
      selectVisibleOptions(rootState(state)).map((option) => option.id)
    ).toEqual(['always', 'last']);
  });

  test('a flag-gated option appears once the flag is set', () => {
    const state = gatedState({ trust: 0 }, { seen: true });
    expect(
      selectVisibleOptions(rootState(state)).map((option) => option.id)
    ).toEqual(['always', 'by-flag', 'last']);
  });

  test('a meter-gated option appears once the threshold is met', () => {
    const state = gatedState({ trust: 60 }, {});
    expect(
      selectVisibleOptions(rootState(state)).map((option) => option.id)
    ).toEqual(['always', 'by-meter', 'last']);
  });
});

describe('selectMeterViews', () => {
  test('builds a view per meter, in scenario.meters order, with a threshold when set', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(selectMeterViews(rootState(state))).toStrictEqual([
      {
        id: 'trust',
        label: 'Доверие',
        value: 50,
        min: 0,
        max: 100,
        threshold: 60,
      },
      { id: 'calm', label: 'Спокойствие', value: 8, min: 2, max: 10 },
    ]);
  });

  test('a scenario without meters has no views', () => {
    const { meters: _meters, ...scenario } = createFixture();
    const state = reduce([runStarted({ scenario }, T0)]);
    expect(selectMeterViews(rootState(state))).toEqual([]);
  });
});

describe('selectMetersVisible', () => {
  test('true when the scenario has meters and the stage shows them', () => {
    expect(selectMetersVisible(rootState(atAsk()))).toBe(true);
  });

  test('false when the stage hides meters', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(state.stage.metersVisible).toBe(false);
    expect(selectMetersVisible(rootState(state))).toBe(false);
  });

  test('false when the scenario has no meters, even if the stage shows them', () => {
    const { meters: _meters, ...scenario } = createFixture();
    const state = reduce([runStarted({ scenario }, T0), advanced(T0)]);
    expect(state.stage.metersVisible).toBe(true);
    expect(selectMetersVisible(rootState(state))).toBe(false);
  });
});

describe('selectDeadlines', () => {
  test('reads both deadlines', () => {
    const state = reduce([runStarted({ scenario: createFixture() }, T0)]);
    expect(selectDeadlines(rootState(state))).toEqual({
      scenarioDeadlineAt: T0 + SCENARIO_LIMIT_MS,
      nodeDeadlineAt: null,
    });
  });
});

describe('selectAttemptDraft', () => {
  test('is null while idle', () => {
    expect(selectAttemptDraft(idle)).toBeNull();
  });

  test('is null while running', () => {
    expect(selectAttemptDraft(rootState(atAsk()))).toBeNull();
  });

  test('passed by an end node, with a courseId', () => {
    const state = reduce([
      runStarted({ scenario: createFixture(), courseId: 'course-1' }, T0),
      advanced(T0),
      optionChosen('retry', T0 + 1),
      optionChosen('calm-down', T0 + 2),
      advanced(T0 + 3),
      advanced(T0 + 4),
    ]);
    const draft = selectAttemptDraft(rootState(state));
    expect(draft?.status).toBe(Attempt.Status.Passed);
    expect(draft?.courseId).toBe('course-1');
    expect(draft).toMatchSnapshot({ id: expect.any(String) });
  });

  test('failed by unmet criteria, without a courseId', () => {
    const state = reduce([
      runStarted({ scenario: createFixture() }, T0),
      advanced(T0),
      optionChosen('hesitate', T0 + 1),
      advanced(T0 + 2),
    ]);
    const draft = selectAttemptDraft(rootState(state));
    expect(draft?.status).toBe(Attempt.Status.Failed);
    expect(draft?.unmetCriteria).toEqual({
      meters: ['trust'],
      flags: ['helped'],
    });
    expect(draft && 'courseId' in draft).toBe(false);
    expect(draft).toMatchSnapshot({ id: expect.any(String) });
  });

  test('failed by timeout', () => {
    const state = reduce([expired(T0 + SCENARIO_LIMIT_MS)], atAsk());
    const draft = selectAttemptDraft(rootState(state));
    expect(draft?.reason).toBe(Attempt.Reason.Timeout);
    expect(draft && 'failedMeterId' in draft).toBe(false);
    expect(draft).toMatchSnapshot({ id: expect.any(String) });
  });

  test('failed by meter depletion, with the depleted meter id', () => {
    const state = reduce([optionChosen('ignore', T0 + 3)], atAsk());
    const draft = selectAttemptDraft(rootState(state));
    expect(draft?.reason).toBe(Attempt.Reason.MeterDepleted);
    expect(draft?.failedMeterId).toBe('trust');
    expect(draft).toMatchSnapshot({ id: expect.any(String) });
  });
});

describe('memoization', () => {
  test('derived selectors return the same reference for the same state', () => {
    const state = rootState(atAsk());
    expect(selectVisibleOptions(state)).toBe(selectVisibleOptions(state));
    expect(selectMeterViews(state)).toBe(selectMeterViews(state));
    expect(selectDeadlines(state)).toBe(selectDeadlines(state));
    expect(selectCurrentNode(state)).toBe(selectCurrentNode(state));
  });

  test('selectAttemptDraft returns the same reference for the same state', () => {
    const finished = rootState(
      reduce([expired(T0 + SCENARIO_LIMIT_MS)], atAsk())
    );
    expect(selectAttemptDraft(finished)).toBe(selectAttemptDraft(finished));
  });
});
