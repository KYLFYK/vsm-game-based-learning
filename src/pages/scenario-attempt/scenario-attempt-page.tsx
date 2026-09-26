import { Link } from 'react-router';

import { styled } from 'styled-components';

import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const Text = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ScenarioAttemptPage = () => {
  useDocumentTitle('Отчёт о попытке');

  return (
    <>
      <Title>Отчёт о попытке</Title>
      <Text>Попытка сохранена. Разбор решений появится здесь.</Text>
      <Link to={ROUTES.HOME}>К сценариям</Link>
    </>
  );
};
