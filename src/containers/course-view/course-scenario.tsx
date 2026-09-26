import { ButtonLink, ButtonVariant } from '@/components/button';
import type { Attempt, Course, Scenario } from '@/types';
import { bestAttempt, formatRemaining, scenarioLink } from '@/utils';

import { AttemptHistory } from './attempt-history';
import { playLabel, SCENARIO_STATUS_LABELS } from './course-view-model';
import {
  Badge,
  Footer,
  Item,
  ItemHeader,
  ItemTitle,
  Meta,
  Muted,
} from './course-view.styles';

const bestSummary = (best: Attempt.Item): string => {
  const time = formatRemaining(best.finishedAt - best.startedAt);
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
        <Badge $status={status}>{SCENARIO_STATUS_LABELS[status]}</Badge>
      </ItemHeader>
      <Muted>{scenario.description}</Muted>
      <Footer>
        <Meta>
          ~{scenario.estimatedMinutes} мин
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
