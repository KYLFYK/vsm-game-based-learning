import { BACKGROUNDS } from '@/constants/backgrounds';
import { CHARACTERS } from '@/constants/characters';
import { TOPICS } from '@/constants/topics';
import type { Achievement, Course, Scenario, Validation } from '@/types';

import achievementsData from './achievements.json';
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

export const ACHIEVEMENTS: Achievement.Definition[] = achievementsData;

export { EARNED_ACHIEVEMENTS_MOCK } from './earned-achievements.mock';

export { toSummary } from './to-summary';
