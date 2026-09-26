import { createSearchParams, generatePath } from 'react-router';
import type { Path } from 'react-router';

import { COURSE_SEARCH_PARAM, ROUTES } from '@/constants/routes';
import type { Attempt, Course, Scenario } from '@/types';

type Link = Pick<Path, 'pathname' | 'search'>;

const courseSearch = (courseId?: Course.Id | null): string =>
  courseId === undefined || courseId === null
    ? ''
    : `?${createSearchParams({ [COURSE_SEARCH_PARAM]: courseId }).toString()}`;

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

export interface BackLink {
  to: string;
  label: string;
}

/** Куда вернуться из сценария или отчёта: на курс, если он задан, иначе к сценариям */
export const backLink = (courseId?: Course.Id | null): BackLink =>
  courseId === undefined || courseId === null
    ? { to: ROUTES.HOME, label: 'К сценариям' }
    : { to: courseLink(courseId), label: 'К курсу' };
