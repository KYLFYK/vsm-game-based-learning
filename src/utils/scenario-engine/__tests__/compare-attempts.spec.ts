import { Attempt } from '@/types';

import { compareAttempts } from '../compare-attempts';

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

describe(compareAttempts.name, () => {
  test('a passed attempt beats a failed one regardless of the rest', () => {
    const passed = attempt({
      status: Attempt.Status.Passed,
      score: 0,
      startedAt: 0,
      finishedAt: 10000,
    });
    const failed = attempt({
      status: Attempt.Status.Failed,
      score: 100,
      startedAt: 0,
      finishedAt: 100,
    });
    expect(compareAttempts(passed, failed)).toBeLessThan(0);
    expect(compareAttempts(failed, passed)).toBeGreaterThan(0);
  });

  test('equal status falls through to score, higher wins', () => {
    const higher = attempt({ score: 80 });
    const lower = attempt({ score: 40 });
    expect(compareAttempts(higher, lower)).toBeLessThan(0);
    expect(compareAttempts(lower, higher)).toBeGreaterThan(0);
  });

  test('a null score is worse than any number', () => {
    const withScore = attempt({ score: 0 });
    const nullScore = attempt({ score: null });
    expect(compareAttempts(withScore, nullScore)).toBeLessThan(0);
    expect(compareAttempts(nullScore, withScore)).toBeGreaterThan(0);
  });

  test('two null scores are equal and fall through to duration', () => {
    const shorter = attempt({ score: null, startedAt: 0, finishedAt: 100 });
    const longer = attempt({ score: null, startedAt: 0, finishedAt: 1000 });
    expect(compareAttempts(shorter, longer)).toBeLessThan(0);
    expect(compareAttempts(longer, shorter)).toBeGreaterThan(0);
  });

  test('equal score falls through to duration, shorter wins', () => {
    const shorter = attempt({ score: 50, startedAt: 1000, finishedAt: 1500 });
    const longer = attempt({ score: 50, startedAt: 0, finishedAt: 2000 });
    expect(compareAttempts(shorter, longer)).toBeLessThan(0);
    expect(compareAttempts(longer, shorter)).toBeGreaterThan(0);
  });

  test('equal duration falls through to a later finishedAt', () => {
    const later = attempt({ score: 50, startedAt: 1000, finishedAt: 2000 });
    const earlier = attempt({ score: 50, startedAt: 0, finishedAt: 1000 });
    expect(compareAttempts(later, earlier)).toBeLessThan(0);
    expect(compareAttempts(earlier, later)).toBeGreaterThan(0);
  });

  test('identical attempts compare equal', () => {
    const one = attempt();
    const other = attempt();
    expect(compareAttempts(one, other)).toBe(0);
  });

  test('sorting a mixed list orders the best attempt first', () => {
    const failed = attempt({
      id: 'failed',
      status: Attempt.Status.Failed,
      score: 100,
    });
    const lowScore = attempt({ id: 'low-score', score: 20 });
    const slowerBest = attempt({
      id: 'slower-best',
      score: 90,
      startedAt: 0,
      finishedAt: 5000,
    });
    const fasterBest = attempt({
      id: 'faster-best',
      score: 90,
      startedAt: 0,
      finishedAt: 2000,
    });
    const noScore = attempt({ id: 'no-score', score: null });

    const sorted = [failed, lowScore, slowerBest, noScore, fasterBest].sort(
      compareAttempts
    );

    expect(sorted.map((item) => item.id)).toEqual([
      'faster-best',
      'slower-best',
      'low-score',
      'no-score',
      'failed',
    ]);
  });
});
