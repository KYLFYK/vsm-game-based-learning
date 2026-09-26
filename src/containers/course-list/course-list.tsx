import { styled } from 'styled-components';

import { ButtonLink } from '@/components/button';
import { useGetAttemptsQuery, useGetCoursesQuery } from '@/store';
import { courseLink, courseProgress } from '@/utils';

const Grid = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: ${({ theme }) => theme.stage.cardWidth};
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyLg};
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.cardTitle};
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Meta = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  font-weight: 800;
`;

const Status = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CourseList = () => {
  const coursesQuery = useGetCoursesQuery();
  const attemptsQuery = useGetAttemptsQuery({});
  const courses = coursesQuery.currentData;

  if (coursesQuery.isLoading || attemptsQuery.isLoading) {
    return <Status>Загрузка…</Status>;
  }
  if (courses === undefined) return <Status>Не удалось загрузить курсы</Status>;
  if (courses.length === 0) return <Status>Курсов пока нет</Status>;

  // Без истории попыток (хранилище недоступно) курсы всё равно показываются
  const attempts = attemptsQuery.currentData ?? [];

  return (
    <Grid>
      {courses.map((course) => {
        const progress = courseProgress(course, attempts);
        return (
          <Card key={course.id}>
            <Title>{course.title}</Title>
            <Description>{course.description}</Description>
            <Footer>
              <Meta>
                {progress.completed
                  ? 'Курс пройден'
                  : `Зачтено ${progress.passed} из ${progress.total}`}
              </Meta>
              <ButtonLink to={courseLink(course.id)}>Открыть</ButtonLink>
            </Footer>
          </Card>
        );
      })}
    </Grid>
  );
};
