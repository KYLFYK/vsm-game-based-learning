import type { Scenario } from '@/types';
import { Character, Validation } from '@/types';

import { validateScenario } from '../validate';
import {
  choiceOf,
  broken,
  createScenario,
  errorsOf,
  transitionsOf,
} from './fixtures';

import type { Mutation } from './fixtures';

const slot = (character: string): Scenario.Slot => ({
  character,
  mood: Character.Mood.Neutral,
});

describe(validateScenario.name, () => {
  test(`reports ${Validation.Code.RefCharacter} in characters`, () => {
    const scenario = createScenario();
    scenario.characters.push('stranger');

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.RefCharacter, path: 'characters[2]' },
    ]);
  });

  test.each<[string, Mutation]>([
    ['nodes.intro.speaker', (s) => (s.nodes.intro.speaker = 'ghost')],
    [
      'nodes.intro.stage.left.character',
      (s) => (s.nodes.intro.stage!.left = slot('ghost')),
    ],
  ])(`reports ${Validation.Code.RefCharacter} at %s`, (path, mutate) => {
    expect(errorsOf(broken(mutate))).toEqual([
      { code: Validation.Code.RefCharacter, path },
      { code: Validation.Code.RefCharacterNotListed, path },
    ]);
  });

  test.each<[string, Mutation]>([
    ['nodes.intro.speaker', (s) => (s.nodes.intro.speaker = 'oleg')],
    [
      'nodes.intro.stage.right.character',
      (s) => (s.nodes.intro.stage!.right = slot('oleg')),
    ],
    [
      'outcomes.timeout.speaker',
      (s) => (s.outcomes!.timeout!.speaker = 'oleg'),
    ],
    [
      'outcomes.meterDepleted.trust.speaker',
      (s) => (s.outcomes!.meterDepleted!.trust.speaker = 'oleg'),
    ],
  ])(
    `reports ${Validation.Code.RefCharacterNotListed} at %s`,
    (path, mutate) => {
      expect(errorsOf(broken(mutate))).toEqual([
        { code: Validation.Code.RefCharacterNotListed, path },
      ]);
    }
  );

  test(`reports ${Validation.Code.RefBackground}`, () => {
    const scenario = createScenario();
    scenario.nodes.intro.stage!.background = 'ghost';

    expect(errorsOf(scenario)).toEqual([
      {
        code: Validation.Code.RefBackground,
        path: 'nodes.intro.stage.background',
      },
    ]);
  });

  test(`reports ${Validation.Code.RefTopic}`, () => {
    const scenario = createScenario();
    scenario.topics.push('ghost');

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.RefTopic, path: 'topics[1]' },
    ]);
  });

  test.each<[string, Mutation]>([
    [
      'nodes.q1.options[0].effects[0].meter',
      (s) =>
        (choiceOf(s).options[0].effects![0] = { meter: 'ghost', delta: 1 }),
    ],
    [
      'nodes.q1.options[1].if.meter',
      (s) => (choiceOf(s).options[1].if = { meter: 'ghost', gte: 0 }),
    ],
    [
      'nodes.check.next[0].if[1].meter',
      (s) =>
        (transitionsOf(s)[0].if = [
          { flag: 'helped' },
          { meter: 'ghost', gt: 1 },
        ]),
    ],
    ['passCriteria.meters.ghost', (s) => (s.passCriteria!.meters!.ghost = 10)],
    [
      'outcomes.meterDepleted.ghost',
      (s) =>
        (s.outcomes!.meterDepleted!.ghost = { speaker: 'anna', text: 'Нет' }),
    ],
  ])(`reports ${Validation.Code.RefMeter} at %s`, (path, mutate) => {
    expect(errorsOf(broken(mutate))).toEqual([
      { code: Validation.Code.RefMeter, path },
    ]);
  });
});
