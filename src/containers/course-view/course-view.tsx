import { useMemo } from 'react';
import { useParams } from 'react-router';

import { ButtonLink, ButtonVariant } from '@/components/button';
import { LoadingText, MutedText } from '@/components/muted-text';
import { NotFound } from '@/components/not-found';
import { Page, PageActions, PageHeader, PageList } from '@/components/page';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';
import {
  useGetAttemptsQuery,
  useGetCourseQuery,
  useGetScenariosQuery,
} from '@/store';
import { attemptsOf, courseProgress, isAwaitingData } from '@/utils';

import { CourseScenario } from './course-scenario';
import { nextToPlay } from './course-view-model';
import { Progress } from './course-view.styles';

export const CourseView = () => {
  const { courseId = '' } = useParams();
  const courseQuery = useGetCourseQuery(courseId);
  const scenariosQuery = useGetScenariosQuery();
  const attemptsQuery = useGetAttemptsQuery({});

  // currentData, как в плеере: при смене courseId data держит прошлый курс
  const course = courseQuery.currentData;
  const scenarios = scenariosQuery.currentData;
  // Без истории попыток (хранилище недоступно) курс показывается «не начатым»
  const attempts = useMemo(
    () => attemptsQuery.currentData ?? [],
    [attemptsQuery.currentData]
  );

  const progress = useMemo(
    () => (course === undefined ? null : courseProgress(course, attempts)),
    [course, attempts]
  );

  useDocumentTitle(course === undefined ? 'Курс' : `Курс: ${course.title}`);

  if (isAwaitingData([courseQuery, scenariosQuery, attemptsQuery])) {
    return <LoadingText />;
  }

  if (course === undefined || progress === null) {
    return (
      <NotFound
        title="Курс не найден"
        back={{ to: ROUTES.COURSES, label: 'К курсам' }}
      />
    );
  }

  const summaries = new Map(
    (scenarios ?? []).map((scenario) => [scenario.id, scenario])
  );
  const next = nextToPlay(course.scenarioIds, progress.statuses);

  return (
    <Page>
      <PageHeader kicker="Курс" title={course.title}>
        <MutedText>{course.description}</MutedText>
      </PageHeader>
      <Progress>
        {progress.completed
          ? 'Курс пройден: все сценарии зачтены'
          : `Зачтено ${progress.passed} из ${progress.total}`}
      </Progress>
      <PageList aria-label="Сценарии курса">
        {course.scenarioIds.map((scenarioId, index) => {
          const scenario = summaries.get(scenarioId);
          if (scenario === undefined) return null;
          return (
            <CourseScenario
              key={scenarioId}
              position={index + 1}
              scenario={scenario}
              status={progress.statuses[scenarioId]}
              attempts={attemptsOf(attempts, scenarioId)}
              courseId={course.id}
              primary={scenarioId === next}
            />
          );
        })}
      </PageList>
      <PageActions>
        <ButtonLink to={ROUTES.COURSES} variant={ButtonVariant.Secondary}>
          ◂ К курсам
        </ButtonLink>
      </PageActions>
    </Page>
  );
};
