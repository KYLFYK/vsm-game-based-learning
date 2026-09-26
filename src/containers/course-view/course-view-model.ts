import { Course } from '@/types';
import type { Scenario } from '@/types';

export const SCENARIO_STATUS_LABELS: Record<Course.ScenarioStatus, string> = {
  [Course.ScenarioStatus.NotStarted]: 'Не начат',
  [Course.ScenarioStatus.Passed]: 'Зачтено',
  [Course.ScenarioStatus.Failed]: 'Не зачтено',
};

export const playLabel = (status: Course.ScenarioStatus): string =>
  status === Course.ScenarioStatus.NotStarted ? 'Играть' : 'Пройти ещё раз';

/** Первый по порядку незачтённый сценарий курса: его кнопка — главная */
export const nextToPlay = (
  scenarioIds: Scenario.Id[],
  statuses: Record<Scenario.Id, Course.ScenarioStatus>
): Scenario.Id | null =>
  scenarioIds.find((id) => statuses[id] !== Course.ScenarioStatus.Passed) ??
  null;
