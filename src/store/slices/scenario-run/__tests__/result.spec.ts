import { Attempt, Scenario } from '@/types';

import { computeScore, evaluateEnd } from '../result';

const criteria: Scenario.PassCriteria = {
  meters: { trust: 60, calm: 5, energy: 1 },
  flags: ['helped', 'reported', 'announced'],
};

const run = (
  meters: Record<Scenario.MeterId, number>,
  flags: Record<Scenario.FlagId, boolean> = {},
  passCriteria: Scenario.PassCriteria = criteria
) => ({ scenario: { passCriteria }, meters, flags });

describe(evaluateEnd.name, () => {
  test.each([Attempt.Status.Passed, Attempt.Status.Failed])(
    'forced %s wins over criteria',
    (forced) => {
      expect(evaluateEnd(run({ trust: 0 }), forced)).toEqual({
        status: forced,
        reason: Attempt.Reason.EndNode,
      });
    }
  );

  test('unmet criteria list every unmet meter and flag', () => {
    const result = evaluateEnd(
      run({ trust: 59, calm: 5, energy: 0 }, { helped: true, reported: false })
    );
    expect(result).toEqual({
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.Criteria,
      unmetCriteria: {
        meters: ['trust', 'energy'],
        flags: ['reported', 'announced'],
      },
    });
  });

  test('a threshold is met at its exact value', () => {
    const result = evaluateEnd(
      run(
        { trust: 60, calm: 5, energy: 1 },
        { helped: true, reported: true, announced: true }
      )
    );
    expect(result).toEqual({
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.Completed,
    });
  });

  test('flags-only criteria', () => {
    const flagsOnly = { flags: ['helped'] };
    expect(evaluateEnd(run({}, {}, flagsOnly))).toEqual({
      status: Attempt.Status.Failed,
      reason: Attempt.Reason.Criteria,
      unmetCriteria: { meters: [], flags: ['helped'] },
    });
    expect(evaluateEnd(run({}, { helped: true }, flagsOnly)).status).toBe(
      Attempt.Status.Passed
    );
  });

  test('without passCriteria the run is passed and completed', () => {
    const ctx = { scenario: {}, meters: { trust: 0 }, flags: {} };
    expect(evaluateEnd(ctx)).toEqual({
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.Completed,
    });
  });

  test('without a scenario the run is passed and completed', () => {
    expect(evaluateEnd({ scenario: null, meters: {}, flags: {} })).toEqual({
      status: Attempt.Status.Passed,
      reason: Attempt.Reason.Completed,
    });
  });
});

const option = (
  id: Scenario.OptionId,
  verdict?: Scenario.Verdict
): Scenario.Option => ({
  id,
  text: id,
  next: 'end',
  ...(verdict === undefined ? {} : { review: { verdict, explanation: id } }),
});

const scenario: Pick<Scenario.Definition, 'nodes'> = {
  nodes: {
    q: {
      type: Scenario.NodeType.Choice,
      speaker: 'anna',
      text: 'q',
      options: [
        option('best', Scenario.Verdict.Best),
        option('ok', Scenario.Verdict.Ok),
        option('bad', Scenario.Verdict.Bad),
        option('plain'),
      ],
    },
    end: { type: Scenario.NodeType.End, speaker: 'anna', text: 'end' },
  },
};

const decision = (
  optionId: Scenario.OptionId,
  nodeId: Scenario.NodeId = 'q'
): Attempt.Decision => ({
  nodeId,
  optionId,
  at: 0,
  effects: [],
  metersAfter: {},
});

describe(computeScore.name, () => {
  test('empty log gives null', () => {
    expect(computeScore([], scenario)).toBeNull();
  });

  test('a log without reviews gives null', () => {
    expect(computeScore([decision('plain')], scenario)).toBeNull();
  });

  test('decisions without review are skipped', () => {
    expect(computeScore([decision('best'), decision('plain')], scenario)).toBe(
      100
    );
  });

  test('weights best 1, ok 0.5, bad 0', () => {
    expect(computeScore([decision('best')], scenario)).toBe(100);
    expect(computeScore([decision('ok')], scenario)).toBe(50);
    expect(computeScore([decision('bad')], scenario)).toBe(0);
  });

  test('a repeated node counts every visit', () => {
    const log = [decision('ok'), decision('ok'), decision('best')];
    expect(computeScore(log, scenario)).toBe(67);
  });

  test('rounds to the nearest integer', () => {
    expect(
      computeScore(
        [decision('best'), decision('bad'), decision('bad')],
        scenario
      )
    ).toBe(33);
    expect(
      computeScore(
        [decision('best'), decision('best'), decision('ok')],
        scenario
      )
    ).toBe(83);
  });

  test('decisions pointing outside the scenario are skipped', () => {
    const log = [decision('best'), decision('best', 'gone'), decision('x')];
    expect(computeScore(log, scenario)).toBe(100);
  });
});
