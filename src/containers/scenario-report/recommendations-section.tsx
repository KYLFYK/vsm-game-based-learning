import { styled } from 'styled-components';

import { ButtonLink, ButtonVariant } from '@/components/button';
import { CardTitle } from '@/components/catalog-card';
import { PageList } from '@/components/page';
import { TagList } from '@/components/tag';
import { cardStyles } from '@/styles/mixins';
import type { Report } from '@/types';
import { scenarioLink, topicLabel } from '@/utils';

import { Section, SectionTitle } from './scenario-report.styles';

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
      <PageList>
        {recommendations.map((item) => (
          <Item key={item.scenarioId}>
            <Body>
              <CardTitle as="h3">{item.title}</CardTitle>
              <TagList tags={item.topics.map(topicLabel)} aria-label="Темы" />
            </Body>
            <ButtonLink
              to={scenarioLink(item.scenarioId)}
              variant={ButtonVariant.Secondary}
            >
              Играть
            </ButtonLink>
          </Item>
        ))}
      </PageList>
    </Section>
  );
};
