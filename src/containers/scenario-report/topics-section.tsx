import { styled } from 'styled-components';

import type { Report } from '@/types';

import {
  cardStyles,
  List,
  Section,
  SectionTitle,
} from './scenario-report.styles';

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

const Mark = styled.span<{ $weak: boolean }>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  color: ${({ $weak, theme }) =>
    $weak ? theme.colors.onAccent : theme.colors.ink};
  background: ${({ $weak, theme }) =>
    $weak ? theme.colors.accentRed : theme.colors.chipBg};
  border: ${({ theme }) => theme.borders.inkThin};
`;

export const TopicsSection = ({ topics }: { topics: Report.Topic[] }) => {
  if (topics.length === 0) return null;
  return (
    <Section aria-labelledby="report-topics">
      <SectionTitle id="report-topics">Темы</SectionTitle>
      <List>
        {topics.map((topic) => (
          <Row key={topic.id}>
            <Label>{topic.label}</Label>
            <Counts>
              лучших {topic.best} · допустимых {topic.ok} · ошибок {topic.bad}
            </Counts>
            <Mark $weak={topic.weak}>
              {topic.weak ? '✗ Стоит подтянуть' : '✓ Сильная сторона'}
            </Mark>
          </Row>
        ))}
      </List>
    </Section>
  );
};
