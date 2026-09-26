import { Attempt } from '@/types';
import type { Report, Scenario } from '@/types';

export const MAX_RECOMMENDATIONS = 3;

export interface RecommendInput {
  scenarioId: Scenario.Id;
  weakTopics: Scenario.TopicId[];
  catalog: Scenario.Summary[];
  attempts: Attempt.Item[];
}

interface Candidate {
  scenario: Scenario.Summary;
  topics: Scenario.TopicId[];
  passed: boolean;
}

const compareCandidates = (a: Candidate, b: Candidate): number =>
  b.topics.length - a.topics.length ||
  Number(a.passed) - Number(b.passed) ||
  a.scenario.estimatedMinutes - b.scenario.estimatedMinutes ||
  a.scenario.title.localeCompare(b.scenario.title);

/** Сценарии каталога по слабым темам попытки (specs/scenario-engine/report.md#рекомендации) */
export const recommendScenarios = ({
  scenarioId,
  weakTopics,
  catalog,
  attempts,
}: RecommendInput): Report.Recommendation[] => {
  const passed = new Set(
    attempts
      .filter((attempt) => attempt.status === Attempt.Status.Passed)
      .map((attempt) => attempt.scenarioId)
  );
  return catalog
    .filter((scenario) => scenario.id !== scenarioId)
    .map((scenario) => ({
      scenario,
      topics: scenario.topics.filter((topic) => weakTopics.includes(topic)),
      passed: passed.has(scenario.id),
    }))
    .filter((candidate) => candidate.topics.length > 0)
    .sort(compareCandidates)
    .slice(0, MAX_RECOMMENDATIONS)
    .map(({ scenario, topics }) => ({
      scenarioId: scenario.id,
      title: scenario.title,
      topics,
    }));
};
