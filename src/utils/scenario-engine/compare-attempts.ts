import { Attempt } from '@/types';

/** `null` в score ниже любого числа; два `null` равны между собой */
const compareScore = (a: number | null, b: number | null): number => {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
};

const duration = (attempt: Attempt.Item): number =>
  attempt.finishedAt - attempt.startedAt;

/** Компаратор «лучшая попытка первой» для `Array.prototype.sort`: отрицательное значение — `a` лучше */
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
