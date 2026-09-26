import { useMemo } from 'react';
import { useParams } from 'react-router';

import { LoadingText } from '@/components/muted-text';
import { NotFound } from '@/components/not-found';
import { Page, PageHeader } from '@/components/page';
import { useCourseParam, useDocumentTitle } from '@/hooks';
import {
  useGetAttemptQuery,
  useGetAttemptsQuery,
  useGetCourseQuery,
  useGetScenarioQuery,
  useGetScenariosQuery,
} from '@/store';
import { backLink, buildReport, isAwaitingData } from '@/utils';

import { DecisionsSection } from './decisions-section';
import { MetersSection } from './meters-section';
import { OutcomeSection } from './outcome-section';
import { RecommendationsSection } from './recommendations-section';
import { ReportActions } from './report-actions';
import { TopicsSection } from './topics-section';

export const ScenarioReport = () => {
  const { scenarioId = '', attemptId = '' } = useParams();
  const courseId = useCourseParam();

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

  const isLoading = isAwaitingData([
    attemptQuery,
    scenarioQuery,
    catalogQuery,
    attemptsQuery,
    courseQuery,
  ]);

  if (isLoading) return <LoadingText />;

  if (report === null || attempt === undefined || scenario === undefined) {
    return (
      <NotFound
        title="Попытка не найдена"
        text="Возможно, она сохранена в другом браузере или история была очищена."
        back={backLink()}
      />
    );
  }

  return (
    <Page>
      <PageHeader kicker="Отчёт о попытке" title={scenario.title} />
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
        course={course}
      />
    </Page>
  );
};
