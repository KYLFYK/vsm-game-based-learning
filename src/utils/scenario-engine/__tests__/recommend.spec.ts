import { Attempt } from '@/types';
import type { Scenario } from '@/types';

import { MAX_RECOMMENDATIONS, recommendScenarios } from '../recommend';

const summary = (
  id: string,
  topics: string[],
  patch: Partial<Scenario.Summary> = {}
): Scenario.Summary => ({
  id,
  version: 1,
  title: id,
  description: id,
  topics,
  estimatedMinutes: 5,
  hasMeters: false,
  ...patch,
});

const attempt = (scenarioId: string, status: Attempt.Status): Attempt.Item => ({
  id: `${scenarioId}-${status}`,
  scenarioId,
  scenarioVersion: 1,
  startedAt: 0,
  finishedAt: 1000,
  status,
  reason: Attempt.Reason.Completed,
  score: null,
  meters: {},
  flags: {},
  log: [],
});

const recommend = (
  catalog: Scenario.Summary[],
  weakTopics: string[] = ['calm', 'fire'],
  attempts: Attempt.Item[] = []
) =>
  recommendScenarios({ scenarioId: 'current', weakTopics, catalog, attempts });

const ids = (items: { scenarioId: string }[]) =>
  items.map((item) => item.scenarioId);

describe(recommendScenarios.name, () => {
  test('no weak topics means no recommendations', () => {
    expect(recommend([summary('a', ['calm'])], [])).toEqual([]);
  });

  test('skips the current scenario and scenarios without shared topics', () => {
    const result = recommend([
      summary('current', ['calm']),
      summary('other', ['safety']),
      summary('match', ['safety', 'fire']),
    ]);
    expect(result).toEqual([
      { scenarioId: 'match', title: 'match', topics: ['fire'] },
    ]);
  });

  test('larger topic overlap comes first', () => {
    const result = recommend([
      summary('one', ['calm']),
      summary('two', ['fire', 'calm']),
    ]);
    expect(ids(result)).toEqual(['two', 'one']);
    expect(result[0].topics).toEqual(['fire', 'calm']);
  });

  test('on equal overlap, scenarios not yet passed come first', () => {
    const result = recommend(
      [summary('passed', ['calm']), summary('failed', ['calm'])],
      ['calm'],
      [
        attempt('passed', Attempt.Status.Failed),
        attempt('passed', Attempt.Status.Passed),
        attempt('failed', Attempt.Status.Failed),
      ]
    );
    expect(ids(result)).toEqual(['failed', 'passed']);
  });

  test('then shorter estimatedMinutes, then title', () => {
    const result = recommend([
      summary('long', ['calm'], { estimatedMinutes: 10 }),
      summary('b', ['calm'], { title: 'Б' }),
      summary('a', ['calm'], { title: 'А' }),
    ]);
    expect(ids(result)).toEqual(['a', 'b', 'long']);
  });

  test(`returns at most ${MAX_RECOMMENDATIONS} scenarios`, () => {
    const catalog = ['a', 'b', 'c', 'd', 'e'].map((id) =>
      summary(id, ['calm'])
    );
    expect(recommend(catalog)).toHaveLength(MAX_RECOMMENDATIONS);
  });
});
