import { createSearchParams, generatePath } from 'react-router';
import type { Path } from 'react-router';

import { ROUTES } from '@/constants/routes';
import type { Attempt, Course, Scenario } from '@/types';

type Link = Pick<Path, 'pathname' | 'search'>;

// Контекст курса едет search-параметром `course`: из курса в сценарий и из сценария в отчёт
const courseSearch = (courseId?: Course.Id | null): string =>
  courseId === undefined || courseId === null
    ? ''
    : `?${createSearchParams({ course: courseId }).toString()}`;

export const scenarioLink = (
  scenarioId: Scenario.Id,
  courseId?: Course.Id | null
): Link => ({
  pathname: generatePath(ROUTES.SCENARIO, { scenarioId }),
  search: courseSearch(courseId),
});

export const attemptLink = (
  scenarioId: Scenario.Id,
  attemptId: Attempt.Id,
  courseId?: Course.Id | null
): Link => ({
  pathname: generatePath(ROUTES.SCENARIO_ATTEMPT, { scenarioId, attemptId }),
  search: courseSearch(courseId),
});

export const courseLink = (courseId: Course.Id): string =>
  generatePath(ROUTES.COURSE, { courseId });
