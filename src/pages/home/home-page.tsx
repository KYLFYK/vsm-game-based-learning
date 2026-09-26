import { styled } from 'styled-components';

import { ButtonLink, ButtonVariant } from '@/components/button';
import { APP_NAME } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { ScenarioCatalog } from '@/containers/scenario-catalog';
import { useDocumentTitle } from '@/hooks';

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const Text = styled.p`
  max-width: 640px;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CoursesLink = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  margin: ${({ theme }) => `${theme.spacing.xl} 0 ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const HomePage = () => {
  useDocumentTitle('Главная');

  return (
    <>
      <Title>{APP_NAME}</Title>
      <Text>
        Платформа игрового обучения для сотрудников компании ВСМ, в первую
        очередь проводников: курсы и ситуации в игровой форме, достижения и
        сравнение результатов с коллегами.
      </Text>
      <CoursesLink>
        <ButtonLink to={ROUTES.COURSES} variant={ButtonVariant.Secondary}>
          Курсы ▸
        </ButtonLink>
      </CoursesLink>
      <SectionTitle>Сценарии</SectionTitle>
      <ScenarioCatalog />
    </>
  );
};
