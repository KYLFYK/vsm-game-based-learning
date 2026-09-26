import { BACKGROUNDS } from '@/constants/backgrounds';
import { CHARACTERS } from '@/constants/characters';
import { TOPICS } from '@/constants/topics';
import type { Course, Scenario, Validation } from '@/types';

import { assertCourses } from './assert-courses';
import coursesData from './courses.json';
import { loadScenarios } from './load-scenarios';
import smokeNextCar from './scenarios/smoke-next-car.json';

const registries: Validation.Registries = {
  characters: CHARACTERS,
  backgrounds: BACKGROUNDS,
  topics: TOPICS,
};

const { scenarios, warnings } = loadScenarios(
  { 'scenarios/smoke-next-car.json': smokeNextCar },
  registries
);

export const SCENARIOS: Record<Scenario.Id, Scenario.Definition> = scenarios;

/** Предупреждения валидатора по каждому сценарию, для snapshot-теста контента */
export const CONTENT_WARNINGS: Record<Scenario.Id, Validation.Issue[]> =
  warnings;

export const COURSES: Course.Definition[] = coursesData;

assertCourses(COURSES, SCENARIOS);

export { toSummary } from './to-summary';
