import { Validation } from '@/types';
import type { Scenario } from '@/types';

import { validateScenario } from '../validate';
import { choiceOf, createScenario, errorsOf } from './fixtures';

describe(validateScenario.name, () => {
  test.each<[string, Scenario.Meter, number]>([
    ['meters.trust', { label: 'Доверие', initial: 50, min: 50, max: 50 }, 50],
    ['meters.trust.initial', { label: 'Доверие', initial: 101 }, 40],
    [
      'meters.trust.initial',
      { label: 'Доверие', initial: 5, min: 10, max: 20 },
      15,
    ],
    ['meters.trust.initial', { label: 'Доверие', initial: 0 }, 40],
    [
      'meters.trust.initial',
      { label: 'Доверие', initial: 10, min: 10, max: 20 },
      15,
    ],
    ['passCriteria.meters.trust', { label: 'Доверие', initial: 50 }, 120],
    [
      'passCriteria.meters.trust',
      { label: 'Доверие', initial: 15, min: 10, max: 20 },
      40,
    ],
  ])(
    `reports ${Validation.Code.MeterRange} at %s`,
    (path, meter, threshold) => {
      const scenario = createScenario();
      scenario.meters = { trust: meter };
      scenario.passCriteria!.meters = { trust: threshold };

      expect(errorsOf(scenario)).toEqual([
        { code: Validation.Code.MeterRange, path },
      ]);
    }
  );

  test('accepts initial one above the default min', () => {
    const scenario = createScenario();
    scenario.meters = { trust: { label: 'Доверие', initial: 1 } };
    scenario.passCriteria!.meters = { trust: 40 };

    expect(errorsOf(scenario)).toEqual([]);
  });

  test('accepts initial one above an explicit min', () => {
    const scenario = createScenario();
    scenario.meters = {
      trust: { label: 'Доверие', initial: 11, min: 10, max: 20 },
    };
    scenario.passCriteria!.meters = { trust: 15 };

    expect(errorsOf(scenario)).toEqual([]);
  });

  test(`reports ${Validation.Code.OutcomeTimeoutMissing} for a scenario timer`, () => {
    const scenario = createScenario();
    delete scenario.outcomes!.timeout;
    delete choiceOf(scenario).timeLimitSec;

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.OutcomeTimeoutMissing, path: 'outcomes.timeout' },
    ]);
  });

  test(`reports ${Validation.Code.OutcomeTimeoutMissing} for a node timer`, () => {
    const scenario = createScenario();
    delete scenario.outcomes!.timeout;
    delete scenario.timeLimitSec;

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.OutcomeTimeoutMissing, path: 'outcomes.timeout' },
    ]);
  });

  test('does not require outcomes.timeout without timers', () => {
    const scenario = createScenario();
    delete scenario.outcomes!.timeout;
    delete scenario.timeLimitSec;
    delete choiceOf(scenario).timeLimitSec;

    expect(errorsOf(scenario)).toEqual([]);
  });

  test(`reports ${Validation.Code.OutcomeDepletedMissing}`, () => {
    const scenario = createScenario();
    delete scenario.outcomes!.meterDepleted;

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.OutcomeDepletedMissing,
        path: 'outcomes.meterDepleted.trust',
      },
    ]);
  });

  test(`reports ${Validation.Code.TimeNodeOverScenario}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).timeLimitSec = 301;

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.TimeNodeOverScenario,
        path: 'nodes.q1.timeLimitSec',
      },
    ]);
  });

  test('accepts a node timer equal to the scenario timer', () => {
    const scenario = createScenario();
    choiceOf(scenario).timeLimitSec = 300;

    expect(errorsOf(scenario)).toEqual([]);
  });
});
