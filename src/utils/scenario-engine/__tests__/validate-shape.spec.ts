import { Validation } from '@/types';

import { validateScenario } from '../validate';
import {
  broken,
  choiceOf,
  errorsOf,
  registries,
  transitionsOf,
} from './fixtures';

import type { Mutation } from './fixtures';

describe(validateScenario.name, () => {
  describe(Validation.Code.ShapeMissing, () => {
    test.each<[string, Mutation]>([
      ['title', (s) => Reflect.deleteProperty(s, 'title')],
      [
        'nodes.intro.type',
        (s) => Reflect.deleteProperty(s.nodes.intro, 'type'),
      ],
      [
        'nodes.q1.options[0].next',
        (s) => Reflect.deleteProperty(choiceOf(s).options[0], 'next'),
      ],
      [
        'meters.trust.label',
        (s) => Reflect.deleteProperty(s.meters!.trust, 'label'),
      ],
      [
        'nodes.check.next[0].to',
        (s) => Reflect.deleteProperty(transitionsOf(s)[0], 'to'),
      ],
    ])('reports %s', (path, mutate) => {
      expect(errorsOf(broken(mutate))).toEqual([
        { code: Validation.Code.ShapeMissing, path },
      ]);
    });
  });

  describe(Validation.Code.ShapeType, () => {
    test.each<[string, Mutation]>([
      ['version', (s) => Object.assign(s, { version: '1' })],
      ['nodes', (s) => Object.assign(s, { nodes: [] })],
      [
        'nodes.intro.type',
        (s) => Object.assign(s.nodes.intro, { type: 'video' }),
      ],
      [
        'nodes.intro.stage.left.mood',
        (s) => Object.assign(s.nodes.intro.stage!.left!, { mood: 'sleepy' }),
      ],
      [
        'nodes.q1.options[1].if',
        (s) => Object.assign(choiceOf(s).options[1], { if: { level: 1 } }),
      ],
      [
        'nodes.q1.options[0].effects[1]',
        (s) =>
          Reflect.deleteProperty(choiceOf(s).options[0].effects![1], 'flag'),
      ],
      [
        'nodes.q1.options[0].review.verdict',
        (s) =>
          Object.assign(choiceOf(s).options[0].review!, { verdict: 'great' }),
      ],
      [
        'nodes.lose.result',
        (s) => Object.assign(s.nodes.lose, { result: 'draw' }),
      ],
      ['nodes.intro.next', (s) => Object.assign(s.nodes.intro, { next: 7 })],
      ['timeLimitSec', (s) => Object.assign(s, { timeLimitSec: null })],
    ])('reports %s', (path, mutate) => {
      expect(errorsOf(broken(mutate))).toEqual([
        { code: Validation.Code.ShapeType, path },
      ]);
    });

    test('reports input that is not an object at the root', () => {
      expect(errorsOf(null)).toEqual([
        { code: Validation.Code.ShapeType, path: '' },
      ]);
    });
  });

  describe(Validation.Code.ShapeUnknownField, () => {
    test.each<[string, Mutation]>([
      ['extra', (s) => Object.assign(s, { extra: true })],
      [
        'nodes.q1.options[0].nex',
        (s) => Object.assign(choiceOf(s).options[0], { nex: 'x' }),
      ],
      [
        'nodes.intro.options',
        (s) => Object.assign(s.nodes.intro, { options: [] }),
      ],
      [
        'nodes.check.next[1].iff',
        (s) => Object.assign(transitionsOf(s)[1], { iff: 1 }),
      ],
    ])('reports %s', (path, mutate) => {
      expect(errorsOf(broken(mutate))).toEqual([
        { code: Validation.Code.ShapeUnknownField, path },
      ]);
    });
  });

  describe(Validation.Code.ShapeNumber, () => {
    test.each<[string, Mutation]>([
      ['version', (s) => Object.assign(s, { version: Number.NaN })],
      ['estimatedMinutes', (s) => Object.assign(s, { estimatedMinutes: 0 })],
      ['timeLimitSec', (s) => Object.assign(s, { timeLimitSec: -5 })],
      [
        'nodes.q1.timeLimitSec',
        (s) => Object.assign(choiceOf(s), { timeLimitSec: 0 }),
      ],
      [
        'meters.trust.initial',
        (s) =>
          Object.assign(s.meters!.trust, { initial: Number.POSITIVE_INFINITY }),
      ],
      [
        'meters.trust.min',
        (s) => Object.assign(s.meters!.trust, { min: Number.NaN }),
      ],
      [
        'meters.trust.max',
        (s) => Object.assign(s.meters!.trust, { max: Number.NaN }),
      ],
      [
        'nodes.q1.options[0].effects[0].delta',
        (s) =>
          Object.assign(choiceOf(s).options[0].effects![0], {
            delta: Number.NaN,
          }),
      ],
      [
        'passCriteria.meters.trust',
        (s) => Object.assign(s.passCriteria!.meters!, { trust: Number.NaN }),
      ],
      [
        'nodes.q1.options[1].if.gte',
        (s) => Object.assign(choiceOf(s).options[1].if!, { gte: Number.NaN }),
      ],
    ])('reports %s', (path, mutate) => {
      expect(errorsOf(broken(mutate))).toEqual([
        { code: Validation.Code.ShapeNumber, path },
      ]);
    });
  });

  test.each<[string, unknown, string]>([
    ['a root array', [], ''],
    ['a root string', 'scenario', ''],
    [
      'a null node',
      broken((s) => Object.assign(s, { nodes: { a: null } })),
      'nodes.a',
    ],
    [
      'a null option',
      broken((s) => Object.assign(choiceOf(s), { options: [null] })),
      'nodes.q1.options[0]',
    ],
    [
      'a null condition',
      broken((s) => Object.assign(choiceOf(s).options[1], { if: [null] })),
      'nodes.q1.options[1].if[0]',
    ],
    [
      'effects as a string',
      broken((s) => Object.assign(choiceOf(s).options[0], { effects: 'x' })),
      'nodes.q1.options[0].effects',
    ],
  ])('rejects %s without throwing', (_name, input, path) => {
    expect(() => validateScenario(input, registries)).not.toThrow();
    expect(errorsOf(input)).toEqual([
      { code: Validation.Code.ShapeType, path },
    ]);
  });
});
