import { Scenario, Validation } from '@/types';

import { validateScenario } from '../validate';
import {
  choiceOf,
  createScenario,
  errorsOf,
  lineOf,
  transitionsOf,
} from './fixtures';

describe(validateScenario.name, () => {
  test(`reports ${Validation.Code.GraphEmptyNodes}`, () => {
    const scenario = createScenario();
    scenario.nodes = {};

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphEmptyNodes, path: 'nodes' },
    ]);
  });

  test(`reports ${Validation.Code.GraphStartMissing}`, () => {
    const scenario = createScenario();
    scenario.startNodeId = 'nowhere';

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphStartMissing, path: 'startNodeId' },
    ]);
  });

  test(`reports ${Validation.Code.GraphDanglingRef} in an option next`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options[1].next = 'ghost';

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.GraphDanglingRef,
        path: 'nodes.q1.options[1].next',
      },
    ]);
  });

  test(`reports ${Validation.Code.GraphDanglingRef} in a transition`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options[1].next = [
      { if: { flag: 'helped' }, to: 'ghost' },
      { to: 'check' },
    ];

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.GraphDanglingRef,
        path: 'nodes.q1.options[1].next[0].to',
      },
    ]);
  });

  test(`reports ${Validation.Code.GraphUnreachable}`, () => {
    const scenario = createScenario();
    scenario.nodes.orphan = {
      type: Scenario.NodeType.End,
      speaker: 'anna',
      text: 'Никто не дойдёт',
    };

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphUnreachable, path: 'nodes.orphan' },
    ]);
  });

  test(`reports ${Validation.Code.GraphNoEnd}`, () => {
    const scenario = createScenario();
    const back = (): Scenario.LineNode => ({
      type: Scenario.NodeType.Line,
      speaker: 'anna',
      text: 'Ещё раз',
      next: 'check',
    });
    scenario.nodes.win = back();
    scenario.nodes.lose = back();

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphNoEnd, path: 'startNodeId' },
    ]);
  });

  test(`reports ${Validation.Code.GraphNoFallback} when the last transition has if`, () => {
    const scenario = createScenario();
    transitionsOf(scenario)[1].if = { flag: 'helped', is: false };

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphNoFallback, path: 'nodes.check.next[1]' },
    ]);
  });

  test(`reports ${Validation.Code.GraphNoFallback} for an empty transition list`, () => {
    const scenario = createScenario();
    lineOf(scenario, 'check').next = [];

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphUnreachable, path: 'nodes.win' },
      { code: Validation.Code.GraphUnreachable, path: 'nodes.lose' },
      { code: Validation.Code.GraphNoEnd, path: 'startNodeId' },
      { code: Validation.Code.GraphNoFallback, path: 'nodes.check.next' },
    ]);
  });

  test(`reports ${Validation.Code.GraphTooFewOptions}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options.pop();

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphTooFewOptions, path: 'nodes.q1.options' },
    ]);
  });

  test('accepts a choice with the maximum number of options', () => {
    const scenario = createScenario();
    choiceOf(scenario).options.push(
      { id: 'opt3', text: 'Вариант 3', next: 'check' },
      { id: 'opt4', text: 'Вариант 4', next: 'check' }
    );

    expect(errorsOf(scenario)).toEqual([]);
  });

  test(`reports ${Validation.Code.GraphTooManyOptions}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options.push(
      { id: 'opt3', text: 'Вариант 3', next: 'check' },
      { id: 'opt4', text: 'Вариант 4', next: 'check' },
      { id: 'opt5', text: 'Вариант 5', next: 'check' }
    );

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphTooManyOptions, path: 'nodes.q1.options' },
    ]);
  });

  test(`reports ${Validation.Code.GraphDuplicateOptionId}`, () => {
    const scenario = createScenario();
    choiceOf(scenario).options[1].id = 'good';

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.GraphDuplicateOptionId,
        path: 'nodes.q1.options[1].id',
      },
    ]);
  });

  test('does not resolve node ids through the object prototype', () => {
    const scenario = createScenario();
    scenario.startNodeId = 'constructor';

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.GraphStartMissing, path: 'startNodeId' },
    ]);
  });
});
