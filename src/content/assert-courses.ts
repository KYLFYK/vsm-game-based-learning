import type { Course, Scenario } from '@/types';

/**
 * Проверяет, что каждый `scenarioIds` курса ссылается на загруженный
 * сценарий; это наш собственный бандл, поэтому полноценный валидатор для
 * курса избыточен — достаточно проверки ссылок
 */
export const assertCourses = (
  courses: Course.Definition[],
  scenarios: Record<Scenario.Id, Scenario.Definition>
): void => {
  const lines = courses.flatMap((course) =>
    course.scenarioIds
      .map((scenarioId, position) => ({ scenarioId, position }))
      .filter(({ scenarioId }) => !Object.hasOwn(scenarios, scenarioId))
      .map(
        ({ scenarioId, position }) =>
          `${course.id}: course.missingScenario scenarioIds[${position}] Сценария «${scenarioId}» нет среди SCENARIOS`
      )
  );
  if (lines.length > 0) {
    throw new Error(lines.join('\n'));
  }
};
