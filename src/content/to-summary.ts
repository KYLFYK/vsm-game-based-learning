import type { Scenario } from '@/types';
import { hasMeters } from '@/utils';

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
  ...(definition.timeLimitSec === undefined
    ? {}
    : { timeLimitSec: definition.timeLimitSec }),
  hasMeters: hasMeters(definition),
});
