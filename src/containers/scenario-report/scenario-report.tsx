import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';
import {
  useGetAttemptQuery,
  useGetAttemptsQuery,
  useGetCourseQuery,
  useGetScenarioQuery,
  useGetScenariosQuery,
} from '@/store';
import { buildReport } from '@/utils';

import { DecisionsSection } from './decisions-section';
import { MetersSection } from './meters-section';
import { OutcomeSection } from './outcome-section';
import { RecommendationsSection } from './recommendations-section';
import { ReportActions } from './report-actions';
import { Header, Kicker, Muted, Root, Title } from './scenario-report.styles';
import { TopicsSection } from './topics-section';

export const ScenarioReport = () => {
  const { scenarioId = '', attemptId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');

  const attemptQuery = useGetAttemptQuery(attemptId);
  const scenarioQuery = useGetScenarioQuery(scenarioId);
  const catalogQuery = useGetScenariosQuery();
  const attemptsQuery = useGetAttemptsQuery({});
  const courseQuery = useGetCourseQuery(courseId ?? '', {
    skip: courseId === null,
  });

  const attempt = attemptQuery.currentData;
  const scenario = scenarioQuery.currentData;
  const catalog = catalogQuery.currentData;
  const attempts = attemptsQuery.currentData;
  const course = courseQuery.currentData;

  const report = useMemo(
    () =>
      attempt === undefined ||
      scenario === undefined ||
      attempt.scenarioId !== scenario.id
        ? null
        : buildReport({
            scenario,
            attempt,
            catalog: catalog ?? [],
            attempts: attempts ?? [],
            course,
          }),
    [attempt, scenario, catalog, attempts, course]
  );

  useDocumentTitle(
    scenario === undefined ? 'Отчёт о попытке' : `Отчёт: ${scenario.title}`
  );

  const isLoading = [
    attemptQuery,
    scenarioQuery,
    catalogQuery,
    attemptsQuery,
    courseQuery,
  ].some((query) => query.isFetching && query.currentData === undefined);

  if (isLoading) return <Muted>Загрузка…</Muted>;

  if (report === null || attempt === undefined || scenario === undefined) {
    return (
      <Root>
        <Title>Попытка не найдена</Title>
        <Muted>
          Возможно, она сохранена в другом браузере или история была очищена.
        </Muted>
        <ButtonLink
          to={ROUTES.HOME}
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Md}
        >
          К сценариям
        </ButtonLink>
      </Root>
    );
  }

  return (
    <Root>
      <Header>
        <Kicker>Отчёт о попытке</Kicker>
        <Title>{scenario.title}</Title>
      </Header>
      <OutcomeSection report={report} attempt={attempt} />
      <MetersSection meters={report.meters} />
      <DecisionsSection
        decisions={report.decisions}
        meters={report.meters}
        versionMismatch={report.versionMismatch}
      />
      <TopicsSection topics={report.topics} />
      <RecommendationsSection recommendations={report.recommendations} />
      <ReportActions
        report={report}
        scenarioId={scenario.id}
        courseId={courseId}
      />
    </Root>
  );
};
