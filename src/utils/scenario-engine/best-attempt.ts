import { Attempt, Course } from '@/types';
import type { Scenario } from '@/types';

import { compareAttempts } from './compare-attempts';

/** Лучшая попытка по `compareAttempts`; пустой список — `null` */
export const bestAttempt = (attempts: Attempt.Item[]): Attempt.Item | null =>
  [...attempts].sort(compareAttempts)[0] ?? null;

/** Статус сценария по его попыткам: нет попыток — не начат, иначе статус лучшей */
export const scenarioStatus = (
  attempts: Attempt.Item[]
): Course.ScenarioStatus => {
  const best = bestAttempt(attempts);
  if (best === null) return Course.ScenarioStatus.NotStarted;
  return best.status === Attempt.Status.Passed
    ? Course.ScenarioStatus.Passed
    : Course.ScenarioStatus.Failed;
};

/** Попытки одного сценария, в исходном порядке */
export const attemptsOf = (
  attempts: Attempt.Item[],
  scenarioId: Scenario.Id
): Attempt.Item[] => attempts.filter((item) => item.scenarioId === scenarioId);
