import { styled } from 'styled-components';

import { CourseList } from '@/containers/course-list';
import { useDocumentTitle } from '@/hooks';

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

export const CoursesPage = () => {
  useDocumentTitle('Курсы');

  return (
    <>
      <Title>Курсы</Title>
      <CourseList />
    </>
  );
};
