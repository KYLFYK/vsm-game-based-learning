import { useMemo } from 'react';
import { useParams } from 'react-router';

import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';
import {
  useGetAttemptsQuery,
  useGetCourseQuery,
  useGetScenariosQuery,
} from '@/store';
import { attemptsOf, courseProgress } from '@/utils';

import { CourseScenario } from './course-scenario';
import { nextToPlay } from './course-view-model';
import {
  Actions,
  Header,
  Kicker,
  List,
  Muted,
  Progress,
  Root,
  Title,
} from './course-view.styles';

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

  const isLoading = [courseQuery, scenariosQuery, attemptsQuery].some(
    (query) => query.isFetching && query.currentData === undefined
  );

  if (isLoading) return <Muted>Загрузка…</Muted>;

  if (course === undefined || progress === null) {
    return (
      <Root>
        <Title>Курс не найден</Title>
        <Actions>
          <ButtonLink
            to={ROUTES.COURSES}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Md}
          >
            К курсам
          </ButtonLink>
        </Actions>
      </Root>
    );
  }

  const summaries = new Map(
    (scenarios ?? []).map((scenario) => [scenario.id, scenario])
  );
  const next = nextToPlay(course.scenarioIds, progress.statuses);

  return (
    <Root>
      <Header>
        <Kicker>Курс</Kicker>
        <Title>{course.title}</Title>
        <Muted>{course.description}</Muted>
      </Header>
      <Progress>
        {progress.completed
          ? 'Курс пройден: все сценарии зачтены'
          : `Зачтено ${progress.passed} из ${progress.total}`}
      </Progress>
      <List aria-label="Сценарии курса">
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
      </List>
      <Actions>
        <ButtonLink
          to={ROUTES.COURSES}
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Md}
        >
          ◂ К курсам
        </ButtonLink>
      </Actions>
    </Root>
  );
};
