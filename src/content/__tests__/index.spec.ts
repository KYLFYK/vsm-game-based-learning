import { BACKGROUNDS } from '@/constants/backgrounds';
import { CHARACTERS } from '@/constants/characters';
import { TOPICS } from '@/constants/topics';
import type { Course, Scenario, Validation } from '@/types';

import { assertCourses } from '../assert-courses';
import * as content from '../index';
import { loadScenarios } from '../load-scenarios';
import { toSummary } from '../to-summary';

const registries: Validation.Registries = {
  characters: CHARACTERS,
  backgrounds: BACKGROUNDS,
  topics: TOPICS,
};

describe('content', () => {
  test('loads the bundle without throwing and exposes smoke-next-car', () => {
    expect(content.SCENARIOS['smoke-next-car']?.id).toBe('smoke-next-car');
  });

  test('every course references only existing scenarios', () => {
    content.COURSES.forEach((course) => {
      course.scenarioIds.forEach((scenarioId) => {
        expect(content.SCENARIOS[scenarioId]).toBeDefined();
      });
    });
  });

  test('validator warnings for all bundled content', () => {
    expect(content.CONTENT_WARNINGS).toMatchSnapshot();
  });
});

describe(loadScenarios.name, () => {
  test('collects a valid scenario by id with its warnings', () => {
    const { scenarios, warnings } = loadScenarios(
      { 'scenarios/smoke-next-car.json': content.SCENARIOS['smoke-next-car'] },
      registries
    );

    expect(scenarios['smoke-next-car']).toBeDefined();
    expect(warnings['smoke-next-car']).toEqual([]);
  });

  test('throws code path message lines prefixed by the source file, on shape errors', () => {
    const broken = { id: 'broken' };

    expect(() => loadScenarios({ 'broken.json': broken }, registries)).toThrow(
      /^broken\.json: shape\.missing /m
    );
  });
});

describe(assertCourses.name, () => {
  const scenarios: Record<Scenario.Id, Scenario.Definition> = {
    'smoke-next-car': content.SCENARIOS['smoke-next-car'],
  };

  test('passes when every scenarioIds entry exists', () => {
    const courses: Course.Definition[] = [
      {
        id: 'emergency-basics',
        title: 'Курс',
        description: 'Описание',
        scenarioIds: ['smoke-next-car'],
      },
    ];

    expect(() => assertCourses(courses, scenarios)).not.toThrow();
  });

  test('throws when a course references a missing scenario', () => {
    const courses: Course.Definition[] = [
      {
        id: 'broken-course',
        title: 'Курс',
        description: 'Описание',
        scenarioIds: ['ghost-scenario'],
      },
    ];

    expect(() => assertCourses(courses, scenarios)).toThrow(
      /^broken-course: course\.missingScenario scenarioIds\[0\]/
    );
  });
});

describe(toSummary.name, () => {
  test('drops meters, passCriteria, outcomes, characters, startNodeId and nodes', () => {
    const summary = toSummary(content.SCENARIOS['smoke-next-car']);

    expect(summary).toMatchSnapshot();
  });
});
