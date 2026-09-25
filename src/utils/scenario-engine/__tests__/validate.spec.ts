import { Validation } from '@/types';

import { validateScenario } from '../validate';
import { choiceOf, createScenario, errorsOf, registries } from './fixtures';

describe(validateScenario.name, () => {
  test('accepts a correct scenario and returns it as is', () => {
    const scenario = createScenario();

    const result = validateScenario(scenario, registries);

    expect(result).toEqual({ ok: true, scenario, warnings: [] });
    expect(result.ok && result.scenario).toBe(scenario);
  });

  test('stops after a shape error without running phase 2', () => {
    const scenario = createScenario();
    Reflect.deleteProperty(scenario, 'title');
    scenario.startNodeId = 'nowhere';
    choiceOf(scenario).options[0].review = undefined;

    const result = validateScenario(scenario, registries);

    expect(result).toEqual({
      ok: false,
      errors: [expect.objectContaining({ code: Validation.Code.ShapeMissing })],
      warnings: [],
    });
  });

  test('collects every phase 2 error', () => {
    const scenario = createScenario();
    scenario.topics = ['calm', 'ghost'];
    scenario.characters = ['author', 'anna', 'stranger'];

    expect(errorsOf(scenario)).toEqual([
      { code: Validation.Code.RefCharacter, path: 'characters[2]' },
      { code: Validation.Code.RefTopic, path: 'topics[1]' },
    ]);
  });

  test('keeps ok true when there are only warnings', () => {
    const scenario = createScenario();
    choiceOf(scenario).options[0].review = undefined;

    const result = validateScenario(scenario, registries);

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([
      expect.objectContaining({ code: Validation.Code.ReviewNoBest }),
      expect.objectContaining({
        code: Validation.Code.OptionNoReviewWithEffects,
      }),
    ]);
  });

  test('returns warnings together with errors', () => {
    const scenario = createScenario();
    scenario.topics = ['ghost'];

    const result = validateScenario(scenario, registries);

    expect(result.ok).toBe(false);
    expect(result.warnings).toEqual([
      expect.objectContaining({
        code: Validation.Code.ReviewTopicNotDeclared,
        path: 'nodes.q1.options[0].review.topic',
      }),
      expect.objectContaining({
        code: Validation.Code.ReviewTopicNotDeclared,
        path: 'nodes.q1.options[1].review.topic',
      }),
    ]);
  });

  test('describes every issue with a message', () => {
    const scenario = createScenario();
    scenario.topics = ['ghost'];

    const result = validateScenario(scenario, registries);

    expect(result).toMatchSnapshot();
  });
});
