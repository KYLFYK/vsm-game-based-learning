import { ButtonLink } from '@/components/button';
import { CatalogCard, CatalogGrid } from '@/components/catalog-card';
import { LoadingText, MutedText } from '@/components/muted-text';
import { useGetAttemptsQuery, useGetCoursesQuery } from '@/store';
import { courseLink, courseProgress } from '@/utils';

export const CourseList = () => {
  const coursesQuery = useGetCoursesQuery();
  const attemptsQuery = useGetAttemptsQuery({});
  const courses = coursesQuery.currentData;

  if (coursesQuery.isLoading || attemptsQuery.isLoading) {
    return <LoadingText />;
  }
  if (courses === undefined) {
    return <MutedText>Не удалось загрузить курсы</MutedText>;
  }
  if (courses.length === 0) return <MutedText>Курсов пока нет</MutedText>;

  // Без истории попыток (хранилище недоступно) курсы всё равно показываются
  const attempts = attemptsQuery.currentData ?? [];

  return (
    <CatalogGrid>
      {courses.map((course) => {
        const progress = courseProgress(course, attempts);
        return (
          <CatalogCard
            key={course.id}
            title={course.title}
            heading="h2"
            description={course.description}
            meta={
              progress.completed
                ? 'Курс пройден'
                : `Зачтено ${progress.passed} из ${progress.total}`
            }
            action={<ButtonLink to={courseLink(course.id)}>Открыть</ButtonLink>}
          />
        );
      })}
    </CatalogGrid>
  );
};
