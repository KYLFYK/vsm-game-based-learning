import { createSearchParams, generatePath } from 'react-router';
import type { Path } from 'react-router';

import { ROUTES } from '@/constants/routes';
import type { Course, Scenario } from '@/types';

/** Ссылка на сценарий; контекст курса едет search-параметром `course` */
export const scenarioLink = (
  scenarioId: Scenario.Id,
  courseId?: Course.Id | null
): Pick<Path, 'pathname' | 'search'> => ({
  pathname: generatePath(ROUTES.SCENARIO, { scenarioId }),
  search:
    courseId === undefined || courseId === null
      ? ''
      : `?${createSearchParams({ course: courseId }).toString()}`,
});
