import { TOPICS } from '@/constants/topics';
import type { Scenario } from '@/types';

import { ownValue } from './own-value';

/** Подпись темы; тема не из реестра (контент другой версии) показывается своим id */
export const topicLabel = (id: Scenario.TopicId): string =>
  ownValue(TOPICS, id)?.label ?? id;
