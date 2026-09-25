import type { Scenario } from '@/types';

/** Definition без деталей прохождения: карточка и рекомендации */
export const toSummary = (
  definition: Scenario.Definition
): Scenario.Summary => ({
  id: definition.id,
  version: definition.version,
  title: definition.title,
  description: definition.description,
  topics: definition.topics,
  estimatedMinutes: definition.estimatedMinutes,
  timeLimitSec: definition.timeLimitSec,
  hasMeters: definition.meters !== undefined,
});
