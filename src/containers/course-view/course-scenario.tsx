import { ButtonLink, ButtonVariant } from '@/components/button';
import { MutedText } from '@/components/muted-text';
import type { Attempt, Course, Scenario } from '@/types';
import {
  attemptDuration,
  bestAttempt,
  formatEstimate,
  formatRemaining,
  scenarioLink,
} from '@/utils';

import { AttemptHistory } from './attempt-history';
import {
  playLabel,
  SCENARIO_STATUS_LABELS,
  SCENARIO_STATUS_TONES,
} from './course-view-model';
import {
  Footer,
  Item,
  ItemHeader,
  ItemTitle,
  Meta,
  StatusBadge,
} from './course-view.styles';

const bestSummary = (best: Attempt.Item): string => {
  const time = formatRemaining(attemptDuration(best));
  return best.score === null
    ? `Лучшая попытка: ${time}`
    : `Лучшая попытка: балл ${best.score} · ${time}`;
};

interface CourseScenarioProps {
  position: number;
  scenario: Scenario.Summary;
  status: Course.ScenarioStatus;
  /** Попытки сценария, новые первыми */
  attempts: Attempt.Item[];
  courseId: Course.Id;
  primary: boolean;
}

export const CourseScenario = ({
  position,
  scenario,
  status,
  attempts,
  courseId,
  primary,
}: CourseScenarioProps) => {
  const best = bestAttempt(attempts);
  return (
    <Item>
      <ItemHeader>
        <ItemTitle>
          {position}. {scenario.title}
        </ItemTitle>
        <StatusBadge $tone={SCENARIO_STATUS_TONES[status]}>
          {SCENARIO_STATUS_LABELS[status]}
        </StatusBadge>
      </ItemHeader>
      <MutedText>{scenario.description}</MutedText>
      <Footer>
        <Meta>
          {formatEstimate(scenario.estimatedMinutes)}
          {best !== null && ` · ${bestSummary(best)}`}
        </Meta>
        <ButtonLink
          to={scenarioLink(scenario.id, courseId)}
          variant={primary ? ButtonVariant.Primary : ButtonVariant.Secondary}
        >
          {playLabel(status)}
        </ButtonLink>
      </Footer>
      <AttemptHistory
        attempts={attempts}
        bestId={best?.id ?? null}
        courseId={courseId}
      />
    </Item>
  );
};
