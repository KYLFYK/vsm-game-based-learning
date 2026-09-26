/** Единственный источник путей. Строковые литералы путей в компонентах запрещены. */
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE: '/courses/:courseId',
  SCENARIO: '/scenarios/:scenarioId',
  SCENARIO_ATTEMPT: '/scenarios/:scenarioId/attempts/:attemptId',
  ACHIEVEMENTS: '/achievements',
} as const;

/** Search-параметр контекста курса: из курса в сценарий и из сценария в отчёт */
export const COURSE_SEARCH_PARAM = 'course';

/** Search-параметр активного таба на странице достижений */
export const ACHIEVEMENT_TAB_SEARCH_PARAM = 'tab';
