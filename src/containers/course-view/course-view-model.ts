import { STAMP_LABELS } from '@/components/stamp';
import { TagTone } from '@/components/tag';
import { Attempt, Course } from '@/types';
import type { Scenario } from '@/types';

export const SCENARIO_STATUS_LABELS: Record<Course.ScenarioStatus, string> = {
  [Course.ScenarioStatus.NotStarted]: 'Не начат',
  [Course.ScenarioStatus.Passed]: STAMP_LABELS[Attempt.Status.Passed],
  [Course.ScenarioStatus.Failed]: STAMP_LABELS[Attempt.Status.Failed],
};

export const SCENARIO_STATUS_TONES: Record<Course.ScenarioStatus, TagTone> = {
  [Course.ScenarioStatus.NotStarted]: TagTone.Neutral,
  [Course.ScenarioStatus.Passed]: TagTone.Navy,
  [Course.ScenarioStatus.Failed]: TagTone.Red,
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
