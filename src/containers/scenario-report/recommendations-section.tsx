import { styled } from 'styled-components';

import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { TOPICS } from '@/constants/topics';
import type { Report } from '@/types';

import { scenarioLink } from './scenario-link';
import {
  cardStyles,
  List,
  Section,
  SectionTitle,
  Tag,
  Tags,
} from './scenario-report.styles';

const Item = styled.li`
  ${cardStyles}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.cardTitle};
  font-weight: 800;
  text-transform: uppercase;
`;

interface RecommendationsSectionProps {
  recommendations: Report.Recommendation[];
}

// Рекомендации — из всего каталога, не только курса, поэтому без `course`
export const RecommendationsSection = ({
  recommendations,
}: RecommendationsSectionProps) => {
  if (recommendations.length === 0) return null;
  return (
    <Section aria-labelledby="report-recommendations">
      <SectionTitle id="report-recommendations">Рекомендации</SectionTitle>
      <List>
        {recommendations.map((item) => (
          <Item key={item.scenarioId}>
            <Body>
              <Title>{item.title}</Title>
              <Tags aria-label="Темы">
                {item.topics.map((topic) => (
                  <Tag key={topic}>{TOPICS[topic]?.label ?? topic}</Tag>
                ))}
              </Tags>
            </Body>
            <ButtonLink
              to={scenarioLink(item.scenarioId)}
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Md}
            >
              Играть
            </ButtonLink>
          </Item>
        ))}
      </List>
    </Section>
  );
};
