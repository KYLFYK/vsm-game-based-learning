import type { Scenario } from '@/types';

/** Темы сценариев для отчёта и рекомендаций */
export const TOPICS: Record<Scenario.TopicId, { label: string }> = {
  'safety.evacuation': { label: 'Эвакуация и безопасность' },
  'safety.fire': { label: 'Действия при пожаре' },
  'communication.calm': { label: 'Спокойное общение с пассажиром' },
  'communication.deescalation': { label: 'Разрядка конфликта' },
  'procedure.firstAid': { label: 'Первая помощь' },
};
