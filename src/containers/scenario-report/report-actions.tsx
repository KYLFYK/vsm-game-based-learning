import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { ROUTES } from '@/constants/routes';
import type { Course, Report, Scenario } from '@/types';

import { isRetryPrimary } from './report-view';
import { scenarioLink } from './scenario-link';
import { Actions } from './scenario-report.styles';

interface ReportActionsProps {
  report: Report.Item;
  scenarioId: Scenario.Id;
  courseId: Course.Id | null;
}

// «К курсу» появится со страницами курсов (этап 6); до них — каталог на главной
export const ReportActions = ({
  report,
  scenarioId,
  courseId,
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
        to={ROUTES.HOME}
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Lg}
      >
        К сценариям
      </ButtonLink>
    </Actions>
  );
};
