import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { PageActions } from '@/components/page';
import type { Course, Report, Scenario } from '@/types';
import { backLink, scenarioLink } from '@/utils';

import { isRetryPrimary } from './report-view';

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

  const back = backLink(course?.id);

  return (
    <PageActions>
      {retryFirst ? [retry, next] : [next, retry]}
      <ButtonLink
        to={back.to}
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Lg}
      >
        {back.label}
      </ButtonLink>
    </PageActions>
  );
};
