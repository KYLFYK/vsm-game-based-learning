import { Course } from '@/types';
import type { Attempt, Scenario } from '@/types';

import { attemptsOf, scenarioStatus } from './best-attempt';

export interface CourseProgress {
  statuses: Record<Scenario.Id, Course.ScenarioStatus>;
  passed: number;
  total: number;
  /** У каждого сценария курса есть попытка `Passed` */
  completed: boolean;
}

/**
 * Прогресс курса по всем попыткам: сценарий, зачтённый вне курса, тоже
 * засчитывается — проходится один и тот же сценарий.
 */
export const courseProgress = (
  course: Course.Definition,
  attempts: Attempt.Item[]
): CourseProgress => {
  const statuses: Record<Scenario.Id, Course.ScenarioStatus> = {};
  for (const scenarioId of course.scenarioIds) {
    statuses[scenarioId] = scenarioStatus(attemptsOf(attempts, scenarioId));
  }
  const passed = course.scenarioIds.filter(
    (id) => statuses[id] === Course.ScenarioStatus.Passed
  ).length;
  const total = course.scenarioIds.length;
  return { statuses, passed, total, completed: total > 0 && passed === total };
};
