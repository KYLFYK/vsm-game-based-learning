import { generatePath } from 'react-router';

import { styled } from 'styled-components';

import { ButtonLink } from '@/components/button';
import { ROUTES } from '@/constants/routes';
import { TOPICS } from '@/constants/topics';
import { useGetScenariosQuery } from '@/store';
import { formatRemaining } from '@/utils';

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

const Title = styled.h3`
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

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tag = styled.li`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.chipBg};
  border: ${({ theme }) => theme.borders.inkThin};
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

export const ScenarioCatalog = () => {
  const { data: scenarios, isLoading } = useGetScenariosQuery();

  if (isLoading) return <Status>Загрузка…</Status>;
  if (scenarios === undefined)
    return <Status>Не удалось загрузить сценарии</Status>;

  return (
    <Grid>
      {scenarios.map((scenario) => (
        <Card key={scenario.id}>
          <Title>{scenario.title}</Title>
          <Description>{scenario.description}</Description>
          <Tags>
            {scenario.topics.map((topic) => (
              <Tag key={topic}>{TOPICS[topic].label}</Tag>
            ))}
          </Tags>
          <Footer>
            <Meta>
              ~{scenario.estimatedMinutes} мин
              {scenario.timeLimitSec !== undefined &&
                ` · ${formatRemaining(scenario.timeLimitSec * 1000)}`}
            </Meta>
            <ButtonLink
              to={generatePath(ROUTES.SCENARIO, { scenarioId: scenario.id })}
            >
              Играть
            </ButtonLink>
          </Footer>
        </Card>
      ))}
    </Grid>
  );
};
