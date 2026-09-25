import { Attempt } from '@/types';

/** `null` score sorts below any number; two `null` scores are equal */
const compareScore = (a: number | null, b: number | null): number => {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
};

const duration = (attempt: Attempt.Item): number =>
  attempt.finishedAt - attempt.startedAt;

/** Best-first comparator for `Array.prototype.sort`: negative when `a` is better */
export const compareAttempts = (a: Attempt.Item, b: Attempt.Item): number => {
  if (a.status !== b.status) {
    return a.status === Attempt.Status.Passed ? -1 : 1;
  }
  const scoreDiff = compareScore(a.score, b.score);
  if (scoreDiff !== 0) return scoreDiff;
  const durationDiff = duration(a) - duration(b);
  if (durationDiff !== 0) return durationDiff;
  return b.finishedAt - a.finishedAt;
};
