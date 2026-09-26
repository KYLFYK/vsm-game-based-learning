import { Scenario, Validation } from '@/types';

import { validateScenario } from '../validate';
import {
  choiceOf,
  broken,
  createScenario,
  lineOf,
  transitionsOf,
  warningsOf,
} from './fixtures';

import type { Mutation } from './fixtures';

describe(validateScenario.name, () => {
  test.each<[string, Mutation]>([
    [
      'two best options',
      (s) => (choiceOf(s).options[1].review!.verdict = Scenario.Verdict.Best),
    ],
    [
      'no best option',
      (s) => (choiceOf(s).options[0].review!.verdict = Scenario.Verdict.Ok),
    ],
  ])(`warns ${Validation.Code.ReviewNoBest} for %s`, (_name, mutate) => {
    expect(warningsOf(broken(mutate))).toEqual([
      { code: Validation.Code.ReviewNoBest, path: 'nodes.q1.options' },
    ]);
  });

  test(`warns ${Validation.Code.ReviewNoTopic}`, () => {
    const scenario = createScenario();
    delete choiceOf(scenario).options[1].review!.topic;

    expect(warningsOf(scenario)).toEqual([
      {
        code: Validation.Code.ReviewNoTopic,
        path: 'nodes.q1.options[1].review',
      },
    ]);
  });

  test(`warns ${Validation.Code.ReviewTopicNotDeclared}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options[1].review!.topic = 'safety';

    expect(warningsOf(scenario)).toEqual([
      {
        code: Validation.Code.ReviewTopicNotDeclared,
        path: 'nodes.q1.options[1].review.topic',
      },
    ]);
  });

  test.each<[string, Mutation]>([
    ['passCriteria.flags[1]', (s) => s.passCriteria!.flags!.push('vip')],
    [
      'nodes.q1.options[1].if[1].flag',
      (s) =>
        (choiceOf(s).options[1].if = [
          { meter: 'trust', gte: 0 },
          { flag: 'vip' },
        ]),
    ],
    [
      'nodes.check.next[0].if.flag',
      (s) => (transitionsOf(s)[0].if = { flag: 'vip' }),
    ],
  ])(`warns ${Validation.Code.FlagNeverSet} at %s`, (path, mutate) => {
    expect(warningsOf(broken(mutate))).toEqual([
      { code: Validation.Code.FlagNeverSet, path },
    ]);
  });

  test(`warns ${Validation.Code.FlagNeverRead}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options[1].effects!.push({ flag: 'rude', value: true });

    expect(warningsOf(scenario)).toEqual([
      {
        code: Validation.Code.FlagNeverRead,
        path: 'nodes.q1.options[1].effects[1].flag',
      },
    ]);
  });

  test.each<[string, Mutation]>([
    ['nodes.intro.next', (s) => (lineOf(s, 'intro').next = 'intro')],
    ['nodes.check.next[0].to', (s) => (transitionsOf(s)[0].to = 'check')],
  ])(
    `warns ${Validation.Code.GraphSelfLoopWithoutChoice} at %s`,
    (path, mutate) => {
      expect(warningsOf(broken(mutate))).toEqual([
        { code: Validation.Code.GraphSelfLoopWithoutChoice, path },
      ]);
    }
  );

  test(`warns ${Validation.Code.OptionNoReviewWithEffects}`, () => {
    const scenario = createScenario();
    delete choiceOf(scenario).options[1].review;

    expect(warningsOf(scenario)).toEqual([
      {
        code: Validation.Code.OptionNoReviewWithEffects,
        path: 'nodes.q1.options[1]',
      },
    ]);
  });

  test('does not warn about an option without review that only sets flags', () => {
    const scenario = createScenario();
    choiceOf(scenario).options.push({
      id: 'wait',
      text: 'Подождать',
      effects: [{ flag: 'helped', value: false }],
      next: 'check',
    });

    expect(warningsOf(scenario)).toEqual([]);
  });
});
