import { Attempt, Course } from '@/types';

import { attemptsOf, bestAttempt, scenarioStatus } from '../best-attempt';

const attempt = (patch: Partial<Attempt.Item> = {}): Attempt.Item => ({
  id: 'a',
  scenarioId: 'scenario',
  scenarioVersion: 1,
  startedAt: 0,
  finishedAt: 1000,
  status: Attempt.Status.Passed,
  reason: Attempt.Reason.Completed,
  score: 100,
  meters: {},
  flags: {},
  log: [],
  ...patch,
});

describe(bestAttempt.name, () => {
  test('returns null for no attempts', () => {
    expect(bestAttempt([])).toBeNull();
  });

  test('picks the attempt ranked first by compareAttempts', () => {
    const failed = attempt({ id: 'failed', status: Attempt.Status.Failed });
    const low = attempt({ id: 'low', score: 40 });
    const high = attempt({ id: 'high', score: 90 });
    expect(bestAttempt([failed, low, high])?.id).toBe('high');
  });

  test('does not reorder the input list', () => {
    const list = [attempt({ id: 'low', score: 40 }), attempt({ id: 'high' })];
    bestAttempt(list);
    expect(list.map((item) => item.id)).toEqual(['low', 'high']);
  });
});

describe(scenarioStatus.name, () => {
  test('no attempts means not started', () => {
    expect(scenarioStatus([])).toBe(Course.ScenarioStatus.NotStarted);
  });

  test('a passed best attempt means passed, even after later failures', () => {
    const attempts = [
      attempt({ status: Attempt.Status.Failed, finishedAt: 5000 }),
      attempt({ status: Attempt.Status.Passed, score: 0 }),
    ];
    expect(scenarioStatus(attempts)).toBe(Course.ScenarioStatus.Passed);
  });

  test('only failed attempts mean failed', () => {
    const attempts = [
      attempt({ status: Attempt.Status.Failed }),
      attempt({ status: Attempt.Status.Failed, score: null }),
    ];
    expect(scenarioStatus(attempts)).toBe(Course.ScenarioStatus.Failed);
  });
});

describe(attemptsOf.name, () => {
  test('keeps attempts of the scenario in their order', () => {
    const attempts = [
      attempt({ id: 'one', scenarioId: 'smoke' }),
      attempt({ id: 'other', scenarioId: 'fire' }),
      attempt({ id: 'two', scenarioId: 'smoke' }),
    ];
    expect(attemptsOf(attempts, 'smoke').map((item) => item.id)).toEqual([
      'one',
      'two',
    ]);
  });
});
