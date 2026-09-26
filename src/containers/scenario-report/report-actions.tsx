import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { ROUTES } from '@/constants/routes';
import type { Course, Report, Scenario } from '@/types';
import { courseLink, scenarioLink } from '@/utils';

import { isRetryPrimary } from './report-view';
import { Actions } from './scenario-report.styles';

interface ReportActionsProps {
  report: Report.Item;
  scenarioId: Scenario.Id;
  courseId: Course.Id | null;
  /** Найденный курс из `course`; без него последняя кнопка ведёт в каталог */
  course: Course.Definition | undefined;
}

export const ReportActions = ({
  report,
  scenarioId,
  courseId,
  course,
}: ReportActionsProps) => {
  const retryFirst = isRetryPrimary(report.outcome.status, report.score);
  const retry = (
    <ButtonLink
      key="retry"
      to={scenarioLink(scenarioId, courseId)}
      variant={retryFirst ? ButtonVariant.Primary : ButtonVariant.Secondary}
      size={ButtonSize.Lg}
    >
      Пройти ещё раз
    </ButtonLink>
  );
  const next =
    report.nextScenarioId === null ? null : (
      <ButtonLink
        key="next"
        to={scenarioLink(report.nextScenarioId, courseId)}
        variant={retryFirst ? ButtonVariant.Secondary : ButtonVariant.Primary}
        size={ButtonSize.Lg}
      >
        Следующий сценарий ▸
      </ButtonLink>
    );

  return (
    <Actions>
      {retryFirst ? [retry, next] : [next, retry]}
      <ButtonLink
        to={course === undefined ? ROUTES.HOME : courseLink(course.id)}
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Lg}
      >
        {course === undefined ? 'К сценариям' : 'К курсу'}
      </ButtonLink>
    </Actions>
  );
};
