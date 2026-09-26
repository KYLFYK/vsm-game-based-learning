/** Единственный источник путей. Строковые литералы путей в компонентах запрещены. */
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE: '/courses/:courseId',
  SCENARIO: '/scenarios/:scenarioId',
  SCENARIO_ATTEMPT: '/scenarios/:scenarioId/attempts/:attemptId',
} as const;
