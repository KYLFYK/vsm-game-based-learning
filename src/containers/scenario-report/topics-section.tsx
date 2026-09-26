import { styled } from 'styled-components';

import { PageList } from '@/components/page';
import { Tag, TagTone } from '@/components/tag';
import { cardStyles } from '@/styles/mixins';
import type { Report } from '@/types';

import { Section, SectionTitle } from './scenario-report.styles';

const Row = styled.li`
  ${cardStyles}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
`;

const Label = styled.span`
  font-weight: 700;
`;

const Counts = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const TopicsSection = ({ topics }: { topics: Report.Topic[] }) => {
  if (topics.length === 0) return null;
  return (
    <Section aria-labelledby="report-topics">
      <SectionTitle id="report-topics">Темы</SectionTitle>
      <PageList>
        {topics.map((topic) => (
          <Row key={topic.id}>
            <Label>{topic.label}</Label>
            <Counts>
              лучших {topic.best} · допустимых {topic.ok} · ошибок {topic.bad}
            </Counts>
            <Tag $tone={topic.weak ? TagTone.Red : TagTone.Neutral}>
              {topic.weak ? '✗ Стоит подтянуть' : '✓ Сильная сторона'}
            </Tag>
          </Row>
        ))}
      </PageList>
    </Section>
  );
};
